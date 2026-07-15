import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './client';

// ── registerForPushNotifications ────────────────────────────────────────────
// Called from AuthContext.tsx's login(), right after login succeeds — not at
// cold app start. Asking for permission before the user has any reason to
// trust the app tends to get auto-denied, and a denial can't be re-prompted
// without the user going into OS settings manually.
//
// Returns the token that was registered (or null if registration didn't
// happen), so logout() can pass the same value to the unregister endpoint
// without asking the OS for it a second time.
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null; // simulators/emulators can't get a real token

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null; // respect the user's choice, don't nag every login

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    // Should not happen — app.json already has expo.extra.eas.projectId set
    // — but fail quietly rather than crashing login if it's ever missing
    // from a build.
    console.warn('[pushRegistration] No EAS projectId in app.json — skipping push registration');
    return null;
  }

  let token: string;
  try {
    const result = await Notifications.getExpoPushTokenAsync({ projectId });
    token = result.data;
  } catch (err) {
    console.warn('[pushRegistration] Failed to get push token:', err);
    return null;
  }

  try {
    await api.post('/auth/push-token', {
      expo_push_token: token,
      platform: Platform.OS,
    });
  } catch (err) {
    // Best effort — a failed registration call shouldn't block login.
    console.warn('[pushRegistration] Failed to register push token with server:', err);
    return null;
  }

  return token;
}

// ── unregisterPushToken ─────────────────────────────────────────────────────
// Called from AuthContext.tsx's logout(), before clearing secure storage —
// otherwise a shared/reissued device keeps receiving another account's
// pushes after logout. Re-fetches the token rather than requiring the
// caller to have cached one from login (the token is stable per
// install+projectId, so this returns the same value); if that fails for
// any reason (permission revoked since login, offline, etc.) this is a
// no-op — the stale row will just get pruned server-side next time a push
// to it bounces with DeviceNotRegistered.
export async function unregisterPushToken() {
  try {
    if (!Device.isDevice) return;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await api.post('/auth/push-token/unregister', { expo_push_token: token });
  } catch {
    // Best effort — see comment above.
  }
}
