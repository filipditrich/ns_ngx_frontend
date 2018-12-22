import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GroupsService } from '../groups.service';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { IGroup } from '../../../../@shared/interfaces';
import { translate, HumanizerHelper, ErrorHelper } from '../../../../@shared/helpers';

@Component({
  selector: 'ns-group-detail',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {

  @Input() group: IGroup;
  public isHidden = false;

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private groupsService: GroupsService,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper) { }

  ngOnInit() {
    this.group = this.humanizer.timestampDates(this.group);
  }

  /**
   * @description Routes to the Group edit page
   */
  editTeam() {
    this.router.navigate(['/pages/admin/groups/edit/' + this.group._id]).then(() => {
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
   * @description Deletes a Group
   */
  deleteTeam() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
    });

    this.isHidden = true;
    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.group.name}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_GROUP_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
        classes: 'btn btn-danger',
        action: () => {
          this.groupsService.delete(this.group._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/groups']).then(() => {
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
