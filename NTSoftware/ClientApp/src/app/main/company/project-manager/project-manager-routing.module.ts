import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectListComponent} from "./project-list/project-list.component";
import {ProjectDetailComponent} from "./project-detail/project-detail.component";
import {ProjectAddComponent} from "./project-add/project-add.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'project-list',
  },
  {
    path: "project-list",
    component: ProjectListComponent
  },
  {
    path: "project-add",
    component: ProjectAddComponent
  },
  {
    path: "project-detail",
    component: ProjectDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }
