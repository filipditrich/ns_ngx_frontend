import { EventEmitter, Injectable, Output } from '@angular/core';
import { GroupsService } from './admin/groups/groups.service';
import { ErrorHelper, translate } from '../@shared/helpers';
import { NbMenuItem } from '@nebular/theme';
import * as diacritics from 'diacritics';

@Injectable({
  providedIn: 'root',
})
export class PagesMenuService {

  public MENU_ITEMS: NbMenuItem[] = [
    {
      title: translate('MATCHES'),
      icon: 'icon ion-ios-flag',
      children: [],
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
    // {
    //   title: translate('USER'),
    //   icon: 'icon ion-ios-person',
    //   link: '/pages/user',
    //   pathMatch: 'partly',
    // },
    // {
    //   title: translate('SETTINGS'),
    //   icon: 'icon ion-ios-cog',
    //   link: '/pages/user',
    //   pathMatch: 'partly',
    // },
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
  public canRefresh = true;
  @Output() menuItems: EventEmitter<NbMenuItem[]> = new EventEmitter<NbMenuItem[]>();

  constructor(private groupsService: GroupsService,
              private errorHelper: ErrorHelper) { }

  /**
   * @description Generates the Menu Item set
   */
  generate() {
    this.refresh();
  }

  /**
   * @description Refreshes the Menu Item set
   */
  refresh() {
    this.MENU_ITEMS.find(x => x.title === translate('MATCHES')).children = [{ title: translate('ALL'), link: '/pages/matches/all' }];
    this.groupsService.get().subscribe(response => {
      const output = !response.output ? [] : response.output;
      output.forEach(group => {
        this.MENU_ITEMS.find(x => x.title === translate('MATCHES')).children
          .push({
            title: group.name,
            link: `/pages/matches/gn/${diacritics.remove(group.name.toLowerCase().replace(' ', '-'))}`,
            queryParams: { ogn: group.name },
            pathMatch: 'partial',
          });
      });
      this.apply();
    }, error => {
      this.errorHelper.handleGenericError(error);
      this.apply();
    });
  }

  /**
   * @description Emits the changed Menu Item set
   */
  apply(): void {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const isAdmin = !!user ? user.roles.some(role => role.indexOf('admin') >= 0) : false;
    const adminIndex = this.MENU_ITEMS.findIndex(obj => obj.title === translate('ADMIN')) >= 0;
    if (!adminIndex && isAdmin) { this.MENU_ITEMS.unshift(this.ADMIN_LINKS); }
    if (this.canRefresh) {
      this.menuItems.emit(this.MENU_ITEMS);
      this.canRefresh = false;
    } else { console.error('TODO: refresh menu items after menu item change detected'); }
  }

}
