const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/login.html",
  // "/no-autorizado.html",
  // Estilos
  "/public/styles/landing.css",
  "/public/styles/app.css",
  "/public/styles/main.css",
  // Scripts
  "/js/script.js",
  "/js/login.js",
  // Admin pages
  "/public/pages/adminPages/admin-panel.html",

  // Maestro pages
  "/public/pages/maestroPages/maestro-panel.html",

  // Alumno pages
    "/public/pages/alumnoPages/alumno-panel.html",



  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
