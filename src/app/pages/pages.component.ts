import { Component } from '@angular/core';
import { getMenuItems } from './pages-menu';


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
  public menuItems = getMenuItems();

  constructor() {}

}
