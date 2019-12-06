import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
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

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRippleModule, MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";

import { ShareModule } from "../../shared/share/share.module";
import { AdminComponent } from "./admin.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ThemeModule } from "../../common/theme/theme.module";
import {
  CompanyListComponent,
  DialogConfirm
} from "./company-list/company-list.component";
import { ConfirmFinish } from "./detail-company/confirm-finish.component";
import {
  ListPriceComponent,
  DialogDelete,
  DialogAddUpdate
} from "./list-price/list-price.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import {
  DetailCompanyComponent,
  DialogAddContract,
  DialogDetailContract,
  DialogConfirmDeleteCC
} from "./detail-company/detail-company.component";
import { AddCompanyComponent } from "./add-company/add-company.component";
import {
  ListRuleComponent,
  DialogAddUpdateRule,
  DialogDeleteRule,
  DialogDetailRule
} from "./list-rule/list-rule.component";
import {
  ProfileComponent,
  DialogChangePassword,
  DialogChangeLogo
} from "./profile/profile.component";
import { HistoryUseComponent } from "./history-use/history-use.component";
import { DpDatePickerModule } from "ng2-date-picker";
@NgModule({
  declarations: [
    AdminComponent,
    DialogConfirmDeleteCC,
    CompanyListComponent,
    DialogConfirm,
    DialogDelete,
    DialogDetailContract,
    ConfirmFinish,
    DialogDeleteRule,
    DialogAddUpdateRule,
    DialogDetailRule,
    DialogChangePassword,
    DialogAddContract,
    ListPriceComponent,
    DialogChangeLogo,
    DialogAddUpdate,
    DetailCompanyComponent,
    AddCompanyComponent,
    ListRuleComponent,
    ProfileComponent,
    HistoryUseComponent
  ],
  entryComponents: [
    DialogConfirm,
    DialogDelete,
    DialogAddContract,
    DialogDetailContract,
    DialogAddUpdate,
    DialogAddUpdateRule,
    ConfirmFinish,
    DialogConfirmDeleteCC,
    DialogDeleteRule,
    DialogChangePassword,
    DialogChangeLogo,
    DialogDetailRule
  ],
  exports: [],
  imports: [
    CommonModule,
    DpDatePickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    EditorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    NbButtonModule,
    NbIconModule,
    NbLayoutModule,

    ShareModule,
    AdminRoutingModule,
    NbMenuModule,
    NbDialogModule.forRoot(),

    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    NbCardModule,
    ThemeModule
  ]
})
export class AdminModule {}
