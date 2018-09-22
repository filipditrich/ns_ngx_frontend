import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
// import {RoleCheckService} from "../@core/services/roleCheck.service";

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {
  public user = sessionStorage.getItem('user');
  constructor() {

  }

  menu = [{
    title: 'Zápasy',
    icon: 'fa fa-beer',
    children: [
      {
        title: 'Zápasy',
        link: '/pages/matches'
      },
      {
        title: 'Zapisování výsledků',
        link: '/pages/matches-results'
      }],
    }, {
    title: 'Admin',
    icon: 'nb-gear',
    children: [
      {
        title: 'Přijmání registrací',
        link: '/pages/admin/registration-requests',
      }
    ]
  },{
      title: 'User',
      link: '/pages/user/profile'
  }];
}
