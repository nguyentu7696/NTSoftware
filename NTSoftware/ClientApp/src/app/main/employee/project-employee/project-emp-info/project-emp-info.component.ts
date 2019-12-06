import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DetailUserAPIs, ProjectAPIs } from "../../../../constants/api";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "../../../../common/services/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../../common/method";
import { CURRENT_USER } from "../../../../constants/localStorageKey";
import { DateLessThanNow, EmptyOrNull } from "../../../../shared/validate";
import * as moment from "moment";

@Component({
  selector: "app-project-emp-info",
  templateUrl: "./project-emp-info.component.html",
  styleUrls: ["./project-emp-info.component.scss"]
})
export class ProjectEmpInfoComponent implements OnInit {
  isEdit: boolean = false;
  formProject: FormGroup;
  currentUser: any;
  projectId: any;
  project: any;
  employeeList: any = [];

  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private route: Router,
    public activeRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    this.projectId = activeRoute.snapshot.queryParams["project"];
    this.initialForm();
    this.onGetEmployee();
    this.getProject();
  }

  ngOnInit() {}

  getProject() {
    /*this.appService
      .get(ProjectAPIs.GET_BY_ID, () => {
      }, {
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
      });*/
  }

  onGetEmployee() {
    /*this.appService
      .get(DetailUserAPIs.GET_ALL, () => {
      }, {
        companyId: parseInt(this.currentUser.CompanyId)
      })
      .subscribe((res: any) => {
        if (res.success) {
          this.employeeList = Array.isArray(res.data) ? res.data : [];
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });*/
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
      managerId: ["", [EmptyOrNull.SpaceValidator, Validators.required]],
      companyId: [companyId],
      lstEmployee: [[]]
    });
  }

  onToggleEdit() {
    this.isEdit = !this.isEdit;
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
}
