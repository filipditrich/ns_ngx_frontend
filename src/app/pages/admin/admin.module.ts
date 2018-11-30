import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRouting } from './admin-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Ng2SmartTableExtendedModule } from 'ng2-smart-table-extended';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SortablejsModule } from 'angular-sortablejs';
import { ToasterModule } from 'angular2-toaster';
import { NbSpinnerModule } from '@nebular/theme';

import { MatchesComponent, AddMatchComponent, EditMatchComponent } from './matches';
import { PlacesComponent, AddPlaceComponent, EditPlaceComponent, PlaceDetailComponent } from './places';
import { TeamsComponent, AddTeamComponent, EditTeamComponent, TeamDetailComponent } from './teams';
import { JerseysComponent, AddJerseyComponent, EditJerseyComponent, JerseyDetailComponent } from './jerseys';
import { InviteModalComponent, InviteModalErrorComponent, RegistrationRequestsComponent } from './registration-requests';

const MATCH_MANAGER = [ MatchesComponent, AddMatchComponent, EditMatchComponent ];
const PLACE_MANAGER = [ PlacesComponent, AddPlaceComponent, EditPlaceComponent, PlaceDetailComponent ];
const TEAM_MANAGER = [ TeamsComponent, AddTeamComponent, EditTeamComponent, TeamDetailComponent ];
const JERSEY_MANAGER = [ JerseysComponent, AddJerseyComponent, EditJerseyComponent, JerseyDetailComponent ];
const REGISTRATION_REQUESTS = [ InviteModalComponent, InviteModalErrorComponent, RegistrationRequestsComponent ];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    AdminRouting,
    RouterModule,
    Ng2SmartTableExtendedModule,
    NgSelectModule,
    ToasterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SortablejsModule,
    NbSpinnerModule,
  ],
  declarations: [
    ...MATCH_MANAGER,
    ...PLACE_MANAGER,
    ...TEAM_MANAGER,
    ...JERSEY_MANAGER,
    ...REGISTRATION_REQUESTS,
  ],
  entryComponents: [
    ...MATCH_MANAGER,
    ...PLACE_MANAGER,
    ...TEAM_MANAGER,
    ...JERSEY_MANAGER,
    ...REGISTRATION_REQUESTS,
  ],
  providers: [
    SmartTableService,
  ],
})
export class AdminModule { }
