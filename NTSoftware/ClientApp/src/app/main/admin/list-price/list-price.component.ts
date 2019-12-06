import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
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
import { PriceContractAPIs } from "src/app/constants/api";
import { StateMatcher, EmptyOrNull } from "src/app/shared/validate";

@Component({
  selector: "app-list-price",
  templateUrl: "./list-price.component.html",
  styleUrls: ["./list-price.component.scss"]
})
export class ListPriceComponent implements OnInit {
  pageEvent: PageEvent;
  totalRow: number = 0;
  params: any = { pageSize: 5, pageIndex: 1 };
  onRequest = false;
  displayedColumns: string[] = [
    "Order",
    "NameOption",
    "Description",
    "Price",
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
    this.translate.get("admin.lstPrice.nextPage").subscribe(res => {
      this.paginator._intl.nextPageLabel = res;
    });
    this.translate.get("admin.lstPrice.prevPage").subscribe(res => {
      this.paginator._intl.previousPageLabel = res;
    });
    this.translate.get("admin.lstPrice.numberPerPage").subscribe(res => {
      this.paginator._intl.itemsPerPageLabel = res;
    });
    // this.params.pageIndex = 1;
    // this.params.pageSize =5;
    this.onSearch();
  }
  deleteItem(price: any) {
    const dialogRef = this.dialog.open(DialogDelete, {
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
  onSearch() {
    this.toggleOnRequest();
    console.log(this.params);
    setTimeout(() => {
      this.appService
        .get(PriceContractAPIs.GET_PAGING, this.toggleOnRequest, this.params)
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
  onChangePageSize(e) {
    console.log(e);
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onSearch();
  }
  onAddOrUpdate(priceContract: any) {
    const dialogRef = this.dialog.open(DialogAddUpdate, {
      width: "650px",
      data: priceContract
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === true) {
        this.commonService.showAlert(
          priceContract === null ? "Thêm thành công" : "Cập nhật thành công",
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
  templateUrl: "./dialog-confirm.component.html"
})
export class DialogDelete {
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    this.appService
      .delete(PriceContractAPIs.DELETE, this.closeModal, { id: this.data.id })
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
  selector: "dialog-add-update",
  templateUrl: "./modal-add-update.html"
})
export class DialogAddUpdate {
  onSubmit: boolean = false;
  lstFunction: any;
  formPrice: FormGroup;
  lstFunctionSelected: Array<any> = [];
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogAddUpdate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");

    this.lstFunction = [
      {
        name: "Quản lý phòng ban",
        url: "/company/department-manager/department-list",
        iconName: "npm-outline"
      },
      {
        name: "Quản lý dự án",
        url: "/company/project-manager/project-list",
        iconName: "book-outline"
      }
    ];
    this.initialForm();
  }
  initialForm() {
    this.formPrice = new FormGroup(
      {
        optionName: new FormControl(
          this.data === null
            ? ""
            : this.data.optionName
            ? this.data.optionName
            : "",
          [Validators.required, EmptyOrNull.SpaceValidator]
        ),
        lstFunction: new FormControl(
          this.data === null
            ? []
            : this.data.lstFunction
            ? this.data.lstFunction
            : []
        ),
        description: new FormControl(
          this.data === null
            ? ""
            : this.data.description
            ? this.data.description
            : "",
          [Validators.required, EmptyOrNull.SpaceValidator]
        ),
        price: new FormControl(
          this.data === null ? "" : this.data.price ? this.data.price : "",
          [
            Validators.required,
            Validators.pattern("^[1-9][0-9]*$"),
            EmptyOrNull.SpaceValidator
          ]
        )
      },
      {}
    );
  }

  matcher = new StateMatcher();
  onChangeChecked(e, item) {
    if (e.checked) {
      this.formPrice.controls.lstFunction.value.push(item);
    } else {
      if (
        this.formPrice.controls.lstFunction.value.findIndex(
          x =>
            x.url == item.url &&
            x.name == item.name &&
            x.iconName == item.iconName
        ) >= 0
      ) {
        this.formPrice.controls.lstFunction.setValue(
          this.formPrice.controls.lstFunction.value.filter(
            x => x.url != item.url
          )
        );
      }
    }
    console.log(this.formPrice.value);
  }
  onSetChecked(item) {
    return (
      this.formPrice.controls.lstFunction.value.findIndex(
        x =>
          x.url == item.url &&
          x.name == item.name &&
          x.iconName == item.iconName
      ) >= 0
    );
  }
  onAddUpdate(): void {
    if (!this.formPrice.invalid) {
      this.toggleForm(true);
      this.formPrice.disable();
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
      .put(PriceContractAPIs.UPDATE, this.closeModal, {
        ...this.formPrice.value,
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
    this.appService
      .post(PriceContractAPIs.ADD, this.closeModal, {
        ...this.formPrice.value
      })
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
      this.formPrice.disable();
      this.onSubmit = true;
    } else {
      this.formPrice.enable();
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
