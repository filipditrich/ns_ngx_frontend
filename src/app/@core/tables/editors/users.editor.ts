import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UserService } from '../../../pages/user/user.service';
import { ErrorHelper } from '../../helpers/error.helper';
import { DefaultEditor } from 'ng2-smart-table-extended';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormControl, FormGroup } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'ns-player-picker',
  template: `
    <form class="form row position-relative" [formGroup]="form">

      <!-- Loader -->
      <div class="card-loading" *ngIf="isLoading">
        <div class="lds-dual-ring"></div>
      </div>

      <!-- Status Picker -->
      <div class="form-group group d-flex flex-column col-sm-12"
           [ngClass]="{ 'error' : player.invalid && (player.dirty || player.touched) }">

        <ng-select
          #playerID
          [items]="playerList"
          [multiple]="false"
          [clearable]="false"
          [closeOnSelect]="true"
          [hideSelected]="true"
          bindLabel="name"
          bindValue="_id"
          id="player" class="ng-select-input-custom flex-grow-1"
          (change)="updateValue()">
        </ng-select>
        <small class="text-danger" *ngIf="player.invalid && (player.dirty || player.touched)">This player is invalid</small>

      </div>

    </form>
  `,
})
export class UsersEditorComponent extends DefaultEditor implements AfterViewInit {

  public playerList: any[] = [];
  public form: FormGroup;
  public isLoading = true;

  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;

  constructor(private playerService: UserService,
              private errorHelper: ErrorHelper,
              private toasterService: ToasterService) {
    super();

    // form
    this.form = new FormGroup({
      player: new FormControl(null, []),
    });

    // initialize userService and get all available users
    this.playerService.getAllUsers().subscribe(response => {
      if (response.response.success) {

        // do not list already used users
        const used = this.cell.getDataSet().getData().map(row => row.player);
        this.playerList = response.output.filter(player => used.indexOf(player._id) < 0);

        if (this.playerList.length !== 0) {

          // set ngSelect items + default value (if available)
          this.ngSelect.itemsList.setItems(this.playerList);
          if (!!this.cell.getRow().getData().info) {
            const player = this.playerList.filter(f => f._id === this.cell.getRow().getData().info._id)[0];
            this.ngSelect.select(this.ngSelect.itemsList.findItem(player._id));
            this.ngSelect.focus();
          }

          // turn off the loader
          this.isLoading = false;

        } else if (this.playerList.length === 0 && !!this.cell.getRow().getData().info) {

          const player = response.output.filter(f => f._id === this.cell.getRow().getData().info._id)[0];
          this.ngSelect.itemsList.setItems([ player ]);
          this.ngSelect.select(this.ngSelect.itemsList.findItem(player._id));
          this.ngSelect.focus();
          this.isLoading = false;

        } else {

          // TODO: try to automatically reject the event form within the table
          this.toasterService.popAsync('warning', 'No Players Available!', 'There are no available users to pick from.');

        }
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });

  }

  /**
   * @description Form getter for 'player' field
   * @return {AbstractControl | null}
   */
  get player() { return this.form.get('player'); }

  /**
   * @description Updates the cell value
   */
  updateValue() {
    this.cell.newValue = this.ngSelect.itemsList.selectedItems[0];
  }

  ngAfterViewInit() {
  }

}
