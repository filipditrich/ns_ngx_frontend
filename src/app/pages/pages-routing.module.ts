import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { translate } from '../@shared/helpers';
import { GalleryComponent } from './gallery/gallery.component';
import { NewsComponent } from './news/news.component';
import { PagesComponent } from './pages.component';
import { MatchResultsComponent } from './matches/match-results/match-results.component';
import { AdminModule } from './admin';
import { PlayerEnrollmentComponent } from './matches/player-enrollment/player-enrollment.component';
import { PrintMatchComponent } from './matches/print-match/print-match.component';
import { RoleGuard} from '../@core/services/auth.guard';
import { UserRoles } from '../@shared/enums';
import { MatchGroupComponent } from './matches/player-enrollment/match-group/match-group.component';
import { SettingsComponent } from './settings/settings.component';
import { UserModule } from './user/user.module';
import { GoldenStickComponent } from './club-awards/golden-stick/golden-stick.component';
import { TripleClubComponent } from './club-awards/triple-club/triple-club.component';
import { RepresentationComponent } from './club-awards/representation/representation.component';
import { RealisationTeamComponent } from './realisation-team/realisation-team.component';

/**
 * Pages routing settings
 */
// TODO: loadChildren fix for prod and dev environment
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    data: { title: translate('HOME') },
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
            data: { title: translate('MATCHES') },
          },
          {
            path: 'gn/:group',
            component: MatchGroupComponent,
            data: { title: translate('MATCH_GROUP') },
          },
          {
            path: 'results',
            component: MatchResultsComponent,
            data: { title: translate('MATCH_RESULTS') },
          },
          {
            path: 'print/:id',
            component: PrintMatchComponent,
            data: { title: translate('MATCH_DETAIL') },
          },
        ],
      },
      {
        path: 'realisation-team',
        component: RealisationTeamComponent,
        data: { title: translate('REALISATION_TEAM') },
      },
      {
        path: 'club-awards',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'golden-stick',
          },
          {
            path: 'golden-stick',
            component: GoldenStickComponent,
            data: { title: translate('GOLDEN_STICK') },
          },
          {
            path: 'triple-club',
            component: TripleClubComponent,
            data: { title: translate('TRIPLE_CLUB') },
          },
          {
            path: 'representation',
            component: RepresentationComponent,
            data: { title: translate('REPRESENTATION') },
          },
        ],
      },
      {
        path: 'gallery',
        component: GalleryComponent,
        data: { title: translate('GALLERY') },
      },
      {
        path: 'news',
        component: NewsComponent,
        data: { title: translate('NEWS') },
      },
      {
        path: 'admin',
        canActivate: [ RoleGuard ],
        data: { roles: [ UserRoles.admin ], title: translate('ADMIN') },
        // loadChildren: './admin/admin.module#AdminModule',
        loadChildren: () => AdminModule,
      },
      {
        path: 'user',
        data: { title: translate('PROFILE') },
        // loadChildren: './user/user.module#UserModule',
        loadChildren: () => UserModule,
      },
      {
        path: 'settings',
        data: { title: translate('SETTINGS') },
        component: SettingsComponent,
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
