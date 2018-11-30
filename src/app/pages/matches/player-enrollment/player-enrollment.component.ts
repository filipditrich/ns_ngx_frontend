import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { MatchesService } from '../../admin/matches';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { HumanizerHelper } from '../../../@core/helpers/humanizer.helper';
import { ToasterService } from 'angular2-toaster';
import { EPlayersRendererComponent } from '../../../@core/tables/renderers/eplayers.renderer';
import { UserService } from '../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { MatchDetailComponent } from '../match-detail/match-detail.component';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { IMatch } from '../../../@core/models/match.interface';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as codeConfig from '../../../@core/config/codes.config';

@Component({
  selector: 'ns-player-enrollment',
  templateUrl: './player-enrollment.component.html',
  styleUrls: ['./player-enrollment.component.scss'],
})
export class PlayerEnrollmentComponent extends DefaultTableComponent implements OnInit {

  constructor(private matchesService: MatchesService,
              public errorHelper: ErrorHelper,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              private userService: UserService,
              public modalService: NgbModal,
              private router: Router) {

    super(errorHelper, modalService);

    // pass in the values
    this.localStoragePrefName = 'playerEnrollment';
    this.source = new LocalDataSource();
    this.filterOptions = {
      showPast: {
        value: false,
        id: 'showPast',
        title: 'Show past matches',
        type: 'checkbox',
      },
      rowsPerPage: {
        value: 5,
        id: 'rowsPerPage',
        title: 'Rows per page:',
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
        editButtonContent: `<i class="icon ion-md-checkmark fs-large px-3"></i>`,
        editClassFunction: row => {
          const UID = this.userService.getCurrentUser('_id');
          const userEnrollment = row.data.enrollment.players.filter(player => player.player === UID)[0];
          const returnClass = [];

          returnClass.push(!!userEnrollment && userEnrollment.status === 'going' ? 'bg-success text-white pointer-events-none' : null);
          returnClass.push(this.isMatchEnrollmentClosed(row.data) || (this.isMatchEnrollmentFull(row.data) && !!userEnrollment && userEnrollment.status !== 'going') ? 'pointer-events-none disabled' : null);
          return returnClass.filter(filterClass => filterClass !== null).join(' ');
        },
      },
      delete: {
        deleteButtonContent: `<i class="icon ion-md-close fs-large px-3"></i>`,
        deleteClassFunction: row => {
          const UID = this.userService.getCurrentUser('_id');
          const userEnrollment = row.data.enrollment.players.filter(player => player.player === UID)[0];
          const returnClass = [];

          returnClass.push(!!userEnrollment && userEnrollment.status === 'skipping' ? 'bg-danger text-white pointer-events-none' : null);
          returnClass.push(this.isMatchEnrollmentClosed(row.data) ? 'pointer-events-none disabled' : null);
          return returnClass.filter(filterClass => filterClass !== null).join(' ');
        },
      },
      hideSubHeader: true,
      mode: 'external',
      noDataMessage: 'No matches found',
      actions : {
        columnTitle: 'Actions',
        add: false,
        edit: true,
        delete: true,
        custom: [
          {
            name: 'print',
            content: '<i class="icon ion-md-print fs-large px-3"></i>',
            classFunction: row => '',
          },
        ],
      },
      rowClassFunction: row => {
        const UID = this.userService.getCurrentUser('_id');
        const userEnrollment = row.data.enrollment.players.filter(player => player.player === UID)[0];
        const returnClass = [];

        returnClass.push(this.isMatchEnrollmentClosed(row.data) && !this.isMatchInPast(row.data) ? 'row-data-warning' : null);
        returnClass.push(this.isMatchEnrollmentFull(row.data) && !!userEnrollment && userEnrollment.status !== 'going' ? 'row-data-danger' : null);
        returnClass.push(this.isMatchInPast(row.data) ? 'row-data-old' : null);
        return returnClass.filter(filterClass => filterClass !== null).join(' ');

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
        title: 'Title',
        type: 'html',
        checked: false,
        default: true,
        compareFunction: (dir, a, b) => {
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
        valuePrepareFunction: (cell, row) => this.prepareCell(cell, row),
      },
      {
        order: 2,
        id: 'place',
        title: 'Place',
        type: 'html',
        checked: false,
        default: true,
        valuePrepareFunction: (cell, row) => this.prepareCell((cell.name || cell), row),
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 3,
        id: 'date',
        title: 'Date',
        type: 'html',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: (cell, row) => this.prepareCell(this.humanizer.date(cell), row),
      },
      {
        order: 4,
        id: 'note',
        title: 'Note',
        type: 'html',
        checked: false,
        default: false,
        valuePrepareFunction: (cell, row) => this.prepareCell((cell ? cell : '---'), row),
        compareFunction: (dir, a, b) => {
          const first = typeof a === 'string' ? a.toLowerCase() : a === null ? 'zzz' : a;
          const second = typeof b === 'string' ? b.toLowerCase() : b === null ? 'zzz' : b;
          return first.localeCompare(second, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 5,
        id: 'enrollmentOpens',
        title: 'Enrollment Opens',
        type: 'html',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: (cell, row) => this.prepareCell(this.humanizer.date(row.enrollment.enrollmentOpens), row),
      },
      {
        order: 6,
        id: 'enrollmentCloses',
        title: 'Enrollment Closes',
        type: 'html',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: (cell, row) => this.prepareCell(this.humanizer.date(row.enrollment.enrollmentCloses), row),
      },
      {
        order: 7,
        id: 'enrollmentPlayers',
        title: 'Enrolled Players',
        type: 'custom',
        checked: false,
        editable: false,
        default: false,
        renderComponent: EPlayersRendererComponent,
      },
      {
        order: 8,
        id: 'enrollmentMaxCap',
        title: 'Capacity',
        type: 'html',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: (cell, row) => {
          const cap = `${row.enrollment.players.filter(player => player.status === 'going').length}/${row.enrollment.maxCapacity}`;
          return this.prepareCell(cap, row);
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
        this.source.load(matches).then(() => {
          this.source.setSort([{ field: 'date', direction: 'desc' }]);
          this.applyPreferences();
          this.isLoading = false;
        });
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });
  }

  /**
   * @description Enrolls current user
   * @param event
   * @param {Boolean} bool
   */
  enrollSelf(event, bool: Boolean) {
    const status = bool ? 'going' : 'skipping';
    const enrollment = { status };
    this.isLoading = true;
    this.matchesService.enrollSelf(event.data._id, enrollment).subscribe(response => {
      if (response.response.success) {
        this.toasterService.popAsync('success', 'Enrolled!', `You have successfully enrolled yourself to the match with the status of "${status}".`);
        this.loadData();
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('MATCH_MAXIMUM_CAPACITY_EXCEEDED', 'core').name: {
          this.toasterService.popAsync('warning', 'Maximum capacity', 'Maximum enrollment capacity for this match has been reached.');
          this.isLoading = false;
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
   * @description Handler for onCustom-Print event
   * @param event
   */
  onPrint(event): void {
    const match: IMatch = event.data;
    if (moment(match.enrollment.enrollmentCloses).isAfter(new Date())) {
      const modal = this.modalService.open(ModalComponent, {
        container: 'nb-layout',
      });
      modal.componentInstance.modalHeader = 'Print enrollment list';
      modal.componentInstance.modalContent = `<p>Match enrollment is still opened until ${this.humanizer.date(match.enrollment.enrollmentCloses)}.<br>Do you really want to print it now?</p>`;
      modal.componentInstance.modalButtons = [
        {
          text: 'Print anyway',
          classes: 'btn-primary',
          action: () => {
            modal.close();
            this.printData(match);
          },
        },
        {
          text: 'Close',
          classes: 'btn-secondary',
          action: () => modal.close(),
        },
      ];
    } else { this.printData(match); }
  }

  // TODO: PdfService!
  printData(match: IMatch) {
    this.router.navigate(['/pages/matches/print/' + match._id]);
  }

  /**
   * @description Prepares a cell
   * @param input
   * @param {IMatch} match
   * @return {string}
   */
  prepareCell(input, match: IMatch) {
    const disabled = this.isMatchInPast(match) || this.isMatchEnrollmentClosed(match);
    return `<span${ disabled ? ' class="disabled"' : '' }>${input}</span>`;
  }

  isMatchInPast(match: IMatch): boolean {
    return moment(match.date).isSameOrBefore(new Date());
  }

  isMatchEnrollmentClosed(match: IMatch): boolean {
    return moment(match.enrollment.enrollmentCloses).isBefore(new Date());
  }

  isMatchEnrollmentFull(match: IMatch): boolean {
    return match.enrollment.players.filter(player => player.status === 'going').length >= match.enrollment.maxCapacity;
  }

  /**
   * @description Handler for onUserRowSelect event
   * @param event
   */
  onUserRowSelect(event) {
    const modal = this.modalService.open(MatchDetailComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });
    modal.componentInstance.match = event.data;

    modal.result.then(reload => {
      if (reload) { this.loadData(); }
    }).catch(error => null);
  }

}
