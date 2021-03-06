import AbstractComponent from "./abstract-component.js";


export default class FilmDetails extends AbstractComponent {

  getTemplate() {
    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container"></div>

          <div class="form-details__bottom-container"></div>
        </form>
      </section>`
    );
  }
}
