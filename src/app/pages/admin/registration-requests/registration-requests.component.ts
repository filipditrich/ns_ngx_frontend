import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { ToasterService } from 'angular2-toaster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { RegistrationRequestsService } from './registration-requests.service';
import { InviteModalComponent } from './invite-modal/invite-modal.component';
import { translate, ErrorHelper, HumanizerHelper } from '../../../@shared/helpers';
import * as codeConfig from '../../../@shared/config/codes.config';

@Component({
  selector: 'ns-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: [ './registration-requests.component.scss' ],
})
export class RegistrationRequestsComponent extends DefaultTableComponent implements OnInit {

  constructor(private regReqService: RegistrationRequestsService,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              public modalService: NgbModal,
              public errorHelper: ErrorHelper) {

    super(errorHelper, modalService);

    // pass in the values
    this.storagePrefName = 'registrationRequests';
    this.source = new LocalDataSource();
    this.filterOptions = {
      showAccepted: {
        value: false,
        id: 'showAccepted',
        title: translate('SHOW_ACCEPTED'),
        type: 'checkbox',
      },
      showRegistered: {
        value: false,
        id: 'showRegistered',
        title: translate('SHOW_REGISTERED'),
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
        editButtonContent: `<i class="icon nb-checkmark fs-large"></i>`,
        editClassFunction: row => row.data.approval.approved ? 'pointer-events-none' : '',
      },
      actions: {
        columnTitle: translate('ACTIONS'),
        edit: true,
        delete: false,
        add: false,
      },
      hideSubHeader: true,
      mode: 'external',
      noDataMessage: translate('NO_REGISTRATION_REQUESTS'),
      rowClassFunction: row => {
        const returnClasses = [];
        returnClasses.push(row.data.approval.approved ? 'row-data-approved' : null);
        returnClasses.push(row.data.registration.userRegistered ? 'row-data-registered' : null);
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
        id: 'name',
        title: translate('NAME'),
        type: 'string',
        checked: false,
        default: true,
        compareFunction: (dir, a, b) => {
          const _a = !!a ? a : 'N/A';
          const _b = !!b ? b : 'N/A';
          return _a.localeCompare(_b, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
        valuePrepareFunction: value => !!value ? value : 'N/A',
      },
      {
        order: 2,
        id: 'email',
        title: translate('EMAIL'),
        type: 'string',
        checked: false,
        editable: false,
        default: true,
        compareFunction: (dir, a, b) => {
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 3,
        id: 'requestedOn',
        title: translate('REQUESTED_ON'),
        type: 'string',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 4,
        id: 'approvedOn',
        title: translate('APPROVED_ON'),
        type: 'string',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: value => !!value ? this.humanizer.date(value) : 'N/A',
      },
      {
        order: 5,
        id: 'approvedBy',
        title: translate('APPROVED_BY'),
        type: 'string',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: value => !!value ? `${value.name} (#${value.number})` : 'N/A',
        compareFunction: (dir, a, b) => {
          const _a = !!a ? a : { name: 'N/A' };
          const _b = !!b ? b : { name: 'N/A' };
          return _a.name.localeCompare(_b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 6,
        id: 'registeredUser',
        title: translate('USER'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => !!value ? `${value.name} (#${value.number})` : 'N/A',
        compareFunction: (dir, a, b) => {
          const _a = !!a ? a : { name: 'N/A' };
          const _b = !!b ? b : { name: 'N/A' };
          return _a.name.localeCompare(_b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 7,
        id: 'registrationHash',
        title: translate('HASH'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        compareFunction: (dir, a, b) => {
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
    ];
  }

  ngOnInit(): void {
    this.loadPreferences();
    this.loadData();
  }

  /**
   * @description Formats Registration Requests
   * @param requests
   * @return {any[]}
   */
  formatRequests(requests) {
    const formatted = [];
    requests.forEach(request => {
      request['registrationHash'] = request.registration.registrationHash;
      request['userRegistered'] = request.registration.userRegistered;
      request['registeredUser'] = request.registration.user;
      request['approvedOn'] = request.approval.approvedOn;
      request['approvedBy'] = request.approval.approvedBy;
      request['approved'] = request.approval.approved;
      request['name'] = !!request.name ? request.name : !!request.registeredUser ? request.registeredUser.name : null;
      formatted.push(request);
    });

    return formatted;
  }

  /**
   * @description Loads Places from server
   */
  loadData(): void {
    this.isLoading = true;
    this.regReqService.get().subscribe(response => {
      if (response.response.success) {
        let requests: any[] = response.output;
        requests = requests.sort((a, b) => (a.approval.approved > b.approval.approved) ? 1 : ((b.approval.approved > a.approval.approved) ? -1 : 0));
        requests = this.filterOptions.showAccepted.value ? response.output : response.output.filter(req => !req.approval.approved);
        requests = this.filterOptions.showRegistered.value ? requests : requests.filter(req => !req.registration.userRegistered);
        this.source.load(this.formatRequests(requests)).then(() => {
          this.source.setSort([{ field: 'approvedOn', direction: 'desc' }]);
          this.applyPreferences();
          this.isLoading = false;
        });
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('NO_REQUESTS_FOUND', 'operator').name: {
          this.source.load([]).then(() => this.isLoading = false );
          break;
        }
        default: {
          this.errorHelper.handleGenericError(error);
          break;
        }
      }
    });
  }

  /**
   * @description Handler for onEdit event
   * @param event
   */
  onEdit(event): void {
    this.isLoading = true;
    this.regReqService.resolveRequest(event.data._id, true).subscribe(response => {
      if (response.response.success) {
        this.toasterService.popAsync('info', translate('REGISTRATION_APPROVED_TITLE'), translate('REGISTRATION_APPROVED_MSG', { reqEmail: event.data.email }));
        this.loadData();
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, error => {
      this.errorHelper.handleGenericError(error);
    });
  }

  /**
   * @description Handler for onDelete event
   * @param event
   */
  onDelete(event): void {}


  /**
   * @description Handler for onUserRowSelect event
   * @param event
   */
  onUserRowSelect(event): void {}

  openInviteModal(): void {
    const modal = this.modalService.open(InviteModalComponent, {
      container: 'nb-layout',
      backdrop: 'static',
      keyboard: false,
    });
    modal.result.then(bool => {
      if (bool) { this.loadData(); }
    }).catch(error => null);
  }

}
