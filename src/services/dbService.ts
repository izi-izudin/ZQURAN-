/**
 * ZQuran IndexedDB Service
 * Manages persistent offline storage for Alarms, Schedules, Hijri Cache, and Event History.
 */

const DB_NAME = 'zquran_db_v1';
const DB_VERSION = 1;

export const STORES = {
  HIJRI_CALENDAR_CACHE: 'HIJRI_CALENDAR_CACHE',
  USER_ALARMS: 'USER_ALARMS',
  SCHEDULE_SNAPSHOT: 'SCHEDULE_SNAPSHOT',
  SCHEDULE_EVENTS: 'SCHEDULE_EVENTS',
  TRIGGER_HISTORY: 'TRIGGER_HISTORY',
  AUDIO_STATE: 'AUDIO_STATE',
  NOTIFICATION_STATE: 'NOTIFICATION_STATE',
  LAST_SYNC_STATE: 'LAST_SYNC_STATE',
} as const;

export type StoreName = keyof typeof STORES;

let dbPromise: Promise<IDBDatabase> | null = null;

export function openAppDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada lingkungan ini.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // HIJRI_CALENDAR_CACHE: key is id ("hijri|timezone|year|month")
      if (!db.objectStoreNames.contains(STORES.HIJRI_CALENDAR_CACHE)) {
        db.createObjectStore(STORES.HIJRI_CALENDAR_CACHE, { keyPath: 'id' });
      }

      // USER_ALARMS: key is id (uuid / string)
      if (!db.objectStoreNames.contains(STORES.USER_ALARMS)) {
        db.createObjectStore(STORES.USER_ALARMS, { keyPath: 'id' });
      }

      // SCHEDULE_SNAPSHOT: key is date or snapshot key
      if (!db.objectStoreNames.contains(STORES.SCHEDULE_SNAPSHOT)) {
        db.createObjectStore(STORES.SCHEDULE_SNAPSHOT, { keyPath: 'id' });
      }

      // SCHEDULE_EVENTS: key is eventId
      if (!db.objectStoreNames.contains(STORES.SCHEDULE_EVENTS)) {
        db.createObjectStore(STORES.SCHEDULE_EVENTS, { keyPath: 'id' });
      }

      // TRIGGER_HISTORY: key is eventId or generated trigger key
      if (!db.objectStoreNames.contains(STORES.TRIGGER_HISTORY)) {
        db.createObjectStore(STORES.TRIGGER_HISTORY, { keyPath: 'id' });
      }

      // AUDIO_STATE
      if (!db.objectStoreNames.contains(STORES.AUDIO_STATE)) {
        db.createObjectStore(STORES.AUDIO_STATE, { keyPath: 'id' });
      }

      // NOTIFICATION_STATE
      if (!db.objectStoreNames.contains(STORES.NOTIFICATION_STATE)) {
        db.createObjectStore(STORES.NOTIFICATION_STATE, { keyPath: 'id' });
      }

      // LAST_SYNC_STATE
      if (!db.objectStoreNames.contains(STORES.LAST_SYNC_STATE)) {
        db.createObjectStore(STORES.LAST_SYNC_STATE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.warn('Gagal membuka IndexedDB, fallback ke memory/localStorage:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function getFromStore<T>(storeName: StoreName, key: string): Promise<T | null> {
  try {
    const db = await openAppDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    // Graceful fallback to localStorage
    try {
      const fallbackKey = `idb_fallback_${storeName}_${key}`;
      const raw = localStorage.getItem(fallbackKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export async function putToStore<T extends { id: string }>(
  storeName: StoreName,
  value: T
): Promise<void> {
  try {
    const db = await openAppDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    // Fallback to localStorage
    try {
      const fallbackKey = `idb_fallback_${storeName}_${value.id}`;
      localStorage.setItem(fallbackKey, JSON.stringify(value));
    } catch {}
  }
}

export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  try {
    const db = await openAppDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    try {
      const prefix = `idb_fallback_${storeName}_`;
      const items: T[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          const raw = localStorage.getItem(k);
          if (raw) items.push(JSON.parse(raw));
        }
      }
      return items;
    } catch {
      return [];
    }
  }
}

export async function deleteFromStore(storeName: StoreName, key: string): Promise<void> {
  try {
    const db = await openAppDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    try {
      localStorage.removeItem(`idb_fallback_${storeName}_${key}`);
    } catch {}
  }
}
