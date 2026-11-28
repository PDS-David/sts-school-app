-- 0023: administrator-issued temporary credentials no longer force a change.
--
-- Owner decision (Nov 2026, PR #1062):
--   * Temporary six-digit PINs an administrator issues to teachers, students
--     and parents work as normal PINs: straight to the dashboard, no forced
--     first-sign-in change. Users may still change them voluntarily.
--   * Temporary passwords an administrator issues to Administrator and
--     Finance Administrator accounts likewise work as normal passwords FROM NOW
--     ON (POST /admin/users/:id/reset-password no longer sets the flag).
--   * Legacy credentials that are NOT six digits (old four-digit teacher codes,
--     eight-digit/character temporary credentials, older passwords) still lead
--     to a mandatory six-digit PIN. That is decided at sign-in from the
--     credential just proven (POST /auth/login), because a hash does not reveal
--     how many digits it protects. This migration does not touch those rows.
--
-- ADMINISTRATOR / FINANCE ADMINISTRATOR FLAGS ARE NOT CLEARED IN BULK.
-- must_change_pw = TRUE on those roles can be a legitimate, still-wanted
-- security requirement (for example a default or bootstrap credential that
-- must be replaced), so it is cleared only where the audit log shows the flag
-- came from an OLD administrator-issued temporary-password reset:
--   audit_log.action = 'reset_password', entity = 'user', entity_id = the
--   target account, outcome = 'success', and the old detail text
--   'administrator reset user password; forced password change on next login'.
--   The new reset route writes a different detail ('... temporary password
--   issued; no forced change on next login'), so the two are distinguishable.
--   The metadata is NOT used: the audit writer redacts any metadata value whose
--   key contains "password", so must_change_password is stored as '[REDACTED]'.
-- The LATEST reset_password event for the account must be an old-style one: a
-- newer-style reset supersedes it. Nothing else in the application sets
-- must_change_pw = TRUE on these roles (bootstrap and seed scripts insert FALSE).
--
-- Known limitation: a flag with NO matching old reset event is left exactly as
-- it is. That covers the seeded/default administrator, accounts created with a
-- temporary password before audit logging existed, and any flag set by hand in
-- the database. Those cannot be told apart from a deliberate requirement, so
-- they stay forced until the holder changes the password (or an administrator
-- issues a new temporary password, which no longer forces a change).
--
-- Flags only. No credential, session, username, student record, parent-ward
-- link, teacher assignment, school or class association is written. 0019, 0020
-- and the users_enforce_pin_state trigger are unchanged. Idempotent.

-- Public roles holding a peppered six-digit PIN (pin_hash_version = 1). Every
-- such row was written by a PIN route — administrator reset, administrator
-- teacher creation, or the user's own setup — so it is six digits by
-- construction and never a legacy format that still needs replacing.
UPDATE users SET must_set_pin = FALSE, must_change_pw = FALSE
 WHERE role IN ('student','parent','teacher')
   AND pin_hash_version = 1
   AND (must_set_pin = TRUE OR COALESCE(must_change_pw, FALSE) = TRUE);

-- Administrator and Finance Administrator: only flags attributable to an old
-- administrator-issued reset event (see the header). Everything else untouched.
UPDATE users u SET must_change_pw = FALSE
 WHERE u.role IN ('admin','finance_admin')
   AND u.must_change_pw = TRUE
   AND (
     SELECT (al.detail = 'administrator reset user password; forced password change on next login')
       FROM audit_log al
      WHERE al.action = 'reset_password'
        AND al.entity = 'user'
        AND al.entity_id = u.id::text
        AND al.outcome = 'success'
      ORDER BY al.id DESC
      LIMIT 1
   ) IS TRUE;
