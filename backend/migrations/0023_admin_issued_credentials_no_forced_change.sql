-- 0023: administrator-issued temporary credentials no longer force a change.
--
-- Owner decision (Nov 2026, PR #1062):
--   * Temporary six-digit PINs an administrator issues to teachers, students
--     and parents work as normal PINs: straight to the dashboard, no forced
--     first-sign-in change. Users may still change them voluntarily.
--   * Temporary passwords an administrator issues to Administrator and
--     Finance Administrator accounts likewise work as normal passwords.
--   * Legacy credentials that are NOT six digits (old four-digit teacher codes,
--     eight-digit/character temporary credentials, older passwords) still lead
--     to a mandatory six-digit PIN. That is decided at sign-in from the
--     credential just proven (POST /auth/login), because a hash does not reveal
--     how many digits it protects. This migration does not touch those rows.
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

-- Administrator and Finance Administrator temporary passwords.
UPDATE users SET must_change_pw = FALSE
 WHERE role IN ('admin','finance_admin')
   AND must_change_pw = TRUE;
