import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { translate, ErrorHelper } from '../../../@shared/helpers';

@Component({
  selector: 'ns-match-table-preferences',
  templateUrl: './table-preferences.component.html',
})
export class TablePreferencesComponent implements OnInit {

  // input values
  @Input() filters;
  @Input() filterOptions;
  @Input() storagePrefName: string;

  // public variables
  public FOCheckbox: any[] = [];
  public FOSelect: any[] = [];
  public sortableOptions = {
    onUpdate: event => this.onUpdate(event),
  };

  constructor(private activeModal: NgbActiveModal,
              private errorHelper: ErrorHelper) {
  }

  /**
   * @description ngOnInit
   */
  ngOnInit() {
    this.sortList();
    const filterOptions: any[] = Object.values(this.filterOptions);
    this.FOCheckbox = filterOptions.filter(filter => filter.type === 'checkbox');
    this.FOSelect = filterOptions.filter(filter => filter.type === 'select');
  }

  /**
   * @description Sorts listing by column's given order
   */
  sortList() {
    this.filters.sort((a, b) => a.order - b.order);
  }

  /**
   * @description Check or uncheck filter by its filterId
   * @param filterId
   */
  selectFilter(filterId) {
    const filterIndex = this.filters.findIndex(obj => obj.id === filterId);
    this.filters[filterIndex].checked = !this.filters[filterIndex].checked;
  }

  /**
   * @description Handler for selectOnSelect event on select filters
   * @param el
   * @param id
   */
  selectOnSelect(el, id) {
    const i = Number(Object.keys(el.target.children).filter(x => el.target.children[x].selected));
    this.filterOptions[id].value = Number(el.target.children[i].innerText);
  }

  /**
   * @description Returns if select's option should be as placeholder
   * @param value
   * @param id
   * @return {boolean}
   */
  placeholderValue(value, id) {
    return this.filterOptions[id].value === value;
  }

  /**
   * @description Handler for onChange event on Checkbox filters
   * @param value
   * @param id
   */
  checkboxOnChange(value, id) {
    this.filterOptions[id].value = !value;
  }

  /**
   * @description Handler for onUpdate event
   * @param event
   */
  onUpdate(event) {
    // raise the index by 1 to match the filter order (0 -> 1)
    event.newIndex++; event.oldIndex++;

    // I HAVE NO FUCKING CLUE WHY
    // but otherwise it somehow creates a new undefined item
    // in the filters array. LIKE WHAT THE FUCK?
    // update: HOLY FUCK IM SO FU*KING RETARDED
    //         THE PROBLEM WAS BECAUSE I LEFT A FUCKING HEADING
    //         IN THE DRAGGABLE AREA...
    //         I'm still going to leave this piece of code here
    //         just in case LOL
    this.filters.forEach((filter, index) => {
      if (filter === undefined) { this.filters.splice(index, 1); }
    });

    // change order of the newly updated filter
    const dragged = this.filters.findIndex(obj => obj.order === event.oldIndex);
    this.filters[dragged].order = event.newIndex;

    // change order of the order replaced filter
    if (event.newIndex > event.oldIndex) {
      // going down
      for (let i = event.newIndex; i > event.oldIndex; i--) {
        const index = this.filters.findIndex(obj => obj.order === i && obj.title.toLowerCase().replace(/\s/g, '') !== event.item.innerText.toLowerCase().replace(/\s/g, ''));
        this.filters[index].order -= 1;
      }
    } else {
      // going up
      for (let i = event.newIndex; i < event.oldIndex; i++) {
        const index = this.filters.findIndex(obj => obj.order === i && obj.title.toLowerCase().replace(/\s/g, '') !== event.item.innerText.toLowerCase().replace(/\s/g, ''));
        this.filters[index].order += 1;
      }
    }

    // perform check for duplicate 'order' values
    const test = [];
    this.filters.forEach(filter => { test.push(filter.order); });
    if (new Set(test).size !== test.length) {
      this.errorHelper.handleGenericError({
        name: translate('SORT_ERR_TITLE'),
        message: translate('SORT_ERR_MSG'),
      });
    }

    // sort the list
    this.sortList();
  }

  /**
   * @description Close modal window
   */
  closeModal() {
    this.activeModal.close(false);
  }

  /**
   * @description Saves current preferences into localStorage
   */
  savePreferences() {
    const filtersFormatted = [];
    this.filters.forEach(filter => {
      filtersFormatted.push({ id: filter.id, checked: filter.checked, order: filter.order });
    });

    const preferences = JSON.parse(sessionStorage.getItem('tablePref')) || {};
    preferences[this.storagePrefName] = {
      filters: filtersFormatted,
      filterOptions: this.filterOptions,
    };
    sessionStorage.setItem('tablePref', JSON.stringify(preferences));
  }

  /**
   * @description Save preferences and close modal window
   */
  applyChanges() {
    this.savePreferences();
    this.activeModal.close({
      filterOptions: this.filterOptions, filters: this.filters,
    });
  }

}
