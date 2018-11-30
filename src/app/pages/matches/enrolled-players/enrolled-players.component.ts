import { Component, Input, OnInit } from '@angular/core';
import { MatchesService } from '../../admin/matches/matches.service';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { HumanizerHelper } from '../../../@core/helpers/humanizer.helper';
import { UsersEditorComponent } from '../../../@core/tables/editors/users.editor';
import { DatetimeEditorComponent } from '../../../@core/tables/editors/datetime.editor';
import { EPlayersStatusEditorComponent } from '../../../@core/tables/editors/eplayers-status.editor';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'ns-enrolled-players',
  templateUrl: './enrolled-players.component.html',
  styleUrls: ['./enrolled-players.component.scss'],
})
export class EnrolledPlayersComponent implements OnInit {

  constructor(private matchesService: MatchesService,
              private errorHelper: ErrorHelper,
              private modalService: NgbModal,
              private activeModal: NgbActiveModal,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              private userService: UserService) {
  }

  // TODO: WHY THE FUCK IS IT NOT SHOWING ANYTHING IN THE TABLE WHEN THE SOURCE HAS DATA IN IT ?!

  @Input() match;
  @Input() players;
  public reload = false;
  public isLoading = true;
  public isAdmin = false;
  public source: LocalDataSource = new LocalDataSource();

  /**
   * @description Table Settings
   */
  public settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    noDataMessage: 'No players enrolled',
    columns: {
      info: {
        title: 'Player',
        type: 'string',
        editor: {
          type: 'custom',
          component: UsersEditorComponent,
        },
        valuePrepareFunction: value => {
          return value.name;
        },
        compareFunction: (dir, a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir,
        filterFunction: (cell: any, search: string) => cell.name.toLowerCase().indexOf(search.toLowerCase()) >= 0,
      },
      enrolledOn: {
        title: 'Enrolled On',
        type: 'string',
        filter: false,
        editor: {
          type: 'custom',
          component: DatetimeEditorComponent,
        },
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      status: {
        title: 'Status',
        type: 'string',
        editor: {
          type: 'custom',
          component: EPlayersStatusEditorComponent,
        },
      },
    },
  };

  ngOnInit() {
    this.isAdmin = ['admin'].some(role => this.userService.getCurrentUser('roles').indexOf(role) >= 0);
    if (this.isAdmin) {
      this.settings.actions.add = true;
      this.settings.actions.delete = true;
      this.settings.actions.edit = true;
      this.settings.hideSubHeader = false;
    }
    this.loadData(this.players);
  }

  /**
   * @description Loads the passed in data
   * @param data
   */
  loadData(data) {
    this.isLoading = true;
    this.source = new LocalDataSource(this.players);
    this.source.load(data).then(res => {
      this.source.setSort([{ field: 'status', direction: 'asc' }]);
      this.isLoading = false;
    });
  }

  /**
   * @description Closes the modal window
   */
  closeModal() {
    this.activeModal.close(this.reload);
  }

  /**
   * @description Handler for onCreateConfirm event
   * @param event
   */
  onCreateConfirm(event) {
    const newPlayer = {
      player: event.newData.info.value._id,
      info: event.newData.info.value,
      status: event.newData.status,
      enrolledOn: event.newData.enrolledOn,
    };

    this.match.enrollment.players.push(newPlayer);

    this.matchesService.update(this.match._id, { enrollment: this.match.enrollment }).subscribe(response => {
      if (response.response.status) {
        this.toasterService.popAsync('info', 'Update successful', 'A player has been successfully added to the match enrollment list.');
        this.reload = true;
        event.confirm.resolve(newPlayer);
      } else {
        this.errorHelper.processedButFailed(response);
        event.confirm.reject(response);
      }
    }, error => {
      event.confirm.reject(error);
      this.errorHelper.handleGenericError(error);
    });
  }

  /**
   * @description Handler for onDeleteConfirm event
   * @param event
   */
  onDeleteConfirm(event) {
    if (window.confirm('Are you sure?')) {
      const deleteIndex = this.match.enrollment.players.findIndex(obj => obj.player === event.data.info._id);
      this.match.enrollment.players.splice(deleteIndex, 1);

      this.matchesService.update(this.match._id, { enrollment: this.match.enrollment }).subscribe(response => {
        if (response.response.status) {
          this.toasterService.popAsync('info', 'Delete successful', 'A player has been successfully deleted from the match enrollment list.');
          this.reload = true;
          event.confirm.resolve(event.newData);
        } else {
          this.errorHelper.processedButFailed(response);
          event.confirm.reject(response);
        }
      }, error => {
        event.confirm.reject(error);
        this.errorHelper.handleGenericError(error);
      });
    } else {
      event.confirm.reject();
    }
  }

  /**
   * @description Handler for onEditConfirm event
   * @param event
   */
  onEditConfirm(event) {
    const _id = event.newData.info.value._id;
    const info = event.newData.info;
    const editIndex = this.match.enrollment.players.findIndex(obj => obj.player === event.newData.player);

    // update values
    this.match.enrollment.players[editIndex].player = _id;
    this.match.enrollment.players[editIndex].status = event.newData.status;
    this.match.enrollment.players[editIndex].enrolledOn = event.newData.enrolledOn;
    this.match.enrollment.players[editIndex].info = info.value;

    this.matchesService.update(this.match._id, { enrollment: this.match.enrollment }).subscribe(response => {
      if (response.response.status) {
        this.toasterService.popAsync('info', 'Update successful', 'Match enrollment player list has been updated successfully.');
        this.reload = true;
        event.confirm.resolve(event.newData);
      } else {
        this.errorHelper.processedButFailed(response);
        event.confirm.reject(response);
      }
    }, error => {
      event.confirm.reject(error);
      this.errorHelper.handleGenericError(error);
    });
  }

}
