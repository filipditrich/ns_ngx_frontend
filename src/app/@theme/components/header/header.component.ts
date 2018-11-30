import { Component, Input, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'ns-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [
    // { title: 'Profile' },
    { title: 'Log Out' },
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private router: Router,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === tag))
      .subscribe(bag => {
        if (bag.item.title === 'Log Out') {
          this.router.navigate(['/auth/logout']);
        }
        if (bag.item.title === 'Profile') {
          // this.router.navigate(['/user/profile']);
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
