import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PlacesService } from '../places.service';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { IPlace } from '../../../../@shared/interfaces';
import { translate, ErrorHelper, HumanizerHelper } from '../../../../@shared/helpers';

@Component({
  selector: 'ns-place-detail',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
})
export class PlaceDetailComponent implements OnInit {

  @Input() place: IPlace;
  public isHidden = false;

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private placesService: PlacesService,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper) { }

  ngOnInit() {
    this.place = this.humanizer.timestampDates(this.place);
  }

  /**
   * @description Routes to the place edit page
   */
  editPlace() {
    this.router.navigate(['/pages/admin/places/edit/' + this.place._id]).then(() => {
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
   * @description Deletes a Place
   */
  deletePlace() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
    });

    this.isHidden = true;
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
        text: translate('CANCEL'),
        classes: 'btn btn-secondary',
        action: () => { modal.close(); this.isHidden = false; },
      },
    ];
  }

}
