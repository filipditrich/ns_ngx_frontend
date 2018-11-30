import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { AlertsService } from '../../@core/services/alerts/alerts.service';
import { AuthService } from '../../@core/services/auth/auth.service';
import { ErrorHelper } from '../../@core/helpers/error.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-logout',
  template: 'Logging Out, please wait...',
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService,
              private alertsService: AlertsService,
              private router: Router,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    AuthService.logOut().then(() => {
      if (sessionStorage.getItem('user')) {
        this.errorHelper.handleGenericError({ name: 'FRONTEND_ERROR', message: 'User has not been removed during the logout process.' });
      } else {
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('info', 'Logged Out!', 'You have been successfully logged out.');
          location.reload(); // TODO: TEMPORARY FIX -> NEED SOLUTION (AKVEO BUG)
        }, error => {
          this.errorHelper.handleGenericError(error);
        });
      }
    });
  }


}
