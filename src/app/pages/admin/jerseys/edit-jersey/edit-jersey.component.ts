import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JerseysService } from '../jerseys.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { IJersey } from '../../../../@core/models/jersey.interface';
import * as moment from 'moment';
import * as codeConfig from '../../../../@core/config/codes.config';

@Component({
  selector: 'ns-edit-jersey',
  templateUrl: './edit-jersey.component.html',
  styleUrls: ['./edit-jersey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditJerseyComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public usersArray = [];
  public now = new Date();
  public jersey: IJersey;
  public isLoading = true;

  // ViewChild of ng-select component
  @ViewChild('updatedByID') ngSelectUpdatedBy: NgSelectComponent;
  @ViewChild('createdByID') ngSelectCreatedBy: NgSelectComponent;

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
          if (!!this.jersey.createdBy && !!this.jersey.createdBy._id) {
            if (!!this.ngSelectCreatedBy.itemsList.findItem(this.jersey.createdBy._id)) {
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(this.jersey.createdBy._id));
            } else if (this.jersey.createdBy.username === 'deletedUser') {
              if (!this.ngSelectCreatedBy.itemsList.findItem(this.jersey.createdBy._id)) {
                this.ngSelectCreatedBy.itemsList.addItem(this.jersey.createdBy);
              }
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(this.jersey.createdBy._id));
            } else {
              if (!this.ngSelectCreatedBy.itemsList.findItem(1)) {
                this.ngSelectCreatedBy.itemsList.addItem({ _id: 1, name: '(unknown user)' });
              }
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(1));
            }
          }

          // updatedBy field
          if (!!this.jersey.updatedBy && !!this.jersey.updatedBy._id) {
            if (!!this.ngSelectUpdatedBy.itemsList.findItem(this.jersey.updatedBy._id)) {
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(this.jersey.updatedBy._id));
            } else if (this.jersey.updatedBy.username === 'deletedUser') {
              if (!this.ngSelectUpdatedBy.itemsList.findItem(this.jersey.updatedBy._id)) {
                this.ngSelectUpdatedBy.itemsList.addItem(this.jersey.updatedBy);
              }
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(this.jersey.updatedBy._id));
            } else {
              if (!this.ngSelectUpdatedBy.itemsList.findItem(1)) {
                this.ngSelectUpdatedBy.itemsList.addItem({ _id: 1, name: '(unknown user)' });
              }
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(1));
            }
          }

          // hack/fix for misjerseyd values
          this.ngSelectCreatedBy.focus();
          this.ngSelectUpdatedBy.focus();
          document.getElementById('name').focus();
          document.getElementById('name').blur();

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
              this.toasterService.popAsync('error', 'Jersey not found.', 'Jersey with the specified ID is invalid or does not exist.');
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
    });

    modal.componentInstance.modalHeader = `Delete '${this.jersey.name}'?`;
    modal.componentInstance.modalContent = '<p>Do you really want to delete this jersey?</p>';
    modal.componentInstance.modalButtons = [
      {
        text: 'Delete',
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
        text: 'Cancel',
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

      this.jerseysService.update(this.jersey._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/jerseys']).then(() => {
            this.toasterService.popAsync('success', 'Jersey Updated!', 'Jersey successfully updated.');
          });
        } else {
          this.errorHelper.processedButFailed(response);
        }
      }, error => {
        this.errorHelper.handleGenericError(error);
      });
    }
  }
}
