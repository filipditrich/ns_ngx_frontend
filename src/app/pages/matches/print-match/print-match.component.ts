import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HumanizerHelper } from '../../../@shared/helpers/humanizer.helper';
import { MatchesService } from '../../admin/matches';
import { ToasterService } from 'angular2-toaster';
import { ErrorHelper } from '../../../@shared/helpers/error.helper';
import { IMatch, EnrollmentStatus } from '../../../@shared/interfaces/match.interface';
import { translate } from '../../../@shared/helpers/translator.helper';
import * as codeConfig from '../../../@shared/config/codes.config';
import * as JSPDF from 'jspdf';
import * as removeAccents from 'remove-accents';

@Component({
  selector: 'ns-print-match',
  templateUrl: './print-match.component.html'
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
              private toasterService: ToasterService) { }

  ngOnInit() {
    this.matchService.get(this.activatedRoute.snapshot.params['id']).subscribe(response => {
      if (response.response.success) {
        let resMatch = response.output[0].enrollment.players
        resMatch.forEach((player) => {
          player.info.name = removeAccents(player.info.name)
        })
        this.match = this.humanizer.datesInMatch(response.output[0]);
        this.match.enrollment.players.filter(x => x.status === EnrollmentStatus.Going);
        this.isLoading = false;
        setTimeout(() => { this.printDetails(); }, 1000);
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
  /**
   * @description Generate a PDF file
   */
  printDetails() {
    const pdf = new JSPDF('p', 'pt');
    pdf.fromHTML(document.getElementById('content'), 10, 10);
    pdf.setFont('times', 'roman')
    pdf.save('print.pdf');
  }

}
