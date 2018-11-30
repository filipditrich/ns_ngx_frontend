import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent, RegistrationRequestComponent, IsRequestHashValid, DataResolver } from './register';
import { ResetComponent , ResetRequestComponent} from './reset';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { NbAuthComponent } from '@nebular/auth';
import { CheckType } from '../@core/enums/check.enum';

/**
 * @description Auth Routing
 */
const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' },
      },
      {
        path: 'request-registration',
        component: RegistrationRequestComponent,
        data: { title: 'Registration Request' },
      },
      {
        path: 'forgotten-credentials',
        component: ResetRequestComponent,
        data: { title: 'Reset Request' },
      },
      {
        path: 'reset-credentials/:hash',
        component: ResetComponent,
        canActivate: [IsRequestHashValid],
        data: { checkType: CheckType.PasswordReset, title: 'Password Reset' },
      },
      {
        path: 'registration/:hash',
        component: RegisterComponent,
        canActivate: [IsRequestHashValid],
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
