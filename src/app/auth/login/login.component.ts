import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { AlertsService } from '../../@core/services/alerts/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../@core/services/auth/auth.service';
import { ErrorHelper } from '../../@core/helpers/error.helper';
import { ToasterService } from 'angular2-toaster';
import * as codeConfig from '../../@core/config/codes.config';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

   public form: FormGroup;
   public submitted = false;

  constructor(private httpClient: HttpClient,
              private loginService: LoginService,
              private authService: AuthService,
              private alertsService: AlertsService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(null, []),
    });

  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  get rememberMe() { return this.form.get('rememberMe'); }

   ngOnInit() {
    this.rememberMe.setValue(Boolean(localStorage.getItem('rememberMe')));
   }

  onSubmit(input) {

    if (!this.form.valid) {
      this.username.markAsTouched();
      this.password.markAsTouched();
    } else {
      if (!this.submitted) {
        this.callLoginSvc(input);
        this.submitted = true;
      }
    }

  }

  // TODO - interface
  callLoginSvc(input) {
    this.loginService.logInRequest(input).subscribe(response => {
      if (response.response.success && response.token) {
        AuthService.storeUserData(response.user, response.token);
        const returnUrl = this.route.snapshot.queryParamMap.has('return') ? this.route.snapshot.queryParamMap.get('return') : false;
        this.router.navigate([returnUrl || '/pages/']).then(() => {
          this.toasterService.popAsync('success', 'Logged In', 'Login Successful.');
          const rememberMe = !!this.rememberMe.value ? this.rememberMe.value ? 'true' : 'false' : 'false';
          localStorage.setItem('rememberMe', rememberMe);
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      } else {
        // no token or success
        this.submitted = false;
        this.toasterService.popAsync('error', response.response.name || 'Unexpected', response.response.message || 'Unexpected error occurred');
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.submitted = false;

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
