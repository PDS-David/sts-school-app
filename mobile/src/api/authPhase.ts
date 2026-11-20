// Pure helpers for which top-level screen set the app shows, and for keeping
// the "PIN must be set" requirement alive across restarts. No React Native
// imports, so they are unit-testable. RootNavigator and AuthContext call these;
// they are the single place the ordering below is decided.

export type AuthPhase =
  | 'loading'
  | 'guest'
  | 'pin-setup'
  | 'change-pw'
  | 'security-q'
  | 'pending-review'
  | 'app';

export interface AuthPhaseInput {
  loading: boolean;
  user: { pending_admin_review?: boolean } | null;
  mustChangePw: boolean;
  mustSetSecurityQuestion: boolean;
  mustSetPin: boolean;
}

/**
 * Order matters and follows what the server will actually allow
 * (backend/src/middleware/auth.ts):
 *  - A pending account may only call /auth/me and /auth/logout, so it cannot
 *    set a PIN yet: it stays on the pending screen (Stage 3 owns that flow) and
 *    the PIN screen appears once approval clears.
 *  - Otherwise, while a PIN is required the server rejects every route except
 *    /auth/me, /auth/logout and /auth/pin, so the PIN screen must come before
 *    the forced password / security-question screens (which would only 403).
 *  - 'app' (dashboards and every protected feature) is reachable only when
 *    none of the above applies.
 */
export function resolveAuthPhase(i: AuthPhaseInput): AuthPhase {
  if (i.loading) return 'loading';
  if (!i.user) return 'guest';
  const pending = !!i.user.pending_admin_review;
  if (i.mustSetPin && !pending) return 'pin-setup';
  if (i.mustChangePw) return 'change-pw';
  if (i.mustSetSecurityQuestion) return 'security-q';
  if (pending) return 'pending-review';
  return 'app';
}

// ── Persisted requirement (a fail-closed HINT, never the authority) ──────────
//
// The server is authoritative. The hint exists only so that a user who is known
// to owe a PIN is still held on the setup screen after a restart when the server
// cannot be reached yet. It holds no credential: just the account id.

export const PIN_GATE_STORAGE_KEY = 'pin_setup_required';

export function serializePinGate(userId: string): string {
  return JSON.stringify({ userId, required: true });
}

/** Returns the account id the hint belongs to, or null for anything malformed. */
export function parsePinGate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (v && typeof v === 'object' && (v as any).required === true
      && typeof (v as any).userId === 'string' && (v as any).userId.trim()) {
      return (v as any).userId;
    }
  } catch { /* malformed → no hint */ }
  return null;
}

/** A hint counts only for the account it was written for (no cross-account bleed). */
export function pinGateHintFor(storedRaw: string | null | undefined, userId: string): boolean {
  return parsePinGate(storedRaw) === userId;
}

export type ServerPinState = { reachable: true; mustSetPin: boolean } | { reachable: false };

/**
 * Decide the requirement from the local hint and the server's answer.
 *  - Server reachable: the server wins in both directions (a stale hint is
 *    cleared; a missing hint cannot hide a requirement).
 *  - Server unreachable: keep holding the user if the hint says they owe a PIN.
 *    With no hint we cannot know; the server still refuses every protected call
 *    and a later 403 PIN_SETUP_REQUIRED re-engages the gate.
 */
export function mergePinRequirement(hint: boolean, server: ServerPinState): boolean {
  return server.reachable ? server.mustSetPin : hint;
}

export const PIN_SETUP_REQUIRED_CODE = 'PIN_SETUP_REQUIRED';

/** True for the server's "set your PIN first" refusal, so a stale client re-engages the gate. */
export function isPinSetupRequiredResponse(status: number | undefined, data: unknown): boolean {
  return status === 403 && (data as any)?.code === PIN_SETUP_REQUIRED_CODE;
}

/** Roles that sign in with a six-digit PIN (mirrors PIN_ROLES in the backend). */
export function isPinRole(role: unknown): boolean {
  return role === 'student' || role === 'parent' || role === 'teacher';
}

/**
 * Whether a student, parent or teacher owes a new six-digit PIN, from the
 * flags the server reports (login response or GET /auth/me). Either flag is
 * enough, independently of the other; only an explicit true counts, so a
 * permanent PIN holder (both false) is never gated. The server's own derived
 * `pin_setup_required` is honoured when present. Mirrors pinSetupOutstanding()
 * in backend/src/middleware/auth.ts. Never true for administrator roles.
 */
export function pinSetupRequiredFromFlags(
  role: unknown,
  data: { must_set_pin?: unknown; must_change_pw?: unknown; pin_setup_required?: unknown } | null | undefined,
): boolean {
  if (!isPinRole(role) || !data) return false;
  return data.pin_setup_required === true || data.must_set_pin === true || data.must_change_pw === true;
}

/**
 * Read the server's answer from a GET /auth/me response. A response served from
 * the offline cache (client.ts marks it `fromCache`) is NOT the server: treat it
 * as unreachable so stale cached state can never clear or set the requirement.
 * /auth/me is only called for PIN roles here, and it reports the flags truthfully.
 */
export function serverPinStateFromMe(res: { data?: any; fromCache?: boolean } | null | undefined): ServerPinState {
  if (!res || res.fromCache) return { reachable: false };
  const d = res.data;
  const answered = typeof d?.must_set_pin === 'boolean' || typeof d?.pin_setup_required === 'boolean';
  if (!answered) return { reachable: false };
  return {
    reachable: true,
    mustSetPin: d.pin_setup_required === true || d.must_set_pin === true || d.must_change_pw === true,
  };
}
