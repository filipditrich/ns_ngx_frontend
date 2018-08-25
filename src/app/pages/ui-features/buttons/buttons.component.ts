import { Component } from '@angular/core';
import { ToasterService } from "angular2-toaster";

@Component({
  selector: 'ngx-buttons',
  styleUrls: ['./buttons.component.scss'],
  templateUrl: './buttons.component.html',
})
export class ButtonsComponent {
  constructor (notification: ToasterService) {
    notification.pop('deafult', 'Test', 'Test');
  }
}
