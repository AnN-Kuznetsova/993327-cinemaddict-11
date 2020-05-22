const CACHE_PREFIX = `cinemaddict-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;


self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/main.css`,
            `/imges/background.png`,
            `/imges/bitmap.png`,
            `/imges/bitmap@2x.png`,
            `/imges/bitmap@3x.png`,
            `/imges/emoji/angry.png`,
            `/imges/emoji/puke.png`,
            `/imges/emoji/sleeping.png`,
            `/imges/emoji/smile.png`,
            `/imges/icons/icon-favorite.svg`,
            `/imges/icons/icon-favorite-active.svg`,
            `/imges/icons/icon-watched.svg`,
            `/imges/icons/icon-watched-active.svg`,
            `/imges/icons/icon-watchlist.svg`,
            `/imges/icons/icon-watchlist-active.svg`,
          ]);
        })
  );
});


self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});


self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== `basic`) {
                return response;
              }

              const clonedResponse = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
});
