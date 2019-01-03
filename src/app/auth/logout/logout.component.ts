import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { AlertsService } from '../../@core/services/alerts/alerts.service';
import { AuthService } from '../../@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { translate, ErrorHelper } from '../../@shared/helpers';

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
      if (localStorage.getItem('user')) {
        this.errorHelper.handleGenericError({ name: 'FRONTEND_ERROR', message: 'User has not been removed during the logout process.' });
      } else {
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('info', translate('LOGGED_OUT_TITLE'), translate('LOGGED_OUT_MSG'));
          location.reload(); // TODO: TEMPORARY FIX -> NEED SOLUTION (AKVEO BUG)
        }, error => {
          this.errorHelper.handleGenericError(error);
        });
      }
    });
  }


}
