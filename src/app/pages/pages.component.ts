import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { ErrorHelper, translate } from '../@shared/helpers';
import { GroupsService } from './admin/groups';

@Component({
  selector: 'ns-pages',
  template: `
    <ns-sample-layout>
      <nb-menu [items]='menuItems'></nb-menu>
      <router-outlet></router-outlet>
    </ns-sample-layout>
  `,
})
export class PagesComponent {

  public menuItems: NbMenuItem[] = [];
  public MENU_ITEMS: NbMenuItem[] = [
    {
      title: translate('MATCHES'),
      icon: 'icon ion-ios-flag',
      children: [
        {
          title: translate('ALL'),
          link: '/pages/matches/all',
        },
      ],
    },
    {
      title: translate('MATCH_RESULTS'),
      icon: 'icon ion-ios-trophy',
      children: [
        {
          title: translate('WRITE_RESULTS'),
          link: '/pages/matches/results',
        },
      ],
    },
  ];
  public ADMIN_LINKS: NbMenuItem = {
    title: translate('ADMIN'),
    icon: 'icon ion-ios-rocket',
    children: [
      {
        title: translate('MATCH_MANAGER'),
        link: '/pages/admin/matches/manager',
      },
      {
        title: translate('GROUP_MANAGER'),
        link: '/pages/admin/groups/manager',
      },
      {
        title: translate('TEAM_MANAGER'),
        link: '/pages/admin/teams/manager',
      },
      {
        title: translate('PLACE_MANAGER'),
        link: '/pages/admin/places/manager',
      },
      {
        title: translate('JERSEY_MANAGER'),
        link: '/pages/admin/jerseys/manager',
      },
      {
        title: translate('REGISTRATION_REQUESTS'),
        link: '/pages/admin/registration-requests',
      },
    ],
  };
  constructor(private groupsService: GroupsService,
              private errorHelper: ErrorHelper) {
    this.createItems();
  }

  /**
   * @description Creates the Menu Items
   */
  // TODO: refresh this when new group is created or existing group is updated/deleted
  // TODO: FIX - cannot do GroupA -> GroupB, only All -> GroupA -> All -> GroupB
  createItems() {
    this.groupsService.get().subscribe(response => {
      const output = !response.output ? [] : response.output;
      output.forEach(group => {
        this.MENU_ITEMS.find(x => x.title === translate('MATCHES')).children
          .push({ title: group.name, link: `/pages/matches/gn/${group.name.toLowerCase().replace(' ', '-')}` });
      });
      // TODO: DRY1
      const user = JSON.parse(sessionStorage.getItem('user'));
      const isAdmin = !!user ? user.roles.some(role => role.indexOf('admin') >= 0) : false;
      const adminIndex = this.MENU_ITEMS.findIndex(obj => obj.title === 'Admin') >= 0;
      if (!adminIndex && isAdmin) { this.MENU_ITEMS.unshift(this.ADMIN_LINKS); }
      this.menuItems = this.MENU_ITEMS;
    }, error => {
      // TODO: DRY2
      this.errorHelper.handleGenericError(error);
      const user = JSON.parse(sessionStorage.getItem('user'));
      const isAdmin = !!user ? user.roles.some(role => role.indexOf('admin') >= 0) : false;
      const adminIndex = this.MENU_ITEMS.findIndex(obj => obj.title === 'Admin') >= 0;
      if (!adminIndex && isAdmin) { this.MENU_ITEMS.unshift(this.ADMIN_LINKS); }
      this.menuItems = this.MENU_ITEMS;
    });
  }

}
