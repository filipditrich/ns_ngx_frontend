import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { CredResetService } from '../reset.service';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { ToasterService } from 'angular2-toaster';
import * as codeConfig from '../../../@core/config/codes.config';

@Component({
  selector: 'ns-request-cred-reset',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class ResetRequestComponent implements OnInit {

  public form: FormGroup;
  public submitted = false;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private credResetService: CredResetService,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    this.form = new FormGroup({
      type: new FormControl(null, [ Validators.required ]),
      username: new FormControl(null),
      email: new FormControl(null, []),
    });

  }

  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get type() { return this.form.get('type'); }

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
    if (this.form.valid && (input.username || input.email)) {

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
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('info', 'Email Sent!', 'A password reset link has been sent to your email.');
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

      switch (error.name || error.type) {

        case codeConfig.getCodeByName('RESET_REQUEST_ALREADY_MADE', 'operator').name: {
          if (input.username) {
            this.username.setErrors({ 'req-dup' : true });
          } else {
            this.email.setErrors({ 'req-dup' : true });
          }
          break;
        }
        case codeConfig.getCodeByName('USER_NOT_FOUND', 'operator').name: {
          if (input.username) {
            this.username.setErrors({ 'not-found' : true });
          } else {
            this.email.setErrors({ 'not-found' : true });
          }
          break;
        }
        case codeConfig.getCodeByName('EMAIL_NOT_FOUND', 'operator').name: {
          this.email.setErrors({ 'not-found' : true }); break;
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
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('info', 'Email Sent!', 'We\'ve sent you an email with your username.');
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

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('EMAIL_NOT_FOUND', 'operator').name: {
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
