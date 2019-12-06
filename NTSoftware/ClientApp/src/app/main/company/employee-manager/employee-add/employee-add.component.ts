import { Component, OnInit } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "src/app/shared/validate/date.adapter";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/common/method";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import {
  DateLessThanControl,
  DateLessThanNow,
  passwordMatchValidator,
  StateMatcher,
  DateCanWork,
  EmptyOrNull,
  InRange
} from "src/app/shared/validate";
import {
  RuleAPIs,
  PriceContractAPIs,
  CompanyAPIs
} from "src/app/constants/api";
import * as moment from "moment";

@Component({
  selector: "app-employee-add",
  templateUrl: "./employee-add.component.html",
  styleUrls: ["./employee-add.component.scss"],
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
export class EmployeeAddComponent implements OnInit {
  dataModel: any;
  urlQuery: any;
  company: any;
  formEmployee: FormGroup;
  onSubmit: boolean = false;
  currentUser: any;
  selectedPrice: number;
  priceList: [];
  ruleList: [];
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private route: Router,
    private commonService: CommonService // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log(this.currentUser);
    this.onGetRule();
    this.initialForm();
    this.onGetCompany();
  }

  ngOnInit() {}
  onGetCompany() {
    this.appService
      .get(CompanyAPIs.GET_BY_ID, () => {}, {
        id: parseInt(this.currentUser.CompanyId)
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.company = res.data;
          this.formEmployee.controls.emailRepresentativeA.setValue(
            this.company.emailRepresentative
          );
          this.formEmployee.controls.representativeNameA.setValue(
            this.company.positionRepresentative
          );
          this.formEmployee.controls.positionRepresentativeA.setValue(
            this.company.representativeName
          );
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
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
    this.formEmployee = this.fb.group({
      Id: [0],
      companyId: parseInt(this.currentUser.CompanyId),
      emailRepresentativeA: [
        "",
        [
          Validators.pattern(
            "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
          ),
          Validators.required,
          EmptyOrNull.SpaceValidator
        ]
      ],
      representativeNameA: [
        "",
        [Validators.required, EmptyOrNull.SpaceValidator]
      ],
      positionRepresentativeA: [
        "",
        [Validators.required, EmptyOrNull.SpaceValidator]
      ],
      emailRepresentativeB: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
          ),
          EmptyOrNull.SpaceValidator
        ]
      ],
      representativeNameB: [
        "",
        [EmptyOrNull.SpaceValidator, Validators.required]
      ],
      contentRule: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
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
        Validators.required
      ],
      salaryContract: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      employeeViewModel: this.fb.group(
        {
          email: [
            "",
            [
              Validators.required,
              Validators.pattern(
                "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
              ),
              EmptyOrNull.SpaceValidator
            ]
          ],
          userName: [
            "",
            [
              Validators.required,
              Validators.pattern(
                "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
              ),
              EmptyOrNull.SpaceValidator
            ]
          ],
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
          password: [
            "",
            [
              Validators.required,
              Validators.pattern(
                `^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\\W])(?!.*['"]).{8,}$`
              ),
              EmptyOrNull.SpaceValidator
            ]
          ],
          confirmPassword: [
            "",
            [EmptyOrNull.SpaceValidator, Validators.required]
          ],
          position: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
          name: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
          identityCard: [
            "",
            [Validators.required, EmptyOrNull.SpaceValidator, InRange.Validate]
          ],
          birthday: [
            new Date(
              new Date().getFullYear() - 15,
              new Date().getMonth(),
              new Date().getDate()
            ),
            [Validators.required, DateCanWork.dateValidator]
          ],
          gender: ["0", [Validators.required, EmptyOrNull.SpaceValidator]],
          address: ["", [Validators.required, EmptyOrNull.SpaceValidator]]
        },
        { validators: passwordMatchValidator }
      )
    });
  }
  matcher = new StateMatcher();
  onChangeEmail() {
    this.formEmployee.controls.employeeViewModel
      .get("userName")
      .setValue(
        this.formEmployee.controls.employeeViewModel.get("email").value
      );
    console.log(this.formEmployee);
  }
  onChangeRule(e) {
    console.log(e);
    if (e.value) {
      this.formEmployee.controls.contentRule.setValue(e.value);
      this.dataModel = e.value;
    }
  }
  compareTwoDates() {
    var date = this.formEmployee.controls.endDate.value;
    this.formEmployee.controls.strartDate.markAsTouched();

    this.formEmployee.controls.endDate.markAsTouched();

    if (date == null) {
      this.formEmployee.controls.endDate.setErrors({
        matDatepickerParse: true
      });
      return;
    }
    if (
      this.formEmployee.controls.strartDate.value >=
      this.formEmployee.controls.endDate.value
    ) {
      this.formEmployee.controls.endDate.setErrors({
        endDateLess: true
      });
      return;
    }
    this.formEmployee.controls.endDate.setErrors(null);
  }
  onAddEmployee() {
    if (this.formEmployee.invalid) {
      return;
    }
    let employeeVm = this.formEmployee.controls.employeeViewModel.value;
    employeeVm.birthday = moment(employeeVm.birthday).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    // this.formEmployee.controls.strartDate.setValue(moment(this.formEmployee.controls.strartDate.value).format("DD/MM/YYYY"))
    // this.formEmployee.controls.endDate.setValue(moment(this.formEmployee.controls.endDate.value).format("DD/MM/YYYY"))
    // this.formEmployee.controls.employeeViewModel.get('birthday').setValue(moment(this.formEmployee.controls.endDate.value).format("DD/MM/YYYY"))
    this.toggleForm();
    this.appService
      .post(CompanyAPIs.ADD_EMPLOYEE, this.toggleForm, {
        ...this.formEmployee.value,
        employeeVm: employeeVm,
        strartDate: moment(this.formEmployee.controls.strartDate.value).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endDate: moment(this.formEmployee.controls.endDate.value).format(
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
          this.route.navigate(["/company/employee-manager/employee-list"]);
        } else {
          this.commonService.showAlert(res.message, "danger", "Thông báo");
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
  toggleForm = (): any => {
    this.onSubmit = !this.onSubmit;
    // if (this.formEmployee.disabled) {
    //   this.formEmployee.enable();

    // } else {
    //   this.formEmployee.disable();
    //   this.onSubmit = true;
    // }
  };
}
