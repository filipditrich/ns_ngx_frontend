import { Component, Input, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { translate } from '../../../@shared/helpers';
// import { changeLang, LANG } from '../../../../environments/environment';

@Component({
  selector: 'ns-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [
    { title: translate('LOG_OUT') },
    // { title: translate('CHANGE_LANG') },
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private router: Router) {

    menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === tag))
      .subscribe(bag => {
        switch (bag.item.title) {
          case translate('LOG_OUT'): this.router.navigate(['/auth/logout']); break;
          // case translate('CHANGE_LANG'): changeLang(LANG === 'cs' ? 'en' : 'cs'); break;
        }
    });

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
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
