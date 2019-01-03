import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthGuard } from './@core/services/auth.guard';
import { translate } from './@shared/helpers';
import { PagesModule } from './pages';
import { AuthModule } from './auth';
import { NotFoundComponent } from './pages/miscellaneous/not-found/not-found.component';

/**
 * App routing
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
  {
    path: 'pages',
    canActivate: [ AuthGuard ],
    loadChildren: environment.production ? './pages/pages.module#PagesModule' : () => PagesModule,
  },
  {
    path: 'auth',
    loadChildren: environment.production ? './auth/auth.module#AuthModule' : () => AuthModule,
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: translate('NOT_FOUND') },
  },
];

const config: ExtraOptions = {
  useHash: true,
  onSameUrlNavigation: 'reload',
};


@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRouting {
}
