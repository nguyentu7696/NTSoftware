import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CompanyRoutingModule} from './company-routing.module';
import {
  NbCardModule,
  NbInputModule,
  NbIconModule,
  NbLayoutModule,
  NbButtonModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule
} from "@nebular/theme";
import {ThemeModule} from "../../common/theme/theme.module";
import {CompanyComponent} from "./company.component";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EditorModule} from "@tinymce/tinymce-angular";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {
  DialogAddUpdateRuleForCompany,
  DialogDeleteRuleForCompany, DialogDetailRuleForCompany,
  RuleCompanyListComponent
} from './rule-company-list/rule-company-list.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {ShareModule} from "../../shared/share/share.module";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [
    CompanyComponent,
    RuleCompanyListComponent,
    DialogDeleteRuleForCompany,
    DialogAddUpdateRuleForCompany,
    DialogDetailRuleForCompany,
    HistoryComponent
  ],
  entryComponents: [
    DialogDeleteRuleForCompany,
    DialogAddUpdateRuleForCompany,
    DialogDetailRuleForCompany
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    NbMenuModule,
    ThemeModule,
    ShareModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    EditorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatProgressBarModule,

    MatRippleModule,
    MatInputModule,

    NbMenuModule,
    NbDialogModule.forRoot(),

    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    MatPaginatorModule,
    MatTooltipModule,
    NbIconModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    NbCardModule,
    NbButtonModule,
    MatButtonModule,
  ]
})
export class CompanyModule {
}
