import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { ToasterService } from 'angular2-toaster';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { JerseysService } from './jerseys.service';
import { AddJerseyComponent } from './add-jersey/add-jersey.component';
import { JerseyDetailComponent } from './jersey-detail/jersey-detail.component';
import { translate, ErrorHelper, HumanizerHelper } from '../../../@shared/helpers';
import * as codeConfig from '../../../@shared/config/codes.config';

@Component({
  selector: 'ns-jerseys',
  templateUrl: './jerseys.component.html',
})
export class JerseysComponent extends DefaultTableComponent implements OnInit {

  constructor(private jerseysService: JerseysService,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              private userService: UserService,
              private router: Router,
              public modalService: NgbModal,
              public errorHelper: ErrorHelper) {

    super(errorHelper, modalService);

    // pass in the values
    this.storagePrefName = 'jerseyManager';
    this.source = new LocalDataSource();
    this.filterOptions = {
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
      noDataMessage: translate('NO_JERSEYS'),
      columns: {},
      pager: {
        perPage: this.filterOptions.rowsPerPage.value,
      },
    };
    this.filters = [
      {
        order: 1,
        id: 'name',
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
        id: 'createdBy',
        title: translate('CREATED_BY'),
        type: 'string',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: value => `${value.name} (#${value.number})`,
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 3,
        id: 'createdAt',
        title: translate('CREATED_AT'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 4,
        id: 'updatedBy',
        title: translate('UPDATED_BY'),
        type: 'string',
        checked: false,
        editable: false,
        default: true,
        valuePrepareFunction: value => `${value.name} (#${value.number})`,
        compareFunction: (dir, a, b) => {
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * dir;
        },
      },
      {
        order: 5,
        id: 'updatedAt',
        title: translate('UPDATED_AT'),
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
    ];
  }

  ngOnInit() {
    this.loadPreferences();
    this.loadData();
  }

  /**
   * @description Loads Places from server
   */
  loadData() {
    this.isLoading = true;
    this.jerseysService.get().subscribe(response => {
      if (response.response.success) {
        this.source.load(response.output).then(() => {
          this.source.setSort([{ field: 'name', direction: 'desc' }]);
          this.applyPreferences();
          this.isLoading = false;
        });
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('NO_JERSEYS_FOUND', 'core').name: {
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
    this.router.navigate(['/pages/admin/jerseys/edit/' + event.data._id]);
  }

  /**
   * @description Handler for onDelete event
   * @param event
   */
  onDelete(event): void {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.modalHeader = `${translate('DELETE')} '${event.data.name}'?`;
    modal.componentInstance.modalContent = `<p class="text-muted">${translate('DELETE_JERSEY_MSG')}</p>`;
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
          this.jerseysService.delete(event.data._id).subscribe(response => {
            if (response.response.success) {
              this.toasterService.popAsync('success', translate('JERSEY_DELETED_TITLE'), translate('JERSEY_DELETED_MSG'));
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
   * @description Opens a modal window with AddJerseyComponent
   */
  createJersey() {
    const modal = this.modalService.open(AddJerseyComponent, {
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
   * @description Handler for onUserRowSelect event
   * @param event
   */
  onUserRowSelect(event) {
    const modal = this.modalService.open(JerseyDetailComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.jersey = event.data;

    modal.result.then(reload => {
      if (reload) { this.loadData(); }
    }).catch(error => null);
  }

}
