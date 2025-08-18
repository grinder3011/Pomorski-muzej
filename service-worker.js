self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("muzej-cache").then(async (cache) => {
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

      // Try adding each file individually and skip any that fail
      await Promise.allSettled(
        filesToCache.map(file =>
          cache.add(file).catch(err =>
            console.warn(`⚠️ Skipping missing file: ${file}`, err)
          )
        )
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
