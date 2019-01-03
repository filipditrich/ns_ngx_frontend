import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
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
    // loadChildren: './pages/pages.module#PagesModule',
    loadChildren: () => PagesModule,
  },
  {
    path: 'auth',
    // loadChildren: './auth/auth.module#AuthModule',
    loadChildren: () => AuthModule,
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
