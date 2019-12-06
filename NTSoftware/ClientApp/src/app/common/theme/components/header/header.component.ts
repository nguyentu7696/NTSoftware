import { Component, Inject, OnInit } from "@angular/core";
import { NbMenuService, NB_WINDOW, NbSidebarService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { LANGUAGE_LOCAL } from "../../../../constants/localStorageKey";
import { Router } from "@angular/router";
import { CURRENT_USER } from "../../../../constants/localStorageKey/index";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "../../../method/index";
import { BASE_API, AccountAPIs, NotifyAPIs } from "src/app/constants/api";
import { AppService } from "src/app/common/services/app.service";
import { LOGIN_ROUTE_NAME } from "src/app/constants/routes";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  userMenu: any;
  userPictureOnly: boolean = false;
  currentUser: any;
  profile: string = "";
  pathAvatar: string = "http://localhost:8080/Resource/default.png";
  logout: string = "";
  constructor(
    private commonService: CommonService,
    public translate: TranslateService,
    private route: Router,
    private appService: AppService,
    private nbMenuService: NbMenuService,
    private sidebarService: NbSidebarService,
    @Inject(NB_WINDOW) private window
  ) {
    translate.setDefaultLang("vi");
    translate.get("menu.profile").subscribe(res => {
      this.profile = res;
    });
    translate.get("menu.logout").subscribe(res => {
      this.logout = res;
    });
  }

  ngOnInit() {
    this.userMenu = [
      {
        title: this.profile
      },
      { title: this.logout }
    ];
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log(this.currentUser);
    if (this.currentUser.Logo !== "") {
      this.pathAvatar = BASE_API + this.currentUser.Logo;
    }
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "my-context-menu"),
        map(({ item: { title } }) => title),
        filter(title => title === this.logout)
      )
      .subscribe(title => this.onLogout());

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "my-context-menu"),
        map(({ item: { title } }) => title),
        filter(title => title === this.profile)
      )
      .subscribe(title => this.onGotoProfile());
  }

  onLogout() {
    const currentUser = localStorage.getItem(CURRENT_USER);
    if (currentUser) {
      let user = JSON.parse(currentUser);
      this.appService
        .post(AccountAPIs.LOG_OUT, () => {}, {
          companyId: user.CompanyId,
          userId: user.UserId
        })
        .subscribe((res: any) => {
          this.commonService.logout();
        });
      this.appService
        .post(NotifyAPIs.AUTHEN_USER, () => {}, {
          companyId: user.CompanyId,
          userId: user.UserId,
          name: JSON.parse(currentUser).Name
        })
        .subscribe((res: any) => {});
    } else {
      this.commonService.logout();
    }
  }
  onGotoProfile() {
    switch (this.currentUser.UserType) {
      case "AdminNT":
        this.route.navigate(["admin/profile"]);
        break;
      case "AdminCompany":
        this.route.navigate(["company/profile"]);
        break;
      case "Employee":
        this.route.navigate(["employee/employee-info"]);
        break;
      default:
        break;
    }
  }
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    return false;
  }
}
