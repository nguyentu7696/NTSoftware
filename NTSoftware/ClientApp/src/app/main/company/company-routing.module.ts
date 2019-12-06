import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { RuleCompanyListComponent } from "./rule-company-list/rule-company-list.component";
import { HistoryComponent } from "./history/history.component";

const routes: Routes = [
  {
    path: "",
    component: CompanyComponent,
    children: [
      {
        path: "",
        redirectTo: "employee-manager"
      },
      {
        path: "department-manager",
        loadChildren: () =>
          import(
            "../company/department-manager/department-manager.module"
          ).then(m => m.DepartmentManagerModule)
      },
      {
        path: "project-manager",
        loadChildren: () =>
          import("../company/project-manager/project-manager.module").then(
            m => m.ProjectManagerModule
          )
      },
      {
        path: "employee-manager",
        loadChildren: () =>
          import("../company/employee-manager/employee-manager.module").then(
            m => m.EmployeeManagerModule
          )
      },
      {
        path: "rule-list",
        component: RuleCompanyListComponent
      },
      {
        path: "history",
        component: HistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
