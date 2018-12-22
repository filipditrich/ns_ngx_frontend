import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../@core/services/auth/auth.service';
import { CredResetService } from './reset.service';
import { ToasterService } from 'angular2-toaster';
import { translate, passwordStrength, passwordConfirmation, ErrorHelper } from '../../@shared/helpers';
import * as codeConfig from '../../@shared/config/codes.config';

@Component({
  selector: 'ns-cred-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {

  public form: FormGroup;
  public isLoading = true;
  public hash: string;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private credResetService: CredResetService,
              private route: ActivatedRoute,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    /**
     * @description Form Group
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      password: new FormControl(null, [
        Validators.required, passwordStrength(),
      ]),
      passwordSubmit: new FormControl(null, [ Validators.required ]),
    }, passwordConfirmation());
    this.hash = this.route.snapshot.paramMap.get('hash');
  }

  // getters
  get password() { return this.form.get('password'); }
  get passwordSubmit() { return this.form.get('passwordSubmit'); }

  /** ngOnInit **/
  ngOnInit() {
    this.isLoading = false;
  }

  /**
   * @description Handler for onSubmit event
   * @param input
   */
  onSubmit(input) {
    if (!this.form.valid) {
      this.password.markAsTouched();
      this.passwordSubmit.markAsTouched();
    } else {
      if (!this.isLoading) {
        this.callPasswordResetSvc(input);
      }
    }
  }

  /**
   * @description Calls the Password Reset service
   * @param input
   */
  callPasswordResetSvc(input) {
    this.isLoading = true;
    this.credResetService.createNewPassword(this.hash, input).subscribe(response => {
      if (response.response.success) {
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('success', translate('PASS_RES_CHANGED_TITLE'), translate('PASS_RES_CHANGED_MSG'));
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
        case codeConfig.getCodeByName('NEW_PASSWORD_IS_OLD', 'operator').name: {
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
