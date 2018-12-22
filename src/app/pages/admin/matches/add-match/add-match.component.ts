import {ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { MatchesService } from '../matches.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../../places';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from '../../groups';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { translate, dateLessThan, ErrorHelper } from '../../../../@shared/helpers';
import * as codeConfig from '../../../../@shared/config/codes.config';

@Component({
  selector: 'ns-add-match',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMatchComponent implements OnInit, OnDestroy {

  // public variables
  public form: FormGroup;
  public placesArray = [];
  public groupsArray = [];
  public now = new Date();
  public match: any;
  public isLoading = true;
  public isHidden = false;
  public doCheck = true;

  constructor(private matchesService: MatchesService,
              private errorHelper: ErrorHelper,
              private placesService: PlacesService,
              private groupsService: GroupsService,
              private toasterService: ToasterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private changeDetRef: ChangeDetectorRef,
              private activeModal: NgbActiveModal) {

    /**
     * @description FormGroup
     * @type {FormGroup}
     */
    this.form = new FormGroup({
      title: new FormControl(null, [ Validators.required ]),
      group: new FormControl(null, [ Validators.required ]),
      date: new FormControl(null, [ Validators.required ]),
      place: new FormControl(null, [ Validators.required ]),
      maxCap: new FormControl(null, [ Validators.required, Validators.min(1) ]),
      note: new FormControl(null, []),
      enrollmentOpens: new FormControl(null, []),
      enrollmentCloses: new FormControl(null, []),
    }, {
      validators: dateLessThan('enrollmentOpens', 'enrollmentCloses'),
    });

  }

  // Form Getters
  get title() { return this.form.get('title'); }
  get group() { return this.form.get('group'); }
  get date() { return this.form.get('date'); }
  get place() { return this.form.get('place'); }
  get note() { return this.form.get('note'); }
  get enrollmentOpens() { return this.form.get('enrollmentOpens'); }
  get enrollmentCloses() { return this.form.get('enrollmentCloses'); }
  get maxCap() { return this.form.get('maxCap'); }

  /**
   * @description ngOnInit
   */
  ngOnInit() {
    Promise.all([ this.getPlaces(), this.getGroups() ]).then(() => {
      this.isLoading = false;
      this.group.setValue(0, { onlySelf: true });
      this.place.setValue(0, { onlySelf: true });
      this.changeDetRef.detectChanges();
    }).catch(error => {
      this.errorHelper.handleGenericError(error);
    });
    setTimeout(() => {
      if (this.doCheck) {
        this.now = new Date();
        this.changeDetRef.detectChanges();
      }
    }, 60 * 1000);
  }

  /**
   * @description ngOnDestroy
   */
  ngOnDestroy() {
    this.doCheck = false;
  }

  /**
   * @description Loads Places from server
   * @return {Promise<any>}
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
   * @description Loads Groups from Server
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
      }, error => {
        reject(error);
      });
    });
  }


  /**
   * @description Marks all fields as touched
   */
  touchAllFields() {
    this.title.markAsTouched();
    this.group.markAsTouched();
    this.date.markAsTouched();
    this.place.markAsTouched();
    this.note.markAsTouched();
    this.enrollmentOpens.markAsTouched();
    this.maxCap.markAsTouched();
    this.enrollmentCloses.markAsTouched();
  }

  /**
   * @description Closes the modal window
   * @param {boolean} bool
   */
  closeModal(bool: boolean) {
    this.activeModal.close(bool);
  }

  /**
   * @description Handler for onSubmit event
   * @param input
   */
  submitForm(input) {
    if (this.place.value === 0) { this.place.setErrors({ 'required' : true }); }
    if (this.group.value === 0) { this.group.setErrors({ 'required' : true }); }

    if (!this.form.valid) {
      this.touchAllFields();
    } else {
      input['enrollment'] = {};
      input['enrollment']['enrollmentOpens'] = input.enrollmentOpens;
      input['enrollment']['enrollmentCloses'] = input.enrollmentCloses;
      input['enrollment']['maxCapacity'] = input.maxCap;
      this.matchesService.create(input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/matches/manager']).then(() => {
            this.toasterService.popAsync('success', translate('MATCH_CREATED_TITLE'), translate('MATCH_CREATED_MSG'));
            this.doCheck = false;
            this.closeModal(true);
          });
        } else if (response.response.name === 'MATCH_DATE_DUPLICATE_BUT_ADVISABLE') {
          const match = response.output[0];
          const modal = this.modalService.open(ModalComponent, {
            container: 'nb-layout',
            size: 'lg',
          });
          this.isHidden = true;

          modal.componentInstance.modalHeader = translate('MATCH_DT_COLLISION_TITLE');
          modal.componentInstance.modalContent = translate('MATCH_DT_COLLISION_MSG');
          modal.componentInstance.modalButtons = [
            {
              text: translate('MATCH_DT_COLLISION_DISCARD'),
              classes: 'btn btn-secondary',
              action: () => {
                this.router.navigate(['/pages/admin/matches/edit/' + match._id]).then(() => {
                  this.toasterService.popAsync('info', translate('MATCH_DT_COLLISION_DISCARDED_TITLE'), translate('MATCH_DT_COLLISION_DISCARDED_MSG', { matchTitle: this.title.value }));
                  this.isHidden = false;
                  modal.close();
                  this.activeModal.close();
                });
              },
            },
            {
              text: translate('MATCH_DT_COLLISION_FORCE'),
              classes: 'btn btn-warning',
              action: () => {
                this.matchesService.create(input, true).subscribe(res => {
                  if (res.response.success) {
                    this.toasterService.popAsync('success', translate('MATCH_CREATED_TITLE'), translate('MATCH_CREATED_MSG'));
                    this.isHidden = false;
                    modal.close();
                    this.activeModal.close(true);
                  } else {
                    this.errorHelper.processedButFailed(res);
                  }
                }, error => {
                  this.errorHelper.handleGenericError(error);
                });
              },
            },
            {
              text: translate('MATCH_DT_COLLISION_CONTINUE'),
              classes: 'btn btn-primary',
              action: () => {
                this.date.setErrors({ 'duplicate' : true });
                this.isHidden = false;
                modal.close();
              },
            },
          ];
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
