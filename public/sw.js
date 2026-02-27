/**
 * GhostMeta Service Worker
 * Minimal SW requis par Chrome pour déclencher beforeinstallprompt.
 * Stratégie : Network First (fraîcheur des données prioritaire).
 */

const CACHE_NAME = 'ghostmeta-v1';

// Ressources à précacher au install
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network First — fallback cache si offline
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET, les extensions Chrome, et les API routes
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  if (new URL(event.request.url).pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache une copie fraîche pour les ressources statiques
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
