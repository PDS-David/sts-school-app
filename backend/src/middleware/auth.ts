import type { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt.js';
import { hasPerm } from '../utils/rbac.js';
import { query } from '../db/pool.js';
import type { Role } from '../types/index.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = header.slice(7);
  let user;
  try {
    user = verifyAccess(token);
  } catch {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }

  // The JWT itself only proves the token was validly issued and hasn't
  // expired yet — it says nothing about whether the account has since been
  // deactivated or its access window has since lapsed. Login/refresh already
  // check that, but without this check a deactivated user's *existing*
  // access token kept working for up to its full remaining lifetime
  // (JWT_EXPIRES_IN) after an admin deactivated them. One indexed lookup per
  // request to close that window.
  const { rows } = await query(
    `SELECT u.is_active, u.access_expires_at, u.revocation_reason, u.pending_admin_review,
            (u.role = 'student' AND EXISTS (
              SELECT 1 FROM students s WHERE s.user_id=u.id AND s.deleted_at IS NOT NULL
            )) AS student_deleted
     FROM users u WHERE u.id=$1`, [user.id],
  );
  const dbUser = rows[0];
  if (!dbUser || !dbUser.is_active) {
    return res.status(401).json({
      error: dbUser?.revocation_reason
        ? `Account is deactivated: ${dbUser.revocation_reason}. Contact the school admin.`
        : 'Account is deactivated. Contact the school admin.',
    });
  }
  if (dbUser.access_expires_at && new Date(dbUser.access_expires_at).getTime() <= Date.now()) {
    return res.status(401).json({
      error: dbUser.revocation_reason
        ? `Your access period has ended: ${dbUser.revocation_reason}. Contact the school admin to reactivate your account.`
        : 'Your access period has ended. Contact the school admin to reactivate your account.',
    });
  }

  if (dbUser.student_deleted) {
    return res.status(401).json({ error: 'Your student record is no longer active. Contact the school admin.' });
  }
  if (dbUser.pending_admin_review && req.baseUrl !== '/auth') {
    return res.status(403).json({ error: 'Your account is awaiting admin approval.', code: 'PENDING_APPROVAL' });
  }

  req.user = user;
  next();
}

export async function isStudentRecordDeleted(userId: string): Promise<boolean> {
  const { rows } = await query('SELECT 1 FROM students WHERE user_id=$1 AND deleted_at IS NOT NULL LIMIT 1', [userId]);
  return rows.length > 0;
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export function requirePerm(perm: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!hasPerm(req.user.role, perm)) {
      return res.status(403).json({ error: `Permission denied: ${perm}` });
    }
    next();
  };
}
