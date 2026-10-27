const CACHE_PREFIX = "abitingPokedexDetail:v1:";
const memoryCache = new Map<string, unknown>();

function storageKey(key: string) {
  return `${CACHE_PREFIX}${key}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Keeps detail-page responses for the current browser tab. The in-memory layer
 * makes same-tab navigation immediate; sessionStorage restores the same data
 * after a refresh without persisting it beyond the browsing session.
 */
export function readPokemonDetailCache<T>(key: string): T | null {
  const cacheKey = storageKey(key);
  const fromMemory = memoryCache.get(cacheKey);
  if (fromMemory !== undefined) return fromMemory as T;

  if (typeof window === "undefined") return null;

  try {
    const serialized = window.sessionStorage.getItem(cacheKey);
    if (!serialized) return null;

    const parsed: unknown = JSON.parse(serialized);
    if (!isRecord(parsed)) {
      window.sessionStorage.removeItem(cacheKey);
      return null;
    }

    memoryCache.set(cacheKey, parsed);
    return parsed as T;
  } catch {
    return null;
  }
}

export function writePokemonDetailCache<T>(key: string, value: T) {
  const cacheKey = storageKey(key);
  memoryCache.set(cacheKey, value);

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {
    // The page remains fully functional if browser storage is unavailable or full.
  }
}
