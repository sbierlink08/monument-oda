// Monument ODA service worker
// Strategy: cache-first for instant loads, then background-check the network on
// every navigation. If the network copy differs from the cached one, store the
// new version and tell every open page to show an "update available" banner.
// One tap on the banner = location.reload() and the user is on the new code.

const CACHE_VERSION = 'oda-v3'; // bumped 2026-04-29 for polling-based cloud-save verification fix (TODO #108)
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// --- install: prime the cache -----------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// --- activate: drop old cache versions --------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// --- fetch: serve cache, then check for an update in the background --------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Only handle same-origin requests; let third-party CDN calls pass through.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(req);

      // Background: fetch a fresh copy and compare.
      const networkPromise = fetch(req, { cache: 'no-cache' })
        .then(async (resp) => {
          if (!resp || !resp.ok) return resp;
          const respClone = resp.clone();
          const newText = await resp.clone().text().catch(() => null);
          const oldText = cached ? await cached.clone().text().catch(() => null) : null;
          await cache.put(req, respClone);
          if (newText !== null && oldText !== null && newText !== oldText) {
            // Notify every open page that a new version is in cache.
            const clients = await self.clients.matchAll({ includeUncontrolled: true });
            for (const c of clients) {
              c.postMessage({ type: 'ODA_UPDATE_READY', url: req.url });
            }
          }
          return resp;
        })
        .catch(() => null);

      // Cache-first: return cached immediately if present, else wait on network.
      return cached || networkPromise || fetch(req);
    })
  );
});

// Allow page to ask the SW to skip waiting on a manual reload.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
