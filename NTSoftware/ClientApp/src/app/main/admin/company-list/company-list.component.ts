import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import {} from "@nebular/theme";
import { MatTableDataSource } from "@angular/material/table";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { AppService } from "src/app/common/services/app.service";
import { CommonService } from "src/app/common/method";
import { CompanyAPIs } from "src/app/constants/api";
import { DialogDetailContract } from "../detail-company/detail-company.component";

@Component({
  selector: "app-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.scss"]
})
export class CompanyListComponent implements OnInit {
  pageEvent: PageEvent;
  params: any = { pageIndex: 0, pageSize: 5 };
  totalRow: number = 0;
  onRequest = false;
  displayedColumns: string[] = [
    "CompanyName",
    "PhoneNumber",
    "Address",
    "RepresentativeName",
    "PositionRepresentative",
    "ContractNumber",
    "Function"
  ];
  dataSource = new MatTableDataSource([]);

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private appService: AppService,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.translate.get("admin.lstCompany.nextPage").subscribe(res => {
      this.paginator._intl.nextPageLabel = res;
    });
    this.translate.get("admin.lstCompany.prevPage").subscribe(res => {
      this.paginator._intl.previousPageLabel = res;
    });
    this.translate.get("admin.lstCompany.numberPerPage").subscribe(res => {
      this.paginator._intl.itemsPerPageLabel = res;
    });
    this.onSearch();
  }

  editItem(id: number) {
    alert(id);
  }

  deleteItem(company: any) {
    const dialogRef = this.dialog.open(DialogConfirm, {
      width: "350px",
      data: company
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.onSearch();
      }
    });
  }
  onSearch() {
    this.toggleOnRequest();
    setTimeout(() => {
      this.appService
        .get("/api/Company/GetPaging", this.toggleOnRequest, this.params)
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
    }, 1000);
  }
  toggleOnRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
  onChangePageSize(e) {
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onSearch();
  }
  onShowDetailContract(contractId: number) {
    const dialogRef = this.dialog.open(DialogDetailContract, {
      width: "800px",
      height: "500px",
      data: contractId
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}

@Component({
  selector: "dialog-confirm.component",
  templateUrl: "./dialog-confirm.component.html"
})
export class DialogConfirm {
  onRequest: boolean = false;
  constructor(
    private appService: AppService,
    public translate: TranslateService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    console.log(this.data);
    this.dialogRef.disableClose = true;
    this.toggleOnRequest();
    this.appService
      .delete(CompanyAPIs.DELETE, this.toggleOnRequest, {
        companyId: this.data.id
      })
      .subscribe((res: any) => {
        this.toggleOnRequest();
        this.dialogRef.disableClose = false;
        if (res.success) {
          this.commonService.showAlert(
            "Xóa thành công",
            "success",
            "Thông báo"
          );
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
          this.dialogRef.close(false);
        }
      });
  }
  toggleOnRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
}
