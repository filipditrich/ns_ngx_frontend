import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatchesService } from '../matches.service';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../../places';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { dateLessThan } from '../../../../@core/helpers/validators.helper';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import * as codeConfig from '../../../../@core/config/codes.config';

@Component({
  selector: 'ns-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMatchComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public placesArray = [];
  public now = new Date();
  public match: any;
  public doCheck = true;

  constructor(private matchesService: MatchesService,
              private errorHelper: ErrorHelper,
              private placesService: PlacesService,
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
    this.getPlaces();
    setTimeout(() => {
      if (this.doCheck) {
        this.now = new Date();
        this.changeDetRef.detectChanges();
      }
    }, 60 * 1000);
  }

  /**
   * @description Loads Places from server
   */
  getPlaces() {
    this.placesService.get().subscribe(response => {
      if (response.response.success) {
        this.placesArray = response.output;
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      this.errorHelper.handleGenericError(err);
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
            this.toasterService.popAsync('success', 'Match Created!', 'Match successfully created.');
            this.doCheck = false;
            this.closeModal(true);
          });
        } else if (response.response.name === 'MATCH_DATE_DUPLICATE_BUT_ADVISABLE') {

          response.output.forEach(match => {

            const modal = this.modalService.open(ModalComponent, {
              container: 'nb-layout',
              size: 'lg',
            });

            modal.componentInstance.modalHeader = 'Match date-time collision';
            modal.componentInstance.modalContent = `There is already a match ('<strong>${match.title}</strong>') on this date within 1 hour from this date. What do you want to do now?`;
            modal.componentInstance.modalButtons = [
              {
                text: 'Discard and edit collision match',
                classes: 'btn btn-secondary',
                action: () => {
                  modal.close();
                  this.router.navigate(['/pages/admin/matches/edit/' + match._id]).then(() => {
                    this.toasterService.popAsync('info', 'Match Discarded!', 'Match has been discarded. You can now edit this one');
                  });
                },
              },
              {
                text: 'Force create',
                classes: 'btn btn-warning',
                action: () => {
                  this.matchesService.create(input, true).subscribe(res => {
                    if (res.response.success) {
                      modal.close();
                      this.router.navigate(['/pages/admin/matches/manager']).then(() => {
                        this.toasterService.popAsync('success', 'Match Created!', 'Match successfully created.');
                      });
                    } else {
                      this.errorHelper.processedButFailed(res);
                    }
                  }, error => {
                    this.errorHelper.handleGenericError(error);
                  });
                },
              },
              {
                text: 'Continue editing',
                classes: 'btn btn-primary',
                action: () => {
                  this.date.setErrors({ 'duplicate' : true });
                  modal.close();
                },
              },
            ];
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
