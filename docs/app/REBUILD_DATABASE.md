# Rebuild the production database (steps only)

The Render free Postgres expired on 4 Oct 2026 and was deleted. Rehearsed end to end on a local
PostgreSQL 16: bootstrap, first admin, API start, admin login, subject, class-teacher account,
teacher password change, student, score, permission refusals. No database errors in the API log.

Never paste a connection string or password into chat, a commit or a ticket.

## 1. Render dashboard
1. New → PostgreSQL. Name `sts-school-db`, region Frankfurt. Plan: **Free** for now (see "Free plan: upgrade schedule" below; it expires, so the upgrade is mandatory). Wait for Available.
2. On its Info page copy the **Internal** and **External** database URLs. The last path segment is the
   database name (needed in step 2.5).
3. Backend service `sts-school-backend` → Environment:
   - `DATABASE_URL` = the **Internal** URL.
   - `NODE_ENV` = `production`.
   - `JWT_SECRET` and `JWT_REFRESH_SECRET` present (48+ random characters each).
4. Do not save yet; finish step 2 first.

## 2. Your PC (PowerShell, repo root, `git pull`, `npm ci` done)
1. `$env:DATABASE_URL="<External URL>"; $env:NODE_ENV="production"`
2. `npm run db:bootstrap --workspace backend`
   Expect: `Clean bootstrap complete: schema, 2 schools, 18 classes, 6 terms. No users or curriculum seeded.`
   Running it again prints `already applied` and changes nothing.
3. `$env:STS_ADMIN_PW="<12+ chars, at least 3 of: lower, upper, digit, symbol>"`
4. Dry run: `npm run db:create-first-admin --workspace backend -- --username <name> --school secondary --password-env STS_ADMIN_PW`
5. Write: repeat step 4 and append `--apply --acknowledge-production --confirm-database <database name>`
   It refuses if any user already exists.
6. `Remove-Item Env:STS_ADMIN_PW; Remove-Item Env:DATABASE_URL`

## 3. Render again
1. Save the backend Environment changes. Wait for the deploy to show Live.
2. Log in as the new admin in the app.

## 4. Populate (admin in the app)
1. Subjects per school.
2. One teacher account per class. Class teachers get a username derived from the class (SS 1 → `ss1`), with the
   password you set; they must change it at first login.
3. Students per class, then parents.

## 5. Backups
Free Render Postgres has no backups. Until upgraded, the weekly dump below is the only backup.
1. Weekly (PowerShell, `pg_dump` from the PostgreSQL client tools installed):
   `$env:DATABASE_URL="<External URL>"; pg_dump $env:DATABASE_URL -Fc -f ("sts-" + (Get-Date -Format yyyyMMdd) + ".dump"); Remove-Item Env:DATABASE_URL`
2. Keep the last 4 dumps somewhere other than Render (another drive and a cloud folder).
3. Restore test once, right after the first dump: restore into a throwaway local database with `pg_restore --no-owner -d <local db> <file>`.
4. After upgrading to a paid plan, confirm Render's automatic backups are on and keep the weekly dump.

## Free plan: upgrade schedule
Free Render Postgres **expires 30 days after creation**. Expired databases are inaccessible; there is a 14-day
grace period to upgrade; after that the database and all data are deleted (day 44). It is also limited to 1 GB
and Render may restart it or do maintenance at any time.

Day 0 is the creation date shown on the database page.

Make the reminders (writes `sts-db-expiry-<date>.ics` in the current folder; import it into Google Calendar or Outlook):
`node scripts/ops/expiry-calendar.mjs 2026-11-12`

Example if created 12 Nov 2026:

| Day | Date | Action |
|---|---|---|
| 0 | 12 Nov | Create, run section 2, first dump + restore test |
| 7, 14 | 19 Nov, 26 Nov | Weekly dump |
| 21 | 3 Dec | Decide the paid plan, make sure payment method works |
| 25 | 7 Dec | **Upgrade the database to a paid instance type** (Render dashboard → the database → change instance type) |
| 28 | 10 Dec | Check: database shows a paid type, URLs still work, login works, backups on |
| 30 | 12 Dec | **Expiry. Do not reach this day on Free.** |
| 44 | 26 Dec | Absolute deadline; data deleted after this |

Steps for the upgrade day:
1. Take a fresh dump first.
2. Upgrade the database in place from the dashboard.
3. Confirm the backend `DATABASE_URL` still works (log in as a teacher). If the URL changed, update it and save.
4. Confirm automatic backups are enabled.
5. Optionally upgrade the backend web service so it stops sleeping.

Missed the schedule? Upgrade during the 14-day grace period; after day 44 it cannot be recovered, so restore from the latest dump into a new database instead.

## If the API logs a certificate error after step 3
1. Preferred: set `DATABASE_SSL_CA` to the provider's CA certificate (PEM; `\n` allowed for newlines).
2. Temporary only: `DATABASE_SSL_REJECT_UNAUTHORIZED=false` (logs a warning at startup).

## Not covered here
Curriculum import (SS 1 content is still awaiting approvals and the English workflow decision).
