import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AlertsService } from '../@core/services/alerts/alerts.service';
import { DialogsService } from '../@core/services/dialogs/dialogs.service';
import { PreviousRouteService } from '../@core/services/previous-route.service';
import { PreventLogged, RoleCheck } from '../@core/services/auth.guard';
import { AuthGuard } from '../@core/services/auth.guard';
import { RoleGuard } from '../@core/services/auth.guard';
import { PagesRouting } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ToasterModule } from 'angular2-toaster';
import { AlertsComponent } from '../@core/services/alerts/alerts.component';
import { DialogsComponent } from '../@core/services/dialogs/dialogs.component';
import { Ng2SmartTableExtendedModule} from 'ng2-smart-table-extended';
import { MatchResultsComponent } from './matches/match-results/match-results.component';
import { MomentModule } from 'angular2-moment';
import { UserModule } from './user/user.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeadersInterceptor } from '../@core/services/http.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService} from './user/user.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SortablejsModule } from 'angular-sortablejs';
import { PlayerEnrollmentComponent } from './matches/player-enrollment/player-enrollment.component';
import { NbSpinnerModule, NbUserModule } from '@nebular/theme';
import { PlacesService } from './admin/places';
import { TeamsService } from './admin/teams';
import { GroupsService } from './admin/groups';
import { JerseysService } from './admin/jerseys';
import { MatchDetailComponent } from './matches/match-detail/match-detail.component';
import { EnrolledPlayersComponent } from './matches/enrolled-players/enrolled-players.component';
import { MatchResultWriteModalComponent } from './matches/match-results/match-result-write-modal/match-result-write-modal.component';
import { MatchResultModalComponent } from './matches/match-results/match-result-modal/match-result-modal.component';
import { PrintMatchComponent } from './matches/print-match/print-match.component';
import { SharedModule } from '../@shared/shared.module';
import { MatchGroupComponent } from './matches/player-enrollment/match-group/match-group.component';
import { PagesMenuService } from './pages-menu.service';
import { GoldenStickComponent } from './club-awards/golden-stick/golden-stick.component';
import { TripleClubComponent } from './club-awards/triple-club/triple-club.component';
import { RepresentationComponent } from './club-awards/representation/representation.component';
import { RealisationTeamComponent } from './realisation-team/realisation-team.component';
import { SettingsComponent } from './settings/settings.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NewsComponent } from './news/news.component';

const PAGES_COMPONENTS = [
  AlertsComponent, DialogsComponent, PagesComponent,
];

@NgModule({
  imports: [
    PagesRouting,
    ThemeModule,
    MiscellaneousModule,
    MomentModule,
    UserModule,
    Ng2SmartTableExtendedModule,
    NgSelectModule,
    ToasterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SortablejsModule,
    NbSpinnerModule,
    SharedModule,
    NbUserModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    MatchResultsComponent,
    PlayerEnrollmentComponent,
    MatchDetailComponent,
    EnrolledPlayersComponent,
    MatchResultWriteModalComponent,
    MatchResultModalComponent,
    PrintMatchComponent,
    MatchGroupComponent,
    GoldenStickComponent,
    TripleClubComponent,
    RepresentationComponent,
    RealisationTeamComponent,
    SettingsComponent,
    GalleryComponent,
    NewsComponent,
  ],
  entryComponents: [
    MatchDetailComponent,
    EnrolledPlayersComponent,
    MatchResultWriteModalComponent,
    MatchResultModalComponent,
  ],
  providers: [
    AlertsService,
    DialogsService,
    PreviousRouteService,
    UserService,
    JerseysService,
    PlacesService,
    TeamsService,
    GroupsService,
    PagesMenuService,
    [PreventLogged],
    [AuthGuard],
    [RoleGuard],
    [RoleCheck],
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
  ],
})
export class PagesModule {
}
