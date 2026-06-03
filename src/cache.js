class TTLCache {
  constructor(storageKeyPrefix = 'UTKRUSHT_CACHE') {
    this.storageKeyPrefix = storageKeyPrefix;
    this.memoryCache = new Map();
  }

  buildStorageKey(key) {
    return `${this.storageKeyPrefix}:${key}`;
  }

  now() {
    return Date.now();
  }

  get(key) {
    const inMemory = this.memoryCache.get(key);
    if (inMemory && inMemory.expiresAt > this.now()) {
      return inMemory.value;
    }

    const persistedKey = this.buildStorageKey(key);
    try {
      const raw = localStorage.getItem(persistedKey);
      if (!raw) {
        return null;
      }
      const stored = JSON.parse(raw);
      if (stored.expiresAt && stored.expiresAt > this.now()) {
        this.memoryCache.set(key, stored);
        return stored.value;
      }
      localStorage.removeItem(persistedKey);
    } catch (e) {
      return null;
    }

    return null;
  }

  set(key, value, ttlMs) {
    const expiresAt = this.now() + ttlMs;
    const entry = { value, expiresAt };
    this.memoryCache.set(key, entry);
    const persistedKey = this.buildStorageKey(key);
    try {
      localStorage.setItem(persistedKey, JSON.stringify(entry));
    } catch (e) {
    }
  }
}

export const ttlCache = new TTLCache('UTKRUSHT_PAYMENTS');
export { TTLCache };
