import bcrypt from 'bcryptjs';
import type { PoolClient } from 'pg';
import { withTransaction } from '../db/pool.js';
import { normalizeAnswer } from './password.js';
import { PIN_HASH_VERSION, checkPin, hashPin } from './pin.js';

/** Roles that hold a six-digit PIN (mirrors PIN_ROLES in middleware/auth.ts). */
const PIN_ROLES = new Set(['student', 'parent', 'teacher']);

export type ActivationResult =
  | { kind: 'activated'; username: string }
  | { kind: 'invalid' }
  // Correct code, but the chosen credential breaks the policy for this role
  // (six-digit PIN for student/parent/teacher, 8+ character password for
  // administrator roles). The code is NOT consumed and no failure is counted.
  | { kind: 'invalid_secret'; message: string }
  | { kind: 'locked'; retryAfterMinutes: number };

export type PasswordResetResult =
  | { kind: 'reset' }
  | { kind: 'invalid' }
  | { kind: 'ineligible' }
  | { kind: 'inactive'; message: string }
  | { kind: 'expired'; message: string }
  | { kind: 'locked'; retryAfterMinutes: number };

async function auditSecurityAttempt(
  client: PoolClient,
  action: string,
  userId: string,
  detail = '',
): Promise<void> {
  await client.query(
    `INSERT INTO audit_log(actor_id,actor_name,action,entity,entity_id,school_code,detail)
     SELECT NULL,NULL,$1,'user',id::text,school_code,$3 FROM users WHERE id=$2`,
    [action, userId, detail],
  );
}

function minutesUntil(until: Date | string): number {
  return Math.max(1, Math.ceil((new Date(until).getTime() - Date.now()) / 60_000));
}

export async function activateAccount(
  username: string,
  activationCode: string,
  newPassword: string,
): Promise<ActivationResult> {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT id, username, role, activation_code, activation_fail_count,
              activation_locked_until, password_hash
       FROM users WHERE username=$1 FOR UPDATE`,
      [username],
    );
    const user = rows[0];
    if (!user || !user.activation_code || user.password_hash) return { kind: 'invalid' };

    if (user.activation_locked_until && new Date(user.activation_locked_until).getTime() > Date.now()) {
      return { kind: 'locked', retryAfterMinutes: minutesUntil(user.activation_locked_until) };
    }

    if (user.activation_code !== activationCode.trim()) {
      const failures = (user.activation_fail_count ?? 0) + 1;
      if (failures >= 5) {
        await client.query(
          `UPDATE users SET activation_fail_count=0,
             activation_locked_until=now() + interval '1 hour' WHERE id=$1`,
          [user.id],
        );
      } else {
        await client.query('UPDATE users SET activation_fail_count=$1 WHERE id=$2', [failures, user.id]);
      }
      await auditSecurityAttempt(client, 'activation_failed', String(user.id), `attempt ${failures}`);
      return { kind: 'invalid' };
    }

    // Students, parents and teachers choose their permanent six-digit PIN here
    // (peppered hash, no second "set your PIN" step). Administrator roles keep
    // the 8+ character password rule unchanged.
    let passwordHash: string;
    let pinHashVersion: number | null = null;
    if (PIN_ROLES.has(String(user.role))) {
      const check = checkPin(newPassword);
      if (!check.ok) return { kind: 'invalid_secret', message: (check as { ok: false; message: string }).message };
      passwordHash = await hashPin(newPassword); // PinConfigError propagates (route answers 503)
      pinHashVersion = PIN_HASH_VERSION;
    } else {
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return { kind: 'invalid_secret', message: 'New password must be at least 8 characters' };
      }
      passwordHash = await bcrypt.hash(newPassword, 10);
    }
    // pin_set_at moves only for a PIN, so the users_enforce_pin_state trigger
    // treats it as a chosen PIN (must_set_pin stays FALSE) rather than a legacy write.
    const { rows: updated } = await client.query(
      `UPDATE users
       SET password_hash=$1, activation_code=NULL, activation_fail_count=0, activation_locked_until=NULL,
           pin_hash_version=$4::int,
           pin_set_at=CASE WHEN $4::int IS NULL THEN pin_set_at ELSE clock_timestamp() END,
           must_set_pin=CASE WHEN $4::int IS NULL THEN must_set_pin ELSE FALSE END
       WHERE id=$2 AND activation_code=$3 AND password_hash IS NULL
       RETURNING username`,
      [passwordHash, user.id, activationCode.trim(), pinHashVersion],
    );
    if (!updated[0]) return { kind: 'invalid' };

    await auditSecurityAttempt(client, 'activation_success', String(user.id));
    return { kind: 'activated', username: updated[0].username };
  });
}

export async function resetPasswordWithSecurityAnswer(
  username: string,
  answer: string,
  newPassword: string,
): Promise<PasswordResetResult> {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT id, role, is_active, access_expires_at, revocation_reason,
              security_answer_hash, must_set_security_question,
              security_answer_fail_count, security_answer_locked_until, school_code
       FROM users WHERE lower(btrim(username))=$1 FOR UPDATE`,
      [username],
    );
    // Exactly one account, and only administrator roles: students, parents and
    // teachers recover through an administrator-issued temporary PIN instead.
    const user = rows.length === 1 ? rows[0] : null;
    if (!user || (user.role !== 'admin' && user.role !== 'finance_admin')) return { kind: 'invalid' };

    if (!user.is_active) {
      return {
        kind: 'inactive',
        message: user.revocation_reason
          ? `Your account was deactivated: ${user.revocation_reason}. Contact your school admin.`
          : 'Your account is deactivated. Contact your school admin.',
      };
    }
    if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
      return {
        kind: 'expired',
        message: user.revocation_reason
          ? `Your access period has ended: ${user.revocation_reason}. Contact your school admin.`
          : 'Your access period has ended. Contact your school admin to reactivate your account.',
      };
    }
    if (user.must_set_security_question || !user.security_answer_hash) return { kind: 'ineligible' };

    if (user.security_answer_locked_until && new Date(user.security_answer_locked_until).getTime() > Date.now()) {
      return { kind: 'locked', retryAfterMinutes: minutesUntil(user.security_answer_locked_until) };
    }

    const correct = await bcrypt.compare(normalizeAnswer(answer), user.security_answer_hash);
    if (!correct) {
      const failures = (user.security_answer_fail_count ?? 0) + 1;
      if (failures >= 5) {
        await client.query(
          `UPDATE users SET security_answer_fail_count=0,
             security_answer_locked_until=now() + interval '1 hour' WHERE id=$1`,
          [user.id],
        );
      } else {
        await client.query('UPDATE users SET security_answer_fail_count=$1 WHERE id=$2', [failures, user.id]);
      }
      await auditSecurityAttempt(client, 'forgot_password_failed', String(user.id), `attempt ${failures}`);
      return { kind: 'invalid' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await client.query(
      `UPDATE users SET password_hash=$1, must_change_pw=FALSE,
         security_answer_fail_count=0, security_answer_locked_until=NULL
       WHERE id=$2`,
      [passwordHash, user.id],
    );
    await auditSecurityAttempt(client, 'forgot_password_reset', String(user.id));
    return { kind: 'reset' };
  });
}
