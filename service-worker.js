self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("muzej-cache").then((cache) =>
      cache.addAll([
        "/Pomorski-muzej/",
        "/Pomorski-muzej/index.html",
        "/Pomorski-muzej/style.css",
        "/Pomorski-muzej/lokalne-enote/piranski-svetilnik/index.html",
        "/Pomorski-muzej/lokalne-enote/palaca-gabrieli/index.html",
        "/Pomorski-muzej/lokalne-enote/tartinijeva-hisa/index.html",
        "/Pomorski-muzej/muzeji-izven-pirana/monfort/soline/index.html",
        "/Pomorski-muzej/muzeji-izven-pirana/monfort/tonina-hisa/index.html",
        "/Pomorski-muzej/muzeji-izven-pirana/monfort/monfort/index.html",
        "/Pomorski-muzej/icon-muzej-192.png",
        "/Pomorski-muzej/icon-muzej-512.png"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
