import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { auditContextFromRequest, auditInTransaction, auditStrict, verifyAuditLogIntegrity, AuditPersistenceError } from '../utils/audit.js';
import { sendAdminLogEmail } from '../utils/email.js';
import * as XLSX from 'xlsx';
import { generateTempPassword, generateNumericPin } from '../utils/password.js';
import { PIN_HASH_VERSION, PinConfigError, checkPin, generateTemporaryPin, hashPin } from '../utils/pin.js';
import { revokeUserSessions } from '../utils/authSessions.js';
import { accountKeyFor } from '../utils/usernames.js';
import { clearAccountThrottle } from '../utils/loginThrottle.js';
import { getBackupStatus, runBackup, BackupConfigError } from '../utils/backup.js';
import { assertTeacherReadyForApproval, normalizeTeacherSubjectIds, TeacherAssignmentValidationError, validateTeacherAssignments } from '../utils/teacherAssignments.js';
import type { AuthUser } from '../types/index.js';
import { resolveLearningAccessPolicy } from '../utils/learningAccessPolicy.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

type AdminSchoolScope =
  | { ok: true; schoolCode: string | null }
  | { ok: false; status: 400 | 403; error: string };

// A school-bound administrator is never allowed to widen their tenant by
// supplying a query/body school_code. A global administrator (school_code NULL)
// retains the existing cross-school behavior and may optionally narrow reads.
function requireGlobalAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.school_code && req.user?.can_manage_all_schools !== true) {
    return res.status(403).json({ error: 'Only a global administrator can access this operation' });
  }
  next();
}

function resolveAdminSchoolScope(
  user: AuthUser,
  requested: unknown,
): AdminSchoolScope {
  if (user.can_manage_all_schools === true && !user.school_code && (requested === undefined || requested === null || requested === '')) return { ok: false, status: 400, error: 'Select a school before accessing school records.' };
  if (user.school_code) {
    if (requested !== undefined && requested !== null && requested !== '' &&
        (typeof requested !== 'string' || requested.trim() !== user.school_code)) {
      return { ok: false, status: 403, error: "You can't access another school's records" };
    }
    return { ok: true, schoolCode: user.school_code };
  }
  if (requested === undefined || requested === null || requested === '') {
    return { ok: true, schoolCode: null };
  }
  if (typeof requested !== 'string' || !requested.trim() || requested.trim().length > 50) {
    return { ok: false, status: 400, error: 'Invalid school_code' };
  }
  return { ok: true, schoolCode: requested.trim() };
}

// ══════════════════════════════════════════
// GLOBAL ONLINE-LEARNING ACCESS POLICY
// ══════════════════════════════════════════
// This is deliberately global-admin-only: the existing free-launch and
// term/sequence gates are deployment-wide, not per-school subscription plans.
router.get('/learning-access-settings', requireGlobalAdmin, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT free_launch_mode, term_pin_enforced, curriculum_sequence_enforced,
              updated_at, updated_by
         FROM public.learning_access_settings WHERE id=1`,
    );
    if (!rows[0]) return res.status(503).json({ error: 'Learning access settings are not initialized. Apply migration 0008 first.' });
    return res.json({
      settings: rows[0],
      effective: resolveLearningAccessPolicy(rows[0]),
    });
  } catch (error: any) {
    if (error?.code === '42P01') return res.status(503).json({ error: 'Learning access settings are not installed. Apply migration 0008 first.' });
    throw error;
  }
});

router.put('/learning-access-settings', requireGlobalAdmin, async (req, res) => {
  const body = req.body ?? {};
  const keys = ['free_launch_mode', 'term_pin_enforced', 'curriculum_sequence_enforced'];
  if (keys.some(key => typeof body[key] !== 'boolean') ||
      Object.keys(body).some(key => !keys.includes(key))) {
    return res.status(400).json({
      error: 'Provide exactly three boolean settings: free_launch_mode, term_pin_enforced and curriculum_sequence_enforced.',
    });
  }

  try {
    const settings = await withTransaction(async client => {
    const { rows } = await client.query(
      `UPDATE public.learning_access_settings
          SET free_launch_mode=$1,
              term_pin_enforced=$2,
              curriculum_sequence_enforced=$3,
              updated_by=$4,
              updated_at=now()
        WHERE id=1
        RETURNING free_launch_mode, term_pin_enforced, curriculum_sequence_enforced,
                  updated_at, updated_by`,
      [body.free_launch_mode, body.term_pin_enforced, body.curriculum_sequence_enforced, req.user!.id],
    );
    if (!rows[0]) throw new Error('Global learning access settings row is missing; apply migration 0008.');
    await auditInTransaction(
      client, req.user!, 'update_learning_access_settings', 'learning_access_settings', 'global',
      'Global online-learning access policy updated',
      auditContextFromRequest(req, {
        metadata: {
          free_launch_mode: body.free_launch_mode,
          term_access_required: body.term_pin_enforced,
          sequence_gate_enabled: body.curriculum_sequence_enforced,
        },
      }),
    );
    return rows[0];
  });

    return res.json({ settings, effective: resolveLearningAccessPolicy(settings) });
  } catch (error: any) {
    if (error?.code === '42P01') return res.status(503).json({ error: 'Learning access settings are not installed. Apply migration 0008 first.' });
    throw error;
  }
});

// ══════════════════════════════════════════
// USER MANAGEMENT
// ══════════════════════════════════════════
router.get('/users', async (req, res) => {
  const { school_code, role } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  let sql = `SELECT u.id,u.username,u.full_name,u.role,u.school_code,u.assigned_class,u.assigned_class_names,
                    u.is_active,u.must_change_pw,u.access_expires_at,u.created_at,
                    u.phone,u.email,
                    (u.password_hash IS NULL) AS pending_activation,
                    u.pending_admin_review,
                    COALESCE(array_agg(DISTINCT ts.subject_id) FILTER (WHERE ts.subject_id IS NOT NULL), '{}') AS assigned_subject_ids,
                    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('class_name', tcs_class.name, 'subject_id', tcs.subject_id, 'school_code', tcs_class.school_code))
                      FILTER (WHERE tcs.user_id IS NOT NULL), '[]'::jsonb) AS assigned_class_subjects
             FROM users u
             LEFT JOIN teacher_subjects ts ON ts.user_id = u.id
             LEFT JOIN teacher_class_subjects tcs ON tcs.user_id = u.id
             LEFT JOIN classes tcs_class ON tcs_class.id = tcs.class_id
             WHERE 1=1`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND u.school_code=$${params.length}`; }
  if (role)             { params.push(role);              sql += ` AND u.role=$${params.length}`; }
  sql += ' GROUP BY u.id ORDER BY u.role,u.full_name';
  const { rows } = await query(sql, params);
  return res.json({ users: rows });
});

// ── GET /admin/students-without-login  (helper for the "link login" picker) ──
router.get('/students-without-login', async (req, res) => {
  const { school_code, class_name } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  let sql = `SELECT id, full_name, class_name, school_code, admission_number
             FROM students WHERE user_id IS NULL`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND school_code=$${params.length}`; }
  if (class_name)       { params.push(class_name);        sql += ` AND class_name=$${params.length}`; }
  sql += ' ORDER BY full_name';
  const { rows } = await query(sql, params);
  return res.json({ students: rows });
});

// ── GET /admin/student-logins-without-link  (reverse of the above: student
//    accounts in Users that aren't yet attached to a students row) ──────────
router.get('/student-logins-without-link', async (req, res) => {
  const { school_code } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  let sql = `SELECT id, username, full_name, school_code FROM users
             WHERE role='student' AND NOT EXISTS (SELECT 1 FROM students st WHERE st.user_id = users.id)`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND school_code=$${params.length}`; }
  sql += ' ORDER BY full_name';
  const { rows } = await query(sql, params);
  return res.json({ users: rows });
});

// ── GET /admin/parent-logins  (for the "link parent" picker — any parent can
//    be linked to several children, so no "unlinked" filtering here) ────────
router.get('/parent-logins', async (req, res) => {
  const { school_code } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  let sql = `SELECT id, username, full_name, phone FROM users WHERE role='parent'`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND school_code=$${params.length}`; }
  sql += ' ORDER BY full_name';
  const { rows } = await query(sql, params);
  return res.json({ users: rows });
});

// Class teachers get a hard-coded, deterministic username derived from
// their assigned class — not admin-typed — per explicit school-owner
// request: e.g. 'PRY 1' -> 'pry1', 'JSS 1' -> 'jss1', 'Pre-Nursery' ->
// 'prenursery'. Lowercases and strips everything but letters/digits, so
// spacing/hyphen differences in how a class name is written never produce
// two different usernames for the same class. Deliberately scoped to
// class teachers only (role==='teacher' with a non-empty assigned_class)
// — a subject-only teacher (no assigned_class) still gets an
// admin-chosen username, same as every non-teacher role.
function classTeacherUsername(className: string): string {
  return className.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Empty or whitespace-only text means "no value" for these optional columns.
// `?? null` alone does not catch it (an empty string is not null/undefined), and
// users.school_code references schools(code), so '' is never a meaningful value.
// Non-empty values are returned untouched (not trimmed).
function blankToNull<T>(v: T): T | null {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string' && v.trim() === '') return null;
  return v;
}

/**
 * Older admin app builds send the retired four-digit teacher code. It is
 * rejected, never stored, so a four-digit code cannot become a permanent
 * credential. The message tells the administrator exactly what to do.
 */
export const TEACHER_FOUR_DIGIT_PIN_MESSAGE =
  'A four-digit teacher code is no longer accepted. Teachers now sign in with a six-digit PIN. ' +
  'Update the admin app to the latest version, then create the teacher again with a six-digit PIN.';

router.post('/users', async (req, res) => {
  const { username, full_name, role, school_code, assigned_class, assigned_class_names, assigned_subject_ids, assigned_class_subjects, phone, email, access_expires_at, initial_password } = req.body ?? {};
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  if (req.user!.school_code && role === 'finance_admin') {
    return res.status(403).json({ error: 'Only a global administrator can create a finance administrator' });
  }
  const schoolCodeN = scope.schoolCode;
  const assignedClassN = blankToNull(assigned_class);
  const phoneN = blankToNull(phone);
  const emailN = blankToNull(email);

  // Class teacher: username is hard-coded from the class, ignoring
  // whatever (if anything) was typed into the Username field — see
  // classTeacherUsername() above. Subject-only teacher (no assigned_class)
  // and every non-teacher role: username comes from the admin as before.
  const isClassTeacher = role === 'teacher' && !!assigned_class;
  const uname = isClassTeacher
    ? classTeacherUsername(String(assigned_class))
    : String(username).trim().toLowerCase();

  const exists = role === 'teacher'
    ? await query('SELECT id FROM users WHERE role=\'teacher\' AND school_code=$1 AND lower(username)=lower($2)', [schoolCodeN, uname])
    : await query('SELECT id FROM users WHERE lower(username)=lower($1)', [uname]);
  if (exists.rows.length) {
    return res.status(409).json({
      error: isClassTeacher
        ? `"${assigned_class}" already has a class teacher account (username "${uname}"). Edit or delete the existing account before creating another for this class.`
        : 'Username taken',
    });
  }

  // access_expires_at only makes sense for teacher/parent credentials the admin
  // is handing out for a limited time. Admin accounts never expire this way.
  const expiresAt = (role === 'teacher' || role === 'parent') ? (access_expires_at ?? null) : null;

  // Teacher accounts: admin sets a temporary six-digit PIN directly,
  // per explicit school-owner request — teachers sign in with the PIN
  // the admin gave them and go straight to their dashboard (no forced
  // first-sign-in change; they may change it voluntarily at any time),
  // rather than self-activating via a one-time code. Deliberately scoped to
  // 'teacher' only; every other role still goes through the Task C
  // activation-code flow below unchanged.
  if (role === 'teacher') {
    // Administrator-issued six-digit PIN (same rule as every student/parent/
    // teacher PIN). It is stored as a normal PIN: must_set_pin and
    // must_change_pw are both FALSE, so the teacher signs in with it and goes
    // straight to the dashboard. No PIN-setup screen is forced; the teacher may
    // change it any time from More. A four-digit code is never accepted as an
    // initial credential, so it cannot become a permanent one.
    const initialPinCheck = checkPin(initial_password);
    if (!initialPinCheck.ok) {
      if (typeof initial_password === 'string' && /^\d{4}$/.test(initial_password)) {
        return res.status(400).json({
          error: TEACHER_FOUR_DIGIT_PIN_MESSAGE,
          code: 'TEACHER_PIN_SIX_DIGITS_REQUIRED',
        });
      }
      return res.status(400).json({ error: `Teacher PIN: ${(initialPinCheck as { ok: false; message: string }).message}` });
    }

    let subjectIds: number[];
    try {
      subjectIds = normalizeTeacherSubjectIds(assigned_subject_ids);
    } catch (error) {
      if (error instanceof TeacherAssignmentValidationError) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }

    const rawClassNames = Array.isArray(assigned_class_names)
      ? assigned_class_names.map((v: unknown) => typeof v === 'string' ? v.trim() : '')
      : [];
    if (assigned_class_names !== undefined &&
        (!Array.isArray(assigned_class_names) ||
         rawClassNames.some(name => !name) ||
         new Set(rawClassNames).size !== rawClassNames.length)) {
      return res.status(400).json({ error: 'assigned_class_names must be an array of unique class names.' });
    }
    const classNames = rawClassNames.filter(name => name !== assignedClassN);
    const classSubjectGrants = Array.isArray(assigned_class_subjects)
      ? assigned_class_subjects
      : classNames.flatMap((class_name: string) => subjectIds.map(subject_id => ({ class_name, subject_id })));
    if (!Array.isArray(classSubjectGrants) || classSubjectGrants.some((grant: any) =>
      !grant || typeof grant.class_name !== 'string' || !grant.class_name.trim() ||
      !Number.isSafeInteger(grant.subject_id) || grant.subject_id <= 0 ||
      !classNames.includes(grant.class_name.trim()) || !subjectIds.includes(grant.subject_id)) ||
      new Set(classSubjectGrants.map((grant: any) => `${grant.class_name.trim()}:${grant.subject_id}`)).size !== classSubjectGrants.length) {
      return res.status(400).json({ error: 'assigned_class_subjects must contain unique valid class/subject assignments within the selected classes and subjects.' });
    }
    if (!assignedClassN && (!classSubjectGrants.length || !subjectIds.length)) {
      return res.status(400).json({ error: 'A subject teacher must have at least one assigned class and one assigned subject.' });
    }

    let hash: string;
    try {
      hash = await hashPin(String(initial_password));
    } catch (error) {
      if (error instanceof PinConfigError) {
        return res.status(503).json({ error: 'PIN service is not configured. Contact the system administrator.' });
      }
      throw error;
    }
    let createdUser;
    try {
      createdUser = await withTransaction(async (client) => {
        await validateTeacherAssignments(client, schoolCodeN, assignedClassN, subjectIds);
        if (classNames.length) {
          const { rows: classRows } = await client.query('SELECT name FROM classes WHERE school_code=$1 AND name=ANY($2::text[])', [schoolCodeN, classNames]);
          if (classRows.length !== classNames.length) throw new TeacherAssignmentValidationError('Every additional or subject-teacher class must belong to the selected school.');
        }
        if (isClassTeacher) {
          const classesToAssign = [assignedClassN!, ...classNames];
          await client.query('SELECT id FROM classes WHERE school_code=$1 AND name=ANY($2::text[]) ORDER BY name FOR UPDATE', [schoolCodeN, classesToAssign]);
          const { rows: conflicts } = await client.query(
            `SELECT assigned_class FROM users
             WHERE role='teacher' AND school_code=$1 AND assigned_class IS NOT NULL
               AND (assigned_class=ANY($2::text[]) OR assigned_class_names && $2::text[])
             LIMIT 1`,
            [schoolCodeN, classesToAssign],
          );
          if (conflicts[0]) throw new TeacherAssignmentValidationError('One or more selected classes already have a class teacher. Edit the existing class teacher assignment instead.');
        }
        const { rows } = await client.query(
          `INSERT INTO users(username,password_hash,pin_hash_version,pin_set_at,role,full_name,school_code,assigned_class,assigned_class_names,
             phone,email,must_change_pw,must_set_pin,access_expires_at,activation_code)
           VALUES($1,$2,$10,clock_timestamp(),'teacher',$3,$4,$5,$6,$7,$8,FALSE,FALSE,$9,NULL) RETURNING id,username,role,school_code,access_expires_at`,
          [uname, hash, full_name, schoolCodeN, assignedClassN, classNames, phoneN, emailN, expiresAt, PIN_HASH_VERSION],
        );
        for (const sid of subjectIds) {
          await client.query(
            'INSERT INTO teacher_subjects(user_id, subject_id) VALUES($1,$2)',
            [rows[0].id, sid],
          );
        }
        for (const grant of classSubjectGrants) {
          await client.query(
            `INSERT INTO teacher_class_subjects(user_id,class_id,subject_id,created_by)
             SELECT $1,c.id,$3,$4 FROM classes c
             WHERE c.school_code=$2 AND c.name=$5`,
            [rows[0].id, schoolCodeN, grant.subject_id, req.user!.id, grant.class_name.trim()],
          );
        }
        await auditInTransaction(
          client, req.user!, 'add_user', 'user', rows[0].id,
          'teacher account created with administrator-issued temporary six-digit PIN; no forced change at first sign-in',
          auditContextFromRequest(req, { schoolCode: schoolCodeN, metadata: { target_user_id: rows[0].id, assigned_subject_count: subjectIds.length } }),
        );
        return rows[0];
      });
    } catch (error) {
      if (error instanceof TeacherAssignmentValidationError) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }

    return res.status(201).json({ user: createdUser });
  }

  // Task C: admin no longer generates a temp password to hand out — the
  // account is created with no password at all (password_hash NULL, a
  // deliberate pending-activation state — see schema.sql) plus a short
  // one-time activation code the account owner uses to set their own
  // password via POST /auth/activate. Applies to every non-teacher role;
  // accounts created before this under the old temp-password flow are
  // untouched.
  const activationCode = generateNumericPin();
  const createdUser = await withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,
         phone,email,must_change_pw,access_expires_at,activation_code)
       VALUES($1,NULL,$2,$3,$4,$5,$6,$7,FALSE,$8,$9) RETURNING id,username,role,school_code,access_expires_at`,
      [uname, role, full_name, schoolCodeN,
       assignedClassN, phoneN, emailN, expiresAt, activationCode],
    );
    await auditInTransaction(
      client, req.user!, 'add_user', 'user', rows[0].id,
      role + ' account created pending activation',
      auditContextFromRequest(req, { schoolCode: schoolCodeN, metadata: { target_user_id: rows[0].id, target_role: role } }),
    );
    return rows[0];
  });
  return res.status(201).json({ user: { ...createdUser, activation_code: activationCode } });
});

// ── POST /admin/users/:id/reissue-activation-code — lost/expired code ───────
// Only valid for an account still pending activation (password_hash IS
// NULL) — an already-activated account has no activation step left to
// re-issue. Also clears any lockout from prior failed attempts, same as
// re-issuing a class code does for class_access_codes.
router.post('/users/:id/reissue-activation-code', async (req, res) => {
  const result = await withTransaction(async (client) => {
    const { rows: existing } = await client.query(
      'SELECT id, password_hash, school_code FROM users WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR UPDATE',
      [req.params.id, req.user!.school_code ?? null],
    );
    if (!existing[0]) return { status: 404 as const };
    if (existing[0].password_hash) return { status: 400 as const };
    const activationCode = generateNumericPin();
    const { rows: updated } = await client.query(
      `UPDATE users SET activation_code=$1, activation_fail_count=0, activation_locked_until=NULL
        WHERE id=$2 AND ($3::text IS NULL OR school_code=$3) RETURNING id, school_code`,
      [activationCode, req.params.id, req.user!.school_code ?? null],
    );
    if (!updated[0]) return { status: 404 as const };
    await auditInTransaction(
      client, req.user!, 'reissue_activation_code', 'user', req.params.id,
      'pending account activation code reissued',
      auditContextFromRequest(req, { schoolCode: updated[0].school_code, metadata: { target_user_id: req.params.id } }),
    );
    return { status: 200 as const, activationCode };
  });
  if (result.status === 404) return res.status(404).json({ error: 'User not found' });
  if (result.status === 400) {
    return res.status(400).json({ error: 'This account has already been activated — there is no activation code to reissue.' });
  }
  return res.json({ activation_code: result.activationCode });
});

router.put('/users/:id', async (req, res) => {
  const { full_name, role, school_code, assigned_class, assigned_class_names, assigned_subject_ids, assigned_class_subjects, is_active, phone, email, access_expires_at, clear_expiry, revocation_reason } = req.body ?? {};
  const schoolCodeN = blankToNull(school_code);
  const assignedClassN = blankToNull(assigned_class);
  const phoneN = blankToNull(phone);
  const emailN = blankToNull(email);
  const reactivating = is_active === true;
  const hasSubjectIds = assigned_subject_ids !== undefined;
  const hasClassNames = assigned_class_names !== undefined;
  const hasClassSubjectGrants = assigned_class_subjects !== undefined;
  // A PRESENT assigned_class (null or '') is an explicit request to clear a
  // teacher's primary class; an OMITTED one leaves it untouched.
  const hasAssignedClass = assigned_class !== undefined;
  if (req.user!.school_code && school_code != null && school_code !== '' &&
      (typeof school_code !== 'string' || school_code.trim() !== req.user!.school_code)) {
    return res.status(403).json({ error: "You can't move an account outside your school" });
  }

  let result: { user: any | null; forbidden?: boolean };
  try {
    result = await withTransaction(async (client) => {
      const { rows: currentRows } = await client.query(
        'SELECT role,school_code,assigned_class,assigned_class_names FROM users WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR UPDATE',
        [req.params.id, req.user!.school_code ?? null],
      );
      if (!currentRows[0]) return { user: null };

      const current = currentRows[0];
      const nextRole = role ?? current.role;
      const nextSchool = schoolCodeN ?? current.school_code;
      const teacherClassExplicit = nextRole === 'teacher' && hasAssignedClass;
      const nextClass = (nextRole === 'admin' || nextRole === 'finance_admin')
        ? null
        : teacherClassExplicit
          ? assignedClassN
          : (assignedClassN ?? current.assigned_class);
      // Class teacher <-> subject teacher. The two roles carry different
      // authority, so nothing that belonged to the old role may be inherited.
      const convertedType = current.role === 'teacher' && nextRole === 'teacher' &&
        Boolean(current.assigned_class) !== Boolean(nextClass);

      if (req.user!.school_code &&
          (nextRole === 'finance_admin' || nextSchool !== req.user!.school_code)) {
        return { user: null, forbidden: true };
      }

      let nextSubjectIds: number[] = [];
      let nextClassNames: string[] = [];
      let nextClassSubjectGrants: Array<{ class_name: string; subject_id: number }> = [];
      if (nextRole === 'teacher') {
        if (hasClassNames) {
          if (!Array.isArray(assigned_class_names) || assigned_class_names.some((v: unknown) => typeof v !== 'string' || !v.trim())) {
            throw new TeacherAssignmentValidationError('assigned_class_names must be an array of class names.');
          }
          nextClassNames = [...new Set(assigned_class_names.map((v: string) => v.trim()))].filter(name => name !== nextClass);
          const { rows: classRows } = await client.query('SELECT name FROM classes WHERE school_code=$1 AND name=ANY($2::text[])', [nextSchool, nextClassNames]);
          if (classRows.length !== nextClassNames.length) throw new TeacherAssignmentValidationError('Every additional or subject-teacher class must belong to the selected school.');
        } else {
          // On conversion, classes owned in the previous role are not carried over.
          nextClassNames = convertedType ? [] : (current.assigned_class_names ?? []);
        }
        if (hasSubjectIds) {
          nextSubjectIds = normalizeTeacherSubjectIds(assigned_subject_ids);
        } else if (convertedType) {
          nextSubjectIds = [];
        } else {
          const { rows: existingSubjects } = await client.query(
            'SELECT subject_id FROM teacher_subjects WHERE user_id=$1 ORDER BY subject_id',
            [req.params.id],
          );
          nextSubjectIds = existingSubjects.map((row) => Number(row.subject_id));
        }
        await validateTeacherAssignments(client, nextSchool, nextClass, nextSubjectIds);
        if (hasClassSubjectGrants) {
          if (!Array.isArray(assigned_class_subjects) || assigned_class_subjects.some((grant: any) =>
            !grant || typeof grant.class_name !== 'string' || !grant.class_name.trim() ||
            !Number.isSafeInteger(grant.subject_id) || grant.subject_id <= 0 ||
            !nextClassNames.includes(grant.class_name.trim()) || !nextSubjectIds.includes(grant.subject_id)) ||
            new Set(assigned_class_subjects.map((grant: any) => `${grant.class_name.trim()}:${grant.subject_id}`)).size !== assigned_class_subjects.length) {
            throw new TeacherAssignmentValidationError('assigned_class_subjects must contain unique valid class/subject assignments within the selected classes and subjects.');
          }
          nextClassSubjectGrants = assigned_class_subjects.map((grant: any) => ({
            class_name: grant.class_name.trim(),
            subject_id: grant.subject_id,
          }));
        } else if (!nextClass) {
          // Compatibility for older clients: preserve their former
          // subject-by-class Cartesian assignment until they use the matrix UI.
          nextClassSubjectGrants = nextClassNames.flatMap(class_name =>
            nextSubjectIds.map(subject_id => ({ class_name, subject_id })),
          );
        }
        // Same minimum as POST: a subject teacher (no primary class) must end up
        // with at least one class, one subject and one class/subject grant. Only
        // enforced when this request rewrites allocations (or promotes a
        // non-teacher), so profile/status-only edits to an account created
        // before this rule are unaffected. Class teachers need no subject grants.
        const allocationsRewritten = current.role !== 'teacher' || hasClassNames || hasSubjectIds ||
          hasClassSubjectGrants || convertedType;
        if (!nextClass && allocationsRewritten && (!nextClassSubjectGrants.length || !nextSubjectIds.length)) {
          throw new TeacherAssignmentValidationError('A subject teacher must have at least one assigned class and one assigned subject.');
        }
        if (nextClass) {
          const classesToAssign = [nextClass, ...nextClassNames];
          await client.query('SELECT id FROM classes WHERE school_code=$1 AND name=ANY($2::text[]) FOR UPDATE', [nextSchool, classesToAssign]);
          const { rows: conflicts } = await client.query(
            `SELECT id, assigned_class FROM users
             WHERE role='teacher' AND school_code=$1 AND id<>$3 AND assigned_class IS NOT NULL
               AND (assigned_class=ANY($2::text[]) OR assigned_class_names && $2::text[])
             LIMIT 1`,
            [nextSchool, classesToAssign, req.params.id],
          );
          if (conflicts[0]) throw new TeacherAssignmentValidationError('One or more selected classes already have a class teacher. Edit the existing class teacher assignment instead.');
        }
      }

      const { rows } = await client.query(
        `UPDATE users SET full_name=COALESCE($1,full_name), role=COALESCE($2,role),
           can_manage_all_schools=CASE WHEN COALESCE($2,role)='admin' THEN can_manage_all_schools ELSE FALSE END,
           school_code=COALESCE($3,school_code),
           assigned_class=CASE WHEN COALESCE($2,role) IN ('admin','finance_admin') THEN NULL
                               WHEN $15 THEN $4
                               ELSE COALESCE($4,assigned_class) END,
           assigned_class_names=CASE WHEN COALESCE($2,role) IN ('admin','finance_admin') THEN '{}'::text[]
                                     WHEN $13 THEN $14::text[] ELSE assigned_class_names END,
           is_active=COALESCE($5,is_active),
           phone=COALESCE($6,phone), email=COALESCE($7,email),
           access_expires_at = CASE WHEN $9 THEN NULL ELSE COALESCE($8, access_expires_at) END,
           revocation_reason = CASE WHEN $11 THEN NULL ELSE COALESCE($12, revocation_reason) END
         WHERE id=$10 RETURNING id,username,role,is_active,access_expires_at,revocation_reason`,
        [full_name, role, schoolCodeN, assignedClassN, is_active, phoneN, emailN,
         access_expires_at ?? null, !!clear_expiry, req.params.id, reactivating, revocation_reason ?? null,
         hasClassNames || convertedType, nextClassNames, teacherClassExplicit],
      );
      if (!rows[0]) return { user: null };

       if (nextRole !== 'teacher' || hasClassNames || hasSubjectIds || hasClassSubjectGrants || nextClass || convertedType) {
         await client.query('DELETE FROM teacher_class_subjects WHERE user_id=$1', [req.params.id]);
         for (const grant of nextClassSubjectGrants) {
           await client.query(
             `INSERT INTO teacher_class_subjects(user_id,class_id,subject_id,created_by)
              SELECT $1,c.id,$3,$4 FROM classes c
              WHERE c.school_code=$2 AND c.name=$5`,
             [req.params.id, nextSchool, grant.subject_id, req.user!.id, grant.class_name],
           );
         }
       }

      // Replace assignments in the same transaction as the user update.
      // Changing away from teacher always removes now-irrelevant grants.
      if (nextRole !== 'teacher' || hasSubjectIds || convertedType) {
        await client.query('DELETE FROM teacher_subjects WHERE user_id=$1', [req.params.id]);
        for (const sid of nextSubjectIds) {
          await client.query(
            'INSERT INTO teacher_subjects(user_id, subject_id) VALUES($1,$2)',
            [req.params.id, sid],
          );
        }
      }
      await auditInTransaction(
        client, req.user!, 'edit_user', 'user', req.params.id,
        'user account and access assignments updated',
        auditContextFromRequest(req, { schoolCode: nextSchool, metadata: { target_user_id: req.params.id, changed_fields: Object.keys(req.body ?? {}).filter(key => !/password|token|secret|pin/i.test(key)) } }),
      );

      return { user: rows[0] };
    });
  } catch (error) {
    if (error instanceof TeacherAssignmentValidationError) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }

  if (result.forbidden) return res.status(403).json({ error: "You can't change an account outside your school or create a global finance administrator" });
  if (!result.user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: result.user });
});

router.post('/users/:id/reset-password', async (req, res) => {
  let result: { password: string; isPin: boolean } | null;
  try {
    result = await withTransaction(async (client) => {
      const { rows: existing } = await client.query(
        'SELECT id, username, role, school_code FROM users WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR UPDATE',
        [req.params.id, req.user!.school_code ?? null],
      );
      if (!existing[0]) return null;

      // Students, parents and teachers: administrator-verified recovery. The
      // administrator issues a secure random temporary six-digit PIN, shown
      // once in this response only. It works as a normal PIN: no forced
      // change at next sign-in (the user may change it voluntarily). Every
      // session is revoked, so the old PIN and sessions stop working, and any
      // lockout is cleared.
      if (['student', 'parent', 'teacher'].includes(existing[0].role)) {
        const pin = generateTemporaryPin();
        const hash = await hashPin(pin);
        await client.query(
          `UPDATE users SET password_hash=$1, pin_hash_version=$2, pin_set_at=clock_timestamp(),
                  must_set_pin=FALSE, must_change_pw=FALSE
            WHERE id=$3`,
          [hash, PIN_HASH_VERSION, req.params.id],
        );
        await revokeUserSessions(req.params.id, 'admin_pin_reset', { client });
        await clearAccountThrottle(accountKeyFor(existing[0].username), client);
        await auditInTransaction(
          client, req.user!, 'reset_pin', 'user', req.params.id,
          'administrator issued a temporary six-digit PIN; all sessions revoked; no forced change at next sign-in',
          auditContextFromRequest(req, { schoolCode: existing[0].school_code, metadata: { target_user_id: req.params.id, must_set_pin: false, sessions_revoked: true } }),
        );
        return { password: pin, isPin: true };
      }

      // Administrator / Finance Administrator accounts: a temporary password
      // (separate from the six-digit PIN policy). It works as a normal
      // password: no forced change at next sign-in; the account holder may
      // change it voluntarily via POST /auth/change-password.
      const pw = generateTempPassword();
      const hash = await bcrypt.hash(pw, 10);
      await client.query(
        'UPDATE users SET password_hash=$1, must_change_pw=FALSE WHERE id=$2',
        [hash, req.params.id],
      );
      await auditInTransaction(
        client, req.user!, 'reset_password', 'user', req.params.id,
        'administrator reset user password; temporary password issued; no forced change on next login',
        auditContextFromRequest(req, { schoolCode: existing[0].school_code, metadata: { target_user_id: req.params.id, must_change_password: false } }),
      );
      return { password: pw, isPin: false };
    });
  } catch (error) {
    if (error instanceof PinConfigError) {
      return res.status(503).json({ error: 'PIN service is not configured. Contact the system administrator.' });
    }
    throw error;
  }
  if (!result) return res.status(404).json({ error: 'User not found' });
  res.set('Cache-Control', 'no-store');
  return res.json({
    ok: true,
    temporary_password: result.password,
    ...(result.isPin ? { temporary_pin: result.password } : {}),
  });
});

// Clears the pending_admin_review flag set by POST /auth/self-register —
// the account already has its own real password (unlike Task C's
// activation-code flow), so there's nothing to issue here, just a review
// gate to lift. Admin should have already checked/edited the account's
// class/subject assignment via the normal Edit Details flow before this.
router.post('/users/:id/approve', async (req, res) => {
  let result;
  try {
    result = await withTransaction(async (client) => {
      // Lock the row first so the allocation checked below is the allocation approved.
      const { rows: targetRows } = await client.query(
        `SELECT role,school_code,assigned_class,assigned_class_names,pending_admin_review
         FROM users WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR UPDATE`,
        [req.params.id, req.user!.school_code ?? null],
      );
      const target = targetRows[0];
      if (!target) return null;
      // A pending teacher is only approved with a valid role-appropriate
      // allocation. Other roles, and an already-approved account, are unchanged.
      if (target.role === 'teacher' && target.pending_admin_review) {
        await assertTeacherReadyForApproval(
          client, req.params.id, target.school_code, target.assigned_class, target.assigned_class_names,
        );
      }
      const { rows } = await client.query(
        'UPDATE users SET pending_admin_review=FALSE WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) RETURNING id, school_code',
        [req.params.id, req.user!.school_code ?? null],
      );
      if (!rows[0]) return null;
      await auditInTransaction(
        client, req.user!, 'approve_self_registered_user', 'user', req.params.id,
        'administrator approved self-registered account',
        auditContextFromRequest(req, { schoolCode: rows[0].school_code, metadata: { target_user_id: req.params.id } }),
      );
      return rows[0];
    });
  } catch (error) {
    if (error instanceof TeacherAssignmentValidationError) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }
  if (!result) return res.status(404).json({ error: 'User not found' });
  return res.json({ ok: true });
});

router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user!.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  const result = await withTransaction(async (client) => {
    const { rows: targetRows } = await client.query(
      'SELECT role, username, school_code FROM users WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR UPDATE',
      [req.params.id, req.user!.school_code ?? null],
    );
    if (!targetRows[0]) return { status: 404 as const };
    if (targetRows[0].role === 'admin') return { status: 400 as const };
    const { rows } = await client.query(
      'DELETE FROM users WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) RETURNING username',
      [req.params.id, req.user!.school_code ?? null],
    );
    if (!rows[0]) return { status: 404 as const };
    await auditInTransaction(
      client, req.user!, 'delete_user', 'user', req.params.id,
      'administrator deleted user account ' + rows[0].username,
      auditContextFromRequest(req, { schoolCode: targetRows[0].school_code, metadata: { target_user_id: req.params.id, target_role: targetRows[0].role } }),
    );
    return { status: 200 as const };
  });
  if (result.status === 404) return res.status(404).json({ error: 'User not found' });
  if (result.status === 400) return res.status(400).json({ error: 'Admin accounts cannot be deleted' });
  return res.json({ ok: true });
});

// ══════════════════════════════════════════
// AUDIT LOG
// ══════════════════════════════════════════
router.get('/audit-log/integrity', async (req, res) => {
  const { school_code } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  const integrity = await verifyAuditLogIntegrity(scope.schoolCode ?? undefined);
  if (!integrity.valid) {
    return res.status(500).json({ error: 'Audit log integrity verification failed.', integrity });
  }
  return res.json({ integrity });
});

router.get('/audit-log', async (req, res) => {
  const { school_code, limit = '100' } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  const parsedLimit = Number(limit);
  if (!Number.isSafeInteger(parsedLimit) || parsedLimit < 1) {
    return res.status(400).json({ error: 'limit must be a positive whole number' });
  }
  let sql = `SELECT al.*,u.username AS actor_username
             FROM audit_log al LEFT JOIN users u ON u.id=al.actor_id
             WHERE 1=1`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND al.school_code=$${params.length}`; }
  sql += ` ORDER BY al.created_at DESC LIMIT $${params.length + 1}`;
  params.push(Math.min(parsedLimit, 500));
  const { rows } = await query(sql, params);
  return res.json({ audit_log: rows });
});

// ══════════════════════════════════════════
// EMAIL LOG TRIGGER
// ══════════════════════════════════════════
router.post('/log-email', requireGlobalAdmin, async (req, res) => {
  const { level = 'INFO', event = 'manual', payload = {} } = req.body;
  await query(
    `INSERT INTO email_log_queue(level,event,payload) VALUES($1,$2,$3)`,
    [level, event, JSON.stringify(payload)],
  );
  try {
    await sendAdminLogEmail(level, event, payload);
    await query(`UPDATE email_log_queue SET processed_at=now() WHERE processed_at IS NULL ORDER BY id DESC LIMIT 1`);
  } catch (e: any) {
    return res.status(500).json({ error: 'Email queued but failed to send: ' + e.message });
  }
  return res.json({ ok: true });
});

// ══════════════════════════════════════════
// EXCEL EXPORT (mirrors STS export)
// ══════════════════════════════════════════
router.get('/export/excel', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  const sc = scope.schoolCode;

  // Found in QA Pass 8: admin's own `school_code` is NULL (same root cause as
  // the Pass 7 contacts bug), so hitting this route with no `?school_code=`
  // used to fall through to `WHERE school_code=NULL` on every sheet — which
  // matches nothing in Postgres, not "no restriction". That silently returned
  // a real 200 with a real .xlsx attachment, just one with header-only sheets
  // and no Scores sheet at all — live-verified indistinguishable from a
  // genuine empty school. Unlike messaging contacts, this report is
  // inherently single-school (mirrors the mobile school picker), so the fix
  // here is a real error rather than admin-sees-everything.
  if (!sc) {
    return res.status(400).json({ error: 'school_code is required (e.g. "primary" or "secondary").' });
  }
  const { rows: schoolRows } = await query('SELECT code FROM schools WHERE code=$1', [sc]);
  if (!schoolRows[0]) {
    return res.status(400).json({ error: `Unknown school_code "${sc}".` });
  }

  const wb = XLSX.utils.book_new();

  // Students sheet
  const { rows: students } = await query(
    'SELECT admission_number,full_name,class_name,gender,created_at FROM students WHERE school_code=$1 ORDER BY class_name,full_name', [sc],
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(students), 'Students');

  // Subjects sheet
  const { rows: subjects } = await query(
    'SELECT name,code FROM subjects WHERE school_code=$1 ORDER BY name', [sc],
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(subjects), 'Subjects');

  // Terms sheet
  const { rows: terms } = await query(
    'SELECT name,academic_year,is_current,days_opened,next_term_begins FROM terms WHERE school_code=$1 ORDER BY id', [sc],
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(terms), 'Terms');

  // Scores for current term
  const { rows: currentTerm } = await query(
    'SELECT id,name FROM terms WHERE school_code=$1 AND is_current=TRUE LIMIT 1', [sc],
  );
  if (currentTerm[0]) {
    const { rows: scores } = await query(
      `SELECT st.admission_number,st.full_name,st.class_name,
              sub.name AS subject,sc.ca1,sc.ca2,sc.exam,sc.total,sc.grade,sc.teacher_remark
       FROM scores sc
       JOIN students st ON st.id=sc.student_id
       JOIN subjects sub ON sub.id=sc.subject_id
       WHERE st.school_code=$1 AND sc.term_id=$2
       ORDER BY st.class_name,st.full_name,sub.name`,
      [sc, currentTerm[0].id],
    );
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(scores), `Scores - ${currentTerm[0].name}`);
  }

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', `attachment; filename="school-report-${sc}-${Date.now()}.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  return res.send(buf);
});

// Finance (fee items, invoices, invoice status) has moved to routes/finance.ts
// entirely, gated by requireRole('finance_admin') — not this router's
// requireRole('admin'). Operations Admin (this file) has no finance access
// at all now; see finance.ts for why that's enforced explicitly rather than
// through the '*' permission wildcard this role otherwise has.

// ══════════════════════════════════════════
// TERM-ACCESS PINS (Feature A — see schema.sql's "Term-PIN gating" section
// for the locked product decisions this implements)
// ══════════════════════════════════════════
const TERM_LABELS = ['1st Term', '2nd Term', '3rd Term'];

// ── POST /admin/term-pins — generate (or re-issue) a PIN ───────────────────────
router.post('/term-pins', async (req, res) => {
  const { student_id, term_label } = req.body as { student_id?: string; term_label?: string };
  if (typeof student_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(student_id) || !term_label) {
    return res.status(400).json({ error: 'A valid student_id and term_label are required' });
  }
  if (!TERM_LABELS.includes(term_label)) {
    return res.status(400).json({ error: `term_label must be one of: ${TERM_LABELS.join(', ')}` });
  }

  const pin = generateNumericPin();
  const result = await withTransaction(async (client) => {
    const { rows: stRows } = await client.query(
      'SELECT id FROM students WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR SHARE',
      [student_id, req.user!.school_code ?? null],
    );
    if (!stRows[0]) return { ok: false as const };
    const { rows } = await client.query(
      `INSERT INTO term_access_pins(student_id, term_label, pin, created_by)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (student_id, term_label)
       DO UPDATE SET pin=EXCLUDED.pin, redeemed_at=NULL, created_by=EXCLUDED.created_by, created_at=now()
       RETURNING *`,
      [student_id, term_label, pin, req.user!.id],
    );
    return { ok: true as const, termPin: rows[0] };
  });
  if (!result.ok) return res.status(404).json({ error: 'Student not found' });
  return res.status(201).json({ term_pin: result.termPin });
});

// ── GET /admin/term-pins?student_id=&term_label= — view issued/redeemed status ──
// Note: this deliberately returns the live `pin` value too (not just
// redemption status) — an admin re-checking what they handed a student
// needs to be able to read it back, same as `POST /admin/users`'s
// `temporary_password` being visible to admin, not just the recipient.
router.get('/term-pins', async (req, res) => {
  const { student_id, term_label, school_code } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  if (student_id && (typeof student_id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(student_id))) {
    return res.status(400).json({ error: 'Invalid student_id' });
  }
  if (term_label && !TERM_LABELS.includes(term_label)) {
    return res.status(400).json({ error: 'Invalid term_label' });
  }
  let sql = `SELECT tp.*, st.full_name AS student_name, st.class_name
             FROM term_access_pins tp JOIN students st ON st.id=tp.student_id WHERE 1=1`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND st.school_code=$${params.length}`; }
  if (student_id) { params.push(student_id); sql += ` AND tp.student_id=$${params.length}`; }
  if (term_label) { params.push(term_label); sql += ` AND tp.term_label=$${params.length}`; }
  sql += ' ORDER BY st.full_name, tp.term_label';
  const { rows } = await query(sql, params);
  return res.json({ term_pins: rows });
});

// ── POST /admin/class-codes — generate (or re-issue) a class's code ────────────
router.post('/class-codes', async (req, res) => {
  const { school_code, class_name } = req.body as { school_code?: string; class_name?: string };
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  const sc = scope.schoolCode;
  if (!sc) return res.status(400).json({ error: 'school_code is required for global administrators' });
  if (typeof class_name !== 'string' || !class_name.trim() || class_name.trim().length > 100) {
    return res.status(400).json({ error: 'A valid class_name is required' });
  }
  const { rows: classes } = await query(
    'SELECT 1 FROM classes WHERE school_code=$1 AND name=$2',
    [sc, class_name.trim()],
  );
  if (!classes[0]) return res.status(400).json({ error: 'Unknown class for this school' });

  const code = generateNumericPin();
  // Upsert on (school_code, class_name): re-issuing (the code leaked, or a
  // fresh term) replaces the existing code and clears any lockout state,
  // rather than erroring or accumulating rows — see schema.sql's comment on
  // this table for why. Does NOT touch students.user_id for anyone who
  // already self-claimed with the old code — re-issuing only affects
  // students who haven't claimed yet.
  const { rows } = await query(
    `INSERT INTO class_access_codes(school_code, class_name, code, created_by)
     VALUES($1,$2,$3,$4)
     ON CONFLICT (school_code, class_name)
     DO UPDATE SET code=EXCLUDED.code, fail_count=0, locked_until=NULL, created_by=EXCLUDED.created_by, created_at=now()
     RETURNING *`,
    [sc, class_name.trim(), code, req.user!.id],
  );
  return res.status(201).json({ class_code: rows[0] });
});

// ── GET /admin/class-codes?school_code=&class_name= — view issued codes ────────
// Also returns claimed/unclaimed counts per class so admin can see progress
// without cross-referencing the Users list separately.
router.get('/class-codes', async (req, res) => {
  const { school_code, class_name } = req.query as Record<string, string>;
  const scope = resolveAdminSchoolScope(req.user!, school_code);
  if (!scope.ok) return res.status(scope.status).json({ error: scope.error });
  if (class_name && (typeof class_name !== 'string' || class_name.trim().length > 100)) {
    return res.status(400).json({ error: 'Invalid class_name' });
  }
  let sql = `SELECT cc.*,
                    (SELECT COUNT(*) FROM students st WHERE st.school_code=cc.school_code AND st.class_name=cc.class_name AND st.user_id IS NOT NULL) AS claimed_count,
                    (SELECT COUNT(*) FROM students st WHERE st.school_code=cc.school_code AND st.class_name=cc.class_name AND st.user_id IS NULL) AS unclaimed_count
             FROM class_access_codes cc WHERE 1=1`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND cc.school_code=$${params.length}`; }
  if (class_name)       { params.push(class_name);        sql += ` AND cc.class_name=$${params.length}`; }
  sql += ' ORDER BY cc.school_code, cc.class_name';
  const { rows } = await query(sql, params);
  return res.json({ class_codes: rows });
});

// ══════════════════════════════════════════
// DATABASE BACKUP (encrypted, emailed to ADMIN_LOG_RECIPIENTS)
// ══════════════════════════════════════════
router.get('/backups/status', requireGlobalAdmin, async (_req, res) => {
  return res.json(await getBackupStatus());
});

let backupRunning = false;
router.post('/backups/run', requireGlobalAdmin, async (req, res) => {
  if (backupRunning) return res.status(409).json({ error: 'A backup is already running.' });
  backupRunning = true;
  try {
    const context = auditContextFromRequest(req, { metadata: { backup_requested_by: req.user?.username ?? 'admin' } });
    await auditStrict(req.user ?? null, 'BACKUP_STARTED', 'database', undefined, 'database backup started', context);
    const r = await runBackup(req.user?.username ?? 'admin');
    await auditStrict(
      req.user ?? null, 'BACKUP_RUN', 'database', undefined,
      `${r.status}; ${r.tables} tables; ${r.rows} rows; ${r.size_bytes} bytes`,
      auditContextFromRequest(req, {
        outcome: 'success',
        metadata: { tables: r.tables, rows: r.rows, size_bytes: r.size_bytes, backup_status: r.status },
      }),
    );
    return res.json({ ...r, ...(await getBackupStatus()) });
  } catch (e: any) {
    if (e instanceof AuditPersistenceError) throw e;
    try {
      await auditStrict(
        req.user ?? null, 'BACKUP_RUN', 'database', undefined, 'database backup failed',
        auditContextFromRequest(req, { outcome: 'failure', metadata: { error_code: e?.code ?? null, error_type: e?.name ?? 'Error' } }),
      );
    } catch (auditError) {
      console.error('[audit] unable to record backup failure', auditError);
    }
    if (e instanceof BackupConfigError) return res.status(503).json({ error: e.message });
    return res.status(500).json({ error: 'Backup failed. See server logs.' });
  } finally {
    backupRunning = false;
  }
});

export default router;
