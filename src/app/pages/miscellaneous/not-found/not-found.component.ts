import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  constructor(private router: Router) {
  }

  goToHome() {
    this.router.navigate(['/pages']);
  }
}
