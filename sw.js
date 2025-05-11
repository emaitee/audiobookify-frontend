// Claim clients to keep audio alive in background
// self.addEventListener('activate', (event) => {
//     event.waitUntil(self.clients.claim());
//   });


  // Cache selected audiobooks when user clicks "Download"
self.addEventListener('message', (event) => {
    if (event.data.action === 'cache-audiobook') {
      const { bookId, chapters } = event.data;
      event.waitUntil(
        caches.open(`audiobook-${bookId}`).then((cache) => {
          return cache.addAll(chapters.map(ch => `/audio/${ch.id}.mp3`));
        })
      );
    }
  });


  // Check network status
window.addEventListener('offline', () => {
    showToast("You're offline. Playing cached content.");
  });
  
  // Attempt to fetch from cache first
  async function playChapterOffline(chapterId) {
    const cache = await caches.open('audiobook-cache');
    const response = await cache.match(`/audio/${chapterId}.mp3`);
    if (response) {
      audio.src = URL.createObjectURL(await response.blob());
      audio.play();
    }
  }


const CACHE_PREFIX = 'audiobook-v1';
const MAX_CACHE_SIZE = 1024 * 1024 * 500; // 500MB per book

// Tiered caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 1. Audio files (Cache-First with offline fallback)
  if (url.pathname.startsWith('/api/audio/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request)
          .then((response) => {
            // Cache only if under size limit
            if (event.request.headers.get('range') === null) {
              const cacheCopy = response.clone();
              caches.open(CACHE_PREFIX).then((cache) => {
                cache.put(event.request, cacheCopy);
              });
            }
            return response;
          })
          .catch(() => offlineAudioFallback(url.pathname))
      })
      );
    } else if (url.pathname.startsWith('/api/metadata')) {
  // 2. Metadata (Network-First)
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_PREFIX+'-meta')
            .then((cache) => cache.put(event.request, networkResponse.clone()));
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

async function offlineAudioFallback(path) {
  // Try to return a lower bitrate cached version
  const cache = await caches.open(CACHE_PREFIX);
  const cachedResponse = await cache.match(path.replace('/opus/', '/mp3/'));
  return cachedResponse || new Response('', { status: 404 });
}

// Implement LRU cache eviction
async function maintainCache() {
  const cache = await caches.open(CACHE_PREFIX);
  const keys = await cache.keys();
  const usage = await getCacheUsage();
  
  if (usage > MAX_CACHE_SIZE) {
    const sorted = await Promise.all(keys.map(async (req) => {
      const resp = await cache.match(req);
      const lastUsed = resp.headers.get('last-used') || 0;
      return { req, lastUsed };
    }));
    
    sorted.sort((a, b) => a.lastUsed - b.lastUsed);
    
    for (let i = 0; i < Math.floor(keys.length * 0.2); i++) {
      await cache.delete(sorted[i].req);
    }
  }
}

// User-initiated cleanup
function clearOldListenings() {
  caches.keys().then((names) => {
    names.forEach((name) => {
      if (name.startsWith(CACHE_PREFIX)) {
        const bookId = name.split('-')[1];
        if (!isBookInLibrary(bookId)) {
          caches.delete(name);
        }
      }
    });
  });
}