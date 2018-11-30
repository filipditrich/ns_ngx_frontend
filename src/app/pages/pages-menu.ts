import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Matches',
    icon: 'icon ion-md-trophy',
    children: [
      {
        title: 'Matches',
        link: '/pages/matches/',
      },
      {
        title: 'Match Results',
        link: '/pages/matches/results',
      },
    ],
  },
  // {
  //   title: 'User',
  //   icon: 'icon ion-md-person',
  //   children: [
  //     {
  //       title: 'Profile Management',
  //       link: '/pages/user/profile/edit',
  //     },
  //   ],
  // },
];

export let ADMIN_LINKS: NbMenuItem = {
  title: 'Admin',
  icon: 'icon ion-md-rocket',
  children: [
    {
      title: 'Match Manager',
      link: '/pages/admin/matches/manager',
    },
    {
      title: 'Place Manager',
      link: '/pages/admin/places/manager',
    },
    {
      title: 'Jersey Manager',
      link: '/pages/admin/jerseys/manager',
    },
    {
      title: 'Team Manager',
      link: '/pages/admin/teams/manager',
    },
    {
      title: 'Registration Requests',
      link: '/pages/admin/registration-requests',
    },
  ],
};

/**
 * @description Exports correct menu links
 * @return {NbMenuItem[]}
 */
export function getMenuItems() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isAdmin = !!user ? user.roles.some(role => role.indexOf('admin') >= 0) : false;
  const adminIndex = MENU_ITEMS.findIndex(obj => obj.title === 'Admin') >= 0;
  if (!adminIndex && isAdmin) { MENU_ITEMS.unshift(ADMIN_LINKS); }

  return MENU_ITEMS;
}
