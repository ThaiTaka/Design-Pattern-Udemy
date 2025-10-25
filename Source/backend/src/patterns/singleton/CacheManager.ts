/**
 * SINGLETON PATTERN - Cache Manager
 * 
 * Purpose: Single Redis connection for caching throughout the application
 * Why: Redis connections are expensive. Having multiple connections wastes resources.
 * This provides a centralized cache interface with connection pooling.
 * 
 * Benefits:
 * - Single Redis connection pool
 * - Consistent caching interface
 * - Easy to switch cache implementations
 * - Automatic serialization/deserialization
 * 
 * Note: In production, you'd use actual Redis client (ioredis)
 * This is a mock implementation that uses in-memory Map for development
 */
class CacheManager {
  private static instance: CacheManager | null = null;
  private cache: Map<string, { value: any; expiry: number | null }>;
  private enabled: boolean;

  private constructor() {
    this.cache = new Map();
    this.enabled = process.env.CACHE_ENABLED !== 'false';
    
    if (this.enabled) {
      console.log('💾 Cache Manager initialized');
    }
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Set a value in cache with optional TTL (Time To Live)
   * @param key Cache key
   * @param value Value to cache (will be JSON stringified)
   * @param ttlSeconds Time to live in seconds (null = never expires)
   */
  public async set(key: string, value: any, ttlSeconds: number | null = 3600): Promise<void> {
    if (!this.enabled) return;

    const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or null if not found/expired
   */
  public async get<T = any>(key: string): Promise<T | null> {
    if (!this.enabled) return null;

    const item = this.cache.get(key);
    if (!item) return null;

    // Check expiry
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Delete a key from cache
   */
  public async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Delete all keys matching pattern
   * @param pattern Glob pattern (e.g., "courses:*")
   */
  public async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  public async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getStats(): { size: number; enabled: boolean } {
    return {
      size: this.cache.size,
      enabled: this.enabled,
    };
  }
}

export default CacheManager;
