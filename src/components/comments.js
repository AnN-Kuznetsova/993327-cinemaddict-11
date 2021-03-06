import AbstractSmartComponent from "./abstract-smart-component.js";
import {Emoji} from "../const.js";
import {adjustElementErrorStyle} from "../utils/common.js";
import {createElement} from "../utils/render.js";
import {encode} from "he";


export default class Comments extends AbstractSmartComponent {
  constructor(commentsCount, renderComments) {
    super();

    this._commentsCount = commentsCount;
    this._renderComments = renderComments;

    this._newComment = {
      emojiTitle: null,
      emojiUrl: null,
      text: null,
    };

    this.setErrorStyle = this.setErrorStyle.bind(this);
    this._rerenderNewEmoji = this._rerenderNewEmoji.bind(this);

    this._subscribeOnEvents();
  }


  get newCommentElement() {
    return this.getElement().querySelector(`.film-details__new-comment`);
  }


  get newCommentFormElements() {
    return this.newCommentElement.querySelectorAll(`input, textarea`);
  }


  getData() {
    if (this._newComment.emojiUrl && this._newComment.emojiTitle && this._newComment.text && /\S/.test(this._newComment.text)) {
      return {
        text: this._newComment.text,
        emoji: {
          name: this._newComment.emojiTitle,
          url: this._newComment.emojiUrl,
        },
        dayAndTime: new Date(),
      };
    }

    return false;
  }


  setErrorStyle(value = true) {
    const commentInputElement = this.newCommentElement.querySelector(`.film-details__comment-input`);
    adjustElementErrorStyle(commentInputElement, value);
  }


  getTemplate() {
    const commentsCount = this._commentsCount;
    const emojiListMarkup = this._createEmojiListMarkup();

    const newCommentEmojiMarkup = this._createNewCommentEmojiMarkup(this._newComment);
    const newCommentText = this._newComment.text ? encode(this._newComment.text) : ``;

    return (
      `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

        <ul class="film-details__comments-list">

        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${newCommentEmojiMarkup}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
          </label>

          ${emojiListMarkup}
        </div>
      </section>`
    );
  }


  rerender(newCommentsCount = null) {
    if (newCommentsCount !== null) {
      this._commentsCount = newCommentsCount;
    }

    super.rerender();

    this._renderComments();
  }


  reset() {
    this._newComment = {
      emojiTitle: null,
      emojiUrl: null,
      text: null,
    };

    this.rerender();
  }


  recoveryListeners() {
    this._subscribeOnEvents();
  }


  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, (evt) => {
        this._newComment.emojiTitle = evt.target.value;
        this._newComment.emojiUrl = Emoji[this._newComment.emojiTitle].url;

        this._rerenderNewEmoji();
      });

    element.querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, (evt) => {
        this._newComment.text = evt.target.value;
      });
  }


  _rerenderNewEmoji() {
    const parent = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const oldEmoje = parent.querySelector(`img`);
    const newEmoji = createElement(this._createNewCommentEmojiMarkup(this._newComment));

    if (oldEmoje) {
      parent.replaceChild(newEmoji, oldEmoje);
    } else {
      parent.appendChild(newEmoji);
    }
  }


  _createNewCommentEmojiMarkup(newComment) {
    const {emojiTitle, emojiUrl} = newComment;

    return (emojiTitle && emojiUrl) ?
      `<img src="./images/emoji/${emojiUrl}" width="55" height="55" alt="emoji-${emojiTitle}">` :
      ``;
  }


  _createEmojiListMarkup() {
    return (
      `<div class="film-details__emoji-list">
        ${Object.values(Emoji)
            .map(({name: emojiTitle, url: emojiUrl}) => {
              return (
                `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiTitle}" value="${emojiTitle}">
                <label class="film-details__emoji-label" for="emoji-${emojiTitle}">
                  <img src="./images/emoji/${emojiUrl}" width="30" height="30" alt="emoji">
                </label>`
              );
            })
            .join(`\n`)}
      </div>`
    );
  }
}
