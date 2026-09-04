/* Service worker — met l'application en cache pour un fonctionnement hors ligne.
   Changez VERSION à chaque modification d'index.html pour forcer la mise à jour. */

const VERSION = "kanji-n5-v2";
const FICHIERS = [
  "./",
  "./index.html",
  "./traces.js",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png",
  "./icone-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(c => c !== VERSION).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cache => {
      const reseau = fetch(e.request)
        .then(rep => {
          if (rep && rep.status === 200 && rep.type === "basic") {
            const copie = rep.clone();
            caches.open(VERSION).then(c => c.put(e.request, copie));
          }
          return rep;
        })
        .catch(() => cache);
      return cache || reseau;
    })
  );
});
