import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { generateTempPassword } from './password.js';
import { audit } from './audit.js';
import type { AuthUser } from '../types/index.js';

// ── Parent auto-provisioning ─────────────────────────────────────────────────
// Before this, a parent account had to be created by hand (POST /admin/users)
// and separately linked to a student (POST /students/:id/link-parent) — two
// manual steps with nothing capturing parent info at the point a student is
// added. This collapses that into one: give a student's parent_phone at
// creation time, and a parent account is found-or-created and linked
// automatically.
//
// De-duplication is by phone number, scoped to the school — two students
// with the same parent_phone at the same school are treated as siblings and
// share one parent account, rather than getting a duplicate per child.

function usernameFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // Last 10 digits is enough to be practically unique per family without
  // depending on whether a country code/leading 0 was included.
  return `parent${digits.slice(-10)}`;
}

// Matches on the last 10 digits only — "+2348012345678" and "08012345678"
// are the same Nigerian number typed two different ways, and a sibling's
// admission shouldn't create a duplicate parent account just because the
// second admin typed the phone with a different prefix.
function phoneMatchSuffix(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

export interface ProvisionedParent {
  id: string;
  username: string;
  /** Only set when a new account was created — omitted when an existing
   *  parent (e.g. a sibling's) was found and just linked instead. */
  temporary_password?: string;
}

export async function findOrCreateParent(
  actor: AuthUser | null,
  params: { school_code: string; parent_name?: string | null; parent_phone: string; parent_email?: string | null },
): Promise<ProvisionedParent> {
  const phone = params.parent_phone.trim();
  const suffix = phoneMatchSuffix(phone);

  const { rows: existing } = await query(
    `SELECT id, username FROM users
     WHERE role='parent' AND school_code=$1 AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10) = $2
     LIMIT 1`,
    [params.school_code, suffix],
  );
  if (existing[0]) {
    return { id: existing[0].id, username: existing[0].username };
  }

  const baseUsername = usernameFromPhone(phone);
  let uname = baseUsername;
  // Extremely unlikely (would need two different phone numbers whose last
  // 10 digits collide) but cheap to guard against rather than 500 on it.
  for (let suffix = 1; ; suffix++) {
    const { rows: taken } = await query('SELECT id FROM users WHERE username=$1', [uname]);
    if (!taken.length) break;
    uname = `${baseUsername}${suffix}`;
  }

  const temporary_password = generateTempPassword();
  const hash = await bcrypt.hash(temporary_password, 10);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,phone,email,must_change_pw)
     VALUES($1,$2,'parent',$3,$4,$5,$6,TRUE) RETURNING id,username`,
    [uname, hash, params.parent_name ?? null, params.school_code, phone, params.parent_email ?? null],
  );
  await audit(actor, 'add_parent_auto', 'user', rows[0].id, `auto-provisioned for phone ${phone}`);
  return { id: rows[0].id, username: rows[0].username, temporary_password };
}

export async function linkParentToStudent(parentId: string, studentId: string): Promise<void> {
  await query(
    `INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
    [parentId, studentId],
  );
}
