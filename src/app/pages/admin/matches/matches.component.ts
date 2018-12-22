import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { MatchesService } from './matches.service';
import { ToasterService } from 'angular2-toaster';
import { EPlayersRendererComponent } from '../../../@core/tables/renderers/eplayers.renderer';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { MatchDetailComponent } from '../../matches/match-detail/match-detail.component';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { translate, formatMatches, ErrorHelper, HumanizerHelper } from '../../../@shared/helpers';
import * as codeConfig from '../../../@shared/config/codes.config';
import * as moment from 'moment';

@Component({
  selector: 'ns-matches',
  templateUrl: './matches.component.html',
})
export class MatchesComponent extends DefaultTableComponent implements OnInit {

  constructor(private matchesService: MatchesService,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              private userService: UserService,
              private router: Router,
              public modalService: NgbModal,
              public errorHelper: ErrorHelper) {

    super(errorHelper, modalService);

    // pass in the values
    this.storagePrefName = 'matchManager';
    this.source = new LocalDataSource();
    this.filterOptions = {
      showPast: {
        value: true,
        id: 'showPast',
        title: translate('SHOW_PAST_MATCHES'),
        type: 'checkbox',
      },
      rowsPerPage: {
        value: 5,
        id: 'rowsPerPage',
        title: translate('ROWS_PER_PAGE'),
        type: 'select',
        options: {
          multiple: false,
          closeOnSelect: true,
          clearable: false,
          searchable: false,
          items: [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '25', value: 25 },
            { label: '50', value: 50 },
          ],
        },
      },
    };
    this.settings = {
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
      },
      actions: {
        columnTitle: translate('ACTIONS'),
      },
      hideSubHeader: true,
      mode: 'external',
      noDataMessage: translate('NO_MATCHES'),
      rowClassFunction: row => moment(row.data.date).isSameOrBefore(new Date()) ? 'data-row-old' : null,
      columns: {},
      pager: {
        perPage: this.filterOptions.rowsPerPage.value,
      },
    };
    this.filters = [
      {
        order: 1,
        id: 'title',
        title: translate('TITLE'),
        type: 'string',
        checked: false,
        default: true,
        compareFunction: (dir, a, b) => {
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 2,
        id: 'place',
        title: translate('PLACE'),
        type: 'string',
        checked: false,
        default: true,
        valuePrepareFunction: value => value.name || value,
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 3,
        id: 'date',
        title: translate('DATE'),
        type: 'html',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 4,
        id: 'group',
        title: translate('GROUP'),
        type: 'string',
        checked: false,
        default: true,
        valuePrepareFunction: value => value.name,
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 5,
        id: 'enrollmentOpens',
        title: translate('EOPEN'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 6,
        id: 'enrollmentCloses',
        title: translate('ECLOSE'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 7,
        id: 'enrollmentMaxCap',
        title: translate('EMAX'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: (cell, row) => `${row.enrollment.players.filter(player => player.status === 'going').length}/${row.enrollment.maxCapacity}`,
      },
      {
        order: 8,
        id: 'enrollmentPlayers',
        title: translate('EPLAYERS'),
        type: 'custom',
        checked: false,
        editable: false,
        default: true,
        renderComponent: EPlayersRendererComponent,
      },
      {
        order: 9,
        id: 'createdBy',
        title: translate('CREATED_BY'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => `${value.name} (#${value.number})`,
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 10,
        id: 'createdAt',
        title: translate('CREATED_AT'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 11,
        id: 'updatedBy',
        title: translate('UPDATED_BY'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => `${value.name} (#${value.number})`,
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 12,
        id: 'updatedAt',
        title: translate('UPDATED_AT'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 13,
        id: 'note',
        title: translate('NOTE'),
        type: 'string',
        checked: false,
        default: false,
        valuePrepareFunction: value => !!value ? value : '---',
        compareFunction: (dir, a, b) => {
          const first = typeof a === 'string' ? a.toLowerCase() : a === null ? 'zzz' : a;
          const second = typeof b === 'string' ? b.toLowerCase() : b === null ? 'zzz' : b;
          return first.localeCompare(second, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
    ];
  }

  ngOnInit() {
    this.loadPreferences();
    this.loadData();
  }

  /**
   * @description Loads Matches from server
   */
  loadData() {
    this.isLoading = true;
    this.matchesService.get().subscribe(response => {
      if (response.response.success) {
        const showOlder = this.filterOptions.showPast.value;
        const matches = showOlder ? response.output : response.output.filter(x => !moment(x.date).isSameOrBefore(new Date()));
        this.source.load(formatMatches(matches)).then(() => {
          this.source.setSort([{ field: 'date', direction: 'desc' }]);
          this.applyPreferences();
          this.isLoading = false;
        });
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('NO_MATCHS_FOUND', 'core').name: {
          this.source.load([]).then(() => { this.isLoading = false; });
          break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }
    });
  }

  /**
   * @description Handler for onEdit event
   * @param event
   */
  onEdit(event) {
    this.router.navigate(['/pages/admin/matches/edit/' + event.data._id]);
  }

  /**
   * @description Opens a modal window with AddMatchComponent
   */
  createMatch() {
    const modal = this.modalService.open(AddMatchComponent, {
      container: 'nb-layout',
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });

    modal.result.then(bool => {
      if (bool) this.loadData();
    }, error => null);
  }

  /**
   * @description Handler for onDelete event
   * @param event
   */
  onDelete(event): void {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
    });

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${event.data.title}'?`;
    modal.componentInstance.modalContent = `<p class="text-muted">${translate('DELETE_MATCH_MSG')}</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: translate('CANCEL'),
        classes: 'btn-secondary',
        action: () => { modal.close(); },
      },
      {
        text: translate('DELETE'),
        classes: 'btn-danger',
        action: () => {
          this.matchesService.delete(event.data._id).subscribe(response => {
            if (response.response.success) {
              this.toasterService.popAsync('success', translate('MATCH_DELETED_TITLE'), translate('MATCH_DELETED_MSG'));
              modal.close();
              this.loadData();
            } else {
              this.errorHelper.processedButFailed(response);
            }
          }, error => {
            this.errorHelper.handleGenericError(error);
          });
        },
      },
    ];
  }

  /**
   * @description Handler for onUserRowSelect event
   * @param event
   */
  onUserRowSelect(event) {
    const modal = this.modalService.open(MatchDetailComponent, {
      container: 'nb-layout',
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.match = event.data;

    modal.result.then(reload => {
      if (reload) { this.loadData(); }
    }).catch(error => null);
  }

}
