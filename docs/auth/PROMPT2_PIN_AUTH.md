# Prompt 2A — PIN authentication (backend)

Scope: backend only. Mobile is Prompt 2B. Operations Admin, Finance Admin permissions and registration redesign (Prompt 3) are untouched.

## Deploy steps (in order)
1. Generate the pepper: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
2. Render → Environment → add `PIN_PEPPER` (min 32 chars). Never commit it. Production refuses to start without it.
3. Ship the mobile build (2B) first or together. The old app cannot set a PIN, so an account the server flags (see "PIN requirement" below) is blocked on it until it updates. Existing students, parents and teachers are not flagged.
4. Deploy backend. Migrations `0019_pin_auth_sessions.sql` then `0020_pin_gate_only_for_admin_issued_credentials.sql` run. Both are additive/idempotent; 0020 clears the bulk PIN-setup flag 0019 sets, so no existing user is forced to change a PIN.
5. Do NOT run `docs/auth/held/0021_global_username_unique.sql.HELD` until the duplicate check is reviewed (renumbered from 0020 because migration 0020 is now the PIN-gate correction; the runner requires gap-free numbering).

## Pepper recovery
- Lost or changed pepper: every six-digit PIN stops verifying.
- Fix: restore the old value. If it is gone, an admin issues a temporary PIN to each user (`POST /admin/users/:id/reset-password`).
- Admin and Finance Admin passwords are not peppered and are unaffected.
- Never rotate the pepper without a planned mass reset.

## Rules
- Public roles: exactly six digits; trivial PINs rejected (repeats, runs, mirrors, repeating blocks, common lists).
- Hash: bcrypt over HMAC-SHA256(pepper, PIN). Missing pepper → 503, never unpeppered.
- Admin / Finance Admin: existing credential format, no PIN rule.
- Username normalisation everywhere: `lower(btrim(username))`.

## Sessions
- Remember me 30 days; otherwise 12 hours. Absolute expiry.
- Refresh token: opaque, stored as SHA-256, rotated each use, 30 s grace, reuse after grace revokes the session.
- Access token carries `sid`; checked on every request. Logout, PIN change and admin reset invalidate it at once.
- Max 10 active sessions per account. Same device re-login replaces its own session.
- PIN change revokes other sessions. Admin reset revokes all.
- Legacy JWT refresh tokens are exchanged once into a session, keeping their original expiry.
- Production rejects access tokens without `sid` (clients refresh and continue). Override: `AUTH_REQUIRE_SESSION_ID=false`.

## PIN requirement (`must_set_pin`)
- Existing students, parents and teachers already hold six-digit PINs. They sign in and go straight to their dashboard (subject to approval status), on any device. Nothing forces a PIN change at first login after this update or on a new device.
- `must_set_pin` is TRUE only for an administrator-issued temporary credential: an administrator PIN reset, an administrator-created teacher, an auto-provisioned parent, and a credential set through activation, self-registration or self-claim. Those users must set their own PIN once.
- Changing a PIN voluntarily is always possible (`POST /auth/pin`, Settings → Change PIN in the app). Current PIN required; other sessions are revoked.
- Legacy-format hashes (`pin_hash_version` NULL, plain bcrypt) of existing six-digit PINs keep verifying unchanged. They are not peppered until the user next sets a PIN.

## Reachable endpoints
- Pending account: `GET /auth/me`, `POST /auth/logout`.
- While `must_set_pin` is TRUE: `GET /auth/me`, `POST /auth/logout`, `POST /auth/pin`.
- Everything else in that state: 403.

## Lockout thresholds
| Layer | Rule |
|---|---|
| Account + device | 5 free failures, then lock 1 → 5 → 15 → 60 → 60 min |
| Account + IP | 10 free failures, same schedule |
| Account pace, unknown devices | 30 attempts/hour, then 1 attempt per 2 min |
| Account pace, known devices | 15 attempts/hour, then 1 attempt per 5 min |
| IP, all accounts | 100 failures / 15 min (successes not counted) |
- Lanes forget failures after 24 h. Success clears that device and IP lane.
- Denied attempts are not recorded, so hammering does not extend a lock.
- Unknown usernames follow identical rules.
- A new phone is never blocked by an administrator requirement; at worst it is paced.

## Known limitations
- One IP (school Wi-Fi) shares the IP lane: 10 failures against one account from one IP lock that IP for that account.
- Device ids are client-generated risk signals only; invalid ids are ignored.
- Attackers cannot block the owner’s known phone, but can slow a new phone to one try per 2 min while under attack.
- Admin / Finance Admin recovery (security question) is unchanged and weaker than the PIN path. It still reveals the question for an admin username that has one.
- Pending students stay exempt while free-launch mode is on. Removal is Prompt 4.
- `POST /admin/users/:id/reset-password` lets a school-less admin reset any account (existing behaviour, unchanged).

## Recovery (students, parents, teachers)
1. Person sees or calls the E.O.
2. Admin calls `POST /admin/users/:id/reset-password`.
3. Response returns a temporary six-digit PIN once (`Cache-Control: no-store`, never logged or audited).
4. All sessions revoked, lockout cleared, audit record `reset_pin` written.
5. User signs in with it and must set a new PIN (this compulsory replacement is kept).
- Public security-question reset is disabled for these roles. Stored answers are kept.

## Tests
`node --import tsx --test --test-concurrency=1 tests/backend-pin-auth.integration.test.mts`
Needs `DATABASE_URL`, `DATABASE_SSL=false`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.

## Transparent PIN rehash (existing users)

Existing students, parents and teachers keep their six-digit PIN. It is stored as a
legacy bcrypt hash (`pin_hash_version IS NULL`) and verifies as before. After a
**successful** sign-in the server re-hashes that same PIN with the approved scheme
(`bcrypt(HMAC-SHA256(PIN_PEPPER, "sts-pin:v1:"+pin))`, `pin_hash_version = 1`).
Nobody is asked to change anything.

- Implemented in `backend/src/utils/pinRehash.ts`, called from `POST /auth/login` only after the
  credential is proven and the account is active.
- Compare-and-swap `UPDATE` on the exact verified hash: a concurrent PIN change, activation or
  administrator reset wins and nothing is overwritten.
- Best effort and non-throwing: a missing `PIN_PEPPER` or a database error leaves the old hash in
  place. No unpeppered fallback, no failed attempt recorded, no secrets logged.
- Skipped for administrator-issued temporary credentials (`must_set_pin` / `must_change_pw`),
  for `admin` and `finance_admin`, and for non-six-digit legacy passwords.
- `pin_set_at` is written in the same statement. The `users_enforce_pin_state` trigger otherwise
  treats a `password_hash` write as a legacy credential write and sets `must_set_pin = TRUE`.
  Consequence: migration 0020's "never touched" test (`pin_set_at IS NULL`) no longer matches
  rehashed accounts. 0020 runs once, before this code is deployed, so this only matters if it is re-run.
- Deployment: `PIN_PEPPER` must be set on Render first. Until it is, sign-in still works and
  rehash is simply skipped.
