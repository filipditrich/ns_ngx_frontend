import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ns-auth',
  template: `
    <nb-auth>
      <router-outlet></router-outlet>
    </nb-auth>
  `,
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
