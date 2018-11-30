import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './@core/services/auth.guard';
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
    loadChildren: './pages/pages.module#PagesModule',
    canActivate: [ AuthGuard ],
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      title: 'Not Found',
    },
  },
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
