import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectEmployeeRoutingModule} from "./project-employee-routing.module";
import {ProjectEmpLstComponent} from "./project-emp-lst/project-emp-lst.component";
import {ProjectEmpInfoComponent} from "./project-emp-info/project-emp-info.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NbButtonModule, NbCardModule, NbIconModule} from "@nebular/theme";
import {MatTableModule} from "@angular/material/table";
import {ShareModule} from "../../../shared/share/share.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatListModule} from "@angular/material/list";



@NgModule({
  declarations: [
    ProjectEmpLstComponent,
    ProjectEmpInfoComponent
  ],
  imports: [
    CommonModule,
    ProjectEmployeeRoutingModule,
    MatProgressBarModule,
    NbCardModule,
    MatTableModule,
    ShareModule,
    NbIconModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
    NbButtonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatListModule,
  ]
})
export class ProjectEmployeeModule { }
