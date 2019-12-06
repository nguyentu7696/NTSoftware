import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatTableDataSource,
  MatDialog,
  MatPaginator,
  PageEvent,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/common/method";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import {
  StateMatcher,
  DateLessThanNow,
  DateLessThanControl,
  EmptyOrNull,
  InRange,
  DateCanWork
} from "src/app/shared/validate";
import {
  DetailUserAPIs,
  EmployeeContractAPIs,
  RuleAPIs,
  PriceContractAPIs,
  CompanyAPIs,
  ContractAPIs,
  UserAPIs
} from "src/app/constants/api";
import * as moment from "moment";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "src/app/shared/validate/date.adapter";
@Component({
  selector: "app-employee-detail",
  templateUrl: "./employee-detail.component.html",
  styleUrls: ["./employee-detail.component.scss"],
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
export class EmployeeDetailComponent implements OnInit {
  pageEvent: PageEvent;
  totalRow: number = 0;
  isEdit: boolean = false;
  onGetContract: boolean = false;
  employee: any;
  currentUser: any;
  onSubmit: boolean = false;
  params: any = { pageSize: 5, pageIndex: 1 };
  onRequest = false;
  queryEmployee: number;
  formEmployee: FormGroup;
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

    this.queryEmployee = this.activeRoute.snapshot.queryParams["employee"];

    console.log(this.activeRoute.snapshot);
    this.params.employeeId = this.queryEmployee;
    this.initialForm();
    this.onGetEmployee();
    this.onGetContractEmployee();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit() {
    this.paginator._intl.nextPageLabel = "Trang tiếp";

    this.paginator._intl.previousPageLabel = "Trang trước";

    this.paginator._intl.itemsPerPageLabel = "Số bản ghi/trang";
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
  deleteItem(contract) {
    const dialogRef = this.dialog.open(DialogConfirmDeleteCE, {
      width: "450px",
      height: "150",
      data: contract
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onGetContractEmployee();
      }
    });
  }
  onChangePageSize(e) {
    this.params.pageSize = e.pageSize;
    this.params.pageIndex = e.pageIndex + 1;
    this.onGetContractEmployee();
  }
  onActiveContract(id) {
    this.appService
      .put(EmployeeContractAPIs.UPDATE_STATUS, () => {}, {
        employeeId: this.queryEmployee,
        contractId: id,
        status: 1
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Thông báo"
          );
          this.onGetContractEmployee();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onFinishContract(id) {
    this.appService
      .put(EmployeeContractAPIs.UPDATE_STATUS, () => {}, {
        employeeId: this.queryEmployee,
        contractId: id,
        status: 3
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Thông báo"
          );
          this.onGetContractEmployee();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onShowDetailContract(id) {
    const dialogRef = this.dialog.open(DialogDetailContractE, {
      width: "800px",
      height: "500px",
      data: id
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  initialForm() {
    this.formEmployee = this.fb.group({
      Id: [this.queryEmployee],
      name: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      identityCard: [
        "",
        [EmptyOrNull.SpaceValidator, Validators.required, InRange.Validate]
      ],
      birthday: ["", [Validators.required, DateCanWork.dateValidator]],
      gender: ["0", Validators.required],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(08|09|03|07)([0|1|2|3|4|5|6|7|8|9])+[0-9]{7,8}$"
          ),
          EmptyOrNull.SpaceValidator
        ]
      ],
      address: ["", [EmptyOrNull.SpaceValidator, Validators.required]]
    });
  }
  matcher = new StateMatcher();
  toggleEdit() {
    this.isEdit = !this.isEdit;
  }
  toggleGetContract = (): void => {
    this.onGetContract = !this.onGetContract;
  };
  convertGender(gender: any) {
    return gender == 1 ? "Nam" : "Nữ";
  }
  onConvertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }
  onAddContract() {
    const dialogRef = this.dialog.open(DialogAddContractEmployee, {
      width: "750px",
      height: "150",
      data: this.queryEmployee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onGetContractEmployee();
      }
    });
  }
  onUpdateEmployee() {
    this.toggleOnSubmit();
    this.appService
      .put(DetailUserAPIs.UPDATE_EMPLOYEE, this.toggleOnSubmit, {
        ...this.formEmployee.value,
        birthday: moment(this.formEmployee.controls.birthday.value).format(
          "YYYY-MM-DD HH:mm:ss"
        )
      })
      .subscribe((res: any) => {
        this.toggleOnSubmit();
        this.toggleEdit();
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Thông báo"
          );
          this.onGetEmployee();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onGetContractEmployee() {
    this.toggleGetContract();
    this.appService
      .get(
        EmployeeContractAPIs.GET_BY_EMPLOYEE,
        this.toggleGetContract,
        this.params
      )
      .subscribe((res: any) => {
        this.toggleGetContract();
        if (res.success) {
          console.log(res);
          this.dataSource.data = res.data.results;
          this.totalRow = res.data.rowCount;
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onGetEmployee() {
    this.appService
      .get(DetailUserAPIs.GET_BY_USER, this.toggleRequest, {
        id: this.queryEmployee
      })
      .subscribe((res: any) => {
        if (res.success) {
          console.log(res);
          const data = res.data;
          this.employee = data;
          this.formEmployee.controls.name.setValue(data.name);
          this.formEmployee.controls.phoneNumber.setValue(data.phoneNumber);
          this.formEmployee.controls.identityCard.setValue(data.identityCard);
          this.formEmployee.controls.address.setValue(data.address);
          this.formEmployee.controls.gender.setValue(data.gender.toString());
          this.formEmployee.controls.birthday.setValue(data.birthday);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  toggleRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
  toggleOnSubmit = (): void => {
    this.onSubmit = !this.onSubmit;
  };
}

@Component({
  selector: "dialog-add-contract-employee",
  templateUrl: "./dialog-add-contract.html"
})
export class DialogAddContractEmployee {
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
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogAddContractEmployee>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    translate.setDefaultLang("vi");
    console.log(this.currentUser);
    this.onGetRule();
    this.initialForm();
    this.onGetCompany();
    this.onGetEmployee();
  }
  compareTwoDates() {
    var date = this.formContract.controls.endDate.value;
    this.formContract.controls.strartDate.markAsTouched();

    this.formContract.controls.endDate.markAsTouched();

    if (date == null) {
      this.formContract.controls.endDate.setErrors({
        matDatepickerParse: true
      });
      return;
    }
    if (
      this.formContract.controls.strartDate.value >=
      this.formContract.controls.endDate.value
    ) {
      this.formContract.controls.endDate.setErrors({
        endDateLess: true
      });
      return;
    }
    this.formContract.controls.endDate.setErrors(null);
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

  initialForm() {
    this.formContract = this.fb.group(
      {
        companyId: [parseInt(this.currentUser.CompanyId)],
        emailRepresentativeA: [
          "",
          [EmptyOrNull.SpaceValidator, Validators.required]
        ],
        representativeNameA: [
          "",
          [EmptyOrNull.SpaceValidator, Validators.required]
        ],
        positionRepresentativeA: [""],
        emailRepresentativeB: [
          "",
          [EmptyOrNull.SpaceValidator, Validators.required]
        ],
        representativeNameB: [
          "",
          [EmptyOrNull.SpaceValidator, Validators.required]
        ],
        employeeId: [
          this.data,
          [EmptyOrNull.SpaceValidator, Validators.required]
        ],
        strartDate: [
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
        contentRule: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
        salaryContract: [
          "",
          [
            EmptyOrNull.SpaceValidator,
            Validators.required,
            Validators.pattern("^[1-9][0-9]*$")
          ]
        ]
      },
      {
        validators: DateLessThanControl.dateLessThan("strartDate", "endDate", {
          endDateLess: true
        })
      }
    );
  }

  matcher = new StateMatcher();
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onGetEmployee() {
    this.appService
      .get(DetailUserAPIs.GET_BY_USER, () => {}, {
        id: this.data
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          const data = res.data;

          this.formContract.controls.representativeNameB.setValue(data.name);
        } else {
          this.commonService.showAlert(res.message, "danger", "Thông báo");
        }
      });
    this.appService
      .get(UserAPIs.GET_BY_ID, () => {}, {
        id: this.data
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          const data = res.data;

          this.formContract.controls.emailRepresentativeB.setValue(
            data.userName
          );
        } else {
          this.commonService.showAlert(res.message, "danger", "Thông báo");
        }
      });
  }
  onGetCompany() {
    this.toggleOnQuery();

    this.appService
      .get(CompanyAPIs.GET_BY_ID, this.toggleOnQuery, {
        id: parseInt(this.currentUser.CompanyId)
      })
      .subscribe((res: any) => {
        console.log(res);
        this.toggleOnQuery();
        if (res.success) {
          const data = res.data;

          this.formContract.controls.emailRepresentativeA.setValue(
            data.emailRepresentative
          );
          this.formContract.controls.representativeNameA.setValue(
            data.representativeName
          );
          this.formContract.controls.positionRepresentativeA.setValue(
            data.positionRepresentative
          );
        } else {
          this.commonService.showAlert(res.message, "danger", "Thông báo");
        }
      });
  }

  onAddContract() {
    this.toggleForm();
    console.log(moment(new Date(this.formContract.controls.strartDate.value)));

    this.appService
      .post(EmployeeContractAPIs.ADD, this.toggleForm, {
        ...this.formContract.value,
        strartDate: moment(this.formContract.controls.strartDate.value).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endDate: moment(this.formContract.controls.endDate.value).format(
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
    if (e.value) {
      this.selectedPrice = e.value;
    }
  }
  onChangeRule(e) {
    console.log(e);
    if (e.value) {
      this.formContract.controls.contentRule.setValue(e.value);
      this.dataModel = e.value;
    }
  }
}
@Component({
  selector: "dialog-confirm.component",
  templateUrl: "./confirm-delete-contract-employee.html"
})
export class DialogConfirmDeleteCE {
  onRequest: boolean = false;
  constructor(
    private appService: AppService,
    public translate: TranslateService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogConfirmDeleteCE>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    console.log(this.data);
    this.dialogRef.disableClose = true;
    this.toggleOnRequest();
    this.appService
      .delete(EmployeeContractAPIs.DELETE, this.toggleOnRequest, {
        id: this.data.id
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
@Component({
  selector: "dialog-detail-contract",
  templateUrl: "./detail-contract-employee.html"
})
export class DialogDetailContractE {
  currentUser: any;
  contract: any;
  detailEmployee: any;
  detailCompany: any;
  queryEmployee: number;
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogDetailContractE>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.queryEmployee = this.activeRoute.snapshot.queryParams["employee"];
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    this.onGetContract();
    this.onGetEmployee();
    this.onGetCompany();
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
    var diff = date2.diff(date1, "days");
    return diff === 0 ? 1 : diff;
  }
  onGetContract() {
    this.appService
      .get(EmployeeContractAPIs.GET_BY_ID, () => {}, { id: this.data })
      .subscribe((res: any) => {
        console.log("s", res);
        if (res.success) {
          this.contract = res.data;
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  onGetEmployee() {
    this.appService
      .get(DetailUserAPIs.GET_BY_USER, () => {}, { id: this.queryEmployee })
      .subscribe((res: any) => {
        if (res.success) {
          console.log("emm", res.data);
          this.detailEmployee = res.data;
        }
      });
  }
  onGetCompany() {
    this.appService
      .get(CompanyAPIs.GET_BY_ID, () => {}, { id: this.currentUser.CompanyId })
      .subscribe((res: any) => {
        if (res.success) {
          console.log("com", res.data);
          this.detailCompany = res.data;
        }
      });
  }
  onConvertDateTime(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }
  checkAge(startDate: any, birthday: any) {
    let date1 = new Date(startDate);
    let date2 = new Date(birthday);
    return (
      15 <= date1.getFullYear() - date2.getFullYear() &&
      date1.getFullYear() - date2.getFullYear() <= 18
    );
  }
}
