import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table-extended';
import { HumanizerHelper } from '../../helpers/humanizer.helper';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class ECloseRendererComponent implements ViewCell, OnInit {

  constructor(private humanizer: HumanizerHelper) { }

  renderValue;

  @Input() value;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = !!this.rowData.enrollment.enrollmentCloses ? this.humanizer.date(this.rowData.enrollment.enrollmentCloses) : 'not specified';
  }

}
