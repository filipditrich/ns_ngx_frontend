import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table-extended';
import { ErrorHelper } from '../../../@core/helpers/error.helper';
import { HumanizerHelper } from '../../../@core/helpers/humanizer.helper';
import { ToasterService } from 'angular2-toaster';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../ui-features/modals/modal/modal.component';
import { DefaultTableComponent } from '../../../@core/tables/default-table.component';
import { PlacesService } from './places.service';
import { AddPlaceComponent } from './add-place/add-place.component';
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import * as codeConfig from '../../../@core/config/codes.config';

@Component({
  selector: 'ns-places',
  templateUrl: './places.component.html',
})
export class PlacesComponent extends DefaultTableComponent implements OnInit {

  constructor(private placesService: PlacesService,
              private humanizer: HumanizerHelper,
              private toasterService: ToasterService,
              private userService: UserService,
              private router: Router,
              public modalService: NgbModal,
              public errorHelper: ErrorHelper) {

    super(errorHelper, modalService);

    // pass in the values
    this.localStoragePrefName = 'placeManager';
    this.source = new LocalDataSource();
    this.filterOptions = {
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
        editButtonContent: '<i class="nb-edit"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
      },
      actions: {
        columnTitle: 'Actions',
      },
      hideSubHeader: true,
      mode: 'external',
      noDataMessage: 'No places found',
      columns: {},
      pager: {
        perPage: this.filterOptions.rowsPerPage.value,
      },
    };
    this.filters = [
      {
        order: 1,
        id: 'name',
        title: 'Title',
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
        title: 'Created By',
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
        title: 'Created At',
        type: 'string',
        checked: false,
        editable: false,
        default: false,
        valuePrepareFunction: value => this.humanizer.date(value),
      },
      {
        order: 4,
        id: 'updatedBy',
        title: 'Updated By',
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
        title: 'Updated At',
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
    this.placesService.get().subscribe(response => {
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
        case codeConfig.getCodeByName('NO_PLACES_FOUND', 'core').name: {
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
    this.router.navigate(['/pages/admin/places/edit/' + event.data._id]);
  }

  /**
   * @description Handler for onDelete event
   * @param event
   */
  onDelete(event): void {
    const modal = this.modalService.open(ModalComponent, {
      container: 'nb-layout',
    });

    modal.componentInstance.modalHeader = `Delete '${event.data.title}'?`;
    modal.componentInstance.modalContent = `<p class="text-muted">Are you sure you want to delete this place?</p>`;
    modal.componentInstance.modalButtons = [
      {
        text: 'Cancel',
        classes: 'btn-secondary',
        action: () => { modal.close(); },
      },
      {
        text: 'Delete',
        classes: 'btn-danger',
        action: () => {
          this.placesService.delete(event.data._id).subscribe(response => {
            if (response.response.success) {
              this.toasterService.popAsync('success', 'Deleted', 'Place has been successfully deleted.');
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
   * @description Opens a modal window with AddPlaceComponent
   */
  createPlace() {
    const modal = this.modalService.open(AddPlaceComponent, {
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
    const modal = this.modalService.open(PlaceDetailComponent, {
      container: 'nb-layout',
      keyboard: false,
      backdrop: 'static',
    });

    modal.componentInstance.place = event.data;

    modal.result.then(reload => {
      if (reload) { this.loadData(); }
    }).catch(error => null);
  }

}
