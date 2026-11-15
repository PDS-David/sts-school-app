import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOutboxStore } from './outboxStore';

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

export function getCacheNamespace(): string {
  return namespace;
}

// ── GET response cache ────────────────────────────────────────────────────────
// Every successful GET response is cached here, keyed by request URL (and the
// signed-in user), so that screens can keep showing data (materials,
// questions, messages, students…) even with no network connection.

const CACHE_PREFIX = 'offline_cache:';
const cacheKey = (url: string, userNamespace = namespace) => `${CACHE_PREFIX}${userNamespace}:${url}`;

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
const manifestKey = (userNamespace = namespace) => `${MANIFEST_PREFIX}${userNamespace}`;

async function touchManifest(url: string, userNamespace: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(manifestKey(userNamespace));
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = list.filter((u) => u !== url);
    next.push(url); // most-recently-fetched goes last
    while (next.length > MAX_CACHE_ENTRIES) {
      const evictUrl = next.shift();
      if (evictUrl) await AsyncStorage.removeItem(cacheKey(evictUrl, userNamespace));
    }
    await AsyncStorage.setItem(manifestKey(userNamespace), JSON.stringify(next));
  } catch {
    // best-effort — the cache entry itself is already saved either way
  }
}

export async function cacheSet(url: string, data: unknown, userNamespace = namespace): Promise<void> {
  try {
    await AsyncStorage.setItem(
      cacheKey(url, userNamespace),
      JSON.stringify({ data, cachedAt: Date.now() }),
    );
    await touchManifest(url, userNamespace);
  } catch {
    // Storage full or unavailable — caching is best-effort, never throw.
  }
}

export async function cacheGet(url: string, userNamespace = namespace): Promise<{ data: unknown; cachedAt: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(url, userNamespace));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Drops every cached GET whose URL starts with `prefix` (for the current
// user). Called after a write actually reaches the server, so a screen that
// re-fetches right after (e.g. viewing a report right after entering a
// score) gets a live request instead of silently being served the
// pre-write cached copy — until now the cache had no invalidation at all
// and could only go stale on its own schedule (next unrelated fetch to the
// same URL), regardless of writes that had already changed that data.
export async function cacheInvalidatePrefix(prefix: string, userNamespace = namespace): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(manifestKey(userNamespace));
    const list: string[] = raw ? JSON.parse(raw) : [];
    const toDrop = list.filter((u) => u.split('?')[0].startsWith(prefix));
    if (toDrop.length === 0) return;
    await Promise.all(toDrop.map((u) => AsyncStorage.removeItem(cacheKey(u, userNamespace))));
    const remaining = list.filter((u) => !toDrop.includes(u));
    await AsyncStorage.setItem(manifestKey(userNamespace), JSON.stringify(remaining));
  } catch {
    // best-effort — a missed invalidation just means that one cached
    // screen stays stale until its own next fetch, same as before this fix
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

function isQueuedRequest(value: unknown): value is QueuedRequest {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && item.id.length > 0
    && ['post', 'put', 'patch', 'delete'].includes(item.method as string)
    && typeof item.url === 'string'
    && typeof item.createdAt === 'number';
}

const outbox = createOutboxStore<QueuedRequest>(
  AsyncStorage,
  () => namespace,
  'offline_outbox:',
  isQueuedRequest,
);

export function getOutbox(userNamespace?: string): Promise<QueuedRequest[]> {
  return outbox.getAll(userNamespace);
}

export function enqueueRequest(
  req: Omit<QueuedRequest, 'id' | 'createdAt'>,
  userNamespace?: string,
): Promise<QueuedRequest> {
  const queued: QueuedRequest = {
    ...req,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };
  return outbox.enqueue(queued, userNamespace);
}

export function removeFromOutbox(id: string, userNamespace?: string): Promise<void> {
  return outbox.remove(id, userNamespace);
}

export function outboxCount(userNamespace?: string): Promise<number> {
  return outbox.count(userNamespace);
}

