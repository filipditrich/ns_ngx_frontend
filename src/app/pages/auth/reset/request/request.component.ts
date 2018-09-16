import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../../@core/services/auth/auth.service';
// import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { CredResetService } from '../reset.service';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';

import * as codeConfig from '../../../../@core/config/codes.config';

@Component({
  selector: 'ns-request-cred-reset',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class ResetRequestComponent implements OnInit {

  public resetReqForm: FormGroup;
  public submitted = false;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private titleService: Title,
              private credResetService: CredResetService,
              private errorHelper: ErrorHelper) {

    this.resetReqForm = new FormGroup({
      type: new FormControl(null, [ Validators.required ]),
      username: new FormControl(null),
      email: new FormControl(null, [ Validators.email ])
    });

    this.titleService.setTitle('Support » Request Credential Reset');

  }

  get username() { return this.resetReqForm.get('username'); }
  get email() { return this.resetReqForm.get('email'); }
  get type() { return this.resetReqForm.get('type'); }

  ngOnInit() {
    this.type.setValue('password', { onlySelf: true });
  }

  onChange() {
    this.email.setErrors(null);
    this.username.setErrors(null);
  }

  onSubmit(input) {
    this.username.markAsTouched();
    this.email.markAsTouched();
    this.type.markAsTouched();
    if (this.resetReqForm.valid && (input.username || input.email)) {

      if (input.username === '') { input.username = false; }
      if (input.email === '') { input.email = false; }

      if (!this.submitted) {
        if (input.type === 'password') {
          this.requestPassword(input);
          this.submitted = true;
        } else if (input.type === 'username') {
          this.requestUsername(input);
          this.submitted = true;
        }
      }

    }

  }

  requestPassword(input) {
    this.credResetService.requestPasswordReset(input).subscribe(response => {

      if (response.response.success) {
        // TODO - navigate to custom page?
        this.router.navigate(['/login']).then(() => {
          // this.alertsService.alertSuccess({
          //   title: 'Success',
          //   body: 'A password reset link has been sent to your email.'
          // }, 5000);
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      } else {
        this.submitted = false;
        this.errorHelper.processedButFailed(response);
      }
    }, err => {

      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.submitted = false;

      switch (error.name) {

        case codeConfig.getCodeByName('RESET_REQUEST_ALREADY_MADE', 'auth').name: {
          if (input.username) {
            this.username.setErrors({ 'req-dup' : true });
          } else {
            this.email.setErrors({ 'req-dup' : true });
          }
          break;
        }
        case codeConfig.getCodeByName('USER_NOT_FOUND', 'auth').name: {
          if (input.username) {
            this.username.setErrors({ 'not-found' : true });
          } else {
            this.email.setErrors({ 'not-found' : true });
          }
          break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }
    });
  }

  requestUsername(input) {
    this.credResetService.sendUsernameToEmail(input).subscribe(response => {
      if (response.response.success) {
        // TODO - redirect to some custom page
        this.router.navigate(['/']).then(() => {
          // this.alertsService.alertSuccess({
          //   title: 'Email sent',
          //   body: 'We\'ve sent you an email with your username!'
          // }, 2500);
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      } else {
        this.submitted = false;
        this.errorHelper.processedButFailed(response);
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.submitted = false;

      switch (error.name) {
        case codeConfig.getCodeByName('EMAIL_NOT_FOUND', 'auth').name: {
          this.email.setErrors({ 'not-found' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }
    });
  }

}
