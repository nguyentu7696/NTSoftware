import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "../../../../common/services/app.service";
import { CommonService } from "../../../../common/method";
import { CURRENT_USER } from "../../../../constants/localStorageKey";
import { StateMatcher, EmptyOrNull } from "../../../../shared/validate";
import {
  DepartmentAPIs,
  DetailUserAPIs,
  PriceContractAPIs,
  RuleAPIs
} from "../../../../constants/api";
import { Router } from "@angular/router";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
  selector: "app-department-add",
  templateUrl: "./department-add.component.html",
  styleUrls: ["./department-add.component.scss"]
})
export class DepartmentAddComponent implements OnInit {
  initLisEmployee: any[] = [];
  formDepartment: FormGroup;
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
    private commonService: CommonService // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log(this.currentUser);
    this.initialForm();
    this.onCheckPermission();
    // this.getEmployeeNoDepartment();
    this.onGetEmployee();
  }
  onCheckPermission() {
    this.appService
      .get(DepartmentAPIs.CHECK_PERMISSION, () => {}, {
        companyId: JSON.parse(localStorage.getItem(CURRENT_USER)).CompanyId
      })
      .subscribe((res: any) => {});
  }
  onChangeSearch(e) {
    let lstVm = this.formDepartment.controls.lstEmployee.value.join(";");
    this.appService
      .get(DetailUserAPIs.GET_SELECT_DEPARTMENT, () => {}, {
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
    this.formDepartment.controls.lstEmployee.value.push(event.option.value);
    console.log(this.formDepartment.controls.lstEmployee.value);
    this.lstSelectedEmployee.push({
      id: event.option.value,
      name: event.option.viewValue
    });
    this.employeeControl.setValue("");
  }

  ngOnInit() {}

  onChangeManager(e) {
    console.log(e);
    if (e.value) {
      this.selectedEmployee = e.value;
      this.formDepartment.controls.managerId.setValue(e.value);
      console.log(this.formDepartment.value);
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
    this.formDepartment = this.fb.group({
      departmentName: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
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
      address: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
      description: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
      managerId: ["", Validators.required],
      companyId: [companyId],
      lstEmployee: [this.initLisEmployee]
    });
  }

  onAddDepartment() {
    this.formDepartment.markAllAsTouched();
    console.log(this.formDepartment);
    if (!this.formDepartment.invalid) {
      this.toggleOnRequest();
      this.appService
        .post(
          DepartmentAPIs.ADD,
          this.toggleOnRequest,
          this.formDepartment.value
        )
        .subscribe((res: any) => {
          this.toggleOnRequest();
          if (res.success) {
            this.commonService.showAlert(
              "Thêm thành công",
              "success",
              "Thông báo"
            );
            this.route.navigate([
              "/company/department-manager/department-list"
            ]);
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
