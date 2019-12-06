import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../common/services/auth.service";
import { NbRequestPasswordComponent } from "@nebular/auth";
import { TranslateService } from "@ngx-translate/core";
import { NbAuthService, NB_AUTH_OPTIONS } from "@nebular/auth";
import { AccountAPIs } from "src/app/constants/api";
@Component({
  selector: "app-reset-password",
  templateUrl: "./request-password.component.html",
  styleUrls: ["./request-password.component.scss"]
})
export class RequestPasswordComponent extends NbRequestPasswordComponent
  implements OnInit {
  ngOnInit() {}
  // tslint:disable-next-line:max-line-length
  constructor(
    private authService: AuthService,
    public translate: TranslateService,
    public service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) public options = {},
    public cd: ChangeDetectorRef,
    public router: Router
  ) {
    super(service, options, cd, router);
  }
  requestPass() {
    this.submitted = true;
    this.errors = null;
    this.messages = null;
    this.authService
      .onRequestPassword(AccountAPIs.REQUEST_PASSWORD, this.user)
      .subscribe(
        (res: any) => {
          this.submitted = false;
          console.log(res);
          if (res.success === false) {
            this.errors = [res.message];
          } else {
            this.messages = [
              this.translate.instant("auth.requestPassword.sendEmailSucces")
            ];
          }
        },
        error => {
          this.submitted = false;
          console.log(error);
        }
      );
  }
}
