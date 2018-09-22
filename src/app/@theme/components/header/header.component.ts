import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profil' }, { title: 'Odhlásit se' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private router: Router) {
    menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === tag))
      .subscribe(bag => {
        if (bag.item.title == "Odhlásit se"){
          this.router.navigate(['/auth/logout']);
          location.reload();
        }
        if (bag.item.title == "Profil"){
          this.router.navigate(['/user/profile']);
        }
  });
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
