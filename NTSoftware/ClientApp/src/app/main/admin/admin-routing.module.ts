import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { CompanyListComponent } from "./company-list/company-list.component";
import { AddCompanyComponent } from "./add-company/add-company.component";
import { DetailCompanyComponent } from "./detail-company/detail-company.component";
import { ListPriceComponent } from "./list-price/list-price.component";
import { ListRuleComponent } from "./list-rule/list-rule.component";
import { ProfileComponent } from "./profile/profile.component";
import { HistoryUseComponent } from "./history-use/history-use.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        redirectTo: "company-list"
      },
      {
        path: "company-list",
        component: CompanyListComponent
      },
      {
        path: "company-add",
        component: AddCompanyComponent
      },
      {
        path: "company-detail",
        component: DetailCompanyComponent
      },
      {
        path: "price-list",
        component: ListPriceComponent
      },
      {
        path: "rule-list",
        component: ListRuleComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "history-use",
        component: HistoryUseComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
