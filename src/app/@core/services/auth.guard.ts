import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Toast, ToasterService } from 'angular2-toaster';
import { translate, ErrorHelper } from '../../@shared/helpers';

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
          title: translate('WARNING'),
          body: translate('ALREADY_LOGGED'),
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
  private user = JSON.parse(localStorage.getItem('user'));
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
    const userRoles = !!JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).roles : null;
    const allowed = route.data['roles'];

    if (!!userRoles && allowed.some(a => userRoles.indexOf(a) >= 0)) {
      return true;
    } else {
      this.router.navigate(['/pages']).then(() => {
        const toast: Toast = {
          type: 'error',
          title: translate('UNAUTHORIZED_TITLE'),
          body: translate('UNAUTHORIZED_MSG'),
        };
        this.toasterService.popAsync(toast);
        return false;
      }).catch(error => {
        this.errorHelper.handleGenericError(error);
      });
    }
  }

}
