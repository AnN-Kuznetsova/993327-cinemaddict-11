const AUTHORIZATION = `Basic kdfJldf75Kbnfisdjk`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;


export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


export default class API {
  constructor() {
    if (new.target === API) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._endPoint = END_POINT;
    this._authorization = AUTHORIZATION;
  }


  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }


  _load({url, method = Method.GET, headers = new Headers(), body = null}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, headers, body})
      .then(this._checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
