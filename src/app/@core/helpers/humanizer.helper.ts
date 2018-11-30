import * as moment from 'moment';
import { PlacesService } from '../../pages/admin/places/places.service';
import { ErrorHelper } from './error.helper';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HumanizerHelper {

  constructor(private placesService: PlacesService,
              private errorHelper: ErrorHelper) { }

  /**
   * @description Formats single date
   * @param date
   * @return {string}
   */
  date(date) {
    return moment(new Date(date)).locale('en').format('lll');
  }

  /**
   * @description Formats all dates in matches array
   * @param matchArray
   * @return {any}
   */
  datesInArray(matchArray) {
    const formatted = [];
    matchArray.forEach(match => {
      formatted.push(this.datesInMatch(match));
    });
    return matchArray;
  }

  /**
   * @description Formats all dates in match object
   * @param match
   * @return {any}
   */
  datesInMatch(match) {
    match.date = this.date(match.date);
    match.enrollment.enrollmentOpens = this.date(match.enrollment.enrollmentOpens);
    match.enrollment.enrollmentCloses = this.date(match.enrollment.enrollmentCloses);
    const players = [];
    match.enrollment.players.forEach(player => {
      player.enrolledOn = this.date(player.enrolledOn);
      players.push(player);
    });
    match.enrollment.players = players;
    match = this.timestampDates(match);
    return match;
  }

  /**
   * @description Formats all timestamp dates in general object
   * @param input
   */
  timestampDates(input) {
    input.createdAt = this.date(input.createdAt);
    input.updatedAt = this.date(input.updatedAt);
    return input;
  }

  /**
   * @description Replaces single place ObjectID with actual name
   * @param place
   */
  place(place) {
    this.placesService.get().subscribe(response => {
      if (response.response.success) {
        return response.output.filter(x => x._id === place).name;
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });
  }

  /**
   * @description Replaces place ObjectIDs with actual name
   * @param matchArray
   * @return {Promise<any>}
   */
  places(matchArray) {
    return new Promise((resolve, reject) => {
      this.placesService.get().subscribe(response => {
        if (response.response.success) {

          const places = response.output;
          const formatted = [];
          matchArray.forEach(match => {
            match.place = places.filter(x => x._id === match.place);
            formatted.push(match);
          });
          resolve(formatted);

        } else {
          reject(response);
        }
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * @description Formats whole match array
   * @param matchArray
   */
  formatMatchArray(matchArray) {
    return new Promise((resolve, reject) => {
      this.places(matchArray).then(output1 => {
        resolve(this.datesInArray(output1));
      }).catch(error => {
        reject(error);
      });
    });
  }

}
