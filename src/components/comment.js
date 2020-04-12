import {formatDateWithSlash, formatTime} from "../utils.js";
import {EMOJI} from "../const.js";

const createEmojiListMarkup = (emojis) => {
  return (
    `<div class="film-details__emoji-list">
      ${Array.from(emojis)
          .map(([emojiTitle, emojiUrl]) => {
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
};

const createCommentMarkup = (comment) => {
  const {text, emoji, author, dayAndTime} = comment;
  const [emojiTitle, emojiUrl] = emoji;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emojiUrl}" width="55" height="55" alt="emoji-${emojiTitle}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatDateWithSlash(dayAndTime)} ${formatTime(dayAndTime)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsMarkup = (comments) => {
  return comments.slice().map((it) => createCommentMarkup(it)).join(`\n`);
};

const createCommentsTemplate = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${createCommentsMarkup(comments)}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        ${createEmojiListMarkup(EMOJI)}
      </div>
    </section>`
  );
};


export {createCommentsTemplate};