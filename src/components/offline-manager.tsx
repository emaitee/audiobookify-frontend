// components/offline-manager.tsx
'use client';

import { useEffect } from 'react';
import idb from '@/lib/idb';

type ServiceWorkerMessage = {
  data: {
    type: 'CACHE_AUDIO';
    episodeId: string;
    blob: Blob;
  }
}

export default function OfflineManager() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleCacheMessage = async (event: ServiceWorkerMessage) => {
    
      if (event.data.type === 'CACHE_AUDIO') {
        const { quota, usage } = await idb.getStorageUsage() || {};
        if (quota && ((usage || 0) + event.data.blob.size) > quota * 0.9) {
            navigator.serviceWorker.controller?.postMessage({
                type: 'STORAGE_LIMIT_REACHED',
                episodeId: event.data.episodeId
            });
            return;
        }
        try {
          await idb.saveAudioForOffline(event.data.episodeId, event.data.blob);
          console.log(`Audio cached for episode ${event.data.episodeId}`);
          
          // Optional: Notify UI of new offline content
          document.dispatchEvent(new CustomEvent('offlineContentUpdated', {
            detail: { episodeId: event.data.episodeId }
          }));
        } catch (error:{message:string}|any) {
          console.error('Failed to cache audio:', error);
          // Notify service worker of failure
            navigator.serviceWorker.controller?.postMessage({
                type: 'CACHE_AUDIO_FAILED',
                episodeId: event.data.episodeId,
                error: error.message
            });
        }
      }
    };

    // Add listener
    navigator.serviceWorker.addEventListener('message', handleCacheMessage);

    // Cleanup
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleCacheMessage);
    };
  }, []);

  return null; // This is a logic-only component
}