type Store = Map<string, { timestamps: number[] }>;

const store: Store = new Map();

const DEFAULT_LIMIT = 100;
const DEFAULT_WINDOW_MS = 60 * 1000;

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs);

  const oldest = entry.timestamps[0] ?? now;
  const resetMs = windowMs - (now - oldest);

  if (entry.timestamps.length >= limit) {
    return { allowed: false, limit, remaining: 0, resetMs };
  }

  entry.timestamps.push(now);

  if (store.size > 10000) {
    for (const [k, e] of store) {
      if (e.timestamps.length === 0 || e.timestamps.every((t) => t <= now - windowMs)) {
        store.delete(k);
      }
    }
  }

  return { allowed: true, limit, remaining: limit - entry.timestamps.length, resetMs };
}
