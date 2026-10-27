/**
 * CARAVANE POUR CHRIST — Service Worker
 * Gère le mode hors ligne (PWA), la mise en cache et surtout
 * la réception des notifications push du verset biblique du jour,
 * même lorsque l'application n'est pas ouverte !
 */

const CACHE_NAME = 'caravane-pour-christ-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// Installation du Service Worker et mise en cache initiale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache : Network First avec fallback sur le cache pour la navigation
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET ou externes si nécessaire
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Mettre en cache dynamique les ressources GET réussies
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // En cas d'échec réseau (mode hors ligne), chercher dans le cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si c'est une requête de navigation HTML, renvoyer la racine en cache
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Hors connexion - Caravane Pour Christ', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// =========================================================================
// NOTIFICATIONS PUSH EN ARRIÈRE-PLAN (MÊME QUAND L'APPLICATION EST FERMÉE)
// =========================================================================

self.addEventListener('push', (event) => {
  console.log('[SW] Événement Push reçu en arrière-plan:', event);

  let data = {
    title: 'Caravane Pour Christ — Verset du jour',
    body: '« Confie-toi en l\'Éternel de tout ton cœur, et ne t\'appuie pas sur ta sagesse. » — Proverbes 3:5',
    icon: '/logo.jpg',
    badge: '/pwa-192x192.png',
    data: {
      url: '/',
      dayNumber: 1,
      source: 'web-push'
    }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/logo.jpg',
    badge: data.badge || '/pwa-192x192.png',
    image: data.image,
    vibrate: [200, 100, 200, 100, 200],
    tag: 'daily-bible-verse',
    renotify: true,
    requireInteraction: true,
    data: data.data || { url: '/' },
    actions: [
      { action: 'read', title: '📖 Méditer le verset' },
      { action: 'pray', title: '🙏 Prier maintenant' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clic sur la notification:', event.action, event.notification);
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si une fenêtre est déjà ouverte, lui donner le focus
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if (event.action === 'pray') {
            client.postMessage({ type: 'OPEN_PRAYER_ACTION', dayNumber: event.notification.data?.dayNumber });
          }
          return client.focus();
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre vers l'application
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Support de la synchronisation périodique en arrière-plan (Periodic Background Sync API)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-verse-sync') {
    console.log('[SW] Synchronisation périodique du verset du jour déclenchée');
    event.waitUntil(showDailyVerseNotification());
  }
});

// Écoute de messages venant de l'application (ex: test direct en arrière-plan)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_TEST_NOTIFICATION') {
    const verse = event.data.verse || '« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »';
    const ref = event.data.reference || 'Psaume 119:105';
    const day = event.data.dayNumber || 1;

    self.registration.showNotification('Caravane Pour Christ — Verset du jour', {
      body: `${verse} — ${ref}`,
      icon: '/logo.jpg',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      tag: 'test-daily-verse',
      renotify: true,
      data: { url: `/?day=${day}`, dayNumber: day },
      actions: [
        { action: 'read', title: '📖 Méditer le verset' },
        { action: 'pray', title: '🙏 Prier maintenant' }
      ]
    });
  }
});

async function showDailyVerseNotification() {
  return self.registration.showNotification('Caravane Pour Christ — Méditation du jour', {
    body: 'Prenez 5 minutes pour vous rapprocher de Dieu aujourd\'hui dans votre parcours 365 jours.',
    icon: '/logo.jpg',
    badge: '/pwa-192x192.png',
    data: { url: '/' },
    actions: [
      { action: 'read', title: 'Lire la méditation' }
    ]
  });
}
