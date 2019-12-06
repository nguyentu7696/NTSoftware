import { Component, OnInit, ViewChild } from "@angular/core";
import {
  PageEvent,
  MatTableDataSource,
  MatPaginator,
  MatDialog
} from "@angular/material";
import { FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { CommonService } from "src/app/common/method";
import { ActivatedRoute } from "@angular/router";
import { CompanyAPIs, ContractAPIs } from "src/app/constants/api";
import * as moment from "moment";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import { SignalRService } from "src/app/common/services/signalR.service";
import { LoginModel } from "src/app/shared/model/loginModel";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  pageEvent: PageEvent;
  params: any = { pageIndex: 0, pageSize: 5 };
  totalRow: number = 0;
  onRequest = false;
  canPayed = false;
  total = 0;
  companyId = -1;
  statusContract = "";
  companyName = "";
  months = [
    { name: "Tháng 1", value: 1 },
    { name: "Tháng 2", value: 2 },
    { name: "Tháng 3", value: 3 },
    { name: "Tháng 4", value: 4 },
    { name: "Tháng 5", value: 5 },
    { name: "Tháng 6", value: 6 },
    { name: "Tháng 7", value: 7 },
    { name: "Tháng 8", value: 8 },
    { name: "Tháng 9", value: 9 },
    { name: "Tháng 10", value: 10 },
    { name: "Tháng 11", value: 11 },
    { name: "Tháng 12", value: 12 }
  ];
  years = [];
  month: FormControl;
  year: FormControl;
  isPayed: FormControl;
  displayedColumns: string[] = [
    "Name",
    "TimeLogIn",
    "TimeLogOut",
    "TimeUse",
    "Pay",
    "Status"
  ];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private appService: AppService,
    private commonService: CommonService,
    private activeRoute: ActivatedRoute,
    public signalRService: SignalRService
  ) {
    translate.setDefaultLang("vi");

    this.companyId = JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId;
    this.params.companyId = this.companyId;
    this.initForm();
  }
  initForm() {
    for (
      let index = new Date().getFullYear() - 10;
      index < new Date().getFullYear() + 10;
      index++
    ) {
      this.years.push({ name: `Năm ${index}`, value: index });
    }
    this.month = new FormControl(new Date().getMonth() + 1);
    this.year = new FormControl(new Date().getFullYear());
    this.isPayed = new FormControl("0");
  }
  onChangePageSize(e) {
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onSearch();
  }
  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addAuthentUserListener(this.onGetDataSignR);
    this.translate.get("admin.lstCompany.nextPage").subscribe(res => {
      this.paginator._intl.nextPageLabel = res;
    });
    this.translate.get("admin.lstCompany.prevPage").subscribe(res => {
      this.paginator._intl.previousPageLabel = res;
    });
    this.translate.get("admin.lstCompany.numberPerPage").subscribe(res => {
      this.paginator._intl.itemsPerPageLabel = res;
    });
    this.onGetCurrentContract();
    this.onSearch();
  }
  onGetDataSignR = (data: LoginModel): void => {
    if (data.companyId == this.companyId) {
      this.appService
        .get(CompanyAPIs.GET_LOG_USE, () => {}, {
          ...this.params,
          month: this.month.value,
          year: this.year.value,
          isPayed: this.isPayed.value == "1"
        })
        .subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.dataSource.data = res.data.results;
            this.totalRow = res.data.rowCount;
            this.params.pageSize = res.data.pageSize;
            this.params.pageIndex = res.data.currentPage;
            this.checkCanPay();
          } else {
          }
        });
      this.onGetTotal();
    }
  };
  onSearch() {
    this.toggleRequest();
    this.appService
      .get(CompanyAPIs.GET_LOG_USE, this.toggleRequest, {
        ...this.params,
        month: this.month.value,
        year: this.year.value,
        isPayed: this.isPayed.value == "1"
      })
      .subscribe((res: any) => {
        this.toggleRequest();
        console.log(res);
        if (res.success) {
          this.dataSource.data = res.data.results;
          this.totalRow = res.data.rowCount;
          this.params.pageSize = res.data.pageSize;
          this.params.pageIndex = res.data.currentPage;
          this.checkCanPay();
        } else {
          this.commonService.showAlert(res.message, "warning", "Cảnh báo");
        }
      });
    this.onGetTotal();
  }
  onGetTotal() {
    this.appService
      .get(CompanyAPIs.GET_TOTAL, () => {}, {
        month: this.month.value,
        year: this.year.value,
        companyId: this.companyId,
        isPayed: this.isPayed.value == "1"
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.total = res.data;
        } else {
        }
      });
  }
  onGetCurrentContract() {
    this.appService
      .get(ContractAPIs.GET_CURRENT, () => {}, {
        companyId: this.companyId
      })
      .subscribe((res: any) => {
        console.log("sss", res);
        if (res.success) {
          this.statusContract = res.data.status;
        }
      });
  }
  toggleRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
  convertTime(date: any) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  }
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + " giờ " : "";
    var mDisplay = m > 0 ? m + " phút " : "";
    var sDisplay = s > 0 ? s + " giây " : "";
    return hDisplay + mDisplay + sDisplay;
  }
  checkCanPay() {
    if (this.statusContract == "Expired") {
      this.canPayed = true;
      return;
    }
    if (this.statusContract == "New") {
      this.canPayed = false;
      return;
    }
    if (
      this.isPayed.value === "0" &&
      new Date().getFullYear() >= this.year.value &&
      new Date().getMonth() + 1 > this.month.value &&
      this.dataSource.data.length > 0
    ) {
      this.canPayed = true;
    } else {
      this.canPayed = false;
    }
  }
}
