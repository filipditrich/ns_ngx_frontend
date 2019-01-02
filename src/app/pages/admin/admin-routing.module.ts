import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { translate } from '../../@shared/helpers';

import { MatchesComponent, EditMatchComponent } from './matches';
import { PlacesComponent, EditPlaceComponent } from './places';
import { TeamsComponent, EditTeamComponent } from './teams';
import { JerseysComponent, EditJerseyComponent } from './jerseys';
import { EditGroupComponent, GroupsComponent } from './groups';
import { RegistrationRequestsComponent } from './registration-requests';

/**
 * Admin routing settings
 */
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'matches',
  },

  {
    path: 'registration-requests',
    component: RegistrationRequestsComponent,
    data: { title: translate('REGISTRATION_REQUESTS') },
  },

  {
    path: 'matches',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager',
      },
      { path: 'manager', component: MatchesComponent, data: { title: translate('MATCH_MANAGER') } },
      { path: 'edit/:id', component: EditMatchComponent, data: { title: translate('EDIT_MATCH') } },
    ],
  },

  {
    path: 'places',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager',
      },
      { path: 'manager', component: PlacesComponent, data: { title: translate('PLACE_MANAGER') } },
      { path: 'edit/:id', component: EditPlaceComponent, data: { title: translate('EDIT_PLACE') } },
    ],
  },

  {
    path: 'jerseys',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager',
      },
      { path: 'manager', component: JerseysComponent, data: { title: translate('JERSEY_MANAGER') } },
      { path: 'edit/:id', component: EditJerseyComponent, data: { title: translate('EDIT_JERSEY') } },
    ],
  },

  {
    path: 'teams',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager',
      },
      { path: 'manager', component: TeamsComponent, data: { title: translate('TEAM_MANAGER') } },
      { path: 'edit/:id', component: EditTeamComponent, data: { title: translate('EDIT_TEAM') } },
    ],
  },

  {
    path: 'groups',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager',
      },
      { path: 'manager', component: GroupsComponent, data: { title: translate('GROUP_MANAGER') } },
      { path: 'edit/:id', component: EditGroupComponent, data: { title: translate('EDIT_GROUP') } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouting { }
