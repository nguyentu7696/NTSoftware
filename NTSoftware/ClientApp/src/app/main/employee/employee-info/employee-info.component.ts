import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { AppService } from "../../../common/services/app.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../common/method";
import { DetailUserAPIs } from "../../../constants/api";
import { MatTableDataSource } from "@angular/material/table";
import { CURRENT_USER } from "../../../constants/localStorageKey";
import * as moment from "moment";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import {
  APP_DATE_FORMATS,
  AppDateAdapter
} from "../../../shared/validate/date.adapter";
import {
  StateMatcher,
  EmptyOrNull,
  InRange,
  DateCanWork
} from "../../../shared/validate";

@Component({
  selector: "app-employee-info",
  templateUrl: "./employee-info.component.html",
  styleUrls: ["./employee-info.component.scss"],
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
export class EmployeeInfoComponent implements OnInit {
  isEdit: boolean = false;
  formEmployee: FormGroup;
  employee: any;
  queryEmployee: number;
  currentUser: any;
  onRequest = false;
  dataSource = new MatTableDataSource([]);
  onSubmit: boolean = false;
  matcher = new StateMatcher();

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
    this.queryEmployee = parseInt(this.currentUser.UserId);
    this.initialForm();
    this.onGetEmployee();
  }

  ngOnInit() {}

  initialForm() {
    this.formEmployee = this.fb.group({
      Id: [this.queryEmployee],
      name: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      identityCard: [
        "",
        [Validators.required, EmptyOrNull.SpaceValidator, InRange.Validate]
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
  compareTwoDates() {
    var date = this.formEmployee.controls.birthday.value;
    console.log(date);
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

  onUpdateEmployee() {
    this.toggleOnSubmit();
    this.appService
      .put(DetailUserAPIs.UPDATE_EMPLOYEE, this.toggleOnSubmit, {
        ...this.formEmployee.value,
        birthday: moment(this.formEmployee.controls.birthday.value).format(
          "DD/MM/YYYY"
        )
      })
      .subscribe((res: any) => {
        this.toggleOnSubmit();
        this.toggleEdit();
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Cảnh báo"
          );
          this.onGetEmployee();
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }

  toggleOnSubmit = (): void => {
    this.onSubmit = !this.onSubmit;
  };

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  toggleRequest = (): void => {
    this.onRequest = !this.onRequest;
  };

  onConvertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }

  convertGender(gender: any) {
    return gender == 1 ? "Nam" : "Nữ";
  }
}
