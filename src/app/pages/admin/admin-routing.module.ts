import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

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
    data: { title: 'Registration Requests' },
  },

  {
    path: 'matches',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager',
      },
      { path: 'manager', component: MatchesComponent, data: { title: 'Match Manager' } },
      { path: 'edit/:id', component: EditMatchComponent, data: { title: 'Edit Match' } },
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
      { path: 'manager', component: PlacesComponent, data: { title: 'Place Manager' } },
      { path: 'edit/:id', component: EditPlaceComponent, data: { title: 'Edit Place' } },
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
      { path: 'manager', component: JerseysComponent, data: { title: 'Jersey Manager' } },
      { path: 'edit/:id', component: EditJerseyComponent, data: { title: 'Edit Jersey' } },
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
      { path: 'manager', component: TeamsComponent, data: { title: 'Team Manager' } },
      { path: 'edit/:id', component: EditTeamComponent, data: { title: 'Edit Team' } },
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
      { path: 'manager', component: GroupsComponent, data: { title: 'Group Manager' } },
      { path: 'edit/:id', component: EditGroupComponent, data: { title: 'Edit Group' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouting { }
