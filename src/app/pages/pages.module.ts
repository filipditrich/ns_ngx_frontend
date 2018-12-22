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
import { MatchesResultsComponent } from './matches/matches-results/matches-results.component';
import { MomentModule } from 'angular2-moment';
import { UserModule } from './user/user.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeadersInterceptor } from '../@core/services/http.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService} from './user/user.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SortablejsModule } from 'angular-sortablejs';
import { PlayerEnrollmentComponent } from './matches/player-enrollment/player-enrollment.component';
import { NbSpinnerModule } from '@nebular/theme';
import { PlacesService } from './admin/places';
import { TeamsService } from './admin/teams';
import { GroupsService } from './admin/groups';
import { JerseysService } from './admin/jerseys';
import { MatchDetailComponent } from './matches/match-detail/match-detail.component';
import { EnrolledPlayersComponent } from './matches/enrolled-players/enrolled-players.component';
import { MatchResultWriteModalComponent } from './matches/matches-results/match-result-write-modal/match-result-write-modal.component';
import { MatchResultModalComponent } from './matches/matches-results/match-result-modal/match-result-modal.component';
import { PrintMatchComponent } from './matches/print-match/print-match.component';
import { SharedModule } from '../@shared/shared.module';
import { MatchGroupComponent } from './matches/player-enrollment/match-group/match-group.component';

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
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    MatchesResultsComponent,
    PlayerEnrollmentComponent,
    MatchDetailComponent,
    EnrolledPlayersComponent,
    MatchResultWriteModalComponent,
    MatchResultModalComponent,
    PrintMatchComponent,
    MatchGroupComponent,
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
