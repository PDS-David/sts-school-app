# Rebuild the production database (steps only)

The Render free Postgres expired on 4 Oct 2026 and was deleted. Rehearsed end to end on a local
PostgreSQL 16: bootstrap, first admin, API start, admin login, subject, class-teacher account,
teacher password change, student, score, permission refusals. No database errors in the API log.

Never paste a connection string or password into chat, a commit or a ticket.

## 1. Render dashboard
1. New → PostgreSQL. Name `sts-school-db`, region Frankfurt, a **paid** plan (not Free). Wait for Available.
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
1. Confirm Render's automatic backups are on for the paid plan.
2. Weekly: `pg_dump "<External URL>" -Fc -f sts-YYYYMMDD.dump`, stored off Render.

## If the API logs a certificate error after step 3
1. Preferred: set `DATABASE_SSL_CA` to the provider's CA certificate (PEM; `\n` allowed for newlines).
2. Temporary only: `DATABASE_SSL_REJECT_UNAUTHORIZED=false` (logs a warning at startup).

## Not covered here
Curriculum import (SS 1 content is still awaiting approvals and the English workflow decision).
