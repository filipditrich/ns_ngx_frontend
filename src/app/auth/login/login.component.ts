import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import * as moment from 'moment';
import {AlertsService} from '../../@core/services/alerts/alerts.service';
import {AuthService} from '../../@core/services/auth/auth.service';
import * as codeConfig from '../../@shared/config/codes.config';
import {UserRoles} from '../../@shared/enums';
import {ErrorHelper, sysInfo, translate} from '../../@shared/helpers';
import {LoginService} from './login.service';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

   public form: FormGroup;
   public isLoading = true;

  constructor(private httpClient: HttpClient,
              private loginService: LoginService,
              private authService: AuthService,
              private alertsService: AlertsService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    /**
     * @description Form Group
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(null, []),
    });

  }

  // getters
  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  get rememberMe() { return this.form.get('rememberMe'); }

  /** ngOnInit **/
   ngOnInit() {
    this.rememberMe.setValue(Boolean(localStorage.getItem('rememberMe')));
    this.isLoading = false;
   }

  /**
   * @description Handler for onSubmit event
   * @param input
   */
  onSubmit(input) {
    if (!this.form.valid) {
      this.username.markAsTouched();
      this.password.markAsTouched();
    } else {
      if (!this.isLoading) {
        this.callLoginSvc(input);
      }
    }
  }

  /**
   * @description Calls the login service
   * @param input
   */
  callLoginSvc(input) {
    this.isLoading = true;
    this.loginService.logInRequest(input).subscribe(response => {
      if (response.response.success && response.output.token) {
        if (moment(new Date()).isBefore(new Date(sysInfo('launchDate')))
          && response.output.user.roles.indexOf(UserRoles.admin) < 0) {
          this.router.navigate(['/auth/cd']);
        } else {
          AuthService.storeUserData(response.output.user, response.output.token);
          const returnUrl = this.route.snapshot.queryParamMap.has('return') ? this.route.snapshot.queryParamMap.get('return') : false;
          this.router.navigate([returnUrl || '/pages/']).then(() => {
            this.toasterService.popAsync('success', translate('LOGGED_IN_TITLE'), translate('LOGGED_IN_MSG'));
            const rememberMe = !!this.rememberMe.value ? this.rememberMe.value ? 'true' : 'false' : 'false';
            localStorage.setItem('rememberMe', rememberMe);
            this.isLoading = false;
          }).catch(error => {
            this.errorHelper.handleGenericError(error);
            this.isLoading = false;
          });
        }
      } else {
        // no token or success
        this.isLoading = false;
        this.toasterService.popAsync('error', response.response.name || 'Unexpected', response.response.message || 'Unexpected error occurred');
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.isLoading = false;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('USERNAME_MISMATCH', 'operator').name: {
          this.username.setErrors({ 'no-match' : true }); break;
        }
        case codeConfig.getCodeByName('PASSWORD_MISMATCH', 'operator').name: {
          this.password.setErrors({ 'no-match' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }

    });
  }

}
