import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from '../groups.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { IGroup } from '../../../../@shared/interfaces';
import { PagesMenuService } from '../../../pages-menu.service';
import { translate, ErrorHelper } from '../../../../@shared/helpers';
import * as moment from 'moment';
import * as codeConfig from '../../../../@shared/config/codes.config';

@Component({
  selector: 'ns-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss'],
})
export class EditGroupComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public usersArray = [];
  public now = new Date();
  public group: IGroup;
  public isLoading = true;

  constructor(private errorHelper: ErrorHelper,
              private groupsService: GroupsService,
              private toasterService: ToasterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private usersService: UserService,
              private modalService: NgbModal,
              private pagesMenuService: PagesMenuService) {

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
      this.groupsService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
        if (response.response.success) {
          this.group = response.output[0];

          // set the match values
          this.name.setValue(this.group.name);
          this.createdAt.setValue(this.group.createdAt);
          this.updatedAt.setValue(this.group.updatedAt);

          // createdBy field
          if (!!this.group.createdBy && this.group.createdBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.group.createdBy._id) >= 0) {
              this.createdBy.setValue(this.group.createdBy._id, {onlySelf: true});
            } else if (this.group.createdBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.group.createdBy._id) < 0) {
                this.usersArray.push(this.group.createdBy);
              }
              this.createdBy.setValue(this.group.createdBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.createdBy.setValue(1, {onlySelf: true});
            }
          }

          // updatedBy field
          if (!!this.group.updatedBy && this.group.updatedBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.group.updatedBy._id) >= 0) {
              this.updatedBy.setValue(this.group.updatedBy._id, {onlySelf: true});
            } else if (this.group.updatedBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.group.updatedBy._id) < 0) {
                this.usersArray.push(this.group.updatedBy);
              }
              this.updatedBy.setValue(this.group.updatedBy._id, {onlySelf: true});
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
          case codeConfig.getCodeByName('GROUP_NOT_FOUND', 'core').name: {
            this.router.navigate(['/pages/admin/groups/']).then(() => {
              this.toasterService.popAsync('error', translate('GROUP_NOT_FOUND_TITLE'), translate('GROUP_NOT_FOUND_MSG'));
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
   * @description Checks if the group has been changed
   * @return {boolean}
   */
  isSame() {
    return !!this.group ? (this.name.value === this.group.name) &&
           (this.createdBy.value === this.group.createdBy._id) &&
           (this.updatedBy.value === this.group.updatedBy._id) &&
           (moment(this.createdAt.value).isSame(this.group.createdAt)) &&
           (moment(this.updatedAt.value).isSame(this.group.updatedAt)) : false;
  }

  /**
   * @description Deletes a Group
   */
  deleteGroup() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.group.name}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_GROUP_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
        classes: 'btn btn-danger',
        action: () => {
          this.groupsService.delete(this.group._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/group']).then(() => {
                modal.close();
                this.pagesMenuService.refresh();
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
      this.groupsService.update(this.group._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/groups/']).then(() => {
            this.toasterService.popAsync('success', translate('GROUP_UPDATED_TITLE'), translate('GROUP_UPDATED_MSG'));
            this.isLoading = false;
            this.pagesMenuService.refresh();
          });
        } else {
          this.isLoading = false;
          this.errorHelper.processedButFailed(response);
        }
      }, err => {
        this.isLoading = false;
        const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

        switch (error.name || error.type) {
          case 'MATCH_GROUP_NAME_DUPLICATE': {
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
