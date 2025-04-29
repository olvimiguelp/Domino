const CACHE_NAME = 'domino-cache-v1';
const urlsToCache = [
  '/', // Página principal
  '/index.html', // Archivo HTML principal
  '/app.bundle.js', // Archivo JavaScript generado
  '/styles.css', // Archivo CSS
  '/assets/images/icon.png', // Icono
  '/assets/images/favicon.png', // Favicon
  // Agrega aquí otros recursos necesarios
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
