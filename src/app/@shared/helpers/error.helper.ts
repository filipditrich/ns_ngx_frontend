import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToasterService } from 'angular2-toaster';
import { translate } from './translator.helper';

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
        this.toasterService.popAsync('error', translate('SERVERS_DOWN_TITLE'), translate('SERVERS_DOWN_MSG'));
        // TODO: BLOCK PAGE
        setTimeout(() => { window.location.reload(); }, 2000);
      });
    } else {
      if (error.status === 404 && error.name === 'INVALID_ENDPOINT') {
        this.toasterService.popAsync('error', translate('REQUEST_NOT_FOUND_TITLE'), translate('REQUEST_NOT_FOUND_MSG'));
      } else if (error.name === 'AUTH_TOKEN_INVALID') {
        this.router.navigate(['/auth/login'], { queryParams: { return: this.router.url } })
          .then(() => {
            let toast: Toast;
            const hasBeenLogged = localStorage.getItem('user') || false;

            if (hasBeenLogged) {
              toast = {
                type: 'warning',
                title: translate('TOKEN_EXP_TITLE'),
                body: translate('TOKEN_EXP_MSG'),
              };
            } else {
              toast = {
                type: 'error',
                title: translate('NOT_LOGGED_TITLE'),
                body: translate('NOT_LOGGED_MSG'),
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
          title: error.name || error.type || `${translate('ERROR')}!`,
          body: !!error.message ? error.message : (!!error.stack && !environment.production) ? error.stack : null,
        };
        this.toasterService.popAsync(toast);
      }
    }

  }

  processedButFailed(response) {
    this.toasterService.popAsync('error', !!response.response.name ? response.response.name : translate('ERROR'), !!response.response.message ? response.response.message : translate('PROCESSED_BUT_FAILED') );
  }

}
