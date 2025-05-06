// Claim clients to keep audio alive in background
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });


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