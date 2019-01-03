import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatchesService } from '../../admin/matches/matches.service';
import { HumanizerHelper } from '../../../@shared/helpers/humanizer.helper';
import { EnrolledPlayersComponent } from '../enrolled-players/enrolled-players.component';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { ErrorHelper } from '../../../@shared/helpers/error.helper';
import { UserService } from '../../user/user.service';
import { translate } from '../../../@shared/helpers/translator.helper';

@Component({
  selector: 'ns-match-detail',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchDetailComponent implements OnInit {

  @Input() match;
  @Input() component;
  public isHidden = false;
  public reload = false;
  public admin = false;
  public maxCapacity = translate('LOADING');

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private matchesService: MatchesService,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper,
              private userService: UserService) { }

  ngOnInit() {
    this.admin = ['admin'].some(role => this.userService.getCurrentUser('roles').indexOf(role) >= 0);
    this.maxCapacity = `${this.match.enrollment.players.filter(player => player.status === 'going').length}/${this.match.enrollment.maxCapacity}`;
  }

  /**
   * @description Opens another modal with enrolled players
   */
  openMore() {
    const modal = this.modalService.open(EnrolledPlayersComponent, {
      container: 'nb-layout',
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });

    this.isHidden = true;
    modal.componentInstance.match = this.match;
    modal.componentInstance.players = this.match.enrollment.players;
    modal.result.then(bool => {
      this.reload = bool;
      this.isHidden = false;
    }).catch(error => { this.isHidden = false; });
  }

  /**
   * @description Routes to the match edit page
   */
  editMatch() {
    this.router.navigate(['/pages/admin/matches/edit/' + this.match._id]).then(() => {
      this.activeModal.close(false);
    });
  }

  /**
   * @description Closes the modal
   */
  closeModal() {
    this.activeModal.close(this.reload);
  }

  /**
   * @description Deletes a Match
   */
  deleteMatch() {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    this.isHidden = true;
    modal.componentInstance.modalHeader = `${translate('DELETE')} '${this.match.name}'?`;
    modal.componentInstance.modalContent = '<p>Do you really want to delete this match?</p>';
    modal.componentInstance.modalButtons = [
      {
        text: translate('DELETE'),
        classes: 'btn btn-danger',
        action: () => {
          this.matchesService.delete(this.match._id).subscribe(response => {
            if (response.response.success) {
              this.router.navigate(['/pages/admin/matches']).then(() => {
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
