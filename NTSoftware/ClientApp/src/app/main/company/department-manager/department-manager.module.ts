import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DepartmentManagerRoutingModule} from "./department-manager-routing.module";
import {
  DepartmentListComponent,
  DialogDeleteDepartment
} from './department-list/department-list.component';
import {NbButtonModule, NbCardModule, NbIconModule} from "@nebular/theme";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ShareModule} from "../../../shared/share/share.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DepartmentAddComponent } from './department-add/department-add.component';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { DepartmentDetailComponent } from './department-detail/department-detail.component';
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from '@angular/material/list';


@NgModule({
  declarations: [DepartmentListComponent, DepartmentAddComponent, DialogDeleteDepartment, DepartmentDetailComponent],
  entryComponents: [DialogDeleteDepartment],
  imports: [
    CommonModule,
    ShareModule,
    DepartmentManagerRoutingModule,
    NbCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    NbIconModule,
    NbButtonModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class DepartmentManagerModule { }
