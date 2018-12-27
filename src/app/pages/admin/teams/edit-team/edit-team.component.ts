import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamsService } from '../teams.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { translate, ErrorHelper } from '../../../../@shared/helpers';
import { ITeam } from '../../../../@shared/interfaces';
import * as moment from 'moment';
import * as codeConfig from '../../../../@shared/config/codes.config';

@Component({
  selector: 'ns-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss'],
})
export class EditTeamComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public usersArray = [];
  public now = new Date();
  public team: ITeam;
  public isLoading = true;

  constructor(private errorHelper: ErrorHelper,
              private teamsService: TeamsService,
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
      name: new FormControl(null, [ Validators.required ]),
      createdAt: new FormControl(null, [ Validators.required ]),
      createdBy: new FormControl(null, [ Validators.required ]),
      updatedAt: new FormControl(null, [ Validators.required ]),
      updatedBy: new FormControl(null, [ Validators.required ]),
    });

  }

  // Form Getters
  get name() { return this.form.get('name'); }
  get createdAt() { return this.form.get('createdAt'); }
  get createdBy() { return this.form.get('createdBy'); }
  get updatedAt() { return this.form.get('updatedAt'); }
  get updatedBy() { return this.form.get('updatedBy'); }

  /**
   * @description ngOnInit
   */
  ngOnInit() {
    this.getUsers().then(() => {
      this.teamsService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
        if (response.response.success) {
          this.team = response.output[0];

          // set the match values
          this.name.setValue(this.team.name);
          this.createdAt.setValue(this.team.createdAt);
          this.updatedAt.setValue(this.team.updatedAt);

          // createdBy field
          if (!!this.team.createdBy && this.team.createdBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.team.createdBy._id) >= 0) {
              this.createdBy.setValue(this.team.createdBy._id, {onlySelf: true});
            } else if (this.team.createdBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.team.createdBy._id) < 0) {
                this.usersArray.push(this.team.createdBy);
              }
              this.createdBy.setValue(this.team.createdBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.createdBy.setValue(1, {onlySelf: true});
            }
          }

          // updatedBy field
          if (!!this.team.updatedBy && this.team.updatedBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.team.updatedBy._id) >= 0) {
              this.updatedBy.setValue(this.team.updatedBy._id, {onlySelf: true});
            } else if (this.team.updatedBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.team.updatedBy._id) < 0) {
                this.usersArray.push(this.team.updatedBy);
              }
              this.updatedBy.setValue(this.team.updatedBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.updatedBy.setValue(1, {onlySelf: true});
            }
          }

          // mark all fields as touched
          this.touchAllFields();

          this.isLoading = false;

        } else {
          this.errorHelper.processedButFailed(response);
        }
      }, err => {

        const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

        switch (error.name || error.type) {
          case codeConfig.getCodeByName('TEAM_NOT_FOUND', 'core').name: {
            this.router.navigate(['/pages/admin/teams/']).then(() => {
              this.toasterService.popAsync('error', translate('TEAM_NOT_FOUND_TITLE'), translate('TEAM_NOT_FOUND_MSG'));
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
   * @description Checks if the team has been changed
   * @return {boolean}
   */
  isSame() {
    return !!this.team ? (this.name.value === this.team.name) &&
           (this.createdBy.value === this.team.createdBy._id) &&
           (this.updatedBy.value === this.team.updatedBy._id) &&
           (moment(this.createdAt.value).isSame(this.team.createdAt)) &&
           (moment(this.updatedAt.value).isSame(this.team.updatedAt)) : false;
  }

  /**
   * @description Deletes a Team
   */
  deleteTeam() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.team.name}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_TEAM_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
        classes: 'btn btn-danger',
        action: () => {
          this.teamsService.delete(this.team._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/teams']).then(() => {
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
   * @description Marks all fields as touched
   */
  touchAllFields() {
    this.name.markAsTouched();
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
      this.isLoading = true;
      this.teamsService.update(this.team._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/teams']).then(() => {
            this.toasterService.popAsync('success', translate('TEAM_UPDATED_TITLE'), translate('TEAM_UPDATED_MSG'));
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
          this.errorHelper.processedButFailed(response);
        }
      }, err => {
        this.isLoading = false;
        const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

        switch (error.name || error.type) {
          case 'TEAM_NAME_DUPLICATE': {
            this.name.setErrors({ 'duplicate': true }); break;
          }
          default: {
            this.errorHelper.handleGenericError(err); break;
          }
        }
      });
    }
  }
}
