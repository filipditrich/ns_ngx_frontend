import { Component, OnInit } from '@angular/core';
import { RoleCheckService } from "../../@core/services/roleCheck.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatchesService} from "./matches.service";
import {ErrorHelper} from "../../@core/helpers/error.helper";

@Component({
  selector: 'ngx-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public matchArray = [];

  constructor(
    private roleCheck: RoleCheckService,
    private matchesService: MatchesService,
    private errorHelper: ErrorHelper
  ) {

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      info: new FormControl(null, [Validators.required])
    });

    this.matchesService.getAllMatchesRequest().subscribe(matches => {
      this.matchArray = matches;
      this.matchArray = this.matchArray;
    }, err => {
      this.errorHelper.handleGenericError(err);
    });

  }

  get title() { return this.form.get('title'); }
  get date() { return this.form.get('date'); }
  get place() { return this.form.get('place'); }
  get info() { return this.form.get('info'); }


  ngOnInit() {
    this.roleCheck.isAdmin();
    console.log(this.matchArray);

  }

  addMatch(value) {
    if (!this.form.valid) {
      this.title.markAsTouched();
      this.date.markAsTouched();
      this.place.markAsTouched();
      this.info.markAsTouched();
    } else {
      if (!this.submitted) {
        this.callAddMatchSvc(value);
        this.submitted = true;
      }
    }
  }

  callAddMatchSvc(input) {
    this.matchesService.addMatchRequest(input).subscribe(response => {
      console.log(response);
    }, err => {
      this.errorHelper.handleGenericError(err);
    })
  }

  matchParticipation(willParticipate, matchId) {
    console.log(matchId);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const requestBody = {
      participation: willParticipate,
      matchID: matchId,
      userID: user._id
    };
    this.matchesService.participationInMatchRequest(requestBody).subscribe( response => {
      console.log(response);
    }, err => {
      this.errorHelper.handleGenericError(err);
    } )
  }

  isUserEnrolled(enrolledPlayers) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if(enrolledPlayers.indexOf(user._id) >= 0) {
      return true;
    } else {
      return false;
    }
  }

}
