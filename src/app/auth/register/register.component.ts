import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../@core/services/auth/auth.service';
import { isUpperCase, passwordStrength, passwordConfirmation, translate, ErrorHelper } from '../../@shared/helpers';
import { RegistrationService } from './registration.service';
import { IRegistrationCredentials, ITeam } from '../../@shared/interfaces';
import { ToasterService } from 'angular2-toaster';
import * as codeConfig from '../../@shared/config/codes.config';

@Component({
  selector: 'ns-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public hash: string;
  public request: any;
  public form: FormGroup;
  public isLoading = true;
  public teams: ITeam[] = [];

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private toasterService: ToasterService,
              private fb: FormBuilder,
              private router: Router,
              private registrationService: RegistrationService,
              private route: ActivatedRoute,
              private errorHelper: ErrorHelper) {

    // TODO - Validators import settings from server (minlength, maxlength etc...)
    /**
     * @description Form Group
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      username: new FormControl(null, [
        Validators.required, Validators.minLength(2), Validators.maxLength(32),
      ]),
      name: new FormControl(null, [
        Validators.required, Validators.minLength(2),
      ]),
      password: new FormControl(null, [
        Validators.required, passwordStrength(),
      ]),
      number: new FormControl(null, [
        Validators.min(0),
      ]),
      team: new FormControl(null, [
        Validators.required,
      ]),
      passwordSubmit: new FormControl(null, [ Validators.required ]),
    }, passwordConfirmation());

    // Get the teams and list them in the <select>
    this.registrationService.getRegistrationTeams().subscribe(response => {
      if (response.response.success) {
        this.teams = response.output;
        this.isLoading = false;
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });

  }

  // getters
  get username() { return this.form.get('username'); }
  get name() { return this.form.get('name'); }
  get password() { return this.form.get('password'); }
  get number() { return this.form.get('number'); }
  get passwordSubmit() { return this.form.get('passwordSubmit'); }
  get team() { return this.form.get('team'); }

  /** ngOnInit **/
  ngOnInit() {
    this.team.setValue(0, { onlySelf: true });
    this.route.data.subscribe(data => {
      this.request = data.request;
    }, error => {});
    this.hash = this.route.snapshot.paramMap.get('hash');
    if (this.request) { this.name.setValue(this.request); }
  }

  /**
   * @description Handler for onSubmit event
   * @param input
   */
  onSubmit(input) {
    if (this.team.value === 0) this.team.setErrors({ required: true });
    if (!this.form.valid) {
      this.username.markAsTouched();
      this.password.markAsTouched();
      this.passwordSubmit.markAsTouched();
      this.name.markAsTouched();
      this.number.markAsTouched();
      this.team.markAsTouched();
    } else {
      if (!this.isLoading) {
        this.isLoading = true;
        this.callRegistrationSvc(input);
      }
    }
  }

  /**
   * @description Calls the Registration service
   * @param {IRegistrationCredentials} input
   */
  callRegistrationSvc(input: IRegistrationCredentials) {
    this.registrationService.registerUser(this.hash, input).subscribe(response => {
      this.isLoading = false;

      if (response.response.success && response.output.user) {
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.popAsync('success', translate('REGISTERED_TITLE'), translate('REGISTERED_MSG'));
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
        case codeConfig.getCodeByName('USERNAME_IN_USE', 'operator').name: {
          this.username.setErrors({ 'in-use' : true }); break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }

    });
  }

}
