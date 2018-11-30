import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ns-invite-modal-error',
  template: `
    <div class="modal-header">
      <span>Sending invitations failed</span>
      <button class="close" aria-label="Close" (click)="closeModal(false)">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="text-muted">We were not able to send invitation to following recipients: </p>
      <hr>
      <ul class="list-group p-0">
        <li *ngFor="let mail of unsent" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="text-danger">
            <span>{{mail.email}}</span><br>
            <span *ngIf="mail.reason === 'REGISTRATION_ALREADY_APPROVED'" class="fs-smaller">A registration request for this user has already been approved</span>
            <span *ngIf="mail.reason === 'USER_ALREADY_REGISTERED'" class="fs-smaller">This user is already registered</span>
            <span *ngIf="mail.reason !== 'REGISTRATION_ALREADY_APPROVED' && mail.reason !== 'USER_ALREADY_REGISTERED'" class="fs-smaller">Unknown error</span>
          </div>
          <button class="reset close-button text-danger" (click)="removeRecipient(mail)">
            <span class="icon ion-ios-trash fs-large"></span>
          </button>
        </li>
        <li *ngFor="let mail of sent" class="list-group-item">
          <div class="text-info">
            <span>{{mail}}</span><br>
            <span class="fs-smaller">Invitation successfully sent to this recipient</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="modal-footer flex-wrap">
      <button class="btn btn-md btn-secondary my-1" (click)="closeModal(false)">Cancel</button>
      <button class="btn btn-md btn-primary my-1" (click)="closeModal(true)">Try again</button>
    </div>
  `,
})
export class InviteModalErrorComponent implements OnInit {

  @Input() unsent: any[];
  @Input() sent: string[];

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {}

  /**
   * @description Removes recipient form the list
   * @param mail
   */
  removeRecipient(mail) {
    this.unsent = this.unsent.filter(x => x.email !== mail.email);
  }

  /**
   * @description Closes the modal
   * @param {boolean} tryAgain
   */
  closeModal(tryAgain: boolean) {
    this.activeModal.close(tryAgain ? this.unsent : false);
  }

}
