import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CURRENT_USER} from "../../../../constants/localStorageKey";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {AppService} from "../../../../common/services/app.service";
import {CommonService} from "../../../../common/method";
import {ProjectAPIs} from "../../../../constants/api";
import * as moment from "moment";

@Component({
  selector: 'app-project-emp-lst',
  templateUrl: './project-emp-lst.component.html',
  styleUrls: ['./project-emp-lst.component.scss']
})
export class ProjectEmpLstComponent implements OnInit {
  pageEvent: PageEvent;
  params: any = {
    companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId,
    pageIndex: 0,
    pageSize: 5
  };
  totalRow: number = 0;
  onRequest = false;
  displayedColumns: string[] = [
    "ProjectName",
    "StartDate",
    "EndDate",
    "ManagerName",
    "EmployeeCount",
    "Function"
  ]

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
  }

  ngOnInit() {
    this.translate
      .get("companyModule.lstDepartment.nextPage")
      .subscribe(res => {
        this.paginator._intl.nextPageLabel = res;
      });
    this.translate
      .get("companyModule.lstDepartment.prevPage")
      .subscribe(res => {
        this.paginator._intl.previousPageLabel = res;
      });
    this.translate
      .get("companyModule.lstDepartment.numberPerPage")
      .subscribe(res => {
        this.paginator._intl.itemsPerPageLabel = res;
      });
    this.onSearch();
  }

  private onSearch() {
    this.toggleOnRequest();
    /*setTimeout(() => {
      this.appService
        .get(ProjectAPIs.GET_PAGING, this.toggleOnRequest, this.params)
        .subscribe((res: any) => {
          this.toggleOnRequest();
          console.log(res);
          if (res.success) {
            this.dataSource.data = res.data.results;
            this.totalRow = res.data.rowCount;
            this.params.pageSize = res.data.pageSize;
            this.params.pageIndex = res.data.currentPage;
          } else {
            this.commonService.showAlert(res.message, "warning", "Cảnh báo");
          }
        });
    }, 1000);*/
  }

  toggleOnRequest = (): void => {
    this.onRequest = !this.onRequest;
  };

  convertDateTime(date: any) {
    return moment(date).format("DD/MM/YYYY")
  }

  onChangePageSize(e) {
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onSearch();
  }
}
