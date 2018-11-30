import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatchesService } from '../matches.service';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../../places';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UserService } from '../../../user/user.service';
import { IMatch } from '../../../../@core/models/match.interface';
import * as codeConfig from '../../../../@core/config/codes.config';
import * as moment from 'moment';

@Component({
  selector: 'ns-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMatchComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public placesArray = [];
  public usersArray = [];
  public now = new Date();
  public match: IMatch;
  public isLoading = true;

  // ViewChild of ng-select component
  @ViewChild('placeID') ngSelectPlace: NgSelectComponent;
  @ViewChild('updatedByID') ngSelectUpdatedBy: NgSelectComponent;
  @ViewChild('createdByID') ngSelectCreatedBy: NgSelectComponent;

  constructor(private matchesService: MatchesService,
              private errorHelper: ErrorHelper,
              private placesService: PlacesService,
              private toasterService: ToasterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private usersService: UserService) {

    /**
     * @description FormGroup
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      title: new FormControl(null, [ Validators.required ]),
      date: new FormControl(null, [ Validators.required ]),
      place: new FormControl(null, [ Validators.required ]),
      note: new FormControl(null, []),
      enrollmentOpens: new FormControl(null, []),
      enrollmentCloses: new FormControl(null, []),
      maxCap: new FormControl(null, [ Validators.required, Validators.min(1) ]),
      createdAt: new FormControl(null, [ Validators.required ]),
      createdBy: new FormControl(null, [ Validators.required ]),
      updatedAt: new FormControl(null, [ Validators.required ]),
      updatedBy: new FormControl(null, [ Validators.required ]),
    });

  }

  // Form Getters
  get title() { return this.form.get('title'); }
  get date() { return this.form.get('date'); }
  get place() { return this.form.get('place'); }
  get note() { return this.form.get('note'); }
  get enrollmentOpens() { return this.form.get('enrollmentOpens'); }
  get enrollmentCloses() { return this.form.get('enrollmentCloses'); }
  get maxCap() { return this.form.get('maxCap'); }
  get createdAt() { return this.form.get('createdAt'); }
  get createdBy() { return this.form.get('createdBy'); }
  get updatedAt() { return this.form.get('updatedAt'); }
  get updatedBy() { return this.form.get('updatedBy'); }

  /**
   * @description ngOnInit
   */
  ngOnInit() {
    Promise.all([ this.getPlaces(), this.getUsers()] ).then(() => {
      this.matchesService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
        if (response.response.success) {
          this.match = response.output[0];

          // set the match values
          this.title.setValue(this.match.title);
          this.date.setValue(new Date(this.match.date));
          this.maxCap.setValue(this.match.enrollment.maxCapacity);

          // place field
          if (!!this.match.place && !!this.match.place._id) {
            if (!!this.ngSelectPlace.itemsList.findItem(this.match.place._id)) {
              this.ngSelectPlace.select(this.ngSelectPlace.itemsList.findItem(this.match.place._id));
            } else if (this.match.place.name === '(unavailable place)') {
              if (!this.ngSelectPlace.itemsList.findItem(this.match.place._id)) {
                this.ngSelectPlace.itemsList.addItem(this.match.place);
              }
              this.ngSelectPlace.select(this.ngSelectPlace.itemsList.findItem(this.match.place._id));
            } else {
              if (!this.ngSelectPlace.itemsList.findItem(1)) {
                this.ngSelectPlace.itemsList.addItem({ _id: 1, name: '(unknown place)' });
              }
              this.ngSelectPlace.select(this.ngSelectPlace.itemsList.findItem(1));
            }
          }

          this.enrollmentOpens.setValue(new Date(this.match.enrollment.enrollmentOpens));
          this.enrollmentCloses.setValue(new Date(this.match.enrollment.enrollmentCloses));
          this.note.setValue(this.match.note);

          // TODO: only if user is administrator
          this.createdAt.setValue(this.match.createdAt);
          this.updatedAt.setValue(this.match.updatedAt);

          // createdBy field
          if (!!this.match.createdBy && !!this.match.createdBy._id) {
            if (!!this.ngSelectCreatedBy.itemsList.findItem(this.match.createdBy._id)) {
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(this.match.createdBy._id));
            } else if (this.match.createdBy.username === 'deletedUser') {
              if (!this.ngSelectCreatedBy.itemsList.findItem(this.match.createdBy._id)) {
                this.ngSelectCreatedBy.itemsList.addItem(this.match.createdBy);
              }
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(this.match.createdBy._id));
            } else {
              if (!this.ngSelectCreatedBy.itemsList.findItem(1)) {
                this.ngSelectCreatedBy.itemsList.addItem({ _id: 1, name: '(unknown user)' });
              }
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(1));
            }
          }

          // updatedBy field
          if (!!this.match.updatedBy && !!this.match.updatedBy._id) {
            if (!!this.ngSelectUpdatedBy.itemsList.findItem(this.match.updatedBy._id)) {
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(this.match.updatedBy._id));
            } else if (this.match.updatedBy.username === 'deletedUser') {
              if (!this.ngSelectUpdatedBy.itemsList.findItem(this.match.updatedBy._id)) {
                this.ngSelectUpdatedBy.itemsList.addItem(this.match.updatedBy);
              }
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(this.match.updatedBy._id));
            } else {
              if (!this.ngSelectUpdatedBy.itemsList.findItem(1)) {
                this.ngSelectUpdatedBy.itemsList.addItem({ _id: 1, name: '(unknown user)' });
              }
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(1));
            }
          }

          // hack/fix for misplaced values
          this.ngSelectPlace.focus();
          this.ngSelectCreatedBy.focus();
          this.ngSelectUpdatedBy.focus();
          document.getElementById('title').focus();
          document.getElementById('title').blur();

          // mark all fields as touched
          this.touchAllFields();

          // disable inputs if the match is already in past
          if (moment(this.match.date).isBefore(this.now)) {
            this.toasterService.popAsync('info', 'Cannot edit', 'This match has already been played. So you cannot change it\'s properties.');
            this.title.disable();
            this.date.disable();
            this.place.disable();
            this.enrollmentOpens.disable();
            this.enrollmentCloses.disable();
            this.maxCap.disable();
            this.note.disable();
          }

          this.isLoading = false;

        } else {
          this.errorHelper.processedButFailed(response);
        }
      }, err => {

        const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

        switch (error.name || error.type) {
          case codeConfig.getCodeByName('MATCH_NOT_FOUND', 'core').name: {
            this.router.navigate(['/pages/admin/matches/']).then(() => {
              this.toasterService.popAsync('error', 'Match not found.', 'Match with the specified ID is invalid or does not exist.');
            });
            break;
          }
          default: {
            this.errorHelper.handleGenericError(err);
            break;
          }
        }
      });
    }).catch(error => {
      this.errorHelper.handleGenericError(error);
      this.isLoading = true;
    });
  }

  /**
   * @description Checks if the match has been changed
   * @return {boolean}
   */
  isSame() {
    // im so sorry, here I must've used tabs and spaces together to make it look nicer :(
    return (this.title.value === this.match.title) &&
           (moment(this.date.value).isSame(this.match.date)) &&
           (this.place.value === this.match.place._id) &&
           (moment(this.enrollmentOpens.value).isSame(this.match.enrollment.enrollmentOpens)) &&
           (moment(this.enrollmentCloses.value).isSame(this.match.enrollment.enrollmentCloses)) &&
           (this.note.value === this.match.note) &&
           (this.createdBy.value === this.match.createdBy._id) &&
           (this.updatedBy.value === this.match.updatedBy._id) &&
           (moment(this.createdAt.value).isSame(this.match.createdAt)) &&
           (moment(this.updatedAt.value).isSame(this.match.updatedAt));
  }

  /**
   * @description Loads Places from server
   */
  getPlaces() {
    return new Promise((resolve, reject) => {
      this.placesService.get().subscribe(response => {
        if (response.response.success) {
          this.placesArray = response.output;
          this.ngSelectPlace.itemsList.setItems(this.placesArray);
          resolve();
        } else {
          this.errorHelper.processedButFailed(response);
          reject(response);
        }
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * @description Loads Users from server
   */
  getUsers() {
    return new Promise((resolve, reject) => {
      this.usersService.getAllUsers().subscribe(response => {
        if (response.response.success) {
          this.usersArray = response.output;
          this.ngSelectCreatedBy.itemsList.setItems(this.usersArray);
          this.ngSelectUpdatedBy.itemsList.setItems(this.usersArray);
          resolve();
        } else {
          this.errorHelper.processedButFailed(response);
          reject(response);
        }
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * @description Marks all fields as touched
   */
  touchAllFields() {
    this.title.markAsTouched();
    this.date.markAsTouched();
    this.place.markAsTouched();
    this.note.markAsTouched();
    this.enrollmentOpens.markAsTouched();
    this.enrollmentCloses.markAsTouched();
    this.createdAt.markAsTouched();
    this.createdBy.markAsTouched();
    this.updatedAt.markAsTouched();
    this.updatedBy.markAsTouched();
  }

  /**
   * @description Handler for onSubmit event
   * @param input
   */
  submitForm(input) {

    if (!this.form.valid) {
      this.touchAllFields();
    } else {
      input['enrollment'] = this.match.enrollment;
      input['enrollment']['enrollmentOpens'] = input.enrollmentOpens;
      input['enrollment']['enrollmentCloses'] = input.enrollmentCloses;
      input['enrollment']['maxCapacity'] = input.maxCap;
      this.matchesService.update(this.match._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/matches']).then(() => {
            this.toasterService.popAsync('success', 'Match Updated!', 'Match successfully updated.');
          });
        } else {
          this.errorHelper.processedButFailed(response);
        }
      }, err => {
        const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

        switch (error.name || error.type) {
          case codeConfig.getCodeByName('MATCH_DATE_DUPLICATE', 'core').name: {
            this.date.setErrors({ 'duplicate' : true }); break;
          }
          default: {
            this.errorHelper.handleGenericError(err);
            break;
          }
        }
      });
    }
  }
}
