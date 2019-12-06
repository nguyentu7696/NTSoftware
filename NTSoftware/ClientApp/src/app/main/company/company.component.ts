import { AfterContentInit, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NbMenuItem } from "@nebular/theme";
import { AppService } from "src/app/common/services/app.service";
import { ContractAPIs } from "src/app/constants/api";
import { CURRENT_USER } from "src/app/constants/localStorageKey";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"]
})
export class CompanyComponent implements OnInit, AfterContentInit {
  currentUser: any;
  MENU_ITEMS: NbMenuItem[] = [
    {
      title: "Quản lý nhân viên",
      icon: "person-outline",
      link: "/company/employee-manager/employee-list"
    },

    {
      title: "Quản lý điều khoản",
      icon: "archive-outline",
      link: "/company/rule-list"
    },
    {
      title: "Lịch sử sử dụng",
      icon: "globe-outline",
      link: "/company/history"
    }
  ];
  // {
  //   title: 'Quản lý phòng ban',
  //   icon: 'npm-outline',
  //   link: '/company/department-manager/department-list',

  // },
  // {
  //   title: 'Quản lý dự án',
  //   icon: 'book-outline',
  //   link: '/company/project-manager/project-list',
  // },
  loaded: boolean = false;
  constructor(
    public translate: TranslateService,
    private appService: AppService
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log(this.currentUser);
  }

  ngOnInit() {
    this.appService
      .get(ContractAPIs.GET_ALL_FUNCTION, () => {}, {
        companyId: this.currentUser.CompanyId
      })
      .subscribe((res: any) => {
        if (res.success) {
          console.log(res.data);
          if (Array.isArray(res.data)) {
            res.data.forEach(element => {
              this.MENU_ITEMS.push({
                title: element.name,
                icon: element.iconName,
                link: element.url
              });
            });
          }
        }
      });
  }
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }
}
