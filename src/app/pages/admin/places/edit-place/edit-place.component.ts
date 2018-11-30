import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../places.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { IPlace } from '../../../../@core/models/place.interface';
import * as moment from 'moment';
import * as codeConfig from '../../../../@core/config/codes.config';

@Component({
  selector: 'ns-edit-place',
  templateUrl: './edit-place.component.html',
  styleUrls: ['./edit-place.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPlaceComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public usersArray = [];
  public now = new Date();
  public place: IPlace;
  public isLoading = true;

  // ViewChild of ng-select component
  @ViewChild('updatedByID') ngSelectUpdatedBy: NgSelectComponent;
  @ViewChild('createdByID') ngSelectCreatedBy: NgSelectComponent;

  constructor(private errorHelper: ErrorHelper,
              private placesService: PlacesService,
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
      this.placesService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
        if (response.response.success) {
          this.place = response.output[0];

          // set the match values
          this.name.setValue(this.place.name);
          this.createdAt.setValue(this.place.createdAt);
          this.updatedAt.setValue(this.place.updatedAt);

          // createdBy field
          if (!!this.place.createdBy && !!this.place.createdBy._id) {
            if (!!this.ngSelectCreatedBy.itemsList.findItem(this.place.createdBy._id)) {
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(this.place.createdBy._id));
            } else if (this.place.createdBy.username === 'deletedUser') {
              if (!this.ngSelectCreatedBy.itemsList.findItem(this.place.createdBy._id)) {
                this.ngSelectCreatedBy.itemsList.addItem(this.place.createdBy);
              }
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(this.place.createdBy._id));
            } else {
              if (!this.ngSelectCreatedBy.itemsList.findItem(1)) {
                this.ngSelectCreatedBy.itemsList.addItem({ _id: 1, name: '(unknown user)' });
              }
              this.ngSelectCreatedBy.select(this.ngSelectCreatedBy.itemsList.findItem(1));
            }
          }

          // updatedBy field
          if (!!this.place.updatedBy && !!this.place.updatedBy._id) {
            if (!!this.ngSelectUpdatedBy.itemsList.findItem(this.place.updatedBy._id)) {
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(this.place.updatedBy._id));
            } else if (this.place.updatedBy.username === 'deletedUser') {
              if (!this.ngSelectUpdatedBy.itemsList.findItem(this.place.updatedBy._id)) {
                this.ngSelectUpdatedBy.itemsList.addItem(this.place.updatedBy);
              }
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(this.place.updatedBy._id));
            } else {
              if (!this.ngSelectUpdatedBy.itemsList.findItem(1)) {
                this.ngSelectUpdatedBy.itemsList.addItem({ _id: 1, name: '(unknown user)' });
              }
              this.ngSelectUpdatedBy.select(this.ngSelectUpdatedBy.itemsList.findItem(1));
            }
          }

          // hack/fix for misplaced values
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
          case codeConfig.getCodeByName('PLACE_NOT_FOUND', 'core').name: {
            this.router.navigate(['/pages/admin/places/']).then(() => {
              this.toasterService.popAsync('error', 'Place not found.', 'Place with the specified ID is invalid or does not exist.');
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
   * @description Checks if the place has been changed
   * @return {boolean}
   */
  isSame() {
    return !!this.place ? (this.name.value === this.place.name) &&
           (this.createdBy.value === this.place.createdBy._id) &&
           (this.updatedBy.value === this.place.updatedBy._id) &&
           (moment(this.createdAt.value).isSame(this.place.createdAt)) &&
           (moment(this.updatedAt.value).isSame(this.place.updatedAt)) : false;
  }

  /**
   * @description Deletes a Place
   */
  deletePlace() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
    });

    modal.componentInstance.modalHeader = `Delete '${this.place.name}'?`;
    modal.componentInstance.modalContent = '<p>Do you really want to delete this place?</p>';
    modal.componentInstance.modalButtons = [
      {
        text: 'Delete',
        classes: 'btn btn-danger',
        action: () => {
          this.placesService.delete(this.place._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/places']).then(() => {
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

      this.placesService.update(this.place._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/places']).then(() => {
            this.toasterService.popAsync('success', 'Place Updated!', 'Place successfully updated.');
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
