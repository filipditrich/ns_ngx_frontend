import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { MatchesResultsComponent } from './matches/matches-results/matches-results.component';
import { AdminModule } from './admin';
import { PlayerEnrollmentComponent } from './matches/player-enrollment/player-enrollment.component';
import { PrintMatchComponent } from './matches/print-match/print-match.component';
import { RoleGuard} from '../@core/services/auth.guard';
import { UserRoles } from '../@core/enums/user.enum';

/**
 * Pages routing settings
 */
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
            component: PlayerEnrollmentComponent,
            data: { title: 'Matches' },
          },
          {
            path: 'results',
            component: MatchesResultsComponent,
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
        loadChildren: () => AdminModule,
        canActivate: [ RoleGuard ],
        data: { roles: [ UserRoles.admin ], title: 'Admin' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRouting {
}
