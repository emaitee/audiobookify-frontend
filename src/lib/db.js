// lib/db.js
import { openDB } from 'idb';

const DB_NAME = 'audiobookDB';
const STORE_NAME = 'audiobooks';
const VERSION = 1;

async function initDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveAudiobook(data) {
  const db = await initDB();
  return db.put(STORE_NAME, data);
}

export async function getAudiobook(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function getAllAudiobooks() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}