import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TeamsService } from '../teams.service';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { translate, HumanizerHelper, ErrorHelper } from '../../../../@shared/helpers';
import { ITeam } from '../../../../@shared/interfaces';

@Component({
  selector: 'ns-team-detail',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {

  @Input() team: ITeam;
  public isHidden = false;

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private teamsService: TeamsService,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper) { }

  ngOnInit() {
    this.team = this.humanizer.timestampDates(this.team);
  }

  /**
   * @description Routes to the team edit page
   */
  editTeam() {
    this.router.navigate(['/pages/admin/teams/edit/' + this.team._id]).then(() => {
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
   * @description Deletes a Team
   */
  deleteTeam() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    this.isHidden = true;
    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.team.name}'?`;
    modal.componentInstance.modalContent = `<p>${translate('DELETE_TEAM_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('CANCEL'),
        classes: 'btn btn-danger',
        action: () => {
          this.teamsService.delete(this.team._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/teams']).then(() => {
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
