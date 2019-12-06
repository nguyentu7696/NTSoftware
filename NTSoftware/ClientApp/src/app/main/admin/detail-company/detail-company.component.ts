import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  MatTableDataSource,
  MatDialog,
  PageEvent,
  MatPaginator,
  MatDialogRef,
  MAT_DIALOG_DATA,
  DateAdapter,
  MAT_DATE_FORMATS
} from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { CommonService } from "src/app/common/method";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from "@angular/forms";
import {
  passwordMatchValidator,
  StateMatcher,
  DateLessThanControl,
  DateLessThanNow
} from "src/app/shared/validate";
import {
  CompanyAPIs,
  ContractAPIs,
  PriceContractAPIs,
  RuleAPIs
} from "src/app/constants/api";
import * as moment from "moment";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import { ConfirmFinish } from "./confirm-finish.component";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "src/app/shared/validate/date.adapter";
@Component({
  selector: "app-detail-company",
  templateUrl: "./detail-company.component.html",
  styleUrls: ["./detail-company.component.scss"]
})
export class DetailCompanyComponent implements OnInit {
  pageEvent: PageEvent;
  totalRow: number = 0;
  isEdit: boolean = false;
  onGetContract: boolean = false;
  currentUser: any;
  company: any;
  params: any = { pageSize: 5, page: 1 };
  onRequest = false;
  queryCompany: number;
  formCompany: FormGroup;
  formContract: FormGroup;
  displayedColumns: string[] = [
    "Order",
    "ContractNumber",
    "StartDate",
    "EndDate",
    "Status",
    "Function"
  ];
  dataSource = new MatTableDataSource([]);
  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private appService: AppService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    if (Number(this.activeRoute.snapshot.queryParams["company"]) != NaN) {
      this.queryCompany = Number(
        this.activeRoute.snapshot.queryParams["company"]
      );
    } else {
      this.queryCompany = -1;
    }
    this.params.companyId = this.queryCompany;
    this.initialForm();
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
    this.onGetCompany();
    this.getContract();
  }
  initialForm() {
    this.formCompany = this.fb.group({
      Id: [this.queryCompany],
      companyName: ["", Validators.required],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(08|09|03|07)([0|1|2|3|4|5|6|7|8|9])+[0-9]{7,8}$"
          )
        ]
      ],
      emailRepresentative: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
          )
        ]
      ],
      representativeName: ["", Validators.required],
      positionRepresentative: ["", Validators.required],
      address: ["", Validators.required]
    });
  }
  matcher = new StateMatcher();
  onConvertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }
  onConvertStatus(status: string) {
    switch (status) {
      case "New":
        return "Mới tạo";
      case "Active":
        return "Đang chạy";
      case "Expired":
        return "Đã kết thúc";
      default:
        return "";
    }
  }
  onActiveContract(id: number) {
    this.toggleOnGetContract();
    this.appService
      .put(ContractAPIs.UPDATE, this.toggleOnGetContract, {
        companyId: this.queryCompany,
        contractId: id,
        status: 1
      })
      .subscribe((res: any) => {
        this.toggleOnGetContract();
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Cảnh báo"
          );
          this.getContract();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onShowConfirmFinish(contract: any) {
    const dialogRef = this.dialog.open(ConfirmFinish, {
      width: "450px",
      height: "250px",
      data: {
        contractId: contract.id,
        companyId: this.queryCompany,
        status: 3,
        isBreak: false,
        reasonEnd: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.getContract();
    });
  }
  onFinishContract(contract: any) {
    if (
      new Date() >= new Date(contract.startDate) &&
      new Date() < new Date(contract.endDate)
    ) {
      this.onShowConfirmFinish(contract);
      return;
    }
    this.toggleOnGetContract();
    this.appService
      .put(ContractAPIs.UPDATE, this.toggleOnGetContract, {
        contractId: contract.id,
        companyId: this.queryCompany,
        status: 3,
        isBreak: false,
        reasonEnd: "Hết hạn hợp đồng"
      })
      .subscribe((res: any) => {
        this.toggleOnGetContract();
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Cảnh báo"
          );
          this.getContract();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onUpdateCompany() {
    this.toggleRequest();
    let request = this.formCompany.value;
    request.email = this.company.email;
    this.appService
      .put(CompanyAPIs.UPDATE, this.toggleRequest, this.formCompany.value)
      .subscribe((res: any) => {
        console.log(res);
        this.toggleRequest();
        this.toggleEdit();
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Thông báo"
          );
          this.onGetCompany();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onShowDetailContract(contractId: number) {
    const dialogRef = this.dialog.open(DialogDetailContract, {
      width: "800px",
      height: "500px",
      data: contractId
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  onAddContract() {
    const dialogRef = this.dialog.open(DialogAddContract, {
      width: "750px",
      height: "150",
      data: this.queryCompany
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getContract();
      }
    });
  }
  deleteItem(contract: any) {
    const dialogRef = this.dialog.open(DialogConfirmDeleteCC, {
      width: "450px",
      height: "150",
      data: contract
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getContract();
      }
    });
  }
  onChangePageSize(e) {
    console.log(e);
    this.params.pageSize = e.pageSize;
    this.params.page = e.pageIndex + 1;
    this.getContract();
  }
  getContract() {
    this.toggleOnGetContract();
    this.appService
      .get(ContractAPIs.GET_PAGING, this.toggleOnGetContract, this.params)
      .subscribe((res: any) => {
        console.log(res);
        this.toggleOnGetContract();
        if (res.success) {
          this.totalRow = res.data.rowCount;
          this.dataSource.data = res.data.results;
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onGetCompany() {
    this.toggleRequest();
    this.appService
      .get(CompanyAPIs.GET_BY_ID, this.toggleRequest, { id: this.queryCompany })
      .subscribe((res: any) => {
        console.log(res);
        this.toggleRequest();
        if (res.success) {
          const data = res.data;
          this.company = data;
          this.formCompany.controls.companyName.setValue(data.companyName);
          this.formCompany.controls.phoneNumber.setValue(data.phoneNumber);
          this.formCompany.controls.emailRepresentative.setValue(
            data.emailRepresentative
          );
          this.formCompany.controls.representativeName.setValue(
            data.representativeName
          );
          this.formCompany.controls.positionRepresentative.setValue(
            data.positionRepresentative
          );
          this.formCompany.controls.address.setValue(data.address);
        } else {
          this.commonService.showAlert(res.message, "danger", "Thông báo");
        }
      });
  }
  toggleRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
  toggleEdit() {
    this.isEdit = !this.isEdit;
  }
  toggleOnGetContract = (): void => {
    this.onGetContract = !this.onGetContract;
  };
}

@Component({
  selector: "dialog-add-contract",
  templateUrl: "./dialog-add-contract.html",
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})
export class DialogAddContract {
  onSubmit: boolean = false;
  onQuery: boolean = false;
  formPrice: FormGroup;
  companyName: string;
  formContract: FormGroup;
  currentUser: any;
  priceList: [];
  ruleList: [];
  selectedPrice: number;
  dataModel: any;
  descriptionPrice: string = "";
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogAddContract>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    translate.setDefaultLang("vi");
    this.onGetPrice();
    this.onGetRule();
    this.initialForm();
    this.onGetCompany();
  }
  onGetPrice() {
    this.appService
      .get(PriceContractAPIs.GET_ALL, () => {}, {})
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.priceList = Array.isArray(res.data) ? res.data : [];
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  compareTwoDates() {
    var date = this.formContract.controls.endDate.value;
    this.formContract.controls.startDate.markAsTouched();

    this.formContract.controls.endDate.markAsTouched();

    if (date == null) {
      this.formContract.controls.endDate.setErrors({
        matDatepickerParse: true
      });
      return;
    }
    if (
      this.formContract.controls.startDate.value >
      this.formContract.controls.endDate.value
    ) {
      this.formContract.controls.endDate.setErrors({
        endDateLess: true
      });
      return;
    }
    this.formContract.controls.endDate.setErrors(null);
    this.onSetPrice();
  }
  onGetRule() {
    this.appService
      .get(RuleAPIs.GET_ALL, () => {}, {
        companyId: parseInt(this.currentUser.CompanyId)
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.ruleList = Array.isArray(res.data) ? res.data : [];
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  initialForm() {
    this.formContract = this.fb.group(
      {
        companyId: [parseInt(this.data)],
        optionId: [-1],
        companyName: [""],
        emailRepresentativeA: [this.currentUser.email],
        representativeNameA: [this.currentUser.Name],
        positionRepresentativeA: [this.currentUser.Position],
        emailRepresentativeB: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
            )
          ]
        ],
        representativeNameB: ["", [Validators.required]],
        positionRepresentativeB: ["", [Validators.required]],
        address: ["", [Validators.required]],
        contentRule: ["", [Validators.required]],
        startDate: [
          new Date(),
          [Validators.required, DateLessThanNow.dateVaidator]
        ],
        endDate: [
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 1
          ),
          [Validators.required]
        ],
        priceContract: ["", [Validators.required]],
        maxEmployee: [
          1,
          [Validators.required, Validators.pattern("^[1-9][0-9]*$")]
        ]
      },
      {
        validators: DateLessThanControl.dateLessThan("startDate", "endDate", {
          endDateLess: true
        })
      }
    );
  }

  matcher = new StateMatcher();
  onGetCompany() {
    this.toggleOnQuery();
    this.appService
      .get(CompanyAPIs.GET_BY_ID, this.toggleOnQuery, { id: this.data })
      .subscribe((res: any) => {
        console.log(res);
        this.toggleOnQuery();
        if (res.success) {
          const data = res.data;
          this.formContract.controls.companyName.setValue(data.companyName);
          this.formContract.controls.emailRepresentativeB.setValue(
            data.emailRepresentative
          );
          this.formContract.controls.representativeNameB.setValue(
            data.representativeName
          );
          this.formContract.controls.positionRepresentativeB.setValue(
            data.positionRepresentative
          );
        } else {
          this.commonService.showAlert(res.message, "danger", "Thông báo");
        }
      });
  }
  onAddContract() {
    this.toggleForm();
    this.appService
      .post(ContractAPIs.ADD, this.toggleForm, {
        ...this.formContract.value,
        endDate: moment(this.formContract.controls.endDate.value).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        startDate: moment(this.formContract.controls.startDate.value).format(
          "YYYY-MM-DD HH:mm:ss"
        )
      })
      .subscribe((res: any) => {
        this.toggleForm();
        if (res.success) {
          this.commonService.showAlert(
            "Thêm thành công",
            "success",
            "Thông báo"
          );
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  closeModal = (): void => {
    this.dialogRef.close(false);
  };
  toggleForm = (): void => {
    if (!this.onSubmit) {
      this.dialogRef.disableClose = true;
      this.onSubmit = true;
    } else {
      this.dialogRef.disableClose = false;
      this.onSubmit = false;
    }
  };
  toggleOnQuery = (): void => {
    this.onQuery = !this.onQuery;
  };
  onChangePrice(e) {
    console.log(e);
    this.formContract.controls.priceContract.markAsTouched();
    if (e.value) {
      this.descriptionPrice = this.priceList.find(x => x["id"] === e.value)[
        "description"
      ];
      this.selectedPrice = e.value;
      this.formContract.controls.optionId.setValue(parseInt(e.value));
      this.onSetPrice();
    } else {
      this.descriptionPrice = "";
      this.formContract.controls.priceContract.setValue("");
      this.formContract.controls.optionId.setValue(-1);
    }
    // if (e.value) {
    //   this.selectedPrice = e.value;
    //   this.onSetPrice();
    // }
  }
  onChangeRule(e) {
    console.log(e);
    if (e.value) {
      this.formContract.controls.contentRule.setValue(e.value);
      this.dataModel = e.value;
    }
  }
  onSetPrice() {
    var startDate = this.formContract.controls.startDate.value;
    var endDateDate = this.formContract.controls.endDate.value;
    if (
      startDate == null ||
      endDateDate == null ||
      this.selectedPrice == undefined
    ) {
      return;
    }
    startDate = new Date(startDate);
    endDateDate = new Date(endDateDate);
    var diff = Math.abs(endDateDate.getTime() - startDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    var maxEmployee = this.formContract.controls.maxEmployee.value;
    var totoPrice =
      this.priceList.find(x => x["id"] === this.selectedPrice)["price"] *
      diffDays *
      maxEmployee;

    this.formContract.controls.priceContract.setValue(Math.round(totoPrice));
  }
}

@Component({
  selector: "dialog-detail-contract",
  templateUrl: "./dialog-detail-contract.html"
})
export class DialogDetailContract {
  currentUser: any;
  contract: any;
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDetailContract>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    this.onGetContract();
    console.log(data);
  }
  onConvertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }
  onConvertPrice(price: any, maxEmployee: any) {
    return Math.round(parseFloat(price) / parseFloat(maxEmployee));
  }
  genDayFromTwoDate(startDate: any, endDate: any) {
    var date1 = moment(startDate);
    var date2 = moment(endDate);
    var diff = date2.diff(date1, "days") + 1;
    return diff === 0 ? 1 : diff;
  }
  onGetContract() {
    this.appService
      .get(ContractAPIs.GET_BY_ID, () => {}, { contractId: this.data })
      .subscribe((res: any) => {
        console.log("ádsa", res);
        if (res.success) {
          this.contract = res.data;
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
}
@Component({
  selector: "dialog-confirm.component",
  templateUrl: "./dialog-confirm-delete-contract-company.html"
})
export class DialogConfirmDeleteCC {
  onRequest: boolean = false;
  constructor(
    private appService: AppService,
    public translate: TranslateService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogConfirmDeleteCC>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }
  onSubmit(): void {
    console.log(this.data);
    this.dialogRef.disableClose = true;
    this.toggleOnRequest();
    this.appService
      .delete(ContractAPIs.DELETE, this.toggleOnRequest, {
        contractId: this.data.id
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
