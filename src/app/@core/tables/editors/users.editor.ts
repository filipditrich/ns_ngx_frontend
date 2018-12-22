import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UserService } from '../../../pages/user/user.service';
import { ErrorHelper } from '../../../@shared/helpers/error.helper';
import { DefaultEditor } from 'ng2-smart-table-extended';
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
          <select
            name="player"
            id="player"
            formControlName="player"
            class="input-full-width input-md ng-dirty ng-valid ng-touched"
            (change)="updateValue()">
            <option
              *ngFor="let player of playerList"
              value="{{player._id}}">
              {{player.name}}
            </option>
          </select>
        <small class="text-danger" *ngIf="player.invalid && (player.dirty || player.touched)">This player is invalid</small>

      </div>

    </form>
  `,
})
export class UsersEditorComponent extends DefaultEditor implements AfterViewInit {

  public playerList: any[] = [];
  public form: FormGroup;
  public isLoading = true;


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

        if (!!this.cell.getRow().getData().info) {
          this.playerList = response.output;
        } else {
          // do not list already used users if in editing mode
          const used = this.cell.getDataSet().getData().map(row => row.player);
          this.playerList = response.output.filter(player => used.indexOf(player._id) < 0);
        }

        if (this.playerList.length !== 0) {

          if (!!this.cell.getRow().getData().info) {
            const player = this.playerList.filter(f => f._id === this.cell.getRow().getData().info._id)[0];
            if (!!player) {
              if (this.playerList.findIndex(x => x._id === player._id) >= 0) {
                this.player.setValue(player._id, { onlySelf: true });
              } else if (player.username === 'deletedUser') {
                if (this.playerList.findIndex(x => x._id === player._id) < 0) {
                  this.playerList.push(player);
                }
                this.player.setValue(player._id, { onlySelf: true });
              }
            } else {
              if (this.playerList.findIndex(x => x._id === 1) < 0) {
                this.playerList.push({ _id: 1, name: '(unknown user)' });
              }
              this.player.setValue(1, { onlySelf: true });
            }
          }

          // turn off the loader
          this.isLoading = false;

        } else if (this.playerList.length === 0 && !!this.cell.getRow().getData().info) {

          const player = response.output.filter(f => f._id === this.cell.getRow().getData().info._id)[0];
          this.playerList = [ player ];
          this.player.setValue(player._id, { onlySelf: true });
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
    this.cell.newValue = this.playerList.find(x => x._id === this.player.value);
  }

  ngAfterViewInit() {
  }

}
