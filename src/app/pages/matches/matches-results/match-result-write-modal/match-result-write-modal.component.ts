import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMatch, MatchResult, IJersey } from '../../../../@shared/interfaces';
import {translate, ErrorHelper, findInvalidControls} from '../../../../@shared/helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { JerseysService } from '../../../admin/jerseys';
import { MatchesService } from '../../../admin/matches';

@Component({
  selector: 'ns-match-result-write-modal',
  templateUrl: './match-result-write-modal.component.html',
})
export class MatchResultWriteModalComponent implements OnInit {

  @Input() match: IMatch;
  public form: FormGroup;
  public isLoading = true;

  public set = [];
  public jerseySet = [];
  public statusSet = [];
  public _jerseys: IJersey[] = [];
  public jerseys: IJersey[];
  public _resultOptions = [];
  public resultOptions = [
    { value: MatchResult.Win, label: translate('WIN') },
    { value: MatchResult.Loose, label: translate('LOOSE') },
  ];

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
    this.result.setValue(0);
    this.jersey.setValue(0);
    this.jerseysService.get().subscribe(response => {
      if (response.response.success) {
        this.jerseys = response.output;
        const set = [];
        if (this.match.results) this.match.results.players.forEach(player => set.push({ jersey: player.jersey._id, status: player.status }));
        this.set = Array.from(new Set(set.map(x => JSON.stringify(x))));
        this.set = this.set.map(x => JSON.parse(x));
        this.statusSet = Array.from(new Set(this.set.map(x => x.status)));
        this.jerseySet = Array.from(new Set(this.set.map(x => x.jersey)));
        this._jerseys = this.jerseySet.length > 1 ? response.output.filter(j => this.jerseySet.indexOf(j._id) >= 0) : response.output;
        this._resultOptions = ((this.statusSet.length > 1) || (this.statusSet.length === 1 && this.statusSet[0] === MatchResult.Draft)) ?
          this.resultOptions.filter(x => this.statusSet.indexOf(x.value) >= 0) : this.resultOptions;
        this.isLoading = false;
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
    const setStateMatch = this.set.find(x => x.status === this.result.value);
    if (!!setStateMatch) {
      this._jerseys = this.jerseys.filter(j => j._id === setStateMatch.jersey);
      this.jersey.setValue(this._jerseys[0]._id);
    } else {
      if (this.set.length === 1 && this.resultOptions.length <= 2) {
        this._jerseys = this.jerseys.filter(x => x._id !== this.set[0].jersey);
        this.jersey.setValue(this._jerseys.length === 1 ? this._jerseys[0]._id : 0);
      } else {
        this.jersey.setValue(0);
        this._jerseys = [] = [ ...this.jerseys ];
      }
    }
  }

  /**
   * @description Changes value and items of the result select depending on the result set
   */
  onChangeJersey() {
    const setJerseyMatch = this.set.find(x => x.jersey === this.jersey.value);
    if (!!setJerseyMatch) {
      this._resultOptions = this.resultOptions.filter(r => r.value === setJerseyMatch.status);
      this.result.setValue(this._resultOptions[0].value);
    } else {
      if (this.set.length === 1 && this.resultOptions.length <= 2) {
        this._resultOptions = this.resultOptions.filter(x => x.value !== this.set[0].status);
        this.result.setValue(this._resultOptions[0].value);
      } else {
        this.result.setValue(0);
        this._resultOptions = [ ...this.resultOptions ];
      }
      this._resultOptions = [ ...this.resultOptions ];
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
   */
  onSubmit() {
    if (this.result.value === 0) { this.result.setErrors({ 'required' : true }); }
    if (this.jersey.value === 0) { this.jersey.setErrors({ 'required' : true }); }
    if (!this.form.valid) {
      this.touchAllFields();
    } else {
      const input = {
        match: this.match._id,
        jersey: this.jersey.value,
        status: this.result.value,
      };
      this.matchesService.writeResults(input).subscribe(response => {
        if (response.response.success) {
          this.toasterService.popAsync('success', translate('RESULTS_WRITTEN_TITLE'), translate('RESULTS_WRITTEN_MSG'));
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
