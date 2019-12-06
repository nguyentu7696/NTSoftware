import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "src/app/common/services/app.service";
import { CommonService } from "src/app/common/method";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  StateMatcher,
  passwordMatchValidator,
  DateLessThanNow,
  DateLessThanControl,
  DateCanWork,
  DateGranter18,
  EmptyOrNull,
  InRange
} from "src/app/shared/validate";
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  DateAdapter
} from "@angular/material/core";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "src/app/shared/validate/date.adapter";
import {
  CompanyAPIs,
  PriceContractAPIs,
  RuleAPIs
} from "src/app/constants/api";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
export const DD_MM_YYYY_Format = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
@Component({
  selector: "app-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"],
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
export class AddCompanyComponent implements OnInit {
  dataModel: any;
  urlQuery: any;
  formCompany: FormGroup;
  onSubmit: boolean = false;
  currentUser: any;
  selectedPrice: number;
  priceList: [];
  ruleList: [];
  descriptionPrice: string;
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
    this.onGetPrice();
    this.onGetRule();
    this.initialForm();
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
    this.formCompany = this.fb.group({
      Id: [0],
      companyName: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      optionId: [-1],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern("^(08|09|03|07)[0|1|2|3|4|5|6|7|8|9][0-9]{7,8}$"),
          EmptyOrNull.SpaceValidator
        ]
      ],
      logo: [""],
      emailRepresentative: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
          ),
          EmptyOrNull.SpaceValidator
        ]
      ],
      representativeName: [
        "",
        [EmptyOrNull.SpaceValidator, Validators.required]
      ],
      positionRepresentative: [
        "",
        [EmptyOrNull.SpaceValidator, Validators.required]
      ],
      address: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
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
      employeeVm: this.fb.group(
        {
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
            [Validators.required, EmptyOrNull.SpaceValidator]
          ],
          name: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
          identityCard: [
            "",
            [Validators.required, EmptyOrNull.SpaceValidator, InRange.Validate]
          ],
          birthday: [
            new Date(
              new Date().getFullYear() - 18,
              new Date().getMonth(),
              new Date().getDate()
            ),
            [Validators.required, DateGranter18.dateValidator]
          ],
          gender: ["0", [Validators.required]],
          address: ["", [Validators.required]]
        },
        { validators: passwordMatchValidator }
      ),
      contractVm: this.fb.group(
        {
          companyName: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
          emailRepresentativeA: [this.currentUser.email],
          representativeNameA: [this.currentUser.Name],
          positionRepresentativeA: [this.currentUser.Position],
          emailRepresentativeB: [
            "",
            [
              Validators.required,
              Validators.pattern(
                "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3}){1,2}$"
              ),
              EmptyOrNull.SpaceValidator
            ]
          ],
          representativeNameB: [
            "",
            [Validators.required, EmptyOrNull.SpaceValidator]
          ],
          positionRepresentativeB: [
            "",
            [Validators.required, EmptyOrNull.SpaceValidator]
          ],
          address: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
          contentRule: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
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
            Validators.required
          ],
          priceContract: [
            "",
            [Validators.required, EmptyOrNull.SpaceValidator]
          ],
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
      )
    });
  }
  matcher = new StateMatcher();

  ngOnInit() {}

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  numberDot(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode === 46 &&
      this.formCompany.controls.contractVm
        .get("priceContract")
        .value.toString()
        .includes(".") === false
    ) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onChangeCompanyName() {
    this.formCompany.controls.contractVm
      .get("companyName")
      .setValue(this.formCompany.controls.companyName.value);
  }
  compareTwoDates() {
    var date = this.formCompany.controls.contractVm.get("endDate").value;
    this.formCompany.controls.contractVm.get("startDate").markAsTouched();

    this.formCompany.controls.contractVm.get("endDate").markAsTouched();

    if (date == null) {
      this.formCompany.controls.contractVm.get("endDate").setErrors({
        required: true
      });
      return;
    }
    if (Date.parse(date) === NaN) {
      this.formCompany.controls.contractVm.get("endDate").setErrors({
        matDatepickerParse: true
      });
      return;
    }
    if (
      this.formCompany.controls.contractVm.get("startDate").value >
      this.formCompany.controls.contractVm.get("endDate").value
    ) {
      this.formCompany.controls.contractVm.get("endDate").setErrors({
        endDateLess: true
      });
      return;
    }
    this.formCompany.controls.contractVm.get("endDate").setErrors(null);
    this.onSetPrice();
  }

  onChangePrice(e) {
    this.formCompany.controls.contractVm.get("priceContract").markAsTouched();
    if (e.value) {
      this.descriptionPrice = this.priceList.find(x => x["id"] === e.value)[
        "description"
      ];
      this.selectedPrice = e.value;
      this.formCompany.controls.optionId.setValue(parseInt(e.value));
      this.onSetPrice();
    } else {
      this.descriptionPrice = "";
      this.formCompany.controls.contractVm.get("priceContract").setValue("");
      this.formCompany.controls.optionId.setValue(-1);
    }
  }
  onChangeRule(e) {
    console.log(e);
    this.formCompany.controls.contractVm.get("contentRule").markAsTouched();
    if (e.value) {
      this.formCompany.controls.contractVm.get("contentRule").setValue(e.value);
      this.dataModel = e.value;
    } else {
      this.formCompany.controls.contractVm.get("contentRule").setValue("");
      this.dataModel = "";
    }
  }
  onSetPrice() {
    var startDate = this.formCompany.controls.contractVm.get("startDate").value;
    var endDateDate = this.formCompany.controls.contractVm.get("endDate").value;
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
    var maxEmployee = this.formCompany.controls.contractVm.get("maxEmployee")
      .value;
    var totoPrice =
      this.priceList.find(x => x["id"] === this.selectedPrice)["price"] *
      diffDays *
      maxEmployee;

    this.formCompany.controls.contractVm
      .get("priceContract")
      .setValue(Math.round(totoPrice));
    console.log(this.formCompany.value);
  }
  onAddCompany() {
    this.formCompany.markAllAsTouched();
    console.log(this.formCompany);
    if (!this.formCompany.invalid) {
      let employeeVm = this.formCompany.controls.employeeVm.value;
      employeeVm.birthday = moment(employeeVm.birthday).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      let contractVm = this.formCompany.controls.contractVm.value;
      contractVm.startDate = moment(contractVm.birthday).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      contractVm.endDate = moment(contractVm.endDate).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.toggleOnRequest();
      this.appService
        .post(CompanyAPIs.ADD, this.toggleOnRequest, {
          ...this.formCompany.value,
          employeeVm: employeeVm,
          contractVm: contractVm
        })
        .subscribe((res: any) => {
          this.toggleOnRequest();
          if (res.success) {
            this.commonService.showAlert(
              "Thêm thành công",
              "success",
              "Thông báo"
            );
            this.route.navigate(["/admin/company-list"]);
          } else {
            this.commonService.showAlert(res.message, "danger", "Thông báo");
          }
        });
    } else {
      this.commonService.showAlert(
        "Vui lòng điền đủ thông tin",
        "danger",
        "Lỗi"
      );
    }
  }

  toggleOnRequest = (): void => {
    this.onSubmit = !this.onSubmit;
  };
}
