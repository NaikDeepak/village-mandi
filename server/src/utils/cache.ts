type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class SimpleCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = 60 * 60 * 1000; // 1 hour in ms

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, _ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const statsCache = new SimpleCache();
