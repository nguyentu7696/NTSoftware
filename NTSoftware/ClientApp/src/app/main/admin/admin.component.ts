import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit
} from "@angular/core";

import { NbMenuItem } from "@nebular/theme";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { SignalRService } from "src/app/common/services/signalR.service";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit, AfterContentInit {
  MENU_ITEMS: NbMenuItem[] = [
    {
      title: "Quản lý công ty",
      icon: "grid-outline",
      pathMatch: "full",
      link: "/admin/company-list"
    },
    {
      title: "Quản lý cấp độ dịch vụ",
      icon: "pantone-outline",
      pathMatch: "full",
      link: "/admin/price-list"
    },
    {
      title: "Quản lý điều khoản",
      icon: "archive-outline",
      pathMatch: "full",
      link: "/admin/rule-list"
    }
  ];
  loaded: boolean = false;
  constructor(public translate: TranslateService) {
    translate.setDefaultLang("vi");
  }
  ngOnInit() {}
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }
}
