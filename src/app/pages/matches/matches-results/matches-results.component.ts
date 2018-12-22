import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { MatchesService } from '../../admin/matches';
import { ToasterService } from 'angular2-toaster';
import { UserService } from '../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchResultWriteModalComponent } from './match-result-write-modal/match-result-write-modal.component';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { EPlayersRendererComponent } from '../../../@core/tables/renderers/eplayers.renderer';
import { IMatch, MatchResult } from '../../../@shared/interfaces';
import { translate, ErrorHelper, HumanizerHelper } from '../../../@shared/helpers';
import * as moment from 'moment';
import * as codeConfig from '../../../@shared/config/codes.config';

@Component({
  selector: 'ns-matches-results',
  templateUrl: './matches-results.component.html',
  styleUrls: ['./matches-results.component.scss'],
})
export class MatchesResultsComponent extends DefaultTableComponent implements OnInit {

  constructor(private matchesService: MatchesService,
              public errorHelper: ErrorHelper,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              private userService: UserService,
              public modalService: NgbModal) {

    super(errorHelper, modalService);

    this.storagePrefName = 'matchResults';
    this.source = new LocalDataSource();
    this.filterOptions = {
      showWritten: {
        value: false,
        id: 'showWritten',
        title: translate('SHOW_WRITTEN'),
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
        editButtonContent: `<i class="icon nb-edit fs-large"></i>`,
        editClassFunction: row => {
          return this.isWritten(row.data) ? 'pointer-events-none' : '';
        },
      },
      hideSubHeader: true,
      mode: 'external',
      noDataMessage: translate('NO_MATCHES_FOUND_MSG'),
      actions : {
        columnTitle: translate('ACTIONS'),
        add: false,
        edit: true,
        delete: false,
      },
      rowClassFunction: row => {
        const returnClasses: string[] = [];
        returnClasses.push(this.isWritten(row.data) ? 'row-data-written' : null);
        returnClasses.push(this.isResult(row.data, MatchResult.Win) ? 'row-data-success' : null);
        returnClasses.push(this.isResult(row.data, MatchResult.Loose) ? 'row-data-danger' : null);
        returnClasses.push(this.isResult(row.data, MatchResult.Draft) ? 'row-data-warning' : null);
        return returnClasses.filter(x => x !== null).join(' ');
      },
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
        type: 'html',
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
        type: 'html',
        checked: false,
        default: true,
        valuePrepareFunction: cell => cell.name || cell,
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
        valuePrepareFunction: cell => this.humanizer.date(cell),
      },
      {
        order: 4,
        id: 'note',
        title: translate('NOTE'),
        type: 'html',
        checked: false,
        default: false,
        valuePrepareFunction: cell => cell ? cell : '---',
        compareFunction: (dir, a, b) => {
          const first = typeof a === 'string' ? a.toLowerCase() : a === null ? 'zzz' : a;
          const second = typeof b === 'string' ? b.toLowerCase() : b === null ? 'zzz' : b;
          return first.localeCompare(second, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 5,
        id: 'enrollmentPlayers',
        title: translate('EPLAYERS'),
        type: 'custom',
        checked: false,
        editable: false,
        default: false,
        sortable: false,
        renderComponent: EPlayersRendererComponent,
      },
      {
        order: 6,
        id: 'playerResult',
        title: translate('RESULT'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        sortable: false,
        valuePrepareFunction: (cell, row) => {
          const UID = this.userService.getCurrentUser('_id');
          return row.results ? row.results.players.filter(x => x.player === UID).length ? translate(row.results.players.filter(x => x.player === UID)[0].status.toUpperCase()) : '---' : '---';
        },
      },
      {
        order: 7,
        id: 'playerJersey',
        title: translate('JERSEY'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        sortable: false,
        valuePrepareFunction: (cell, row) => {
          const UID = this.userService.getCurrentUser('_id');
          return row.results ? row.results.players.filter(x => x.player === UID).length ? row.results.players.filter(x => x.player === UID)[0].jersey.name : '---' : '---';
        },
      },
      {
        order: 8,
        id: 'resultsWritten',
        title: translate('WRITTEN'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        sortable: false,
        valuePrepareFunction: (cell, row) => `${row.results ? row.results.players.length : '0'}/${row.enrollment.players.length}`,
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
        const UID = this.userService.getCurrentUser('_id');
        const matches: IMatch[] = response.output.filter(x => moment(x.date).isSameOrBefore(new Date()));
        const enrolled = matches.filter(x => x.enrollment.players.filter(y => y.player === UID && y.status === 'going').length > 0);
        const filtered = this.filterOptions.showWritten.value ? enrolled : enrolled.filter(x => !this.isWritten(x));
        this.source.load(filtered).then(() => {
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
   * @description Returns true if match results were written by current user
   * @param {IMatch} match
   * @return {boolean}
   */
  isWritten(match: IMatch): boolean {
    const UID = this.userService.getCurrentUser('_id');
    return !match.results ? false : match.results.players.some(x => x.player === UID);
  }

  /**
   * @description Returns true if match result is same as requested status
   * @param {IMatch} match
   * @param {MatchResult} status
   * @return {boolean}
   */
  isResult(match: IMatch, status: MatchResult) {
    const UID = this.userService.getCurrentUser('_id');
    return !match.results ? false : match.results.players.some(x => x.player === UID && x.status === status);
  }

  /**
   * @description Handler for onEdit event
   * @param event
   */
  editResults(event) {
    const modal = this.modalService.open(MatchResultWriteModalComponent, {
      container: 'nb-layout',
    });
    modal.componentInstance.match = event.data;

    modal.result.then(bool => {
      if (bool) this.loadData();
    }).catch(error => null);
  }


}
