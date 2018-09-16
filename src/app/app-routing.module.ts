import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {AuthGuard} from "./@core/services/auth.guard";
import {AuthModule} from "./pages/auth/auth.module";
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import {PagesModule} from "./pages/pages.module";
import {LoginComponent} from "./pages/auth/login/login.component";
import {LogoutComponent} from "./pages/auth/logout/logout.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {RegistrationRequestComponent} from "./pages/auth/register/request/request.component";

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => PagesModule,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => AuthModule,
  // },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'request-registration',
        component: RegistrationRequestComponent
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full'},
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};


@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRouting {
}
