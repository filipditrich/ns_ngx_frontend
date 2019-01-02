import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchesService } from '../../admin/matches';
import { ToasterService } from 'angular2-toaster';
import { ErrorHelper, HumanizerHelper, translate } from '../../../@shared/helpers';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { IMatch, EnrollmentStatus } from '../../../@shared/interfaces';
import * as codeConfig from '../../../@shared/config/codes.config';
import * as JSPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'ns-print-match',
  templateUrl: './print-match.component.html',
  styleUrls: ['./print-match.component.scss'],
})
export class PrintMatchComponent implements OnInit {

  public match: IMatch;
  public isLoading = true;

  @ViewChild('content') content: ElementRef;

  constructor(private matchService: MatchesService,
              private errorHelper: ErrorHelper,
              private humanizer: HumanizerHelper,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toasterService: ToasterService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.matchService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
      if (response.response.success) {
        this.match = this.humanizer.datesInMatch(response.output[0]);
        this.match.enrollment.players = this.match.enrollment.players
          .filter(x => x.status === EnrollmentStatus.Going);
        this.isLoading = false;
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('MATCH_NOT_FOUND', 'core').name: {
          this.router.navigate(['/pages/matches/']).then(() => {
            this.toasterService.popAsync('error', translate('MATCH_NOT_FOUND_TITLE'), translate('MATCH_NOT_FOUND_MSG'));
          });
          break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }
    });
  }

  /**
   * @description Returns enrolled players of capacity in form 'x/y'
   * @return {string}
   */
  playersEnrolled() {
    const going = !!this.match ? this.match.enrollment.players.filter(x => x.status === EnrollmentStatus.Going) : [];
    return !!this.match ? `${going.length}/${this.match.enrollment.maxCapacity}` : 'loading';
  }

  /**
   * @description Generate a PDF file
   */
  printDetails(save = true) {
    this.isLoading = true;
    html2canvas(this.content.nativeElement).then(canvas => {
      const pdf = new JSPDF();
      const imgData  = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      if (save) {
        pdf.save(`${this.match.title}.pdf`);
        this.isLoading = false;
      } else {
        const modal = this.modalService.open(ModalComponent, {
          container: 'nb-layout',
          keyboard: false,
          backdrop: 'static',
        });
        modal.componentInstance.modalHeader = translate('WARNING');
        modal.componentInstance.modalContent = translate('ADBLOCK_NOTICE_MSG');
        modal.componentInstance.modalButtons = [
          {
            text: translate('ADBLOCK_NOTICE_DISABLED'),
            classes: 'btn btn-primary',
            action: () => {
              modal.close();
              this.isLoading = false;
              pdf.autoPrint();
              window.open(pdf.output('bloburl'), '_blank');
            },
          },
          {
            text: translate('CANCEL'),
            classes: 'btn btn-secondary',
            action: () => { modal.close(); this.isLoading = false; },
          },
        ];
      }
    }).catch(error => {
      this.errorHelper.handleGenericError(error);
    });
  }

}
