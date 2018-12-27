import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JerseysService } from '../jerseys.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { translate, ErrorHelper } from '../../../../@shared/helpers';

@Component({
  selector: 'ns-add-jersey',
  templateUrl: './add-jersey.component.html',
  styleUrls: ['./add-jersey.component.scss'],
})
export class AddJerseyComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public isLoading = false;

  constructor(private jerseysService: JerseysService,
              private errorHelper: ErrorHelper,
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
      name: new FormControl(null, [ Validators.required ]),
      // color: new FormControl(null, [ Validators.required ]),
    });

  }

  // Form Getters
  get name() { return this.form.get('name'); }
  // get color() { return this.form.get('color'); }

  ngOnInit() {
  }

  /**
   * @description Marks all fields as touched
   */
  touchAllFields() {
    this.name.markAsTouched();
    // this.color.markAsTouched();
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
      this.isLoading = true;
      this.jerseysService.create(input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/jerseys']).then(() => {
            this.toasterService.popAsync('success', translate('JERSEY_CREATED_TITLE'), translate('JERSEY_CREATED_MSG'));
            this.isLoading = false;
            this.closeModal(true);
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
