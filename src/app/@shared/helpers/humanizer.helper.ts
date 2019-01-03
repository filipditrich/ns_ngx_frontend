import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { getLang } from './translator.helper';

@Injectable({
  providedIn: 'root',
})
export class HumanizerHelper {

  constructor() { }

  /**
   * @description Formats single date
   * @param date
   * @return {string}
   */
  date(date) {
    if (!moment(new Date(date)).isValid()) {
      date = moment(new Date(date), getLang()).locale('en');
    }
    return moment(new Date(date)).locale(getLang()).format('lll');
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
    match.reminder.reminderDate = this.date(match.reminder.reminderDate);
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

}
