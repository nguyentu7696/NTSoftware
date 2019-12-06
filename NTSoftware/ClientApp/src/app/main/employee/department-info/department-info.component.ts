import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "../../../common/services/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../common/method";
import { CURRENT_USER } from "../../../constants/localStorageKey";
import { DepartmentAPIs, DetailUserAPIs } from "../../../constants/api";
import { EmptyOrNull } from "src/app/shared/validate";

@Component({
  selector: "app-department-info",
  templateUrl: "./department-info.component.html",
  styleUrls: ["./department-info.component.scss"]
})
export class DepartmentInfoComponent implements OnInit {
  initLisEmployee: any[] = [];
  isEdit: boolean = false;
  department: any;
  formDepartment: FormGroup;
  currentUser: any;
  departmentId: any;

  lstInDepartment: any[] = [];
  employeeList: any = [];

  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    this.departmentId = this.currentUser.DepartmentId;
    this.initialForm();
    this.onGetEmployee();
    this.getDepartment();
  }

  ngOnInit() {}

  initialForm() {
    const companyId = parseInt(this.currentUser.CompanyId);
    this.formDepartment = this.fb.group({
      id: [0],
      departmentName: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
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
      address: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      description: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      managerId: [0, [EmptyOrNull.SpaceValidator, Validators.required]],
      companyId: [companyId],
      lstEmployee: [this.initLisEmployee]
    });
  }

  convertManagerId(id: any) {
    return this.employeeList.length > 0
      ? this.employeeList.filter(x => x.id == id)[0].name
      : "";
  }

  getDepartment() {
    this.appService
      .get(DepartmentAPIs.GET_BY_ID, () => {}, {
        companyId: this.currentUser.CompanyId,
        id: this.departmentId
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.department = res.data;
          this.setUpEmployee();
          this.formDepartment.controls.departmentName.setValue(
            this.department.departmentName
          );
          this.formDepartment.controls.phoneNumber.setValue(
            this.department.phoneNumber
          );
          this.formDepartment.controls.email.setValue(this.department.email);
          this.formDepartment.controls.address.setValue(
            this.department.address
          );
          this.formDepartment.controls.managerId.setValue(
            this.department.managerId
          );
          this.formDepartment.controls.description.setValue(
            this.department.description
          );
          this.formDepartment.controls.lstEmployee.setValue(
            this.department.lstEmployee
          );
          this.formDepartment.controls.companyId.setValue(
            this.department.companyId
          );
          this.formDepartment.controls.id.setValue(this.department.id);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }

  setUpEmployee() {
    this.lstInDepartment = [];
    this.employeeList.forEach(element => {
      if (this.department.lstEmployee.findIndex(x => x == element.id) >= 0) {
        this.lstInDepartment.push({
          id: element.id,
          name: element.name,
          phoneNumber: element.phoneNumber,
          identityCard: element.identityCard
        });
      }
    });
  }

  onGetEmployee() {
    this.appService
      .get(DetailUserAPIs.GET_ALL, () => {}, {
        companyId: parseInt(this.currentUser.CompanyId)
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.employeeList = Array.isArray(res.data) ? res.data : [];
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
}
