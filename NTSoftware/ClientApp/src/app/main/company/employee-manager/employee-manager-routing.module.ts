import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {EmployeeAddComponent} from "./employee-add/employee-add.component";
import {EmployeeDetailComponent} from "./employee-detail/employee-detail.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'employee-list',
  },
  {
    path: "employee-add",
    component: EmployeeAddComponent
  },
  {
    path: "employee-list",
    component: EmployeeListComponent
  },
  {
    path: "employee-detail",
    component: EmployeeDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagerRoutingModule { }
