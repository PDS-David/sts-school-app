import jwt from 'jsonwebtoken';
import type { AuthUser } from '../types/index.js';

const DEFAULT_SECRET         = 'change-me';
const DEFAULT_REFRESH_SECRET = 'change-me-refresh';

const JWT_SECRET          = process.env.JWT_SECRET          ?? DEFAULT_SECRET;
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET  ?? DEFAULT_REFRESH_SECRET;
const JWT_EXPIRES_IN      = process.env.JWT_EXPIRES_IN      ?? '15m';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

// Hard stop in production: if these are ever left at their defaults, anyone
// can sign a valid admin token themselves (the fallback strings are sitting
// right here in the source code). This only allows the defaults in
// development, where it's just a local convenience.
if (process.env.NODE_ENV === 'production' &&
    (JWT_SECRET === DEFAULT_SECRET || JWT_REFRESH_SECRET === DEFAULT_REFRESH_SECRET)) {
  throw new Error(
    'JWT_SECRET / JWT_REFRESH_SECRET are not set (or still at their placeholder values). ' +
    'Set real, random secrets as environment variables before running in production — ' +
    'e.g. `node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"` to generate one.',
  );
}

export function signAccess(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefresh(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES } as jwt.SignOptions);
}

export function verifyAccess(token: string): AuthUser {
  return jwt.verify(token, JWT_SECRET) as AuthUser;
}

export function verifyRefresh(token: string): { sub: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
}
