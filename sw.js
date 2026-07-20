/* ==========================================================================
   EnergyX 369 — Enterprise AI OS: Production Service Worker (sw.js)
   Bypassing External Origins (Fixing YouTube Embed Error 153)
   ========================================================================== */

const CACHE_NAME = 'energyx-cache-v6.6'; // Versi dinaikkan agar browser mereset cache eror kemarin

// Daftar aset lokal utama yang wajib disimpan offline
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'styles.css',
  'assets/favicon.ico',
  'assets/EnrgyX-logo.png',
  'assets/videnergx.mp4'
];

// 1. EVENT INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan aset lokal ke dalam cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => {
      console.log('Gagal menyimpan beberapa aset awal:', err);
    })
  );
  self.skipWaiting();
});

// 2. EVENT FETCH (PERBAIKAN CORE UTAMA UNTUK YOUTUBE)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // KUNCI AMAN: Jika request berasal dari luar domain kita (seperti youtube.com), 
  // langsung lewatkan dan jangan diganggu gugat oleh service worker!
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        console.log('Aset tidak ter-cache saat offline.');
      });
    })
  );
});

// 3. EVENT ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache versi lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});