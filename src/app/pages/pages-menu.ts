import { NbMenuItem } from '@nebular/theme';
// import {RoleCheckService} from "../@core/services/roleCheck.service";

export const MENU_ITEMS: NbMenuItem[] = [
  {
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
  }
];
