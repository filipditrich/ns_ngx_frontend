import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

import * as codeConfig from '../../../@core/config/codes.config';

@Component({
  selector: 'ns-registration-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RegistrationRequestComponent implements OnInit {

  public form: FormGroup;
  public submitted = false;

  constructor(private httpClient: HttpClient,
              private fb: FormBuilder,
              private router: Router,
              private registrationService: RegistrationService,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {

    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required, Validators.minLength(5),
      ]),
      email: new FormControl(null, [
        Validators.required, Validators.email,
      ]),
    });

  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }

  ngOnInit() {
  }

  onSubmit(input) {
    if (!this.form.valid) {
      this.name.markAsTouched();
      this.email.markAsTouched();
    } else {
      if (!this.submitted) {
        this.makeRequest(input);
        this.submitted = true;
      }
    }

  }

  // TODO - interface
  makeRequest(input) {
    this.registrationService.requestRegistration(input).subscribe(response => {
      if (response.response.success) {
        // TODO - page with you request is waiting to be accepted blah blah blah...
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('success', 'Registration Request Sent!', 'Your registration request has been successfully sent. An email with further instructions has been sent to you as well.');
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
        case codeConfig.getCodeByName('REQUEST_WITH_EMAIL_ALREADY_MADE', 'operator').name: {
          this.email.setErrors({ 'in-use' : true }); break;
        }
        case codeConfig.getCodeByName('EMAIL_ALREADY_IN_USE', 'operator').name: {
          this.email.setErrors({ 'in-use' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
        }
      }

    });
  }

}
