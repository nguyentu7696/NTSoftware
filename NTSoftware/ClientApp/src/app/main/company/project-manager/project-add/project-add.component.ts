import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import {
  StateMatcher,
  DateLessThanNow,
  EmptyOrNull
} from "src/app/shared/validate";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Observable } from "rxjs";
import {
  MatAutocomplete,
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/common/method";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import { DetailUserAPIs, ProjectAPIs } from "src/app/constants/api";
import * as moment from "moment";
@Component({
  selector: "app-project-add",
  templateUrl: "./project-add.component.html",
  styleUrls: ["./project-add.component.scss"]
})
export class ProjectAddComponent implements OnInit {
  initLisEmployee: any[] = [];
  formProject: FormGroup;
  onSubmit: boolean = false;
  currentUser: any;
  matcher = new StateMatcher();
  selectedEmployee: number;
  employeeList: [];
  employeeSelect: [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  employeeControl = new FormControl();
  filteredFruits: Observable<string[]>;
  lstSelectedEmployee: any[] = [];

  @ViewChild("employeeInput", { static: false }) employeeInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private route: Router,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    this.onCheckPermission();
    console.log(this.currentUser);
    this.initialForm();
    // this.getEmployeeNoDepartment();
    this.onGetEmployee();
  }
  onCheckPermission() {
    this.appService
      .get(ProjectAPIs.CHECK_PERMISSION, () => {}, {
        companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId
      })
      .subscribe((res: any) => {});
  }
  ngOnInit() {}
  onGetEmployee() {
    this.appService
      .get(DetailUserAPIs.GET_ALL, () => {}, {
        companyId: parseInt(this.currentUser.CompanyId)
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.employeeList = Array.isArray(res.data) ? res.data : [];
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  initialForm() {
    const companyId = parseInt(this.currentUser.CompanyId);
    this.formProject = this.fb.group({
      projectName: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
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
      description: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      managerId: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      companyId: [companyId],
      lstEmployee: [this.initLisEmployee]
    });
  }
  onChangeManager(e) {
    console.log(e);
    if (e.value) {
      this.selectedEmployee = e.value;
      this.formProject.controls.managerId.setValue(e.value);
      console.log(this.formProject.value);
    } else {
      this.formProject.controls.managerId.setValue("");
    }
  }
  onChangeSearch(e) {
    let lstVm = this.formProject.controls.lstEmployee.value.join(";");
    this.appService
      .get(DetailUserAPIs.GET_SELECT_PROJECT, () => {}, {
        companyId: parseInt(this.currentUser.CompanyId),
        lstVm: lstVm,
        keyword: e
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.employeeSelect = res.data;
        }
      });
  }
  add(event: MatChipInputEvent): void {
    console.log("dsd");
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || "").trim()) {
        this.lstSelectedEmployee.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }
    }
  }

  remove(employee: any): void {
    const index = this.formProject.controls.lstEmployee.value.findIndex(
      x => x == employee.id
    );
    if (index >= 0) {
      this.formProject.controls.lstEmployee.setValue(
        this.formProject.controls.lstEmployee.value.filter(
          x => x !== employee.id
        )
      );
      this.lstSelectedEmployee = this.lstSelectedEmployee.filter(
        x => x.id != employee.id
      );
    }

    // if (index >= 0) {
    //   this.fruits.splice(index, 1);
    // }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.formProject.controls.lstEmployee.value.push(event.option.value);
    console.log(this.formProject.controls.lstEmployee.value);
    this.lstSelectedEmployee.push({
      id: event.option.value,
      name: event.option.viewValue
    });
    this.employeeControl.setValue("");
  }
  compareTwoDates() {
    var date = this.formProject.controls.endDate.value;
    this.formProject.controls.startDate.markAsTouched();

    this.formProject.controls.endDate.markAsTouched();

    if (date == null) {
      this.formProject.controls.endDate.setErrors({
        matDatepickerParse: true
      });
      return;
    }
    if (
      this.formProject.controls.startDate.value >=
      this.formProject.controls.endDate.value
    ) {
      this.formProject.controls.endDate.setErrors({
        endDateLess: true
      });
      return;
    }
    this.formProject.controls.endDate.setErrors(null);
  }
  onAddProject() {
    this.formProject.markAllAsTouched();
    console.log(this.formProject);
    if (!this.formProject.invalid) {
      this.toggleOnRequest();
      this.appService
        .post(ProjectAPIs.ADD, this.toggleOnRequest, {
          ...this.formProject.value,
          startDate: moment(this.formProject.controls.startDate.value).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endDate: moment(this.formProject.controls.endDate.value).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        })
        .subscribe((res: any) => {
          this.toggleOnRequest();
          if (res.success) {
            this.commonService.showAlert(
              "Thêm thành công",
              "success",
              "Thông báo"
            );
            this.route.navigate(["/company/project-manager/project-list"]);
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
