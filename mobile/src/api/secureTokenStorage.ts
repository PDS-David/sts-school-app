import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Why this file exists ───────────────────────────────────────────────────
// access_token and refresh_token used to be stored with plain AsyncStorage,
// which on both Android and iOS is unencrypted, world-readable-to-the-app
// disk storage — recoverable from a device backup, a rooted/jailbroken
// device, or (on older Android) another app with storage permissions. Since
// a stolen refresh_token is a 7-day bearer credential for that account (see
// JWT_REFRESH_EXPIRES_IN in the backend), that's a real exposure, not a
// theoretical one — and `expo-secure-store` (Keychain on iOS, Keystore-backed
// EncryptedSharedPreferences on Android) was already a project dependency
// specifically flagged as unused for this.
//
// expo-secure-store has no web implementation (`expo start --web` would
// throw), so this module transparently falls back to AsyncStorage on
// Platform.OS === 'web'. That's not encrypted either, but there's no better
// native-secure-storage primitive to fall back to in a browser, and this
// app's shipped target is Android/iOS via Expo Go / EAS build, not web.
const isWeb = Platform.OS === 'web';

export async function setSecureItem(key: string, value: string): Promise<void> {
  if (isWeb) { await AsyncStorage.setItem(key, value); return; }
  await SecureStore.setItemAsync(key, value);
}

export async function getSecureItem(key: string): Promise<string | null> {
  if (isWeb) return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

export async function deleteSecureItem(key: string): Promise<void> {
  if (isWeb) { await AsyncStorage.removeItem(key); return; }
  await SecureStore.deleteItemAsync(key);
}

// Found live: AuthContext.tsx's logout() called this with zero protection
// around it. deleteSecureItem() can genuinely throw natively (SecureStore
// failure — corrupted keychain entry, key never set, OS-level keystore
// issue) and, since this used Promise.all, one failing key rejected the
// whole call and silently aborted the rest of logout() before it ever
// reached AsyncStorage.removeItem('user') / setCacheNamespace(null) /
// setUser(null) — the logout button visibly did nothing, no error shown
// anywhere, still logged in. Promise.allSettled lets each key's delete
// fail independently instead of taking the others (and the rest of
// logout()) down with it.
export async function deleteSecureItems(keys: string[]): Promise<void> {
  await Promise.allSettled(keys.map(deleteSecureItem));
}

// ── One-time migration ──────────────────────────────────────────────────────
// Earlier app builds stored access_token/refresh_token in plain AsyncStorage.
// Without this, everyone who already has the app installed would be silently
// signed out the moment this update lands (their tokens are sitting in a
// store this code no longer reads from). Instead, on first run after this
// change we pull any existing plaintext tokens across into SecureStore and
// wipe the old copies, so an already-logged-in user keeps their session.
// Safe to call on every app start — after the first run there's nothing left
// in AsyncStorage under these keys, so it's a no-op from then on.
let migrationPromise: Promise<void> | null = null;

export function migrateLegacyTokens(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      if (isWeb) return; // already reading/writing AsyncStorage on web — nothing to migrate
      const legacyKeys = ['access_token', 'refresh_token'];
      for (const key of legacyKeys) {
        try {
          const legacyValue = await AsyncStorage.getItem(key);
          if (legacyValue == null) continue;
          const existingSecureValue = await SecureStore.getItemAsync(key);
          if (existingSecureValue == null) {
            await SecureStore.setItemAsync(key, legacyValue);
          }
          await AsyncStorage.removeItem(key);
        } catch {
          // Best effort — if migration fails for some reason, the user just
          // has to log in again; it must never crash app startup.
        }
      }
    })();
  }
  return migrationPromise;
}