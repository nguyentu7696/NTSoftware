import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { CommonService } from "src/app/common/method";
import { AppService } from "src/app/common/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import {
  MatDialog,
  MatTableDataSource,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { RuleAPIs } from "src/app/constants/api";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StateMatcher, EmptyOrNull } from "src/app/shared/validate";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import * as moment from "moment";
@Component({
  selector: "app-list-rule",
  templateUrl: "./list-rule.component.html",
  styleUrls: ["./list-rule.component.scss"]
})
export class ListRuleComponent implements OnInit {
  pageEvent: PageEvent;
  totalRow: number = 0;
  params: any = { pageSize: 5, pageIndex: 1 };
  onRequest = false;
  displayedColumns: string[] = ["Order", "TypeRule", "Date", "Function"];
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
    this.translate.get("admin.lstRule.nextPage").subscribe(res => {
      this.paginator._intl.nextPageLabel = res;
    });
    this.translate.get("admin.lstRule.prevPage").subscribe(res => {
      this.paginator._intl.previousPageLabel = res;
    });
    this.translate.get("admin.lstRule.numberPerPage").subscribe(res => {
      this.paginator._intl.itemsPerPageLabel = res;
    });
    this.onSearch();
  }
  onConvertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }
  onSearch() {
    this.toggleOnRequest();
    console.log(this.params);
    setTimeout(() => {
      this.appService
        .get(RuleAPIs.GET_PAGING, this.toggleOnRequest, this.params)
        .subscribe((res: any) => {
          this.toggleOnRequest();
          console.log(res);
          if (res.success) {
            this.dataSource.data = res.data.results;
            this.dataSource.data.length = res.data.rowCount;
            this.totalRow = res.data.rowCount;
            this.params.pageSize = res.data.pageSize;
            this.params.pageIndex = res.data.currentPage;
          } else {
            this.commonService.showAlert(res.message, "warning", "Cảnh báo");
          }
        });
    }, 500);
  }
  toggleOnRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
  onShowDetail(rule: any) {
    const dialogRef = this.dialog.open(DialogDetailRule, {
      width: "750px",
      data: rule
    });
  }
  deleteItem(rule: any) {
    const dialogRef = this.dialog.open(DialogDeleteRule, {
      width: "350px",
      data: rule
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === true) {
        this.commonService.showAlert("Xóa thành công", "success", "Thông báo");
        this.onSearch();
      }
    });
  }
  onChangePageSize(e) {
    console.log(e);
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onSearch();
  }
  onAddOrUpdate(rule: any) {
    const dialogRef = this.dialog.open(DialogAddUpdateRule, {
      width: "750px",
      data: rule
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === true) {
        this.commonService.showAlert(
          rule === null ? "Thêm thành công" : "Cập nhật thành công",
          "success",
          "Thông báo"
        );
        this.onSearch();
      }
    });
  }
}

@Component({
  selector: "dialog-confirm",
  templateUrl: "./dialog-confirm-component.html"
})
export class DialogDeleteRule {
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDeleteRule>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    this.appService
      .delete(RuleAPIs.DELETE, this.closeModal, { id: this.data.id })
      .subscribe((res: any) => {
        if (res.success) {
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "warning", "Cảnh báo");
          this.dialogRef.close(false);
        }
      });
  }
  closeModal = (): void => {
    this.dialogRef.close(false);
  };
}
@Component({
  selector: "dialog-add-update-rule",
  templateUrl: "./modal-add-update.html"
})
export class DialogAddUpdateRule {
  onSubmit: boolean = false;
  currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogAddUpdateRule>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");

    console.log(this.currentUser);
  }
  formRule = new FormGroup(
    {
      content: new FormControl(
        this.data === null ? "" : this.data.content ? this.data.content : "",
        [Validators.required, EmptyOrNull.SpaceValidator]
      ),
      typeContractName: new FormControl(
        this.data === null
          ? ""
          : this.data.typeContractName
          ? this.data.typeContractName
          : "",
        [Validators.required, EmptyOrNull.SpaceValidator]
      ),
      companyId: new FormControl(parseInt(this.currentUser.CompanyId), [
        Validators.required
      ])
    },
    {}
  );
  matcher = new StateMatcher();
  onAddUpdate(): void {
    if (!this.formRule.invalid) {
      this.toggleForm(true);
      this.formRule.disable();
      setTimeout(() => {
        if (this.data === null) {
          this.onAdd();
        } else {
          this.onUpdate();
        }
      }, 500);
    }
  }
  onUpdate() {
    this.appService
      .put(RuleAPIs.UPDATE, this.closeModal, {
        ...this.formRule.value,
        id: this.data.id
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.toggleForm(false);
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "warning", "Cảnh báo");
          this.dialogRef.close(false);
          this.toggleForm(false);
        }
      });
  }
  onAdd() {
    console.log(this.formRule.value);
    this.appService
      .post(RuleAPIs.ADD, this.closeModal, this.formRule.value)
      .subscribe((res: any) => {
        if (res.success) {
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "warning", "Cảnh báo");
          this.dialogRef.close(false);
        }
      });
  }
  closeModal = (): void => {
    this.dialogRef.close(false);
    this.toggleForm(false);
  };
  toggleForm(isSubmit: boolean) {
    if (isSubmit) {
      this.formRule.disable();
      this.onSubmit = true;
    } else {
      this.formRule.enable();
      this.onSubmit = false;
    }
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

@Component({
  selector: "dialog-detail-rule",
  templateUrl: "./modal-detail-rule.html"
})
export class DialogDetailRule {
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDetailRule>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }
}
