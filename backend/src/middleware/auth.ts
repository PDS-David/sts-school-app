import type { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt.js';
import { hasPerm } from '../utils/rbac.js';
import { query } from '../db/pool.js';
import { hydrateAuthUser } from '../utils/authClaims.js';
import type { Role } from '../types/index.js';
import { resolveLearningAccessPolicy } from '../utils/learningAccessPolicy.js';
import { isUuid } from '../utils/authSessions.js';
import { PENDING_APPROVAL_MESSAGE, PIN_SETUP_REQUIRED_MESSAGE, SESSION_ENDED_MESSAGE } from '../utils/authMessages.js';

// Endpoints reachable while an account is pending approval (restricted
// session): check approval status and sign out. Nothing else.
const PENDING_ALLOWED = new Set(['GET /auth/me', 'POST /auth/logout']);
// Explicit allowlist reachable before the mandatory PIN is set. Every other
// route, including every other /auth/* route, is denied until it is.
const PIN_SETUP_ALLOWED = new Set(['GET /auth/me', 'POST /auth/logout', 'POST /auth/pin']);
const PIN_ROLES = new Set<string>(['student', 'parent', 'teacher']);

/**
 * Access tokens issued before the session rollout carry no `sid`. In
 * production they are refused so that revocation is always enforceable; clients
 * simply refresh (the legacy refresh token is exchanged for a session
 * transparently), so nobody is signed out. Outside production they are allowed
 * unless AUTH_REQUIRE_SESSION_ID=true.
 */
export function sessionIdRequired(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.AUTH_REQUIRE_SESSION_ID === 'true') return true;
  if (env.AUTH_REQUIRE_SESSION_ID === 'false') return false;
  return env.NODE_ENV === 'production';
}

function requestKey(req: Request): string {
  const path = req.originalUrl.split('?')[0].replace(/\/+$/, '') || '/';
  return `${req.method.toUpperCase()} ${path}`;
}


export async function readLearningAccessPolicy() {
  try {
    const { rows } = await query(
      `SELECT free_launch_mode, term_pin_enforced, curriculum_sequence_enforced
         FROM public.learning_access_settings WHERE id=1`,
    );
    return resolveLearningAccessPolicy(rows[0] ?? null);
  } catch (error: any) {
    // Existing installations remain usable until the additive 0008 migration
    // is applied. Environment flags/defaults preserve the prior behaviour.
    if (error?.code === '42P01') return resolveLearningAccessPolicy(null);
    throw error;
  }
}

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

  // Server-side session validity. A token that names a session is only good
  // while that session is active; logout, a PIN change or an administrator
  // reset revoke it immediately.
  if (user.sid !== undefined && !isUuid(user.sid)) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
  if (user.sid === undefined && sessionIdRequired()) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }

  // A signed JWT proves who issued the token and identifies its subject. It
  // is not the source of truth for mutable authorization attributes: an
  // administrator can change a role, school, class, or teacher-subject
  // assignment while the access token is still valid. Load those attributes
  // with the existing account-state check so revocations and reassignment
  // take effect on the very next authenticated request.
  const { rows } = await query(
    `SELECT u.username, u.role, u.school_code, u.assigned_class,
            COALESCE(u.assigned_class_names, ARRAY[]::text[]) AS assigned_class_names,
            COALESCE(u.can_manage_all_schools, FALSE) AS can_manage_all_schools,
            COALESCE((
              SELECT array_agg(ts.subject_id ORDER BY ts.subject_id)
              FROM teacher_subjects ts WHERE ts.user_id=u.id
            ), ARRAY[]::integer[]) AS assigned_subject_ids,
            u.is_active, u.access_expires_at, u.revocation_reason, u.pending_admin_review,
            u.must_set_pin,
            sess.id AS session_id, sess.revoked_at AS session_revoked_at, sess.expires_at AS session_expires_at,
            (u.role = 'student' AND EXISTS (
              SELECT 1 FROM students s WHERE s.user_id=u.id AND s.deleted_at IS NOT NULL
            )) AS student_deleted
     FROM users u
     LEFT JOIN auth_sessions sess ON sess.id = $2::uuid AND sess.user_id = u.id
     WHERE u.id=$1`, [user.id, user.sid ?? null],
  );
  const dbUser = rows[0];
  const accessPolicy = await readLearningAccessPolicy();
  req.learningAccessPolicy = accessPolicy;
  if (!dbUser || !dbUser.is_active) {
    return res.status(401).json({
      error: dbUser?.revocation_reason
        ? `Account is deactivated: ${dbUser.revocation_reason}. Contact the school admin.`
        : 'Account is deactivated. Contact the school admin.',
    });
  }
  if (user.sid !== undefined && (!dbUser.session_id || dbUser.session_revoked_at || new Date(dbUser.session_expires_at).getTime() <= Date.now())) {
    return res.status(401).json({ error: SESSION_ENDED_MESSAGE, code: 'SESSION_ENDED' });
  }
  if (!(accessPolicy.freeLaunchMode && dbUser.role === 'student') && dbUser.access_expires_at && new Date(dbUser.access_expires_at).getTime() <= Date.now()) {
    return res.status(401).json({
      error: dbUser.revocation_reason
        ? `Your access period has ended: ${dbUser.revocation_reason}. Contact the school admin to reactivate your account.`
        : 'Your access period has ended. Contact the school admin to reactivate your account.',
    });
  }

  if (dbUser.student_deleted) {
    return res.status(401).json({ error: 'Your student record is no longer active. Contact the school admin.' });
  }
  const key = requestKey(req);
  const effectivelyPending = !(accessPolicy.freeLaunchMode && dbUser.role === 'student') && !!dbUser.pending_admin_review;
  if (effectivelyPending && !PENDING_ALLOWED.has(key)) {
    return res.status(403).json({ error: PENDING_APPROVAL_MESSAGE, code: 'PENDING_APPROVAL' });
  }
  if (!effectivelyPending && dbUser.must_set_pin === true && PIN_ROLES.has(dbUser.role) && !PIN_SETUP_ALLOWED.has(key)) {
    return res.status(403).json({ error: PIN_SETUP_REQUIRED_MESSAGE, code: 'PIN_SETUP_REQUIRED' });
  }

  const requestedSchool = req.header('x-school-code')?.trim() || null;
  if (dbUser.role === 'admin' && dbUser.can_manage_all_schools === true && requestedSchool && !['primary', 'secondary'].includes(requestedSchool)) {
    return res.status(400).json({ error: 'Invalid selected school. Choose Primary or Secondary.' });
  }
  req.user = hydrateAuthUser(user, {
    username: dbUser.username,
    role: dbUser.role as Role,
    school_code: dbUser.school_code,
    assigned_class: dbUser.assigned_class,
    assigned_subject_ids: dbUser.assigned_subject_ids,
    assigned_class_names: dbUser.assigned_class_names,
    can_manage_all_schools: dbUser.can_manage_all_schools === true,
    selected_school_code: dbUser.role === 'admin' && dbUser.can_manage_all_schools === true ? requestedSchool : null,
  });
  if (req.user?.role === 'admin' && req.user?.can_manage_all_schools === true && !requestedSchool) {
    const pathname = req.originalUrl.split('?')[0];
    const isSchoolScoped =
      pathname === '/students' || pathname.startsWith('/students/') ||
      pathname.startsWith('/academic/') && pathname !== '/academic/schools' ||
      pathname.startsWith('/attendance') ||
      pathname.startsWith('/scores') ||
      pathname.startsWith('/weekly-efforts') ||
      pathname.startsWith('/school-events') ||
      pathname.startsWith('/announcements') ||
      pathname.startsWith('/learning') ||
      pathname.startsWith('/ai') ||
      pathname.startsWith('/finance') ||
      pathname.startsWith('/messages') ||
      pathname === '/admin' || pathname.startsWith('/admin/');
    const globalAdminPaths = new Set([
      '/admin/backups/status',
      '/admin/backups/run',
      '/admin/learning-access-settings',
      '/admin/roster/import/preview',
      '/admin/roster/import/confirm',
    ]);
    if (isSchoolScoped && !globalAdminPaths.has(pathname)) {
      return res.status(400).json({ error: 'Select Primary or Secondary before accessing school records.' });
    }
  }
  next();
}

/**
 * Teachers do not administer the independent DIY online-learning environment.
 * Keep them out of learning-content, online assessment-authoring and messaging
 * routes; physical student and academic reporting routes remain available.
 */
export function denyTeacherAccess(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role === 'teacher') {
    return res.status(403).json({ error: 'Teacher accounts are limited to physical-class report workflows.' });
  }
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
