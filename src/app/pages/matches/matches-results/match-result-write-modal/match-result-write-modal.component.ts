import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { JerseysService } from '../../../admin/jerseys';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchesService } from '../../../admin/matches';
import { ToasterService } from 'angular2-toaster';
import { ErrorHelper } from '../../../../@core/helpers/error.helper';
import {IMatch, MatchResult} from '../../../../@core/models/match.interface';
import { IJersey } from '../../../../@core/models/jersey.interface';

@Component({
  selector: 'ns-match-result-write-modal',
  templateUrl: './match-result-write-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchResultWriteModalComponent implements OnInit {

  @Input() match: IMatch;
  public form: FormGroup;
  public jerseys: IJersey[];
  public set = [];
  public jerseySet = [];
  public statusSet = [];
  public resultOptions = [
    { value: 'win', label: 'Win' },
    { value: 'loose', label: 'Loose' },
    { value: 'draft', label: 'Draft' },
  ];

  @ViewChild('resultID') ngSelectResult: NgSelectComponent;
  @ViewChild('jerseyID') ngSelectJersey: NgSelectComponent;

  constructor(private activeModal: NgbActiveModal,
              private jerseysService: JerseysService,
              private errorHelper: ErrorHelper,
              private matchesService: MatchesService,
              private toasterService: ToasterService) {

    // form
    this.form = new FormGroup({
      result: new FormControl(null, [ Validators.required ]),
      jersey: new FormControl(null, [ Validators.required ]),
    });
  }

  // set getters
  get result() { return this.form.get('result'); }
  get jersey() { return this.form.get('jersey'); }

  ngOnInit() {
    // get jerseys
    this.jerseysService.get().subscribe(response => {
      if (response.response.success) {
        const set = [];
        if (this.match.results) this.match.results.players.forEach(player => set.push({ jersey: player.jersey._id, status: player.status }));
        this.set = Array.from(new Set(set));
        this.statusSet = Array.from(new Set(this.set.map(x => x.status)));
        this.jerseySet = Array.from(new Set(this.set.map(x => x.jersey)));
        this.jerseys = this.jerseySet.length > 1 ? response.output.filter(x => this.set.map(y => y.jersey).indexOf(x._id) >= 0) : response.output;
        this.resultOptions = ((this.statusSet.length > 1) || (this.statusSet.length === 1 && this.statusSet[0] === MatchResult.Draft)) ?
          this.resultOptions.filter(x => this.set.map(y => y.status).indexOf(x.value) >= 0) : this.resultOptions;
        this.ngSelectJersey.itemsList.setItems(this.jerseys);
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });
  }

  /**
   * @description Changes value and items of the jersey select depending on the result set
   */
  onChangeResult() {
    if (this.result.value) {
      const setStateMatch = this.set.find(x => x.status === this.result.value);
      if (this.statusSet.length > 1 && !!setStateMatch) {
        const newItems = this.jerseys.filter(x => x._id === setStateMatch.jersey);
        this.ngSelectJersey.itemsList.setItems(newItems);
        this.ngSelectJersey.select(this.ngSelectJersey.itemsList.findItem(newItems[0]._id));
        this.ngSelectJersey.focus();
        this.ngSelectResult.focus();
      } else {
        this.ngSelectJersey.itemsList.setItems(this.jerseys);
      }
    }
  }

  /**
   * @description Changes value and items of the result select depending on the result set
   */
  onChangeJersey() {
    if (this.jersey.value) {
      const setJerseyMatch = this.set.find(x => x.jersey === this.jersey.value);
      if (this.jerseySet.length > 1 && !!setJerseyMatch) {
        const newItems = this.resultOptions.filter(x => x.value === setJerseyMatch.status);
        this.ngSelectResult.itemsList.setItems(newItems);
        this.ngSelectResult.select(this.ngSelectResult.itemsList.findItem(newItems[0].value));
        this.ngSelectResult.focus();
        this.ngSelectJersey.focus();
      } else {
        this.ngSelectResult.itemsList.setItems(this.resultOptions);
      }
    }
  }

  /**
   * @description Closes the modal
   * @param {boolean} bool
   */
  closeModal(bool: boolean) {
    this.activeModal.close(bool);
  }

  /**
   * @description Marks all fields
   */
  touchAllFields() {
    this.result.markAsTouched();
    this.jersey.markAsTouched();
  }

  /**
   * @description Handler for onSubmit event
   * @param data
   */
  onSubmit(data) {
    if (!this.form.valid) {
      this.touchAllFields();
    } else {
      const input = {
        match: this.match._id,
        jersey: data.jersey,
        status: data.result,
      };
      this.matchesService.writeResults(input).subscribe(response => {
        if (response.response.success) {
          this.toasterService.popAsync('success', 'Results written!', 'Your results were written successfully.');
          this.closeModal(true);
        } else {
          this.errorHelper.processedButFailed(response);
        }
      }, error => {
        this.errorHelper.handleGenericError(error);
      });
    }
  }

}
