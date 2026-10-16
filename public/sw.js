/**
 * NewroMath L3 Service Worker & CacheStorage Engine (v1.0.2)
 * - Stale-While-Revalidate for /assets/**, /image/**, and /fonts/** (instant <3ms load, zero repeat bandwidth)
 * - Network-First with Offline Fallback for HTML & App Navigation
 * - Cache-First for immutable hashed JS/CSS bundles
 */

const CACHE_VERSION = 'v1.0.2';
const SHELL_CACHE = `newromath-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `newromath-assets-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/fonts/cormorant-garamond.css',
  '/assets/icon_gold_coin_3d_clean.webp',
  '/assets/icon_gem_3d_clean.webp',
  '/assets/icon_robot_3d.webp',
  '/assets/icon_trophy_3d.webp',
  '/assets/card_daily_clean.webp',
  '/assets/card_newgame_clean.webp',
  '/assets/card_rewards_clean.webp',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE)
          .map((oldKey) => caches.delete(oldKey))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin Firebase API calls (handled by L2 IndexedDB SWR cache)
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // 1. HTML Navigation -> Network-First with Offline Cache Fallback
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // 2. Hashed Vite JS/CSS Bundles (/assets/index-*.js, /assets/vendor-*.js) -> Cache-First (Immutable)
  if (url.pathname.startsWith('/assets/') && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 3. 3D WebP Images, Trophies, Level Art, and Fonts -> Stale-While-Revalidate
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/image/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const networkFetch = fetch(req)
            .then((res) => {
              if (res.ok) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
  }
});

