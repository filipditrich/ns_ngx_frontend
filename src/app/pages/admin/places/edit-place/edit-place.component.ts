import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../places.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { translate, ErrorHelper } from '../../../../@shared/helpers';
import { IPlace } from '../../../../@shared/interfaces';
import * as moment from 'moment';
import * as codeConfig from '../../../../@shared/config/codes.config';

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
          if (!!this.place.createdBy && this.place.createdBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.place.createdBy._id) >= 0) {
              this.createdBy.setValue(this.place.createdBy._id, {onlySelf: true});
            } else if (this.place.createdBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.place.createdBy._id) < 0) {
                this.usersArray.push(this.place.createdBy);
              }
              this.createdBy.setValue(this.place.createdBy._id, {onlySelf: true});
            } else {
              if (this.usersArray.findIndex(x => x._id === 1) < 0) {
                this.usersArray.push({_id: 1, name: '(unknown user)'});
              }
              this.createdBy.setValue(1, {onlySelf: true});
            }
          }

          // updatedBy field
          if (!!this.place.updatedBy && this.place.updatedBy._id) {
            if (this.usersArray.findIndex(x => x._id === this.place.updatedBy._id) >= 0) {
              this.updatedBy.setValue(this.place.updatedBy._id, {onlySelf: true});
            } else if (this.place.updatedBy.username === 'deletedUser') {
              if (this.usersArray.findIndex(x => x._id === this.place.updatedBy._id) < 0) {
                this.usersArray.push(this.place.updatedBy);
              }
              this.updatedBy.setValue(this.place.updatedBy._id, {onlySelf: true});
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
          case codeConfig.getCodeByName('PLACE_NOT_FOUND', 'core').name: {
            this.router.navigate(['/pages/admin/places/']).then(() => {
              this.toasterService.popAsync('error',  translate('PLACE_NOT_FOUND_TITLE'), translate('PLACE_NOT_FOUND_MSG'));
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

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.place.name}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_PLACE_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
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

      this.placesService.update(this.place._id, input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/places']).then(() => {
            this.toasterService.popAsync('success', translate('PLACE_UPDATED_TITLE'), translate('PLACE_UPDATED_MSG'));
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
