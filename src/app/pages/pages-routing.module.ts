import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { MatchResultsComponent } from './matches/match-results/match-results.component';
import { AdminModule } from './admin';
import { PlayerEnrollmentComponent } from './matches/player-enrollment/player-enrollment.component';
import { PrintMatchComponent } from './matches/print-match/print-match.component';
import { RoleGuard} from '../@core/services/auth.guard';
import { UserRoles } from '../@shared/enums';
import { MatchGroupComponent } from './matches/player-enrollment/match-group/match-group.component';
import { UserModule } from './user/user.module';

/**
 * Pages routing settings
 */
// TODO: translate data.title for routes
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    data: { title: 'Home' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'matches',
      },
      {
        path: 'matches',
        children: [
          {
            path: '',
            redirectTo: 'all',
            pathMatch: 'full',
          },
          {
            path: 'all',
            component: PlayerEnrollmentComponent,
            data: { title: 'Matches' },
          },
          {
            path: 'gn/:group',
            component: MatchGroupComponent,
            data: { title: 'Match Group' },
          },
          {
            path: 'results',
            component: MatchResultsComponent,
            data: { title: 'Match Results' },
          },
          {
            path: 'print/:id',
            component: PrintMatchComponent,
            data: { title: 'Match Print' },
          },
        ],
      },
      {
        path: 'admin',
        // loadChildren: () => AdminModule,
        loadChildren: './admin/admin.module#AdminModule',
        canActivate: [ RoleGuard ],
        data: { roles: [ UserRoles.admin ], title: 'Admin' },
      },
      // {
      //   path: 'user',
      //   loadChildren: () => UserModule,
      //   data: { title: 'User' },
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRouting {
}
