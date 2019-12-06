import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { DepartmentAPIs, DetailUserAPIs } from "../../../../constants/api";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { AppService } from "../../../../common/services/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../../common/method";
import { CURRENT_USER } from "../../../../constants/localStorageKey";
import { StateMatcher, EmptyOrNull } from "../../../../shared/validate";
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from "@angular/material";
import { Observable } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
@Component({
  selector: "app-department-detail",
  templateUrl: "./department-detail.component.html",
  styleUrls: ["./department-detail.component.scss"]
})
export class DepartmentDetailComponent implements OnInit {
  initLisEmployee: any[] = [];
  isEdit: boolean = false;
  formDepartment: FormGroup;
  onSubmit: boolean = false;
  currentUser: any;
  matcher = new StateMatcher();
  selectedEmployee: number;
  employeeList: any = [];
  employeeSelect: [];
  departmentId: any;
  department: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  employeeControl = new FormControl();
  filteredFruits: Observable<string[]>;
  lstSelectedEmployee: any[] = [];
  lstInDepartment: any[] = [];

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

    this.departmentId = activeRoute.snapshot.queryParams["department"];
    this.onCheckPermission();
    this.initialForm();
    this.onGetEmployee();
    this.getDepartment();
  }
  onCheckPermission() {
    this.appService
      .get(DepartmentAPIs.CHECK_PERMISSION, () => {}, {
        companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId
      })
      .subscribe((res: any) => {});
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
        this.lstSelectedEmployee.push({
          id: element.id,
          name: element.name
        });
      }
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
  onChangeSearch(e) {
    let lstVm = this.formDepartment.controls.lstEmployee.value.join(";");
    this.appService
      .get(DetailUserAPIs.GET_SELECT_DEPARTMENT, () => {}, {
        companyId: parseInt(this.currentUser.CompanyId),
        lstVm: lstVm,
        keyword: e,
        departmentId: this.departmentId
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
    const index = this.formDepartment.controls.lstEmployee.value.findIndex(
      x => x == employee.id
    );
    if (index >= 0) {
      this.formDepartment.controls.lstEmployee.setValue(
        this.formDepartment.controls.lstEmployee.value.filter(
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
      this.formDepartment.controls.lstEmployee.value.push(event.option.value);
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
      this.formDepartment.controls.managerId.setValue(e.value);
    } else {
      this.formDepartment.controls.managerId.setValue("");
    }
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
      managerId: [0, Validators.required],
      companyId: [companyId],
      lstEmployee: [this.initLisEmployee]
    });
  }
  onToggleEdit() {
    this.isEdit = !this.isEdit;
  }
  onUpdateDepartment() {
    this.formDepartment.markAllAsTouched();
    if (!this.formDepartment.invalid) {
      this.toggleOnRequest();
      this.appService
        .put(
          DepartmentAPIs.UPDATE,
          this.toggleOnRequest,
          this.formDepartment.value
        )
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
      this.formDepartment.disable();
    } else {
      this.formDepartment.enable();
    }
  };
}
