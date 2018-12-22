import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { AlertsService } from '../../@core/services/alerts/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../@core/services/auth/auth.service';
import { ToasterService } from 'angular2-toaster';
import { translate, ErrorHelper, sysInfo } from '../../@shared/helpers';
import { environment } from '../../../environments/environment';
import * as codeConfig from '../../@shared/config/codes.config';
import * as moment from 'moment';

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
      if (environment.production && moment(new Date()).isBefore(new Date(sysInfo('launchDate')))) {
        this.router.navigate(['/auth/cd']);
      } else {
        if (!this.isLoading) {
          this.callLoginSvc(input);
        }
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
      if (response.response.success && response.token) {
        AuthService.storeUserData(response.user, response.token);
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
