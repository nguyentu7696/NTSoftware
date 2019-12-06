import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { AppService } from "../../../../common/services/app.service";
import { CommonService } from "../../../../common/method";
import { DialogConfirm } from "../../../admin/company-list/company-list.component";
import { CURRENT_USER } from "../../../../constants/localStorageKey";
import { DetailUserAPIs, AccountAPIs, NotifyAPIs } from "src/app/constants/api";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"]
})
export class EmployeeListComponent implements OnInit {
  pageEvent: PageEvent;
  params: any = {
    companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId,
    pageIndex: 0,
    pageSize: 5
  };
  totalRow: number = 0;
  onRequest = false;
  displayedColumns: string[] = [
    "EmployeeName",
    "PhoneNumber",
    "Address",
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

  deleteItem(employee: any) {
    const dialogRef = this.dialog.open(DialogConfirmDeleteE, {
      width: "350px",
      data: employee
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) this.onSearch();
    });
  }
  onSearch() {
    this.toggleOnRequest();
    setTimeout(() => {
      this.appService
        .get(
          "/api/DetailUser/GetPagingByCompany",
          this.toggleOnRequest,
          this.params
        )
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
  onLockUser(employeeId) {
    this.toggleOnRequest;
    this.appService
      .put(AccountAPIs.TOGGLE_USER, this.toggleOnRequest, {
        userId: employeeId,
        isLocked: true,
        companyId: this.params.companyId
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.appService
            .post(NotifyAPIs.BLOCK_USER, () => {}, {
              companyId: this.params.companyId,
              userId: employeeId,
              message: "Bạn bị khóa tạm thời"
            })
            .subscribe((res: any) => {});
          this.commonService.showAlert("Thành công", "success", "Thông báo");
          this.onSearch();
        }
      });
  }
  onUnLockUser(employeeId) {
    this.toggleOnRequest;
    this.appService
      .put(AccountAPIs.TOGGLE_USER, this.toggleOnRequest, {
        userId: employeeId,
        isLocked: false,
        companyId: this.params.companyId
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.commonService.showAlert("Thành công", "success", "Thông báo");
          this.onSearch();
        }
      });
  }
}
@Component({
  selector: "dialog-confirm.component",
  templateUrl: "./dialog-confirm-delete-em.html"
})
export class DialogConfirmDeleteE {
  onRequest: boolean = false;
  constructor(
    private appService: AppService,
    public translate: TranslateService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogConfirmDeleteE>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    console.log(this.data);
    this.dialogRef.disableClose = true;
    this.toggleOnRequest();
    this.appService
      .delete(DetailUserAPIs.DELETE_EMPLOYEE, this.toggleOnRequest, {
        id: this.data.id
      })
      .subscribe((res: any) => {
        this.toggleOnRequest();
        this.dialogRef.disableClose = false;
        if (res.success) {
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
