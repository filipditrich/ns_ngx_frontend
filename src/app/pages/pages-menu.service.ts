import { EventEmitter, Injectable, Output } from '@angular/core';
import { UserRoles } from '../@shared/enums';
import { GroupsService } from './admin/groups/groups.service';
import { ErrorHelper, translate } from '../@shared/helpers';
import { NbMenuItem } from '@nebular/theme';
import * as diacritics from 'diacritics';

@Injectable({
  providedIn: 'root',
})
export class PagesMenuService {

  public user = JSON.parse(localStorage.getItem('user'));
  public isAdmin = !!this.user ? this.user.roles.some(role => role.indexOf(UserRoles.admin) >= 0) : false;
  public MENU_ITEMS: NbMenuItem[] = [
    {
      title: translate('ADMIN'),
      icon: 'icon ion-ios-rocket',
      hidden: !this.isAdmin,
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
    },
    {
      title: translate('MATCHES'),
      icon: 'icon ion-ios-flag',
      children: [],
    },
    {
      title: translate('MATCH_RESULTS'),
      icon: 'icon ion-ios-stats',
      children: [
        {
          title: translate('WRITE_RESULTS'),
          link: '/pages/matches/results',
        },
      ],
    },
    {
      title: translate('PROFILE'),
      // icon: 'icon ion-ios-person',
      group: true,
      link: '/pages/user',
    },
    {
      title: translate('REALISATION_TEAM'),
      // icon: 'icon ion-ios-people',
      group: true,
      link: '/pages/realisation-team',
    },
    {
      title: translate('CLUB_AWARDS'),
      // icon: 'icon ion-ios-trophy',
      group: true,
      // children: [
      //   {
      //     title: translate('GOLDEN_STICK'),
      //     link: '/pages/club-awards/golden-stick',
      //   },
      //   {
      //     title: translate('TRIPLE_CLUB'),
      //     link: '/pages/club-awards/triple-club',
      //   },
      //   {
      //     title: translate('REPRESENTATION'),
      //     link: '/pages/club-awards/representation',
      //   },
      // ],
    },
    {
      title: translate('SETTINGS'),
      // icon: 'icon ion-ios-cog',
      link: '/pages/settings',
      group: true,
    },
  ];
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
    if (this.canRefresh) {
      this.menuItems.emit(this.MENU_ITEMS);
      this.canRefresh = false;
    } else { console.error('TODO: refresh menu items after menu item change detected'); }
  }

}
