import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table-extended';
import { HumanizerHelper } from '../../../@shared/helpers/humanizer.helper';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class EOpenRendererComponent implements ViewCell, OnInit {

  constructor(private humanizer: HumanizerHelper) { }

  renderValue;

  @Input() value;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.humanizer.date(this.rowData.enrollment.enrollmentOpens);
  }

}
