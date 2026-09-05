import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { flushOutbox } from './client';
import { onForcedLogout } from './authEvents';
import { setSecureItem, deleteSecureItems } from './secureTokenStorage';
import { setCacheNamespace, outboxCount, isOnline } from '../offline';
import { registerForPushNotifications, unregisterPushToken } from './pushRegistration';

export type Role = 'student' | 'parent' | 'teacher' | 'admin' | 'finance_admin';

export interface User {
  id: string;
  username: string;
  role: Role;
  school_code: string | null;
  // Added for the class-lock feature — which class (if any) this user is
  // the class teacher for. Only meaningful when role === 'teacher'.
  assigned_class?: string | null;
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
  loading: boolean;
  login: (username: string, password: string) => Promise<{ must_change_pw: boolean; must_set_security_question: boolean }>;
  logout: () => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
  setSecurityQuestion: (question: string, answer: string) => Promise<void>;
  // See the comments on changePassword/setSecurityQuestion below for why
  // clearing the forced-flow flag is a separate, explicit step the calling
  // screen triggers on its own timing, not something those two functions
  // do automatically as part of succeeding.
  confirmPasswordChanged: () => void;
  confirmSecurityQuestionSet: () => void;
}

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [mustChangePw, setMustChangePw] = useState(false);
  const [mustSetSecurityQuestion, setMustSetSecurityQuestion] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    AsyncStorage.getItem('user').then((raw) => {
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setCacheNamespace(parsed.id);
      }
      setLoading(false);
    });
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
      setCacheNamespace(null);
      if (message) Alert.alert('Signed out', message);
    });
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/auth/login', { username, password });
    // Tokens go into expo-secure-store (Keychain/Keystore), not AsyncStorage
    // — see secureTokenStorage.ts. `user` itself (id/username/role/school_code,
    // no credential) is fine in plain AsyncStorage as before.
    await setSecureItem('access_token',  data.access_token);
    await setSecureItem('refresh_token', data.refresh_token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setCacheNamespace(data.user.id);
    setUser(data.user);
    setMustChangePw(!!data.must_change_pw);
    setMustSetSecurityQuestion(!!data.must_set_security_question);
    // Best effort, never blocks login — a denied permission or offline
    // registration call just means no pushes until the next successful
    // login, not a broken sign-in flow.
    registerForPushNotifications().catch(() => {});
    return { must_change_pw: data.must_change_pw, must_set_security_question: !!data.must_set_security_question };
  };

  const logout = async () => {
    // If this device still has offline changes waiting to sync, they're
    // filed under this user — if someone else logs in on the same device
    // before this user reconnects, those changes would be stranded (kept
    // safe, but invisible) until this user comes back and signs in again.
    // Try to flush first; only bother the person with a choice if that
    // wasn't possible.
    let pending = await outboxCount();
    if (pending > 0 && (await isOnline())) {
      await flushOutbox().catch(() => {});
      pending = await outboxCount();
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
    setCacheNamespace(null);
    setUser(null);
    setMustChangePw(false);
    setMustSetSecurityQuestion(false);
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

  return (
    <AuthContext.Provider value={{
      user, mustChangePw, mustSetSecurityQuestion, loading,
      login, logout, changePassword, setSecurityQuestion,
      confirmPasswordChanged, confirmSecurityQuestionSet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
