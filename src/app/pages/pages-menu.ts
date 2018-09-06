import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'E-commerce',
    icon: 'nb-e-commerce',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'IoT Dashboard',
    icon: 'nb-home',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'USER',
    group: true
  },
  {
    title: 'Zápasy',
    icon: 'fa fa-beer',
    link: '/pages/matches'
  },
  {
    title: 'Zapisování výsledků',
    icon: '',
    link: '/pages/matches-results'
  }
];
