import FilmModel from "./models/film-model.js";
import CommentModel from "./models/comment-model.js";


const AUTHORIZATION = `Basic dBK351hdk=dfMNf0fjk6`;


export default class API {
  constructor() {
    this._authorization = AUTHORIZATION;
  }


  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }


  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then(this._checkStatus)
      .then((responce) => responce.json())
      .then(FilmModel.parseFilms);
  }

  updateFilm(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers,
    })
      .then(this._checkStatus)
      .then((response) => response.json())
      .then(FilmModel.parseFilm);
  }


  getComments(filmId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${filmId}`, {headers})
      .then(this._checkStatus)
      .then((responce) => responce.json())
      .then(CommentModel.parseComments);
  }
}
