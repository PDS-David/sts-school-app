import bcrypt from 'bcryptjs';
import type { PoolClient } from 'pg';
import { withTransaction } from '../db/pool.js';
import { normalizeAnswer } from './password.js';

export type ActivationResult =
  | { kind: 'activated'; username: string }
  | { kind: 'invalid' }
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
     SELECT NULL,NULL,$1,'user',id,school_code,$3 FROM users WHERE id=$2`,
    [action, userId, detail],
  );
}

function minutesUntil(until: Date | string): number {
  return Math.max(1, Math.ceil((new Date(until).getTime() - Date.now()) / 60_000));
}

/**
 * Verify and consume an activation code while holding the user row lock.
 * Concurrent failures cannot lose counter increments, and only one caller
 * can consume a one-time code and set the initial password.
 */
export async function activateAccount(
  username: string,
  activationCode: string,
  newPassword: string,
): Promise<ActivationResult> {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT id, username, activation_code, activation_fail_count,
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

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const { rows: updated } = await client.query(
      `UPDATE users
       SET password_hash=$1, activation_code=NULL, activation_fail_count=0, activation_locked_until=NULL
       WHERE id=$2 AND activation_code=$3 AND password_hash IS NULL
       RETURNING username`,
      [passwordHash, user.id, activationCode.trim()],
    );
    if (!updated[0]) return { kind: 'invalid' };

    await auditSecurityAttempt(client, 'activation_success', String(user.id));
    return { kind: 'activated', username: updated[0].username };
  });
}

/**
 * Serialize account recovery attempts per user. The row lock protects the
 * failed-answer counter and lockout deadline from concurrent lost updates;
 * the password change and its audit record commit atomically.
 */
export async function resetPasswordWithSecurityAnswer(
  username: string,
  answer: string,
  newPassword: string,
): Promise<PasswordResetResult> {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT id, is_active, access_expires_at, revocation_reason,
              security_answer_hash, must_set_security_question,
              security_answer_fail_count, security_answer_locked_until, school_code
       FROM users WHERE username=$1 FOR UPDATE`,
      [username],
    );
    const user = rows[0];
    if (!user) return { kind: 'invalid' };

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
