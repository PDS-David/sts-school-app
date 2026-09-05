// Tiny pub/sub so the axios layer (client.ts) can tell AuthContext that the
// session is dead — e.g. the refresh token was revoked/expired — WITHOUT the
// two modules importing each other (avoids a circular import between
// client.ts and AuthContext.tsx, since AuthContext imports client.ts).
//
// Bug this fixes (found in QA Pass 1): client.ts's response interceptor
// already cleared AsyncStorage on a failed token refresh and had a comment
// saying "Navigation reset handled by AuthContext listener" — but no such
// listener existed. AuthContext's `user` state only ever changed via
// explicit login()/logout() calls, so a silently-expired session left the
// user "logged in" in memory: every subsequent request 401'd, the app
// looked broken, and there was no way back to the Login screen short of a
// full app restart.

type Listener = (message?: string) => void;
const listeners = new Set<Listener>();

export function onForcedLogout(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitForcedLogout(message?: string): void {
  for (const l of listeners) l(message);
}
