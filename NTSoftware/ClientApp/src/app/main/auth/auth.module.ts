import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NbAuthModule, NbAuthService } from "@nebular/auth";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbCardModule,
  NbLayoutModule
} from "@nebular/theme";
import { NbIconModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./auth.component";
import { RequestPasswordComponent } from "./request-password/request-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ShareModule } from "../../shared/share/share.module";
@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    RequestPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    AuthRoutingModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbIconModule,
    NbAuthModule
  ],
  providers: [NbAuthService]
})
export class AuthModule {}
