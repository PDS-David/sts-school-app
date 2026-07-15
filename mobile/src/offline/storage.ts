import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Per-user namespace ──────────────────────────────────────────────────────
// The cache and outbox below are prefixed with whichever user is currently
// signed in. Without this, two different people sharing one device — e.g. a
// staffroom tablet used by more than one teacher, or a parent's phone their
// child also logs into — would see each other's cached report cards,
// messages, and student lists offline (cache keyed only by URL, same URL,
// different data per person), and a write queued offline by one person could
// get replayed under someone else's session/token if they logged in before
// the first person's device reconnected. AuthContext calls setCacheNamespace
// on login, on restoring a saved session, and on logout.
let namespace = 'anon';

export function setCacheNamespace(userId: string | null): void {
  namespace = userId ?? 'anon';
}

// ── GET response cache ────────────────────────────────────────────────────────
// Every successful GET response is cached here, keyed by request URL (and the
// signed-in user), so that screens can keep showing data (materials,
// questions, messages, students…) even with no network connection.

const CACHE_PREFIX = 'offline_cache:';
const cacheKey = (url: string) => `${CACHE_PREFIX}${namespace}:${url}`;

// Caps how many distinct GET responses are kept per user, evicting the
// least-recently-fetched ones first. Without a cap, a device used every
// school day for months would keep accumulating cache entries forever and
// could eventually hit the device's AsyncStorage quota — at which point
// `cacheSet` above starts silently failing (it never throws, by design) and
// offline coverage quietly gets worse with no signal to anyone. 500 distinct
// endpoint+query combinations is generous headroom for how many screens this
// app actually has.
const MAX_CACHE_ENTRIES = 500;
const MANIFEST_PREFIX = 'offline_cache_manifest:';
const manifestKey = () => `${MANIFEST_PREFIX}${namespace}`;

async function touchManifest(url: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(manifestKey());
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = list.filter((u) => u !== url);
    next.push(url); // most-recently-fetched goes last
    while (next.length > MAX_CACHE_ENTRIES) {
      const evictUrl = next.shift();
      if (evictUrl) await AsyncStorage.removeItem(cacheKey(evictUrl));
    }
    await AsyncStorage.setItem(manifestKey(), JSON.stringify(next));
  } catch {
    // best-effort — the cache entry itself is already saved either way
  }
}

export async function cacheSet(url: string, data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(
      cacheKey(url),
      JSON.stringify({ data, cachedAt: Date.now() }),
    );
    await touchManifest(url);
  } catch {
    // Storage full or unavailable — caching is best-effort, never throw.
  }
}

export async function cacheGet(url: string): Promise<{ data: unknown; cachedAt: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(url));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Outbox: queued writes made while offline ──────────────────────────────────
// Each entry is a request that couldn't reach the server. They're replayed,
// in order, the next time connectivity is confirmed.

export interface QueuedRequest {
  id: string;
  method: 'post' | 'put' | 'patch' | 'delete';
  url: string;
  data?: any;
  createdAt: number;
}

const OUTBOX_PREFIX = 'offline_outbox:';
const outboxKey = () => `${OUTBOX_PREFIX}${namespace}`;

export async function getOutbox(): Promise<QueuedRequest[]> {
  try {
    const raw = await AsyncStorage.getItem(outboxKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function setOutbox(list: QueuedRequest[]): Promise<void> {
  try {
    await AsyncStorage.setItem(outboxKey(), JSON.stringify(list));
  } catch {
    // best-effort
  }
}

export async function enqueueRequest(
  req: Omit<QueuedRequest, 'id' | 'createdAt'>,
): Promise<QueuedRequest> {
  const queued: QueuedRequest = {
    ...req,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };
  const list = await getOutbox();
  list.push(queued);
  await setOutbox(list);
  return queued;
}

export async function removeFromOutbox(id: string): Promise<void> {
  const list = await getOutbox();
  await setOutbox(list.filter((q) => q.id !== id));
}

export async function outboxCount(): Promise<number> {
  return (await getOutbox()).length;
}

export { setOutbox };
