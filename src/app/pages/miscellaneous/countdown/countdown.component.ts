import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HumanizerHelper, sysInfo } from '../../../@shared/helpers';
import * as moment from 'moment';

@Component({
  selector: 'ns-countdown',
  templateUrl: './countdown.component.html',
})
export class CountdownComponent {

  public launchDate;
  constructor(private router: Router,
              private humanizer: HumanizerHelper) {
    this.launchDate = this.humanizer.date(sysInfo('launchDate'));
    if (moment(new Date()).isSameOrAfter(new Date(this.launchDate))) {
      this.goToHome();
    }
  }

  goToHome() {
    this.router.navigate(['/pages']);
  }
}
