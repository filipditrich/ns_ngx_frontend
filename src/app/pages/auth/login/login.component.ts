import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { AlertsService } from "../../../@core/services/alerts/alerts.service";
// import { DialogsService } from '../../@core/services/dialogs/dialogs.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from "../../../@core/services/auth/auth.service";

import * as codeConfig from '../../../@core/config/codes.config';
import { ErrorHelper } from "../../../@core/helpers/error.helper";

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

   public form: FormGroup;
   public submitted = false;

  constructor(private httpClient: HttpClient,
              private loginService: LoginService,
              private authService: AuthService,
              private alertsService: AlertsService,
              // private dialogService: DialogsService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private titleService: Title,
              private errorHelper: ErrorHelper) {

    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    this.titleService.setTitle('Northern Stars » Login');

  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

   ngOnInit() {
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
        // this.alertsService.alertSuccess({
        //   title: 'Logged In',
        //   body: 'You\'ve been successfully logged in!'
        // }, 2500);
        const returnUrl = this.route.snapshot.queryParamMap.has('return') ? this.route.snapshot.queryParamMap.get('return') : false;
        this.router.navigate([returnUrl || '/']);
      } else {
        // no token or success
        this.submitted = false;
        // this.alertsService.alertDanger({
        //   title: response.response.name || 'Unexpected',
        //   body: response.response.message || 'Unexpected error occurred.'
        // }, 5000);
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.submitted = false;

      switch (error.name) {
        case codeConfig.getCodeByName('USERNAME_MISMATCH', 'auth').name: {
          this.username.setErrors({ 'no-match' : true }); break;
        }
        case codeConfig.getCodeByName('PASSWORD_MISMATCH', 'auth').name: {
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
