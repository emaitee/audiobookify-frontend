// import idb from "@/lib/idb";
// import { useEffect } from "react";

// export function OfflineProvider({ children }: { children: React.ReactNode }) {
//     useEffect(() => {
//         interface CacheMessageEvent extends MessageEvent {
//           data: {
//           type: 'CACHE_AUDIO';
//           episodeId: string;
//           blob: Blob;
//           };
//         }
    
//         const handleCacheMessage = (event: CacheMessageEvent) => {
//           if (event.data.type === 'CACHE_AUDIO') {
//           idb.saveAudioForOffline(event.data.episodeId, event.data.blob);
//           }
//         };
    
//         navigator.serviceWorker?.addEventListener('message', handleCacheMessage);
//         return () => {
//           navigator.serviceWorker?.removeEventListener('message', handleCacheMessage);
//         };
//       }, []);
    
//     return children;
//   }