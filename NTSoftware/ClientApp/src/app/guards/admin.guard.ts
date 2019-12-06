import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import {
  TOKEN_ADMIN,
  CURRENT_USER,
  LANGUAGE_LOCAL
} from "../constants/localStorageKey/index";
import { LOGIN_ROUTE_NAME } from "../constants/routes/index";
import { AppService } from "../common/services/app.service";
import { AccountAPIs } from "../constants/api";
@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate {
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private appService: AppService
  ) {}
  async canActivate() {
    const token = localStorage.getItem(TOKEN_ADMIN);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    const currentUser = localStorage.getItem(CURRENT_USER);
    if (currentUser) {
      let user = JSON.parse(currentUser);
      this.appService
        .post(AccountAPIs.LOG_OUT, () => {}, {
          CompanyId: user.CompanyId,
          UserId: user.UserId
        })
        .subscribe((res: any) => {});
    }
    this.router.navigate([LOGIN_ROUTE_NAME]);
    return false;
  }
}
