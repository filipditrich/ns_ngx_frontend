import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table-extended';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  template: `
    <form class="form row position-relative" [formGroup]="form">

      <!-- Loader -->
      <div class="card-loading" *ngIf="isLoading">
        <div class="lds-dual-ring"></div>
      </div>

      <!-- Status Picker -->
      <div class="form-group group d-flex flex-column col-sm-12"
           [ngClass]="{ 'error' : status.invalid && (status.dirty || status.touched) }">

        <ng-select
          #statusID
          [items]="list"
          [multiple]="false"
          [clearable]="false"
          [closeOnSelect]="true"
          [placeholder]="cell.getValue()"
          id="status" class="ng-select-input-custom flex-grow-1"
          (change)="updateValue()">
        </ng-select>
        <small class="text-danger" *ngIf="status.invalid && (status.dirty || status.touched)">This status is invalid</small>

      </div>

    </form>
  `,
})
export class EPlayersStatusEditorComponent extends DefaultEditor implements AfterViewInit, OnInit {

  public list = [
    { value: 'skipping', label: 'skipping' },
    { value: 'unsure', label: 'unsure' },
    { value: 'going', label: 'going' },
  ];
  public form: FormGroup;
  public isLoading = true;

  @ViewChild('statusID') ngSelect: NgSelectComponent;

  constructor() {
    super();
    this.form = new FormGroup({
      status: new FormControl(null, [ Validators.required ]),
    });
  }

  get status() { return this.form.get('status'); }

  updateValue() {
    this.cell.newValue = this.ngSelect.selectedValues[0]['value'];
  }

  ngOnInit() {
    // yet another hack, lol
    setTimeout(() => {
      this.ngSelect.select(this.ngSelect.itemsList.findByLabel(this.cell.getValue()));
      this.ngSelect.focus();
      this.isLoading = false;
    }, 500);
  }

  ngAfterViewInit() {
  }

}
