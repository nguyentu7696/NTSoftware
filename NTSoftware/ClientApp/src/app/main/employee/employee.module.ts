import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmployeeRoutingModule } from "./employee-routing.module";
import { EmployeeInfoComponent } from "./employee-info/employee-info.component";
import { ShareModule } from "../../shared/share/share.module";
import { ThemeModule } from "../../common/theme/theme.module";
import { EmployeeComponent, DialogLogout } from "./employee.component";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule
} from "@nebular/theme";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditorModule } from "@tinymce/tinymce-angular";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { DepartmentInfoComponent } from "./department-info/department-info.component";
import { MatListModule } from "@angular/material/list";

@NgModule({
  declarations: [
    EmployeeInfoComponent,
    EmployeeComponent,
    DepartmentInfoComponent,
    DialogLogout
  ],

  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ShareModule,
    ThemeModule,

    NbMenuModule,

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
    FormsModule,
    MatListModule
  ],
  entryComponents: [DialogLogout]
})
export class EmployeeModule {}
