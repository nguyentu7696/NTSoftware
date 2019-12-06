import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DepartmentListComponent} from "./department-list/department-list.component";
import {DepartmentAddComponent} from "./department-add/department-add.component";
import {DepartmentDetailComponent} from "./department-detail/department-detail.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'department-list',
  },
  {
    path: "department-list",
    component: DepartmentListComponent
  },
  {
    path: "department-add",
    component: DepartmentAddComponent,
  },
  {
    path: "department-detail",
    component: DepartmentDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentManagerRoutingModule { }
