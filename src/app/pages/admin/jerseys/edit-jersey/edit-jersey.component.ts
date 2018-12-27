import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JerseysService } from '../jerseys.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { IJersey } from '../../../../@shared/interfaces';
import { translate, ErrorHelper } from '../../../../@shared/helpers';
import * as moment from 'moment';
import * as codeConfig from '../../../../@shared/config/codes.config';

@Component({
  selector: 'ns-edit-jersey',
  templateUrl: './edit-jersey.component.html',
  styleUrls: ['./edit-jersey.component.scss'],
})
export class EditJerseyComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public usersArray = [];
  public now = new Date();
  public jersey: IJersey;
  public isLoading = true;

  constructor(private errorHelper: ErrorHelper,
              private jerseysService: JerseysService,
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
      this.jerseysService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
        if (response.response.success) {
          this.jersey = response.output[0];

          // set the match values
          this.name.setValue(this.jersey.name);
          this.createdAt.setValue(this.jersey.createdAt);
          this.updatedAt.setValue(this.jersey.updatedAt);

          // createdBy field
          if (!!this.jersey.createdBy && this.jersey.createdBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.jersey.createdBy._id) >= 0) {
              this.createdBy.setValue(this.jersey.createdBy._id, {onlySelf: true});
            } else if (this.jersey.createdBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.jersey.createdBy._id) < 0) {
                this.usersArray.push(this.jersey.createdBy);
              }
              this.createdBy.setValue(this.jersey.createdBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.createdBy.setValue(1, {onlySelf: true});
            }
          }

          // updatedBy field
          if (!!this.jersey.updatedBy && this.jersey.updatedBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.jersey.updatedBy._id) >= 0) {
              this.updatedBy.setValue(this.jersey.updatedBy._id, {onlySelf: true});
            } else if (this.jersey.updatedBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.jersey.updatedBy._id) < 0) {
                this.usersArray.push(this.jersey.updatedBy);
              }
              this.updatedBy.setValue(this.jersey.updatedBy._id, {onlySelf: true});
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
          case codeConfig.getCodeByName('JERSEY_NOT_FOUND', 'core').name: {
            this.router.navigate(['/pages/admin/jerseys/']).then(() => {
              this.toasterService.popAsync('error', translate('JERSEY_NOT_FOUND_TITLE'),  translate('JERSEY_NOT_FOUND_MSG'));
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
   * @description Checks if the jersey has been changed
   * @return {boolean}
   */
  isSame() {
    return !!this.jersey ? (this.name.value === this.jersey.name) &&
           (this.createdBy.value === this.jersey.createdBy._id) &&
           (this.updatedBy.value === this.jersey.updatedBy._id) &&
           (moment(this.createdAt.value).isSame(this.jersey.createdAt)) &&
           (moment(this.updatedAt.value).isSame(this.jersey.updatedAt)) : false;
  }

  /**
   * @description Deletes a Jersey
   */
  deleteJersey() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.jersey.name}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_JERSEY_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
        classes: 'btn btn-danger',
        action: () => {
          this.jerseysService.delete(this.jersey._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/jerseys']).then(() => {
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
      this.jerseysService.update(this.jersey._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/jerseys']).then(() => {
            this.toasterService.popAsync('success', translate('JERSEY_UPDATED_TITLE'), translate('JERSEY_UPDATED_MSG'));
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
          case 'JERSEY_NAME_DUPLICATE': {
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
