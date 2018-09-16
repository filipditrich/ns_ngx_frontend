import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DataResolver, IsRequestHashValid } from "./register/request/request-validator.guard";
import { CheckType } from "../../@core/enums/check.enum";
/**
 * Components
 */
import { RegisterComponent } from "./register/register.component";
import { RegistrationRequestComponent } from "./register/request/request.component";
import { ResetRequestComponent } from "./reset/request/request.component";
import { ResetComponent } from "./reset/reset.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";

const routes: Routes = [
  {
    path: 'registration/:hash',
    component: RegisterComponent,
    // canActivate: [IsRequestHashValid],
    // resolve: { request: DataResolver },
    // data: { checkType: CheckType.Registration }
  },
  {
    path: 'request-registration',
    component: RegistrationRequestComponent
  },
  {
    path: 'forgotten-credentials',
    component: ResetRequestComponent
  },
  {
    path: 'password-reset/:hash',
    component: ResetComponent,
    // canActivate: [IsRequestHashValid],
    // data: { checkType: CheckType.PasswordReset }
  },
  {
    path: 'logout',
    component: LogoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRouting { }
