import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectEmpLstComponent} from "./project-emp-lst/project-emp-lst.component";
import {ProjectEmpInfoComponent} from "./project-emp-info/project-emp-info.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'project-emp-list',
  },
  {
    path: "project-emp-list",
    component: ProjectEmpLstComponent
  },
  {
    path: "project-emp-info",
    component: ProjectEmpInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectEmployeeRoutingModule {
}
