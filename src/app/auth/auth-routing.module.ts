import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent, RegistrationRequestComponent, IsRequestHashValid, DataResolver } from './register';
import { ResetComponent , ResetRequestComponent} from './reset';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { CheckType } from '../@shared/enums';
import { AuthComponent } from './auth.component';
import { PreventLogged } from '../@core/services/auth.guard';
import { CountdownComponent } from '../pages/miscellaneous/countdown/countdown.component';

/**
 * @description Auth Routing
 */
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [PreventLogged],
        data: { title: 'Login' },
      },
      {
        path: 'cd',
        component: CountdownComponent,
        data: { tile: 'Countdown' },
      },
      {
        path: 'request-registration',
        component: RegistrationRequestComponent,
        canActivate: [PreventLogged],
        data: { title: 'Registration Request' },
      },
      {
        path: 'forgotten-credentials',
        component: ResetRequestComponent,
        canActivate: [PreventLogged],
        data: { title: 'Reset Request' },
      },
      {
        path: 'reset-credentials/:hash',
        component: ResetComponent,
        canActivate: [PreventLogged, IsRequestHashValid],
        data: { checkType: CheckType.PasswordReset, title: 'Password Reset' },
      },
      {
        path: 'registration/:hash',
        component: RegisterComponent,
        canActivate: [PreventLogged, IsRequestHashValid],
        resolve: { request: DataResolver },
        data: { checkType: CheckType.Registration, title: 'Registration' },
      },
      {
        path: 'logout',
        component: LogoutComponent,
        data: { title: 'Logout' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouting { }
