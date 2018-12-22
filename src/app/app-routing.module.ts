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
    loadChildren: () => PagesModule,
    canActivate: [ AuthGuard ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule,
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
  onSameUrlNavigation: 'reload',
};


@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRouting {
}
