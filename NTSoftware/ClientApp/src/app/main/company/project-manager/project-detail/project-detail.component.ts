import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormControl,
  FormGroup
} from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/common/services/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/common/method";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import { Observable } from "rxjs";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {
  StateMatcher,
  DateLessThanNow,
  EmptyOrNull
} from "src/app/shared/validate";
import { ProjectAPIs, DetailUserAPIs } from "src/app/constants/api";
import * as moment from "moment";
@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"]
})
export class ProjectDetailComponent implements OnInit {
  initLisEmployee: any[] = [];
  isEdit: boolean = false;
  formProject: FormGroup;
  onSubmit: boolean = false;
  currentUser: any;
  matcher = new StateMatcher();
  selectedEmployee: number;
  employeeList: any = [];
  employeeSelect: [];
  projectId: any;
  project: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  employeeControl = new FormControl();
  filteredFruits: Observable<string[]>;
  lstSelectedEmployee: any[] = [];
  lstInProject: any[] = [];

  @ViewChild("employeeInput", { static: false }) employeeInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private route: Router,
    public activeRoute: ActivatedRoute,
    private commonService: CommonService // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log;
    this.projectId = activeRoute.snapshot.queryParams["project"];
    this.onCheckPermission();
    this.initialForm();
    this.onGetEmployee();
    this.getProject();
    this.onGetUserInProject();
  }
  onCheckPermission() {
    this.appService
      .get(ProjectAPIs.CHECK_PERMISSION, () => {}, {
        companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId
      })
      .subscribe((res: any) => {});
  }
  setUpEmployee() {
    this.lstInProject = [];
    this.employeeList.forEach(element => {
      if (this.project.lstEmployee.findIndex(x => x == element.id) >= 0) {
        this.lstInProject.push({
          id: element.id,
          name: element.name,
          phoneNumber: element.phoneNumber,
          identityCard: element.identityCard
        });
        this.lstSelectedEmployee.push({
          id: element.id,
          name: element.name
        });
      }
    });
  }
  convertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
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
  convertManagerId(id: any) {
    return this.employeeList.length > 0
      ? this.employeeList.filter(x => x.id == id)[0].name
      : "";
  }
  onChangeSearch(e) {
    let lstVm = this.formProject.controls.lstEmployee.value.join(";");
    this.appService
      .get(DetailUserAPIs.GET_SELECT_PROJECT, () => {}, {
        companyId: parseInt(this.currentUser.CompanyId),
        lstVm: lstVm,
        keyword: e,
        projectId: this.projectId
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.employeeSelect = res.data;
        }
      });
  }
  add(event: MatChipInputEvent): void {
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
    if (
      this.lstSelectedEmployee.findIndex(x => x.id == event.option.value) < 0
    ) {
      this.formProject.controls.lstEmployee.value.push(event.option.value);
      this.lstSelectedEmployee.push({
        id: event.option.value,
        name: event.option.viewValue
      });
    }
    this.employeeControl.setValue("");
  }

  ngOnInit() {}

  onChangeManager(e) {
    if (e.value) {
      this.selectedEmployee = e.value;
      this.formProject.controls.managerId.setValue(e.value);
    } else {
      this.formProject.controls.managerId.setValue("");
    }
  }
  onGetUserInProject() {
    this.appService
      .get(DetailUserAPIs.GET_BY_PROJECT, () => {}, {
        projectId: this.projectId
      })
      .subscribe((res: any) => {
        if (res.success) {
          console.log("sss", res);
          this.lstInProject = Array.isArray(res.data) ? res.data : [];
          this.lstInProject.forEach(element => {
            this.lstSelectedEmployee.push({
              id: element.id,
              name: element.name
            });
            this.formProject.controls.lstEmployee.value.push(element.id);
          });
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
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
  getProject() {
    this.appService
      .get(ProjectAPIs.GET_BY_ID, () => {}, {
        companyId: this.currentUser.CompanyId,
        id: this.projectId
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.project = res.data;
          //this.setUpEmployee();
          this.formProject.controls.projectName.setValue(
            this.project.projectName
          );
          this.formProject.controls.startDate.setValue(this.project.startDate);
          this.formProject.controls.endDate.setValue(this.project.endDate);
          this.formProject.controls.description.setValue(
            this.project.description
          );
          this.formProject.controls.managerId.setValue(this.project.managerId);
          this.formProject.controls.companyId.setValue(this.project.companyId);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  initialForm() {
    const companyId = parseInt(this.currentUser.CompanyId);
    this.formProject = this.fb.group({
      id: [this.projectId],
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
      managerId: ["", Validators.required],
      companyId: [companyId],
      lstEmployee: [[]]
    });
  }
  onToggleEdit() {
    this.isEdit = !this.isEdit;
  }
  onUpdateDepartment() {
    this.formProject.markAllAsTouched();
    if (!this.formProject.invalid) {
      this.toggleOnRequest();
      this.appService
        .put(ProjectAPIs.UPDATE, this.toggleOnRequest, {
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
              "Cập nhật thành công",
              "success",
              "Thông báo"
            );
            location.reload();
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
    if (this.onSubmit) {
      this.formProject.disable();
    } else {
      this.formProject.enable();
    }
  };
}
