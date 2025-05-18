// This is a simple service worker script for an audiobook web application.
// It caches essential files for offline access and handles fetch events to serve cached content when offline.
// It also includes a fallback mechanism to serve an offline page when the user is offline and tries to navigate to a new page.
// The service worker is registered in the main JavaScript file of the application.

import { API_BASE_URL } from "../src/app/utils/api";

  // public/sw.js
const CACHE_NAME = 'audiobook-cache-v1';
const API_CACHE_NAME = 'audiobook-api-v1';
const OFFLINE_URL = '/offline'; // Custom offline page
const PRECACHE_URLS = [
  OFFLINE_URL,
  '/',
  '/manifest.json',
  // Add other critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
  event.waitUntil(
    caches.open(API_CACHE_NAME)
      .then(cache => cache.addAll([
        '/books-info/new-releases',
        '/books-info/featured'
      ]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-audiobooks') {
    event.waitUntil(syncAudiobooks());
  }
});

async function syncAudiobooks() {
  // Implement your sync logic here
}

const AUDIO_CACHE = 'audio-cache-v1';

// self.addEventListener('fetch', (event) => {
//   if (event.request.url.includes('/api/books/') && 
//       event.request.method === 'GET') {
//     event.respondWith(
//       caches.open(AUDIO_CACHE).then(async (cache) => {
//         return cache.match(event.request).then((response) => {
//           return response || fetch(event.request).then((response) => {
//             cache.put(event.request, response.clone());
//             return response;
//           });
//         });
//       })
//     );
//   }
// });

self.addEventListener('fetch', (event) => {
  // API caching strategy
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/books-info/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async cache => {
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(async () => {
            // Return cached response when offline
            return cache.match(event.request)
                   .then(response => response || caches.match(OFFLINE_URL));
          });
      })
    );
  } else {
    // Static assets strategy
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'cache-book') {
    event.waitUntil(cacheBookForOffline(event.data));
  }
});

async function cacheBookForOffline({ bookId, quality }) {
  // Fetch book metadata
  const bookResponse = await fetch(API_BASE_URL + `/books/${bookId}`);
  const book = await bookResponse.json();
  
  // Cache each episode
  for (const episode of book.episodes) {
    const audioResponse = await fetch(getAudioUrl(episode, quality));
    const audioBlob = await audioResponse.blob();
    
    // Send to IndexedDB via postMessage
    clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'CACHE_AUDIO',
          episodeId: episode._id,
          blob: audioBlob
        });
      });
    });
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-explore-data') {
    event.waitUntil(syncExploreData());
  }
});

workbox.routing.registerRoute(
  '/books-info/filter-options',
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60 // 1 day
      })
    ]
  })
);



// push notification implementation

self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const title = data?.title || 'New update available';
  const options = {
    body: data?.body || 'Click to see what\'s new',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    data: data?.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        // Send message to all clients
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'NOTIFICATION',
              notification: data,
            });
          });
        });
      })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window/tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});