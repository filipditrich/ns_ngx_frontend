import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { ToasterConfig } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map, filter, mergeMap } from 'rxjs/operators';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ns-app',
  template: `
    <toaster-container [toasterconfig]="config"></toaster-container>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {

  public config: ToasterConfig;

  constructor(private analytics: AnalyticsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();

    // toaster config
    this.config = new ToasterConfig({
      showCloseButton: { error: false, warning: true, info: true, success: true },
      preventDuplicates: true,
      mouseoverTimerStop: true,
      tapToDismiss: true,
    });

    // page title change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe((event) => this.titleService.setTitle(`Team App » ${event['title']}`));
  }

}
