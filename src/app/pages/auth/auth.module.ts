import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
/**
 * Module Specific Imports
 */
import {AuthComponent} from "./auth.component";
import {AuthRouting} from "./auth-routing.module";
import {DataResolver, IsRequestHashValid} from "./register/request/request-validator.guard";
/**
 * Components
 */
import { RegisterComponent } from "./register/register.component";
import { RegistrationRequestComponent } from "./register/request/request.component";
import { ResetComponent } from "./reset/reset.component";
import { ResetRequestComponent } from "./reset/request/request.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {LoginService} from "./login/login.service";
import {ThemeModule} from "../../@theme/theme.module";

@NgModule({
  imports: [
    CommonModule,
    AuthRouting,
    ReactiveFormsModule,
    ThemeModule
  ],
  declarations: [AuthComponent, RegisterComponent , RegistrationRequestComponent, ResetComponent, ResetRequestComponent, LoginComponent, LogoutComponent],
  providers: [
    [IsRequestHashValid],
    [DataResolver],
    [LoginService]
  ]
})
export class AuthModule { }
