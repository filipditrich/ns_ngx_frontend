import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HumanizerHelper } from '../../../@core/helpers/humanizer.helper';
import { MatchesService } from '../../admin/matches';
import { ToasterService } from 'angular2-toaster';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { IMatch, EnrollmentStatus } from '../../../@core/models/match.interface';
import * as codeConfig from '../../../@core/config/codes.config';
import * as JSPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'ns-print-match',
  templateUrl: './print-match.component.html',
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
            this.toasterService.popAsync('error', 'Match not found.', 'Match with the specified ID is invalid or does not exist.');
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
  printDetails() {
    html2canvas(this.content.nativeElement).then(canvas => {
      const pdf = new JSPDF();
      const imgData  = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'a4', 0, 0);
      pdf.save('print.pdf');
    }).catch(error => {
      this.errorHelper.handleGenericError(error);
    });
  }

}
