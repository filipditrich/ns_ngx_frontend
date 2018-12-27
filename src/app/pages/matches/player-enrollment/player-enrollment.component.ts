import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { MatchesService } from '../../admin/matches';
import { ToasterService } from 'angular2-toaster';
import { EPlayersRendererComponent } from '../../../@core/tables/renderers/eplayers.renderer';
import { UserService } from '../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { MatchDetailComponent } from '../match-detail/match-detail.component';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import {EnrollmentStatus, IMatch} from '../../../@shared/interfaces';
import { Router } from '@angular/router';
import { translate, ErrorHelper, HumanizerHelper } from '../../../@shared/helpers';
import * as moment from 'moment';
import * as codeConfig from '../../../@shared/config/codes.config';

@Component({
  selector: 'ns-player-enrollment',
  templateUrl: './player-enrollment.component.html',
  styleUrls: ['./player-enrollment.component.scss'],
})
export class PlayerEnrollmentComponent extends DefaultTableComponent implements OnInit {

  public now = new Date();

  constructor(public matchesService: MatchesService,
              public errorHelper: ErrorHelper,
              public humanizer: HumanizerHelper,
              public toasterService: ToasterService,
              public userService: UserService,
              public modalService: NgbModal,
              public router: Router) {
    super(errorHelper, modalService);

    // pass in the values
    this.storagePrefName = 'playerEnrollment';

    this.source = new LocalDataSource();
    this.filterOptions = {
      showPast: {
        value: false,
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
          returnClass.push(this.isMatchEnrollmentAfterClose(row.data) && userEnrollment.status !== 'going' ? 'pointer-events-none disabled' : null);
          returnClass.push(this.isMatchEnrollmentBeforeOpen(row.data) ? 'pointer-events-none disabled' : null);
          returnClass.push(this.isMatchInPast(row.data) ? 'pointer-events-none disabled' : null);
          return returnClass.filter(filterClass => filterClass !== null).join(' ');
        },
      },
      hideSubHeader: true,
      mode: 'external',
      noDataMessage: translate('NO_MATCHES_FOUND_MSG'),
      actions : {
        columnTitle: translate('ACTIONS'),
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

        // TODO: ERROR WITH THESE CLASSES WHEN CLICKING (AFTERITHASBEENCHECKED). LICK MY BALLS WITH THIS BS
        returnClass.push(this.isMatchEnrollmentClosed(row.data) && !this.isMatchInPast(row.data) ? 'row-data-warning' : null);
        returnClass.push(this.isMatchEnrollmentFull(row.data) && !!userEnrollment && userEnrollment.status !== 'going' ? 'row-data-danger' : null);
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
        title: translate('NAME'),
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
        title: translate('PLACE'),
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
        title: translate('DATE'),
        type: 'html',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: (cell, row) => this.prepareCell(this.humanizer.date(cell), row),
      },
      {
        order: 4,
        id: 'note',
        title: translate('NOTE'),
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
        title: translate('EOPEN'),
        type: 'html',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: (cell, row) => this.prepareCell(this.humanizer.date(row.enrollment.enrollmentOpens), row),
      },
      {
        order: 6,
        id: 'enrollmentCloses',
        title: translate('ECLOSE'),
        type: 'html',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: (cell, row) => this.prepareCell(this.humanizer.date(row.enrollment.enrollmentCloses), row),
      },
      {
        order: 7,
        id: 'enrollmentPlayers',
        title: translate('EPLAYERS'),
        type: 'custom',
        checked: false,
        editable: false,
        default: false,
        renderComponent: EPlayersRendererComponent,
      },
      {
        order: 8,
        id: 'enrollmentMaxCap',
        title: translate('EMAX'),
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

  /**
   * ngOnInit implementation
   */
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
        const matches = showOlder ? response.output : response.output.filter(x => !moment(x.date).isSameOrBefore(this.now));
        this.source.load(matches).then(() => {
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
   * @description Enrolls current user
   * @param event
   * @param {Boolean} bool
   */
  enrollSelf(event, bool: Boolean) {
    const status = bool ? EnrollmentStatus.Going : EnrollmentStatus.Skipping;
    const enrollment = { status };
    this.isLoading = true;

    if (this.isMatchEnrollmentAfterClose(event.data)
      && status === EnrollmentStatus.Skipping) {
      // changing status to 'Skipping' after enrollment is closed
      // warn user, that this is irreversible (cannot enroll afterwards)
      const conf = this.modalService.open(ModalComponent, {
        container: 'nb-layout',
        keyboard: false,
        backdrop: 'static',
      });

      conf.componentInstance.modalHeader = translate('WARNING');
      conf.componentInstance.modalContent = translate('ENROLL_STATUS_CHANGE_IRR_MSG');
      conf.componentInstance.modalButtons = [
        {
          text: translate('CANCEL'),
          classes: 'btn-secondary',
          action: () => { conf.close(); this.isLoading = false; },
        },
        {
          text: translate('UNDERSTAND'),
          classes: 'btn-danger',
          action: () => { conf.close(); this.sendEnrollRequest(event, enrollment); },
        },
      ];
    } else {
      this.sendEnrollRequest(event, enrollment);
    }
  }

  /**
   * @description Sends enroll request
   * @param event
   * @param enrollment
   */
  sendEnrollRequest(event, enrollment) {
    this.matchesService.enrollSelf(event.data._id, enrollment).subscribe(response => {
      if (response.response.success) {
        const playerStatus = enrollment.status.toUpperCase();
        this.toasterService.popAsync('success', translate('ENROLLED_TITLE'),  translate('ENROLLED_MSG', { enrollmentStatus: translate(playerStatus) }));
        this.loadData();
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('MATCH_MAXIMUM_CAPACITY_EXCEEDED', 'core').name: {
          this.toasterService.popAsync('warning', translate('MAX_CAP_TITLE'), translate('MAX_CAP_MSG'));
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
    if (moment(match.enrollment.enrollmentCloses).isAfter(this.now)) {
      const modal = this.modalService.open(ModalComponent, {
        container: 'nb-layout',
        keyboard: false,
        backdrop: 'static',
      });
      modal.componentInstance.modalHeader = translate('PRINT_ENROLLMENT_LIST_TITLE');
      modal.componentInstance.modalContent = translate('PRINT_ENROLLMENT_LIST_MSG', { enrollmentCloses: this.humanizer.date(match.enrollment.enrollmentCloses) });
      modal.componentInstance.modalButtons = [
        {
          text: translate('PRINT_ANYWAY'),
          classes: 'btn-primary',
          action: () => {
            modal.close();
            this.printData(match);
          },
        },
        {
          text: translate('CANCEL'),
          classes: 'btn-secondary',
          action: () => modal.close(),
        },
      ];
    } else { this.printData(match); }
  }

  /**
   * @description Redirects to print page
   * @param {IMatch} match
   */
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

  /**
   * @description Return if match is already in past
   * @param {IMatch} match
   * @return {boolean}
   */
  isMatchInPast(match: IMatch): boolean {
    return moment(match.date).isBefore(this.now);
  }

  /**
   * @description Return if match enrollment is closed
   * @param {IMatch} match
   * @return {boolean}
   */
  isMatchEnrollmentClosed(match: IMatch): boolean {
    return moment(match.enrollment.enrollmentCloses).isBefore(this.now)
      || moment(match.enrollment.enrollmentOpens).isAfter(this.now);
  }

  /**
   * @description Returns if match enrollment is already closed
   * @param {IMatch} match
   * @return {boolean}
   */
  isMatchEnrollmentAfterClose(match: IMatch): boolean {
    return moment(match.enrollment.enrollmentCloses).isBefore(this.now);
  }

  /**
   * @description Returns if match enrollment is not yet opened
   * @param {IMatch} match
   * @return {boolean}
   */
  isMatchEnrollmentBeforeOpen(match: IMatch): boolean {
    return moment(match.enrollment.enrollmentOpens).isAfter(this.now);
  }

  /**
   * @description Returns if match enrollment is full
   * @param {IMatch} match
   * @return {boolean}
   */
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
