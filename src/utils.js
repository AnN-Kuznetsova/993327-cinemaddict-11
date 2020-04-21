const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const MonthFormat = {
  0: `January`,
  1: `February`,
  2: `March`,
  3: `April`,
  4: `May`,
  5: `June`,
  6: `July`,
  7: `August`,
  8: `September`,
  9: `October`,
  10: `November`,
  11: `December`,
};

const castDateFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castDateFormat(date.getHours() % 12);
  const minutes = castDateFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = MonthFormat[date.getMonth()];
  const day = castDateFormat(date.getDate());
  return `${day} ${month} ${year}`;
};

const formatDateWithSlash = (date) => {
  const year = date.getFullYear();
  const month = castDateFormat(date.getMonth() + 1);
  const day = castDateFormat(date.getDate());
  return `${year}/${month}/${day}`;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const getSortingFilms = (films, selectionParameter) => {
  return films.slice()
  .sort((left, right) => (right[selectionParameter] - left[selectionParameter]));
};

const onEscPress = (evt, action) => {
  const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
  if (isEscKey) {
    action();
  }
};


export {
  onEscPress,
  RenderPosition,
  render,
  createElement,
  formatDateToString,
  formatDateWithSlash,
  formatTime,
  getSortingFilms,
};
