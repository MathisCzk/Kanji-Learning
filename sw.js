/* Service worker.

   Stratégie : cache d'abord, revalidation en arrière-plan.
   Le lancement est instantané et fonctionne hors ligne, et l'application
   se met à jour toute seule dès qu'un fichier change sur le serveur.

   Comment : à chaque requête, la réponse du cache part immédiatement, mais
   la requête réseau continue en parallèle. Si l'ETag renvoyé par le serveur
   diffère de celui du fichier en cache, le cache est remplacé et la page
   est prévenue — elle se recharge alors d'elle-même.

   VERSION ne sert plus qu'à nommer le cache. Vous n'avez plus besoin de la
   changer à chaque modification : la changer force simplement un vidage
   complet, utile en cas de problème. */

const VERSION = "kanji-n5-v5";
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

/* Seuls ces fichiers déclenchent un rechargement quand ils changent :
   inutile de recharger la page parce qu'une icône a été retouchée. */
const SURVEILLES = /(^|\/)(index\.html|traces\.js)?$/;

const signature = r =>
  r.headers.get("etag") || r.headers.get("last-modified") || r.headers.get("content-length") || "";

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
  if (new URL(e.request.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const enCache = await cache.match(e.request);

    const reseau = fetch(e.request)
      .then(async rep => {
        if (rep && rep.ok && rep.type === "basic") {
          const change = enCache && signature(enCache) !== signature(rep);
          await cache.put(e.request, rep.clone());
          if (change && SURVEILLES.test(new URL(e.request.url).pathname)) await prevenir();
        }
        return rep;
      })
      .catch(() => enCache);

    e.waitUntil(reseau);            // garde le worker en vie le temps de la mise en cache
    return enCache || reseau;
  })());
});

async function prevenir() {
  const fenetres = await self.clients.matchAll({ type: "window" });
  fenetres.forEach(f => f.postMessage({ type: "maj" }));
}

/* Permet à la page de forcer l'activation immédiate si besoin. */
self.addEventListener("message", e => {
  if (e.data && e.data.type === "activer") self.skipWaiting();
});
