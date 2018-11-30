import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root',
})
export class ErrorHelper {

  constructor(private router: Router,
              private toasterService: ToasterService) {  }

  handleGenericError(err) {
    const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

    if (err.status === 0) {
      this.router.navigate(['/']).then(() => {
        this.toasterService.popAsync('error', 'Servers Unreachable', 'We couldn\'t establish a connection between client and server. Please contact application administrator');
      });
    } else {
      if (error.status === 404 && error.name === 'INVALID_ENDPOINT') {
        this.toasterService.popAsync('error', 'Request not found', 'The requested endpoint was not found. Please contact the administrator.');
      } else if (error.name === 'AUTH_TOKEN_INVALID') {
        this.router.navigate(['/auth/login'], { queryParams: { return: this.router.url } })
          .then(() => {
            let toast: Toast;
            const hasBeenLogged = sessionStorage.getItem('user') || false;

            if (hasBeenLogged) {
              toast = {
                type: 'warning',
                title: 'Token expired',
                body: 'Your session token has expired, please log in to revoke it.',
              };
            } else {
              toast = {
                type: 'error',
                title: 'You are not logged in',
                body: 'Please log in before accessing this page',
              };
            }
            this.toasterService.popAsync(toast);
          })
          .catch(caught => {
            const toast: Toast = {
              type: 'error',
              title: caught.name,
              body: !!caught.message ? caught.message : (!!caught.stack && !environment.production) ? caught.stack : null,
            };
            this.toasterService.popAsync(toast);
          });
      } else {
        const toast: Toast = {
          type: 'error',
          title: error.name || error.type || 'Error!',
          body: !!error.message ? error.message : (!!error.stack && !environment.production) ? error.stack : null,
        };
        this.toasterService.popAsync(toast);
      }
    }

  }

  processedButFailed(response) {
    this.toasterService.popAsync('error', !!response.response.name ? response.response.name : 'Error', !!response.response.message ? response.response.message : 'The request processed successfully, but the response failed.');
  }

}
