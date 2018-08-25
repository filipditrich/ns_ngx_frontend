import { environment } from "../../../environments/environment";
import { AlertsService } from "../services/alerts/alerts.service";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {popup} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class ErrorHelper {

  constructor(private router: Router,
              private alertsService: AlertsService) {  }

  handleGenericError(err) {
    const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

    if (err.status === 0) {
      this.alertsService.alertDanger({
        title: 'Servers Unreachable',
        body: 'We couldn\'t establish a connection between client and server. Please contact application administrator'
      });


    } else {
      switch (error.status) {
        case 404: {
          this.alertsService.alertDanger({
            title: 'Request not found',
            body: 'The requested endpoint was not found. Please contact the administrator.'
          }, 7500);
          break;
        }
        default: {
          if (error.name === 'INVALID_TOKEN') {
            this.router.navigate(['/login'], { queryParams: { return: this.router.url } })
              .then(() => {
                const hasBeenLogged = sessionStorage.getItem('user') || false;
                if (hasBeenLogged) {
                  this.alertsService.alertWarning({
                    title: 'Token expired',
                    body: 'Your session token has expired, please log in to revoke it.'
                  }, 5000);
                } else {
                  this.alertsService.alertDanger({
                    title: 'You are not logged in',
                    body: 'Please log in before accessing this page'
                  }, 5000);
                }
              })
              .catch(caught => {
                this.alertsService.alertDanger({
                  title: caught.name,
                  body: !!caught.message ? caught.message : (!!caught.stack && !environment.production) ? caught.stack : null
                }, 7500);
              });
          } else {
            this.alertsService.alertDanger({
              title: error.name,
              body: !!error.message ? error.message : (!!error.stack && !environment.production) ? error.stack : null
            }, 7500);
          }
          break;
        }
      }
    }

  }

  processedButFailed(response) {
    // this.alertsService.alertDanger({
    //   title: !!response.response.name ? response.response.name : 'Error',
    //   body: !!response.response.message ? response.response.message : 'The request processed successfully, but the response failed.'
    // }, 5000);
  }

}
