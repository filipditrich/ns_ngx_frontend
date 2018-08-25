import { Component, OnInit } from '@angular/core';
import { AlertsService } from "../../../@core/services/alerts/alerts.service";
import { AuthService } from "../../../@core/services/auth/auth.service";
import { ErrorHelper } from "../../../@core/helpers/error.helper";
import { Router } from '@angular/router';

@Component({
  selector: 'ns-logout',
  template: 'Logging Out, please wait...'
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService,
              private alertsService: AlertsService,
              private router: Router,
              private errorHelper: ErrorHelper) {
  }

  ngOnInit() {
    AuthService.logOut().then(() => {
      if (sessionStorage.getItem('user')) {
        console.log(sessionStorage.getItem('user'));
      } else {
        this.router.navigate(['/login']).then(() => {
          this.alertsService.alertInfo({
            title: 'Logged Out',
            body: 'You\'ve been successfully logged out.'
          }, 5000);
        }, error => {
          this.errorHelper.handleGenericError(error);
        });
      }
    });
  }


}
