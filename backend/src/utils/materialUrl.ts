import { isIP } from 'node:net';

const BLOCKED_HOST_SUFFIXES = [
  '.localhost', '.local', '.internal', '.lan', '.home', '.test', '.invalid',
  '.example', '.onion', '.arpa', '.nip.io', '.sslip.io', '.xip.io', '.localtest.me',
];

export function isSafeExternalMaterialUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 2048 || value !== value.trim()) return false;
  if (/[\u0000-\u0020\u007f\\\\]/.test(value)) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return false;
  if (url.port && url.port !== '443') return false;

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (!hostname || isIP(hostname) !== 0 || !hostname.includes('.') || /^\\d+(?:\\.\\d+){3}$/.test(hostname)) return false;
  if (BLOCKED_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix))) return false;
  if (hostname === 'localhost' || hostname === 'local' || hostname === 'internal') return false;

  return true;
}
