import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HumanizerHelper } from '../../../../@core/helpers/humanizer.helper';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ModalComponent } from '../../../ui-features/modals/modal/modal.component';
import { RegistrationRequestsService } from '../registration-requests.service';
import { ToasterService } from 'angular2-toaster';
import { InviteModalErrorComponent } from './invite-modal-error.component';
import { isEmail } from '../../../../@core/helpers/validators.helper';

@Component({
  selector: 'ns-invite-modal',
  host: {
    '[class.hidden]': 'isHidden',
  },
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent implements OnInit {

  public form: FormGroup;
  public invitationEmails = [];
  public isHidden = false;

  constructor(private activeModal: NgbActiveModal,
              private router: Router,
              private humanizer: HumanizerHelper,
              private modalService: NgbModal,
              private errorHelper: ErrorHelper,
              private regReqService: RegistrationRequestsService,
              private toasterService: ToasterService) {

    this.form = new FormGroup({
      email: new FormControl(null,  [ isEmail(), Validators.required ]),
    });

  }

  get email() { return this.form.get('email'); }

  ngOnInit() {
  }

  /**
   * @description Adds email to the recipient list
   * @param email
   */
  addEvite(email) {
    if (!this.form.valid) {
      this.email.markAsTouched();
    } else {
      if (this.invitationEmails.indexOf(email) >= 0) {
        this.email.setErrors({ 'duplicate' : true });
      } else {
        this.invitationEmails.push(email);
        this.email.setValue(null);
      }
    }
  }

  /**
   * @description Removes an email from the list
   * @param email
   */
  removeInvEmail(email) {
    this.invitationEmails = this.invitationEmails.filter(x => x !== email);
  }

  /**
   * @description Closes the modal
   */
  closeModal() {
    if (this.invitationEmails.length !== 0) {

      this.isHidden = true;
      const modal = this.modalService.open(ModalComponent, {
        container: 'nb-layout',
      });

      modal.componentInstance.modalHeader = 'Warning!';
      modal.componentInstance.modalContent = '<p>Do you really want to close the invitation modal? If you do so, all emails in the invitation list are going to be removed.</p>';
      modal.componentInstance.modalButtons = [
        {
          text: 'Close anyway',
          classes: 'btn btn-danger',
          action: () => { modal.close(); this.activeModal.close(false); this.isHidden = false; },
        },
        {
          text: 'Keep editing',
          classes: 'btn btn-primary',
          action: () => { modal.close(); this.isHidden = false; },
        },
      ];
    } else {
      this.activeModal.close(false);
    }
  }

  /**
   * @description Handler for onSubmit event
   */
  submitForm() {

    this.regReqService.sendInvites(this.invitationEmails).subscribe(response => {
      if (response.response.success) {
        if (response.output.unsent.length === 0 && response.output.sent.length === this.invitationEmails.length) {
          // all sent
          this.toasterService.popAsync('success', 'Invitations sent!', 'Invitation email has been sent to every single recipient from the email list');
          this.activeModal.close(true);
        } else {
          // some sent
          this.isHidden = true;
          const modal = this.modalService.open(InviteModalErrorComponent, {
            container: 'nb-layout',
            keyboard: false,
            backdrop: 'static',
          });
          modal.componentInstance.unsent = response.output.unsent;
          modal.componentInstance.sent = response.output.sent;
          modal.result.then(res => {
            modal.close();
            this.isHidden = false;
            if (res) {
              this.invitationEmails = res.map(x => x.email);
            } else {
              this.activeModal.close(true);
            }
          });
        }
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });


  }

}
