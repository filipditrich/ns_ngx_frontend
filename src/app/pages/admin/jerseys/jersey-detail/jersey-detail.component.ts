import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HumanizerHelper } from '../../../../@core/helpers/humanizer.helper';
import { JerseysService } from '../jerseys.service';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import { IJersey } from '../../../../@core/models/jersey.interface';

@Component({
  selector: 'ns-jersey-detail',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './jersey-detail.component.html',
  styleUrls: ['./jersey-detail.component.scss'],
})
export class JerseyDetailComponent implements OnInit {

  @Input() jersey: IJersey;
  public isHidden = false;

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private jerseysService: JerseysService,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper) { }

  ngOnInit() {
    this.jersey = this.humanizer.timestampDates(this.jersey);
  }

  /**
   * @description Routes to the jersey edit page
   */
  editJersey() {
    this.router.navigate(['/pages/admin/jerseys/edit/' + this.jersey._id]).then(() => {
      this.activeModal.close(false);
    });
  }

  /**
   * @description Closes the modal
   */
  closeModal() {
    this.activeModal.close(false);
  }

  /**
   * @description Deletes a Jersey
   */
  deleteJersey() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
    });

    this.isHidden = true;
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
                this.isHidden = false;
                this.activeModal.close(true);
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
        action: () => { modal.close(); this.isHidden = false; },
      },
    ];
  }

}
