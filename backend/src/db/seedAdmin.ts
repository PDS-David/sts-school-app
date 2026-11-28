/**
 * The seeded administrator account (seed.ts).
 *
 * Admin@1234 is a published default credential, so the seeded account must
 * replace it at first sign-in: must_change_pw = TRUE on insert, and again when
 * the conflict branch re-installs the same default (re-running the seed on an
 * existing database puts the published password back, so it puts the flag back).
 *
 * The conflict target is the partial unique index users_username_global_non_teacher_uq
 * (migration 0011 dropped the old plain UNIQUE(username), so ON CONFLICT(username) errors).
 *
 * This is a seed-only rule. A password an administrator issues through
 * POST /admin/users/:id/reset-password is a normal password and never forces a
 * change; tests/backend-legacy-pin-migration.integration.test.mts protects both
 * sides of that distinction.
 */
import bcrypt from 'bcryptjs';

export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'Admin@1234';

type Run = (sql: string, params: unknown[]) => Promise<unknown>;

export async function seedDefaultAdmin(run: Run, username: string = DEFAULT_ADMIN_USERNAME, bcryptRounds = 10): Promise<void> {
  const hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, bcryptRounds);
  await run(
    `INSERT INTO users(username,password_hash,role,full_name,must_change_pw)
     VALUES($2,$1,'admin','System Administrator',TRUE)
     ON CONFLICT (lower(username)) WHERE role <> 'teacher' DO UPDATE SET password_hash=$1, must_change_pw=TRUE,
       is_active=TRUE, revocation_reason=NULL, access_expires_at=NULL`,
    [hash, username],
  );
}
