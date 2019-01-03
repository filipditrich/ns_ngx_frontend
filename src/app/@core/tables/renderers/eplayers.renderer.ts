import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table-extended';

@Component({
  template: `
    <div class="profile-picture-row d-flex">
      <ng-container *ngFor="let player of renderValue; let i = index">
        <div *ngIf="i < 5"
             class="profile-picture round small" title="{{player.info.name}}"
             [attr.ns-jersey-number]="'#' + player.info.number"
             [ngClass]="{ 'border-success' : player.status === 'going', 'border-danger': player.status === 'skipping' }">
        </div>
      </ng-container>
      <div *ngIf="renderValue.length > 5" class="open-more ml-2">+{{renderValue.length - 5}} more</div>
      <div *ngIf="renderValue.length === 0">{{ 'NO_PLAYERS' | translate }}</div>
    </div>
  `,
})
export class EPlayersRendererComponent implements ViewCell, OnInit {

  renderValue;
  @Input() value;
  @Input() rowData: any;

  constructor() { }

  async ngOnInit() {
    this.renderValue = this.rowData['enrollment']['players'].sort((a, b) => (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0));
  }

}
