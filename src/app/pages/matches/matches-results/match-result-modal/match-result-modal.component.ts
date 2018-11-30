import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMatch } from '../../../../@core/models/match.interface';

@Component({
  selector: 'ns-match-result-modal',
  templateUrl: './match-result-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchResultModalComponent implements OnInit {

  @Input() match: IMatch;

  constructor(private activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }

  /**
   * @description Closes the modal
   */
  closeModal() {
    this.activeModal.close();
  }

}
