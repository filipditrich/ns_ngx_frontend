/**
 * Module Specific Imports
 */
import { AuthComponent } from './auth.component';
import { AuthRouting } from './auth-routing.module';
import { DataResolver, IsRequestHashValid } from './register';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAuthModule } from '@nebular/auth';
/**
 * Components
 */
import { RegisterComponent, RegistrationRequestComponent } from './register';
import { ResetComponent, ResetRequestComponent } from './reset';
import { LoginComponent, LoginService } from './login';
import { LogoutComponent } from './logout';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRouting,
    ReactiveFormsModule,
    ThemeModule,
    NbAuthModule,
  ],
  declarations: [
    AuthComponent,
    RegisterComponent,
    RegistrationRequestComponent,
    ResetComponent,
    ResetRequestComponent,
    LoginComponent,
    LogoutComponent,
  ],
  providers: [
    [IsRequestHashValid],
    [DataResolver],
    [LoginService],
  ],
})
export class AuthModule { }
