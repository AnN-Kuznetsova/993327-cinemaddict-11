
import API from "./api.js";
import CommentModel from "../models/comment-model.js";
import FilmModel from "../models/film-model.js";
import {Method} from "./api.js";


export default class CommentsAPI extends API {

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then((response) => response.json())
      .then(CommentModel.parseComments);
  }


  createComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(comment.toRAW()),
    })
      .then((response) => response.json())
      .then((response) => {
        return {
          film: FilmModel.parseFilm(response.movie),
          comments: CommentModel.parseComments(response.comments),
        };
      });
  }


  deleteComment(id) {
    window.console.log(`comment data send`);
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }
}
