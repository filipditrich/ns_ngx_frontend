import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table-extended';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class PlaceRendererComponent implements ViewCell, OnInit {

  renderValue;

  @Input() value;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.rowData.place.name;
  }

}
