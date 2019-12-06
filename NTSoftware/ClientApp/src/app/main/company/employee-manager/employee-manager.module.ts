import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  EmployeeListComponent,
  DialogConfirmDeleteE
} from "./employee-list/employee-list.component";
import { EmployeeManagerRoutingModule } from "./employee-manager-routing.module";
import { EmployeeAddComponent } from "./employee-add/employee-add.component";
import {
  EmployeeDetailComponent,
  DialogAddContractEmployee,
  DialogConfirmDeleteCE,
  DialogDetailContractE
} from "./employee-detail/employee-detail.component";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule
} from "@nebular/theme";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ShareModule } from "../../../shared/share/share.module";
import { EditorModule } from "@tinymce/tinymce-angular";
@NgModule({
  declarations: [
    DialogAddContractEmployee,
    EmployeeListComponent,
    EmployeeAddComponent,
    EmployeeDetailComponent,
    DialogConfirmDeleteE,
    DialogConfirmDeleteCE,
    DialogDetailContractE
  ],
  imports: [
    CommonModule,
    EmployeeManagerRoutingModule,
    ShareModule,
    NbCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    NbIconModule,
    NbButtonModule,
    MatButtonModule,
    NbInputModule,
    EditorModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule
  ],
  entryComponents: [
    DialogAddContractEmployee,
    DialogConfirmDeleteCE,
    DialogConfirmDeleteE,
    DialogDetailContractE
  ]
})
export class EmployeeManagerModule {}
