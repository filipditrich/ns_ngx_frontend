import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { RegistrationService} from '../registration.service';
import { CredResetService } from '../../reset';
import { CheckType } from '../../../@shared/enums';
import { ErrorHelper } from '../../../@shared/helpers';


@Injectable()
export class IsRequestHashValid implements CanActivate {

  constructor(private registrationSvc: RegistrationService,
              private credResetSvc: CredResetService,
              private errorHelper: ErrorHelper,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const hash = route.paramMap.get('hash');
    const type = route.data['checkType'];

    switch (type) {
      case CheckType.Registration: {
        return new Observable<boolean>(observer => {
          this.registrationSvc.checkRegistrationRequest(hash).subscribe(response => {
            if (response.response.success) {
              observer.next(true);
              observer.complete();
            } else {
              this.router.navigate(['/auth/login']).then(() => {
                this.errorHelper.processedButFailed(response);
              }).catch(error => {
                this.errorHelper.handleGenericError(error);
              });
              observer.next(false);
              observer.complete();
            }
          }, err => {
            this.router.navigate(['/auth/login']).then(() => {
              this.errorHelper.handleGenericError(err);
            }).catch(error => {
              this.errorHelper.handleGenericError(error);
            });
            observer.next(false);
            observer.complete();
          });
        });
      }
      case CheckType.PasswordReset: {
        return new Observable<boolean>(observer => {
          this.credResetSvc.checkPasswordResetRequest(hash).subscribe(response => {
            if (response.response.success) {
              observer.next(true);
              observer.complete();
            } else {
              this.router.navigate(['/auth/login']).then(() => {
                this.errorHelper.processedButFailed(response);
              }).catch(error => {
                this.errorHelper.handleGenericError(error);
              });
              observer.next(false);
              observer.complete();
            }
          }, err => {
            this.router.navigate(['/auth/login']).then(() => {
              this.errorHelper.handleGenericError(err);
            }).catch(error => {
              this.errorHelper.handleGenericError(error);
            });
            observer.next(false);
            observer.complete();
          });
        });
      }
    }
  }
}

@Injectable()
export class DataResolver implements Resolve<any> {

  constructor(private registrationSvc: RegistrationService,
              private router: Router,
              private errorHelper: ErrorHelper) { }

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const hash = route.paramMap.get('hash');
    const type = route.data['checkType'];

    switch (type) {
      case CheckType.Registration: {
        return this.registrationSvc.getRegistrationRequest(hash).toPromise().then(response => {
          if (response.response.success && response.output) {
            return response.output;
          } else {
            this.router.navigate(['/']).then(() => {
              this.errorHelper.processedButFailed(response);
            });
            return;
          }
        }).catch(error => {
          this.router.navigate(['/']).then(() => {
            this.errorHelper.handleGenericError(error);
          }).catch(err => {
            this.errorHelper.handleGenericError(err);
          });
          return;
        });
      }
    }

  }

}
