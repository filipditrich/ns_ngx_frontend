import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatchesService } from '../../admin/matches/matches.service';
import { HumanizerHelper } from '../../../@core/helpers/humanizer.helper';
import { EnrolledPlayersComponent } from '../enrolled-players/enrolled-players.component';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { UserService } from '../../user/user.service';

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

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private matchesService: MatchesService,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper,
              private userService: UserService) { }

  ngOnInit() {
    this.match = this.humanizer.datesInMatch(this.match);
    this.admin = ['admin'].some(role => this.userService.getCurrentUser('roles').indexOf(role) >= 0);
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
    });

    this.isHidden = true;
    modal.componentInstance.modalHeader = `Delete '${this.match.name}'?`;
    modal.componentInstance.modalContent = '<p>Do you really want to delete this match?</p>';
    modal.componentInstance.modalButtons = [
      {
        text: 'Delete',
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
        text: 'Cancel',
        classes: 'btn btn-secondary',
        action: () => { modal.close(); this.isHidden = false; },
      },
    ];
  }

}
