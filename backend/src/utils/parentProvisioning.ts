import bcrypt from 'bcryptjs';
import type { PoolClient } from 'pg';
import { withTransaction } from '../db/pool.js';
import { generateTempPassword } from './password.js';

// De-duplication is global across both campuses: a parent with children at
// primary and secondary must keep one account so /students/wards can return
// every linked child. Match the last 10 digits to normalize Nigerian local
// and international phone formats.
function phoneMatchSuffix(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    throw new Error('Parent phone must contain between 10 and 15 digits');
  }
  return digits.slice(-10);
}

function usernameFromPhone(phone: string): string {
  return `parent${phoneMatchSuffix(phone)}`;
}

export interface ProvisionedParent {
  id: string;
  username: string;
  /** Only set when a new account was created. */
  temporary_password?: string;
  /** Internal result used for audit logging; strip before returning the API response. */
  created: boolean;
}

export interface NewStudentRecord {
  full_name: string;
  class_name: string;
  school_code: string;
  gender?: string | null;
  date_of_birth?: string | null;
  admission_number?: string | null;
}

export interface ParentProvisioningInput {
  school_code: string;
  parent_name?: string | null;
  parent_phone: string;
  parent_email?: string | null;
}

/**
 * Find or create a parent using the caller's transaction client.
 *
 * The transaction-scoped advisory lock serializes concurrent attempts for
 * the same normalized phone suffix across both school campuses. The second
 * request rechecks users after acquiring the lock and reuses the committed
 * parent instead of creating a duplicate.
 */
export async function findOrCreateParent(
  client: PoolClient,
  params: ParentProvisioningInput,
): Promise<ProvisionedParent> {
  const phone = params.parent_phone.trim();
  const suffix = phoneMatchSuffix(phone);

  await client.query(
    'SELECT pg_advisory_xact_lock(hashtext($1)::bigint)',
    [suffix],
  );

  const { rows: existing } = await client.query(
    `SELECT id, username FROM users
     WHERE role='parent' AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10) = $1
     LIMIT 1`,
    [suffix],
  );
  if (existing[0]) {
    return { id: existing[0].id, username: existing[0].username, created: false };
  }

  const baseUsername = usernameFromPhone(phone);
  let username = baseUsername;
  for (let suffixNumber = 1; ; suffixNumber++) {
    const { rows: taken } = await client.query(
      'SELECT id FROM users WHERE username=$1',
      [username],
    );
    if (!taken.length) break;
    username = `${baseUsername}${suffixNumber}`;
  }

  const temporary_password = generateTempPassword();
  const hash = await bcrypt.hash(temporary_password, 10);
  const { rows } = await client.query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,phone,email,must_change_pw)
     VALUES($1,$2,'parent',$3,$4,$5,$6,TRUE) RETURNING id,username`,
    [username, hash, params.parent_name ?? null, params.school_code, phone, params.parent_email ?? null],
  );

  return {
    id: rows[0].id,
    username: rows[0].username,
    temporary_password,
    created: true,
  };
}

export async function linkParentToStudent(
  client: PoolClient,
  parentId: string,
  studentId: string,
): Promise<void> {
  await client.query(
    'INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2) ON CONFLICT DO NOTHING',
    [parentId, studentId],
  );
}

/**
 * Create a student and, when supplied, provision/link the parent in one
 * transaction. Any failure in parent creation or linking rolls back the
 * student insert as well, so a retry cannot encounter a ghost student row.
 */
export async function createStudentWithParent(
  student: NewStudentRecord,
  parentInput?: ParentProvisioningInput,
): Promise<{ student: Record<string, unknown>; parent?: ProvisionedParent }> {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO students(full_name,class_name,school_code,gender,date_of_birth,admission_number)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        student.full_name,
        student.class_name,
        student.school_code,
        student.gender ?? null,
        student.date_of_birth ?? null,
        student.admission_number ?? null,
      ],
    );

    let parent: ProvisionedParent | undefined;
    if (parentInput) {
      parent = await findOrCreateParent(client, parentInput);
      await linkParentToStudent(client, parent.id, String(rows[0].id));
    }

    return { student: rows[0], parent };
  });
}
