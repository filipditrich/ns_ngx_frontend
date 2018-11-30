import { LocalDataSource } from '../../../../ng2-smart-table-extended-demo/dist/ng2-smart-table-extended';
import { TablePreferencesComponent } from './table-preferences/table-preferences.component';
import { ModalComponent } from '../../pages/ui-features/modals/modal/modal.component';
import { ErrorHelper } from '../helpers/error.helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Default table component
 * @author WhiteDot
 */
export class DefaultTableComponent {

  public isLoading = true;
  public localStoragePrefName: string = 'defaultTable';
  public source: LocalDataSource;

  constructor(public errorHelper: ErrorHelper,
              public modalService: NgbModal) {

  }

  /**
   * @description Table Settings
   */
  public settings: any = {};

  /**
   * @description Filter Columns
   */
  public filters: any[] = [];

  /**
   * @description Optional filters
   */
  public filterOptions: any = {};

  /**
   * @description Loads data
   */
  loadData() {}

  /**
   * @description Stores preferences from 'input' or localStore based on the 'input' presence
   * @param input
   */
  loadPreferences(input?: any) {
    const preferences = !!input ? input : JSON.parse(localStorage.getItem('tablePref')) ? JSON.parse(localStorage.getItem('tablePref'))[this.localStoragePrefName] : false;

    if (preferences) {

      // assign the new values
      this.filterOptions = preferences.filterOptions;
      preferences.filters.forEach(filter => {
        const filterIndex = this.filters.findIndex(obj => obj.id === filter.id);
        this.filters[filterIndex].order = filter.order;
        this.filters[filterIndex].checked = filter.checked;
      });

    }

  }

  /**
   * @description Applies currently stored preferences
   */
  applyPreferences() {
    // update the settings
    const upd = this.settings;
    upd.pager.perPage = this.filterOptions.rowsPerPage.value;
    this.settings = Object.assign({}, upd);
    this.source.setPaging(this.source.getPaging().page, this.settings.pager.perPage);

    // add active filters
    this.filters.filter(filter => filter.checked).forEach(filter => {
      this.addFilter(filter.id);
    });

    // remove inactive filters
    this.filters.filter(filter => !filter.checked).forEach(filter => {
      this.removeFilter(filter.id);
    });

    if (this.filters.filter(filter => filter.checked).length === 0) {
      if (!JSON.parse(localStorage.getItem('tablePref')) || !JSON.parse(localStorage.getItem('tablePref'))[this.localStoragePrefName]) {
        // no tablePreferences stored, apply default filters
        this.applyDefaults();
      } else {
        // user unchecked all filters intentionally
        const modal = this.modalService.open(ModalComponent, {
          container: 'nb-layout',
        });

        modal.componentInstance.modalHeader = 'Warning!';
        modal.componentInstance.modalContent = `You've unchecked all filters, therefore there will be no columns to show. Do you really wish to proceed?`;
        modal.componentInstance.modalButtons = [
          {
            text: 'No, set defaults',
            classes: 'btn btn-primary',
            action: () => { this.applyDefaults(); modal.close(); },
          },
          {
            text: 'Yes, continue',
            classes: 'btn btn-secondary',
            action: () => modal.close(),
          },
        ];
      }
    }
  }

  /**
   * @description Adds Filter Column to the Table
   * @param filterId
   */
  addFilter(filterId) {
    const upd = this.settings;
    const objIndex = this.filters.findIndex((obj => obj.id === filterId));
    const filter = this.filters[objIndex];
    filter.checked = true;
    const formatted = {};
    upd.columns[filter.id] = filter;
    const array = Object.keys(upd.columns).map(i => upd.columns[i]);
    const sorted = array.sort((a, b) =>  a.order - b.order );
    sorted.forEach(obj => { formatted[obj.id] = obj; });
    upd.columns = formatted;
    this.settings = Object.assign({}, upd);
  }

  /**
   * @description Removes Filter Column from the Table
   * @param filterId
   */
  removeFilter(filterId) {
    const upd = this.settings;
    const objIndex = this.filters.findIndex((obj => obj.id === filterId));
    const filter = this.filters[objIndex];
    filter.checked = false;
    delete upd.columns[filter.id];
    this.settings = Object.assign({}, upd);
  }

  /**
   * @description Opens columnPreferences modal window
   */
  openPreferences() {
    // create the modal instance
    const modal = this.modalService.open(TablePreferencesComponent, {
      container: 'nb-layout',
    });

    // pass the current filters into the modal component
    modal.componentInstance.filters = this.filters;
    modal.componentInstance.filterOptions = this.filterOptions;
    modal.componentInstance.localStoragePrefName = this.localStoragePrefName;

    // modify filters
    modal.result.then(output => {
      if (output) {
        // update the settings
        this.loadPreferences(output);
        // reload the data
        this.loadData();
      }
    }, error => null);
  }

  /**
   * @description Applies default filter columns
   */
  applyDefaults() {
    this.filters.filter(filter => filter.default).forEach(filter => {
      this.addFilter(filter.id);
    });
  }
}
