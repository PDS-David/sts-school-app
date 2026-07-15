# Changes in this pass (2026-07-07)

## 1. School branding
- Login, Dashboard, and Report Card were already correctly using logo1.png
  (Model College) and logo2.png (Nur/Pry) — confirmed byte-identical, no
  changes needed there.
- The app icon, splash screen, and Android adaptive icon were still Expo's
  generic default graphic. Replaced with a combined design using both
  school logos side by side (mobile/assets/icon.png, adaptive-icon.png,
  splash.png).

## 2. Admin-issued, time-limited credentials for teachers/parents
- Added `users.access_expires_at` (nullable TIMESTAMPTZ). NULL = no expiry
  (used for admin accounts). Admin sets this when creating or editing a
  teacher/parent user (AdminUsersScreen → "Access Expires On").
- Enforced at login, at refresh, AND on every authenticated request
  (`requireAuth` now checks `is_active` + `access_expires_at` against the DB,
  not just the JWT signature) — so an expired or deactivated account is
  locked out immediately, not just after its access token happens to expire.
- Removed `POST /auth/signup` entirely. Admin (`POST /admin/users`) is now
  the only way a teacher or parent account gets created.

## 3. Parent → multiple children privacy (child-switcher)
- New `GET /students/wards`: returns only the students linked to the calling
  parent via `parent_wards` — used to build the switcher, can't leak another
  family's children.
- New `mobile/src/api/WardContext.tsx`: holds the parent's ward list + which
  one is "selected" (persisted locally). Dashboard shows a chip row per
  child; tapping one switches every parent screen to that child only.
- MyResults, Weekly Efforts, and Finance screens now all read the selected
  ward and scope their requests to it — a parent only ever sees one child's
  data on screen at a time, never a blend of siblings.
- Bug found & fixed along the way: FinanceScreen was calling admin-only
  endpoints (`/admin/finance/...`), so the "Fees" tile was silently broken
  for every non-admin role. Added a new `/finance` router with correct
  per-role scoping (parent → own wards only, student → self only, teacher →
  own school, admin → everything) for reads; admin-only writes
  (mark-paid, create fee item/invoice) stay under `/admin`.

## Migration note
`ALTER TABLE users ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMPTZ;`
is included at the end of the users table block in schema.sql, so re-running
your existing migration path picks it up safely on a database that already
has the old `users` table.
