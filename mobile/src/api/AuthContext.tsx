import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { flushOutbox } from './client';
import { onForcedLogout } from './authEvents';
import { setSecureItem, deleteSecureItems } from './secureTokenStorage';
import { setCacheNamespace, outboxCount, isOnline } from '../offline';
import { registerForPushNotifications, unregisterPushToken } from './pushRegistration';

export type Role = 'student' | 'parent' | 'teacher' | 'admin';

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
  loading: boolean;
  login: (username: string, password: string) => Promise<{ must_change_pw: boolean }>;
  logout: () => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
}

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
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
  // (refresh token expired/revoked — e.g. after 7 days, or after a
  // password change elsewhere invalidated it), it clears AsyncStorage and
  // emits this event. We must also clear in-memory `user` state, or
  // RootNavigator never swaps back to the Login screen and every screen
  // just silently 401s forever.
  useEffect(() => {
    return onForcedLogout(() => { setUser(null); setCacheNamespace(null); });
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
    // Best effort, never blocks login — a denied permission or offline
    // registration call just means no pushes until the next successful
    // login, not a broken sign-in flow.
    registerForPushNotifications().catch(() => {});
    return { must_change_pw: data.must_change_pw };
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
  };

  const changePassword = async (old_password: string, new_password: string) => {
    await api.post('/auth/change-password', { old_password, new_password });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}
