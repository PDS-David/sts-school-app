# SEC-05 — Stop writing empty strings where the schema means NULL

Status: READY · Depends: none · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/admin.ts`, `mobile/src/screens/AdminUsersScreen.tsx`, `docs/app/remaining-20261030/evidence/SEC-05.md`

## Why (verified at master `8ffcd12`)

`AdminUsersScreen.tsx:101` and `:160` initialise and submit `school_code: ''` and `assigned_class: ''` for accounts that have no school or class (admin, finance admin). `PUT /admin/users/:id` (`backend/src/routes/admin.ts:181-205`) applies `COALESCE($3, school_code)` / `COALESCE($4, assigned_class)` — `COALESCE` treats `''` as a value, so the empty string is written over the previous value. The create paths already normalise with `school_code ?? null` (`admin.ts:126`, `:149`), so create and update disagree.

The consequence is not cosmetic: `school_code = ''` is a real, non-null value. Queries that filter `WHERE school_code = $1` never match it, whereas `IS NULL` semantics would let role-based defaults apply; `users.school_code` has a foreign key to `schools(code)`, so empty strings also bypass the intended referential meaning. `APP_WIDE_AUDIT.md` records this as flagged but not fixed.

## Do

1. Backend (`admin.ts`): normalise empty/whitespace-only strings to `null` for `school_code`, `assigned_class`, `phone` and `email` before the parameter array is built. Do not change `COALESCE` semantics for `full_name`, `role`, `is_active`, expiry or revocation reason.
2. Add a narrow rule for this route: when the effective role is `admin` or `finance_admin`, `assigned_class` must be `null` (a staff account without a class). Reject or normalise — choose normalise, because the mobile form submits `''` today.
3. Mobile (`AdminUsersScreen.tsx`): send `null` instead of `''` for the two fields when empty, and keep the form's local state as strings. Verify the request type allows `null`.
4. Do not write a data-repair migration here. Record the existing-rows problem in the note: accounts already stored with `''` need a separate, owner-approved cleanup, and this task only stops new writes.
5. Evidence note: exact old/new parameter values for a create and an update, and the list of fields normalised.

## Acceptance (static)

- No path in `PUT /admin/users/:id` can persist `''` for the four normalised fields.
- Admins and finance admins cannot retain an `assigned_class`.
- The create path behaves as before.
- No SQL is run; no existing row is changed.

## Do not

- Alter the users table or add a `CHECK` constraint that existing `''` rows would violate.
- Change `PUT` for teachers or students beyond the empty-string normalisation.
- Touch `AcademicMgmtScreens.tsx:22`, which initialises a *class form* with an empty school field and is unrelated.
