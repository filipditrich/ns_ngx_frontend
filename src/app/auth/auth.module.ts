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
import { HttpHeadersInterceptor } from '../@core/services/http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '../@shared/shared.module';
import { CountdownComponent } from '../pages/miscellaneous/countdown/countdown.component';
import { NbSpinnerModule } from '@nebular/theme';

@NgModule({
  imports: [
    CommonModule,
    AuthRouting,
    ReactiveFormsModule,
    ThemeModule,
    NbAuthModule,
    SharedModule,
    NbSpinnerModule,
  ],
  declarations: [
    AuthComponent,
    RegisterComponent,
    RegistrationRequestComponent,
    ResetComponent,
    ResetRequestComponent,
    LoginComponent,
    LogoutComponent,
    CountdownComponent,
  ],
  providers: [
    [IsRequestHashValid],
    [DataResolver],
    [LoginService],
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule { }
