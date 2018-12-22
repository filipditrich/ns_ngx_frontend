import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GroupsService } from '../groups.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { translate, ErrorHelper } from '../../../../@shared/helpers';

@Component({
  selector: 'ns-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {

  // public variables
  public form: FormGroup;

  constructor(private groupsService: GroupsService,
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

      this.groupsService.create(input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/groups/manager']).then(() => {
            this.toasterService.popAsync('success', translate('GROUP_CREATED_TITLE'), translate('GROUP_CREATED_MSG'));
            this.closeModal(true);
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
