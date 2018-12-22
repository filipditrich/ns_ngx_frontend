import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { translate, ErrorHelper } from '../../../@shared/helpers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import * as codeConfig from '../../../@shared/config/codes.config';

@Component({
  selector: 'ns-registration-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RegistrationRequestComponent implements OnInit {

  public form: FormGroup;
  public isLoading = true;

  constructor(private httpClient: HttpClient,
              private fb: FormBuilder,
              private router: Router,
              private registrationService: RegistrationService,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    /**
     * @description Form Group
     * @type {FormGroup}
     */
    // TODO - import settings from server (frontend conf)
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required, Validators.minLength(5),
      ]),
      email: new FormControl(null, [
        Validators.required, Validators.email,
      ]),
    });

  }

  // getters
  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }

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
      this.name.markAsTouched();
      this.email.markAsTouched();
    } else {
      if (!this.isLoading) {
        this.makeRequest(input);
      }
    }

  }

  /**
   * @description Calls the Registration Request service
   * @param input
   */
  makeRequest(input) {
    this.isLoading = true;
    this.registrationService.requestRegistration(input).subscribe(response => {
      if (response.response.success) {
        // TODO - page with you request is waiting to be accepted blah blah blah...
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('success', translate('REG_REQ_SENT_TITLE'), translate('REG_REQ_SENT_MSG'));
        }).catch(error => {
          this.errorHelper.handleGenericError(error);
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
        this.errorHelper.processedButFailed(response);
      }

    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;
      this.isLoading = false;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('REQUEST_WITH_EMAIL_ALREADY_MADE', 'operator').name: {
          this.email.setErrors({ 'in-use' : true }); break;
        }
        case codeConfig.getCodeByName('EMAIL_ALREADY_REQUESTED', 'operator').name: {
          this.email.setErrors({ 'in-use' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
        }
      }

    });
  }

}
