import { Component, OnInit } from '@angular/core';
import { MatchesService } from "../matches.service";
import {ErrorHelper} from "../../../@core/helpers/error.helper";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {JerseysService} from "../../../@core/services/jerseys.service";

@Component({
  selector: 'ngx-matches-results',
  templateUrl: './matches-results.component.html',
  styleUrls: ['./matches-results.component.scss']
})
export class MatchesResultsComponent implements OnInit {

  public matchesArray = [];
  public jerseysArray = [];
  public form: FormGroup;
  public submitted: boolean = false;

  constructor(
    private matchesService: MatchesService,
    private errorHelper: ErrorHelper,
    private jerseysService: JerseysService
  ) {
    this.form = new FormGroup({
      result: new FormControl(null, [Validators.required]),
      jersey: new FormControl(null, [Validators.required])
    });
  }

  get result() { return this.form.get('result'); }
  get jersey() { return this.form.get('jersey'); }

  ngOnInit() {
    this.matchesService.getAllMatchesRequest().subscribe(matches => {
      this.matchesArray = matches["response"];
      this.jerseysService.getAllJersey().subscribe(jerseys => {
        this.jerseysArray = jerseys["response"]
      }, err => {
        this.errorHelper.handleGenericError(err);
      })
    }, err => {
      this.errorHelper.handleGenericError(err);
    })

  }

  onSubmit(input) {
    if (!this.form.valid) {
      this.result.markAsTouched();
      this.jersey.markAsTouched();
    } else {
      if (!this.submitted) {
        this.callWriteMatchResultsSvc(input);
        this.submitted = true;
      }
    }
  }

  callWriteMatchResultsSvc(input) {
    this.matchesService.writeMatchResultsRequest(input).subscribe(response => {
      console.log(response);
    }, err => {
      this.errorHelper.handleGenericError(err);
    })
  }




}
