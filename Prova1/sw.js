/* Micene 1250 a.C. — service worker */
const CORE = 'micene-core-v2';
const RUNTIME = 'micene-runtime-v2';
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './hero-reference.webp',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const OPTIONAL_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE);
    await cache.addAll(CORE_FILES);
    await Promise.allSettled(OPTIONAL_FILES.map(url => cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CORE && key !== RUNTIME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isCore = CORE_FILES.some(file => url.pathname.endsWith(file.replace('./', '/')))
    || url.pathname.endsWith('/index.html');

  if (isCore) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(RUNTIME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
