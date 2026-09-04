import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cacheGet, cacheSet, cacheInvalidatePrefix,
  enqueueRequest, getOutbox, removeFromOutbox,
  subscribeConnectivity, setCacheNamespace,
} from '../offline';

// A write to e.g. `/scores/bulk` should invalidate cached GETs under
// `/scores` (including `/scores/report/:id`, `/scores/session-report/:id`,
// etc.), not just an exact URL match — callers rarely GET the same URL they
// POST to. `/admin/...` routes are nested two levels deep with genuinely
// separate resources (`/admin/users` vs `/admin/finance/invoices`), so keep
// two segments there; everything else uses just the first segment. This
// over-invalidates slightly in places (clearing a bit more than strictly
// necessary) rather than under-invalidating and leaving stale data behind —
// the safer direction for a mistake here.
function resourcePrefix(url: string): string {
  const parts = url.split('?')[0].split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (parts[0] === 'admin' && parts.length > 1) return `/${parts[0]}/${parts[1]}`;
  return `/${parts[0]}`;
}
import { emitForcedLogout } from './authEvents';
import { getSecureItem, setSecureItem, deleteSecureItems, migrateLegacyTokens } from './secureTokenStorage';

// Kicked off once at module load (not awaited here) and awaited lazily by
// the request interceptor below, so the very first request — and every
// request after it — is guaranteed to see tokens already migrated into
// SecureStore, without delaying app startup itself. See secureTokenStorage.ts.
const tokenMigration = migrateLegacyTokens();

// ── API base URL ───────────────────────────────────────────────────────────────
// Read from app.json → expo.extra.apiUrl so this can be changed per build
// without touching source code (dev on an emulator vs a real deployed server).
//
// IMPORTANT — before giving this app to real teachers/parents/students:
//   1. Deploy the backend somewhere reachable over the internet (Render,
//      Railway, a VPS, etc.) with HTTPS.
//   2. Set expo.extra.apiUrl in mobile/app.json to that real URL
//      (e.g. "https://api.sowtheseedschools.ng"), NOT 10.0.2.2 — that address
//      only ever resolves to "this same computer" and only inside the Android
//      emulator. On a real phone it resolves to nothing and every request
//      will fail.
//   3. Rebuild the app (`eas build` or `expo run:android`) so the new value
//      is baked into the binary you actually install on phones.
const configuredUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;
export const BASE_URL = configuredUrl ?? 'http://10.0.2.2:4000';

if (__DEV__ && !configuredUrl) {
  console.warn(
    '[api/client] No expo.extra.apiUrl set in app.json — falling back to the ' +
    'Android emulator address (10.0.2.2). This will NOT work on a real device.',
  );
}

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use(async (config) => {
  await tokenMigration;
  const token = await getSecureItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// 1. On success: cache GET responses so they're available offline later.
// 2. On failure:
//    - 401 → existing token-refresh flow.
//    - Network-level failure (server never reached) on a GET → serve cached data.
//    - Network-level failure on a write (POST/PUT/PATCH/DELETE) → queue it in the
//      outbox and resolve as "queued" so the UI can carry on optimistically.
api.interceptors.response.use(
  async (res) => {
    const method = (res.config.method ?? 'get').toLowerCase();
    if (method === 'get') {
      await cacheSet(res.config.url ?? '', res.data);
    } else {
      // Real, server-confirmed write — safe to drop stale cached reads for
      // this resource area. (Queued-offline writes never reach this branch;
      // they resolve via the catch handler below instead, so nothing gets
      // invalidated until the write actually lands.)
      await cacheInvalidatePrefix(resourcePrefix(res.config.url ?? ''));
    }
    return res;
  },
  async (error) => {
    const original = error.config;
    const method = (original?.method ?? 'get').toLowerCase();

    // ── Existing auth-refresh flow (server reachable, just expired token) ──────
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await getSecureItem('refresh_token');
        if (!refresh) throw { __noRefreshToken: true };
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refresh });
        await setSecureItem('access_token', data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch (refreshErr: any) {
        // Only clear the session when the server actually rejected the
        // refresh token (expired/revoked, or there wasn't one to send) —
        // that's `refreshErr.response` present, or the synthetic
        // `__noRefreshToken` marker above. A network-level failure reaching
        // /auth/refresh itself (no `.response` at all — e.g. connectivity
        // dropped in the moment between the original 401 and this retry)
        // must NOT log the user out: the access token might still be
        // perfectly valid, and force-logging-out here would strand someone
        // who's been working offline from their own cached data for no
        // reason but a momentary signal blip, and would require them to
        // find a connection just to log back in and get where they already
        // were. In that case we just fail this one request and leave the
        // session alone — the next successful request refreshes normally.
        const serverRejected = refreshErr?.__noRefreshToken || !!refreshErr?.response;
        if (serverRejected) {
          await deleteSecureItems(['access_token', 'refresh_token']);
          await AsyncStorage.removeItem('user');
          setCacheNamespace(null);
          // Tell AuthContext the session is dead so it clears its in-memory
          // `user` state and RootNavigator swaps back to the Login screen.
          // (Previously this comment claimed a listener existed; it didn't —
          // see authEvents.ts for the fix and why it's needed.)
          emitForcedLogout();
        }
        return Promise.reject(error);
      }
    }

    // ── Offline handling: only kicks in when the request never reached the
    //    server at all (no response object = network-level failure). Real
    //    server errors (4xx/5xx) are left alone and rejected normally. ──────────
    const isNetworkFailure = !error.response;
    if (isNetworkFailure && original) {
      if (method === 'get') {
        const cached = await cacheGet(original.url ?? '');
        if (cached) {
          return { data: cached.data, status: 200, statusText: 'OK (cached)', headers: {}, config: original, fromCache: true };
        }
        return Promise.reject(error);
      }

      if (['post', 'put', 'patch', 'delete'].includes(method)) {
        // Brainee (AI) requests are excluded from the outbox on purpose:
        // queuing "explain this topic" or "grade this essay" for silent
        // replay whenever connectivity returns would show the student a
        // stale, out-of-context answer later with no way to know it wasn't
        // live. These should just fail immediately and honestly instead —
        // the caller shows "You're offline" and the person tries again.
        //
        // /auth/ requests are excluded for a different reason: they need a
        // live round trip by nature (login/refresh verify a credential
        // against the server; logout revokes a token there; change-password
        // checks the old password there). Queuing a login attempt offline
        // used to silently "succeed" with a synthetic `{queued:true}` body
        // that had none of the fields (access_token, user, must_change_pw)
        // the caller needed — corrupting the signed-in session with
        // `undefined`s — and a queued logout could later replay under
        // whichever *different* user happened to be signed in on the same
        // device by the time it flushed. These now fail immediately and
        // honestly too, same as AI requests.
        if ((original.url ?? '').startsWith('/ai/') || (original.url ?? '').startsWith('/auth/')) {
          return Promise.reject(error);
        }

        let parsedData: any = undefined;
        try { parsedData = typeof original.data === 'string' ? JSON.parse(original.data) : original.data; } catch { parsedData = original.data; }

        const queued = await enqueueRequest({ method: method as any, url: original.url ?? '', data: parsedData });

        // Best-effort synthetic response so calling screens don't have to special-case
        // every offline write. Messages get a realistic shape so they can render
        // immediately as "pending" instead of disappearing until sync.
        let body: any = { queued: true, queuedId: queued.id };
        if ((original.url ?? '').startsWith('/messages') && method === 'post') {
          body = {
            message: {
              id: `offline-${queued.id}`,
              sender_id: parsedData?.sender_id,
              recipient_id: parsedData?.recipient_id,
              body: parsedData?.body,
              context_type: parsedData?.context_type ?? 'general',
              context_id: parsedData?.context_id ?? null,
              created_at: new Date().toISOString(),
              is_read: false,
              pending: true,
            },
          };
        }
        return { data: body, status: 202, statusText: 'Queued (offline)', headers: {}, config: original, queuedOffline: true };
      }
    }

    return Promise.reject(error);
  },
);

// ── Outbox sync ────────────────────────────────────────────────────────────────
// Found live in QA Pass 10: both this module's own `subscribeConnectivity`
// listener below AND `OfflineBanner.tsx`'s listener call `flushOutbox()` on
// every reconnect event, with nothing to stop them running at the same time.
// Since the old implementation read the whole outbox into memory once up
// front, two concurrent calls both saw the same still-queued items and both
// dispatched them — for tables with a UNIQUE constraint (scores, attendance)
// the second copy just failed and was misreported as a dropped/invalid item,
// but for `messages` (no such constraint) this created a real duplicate row
// per queued message. Live-verified via a standalone repro against the real
// backend: one queued message → two concurrent `flushOutbox()` calls → two
// identical rows in `messages`. Fixed with an in-flight-promise guard so any
// number of concurrent callers (now, or any future caller added later)
// collapse into a single actual flush and all await the same result.
let inFlightFlush: Promise<{ synced: number; failed: number; remaining: number }> | null = null;

export function flushOutbox(): Promise<{ synced: number; failed: number; remaining: number }> {
  if (inFlightFlush) return inFlightFlush;

  inFlightFlush = (async () => {
    try {
      const queue = await getOutbox();
      let synced = 0;
      let failed = 0;
      for (const item of queue) {
        try {
          await api.request({ method: item.method, url: item.url, data: item.data });
          await removeFromOutbox(item.id);
          synced++;
        } catch (e: any) {
          const status = e?.response?.status;
          if (status && status >= 400 && status < 500) {
            // Permanently invalid request (bad data, forbidden, etc.) — drop it,
            // retrying won't help.
            await removeFromOutbox(item.id);
            failed++;
          }
          // Otherwise (network/server error) leave it queued for the next attempt.
        }
      }
      const remaining = (await getOutbox()).length;
      return { synced, failed, remaining };
    } finally {
      inFlightFlush = null;
    }
  })();

  return inFlightFlush;
}

// Auto-sync whenever connectivity comes back.
subscribeConnectivity((online) => {
  if (online) flushOutbox().catch(() => {});
});

export default api;
