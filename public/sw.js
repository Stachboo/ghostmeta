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
  // Ignorer les requêtes non-GET et les extensions Chrome
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  // Ne pas intercepter les requêtes cross-origin (tuiles OSM, fonts, APIs tierces)
  // Laisser le navigateur les gérer directement pour éviter les blocages CSP
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache une copie fraîche pour les ressources statiques
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
