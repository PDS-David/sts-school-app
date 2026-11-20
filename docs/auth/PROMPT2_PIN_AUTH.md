# Prompt 2A — PIN authentication (backend)

Scope: backend only. Mobile is Prompt 2B. Operations Admin, Finance Admin permissions and registration redesign (Prompt 3) are untouched.

## Deploy steps (in order)
1. Generate the pepper: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
2. Render → Environment → add `PIN_PEPPER` (min 32 chars). Never commit it. Production refuses to start without it.
3. Ship the mobile build (2B) first or together. Until then the old app cannot set a PIN, and flagged users are blocked by the server.
4. Deploy backend. Migration `0019_pin_auth_sessions.sql` runs. It is additive and re-runnable.
5. Do NOT run `docs/auth/held/0020_global_username_unique.sql.HELD` until the duplicate check is reviewed.

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

## Reachable endpoints
- Pending account: `GET /auth/me`, `POST /auth/logout`.
- Before PIN setup: `GET /auth/me`, `POST /auth/logout`, `POST /auth/pin`.
- Everything else: 403.

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
5. User signs in with it and must set a new PIN.
- Public security-question reset is disabled for these roles. Stored answers are kept.

## Tests
`node --import tsx --test --test-concurrency=1 tests/backend-pin-auth.integration.test.mts`
Needs `DATABASE_URL`, `DATABASE_SSL=false`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
