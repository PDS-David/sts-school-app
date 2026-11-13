import type { PoolClient } from 'pg';
import { withTransaction } from '../db/pool.js';
import { usernameBaseFromName } from './password.js';

type SelfClaimInput = {
  schoolCode: string;
  className: string;
  studentId: string;
  admissionNumber: string;
  accessCode: string;
  passwordHash: string;
};

export type SelfClaimResult =
  | { kind: 'claimed'; username: string }
  | { kind: 'invalid_code' }
  | { kind: 'locked'; retryAfterMinutes: number }
  | { kind: 'student_not_found' };

type SelfRegistrationInput = {
  role: 'student' | 'parent' | 'teacher';
  fullName: string;
  phone: string;
  schoolCode: string;
  username: string;
  passwordHash: string;
  admissionNumber?: string;
  wardAdmissionNumber?: string;
};

export type SelfRegistrationResult =
  | { kind: 'registered'; username: string }
  | { kind: 'username_taken' }
  | { kind: 'school_not_found' }
  | { kind: 'student_not_found' }
  | { kind: 'parent_phone_exists' };

async function acquireKeyLock(client: PoolClient, key: string): Promise<void> {
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1)::bigint)', [key]);
}

async function writeSecurityAudit(
  client: PoolClient,
  action: string,
  entity: string,
  entityId: string,
  schoolCode: string | null,
  detail: string,
): Promise<void> {
  await client.query(
    `INSERT INTO audit_log(actor_id,actor_name,action,entity,entity_id,school_code,detail)
     VALUES(NULL,NULL,$1,$2,$3,$4,$5)`,
    [action, entity, entityId, schoolCode, detail],
  );
}

/**
 * Claim an unlinked student account as one serializable unit of work.
 * The class-code row serializes failed-attempt counters; the student row
 * serializes competing claims; advisory locks serialize generated usernames.
 */
export async function claimStudentAccount(input: SelfClaimInput): Promise<SelfClaimResult> {
  return withTransaction(async (client) => {
    const { rows: codeRows } = await client.query(
      `SELECT id, code, fail_count, locked_until
       FROM class_access_codes
       WHERE school_code=$1 AND class_name=$2
       FOR UPDATE`,
      [input.schoolCode, input.className],
    );
    const code = codeRows[0];
    if (!code) return { kind: 'invalid_code' };

    if (code.locked_until && new Date(code.locked_until).getTime() > Date.now()) {
      const retryAfterMinutes = Math.ceil(
        (new Date(code.locked_until).getTime() - Date.now()) / 60_000,
      );
      return { kind: 'locked', retryAfterMinutes };
    }

    if (code.code !== input.accessCode.trim()) {
      const failures = (code.fail_count ?? 0) + 1;
      if (failures >= 5) {
        await client.query(
          `UPDATE class_access_codes
           SET fail_count=0, locked_until=now() + interval '1 hour'
           WHERE id=$1`,
          [code.id],
        );
      } else {
        await client.query(
          'UPDATE class_access_codes SET fail_count=$1 WHERE id=$2',
          [failures, code.id],
        );
      }
      await writeSecurityAudit(
        client,
        'self_claim_failed',
        'class_access_code',
        String(code.id),
        input.schoolCode,
        `attempt ${failures}`,
      );
      return { kind: 'invalid_code' };
    }

    const { rows: studentRows } = await client.query(
      `SELECT id, full_name
       FROM students
       WHERE id=$1 AND school_code=$2 AND class_name=$3
         AND user_id IS NULL AND admission_number=$4 AND deleted_at IS NULL
       FOR UPDATE`,
      [input.studentId, input.schoolCode, input.className, input.admissionNumber.trim()],
    );
    const student = studentRows[0];
    if (!student) return { kind: 'student_not_found' };

    const baseUsername = usernameBaseFromName(student.full_name);
    await acquireKeyLock(client, `self-claim-username:${baseUsername}`);
    let username = baseUsername;
    for (let suffix = 1; ; suffix++) {
      const { rows: taken } = await client.query('SELECT id FROM users WHERE username=$1', [username]);
      if (!taken.length) break;
      username = `${baseUsername}${suffix}`;
    }

    const { rows: users } = await client.query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,must_change_pw)
       VALUES($1,$2,'student',$3,$4,FALSE)
       RETURNING id,username`,
      [username, input.passwordHash, student.full_name, input.schoolCode],
    );
    const user = users[0];

    const { rows: linked } = await client.query(
      'UPDATE students SET user_id=$1 WHERE id=$2 AND user_id IS NULL RETURNING id',
      [user.id, student.id],
    );
    if (!linked[0]) throw new Error('Student was claimed concurrently; account creation rolled back.');

    await client.query('UPDATE class_access_codes SET fail_count=0 WHERE id=$1', [code.id]);
    await writeSecurityAudit(
      client,
      'self_claim_success',
      'user',
      String(user.id),
      input.schoolCode,
      `student ${student.id} in ${input.schoolCode}/${input.className}`,
    );

    return { kind: 'claimed', username: user.username };
  });
}

/**
 * Create a public self-registration and its enrollment/ward relationship
 * atomically. Advisory locks use the same normalized phone key as admin-side
 * parent provisioning, so both entry points serialize against each other.
 */
export async function registerSelfServiceAccount(
  input: SelfRegistrationInput,
): Promise<SelfRegistrationResult> {
  return withTransaction(async (client) => {
    await acquireKeyLock(client, `self-register-username:${input.username}`);
    const { rows: taken } = await client.query(
      'SELECT id FROM users WHERE username=$1',
      [input.username],
    );
    if (taken[0]) return { kind: 'username_taken' };

    const { rows: schools } = await client.query(
      'SELECT code FROM schools WHERE code=$1',
      [input.schoolCode],
    );
    if (!schools[0]) return { kind: 'school_not_found' };

    let studentId: string | null = null;
    if (input.role === 'student') {
      const { rows } = await client.query(
        `SELECT id FROM students
         WHERE school_code=$1 AND admission_number=$2
           AND user_id IS NULL AND deleted_at IS NULL
         FOR UPDATE`,
        [input.schoolCode, input.admissionNumber],
      );
      if (!rows[0]) return { kind: 'student_not_found' };
      studentId = String(rows[0].id);
    }

    if (input.role === 'parent') {
      const digits = input.phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        throw new Error('Parent phone must contain between 10 and 15 digits.');
      }
      const phoneSuffix = digits.slice(-10);

      // Match the exact lock key used by findOrCreateParent() so the public
      // registration flow cannot race admin-side parent auto-provisioning.
      await acquireKeyLock(client, phoneSuffix);
      const { rows: existingParent } = await client.query(
        `SELECT id FROM users
         WHERE role='parent'
           AND right(regexp_replace(phone,'\\D','','g'),10)=$1
         LIMIT 1
         FOR UPDATE`,
        [phoneSuffix],
      );
      if (existingParent[0]) return { kind: 'parent_phone_exists' };

      const { rows: wards } = await client.query(
        `SELECT id FROM students
         WHERE school_code=$1 AND admission_number=$2 AND deleted_at IS NULL
         FOR UPDATE`,
        [input.schoolCode, input.wardAdmissionNumber],
      );
      if (!wards[0]) return { kind: 'student_not_found' };
      studentId = String(wards[0].id);
    }

    const { rows: users } = await client.query(
      `INSERT INTO users(username,password_hash,role,full_name,phone,school_code,pending_admin_review,must_change_pw)
       VALUES($1,$2,$3,$4,$5,$6,TRUE,FALSE)
       RETURNING id,username`,
      [input.username, input.passwordHash, input.role, input.fullName, input.phone, input.schoolCode],
    );
    const user = users[0];

    if (input.role === 'student') {
      const { rows: linked } = await client.query(
        'UPDATE students SET user_id=$1 WHERE id=$2 AND user_id IS NULL RETURNING id',
        [user.id, studentId],
      );
      if (!linked[0]) throw new Error('Student enrollment was claimed concurrently; registration rolled back.');
    } else if (input.role === 'parent') {
      await client.query(
        'INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2)',
        [user.id, studentId],
      );
    }

    await writeSecurityAudit(
      client,
      'self_register',
      'user',
      String(user.id),
      input.schoolCode,
      `role=${input.role} school=${input.schoolCode}`,
    );

    return { kind: 'registered', username: user.username };
  });
}
