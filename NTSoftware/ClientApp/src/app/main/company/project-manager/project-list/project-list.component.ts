import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
  PageEvent,
  MatTableDataSource,
  MatDialog,
  MatPaginator,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { CommonService } from "src/app/common/method";
import { ProjectAPIs } from "src/app/constants/api";
import * as moment from 'moment'
@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"]
})
export class ProjectListComponent implements OnInit {
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
  ];
  dataSource = new MatTableDataSource([]);

  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
    this.onCheckPermission()
  }
  onCheckPermission() {
    this.appService
      .get(ProjectAPIs.CHECK_PERMISSION, () => {}, {
        companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId
      })
      .subscribe((res: any) => {
        
      });
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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
    }, 1000);
  }

  toggleOnRequest = (): void => {
    this.onRequest = !this.onRequest;
  };

  convertDateTime(date:any){
    return moment(date).format("DD/MM/YYYY")
  }
  onChangePageSize(e) {
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onSearch();
  }

  deleteItem(price: any) {
    const dialogRef = this.dialog.open(DialogDeleteProject, {
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
  selector: "dialog-delete-project",
  templateUrl: "./confirm-delete-project.html"
})
export class DialogDeleteProject {
  onRequest: boolean = false;
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDeleteProject>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    const companyId = JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId;
    this.dialogRef.disableClose = true;
    this.onRequest = true;
    this.appService
      .delete(ProjectAPIs.DELETE, this.closeModal, {
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
