import AbstractSmartComponent from "./abstract-smart-component.js";
import {SortType} from "../utils/sorting.js";


export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
    this._sortButtonActiveClass = `sort__button--active`;

    this._sortTypeChangeHendler = null;
  }


  getTemplate() {
    return (
      `<ul class="sort">
        <li><a href="#" class="sort__button ${this._sortButtonActiveClass}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
        <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
        <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
      </ul>`
    );
  }


  setSortType(newSortType) {
    this._currentSortType = newSortType;
  }


  setSortTypeChangeHendler(cb) {
    this._sortTypeChangeHendler = cb;

    const sortTypeButtonClickHandler = (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this.getElement()
        .querySelector(`[data-sort-type="${this._currentSortType}"]`)
        .classList.remove(`${this._sortButtonActiveClass}`);

      this._currentSortType = sortType;
      evt.target.classList.add(`${this._sortButtonActiveClass}`);
      cb(this._currentSortType);
    };

    this.getElement().addEventListener(`click`, sortTypeButtonClickHandler);
  }


  recoveryListeners() {
    this.setSortTypeChangeHendler(this._sortTypeChangeHendler);
  }
}
