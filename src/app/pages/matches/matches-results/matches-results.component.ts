import { CommonModule } from "@angular/common";
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

  public form: FormGroup;
  public submitted: boolean = false;
  public matchArray = [];

  constructor(
    private matchesService: MatchesService,
    private errorHelper: ErrorHelper,
  ) {

    this.form = new FormGroup({
      result: new FormControl(null, [Validators.required]),
      jersey: new FormControl(null, [Validators.required]),

    });

    this.matchesService.getAllMatchesRequest().subscribe(matches => {
      this.matchArray = matches["response"];
    }, err => {
      this.errorHelper.handleGenericError(err);
    });

  }

  get jersey() { return this.form.get('jersey'); }
  get result() { return this.form.get('result'); }


  ngOnInit() {
  }

  onSubmit(value, matchID) {
    if (!this.form.valid) {
      this.jersey.markAsTouched();
      this.result.markAsTouched();
    } else {
      if (!this.submitted) {
        const matchInfo = {
            players: {
              jersey: value["jersey"],
              status: value["result"]
            }
        }
        const requestBody = {
          value: value,
          matchID: matchID,
          match: matchInfo
        }
        this.callWriteMatchResultsSvc(requestBody);
        this.submitted = true;
      }
    }
  }

  callWriteMatchResultsSvc(requestBody) {
    this.matchesService.writeMatchResultsRequest(requestBody).subscribe(response => {
      console.log(response);
    }, err => {
      this.errorHelper.handleGenericError(err);
    })
  }

}
