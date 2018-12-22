import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ns-invite-modal-error',
  template: `
    <div class="modal-header">
      <span>{{ 'INVITATIONS_FAILED' | translate }}</span>
      <button class="close" aria-label="Close" (click)="closeModal(false)">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="text-muted">{{ 'UNABLE_TO_SEND_INV_TO' | translate }}:</p>
      <hr>
      <ul class="list-group p-0">
        <li *ngFor="let mail of unsent" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="text-danger">
            <span>{{mail.email}}</span><br>
            <span *ngIf="mail.reason === 'REGISTRATION_ALREADY_APPROVED'" class="fs-smaller">{{ 'INV_RECP_ALREADY_APPROVED' | translate }}</span>
            <span *ngIf="mail.reason === 'USER_ALREADY_REGISTERED'" class="fs-smaller">{{ 'INV_RECP_ALREADY_REGISTERED' | translate }}</span>
            <span *ngIf="mail.reason !== 'REGISTRATION_ALREADY_APPROVED' && mail.reason !== 'USER_ALREADY_REGISTERED'" class="fs-smaller">{{ 'UNKNOWN_ERROR' | translate }}</span>
          </div>
          <button class="reset close-button text-danger" (click)="removeRecipient(mail)">
            <span class="icon ion-ios-trash fs-large"></span>
          </button>
        </li>
        <li *ngFor="let mail of sent" class="list-group-item">
          <div class="text-info">
            <span>{{mail}}</span><br>
            <span class="fs-smaller">{{ 'INV_RECP_SUCCESS' | translate }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="modal-footer flex-wrap">
      <button class="btn btn-md btn-secondary my-1" (click)="closeModal(false)">{{ 'CANCEL' | translate }}</button>
      <button class="btn btn-md btn-primary my-1" (click)="closeModal(true)">{{ 'TRY_AGAIN' | translate }}</button>
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
