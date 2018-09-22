import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RegistrationService } from '../registration.service';
// import { AlertsService } from '../../../../@core/services/alerts/alerts.service';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';

import * as codeConfig from '../../../../@core/config/codes.config';

@Component({
  selector: 'ns-registration-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RegistrationRequestComponent implements OnInit {

  public form: FormGroup;
  public submitted = false;

  constructor(private httpClient: HttpClient,
              private fb: FormBuilder,
              private router: Router,
              private titleService: Title,
              private registrationService: RegistrationService,
              private errorHelper: ErrorHelper) {

    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required, Validators.minLength(5)
      ]),
      email: new FormControl(null, [
        Validators.required, Validators.email
      ])
    });

    this.titleService.setTitle('Northern Stars » Registration Request');

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
        this.router.navigate(['/login']).then(() => {
          // this.alertsService.alertSuccess({
          //   title: 'Registration Request Sent!',
          //   body: 'Your registration request has been successfully sent. An email with further instructions has been sent to you as well.'
          // }, 7500);
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
        case codeConfig.getCodeByName('REQUEST_WITH_EMAIL_ALREADY_MADE', 'auth').name: {
          this.email.setErrors({ 'in-use' : true }); break;
        }
        case codeConfig.getCodeByName('EMAIL_ALREADY_IN_USE', 'auth').name: {
          this.email.setErrors({ 'in-use' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
        }
      }

    });
  }

}
