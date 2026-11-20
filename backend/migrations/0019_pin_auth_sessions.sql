-- 0019: six-digit PIN authentication, server-side sessions, layered login throttling.
--
-- ADDITIVE AND IDEMPOTENT. Nothing here deletes, renames, or invalidates an
-- account, credential, or existing session:
--   * password_hash / refresh_token are untouched. Existing credentials keep
--     working and are verified exactly as before until the user sets a PIN.
--   * No username is renamed and NO unique index on usernames is created here.
--     Global username uniqueness is HELD (docs/auth/held/) until the
--     production duplicate check has been reviewed and approved.
--
-- Safe to re-run, and safe to run after backend/schema.sql (which carries the
-- same statements for fresh installs).

-- ── users: PIN state ─────────────────────────────────────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_set_pin BOOLEAN NOT NULL DEFAULT FALSE;
-- NULL = legacy bcrypt credential (any format, unpeppered). 1 = six-digit PIN,
-- bcrypt over HMAC-SHA256(PIN_PEPPER, pin).
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_hash_version SMALLINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_set_at TIMESTAMPTZ;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pin_hash_version_check;
ALTER TABLE users ADD CONSTRAINT users_pin_hash_version_check
  CHECK (pin_hash_version IS NULL OR pin_hash_version = 1);

-- Non-unique lookup index matching the login normalisation exactly
-- (lower(btrim(username))). Not a uniqueness rule.
CREATE INDEX IF NOT EXISTS users_username_norm_idx ON users (lower(btrim(username)));

-- ── Any legacy credential write forces PIN setup (public roles only) ─────────
-- The PIN routes set pin_set_at in the same statement as password_hash. Any
-- OTHER write to password_hash (activation, self-claim, forgot-password,
-- admin create/reset, a future route) leaves pin_set_at unchanged, so it can
-- never leave a legacy-format credential that skips the PIN requirement.
-- admin and finance_admin keep their existing credential arrangements: only
-- the hash-version marker is reset, must_set_pin is never set for them.
CREATE OR REPLACE FUNCTION users_enforce_pin_state() RETURNS trigger AS $$
BEGIN
  IF NEW.password_hash IS DISTINCT FROM OLD.password_hash
     AND NEW.pin_set_at IS NOT DISTINCT FROM OLD.pin_set_at THEN
    NEW.pin_hash_version := NULL;
    IF NEW.role IN ('student','parent','teacher') AND NEW.password_hash IS NOT NULL THEN
      NEW.must_set_pin := TRUE;
    END IF;
  END IF;
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_enforce_pin_state_trg ON users;
CREATE TRIGGER users_enforce_pin_state_trg
  BEFORE UPDATE OF password_hash ON users
  FOR EACH ROW EXECUTE FUNCTION users_enforce_pin_state();

-- ── Controlled credential migration (no one is locked out) ───────────────────
-- Existing users keep logging in with their current credential. After that
-- verification succeeds, the server requires a new six-digit PIN. Only flags.
UPDATE users SET must_set_pin = TRUE
 WHERE role IN ('student','parent','teacher')
   AND password_hash IS NOT NULL
   AND pin_hash_version IS NULL
   AND must_set_pin = FALSE;

-- ── Server-side sessions (multi-device, rotation, revocation) ────────────────
CREATE TABLE IF NOT EXISTS auth_sessions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_hash       TEXT NOT NULL,        -- SHA-256 of the opaque refresh token
  prev_refresh_hash  TEXT,                 -- previous token, honoured only inside the rotation grace window
  prev_rotated_at    TIMESTAMPTZ,
  legacy_refresh_sha TEXT,                 -- SHA-256 of a pre-migration JWT refresh token exchanged into this session
  device_id          TEXT,                 -- client-generated risk signal, never proof of identity
  device_label       TEXT,
  ip                 TEXT,
  remember_me        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at         TIMESTAMPTZ NOT NULL, -- absolute cap: 30 days (remember me) / 12 hours
  revoked_at         TIMESTAMPTZ,
  revoked_reason     TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_sessions_refresh_hash_uq ON auth_sessions (refresh_hash);
CREATE UNIQUE INDEX IF NOT EXISTS auth_sessions_legacy_sha_uq ON auth_sessions (legacy_refresh_sha) WHERE legacy_refresh_sha IS NOT NULL;
CREATE INDEX IF NOT EXISTS auth_sessions_prev_hash_idx ON auth_sessions (prev_refresh_hash) WHERE prev_refresh_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS auth_sessions_user_active_idx ON auth_sessions (user_id, last_used_at DESC) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS auth_sessions_user_device_idx ON auth_sessions (user_id, device_id) WHERE device_id IS NOT NULL;

-- ── Layered login throttling ─────────────────────────────────────────────────
-- account_key = SHA-256 of the normalised username for EVERY attempt, whether
-- or not the account exists, so throttle behaviour never reveals existence.
CREATE TABLE IF NOT EXISTS auth_login_lanes (
  lane_key        TEXT PRIMARY KEY,         -- 'dev:<account>:<hash>' or 'ip:<account>:<hash>'
  account_key     TEXT NOT NULL,
  fail_count      INTEGER NOT NULL DEFAULT 0,
  locked_until    TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_login_lanes_account_idx ON auth_login_lanes (account_key);

CREATE TABLE IF NOT EXISTS auth_login_attempts (
  id           BIGSERIAL PRIMARY KEY,
  account_key  TEXT NOT NULL,
  lane         TEXT NOT NULL CHECK (lane IN ('known','unknown')),
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_login_attempts_window_idx ON auth_login_attempts (account_key, lane, attempted_at DESC);

-- ── PIN recovery requests are NOT created here (administrator-verified reset
-- uses the existing admin reset route; see docs/auth/PROMPT2_PIN_AUTH.md).
