import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { CredResetService } from '../reset.service';
import { translate, ErrorHelper } from '../../../@shared/helpers';
import { ToasterService } from 'angular2-toaster';
import * as codeConfig from '../../../@shared/config/codes.config';

@Component({
  selector: 'ns-request-cred-reset',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class ResetRequestComponent implements OnInit {

  public form: FormGroup;
  public isLoading = false;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private credResetService: CredResetService,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    /**
     * @description Form Group
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      type: new FormControl(null, [ Validators.required ]),
      username: new FormControl(null, []),
      email: new FormControl(null, []),
    });

  }

  // getters
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get type() { return this.form.get('type'); }

  /** ngOnInit **/
  ngOnInit() {
    // set default value
    this.type.setValue('password', { onlySelf: true });
  }

  /**
   * @description Handler for onChange event
   */
  onChange() {
    this.email.setErrors(null);
    this.email.setValue(null);
    this.email.markAsUntouched();
    this.username.setErrors(null);
    this.username.setValue(null);
    this.username.markAsUntouched();
  }

  /**
   * @description Handler for onSubmit event
   * @param input
   */
  onSubmit(input) {
    this.username.markAsTouched();
    this.email.markAsTouched();
    this.type.markAsTouched();

    if (input.type === 'username' && !!input.email) { input.username = ''; }
    if (input.type === 'password') {
      if (!!input.email) {
        this.username.setValue(' ');
      } else if (!!input.username) {
        this.email.setValue(' ');
      }
    }

    if (this.form.valid && (input.username || input.email)) {
      if (input.username === ' ') { input.username = false; }
      if (input.email === ' ') { input.email = false; }

      if (!this.isLoading) {
        if (input.type === 'password') {
          this.requestPassword(input);
          this.isLoading = true;
        } else if (input.type === 'username') {
          this.requestUsername(input);
          this.isLoading = true;
        }
      }
    }

  }

  /**
   * @description Calls the service for Password Reset Request
   * @param input
   */
  requestPassword(input) {
    this.credResetService.requestPasswordReset(input).subscribe(response => {

      if (response.response.success) {
        // TODO - navigate to custom page?
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('info', translate('EMAIL_SENT'), translate('PWD_RES_SENT_MSG'));
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      } else {
        this.isLoading = false;
        this.errorHelper.processedButFailed(response);
      }
    }, err => {

      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.isLoading = false;

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

  /**
   * @description Calls the service for Username Reset Request
   * @param input
   */
  requestUsername(input) {
    this.credResetService.sendUsernameToEmail(input).subscribe(response => {
      if (response.response.success) {
        // TODO: redirect to some custom page
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('info', translate('EMAIL_SENT'), translate('USN_RES_SENT_MSG'));
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      } else {
        this.isLoading = false;
        this.errorHelper.processedButFailed(response);
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.isLoading = false;

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
