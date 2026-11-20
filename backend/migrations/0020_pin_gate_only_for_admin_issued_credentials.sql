-- 0020: stop forcing a PIN change on existing students, parents and teachers.
--
-- Supersedes the "Controlled credential migration" step of 0019, which set
-- must_set_pin = TRUE for every existing student/parent/teacher. Owner decision
-- (Prompt 2B revision): every existing student, parent and teacher already holds
-- a six-digit PIN, so they sign in with it and go straight to their dashboard.
-- There is no first-login (or new-device) PIN change.
--
-- 0019 is NOT edited (applied migrations are checksummed; see README rule 2).
-- This migration undoes only the flags that 0019's bulk backfill could have set.
--
-- A row is cleared only when ALL of these hold, i.e. it is a credential the
-- person already holds and chose, never an administrator-issued temporary one:
--   * public role (student / parent / teacher)
--   * must_set_pin = TRUE and pin_hash_version IS NULL and pin_set_at IS NULL
--     (never touched by a PIN route, so not an administrator PIN reset, which
--     stamps pin_hash_version = 1 and pin_set_at)
--   * must_change_pw = FALSE (an account still on an administrator-issued
--     temporary password keeps its requirement)
--
-- must_set_pin therefore stays TRUE only where an administrator issued a
-- temporary credential: PIN reset (POST /admin/users/:id/reset-password),
-- administrator-created teachers, auto-provisioned parents, and credentials set
-- through activation / self-registration / self-claim (unchanged, see the
-- users_enforce_pin_state trigger from 0019).
--
-- Only the flag is written. Credentials, sessions, usernames, pin_hash_version
-- and the trigger are untouched. Idempotent and safe to re-run.
UPDATE users SET must_set_pin = FALSE
 WHERE role IN ('student','parent','teacher')
   AND must_set_pin = TRUE
   AND pin_hash_version IS NULL
   AND pin_set_at IS NULL
   AND must_change_pw = FALSE
   AND password_hash IS NOT NULL;
