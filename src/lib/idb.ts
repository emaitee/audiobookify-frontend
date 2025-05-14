import { Book, Episode } from '@/app/[locale]/page-old';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface FilterOptions {
  genres: string[]
  narrators: string[]
  dateFilters: Array<{
    value: string
    label: string
  }>
  sortOptions: Array<{
    value: string
    label: string
  }>
  defaults: {
    genre: string
    narrator: string
    dateFilter: string
    sortOrder: string
  }
}

interface AudiobookDB extends DBSchema {
  books: {
    key: string; // book._id
    value: Book;
    indexes: { 'by-title': string };
  };
  episodes: {
    key: string; // episode._id
    value: Episode& {
      bookId: string;
      offlineAudio?: Blob;
      availableOffline: boolean;
    };
    indexes: { 'by-bookId': string };
  };
  listeningSessions: {
    key: number; // timestamp
    value: {
      audiobookId: string;
      episodeId?: string;
      duration: number;
      completionRate: number;
      synced: boolean;
      timestamp: number;
    };
  };
  progress: {
    key: string; // `${bookId}-${episodeId || 'single'}`
    value: {
      bookId: string;
      episodeId?: string;
      progress: number; // in seconds
      updatedAt: number;
    };
  };
  offlineQueue: {
    key: number;
    value: {
      action: 'updateListenHistory' | 'recordPlaybackSession';
      payload: any;
      timestamp: number;
    };
  };
  explorePageCache: {
    key: number; // single record
    value: {
      newReleases: Book[];
      featuredBooks: Book[];
      continueListening: Book[];
      timestamp: number;
    };
  };
  audiobookLists: {
    key: string; // `${collectionType}-${page}-${searchQuery}-${selectedGenre}-${selectedNarrator}-${selectedDateFilter}`
    value: {
      books: Book[];
      total: number;
      timestamp: number;
    };
  };
  filterOptions: {
    key: string; // We'll use a fixed key 'filterOptions'
    value: FilterOptions;
  };
}

let dbPromise: Promise<IDBPDatabase<AudiobookDB>> | null;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<AudiobookDB>('audiobook-player', 7, {
      upgrade(db, oldVersion) {
        console.log(`Upgrading database from version ${oldVersion} to 6`);
        console.log('Existing object stores:', db.objectStoreNames);

        // Initial setup for version 1
        if (oldVersion < 1) {
          const booksStore = db.createObjectStore('books', {
            keyPath: '_id'
          });
          booksStore.createIndex('by-title', 'title');

          const episodesStore = db.createObjectStore('episodes', {
            keyPath: '_id'
          });
          episodesStore.createIndex('by-bookId', 'bookId');

          db.createObjectStore('listeningSessions', {
            keyPath: 'timestamp'
          });

          db.createObjectStore('progress', {
            keyPath: ['bookId', 'episodeId']
          });
        }

        // Migration for version 2
        if (oldVersion < 2) {
          db.createObjectStore('offlineQueue', {
            keyPath: 'timestamp'
          });
        }

        // 3
        // Add explorePageCache store if it doesn't exist
        if (!db.objectStoreNames.contains('explorePageCache')) {
            db.createObjectStore('explorePageCache', { keyPath: 'id', autoIncrement: true });
          }

        // Version 6 - Add filterOptions store
        if (oldVersion < 6) {
          db.createObjectStore('filterOptions');
        }

         // Version 5 - Add audiobookLists store
        if (oldVersion < 7) {
          db.createObjectStore('audiobookLists');
        }
      },
    }).then(db => {
      console.log('Database initialized with stores:', db.objectStoreNames);
      return db;
    });
  }
  return dbPromise;
};

// Book operations
export const idb = {
  // Initialize database connection
  async ready() {
    return initDB();
  },

  // Book operations
  async cacheBooks(books: Book[]) {
    const db = await initDB();
    const tx = db.transaction('books', 'readwrite');
    await Promise.all([
      ...books.map(book => tx.store.put(book)),
      tx.done
    ]);
  },

  async getBook(id: string): Promise<Book | undefined> {
    const db = await initDB();
    return db.get('books', id);
  },

  async getAllBooks(): Promise<Book[]> {
    const db = await initDB();
    return db.getAll('books');
  },

  // Episode operations
  async cacheEpisode(bookId: string, episode: Episode) {
    const db = await initDB();
    await db.put('episodes', {
      ...episode,
      bookId,
      availableOffline: false
    });
  },

  async cacheEpisodes(bookId: string, episodes: Episode[]) {
    const db = await initDB();
    const tx = db.transaction('episodes', 'readwrite');
    await Promise.all([
      ...episodes.map(episode => tx.store.put({
        ...episode,
        bookId,
        availableOffline: false
      })),
      tx.done
    ]);
  },

  async getEpisode(id: string): Promise<Episode | undefined> {
    const db = await initDB();
    const episode = await db.get('episodes', id);
    if (!episode) return undefined;
    const { offlineAudio, ...rest } = episode;
    return rest;
  },

  async getEpisodesByBook(bookId: string): Promise<Episode[]> {
    const db = await initDB();
    return db.getAllFromIndex('episodes', 'by-bookId', bookId);
  },

  // Offline audio management
  async saveAudioForOffline(episodeId: string, audioBlob: Blob) {
    const db = await initDB();
    const episode = await db.get('episodes', episodeId);
    if (!episode) throw new Error('Episode not found');
    
    await db.put('episodes', {
      ...episode,
      offlineAudio: audioBlob,
      availableOffline: true
    }, '1');
  },

  async getOfflineAudioUrl(episodeId: string): Promise<string> {
    const db = await initDB();
    const episode = await db.get('episodes', episodeId);
    if (!episode?.offlineAudio) throw new Error('Audio not available offline');
    
    return URL.createObjectURL(episode.offlineAudio);
  },

  async isEpisodeAvailableOffline(episodeId: string): Promise<boolean> {
    const db = await initDB();
    const episode = await db.get('episodes', episodeId);
    return !!episode?.availableOffline;
  },

  async getOfflineEpisodes(): Promise<Episode[]> {
    const db = await initDB();
    const allEpisodes = await db.getAll('episodes');
    return allEpisodes
      .filter(ep => ep.availableOffline)
      .map(({ offlineAudio, ...rest }) => rest);
  },

  async deleteOfflineEpisode(episodeId: string) {
    const db = await initDB();
    const episode = await db.get('episodes', episodeId);
    if (!episode) return;
    
    await db.put('episodes', {
      ...episode,
      offlineAudio: undefined,
      availableOffline: false
    }, '1');
  },

  // Progress tracking
  async updateListenHistory(bookId: string, progress: number, episodeId?: string) {
    const db = await initDB();
    const key = episodeId ? `${bookId}-${episodeId}` : `${bookId}-single`;
    await db.put('progress', {
      bookId,
      episodeId,
      progress,
      updatedAt: Date.now()
    }, '1');
  },

  async getListenProgress(bookId: string, episodeId?: string) {
    const db = await initDB();
    const key = episodeId ? `${bookId}-${episodeId}` : `${bookId}-single`;
    return db.get('progress', key);
  },

  // Listening sessions
  async recordPlaybackSession(session: {
    audiobookId: string;
    episodeId?: string;
    duration: number;
    completionRate: number;
  }) {
    const db = await initDB();
    await db.put('listeningSessions', {
      ...session,
      timestamp: Date.now(),
      synced: false
    }, 1);
  },

  async getUnsyncedListeningSessions() {
    const db = await initDB();
    return db.getAll('listeningSessions').then(sessions => 
      sessions.filter(s => !s.synced)
    );
  },

  async markSessionsAsSynced(timestamps: number[]) {
    const db = await initDB();
    const tx = db.transaction('listeningSessions', 'readwrite');
    
    for (const timestamp of timestamps) {
      const session = await tx.store.get(timestamp);
      if (session) {
        await tx.store.put({
          ...session,
          synced: true
        });
      }
    }
    
    await tx.done;
  },

  // Offline queue
  async addToOfflineQueue(item: {
    action: 'updateListenHistory' | 'recordPlaybackSession';
    payload: any;
  }) {
    const db = await initDB();
    await db.add('offlineQueue', {
      ...item,
      timestamp: Date.now()
    });
  },

  async getOfflineQueue() {
    const db = await initDB();
    return db.getAll('offlineQueue');
  },

  async clearOfflineQueueItems(timestamps: number[]) {
    const db = await initDB();
    const tx = db.transaction('offlineQueue', 'readwrite');
    
    for (const timestamp of timestamps) {
      await tx.store.delete(timestamp);
    }
    
    await tx.done;
  },

  // Storage management
  async getStorageUsage() {
    if (!navigator.storage) return null;
    
    const estimate = await navigator.storage.estimate();
    return {
      quota: estimate.quota,
      usage: estimate.usage,
      percentage: estimate.quota ? (estimate.usage ?? 0 / estimate.quota) * 100 : 0
    };
  },

  async clearAllData() {
    const db = await initDB();
    await Promise.all([
      db.clear('books'),
      db.clear('episodes'),
      db.clear('listeningSessions'),
      db.clear('progress'),
      db.clear('offlineQueue')
    ]);
  },

  async cacheExplorePageData(data: {
    newReleases: Book[];
    featuredBooks: Book[];
    continueListening: Book[];
  }) {
    const key =3;
    const db = await initDB();
    await db.put('explorePageCache', {
      ...data,
      timestamp: Date.now()
    }, 3);
  },
  
  async getExplorePageData() {
    console.log('Accessing explorePageCache...');
  const db = await initDB();
  console.log('Database opened, object stores:', db.objectStoreNames);
    try {
      // Use transaction to properly handle errors
      return await db.transaction('explorePageCache').objectStore('explorePageCache').get(1);
    } catch (error) {
      console.error('Error accessing explorePageCache:', error);
      return null;
    }
  },
  
  async clearExplorePageCache() {
    const db = await initDB();
    await db.delete('explorePageCache', 1);
  },

  async cacheAudiobookList(key: string, data: { books: Book[]; total: number }): Promise<void> {
  try {
    const db = await initDB();
    
    // Check if store exists (for backward compatibility)
    if (!db.objectStoreNames.contains('audiobookLists')) {
      console.warn('audiobookLists store not available');
      return;
    }

    const tx = db.transaction('audiobookLists', 'readwrite');
    await tx.store.put({
      ...data,
      timestamp: Date.now()
    }, key);
    await tx.done;
  } catch (error) {
    console.error('Error caching audiobook list:', error);
    throw error;
  }
},

  async getCachedAudiobookList(key: string): Promise<{ books: Book[]; total: number } | null> {
  try {
    const db = await initDB();
    
    // Check if store exists (for backward compatibility)
    if (!db.objectStoreNames.contains('audiobookLists')) {
      return null;
    }

    const tx = db.transaction('audiobookLists', 'readonly');
    const result = await tx.store.get(key);
    await tx.done;
    return result || null;
  } catch (error) {
    console.error('Error accessing audiobookLists:', error);
    return null;
  }
},

  async cacheFilterOptions(options: {
    genres: string[];
    narrators: string[];
  }) {
    try {
      const db = await initDB();
      const tx = db.transaction('filterOptions', 'readwrite');
      await tx.store.put({
        ...options,
        dateFilters: [],
        sortOptions: [],
        defaults: {
          genre: 'all',
          narrator: 'all',
          dateFilter: 'any',
          sortOrder: 'newest'
        },
        // lastUpdated: new Date().toISOString(),
        // timestamp: Date.now()
      }, 'filterOptions');
      await tx.done;
    } catch (error) {
      console.error('Error caching filter options:', error);
      throw error;
    }
  },

  async getCachedFilterOptions() {
    try {
      const db = await initDB();
      const tx = db.transaction('filterOptions', 'readonly');
      const result = await tx.store.get('filterOptions');
      await tx.done;
      return result || null;
    } catch (error) {
      console.error('Error getting cached filter options:', error);
      return null;
    }
  },
  async resetDatabase() {
    if (dbPromise) {
      const db = await dbPromise;
      db.close();
    }
    indexedDB.deleteDatabase('audiobook-player');
    dbPromise = null;
    return initDB();
  },
  async getFilterOptions(): Promise<FilterOptions | null> {
  const db = await initDB();
  
  try {
    // Start a read-only transaction
    const tx = db.transaction('filterOptions', 'readonly');
    const store = tx.objectStore('filterOptions');
    
    // Get the single record with key 'filterOptions'
    const result = await store.get('filterOptions');
    
    // Wait for transaction to complete
    await tx.done;
    
    return result || null;
  } catch (error) {
    console.error('Error reading filter options from IndexedDB:', error);
    
    // Fallback to default options if the store doesn't exist yet
    if ((error as { name: string }).name === 'NotFoundError') {
      return {
        genres: [],
        narrators: [],
        dateFilters: [],
        sortOptions: [],
        defaults: {
          genre: 'all',
          narrator: 'all',
          dateFilter: 'any',
          sortOrder: 'newest'
        },
        // lastUpdated: new Date(0).toISOString() // Epoch time as default
      };
    }
    
    return null;
  }
}
};

export default idb;