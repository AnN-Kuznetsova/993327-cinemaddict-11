import {DEFAULT_FILTER} from "../const.js";
import {Filter} from "../mock/filter.js";


const createFilterMarkup = (filter, isActive = false) => {
  const [key, value] = filter;
  return (
    `<a href="#${key}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${value}</a>`
  );
};

const createFiltersMarkup = (filters) => {
  return Array.from(filters)
    .map(([value, key]) => createFilterMarkup([value, key], value === DEFAULT_FILTER))
    .join(`\n`);
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${createFiltersMarkup(Filter)}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};


export {createSiteMenuTemplate};