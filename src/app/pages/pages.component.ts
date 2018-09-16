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

  constructor() {
  }

  menu = [{
    title: 'Zápasy',
    icon: 'fa fa-beer',
    link: '/pages/matches'
  },
    {
      title: 'Zapisování výsledků',
      icon: 'nb-edit',
      link: '/pages/matches-results'
    },
    {
      title: 'User',
      link: '/pages/user/profile'
    }];
}
