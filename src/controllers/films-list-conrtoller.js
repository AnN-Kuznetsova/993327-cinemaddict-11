import FilmsList from "../components/films-list.js";
import FilmsListTitle from "../components/films-list-title.js";
import FilmsListContainer from "../components/films-list-container.js";
import ShowMoreButton from "../components/show-more-button.js";
import FilmController from "./film-controller.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {FILM_CARD_EXTRA_COUNT,
  SHOWING_FILMS_COUNT_ON_START,
  SHOWING_FILMS_COUNT_BY_BUTTON} from "../const.js";
import {getRandomIntegerNumber} from "../utils/random.js";
import {getFieldFinder, getSortFilms} from "../utils/sorting.js";
import {arrayDataChange} from "../utils/common.js";


export default class FilmsListController {
  constructor(container, listName, title, sortType, isExtra, onFilmsDataChange, onFilmsListViewChange) {
    this._container = container;
    this._listName = listName;
    this._listTitle = isExtra ? title : `All movies. Upcoming`;
    this._isTitleVisually = isExtra;
    this._sortType = sortType;
    this._isExtra = isExtra;
    this._onFilmsDataChange = onFilmsDataChange;
    this._onFilmsListViewChange = onFilmsListViewChange;

    this._listFilms = [];
    this._showingFilmControllers = [];
    this._selectionFieldFinder = getFieldFinder(this._sortType);
    this._filmsExtraCount = FILM_CARD_EXTRA_COUNT;
    this._showingFilmsCount = 0;
    this._showingFilmsCountByButton = SHOWING_FILMS_COUNT_BY_BUTTON;

    this._filmsListComponent = null;
    this._filmsListContainerComponent = null;
    this._showMoreButtonComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }


  _onDataChange(oldData, newData) {
    this._onFilmsDataChange(oldData, newData);
  }

  _onViewChange() {
    this._onFilmsListViewChange();
  }


  _getTopFilms(sortedFilms, topFilms = []) {
    const maxElement = this._selectionFieldFinder(sortedFilms[0]);
    const filteredFilms = sortedFilms.filter((film) => (this._selectionFieldFinder(film) === maxElement));

    if ((topFilms.length + filteredFilms.length) >= this._filmsExtraCount) {
      while (topFilms.length < this._filmsExtraCount) {
        topFilms.push(...filteredFilms.splice(getRandomIntegerNumber(this._filmsExtraCount - filteredFilms.length), 1));
      }
    } else {
      topFilms.splice(topFilms.length, 0, ...filteredFilms.slice());
      sortedFilms.splice(0, filteredFilms.length);
      this._getTopFilms(sortedFilms, topFilms);
    }

    return topFilms;
  }

  _getFilms(films) {
    const sortedFilms = getSortFilms(films, this._sortType);
    let listFilms = sortedFilms;

    if (this._isExtra) {
      if (listFilms.length) {
        listFilms = this._getTopFilms(sortedFilms);
      }

      if (listFilms.length === 0 || this._selectionFieldFinder(listFilms[0]) === 0) {
        return 0;
      }
    }

    return listFilms;
  }


  _renderFilms(films, onDataChange, onViewChange) {
    const newFilmControllers = films.map((film) => {
      const filmController = new FilmController(this._filmsListContainerComponent.getElement(), onDataChange, onViewChange);

      filmController.render(film);

      return filmController;
    });

    this._showingFilmControllers = this._showingFilmControllers.concat(newFilmControllers);
  }


  _renderShowMoreButton() {
    this._showMoreButtonComponent = new ShowMoreButton();
    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    const onShowMoreButtonClick = () => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += this._showingFilmsCountByButton;
      this._renderFilms(this._listFilms.slice(prevFilmsCount, this._showingFilmsCount), this._onDataChange, this._onViewChange); // sort here

      if (this._showingFilmsCount >= this._listFilms.length) {
        remove(this._showMoreButtonComponent);
      }
    };

    this._showMoreButtonComponent.setOnShowMoreButtonClick(onShowMoreButtonClick);
  }


  _renderFilmsList() {
    const filmsListElement = this._filmsListComponent.getElement();
    filmsListElement.innerHTML = ``;
    this._showingFilmControllers = [];

    if (!this._listFilms.length) {
      render(filmsListElement, new FilmsListTitle(`There are no movies in our database`), RenderPosition.AFTERBEGIN);
      return;
    }

    const filmsListTitleComponent = new FilmsListTitle(this._listTitle, this._isTitleVisually);
    render(filmsListElement, filmsListTitleComponent, RenderPosition.AFTERBEGIN);

    this._filmsListContainerComponent = new FilmsListContainer();
    render(filmsListElement, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(this._listFilms.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);

    if (this._listFilms.length > SHOWING_FILMS_COUNT_ON_START) {
      this._renderShowMoreButton();
    }
  }


  render(films) {
    this._listFilms = this._getFilms(films);
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    if (!(this._isExtra && !this._listFilms)) {
      if (!this._filmsListComponent) {
        this._filmsListComponent = new FilmsList(this._isExtra);
        render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);
      }
      this._renderFilmsList();
    }
  }


  setDataChange(oldData, newData) {
    const newArray = arrayDataChange(this._listFilms, oldData, newData);
    const index = newArray.index;
    this._listFilms = newArray.array;

    if (index === -1) {
      return;
    }

    for (const filmController of this._showingFilmControllers) {
      if (filmController.film === oldData) {
        filmController.render(this._listFilms[index]);
        break;
      }
    }
  }


  setDefaultView() {
    this._showingFilmControllers.forEach((it) => it.setDefaultView());
  }

  get name() {
    return this._listName;
  }

  set sortType(newSortType) {
    this._sortType = newSortType;
  }
}