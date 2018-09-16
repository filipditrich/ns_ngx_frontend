import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../@core/services/auth/auth.service';
// import { AlertsService } from '../../../@core/services/alerts/alerts.service';
import { passwordConfirmation, passwordStrength } from '../../../@core/helpers/validators.helper';
import { CredResetService } from './reset.service';
import { ErrorHelper } from '../../../@core/helpers/error.helper';

import * as codeConfig from '../../../@core/config/codes.config';

@Component({
  selector: 'ns-cred-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  public newPasswordForm: FormGroup;
  public submitted = false;
  public hash: string;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private titleService: Title,
              private credResetService: CredResetService,
              private route: ActivatedRoute,
              private errorHelper: ErrorHelper) {

    this.newPasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required, passwordStrength()
      ]),
      passwordSubmit: new FormControl(null, [ Validators.required ])
    }, passwordConfirmation());

    this.titleService.setTitle('Support » Password Reset');
    this.hash = this.route.snapshot.paramMap.get('hash');
  }

  get password() { return this.newPasswordForm.get('password'); }
  get passwordSubmit() { return this.newPasswordForm.get('passwordSubmit'); }

  ngOnInit() {
  }

  onSubmit(input) {
    if (!this.newPasswordForm.valid) {
      this.password.markAsTouched();
      this.passwordSubmit.markAsTouched();
    } else {
      if (!this.submitted) {
        this.callPasswordResetSvc(input);
        this.submitted = true;
      }
    }
  }

  callPasswordResetSvc(input) {

    this.credResetService.createNewPassword(this.hash, input).subscribe(response => {

      if (response.response.success) {
        this.router.navigate(['/login']).then(() => {
          // this.alertsService.alertSuccess({
          //   title: 'Password changed!',
          //   body: 'Your password has been successfully changed. You can now login with your new password!'
          // }, 7500);
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
        });
      } else {
        // unsuccessful
        this.submitted = false;
        this.errorHelper.processedButFailed(response);
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.submitted = false;

      switch (error.name) {
        case codeConfig.getCodeByName('NEW_PASSWORD_IS_OLD', 'auth').name: {
          this.password.setErrors({ 'new-is-old' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }

    });

  }

}
