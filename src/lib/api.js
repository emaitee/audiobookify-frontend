import {API_BASE_URL} from '../app/utils/api'
import { getAllAudiobooks } from './db';

export async function getAudiobooks() {
    if (navigator.onLine) {
      try {
        const response = await fetch(API_BASE_URL + '/api/books');
        const data = await response.json();
        
        // Save to IndexedDB
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        data.forEach(book => tx.store.put(book));
        await tx.done;
        
        return data;
      } catch (error) {
        // Fallback to cached data
        return getAllAudiobooks();
      }
    } else {
      return getAllAudiobooks();
    }
  }