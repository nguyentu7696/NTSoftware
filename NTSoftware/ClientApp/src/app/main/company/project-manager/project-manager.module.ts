import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ProjectListComponent,
  DialogDeleteProject
} from "./project-list/project-list.component";
import { ProjectManagerRoutingModule } from "./project-manager-routing.module";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { ShareModule } from "../../../shared/share/share.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import { MatListModule } from "@angular/material/list";
import { ProjectAddComponent } from "./project-add/project-add.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { MatDatepickerModule } from "@angular/material/datepicker";

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectAddComponent,
    ProjectDetailComponent,
    DialogDeleteProject
  ],
  imports: [
    CommonModule,
    NbButtonModule,
    MatSelectModule,
    MatListModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    NbCardModule,
    NbIconModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    ShareModule,
    MatTableModule,
    ProjectManagerRoutingModule
  ],
  entryComponents: [DialogDeleteProject]
})
export class ProjectManagerModule {}
