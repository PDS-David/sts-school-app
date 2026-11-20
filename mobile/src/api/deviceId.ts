import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDeviceId, isValidDeviceId } from './loginForm';

const KEY = 'device_id';
let cached: string | null = null;

/**
 * Stable per-install id sent as `x-device-id` on login so the server's
 * per-device throttle lane can tell this phone from an attacker. It is a risk
 * signal only. If storage fails we return an in-memory id for this run rather
 * than blocking sign-in.
 */
export async function getDeviceId(): Promise<string> {
  if (cached) return cached;
  try {
    const stored = await AsyncStorage.getItem(KEY);
    if (isValidDeviceId(stored)) { cached = stored; return stored; }
  } catch { /* fall through to a fresh id */ }
  const fresh = generateDeviceId();
  cached = fresh;
  try { await AsyncStorage.setItem(KEY, fresh); } catch { /* keep the in-memory id */ }
  return fresh;
}
