import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AppService } from "../../../../common/services/app.service";
import { CommonService } from "../../../../common/method";
import { TranslateService } from "@ngx-translate/core";
import { CURRENT_USER } from "../../../../constants/localStorageKey";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from "@angular/material/dialog";
import { DepartmentAPIs } from "../../../../constants/api";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"]
})
export class DepartmentListComponent implements OnInit {
  pageEvent: PageEvent;
  params: any = {
    companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId,
    pageIndex: 0,
    pageSize: 5
  };
  totalRow: number = 0;
  onRequest = false;
  displayedColumns: string[] = [
    "DepartmentName",
    "employeeCount",
    "ManagerName",
    "Description",
    "Function"
  ];
  dataSource = new MatTableDataSource([]);

  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
    this.onCheckPermission();
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  onCheckPermission() {
    this.appService
      .get(DepartmentAPIs.CHECK_PERMISSION, () => {}, {
        companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId
      })
      .subscribe((res: any) => {
        
      });
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
    setTimeout(() => {
      this.appService
        .get("/api/Department/GetPaging", this.toggleOnRequest, this.params)
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

  deleteItem(price: any) {
    const dialogRef = this.dialog.open(DialogDeleteDepartment, {
      width: "350px",
      data: price
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === true) {
        this.commonService.showAlert("Xóa thành công", "success", "Thông báo");
        this.onSearch();
      }
    });
  }
}

@Component({
  selector: "dialog-delete-department",
  templateUrl: "./dialog-delete-department.component.html"
})
export class DialogDeleteDepartment {
  onRequest: boolean = false;
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDeleteDepartment>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    const companyId = JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId;
    this.dialogRef.disableClose = true;
    this.onRequest = true;
    this.appService
      .delete(DepartmentAPIs.DELETE, this.closeModal, {
        id: this.data.id,
        companyId: companyId
      })
      .subscribe((res: any) => {
        this.dialogRef.disableClose = false;
        this.onRequest = false;
        if (res.success) {
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "warning", "Cảnh báo");
          this.dialogRef.close(false);
        }
      });
  }

  closeModal = (): void => {
    this.dialogRef.disableClose = false;
    this.dialogRef.close(false);
  };
}
