import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {TeamsService} from '../../teams';
import { MatchesService } from '../matches.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../../places';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { GroupsService } from '../../groups';
import { IMatch } from '../../../../@shared/interfaces';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { translate, ErrorHelper, isString } from '../../../../@shared/helpers';
import * as codeConfig from '../../../../@shared/config/codes.config';
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
  public groupsArray = [];
  public teamsArray = [];
  public usersArray = [];
  public now = new Date();
  public match: IMatch;
  public isLoading = true;

  @ViewChild('reminderTeamsID') ngReminderTeams: NgSelectComponent;

  constructor(private matchesService: MatchesService,
              private errorHelper: ErrorHelper,
              private placesService: PlacesService,
              private teamsService: TeamsService,
              private groupsService: GroupsService,
              private toasterService: ToasterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private usersService: UserService,
              private modalService: NgbModal) {

    /**
     * @description FormGroup
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      title: new FormControl(null, [ Validators.required, isString() ]),
      date: new FormControl(null, [ Validators.required ]),
      place: new FormControl(null, [ Validators.required ]),
      group: new FormControl(null, [ Validators.required ]),
      note: new FormControl(null, []),
      enrollmentOpens: new FormControl(null, []),
      enrollmentCloses: new FormControl(null, []),
      maxCap: new FormControl(null, [ Validators.required, Validators.min(1) ]),
      reminderDate: new FormControl(null, []),
      reminderTeams: new FormControl(null, []),
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
  get group() { return this.form.get('group'); }
  get note() { return this.form.get('note'); }
  get enrollmentOpens() { return this.form.get('enrollmentOpens'); }
  get enrollmentCloses() { return this.form.get('enrollmentCloses'); }
  get maxCap() { return this.form.get('maxCap'); }
  get reminderDate() { return this.form.get('reminderDate'); }
  get reminderTeams() { return this.form.get('reminderTeams'); }
  get createdAt() { return this.form.get('createdAt'); }
  get createdBy() { return this.form.get('createdBy'); }
  get updatedAt() { return this.form.get('updatedAt'); }
  get updatedBy() { return this.form.get('updatedBy'); }

  /**
   * @description ngOnInit
   */
  ngOnInit() {
    Promise.all([ this.getPlaces(), this.getUsers(), this.getGroups(), this.getTeams() ] ).then(() => {
      this.matchesService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
        if (response.response.success) {
          this.match = response.output[0];

          // set the match values
          this.title.setValue(this.match.title);
          this.date.setValue(new Date(this.match.date));
          this.maxCap.setValue(this.match.enrollment.maxCapacity);
          this.enrollmentOpens.setValue(new Date(this.match.enrollment.enrollmentOpens));
          this.enrollmentCloses.setValue(new Date(this.match.enrollment.enrollmentCloses));
          this.reminderDate.setValue(new Date(this.match.reminder.reminderDate));
          this.note.setValue(this.match.note);
          this.createdAt.setValue(this.match.createdAt);
          this.updatedAt.setValue(this.match.updatedAt);

          // reminder teams
          for (const t of this.match.reminder.reminderTeams) {
            const label = this.teamsArray.find(x => x._id === t._id);
            if (label) {
              this.ngReminderTeams.itemsList.addItem(label);
              const team = this.ngReminderTeams.itemsList.findByLabel(label.name);
              if (team) this.ngReminderTeams.select(team);
            }
          }
          this.ngReminderTeams.focus();
          document.getElementById('title').focus();
          document.getElementById('title').blur();

          // place field
          if (!!this.match.place && this.match.place._id) {
            if (this.placesArray.findIndex(x => x._id === this.match.place._id) >= 0) {
              this.place.setValue(this.match.place._id, { onlySelf: true });
            } else if (this.match.place.name === '(unavailable place)') {
              if (this.placesArray.findIndex(x => x._id === this.match.place._id) < 0) {
                this.placesArray.push(this.match.place);
              }
              this.place.setValue(this.match.place._id, { onlySelf: true });
            } else {
              if (this.placesArray.findIndex(x => x._id === 1) < 0) {
                this.placesArray.push({ _id: 1, name: '(unknown place)' });
              }
              this.place.setValue(1, { onlySelf: true });
            }
          }

          // group field
          if (!!this.match.group && this.match.group._id) {
            if (this.groupsArray.findIndex(x => x._id === this.match.group._id) >= 0) {
              this.group.setValue(this.match.group._id, {onlySelf: true});
            } else if (this.match.group.name === '(unavailable group)') {
              if (this.groupsArray.findIndex(x => x._id === this.match.group._id) < 0) {
                this.groupsArray.push(this.match.group);
              }
              this.group.setValue(this.match.group._id, {onlySelf: true});
            } else {
              if (this.groupsArray.findIndex(x => x._id === 1) < 0) {
                this.groupsArray.push({_id: 1, name: '(unknown group)'});
              }
              this.group.setValue(1, {onlySelf: true});
            }
          }


          // createdBy field
          if (!!this.match.createdBy && this.match.createdBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.match.createdBy._id) >= 0) {
              this.createdBy.setValue(this.match.createdBy._id, {onlySelf: true});
            } else if (this.match.createdBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.match.createdBy._id) < 0) {
                this.usersArray.push(this.match.createdBy);
              }
              this.createdBy.setValue(this.match.createdBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.createdBy.setValue(1, {onlySelf: true});
            }
          }

          // updatedBy field
          if (!!this.match.updatedBy && this.match.updatedBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.match.updatedBy._id) >= 0) {
              this.updatedBy.setValue(this.match.updatedBy._id, {onlySelf: true});
            } else if (this.match.updatedBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.match.updatedBy._id) < 0) {
                this.usersArray.push(this.match.updatedBy);
              }
              this.updatedBy.setValue(this.match.updatedBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.updatedBy.setValue(1, {onlySelf: true});
            }
          }

          // mark all fields as touched
          this.touchAllFields();

          // disable inputs if the match is already in past
          if (moment(this.match.date).isBefore(this.now)) {
            this.toasterService.popAsync('info', translate('MATCH_NOT_EDITABLE_TITLE'), translate('MATCH_NOT_EDITABLE_MSG'));
            this.title.disable();
            this.date.disable();
            this.place.disable();
            this.group.disable();
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
              this.toasterService.popAsync('error', translate('MATCH_NOT_FOUND_TITLE'), translate('MATCH_NOT_FOUND_MSG'));
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
           (this.group.value === this.match.group._id) &&
           (moment(this.enrollmentOpens.value).isSame(this.match.enrollment.enrollmentOpens)) &&
           (moment(this.enrollmentCloses.value).isSame(this.match.enrollment.enrollmentCloses)) &&
           (this.note.value === this.match.note) &&
           (moment(this.reminderDate.value).isSame(this.match.reminder.reminderDate)) &&
           (this.match.reminder.reminderTeams.map(a => a._id)
             .filter(x => this.ngReminderTeams.itemsList.selectedItems
               .map((b: any) => b.value._id).indexOf(x) < 0).length === 0) &&
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
   * @description Loads Teams from Server
   * @return {Promise<any>}
   */
  getTeams() {
    return new Promise((resolve, reject) => {
      this.teamsService.get().subscribe(response => {
        if (response.response.success) {
          this.teamsArray = response.output;
          resolve();
        } else {
          this.errorHelper.processedButFailed(response);
          reject(response);
        }
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * @description Loads Groups from server
   * @return {Promise<any>}
   */
  getGroups() {
    return new Promise((resolve, reject) => {
      this.groupsService.get().subscribe(response => {
        if (response.response.success) {
          this.groupsArray = response.output;
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
   * @description Deletes a Match
   */
  deleteMatch() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.match.title}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_MATCH_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
        classes: 'btn btn-danger',
        action: () => {
          this.matchesService.delete(this.match._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/matches']).then(() => {
                modal.close();
              });
            } else {
              this.errorHelper.processedButFailed(response);
            }
          }, error => {
            this.errorHelper.handleGenericError(error);
          });
        },
      },
      {
        text: translate('CANCEL'),
        classes: 'btn btn-secondary',
        action: () => modal.close(),
      },
    ];
  }

  /**
   * @description Marks all fields as touched
   */
  touchAllFields() {
    this.title.markAsTouched();
    this.date.markAsTouched();
    this.place.markAsTouched();
    this.group.markAsTouched();
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
      input['reminder'] = this.match.reminder;
      input['reminder']['reminderDate'] = input.reminderDate;
      input['reminder']['reminderTeams'] = this.ngReminderTeams.itemsList.selectedItems.map((x: any) => x.value._id);
      this.matchesService.update(this.match._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/matches']).then(() => {
            this.toasterService.popAsync('success', translate('MATCH_UPDATED_TITLE'), translate('MATCH_UPDATED_MSG'));
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
