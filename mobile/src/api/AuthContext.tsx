import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { flushOutbox } from './client';
import { onForcedLogout, onPinSetupRequired } from './authEvents';
import { isRestorableUser } from './authSession';
import { setSecureItem, deleteSecureItems } from './secureTokenStorage';
import { setCacheNamespace, outboxCount, isOnline } from '../offline';
import { registerForPushNotifications, unregisterPushToken } from './pushRegistration';
import { getDeviceId } from './deviceId';
import type { CredentialMode } from './loginForm';
import {
  PIN_GATE_STORAGE_KEY, serializePinGate, pinGateHintFor, mergePinRequirement,
  isPinRole, serverPinStateFromMe, pinSetupRequiredFromFlags, type ServerPinState,
} from './authPhase';

export type Role = 'student' | 'parent' | 'teacher' | 'admin' | 'finance_admin';

export interface User {
  id: string;
  username: string;
  role: Role;
  school_code: string | null;
  // Added for the class-lock feature — which class (if any) this user is
  // the class teacher for. Only meaningful when role === 'teacher'.
  assigned_class?: string | null;
  assigned_subject_ids?: number[];
  assigned_class_names?: string[];
  // Set on accounts created via POST /auth/self-register (student/parent/
  // teacher choosing their own username+password directly, no admin-issued
  // code). Persists across app restarts as part of the stored user object
  // (unlike mustChangePw/mustSetSecurityQuestion below, which are always
  // fetched fresh from the server on login only) — an unapproved account
  // should keep showing the waiting screen every time it's opened, not just
  // immediately after login. Cleared server-side by
  // POST /admin/users/:id/approve; RootNavigator.tsx checks this directly
  // to gate into the pending-review phase.
  pending_admin_review?: boolean;
}

interface AuthState {
  user: User | null;
  // Both start false and are set fresh from the server on every login() —
  // see RootNavigator.tsx for why this must be state RootNavigator branches
  // on directly, rather than an imperative navigation.replace() call fired
  // right after login(). That used to race the very same-tick re-render
  // this state change causes (login() calling setUser() flips RootNavigator
  // from the unauthenticated screen set to the authenticated one) — losing
  // the race meant a forced password change was silently skipped entirely
  // and the temp/default password stayed valid indefinitely. Declarative
  // branching on state can't race itself.
  mustChangePw: boolean;
  mustSetSecurityQuestion: boolean;
  // True while a student/parent/teacher still owes their six-digit PIN. The
  // server is authoritative (login response, GET /auth/me, and a 403
  // PIN_SETUP_REQUIRED on any request); a small per-account hint in
  // AsyncStorage only keeps the gate closed across a restart when the server
  // cannot be reached yet. RootNavigator branches on this declaratively, so no
  // dashboard or protected screen exists in the tree while it is true.
  mustSetPin: boolean;
  loading: boolean;
  // `mode` decides only which request field carries the secret: 'pin' sends
  // `pin` (students/parents/teachers), 'password' sends `password` (admin and
  // finance admin keep their existing credentials). The server decides the role.
  login: (
    username: string,
    secret: string,
    opts?: { mode?: CredentialMode; rememberMe?: boolean; school_code?: string },
  ) => Promise<{ must_change_pw: boolean; must_set_security_question: boolean; must_set_pin: boolean }>;
  logout: () => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
  setSecurityQuestion: (question: string, answer: string) => Promise<void>;
  // See the comments on changePassword/setSecurityQuestion below for why
  // clearing the forced-flow flag is a separate, explicit step the calling
  // screen triggers on its own timing, not something those two functions
  // do automatically as part of succeeding.
  confirmPasswordChanged: () => void;
  confirmSecurityQuestionSet: () => void;
  // For PendingApprovalScreen.tsx's "Check Again" button — re-fetches the
  // fresh pending_admin_review value from GET /auth/me and updates the
  // stored user object (context + AsyncStorage) if it's changed, without
  // requiring a full log-out/log-in cycle. Returns the fresh value.
  refreshApprovalStatus: () => Promise<boolean>;
  // POST /auth/pin. Rejects with the axios error on any failure; the PIN is
  // sent once over TLS and is never logged or stored.
  submitPin: (currentCredential: string, newPin: string) => Promise<void>;
  // Re-reads GET /auth/me and updates the gate. Resolves true ONLY when the
  // server answered and says must_set_pin is false (never from cache).
  confirmPinSetup: () => Promise<boolean>;
}

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [mustChangePw, setMustChangePw] = useState(false);
  const [mustSetSecurityQuestion, setMustSetSecurityQuestion] = useState(false);
  const [mustSetPin, setMustSetPin] = useState(false);
  const [loading, setLoading] = useState(true);
  // Latest signed-in account for async callbacks, so a slow /auth/me answer for
  // a previous account can never be applied to whoever is signed in now.
  const userRef = useRef<User | null>(null);
  // Every change of the signed-in user goes through here so the ref and the
  // state can never disagree (an effect or render-time sync could briefly null
  // the ref mid-restore and make a valid server answer look stale).
  const setUser = (next: User | null) => { userRef.current = next; setUserState(next); };
  const pinCheckInFlight = useRef(false);

  const persistPinGate = async (userId: string, required: boolean) => {
    try {
      if (required) await AsyncStorage.setItem(PIN_GATE_STORAGE_KEY, serializePinGate(userId));
      else await AsyncStorage.removeItem(PIN_GATE_STORAGE_KEY);
    } catch { /* storage unavailable: the server still enforces the requirement */ }
  };

  const applyPinRequirement = (userId: string, required: boolean) => {
    if (userRef.current?.id !== userId) return; // stale answer for another account
    setMustSetPin(required);
    persistPinGate(userId, required).catch(() => {});
  };

  // Ask the server (never the offline cache) whether this account still owes a PIN.
  const fetchServerPinState = async (): Promise<ServerPinState> => {
    try {
      const res = await api.get('/auth/me');
      return serverPinStateFromMe(res as any);
    } catch {
      return { reachable: false };
    }
  };

  const refreshPinRequirement = async (): Promise<ServerPinState> => {
    const u = userRef.current;
    if (!u || !isPinRole(u.role)) return { reachable: false };
    const state = await fetchServerPinState();
    if (state.reachable) applyPinRequirement(u.id, state.mustSetPin);
    return state;
  };

  // Restore session on mount. Storage can reject (device storage/key-value
  // corruption, quota or native bridge failure), and JSON.parse can throw if
  // an interrupted write left malformed data. Always release the startup
  // gate so a recoverable storage problem cannot strand the app on its
  // permanent splash spinner.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isRestorableUser(parsed)) {
            userRef.current = parsed as User; // visible to applyPinRequirement before the first render
            // Fail closed first: a known-outstanding PIN requirement keeps the
            // gate shut from the very first render, so no dashboard flashes.
            let hint = false;
            try { hint = pinGateHintFor(await AsyncStorage.getItem(PIN_GATE_STORAGE_KEY), parsed.id); } catch { /* no hint */ }
            if (isPinRole(parsed.role)) setMustSetPin(hint);
            setUser(parsed as User);
            setCacheNamespace(parsed.id);
            // Re-register an already-authorized device after reinstall/token
            // rotation or a previous transient registration failure, without
            // prompting for notification permission during app startup.
            registerForPushNotifications({ requestPermission: false }).catch(() => {});
            flushOutbox().catch(() => {});
            // The server decides. Hold the startup spinner briefly so a stale
            // "no PIN needed" cannot show dashboards before it answers; if the
            // server is slow (cold start) or offline, fall back to the hint and
            // let the late answer, or a 403 PIN_SETUP_REQUIRED, correct it.
            if (isPinRole(parsed.role)) {
              const answer = (async () => {
                const state = await fetchServerPinState();
                applyPinRequirement(parsed.id, mergePinRequirement(hint, state));
              })();
              await Promise.race([answer, new Promise<void>((resolve) => setTimeout(resolve, 8000))]);
            }
          } else {
            await AsyncStorage.removeItem('user');
            setCacheNamespace(null);
          }
        }
      } catch (error) {
        console.warn('[AuthContext] Unable to restore saved session; returning to sign-in.', error);
        setCacheNamespace(null);
        try { await AsyncStorage.removeItem('user'); } catch { /* storage is unavailable; remain signed out in memory */ }
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // If client.ts's response interceptor fails to refresh the access token
  // (refresh token expired/revoked — e.g. after 7 days, after a password
  // change elsewhere invalidated it, or an admin deactivated the account /
  // its access period ended mid-session), it clears AsyncStorage and emits
  // this event with the reason (see client.ts / authEvents.ts). We must
  // also clear in-memory `user` state, or RootNavigator never swaps back to
  // the Login screen and every screen just silently 401s forever — and we
  // show the reason, since a mid-session deactivation used to just dump the
  // person back at Login with zero explanation.
  useEffect(() => {
    return onForcedLogout((message) => {
      setUser(null);
      setMustChangePw(false);
      setMustSetSecurityQuestion(false);
      setMustSetPin(false);
      AsyncStorage.removeItem(PIN_GATE_STORAGE_KEY).catch(() => {});
      setCacheNamespace(null);
      if (message) Alert.alert('Signed out', message);
    });
  }, []);

  // The server refused a request with 403 PIN_SETUP_REQUIRED: our state was
  // stale (an administrator reset the PIN, or the app was closed meanwhile).
  useEffect(() => {
    return onPinSetupRequired(() => {
      const u = userRef.current;
      if (u && isPinRole(u.role)) applyPinRequirement(u.id, true);
    });
  }, []);

  // Coming back to the foreground: re-check with the server rather than trust
  // whatever was true when the app went to the background.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active' || pinCheckInFlight.current) return;
      pinCheckInFlight.current = true;
      refreshPinRequirement().catch(() => {}).finally(() => { pinCheckInFlight.current = false; });
    });
    return () => sub.remove();
  }, []);

  const login = async (
    username: string,
    secret: string,
    opts: { mode?: CredentialMode; rememberMe?: boolean; school_code?: string } = {},
  ) => {
    // Longer timeout than api.ts's global 15s default specifically for
    // login: this is the one call most likely to be the very first hit on
    // a Render free-tier backend that's spun down from inactivity, which
    // can take up to ~60s to wake — a 15s timeout expiring mid-cold-start
    // looks identical to a real network failure to axios (no `.response`
    // at all). Once logged in, every other request keeps the normal 15s.
    const mode = opts.mode ?? 'pin';
    const deviceId = await getDeviceId();
    const { data } = await api.post(
      '/auth/login',
      {
        username,
        ...(mode === 'pin' ? { pin: secret } : { password: secret }),
        remember_me: !!opts.rememberMe,
        school_code: opts.school_code,
      },
      { timeout: 60000, headers: { 'x-device-id': deviceId } },
    );
    // Tokens go into expo-secure-store (Keychain/Keystore), not AsyncStorage
    // — see secureTokenStorage.ts. `user` itself (id/username/role/school_code,
    // no credential) is fine in plain AsyncStorage as before.
    await setSecureItem('access_token',  data.access_token);
    await setSecureItem('refresh_token', data.refresh_token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setCacheNamespace(data.user.id);
    // Set before setUser so the very first authenticated render already knows
    // a PIN is required; RootNavigator then shows the setup screen, never a dashboard.
    const pinRequired = pinSetupRequiredFromFlags(data.user?.role, data);
    setMustSetPin(pinRequired);
    await persistPinGate(data.user.id, pinRequired);
    setUser(data.user);
    // Resume this account's pending work after a successful sign-in, even
    // when connectivity never emitted a new reconnect event.
    flushOutbox().catch(() => {});
    // Students, parents and teachers never see the old password screen: for them
    // must_change_pw is satisfied by setting a PIN, which the gate above handles.
    const adminPwChangeRequired = !isPinRole(data.user?.role) && !!data.must_change_pw;
    setMustChangePw(adminPwChangeRequired);
    setMustSetSecurityQuestion(!!data.must_set_security_question);
    // Best effort, never blocks login — a denied permission or offline
    // registration call just means no pushes until the next successful
    // login, not a broken sign-in flow.
    registerForPushNotifications().catch(() => {});
    return {
      must_change_pw: adminPwChangeRequired,
      must_set_security_question: !!data.must_set_security_question,
      must_set_pin: pinRequired,
    };
  };

  const logout = async () => {
    // If this device still has offline changes waiting to sync, they're
    // filed under this user — if someone else logs in on the same device
    // before this user reconnects, those changes would be stranded (kept
    // safe, but invisible) until this user comes back and signs in again.
    // Try to flush first; only bother the person with a choice if that
    // wasn't possible.
    const readPendingCount = async (): Promise<number | null> => {
      try {
        return await outboxCount();
      } catch {
        Alert.alert(
          'Cannot check saved changes',
          'Device storage is unavailable or the offline queue is damaged. Reconnect or resolve the storage problem before signing out so unsynced work is not put at risk.',
        );
        return null;
      }
    };
    let pending = await readPendingCount();
    if (pending === null) return;
    let online = false;
    try { online = await isOnline(); } catch { /* treat connectivity lookup failure as offline */ }
    if (pending > 0 && online) {
      await flushOutbox().catch(() => {});
      pending = await readPendingCount();
      if (pending === null) return;
    }
    if (pending > 0) {
      const proceed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Unsynced changes',
          `You have ${pending} change${pending === 1 ? '' : 's'} that haven't ` +
          `been sent to the server yet. They'll stay safe on this device and ` +
          `finish sending next time you log back in here — but not until then. ` +
          `Log out anyway?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Log Out Anyway', style: 'destructive', onPress: () => resolve(true) },
          ],
        );
      });
      if (!proceed) return;
    }

    try { await api.post('/auth/logout'); } catch { /* best effort */ }
    await unregisterPushToken();
    await deleteSecureItems(['access_token', 'refresh_token']);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem(PIN_GATE_STORAGE_KEY).catch(() => {});
    setCacheNamespace(null);
    setUser(null);
    setMustChangePw(false);
    setMustSetSecurityQuestion(false);
    setMustSetPin(false);
  };

  const changePassword = async (old_password: string, new_password: string) => {
    await api.post('/auth/change-password', { old_password, new_password });
    // Deliberately NOT clearing mustChangePw here — ChangePasswordScreen
    // shows a brief "Password changed!" confirmation before moving on, and
    // clearing the flag immediately would make RootNavigator swap this
    // screen out from under that confirmation (mustChangePw driving which
    // screen even exists in the tree, see RootNavigator.tsx). The screen
    // calls confirmPasswordChanged() itself once it's actually ready to
    // transition.
  };
  const confirmPasswordChanged = () => setMustChangePw(false);

  const setSecurityQuestion = async (question: string, answer: string) => {
    await api.post('/auth/security-question', { question, answer });
    // Same reasoning as confirmPasswordChanged() above.
  };
  const confirmSecurityQuestionSet = () => setMustSetSecurityQuestion(false);

  const refreshApprovalStatus = async (): Promise<boolean> => {
    const meRes: any = await api.get('/auth/me');
    const data = meRes.data;
    // Once approved, the server may now require the PIN: pick that up here so
    // the setup screen appears instead of the app (never from the offline cache).
    const pinState = serverPinStateFromMe(meRes);
    if (user && pinState.reachable && isPinRole(user.role)) applyPinRequirement(user.id, pinState.mustSetPin);
    const stillPending = !!data.pending_admin_review;
    if (user && user.pending_admin_review !== stillPending) {
      const updated = { ...user, pending_admin_review: stillPending };
      setUser(updated);
      await AsyncStorage.setItem('user', JSON.stringify(updated));
    }
    return stillPending;
  };

  const submitPin = async (currentCredential: string, newPin: string) => {
    const deviceId = await getDeviceId();
    // Longer timeout than the 15s default: the server hashes the PIN with
    // bcrypt and may be waking from a cold start. /auth/ requests are never
    // queued offline (client.ts), so the PIN can never land in the outbox.
    await api.post(
      '/auth/pin',
      { current_credential: currentCredential, new_pin: newPin },
      { timeout: 60000, headers: { 'x-device-id': deviceId } },
    );
  };

  const confirmPinSetup = async (): Promise<boolean> => {
    const u = userRef.current;
    if (!u) return false;
    const state = await fetchServerPinState();
    if (!state.reachable) return false;
    applyPinRequirement(u.id, state.mustSetPin);
    return state.mustSetPin === false;
  };

  return (
    <AuthContext.Provider value={{
      user, mustChangePw, mustSetSecurityQuestion, mustSetPin, loading,
      login, logout, changePassword, setSecurityQuestion,
      confirmPasswordChanged, confirmSecurityQuestionSet, refreshApprovalStatus,
      submitPin, confirmPinSetup,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
