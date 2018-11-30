import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ErrorHelper } from '../helpers/error.helper';
import { Toast, ToasterService } from 'angular2-toaster';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }

  resolve(route, state) {
    if (this.authService.isTokenValid()) {
      return true;
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { return: '/pages' } })
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
              private toasterService: ToasterService) { }

  canActivate() {
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/pages']).then(() => {
        const toast: Toast = {
          type: 'warning',
          title: 'Prevention',
          body: 'You are already logged in!',
        };
        this.toasterService.popAsync(toast);
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
  private user = JSON.parse(sessionStorage.getItem('user'));
  private privileged = ['admin', 'sysadmin'];
  private moderator = ['moderator'];

  isAdmin() {
    return !!this.user && this.privileged.some(role => this.user.roles.indexOf(role) >= 0);
  }

  isModerator() {
    return !!this.user && this.moderator.some(role => this.user.roles.indexOf(role) >= 0);
  }

}


@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { return this.resolve(route, state); }


  resolve(route, state) {
    const userRoles = !!JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).roles : null;
    const allowed = route.data['roles'];

    if (!!userRoles && allowed.some(a => userRoles.indexOf(a) >= 0)) {
      return true;
    } else {
      this.router.navigate(['/pages']).then(() => {
        const toast: Toast = {
          type: 'error',
          title: 'Unauthorized',
          body: 'You don\'t have enough privileges to do such an action!',
        };
        this.toasterService.popAsync(toast);
        return false;
      }).catch(error => {
        this.errorHelper.handleGenericError(error);
      });
    }
  }

}
