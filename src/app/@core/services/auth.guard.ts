import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';
// import { AlertsService } from "./alerts/alerts.service";
import { ErrorHelper } from '../helpers/error.helper';
import { PreviousRouteService } from './previous-route.service';
import {HttpClient} from '@angular/common/http';
import {APIRoot} from '../../../environments/environment';
import {getUrl} from '../config/endpoints.config';
import {findByProp} from '../helpers/functions.helper';
import {UserRoles} from '../enums/user.enum';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router,
              private errorHelper: ErrorHelper) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }

  resolve(route, state) {
    if (this.authService.isTokenValid()) {
      return true;
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { return: state.url } })
        .then(() => {
          const hasBeenLogged = sessionStorage.getItem('user') || false;
          if (hasBeenLogged) {
            // this.alertsService.alertWarning({
            //   title: 'Token expired',
            //   body: 'Your session token has expired, please log in to revoke it.'
            // }, 5000);
          } else {
            // this.alertsService.alertDanger({
            //   title: 'You are not logged in',
            //   body: 'Please log in before accessing this page'
            // }, 5000);
          }
        })
        .catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      return false;
    }
  }

}

@Injectable()
export class PreventLogged implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private errorHelper: ErrorHelper,
              private previousRouteSvc: PreviousRouteService) { }

  canActivate() {
    if (this.authService.isTokenValid()) {
      console.log(this.previousRouteSvc.getPreviousUrl());
      this.router.navigate(['/user']).then(() => {
        // this.alertsService.alertWarning({
        //   title: 'Prevention',
        //   body: 'You are already logged in, no need to access this page.'
        // }, 5000);
      }).catch(error => {
        this.errorHelper.handleGenericError(error);
      });
      return false;
    } else {
      return true;
    }
  }
}

@Injectable()
export class RoleCheck {
  private user = sessionStorage.getItem('user');
  // public userRoles = [];
  //
  // constructor() {
  //   this.userRoles = this.user["roles"];
  // }
  //
  // isAdmin() {
  //   return this.userRoles.indexOf('admin') > 0;
  // }
}


@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private errorHelper: ErrorHelper,
              private previousRouteSvc: PreviousRouteService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }


  resolve(route, state) {
    const userRoles = JSON.parse(sessionStorage.getItem('user')).roles;
    const allowed = route.data['roles'];

    if (allowed.some(a => userRoles.indexOf(a) >= 0)) {
      return true;
    } else {
      console.log(this.previousRouteSvc.getPreviousUrl());
      this.router.navigate(['/pages']).then(() => {
        // this.alertsService.alertDanger({
        //   title: 'Unauthorized Access',
        //   body: 'You have\'nt got enough privileges to make this request.'
        // }, 7500);
        console.log('UnAuthorized');
        return false;
      }).catch(error => {
        this.errorHelper.handleGenericError(error);
      });
    }
  }

}
