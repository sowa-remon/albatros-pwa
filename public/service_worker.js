const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/login.html",  // Solo cachear la página de login
  "/css/landing.css", // Otros recursos estáticos que se requieren para login
  "/css/app.css",
  "/css/main.css",
  "/js/script.js",
  "/js/login.js"
];

// Evento de instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('Error al almacenar en caché', error);
      });
    })
  );
});

// Evento de solicitud de red (fetch)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url); // Crear el objeto URL correctamente

  // ** No almacenar en caché las rutas protegidas **
  if (
    url.pathname.includes("/admin") ||
    url.pathname.includes("/maestro-inicio") ||
    url.pathname.includes("/panel-administracion") || 
    url.pathname.includes("/lista-anuncios")
  ) {
        // Hacer siempre la solicitud de red (no almacenar en caché)
        return event.respondWith(fetch(event.request).catch(() => {
          // Si el usuario está offline, devolver una página de "No hay conexión"
          return caches.match("/offline.html");  // Asegúrate de tener una página offline.html en el caché
        }));
  }

  // Solo manejar solicitudes GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Si la respuesta está en caché, devolverla
        return response;
      }

      // Si no está en caché, hacer una solicitud de red
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Verificar si la respuesta es válida
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clonar la respuesta y agregarla al caché si es válida
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((error) => {
        console.error("Error al hacer la solicitud de red", error);
      });

      return response || fetchPromise;
    })
  );
});
