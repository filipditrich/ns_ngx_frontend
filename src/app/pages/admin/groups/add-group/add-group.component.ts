import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GroupsService } from '../groups.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { translate, ErrorHelper } from '../../../../@shared/helpers';
import { PagesMenuService } from '../../../pages-menu.service';

@Component({
  selector: 'ns-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {

  // public variables
  public form: FormGroup;
  public isLoading = false;

  constructor(private groupsService: GroupsService,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private changeDetRef: ChangeDetectorRef,
              private activeModal: NgbActiveModal,
              private pagesMenuService: PagesMenuService) {

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
      this.groupsService.create(input).subscribe(response => {
        if (response.response.success) {
          this.router.navigate(['/pages/admin/groups/manager']).then(() => {
            this.toasterService.popAsync('success', translate('GROUP_CREATED_TITLE'), translate('GROUP_CREATED_MSG'));
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
