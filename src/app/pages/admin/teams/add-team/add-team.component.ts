import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TeamsService } from '../teams.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { translate, ErrorHelper } from '../../../../@shared/helpers';

@Component({
  selector: 'ns-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss'],
})
export class AddTeamComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public isLoading = false;

  constructor(private teamsService: TeamsService,
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
    });

  }

  // Form Getters
  get name() { return this.form.get('name'); }

  ngOnInit() {
  }

  /**
   * @description Marks all fields as touched
   */
  touchAllFields() {
    this.name.markAsTouched();
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
      this.teamsService.create(input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/teams/manager']).then(() => {
            this.toasterService.popAsync('success', translate('TEAM_CREATED_TITLE'), translate('TEAM_CREATED_MSG'));
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
