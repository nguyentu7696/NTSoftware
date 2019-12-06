import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import {
  NbThemeModule,
  NbLayoutModule,
  NbCardModule,
  NbIconModule,
  NbSidebarModule,
  NbDatepickerModule,
  NbMenuModule,
  NbToastrModule
} from "@nebular/theme";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AuthService } from "./common/services/auth.service";
import { SignalRService } from "./common/services/signalR.service";
import { AppService } from "./common/services/app.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import {
  NbPasswordAuthStrategy,
  NbAuthModule,
  NbAuthService
} from "@nebular/auth";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NbMomentDateModule } from "@nebular/moment";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { AdminGuard } from "./guards/admin.guard";
import { CompanyGuard } from "./guards/company.guard";
import { EmployeeGuard } from "./guards/employee.guard";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CompanyComponent } from "./main/company/company.component";
import { EmployeeComponent } from "./main/employee/employee.component";
import { NotFoundComponent } from "./main/not-found/not-found.component";
import { ShareModule } from "./shared/share/share.module";
import { ThemeModule } from "./common/theme/theme.module";
import vi from "date-fns/locale/vi";
export function getToken() {
  return localStorage.getItem("currentUser");
}
@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NbEvaIconsModule,
    NbCardModule,
    NbToastrModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({
      format: "dd/MM/yyyy",
      parseOptions: { awareOfUnicodeTokens: true, locale: vi },
      formatOptions: { awareOfUnicodeTokens: true, locale: vi }
    }),
    ShareModule,
    NbIconModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: "email"
        })
      ],
      forms: {
        validation: {
          password: {
            required: true,
            minLength: 8,
            maxLength: 50
          },
          code: {
            required: true
          }
        }
      }
    }),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbMomentDateModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    JwtModule.forRoot({
      config: {
        throwNoTokenError: false,
        tokenGetter: getToken,
        whitelistedDomains: ["localhost:4567"]
      }
    }),
    ThemeModule
  ],
  providers: [
    AuthService,
    AdminGuard,
    CompanyGuard,
    EmployeeGuard,
    AppService,
    SignalRService
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule {}
