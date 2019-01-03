import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { PagesMenuService } from './pages-menu.service';

@Component({
  selector: 'ns-pages',
  template: `
    <ns-sample-layout>
      <nb-menu [items]='menuItems' autoCollapse></nb-menu>
      <router-outlet></router-outlet>
    </ns-sample-layout>
  `,
  styles: ['/deep/ .menu-group { cursor: not-allowed; opacity: 0.65 }'],
  // workaround for not having the 'disabled' option for certain menu items
})
export class PagesComponent implements OnInit {
  public menuItems: NbMenuItem[] = [];
  constructor(private pagesMenuService: PagesMenuService,
              private menuService: NbMenuService) { }

  ngOnInit() {
    this.pagesMenuService.generate();
    this.pagesMenuService.menuItems.subscribe((menuItems: NbMenuItem[]) => {
      // TODO: fix/workaround - ExpressionChangedAfterItHasBeenCheckedError (max-height)
      // idk why but this shit now works, but Ima still going to leave this here
      // ok I take that back, its not working again. wtf
      this.menuService.collapseAll();
      this.menuService.addItems(menuItems);
    });
  }

}
