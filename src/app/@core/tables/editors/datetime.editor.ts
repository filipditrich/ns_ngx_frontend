import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table-extended';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  template: `
    <form class="form row poistion-relative" [formGroup]="form">

      <!-- Loader -->
      <div class="card-loading" *ngIf="isLoading">
        <div class="lds-dual-ring"></div>
      </div>

      <!-- Date Picker -->
      <div class="form-group group d-flex flex-column col-sm-12"
           [ngClass]="{ 'error' : date.invalid && (date.dirty || date.touched) }">
        <div class="input-with-buttons append">

          <input
            [owlDateTimeTrigger]="dateODT"
            [owlDateTime]="dateODT"
            id="date" name="date" formControlName="date" ng-reflect-name="date"
            class="input-full-width input-md ng-dirty ng-valid ng-touched">
          <owl-date-time
            autoClose
            dataType="string"
            pickerMode="dialog"
            #dateODT
            (afterPickerClosed)="updateValue()">
          </owl-date-time>

          <div class="buttons">
            <button type="button"><i class="icon ion-ios-calendar"></i></button>
          </div>

        </div>
      </div>

    </form>
  `,
})
export class DatetimeEditorComponent extends DefaultEditor implements AfterViewInit, OnInit {

  public form: FormGroup;
  public now = new Date();
  public isLoading = true;

  constructor() {
    super();
    this.form = new FormGroup({
      date: new FormControl(null, [ Validators.required ]),
    });
  }

  get date() { return this.form.get('date'); }

  ngOnInit() {
    // yet another hack, lol
    setTimeout(() => {
      this.date.setValue(new Date(this.cell.getValue()));
      this.isLoading = false;
    }, 500);
  }

  ngAfterViewInit() {
  }

  updateValue() {
    this.cell.newValue = this.date.value;
  }

}
