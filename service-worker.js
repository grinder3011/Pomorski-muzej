const CACHE_NAME = "muzej-cache-v2"; // bump version when you change stuff

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const filesToCache = [
        "/Pomorski-muzej/",
        "/Pomorski-muzej/index.html",
        "/Pomorski-muzej/style.css",
        "/Pomorski-muzej/lokalne-enote/piranski-svetilnik/index.html",
        "/Pomorski-muzej/lokalne-enote/palaca-gabrieli/index.html",
        "/Pomorski-muzej/lokalne-enote/tartinijeva-hisa/index.html",
        "/Pomorski-muzej/muzeji-izven-pirana/monfort/index.html",
        "/Pomorski-muzej/muzeji-izven-pirana/soline/index.html",
        "/Pomorski-muzej/muzeji-izven-pirana/tonina-hisa/index.html",
        "/Pomorski-muzej/icon-muzej-192.png",
        "/Pomorski-muzej/icon-muzej-512.png"
      ];

      await Promise.allSettled(
        filesToCache.map(file =>
          cache.add(file).catch(err =>
            console.warn(`⚠️ Skipping missing file: ${file}`, err)
          )
        )
      );
    })()
  );

  // ⚡ Immediately activate the new service worker
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      // ⚡ Take control of all clients right away
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const requestUrl = new URL(e.request.url);

  // Special case for JSON: always try network first, fallback to cache
  if (requestUrl.pathname.endsWith(".json")) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Default: cache-first
    e.respondWith(
      caches.match(e.request).then(
        (response) => response || fetch(e.request)
      )
    );
  }
});
