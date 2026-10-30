# SEC-05 — Stop writing empty strings where the schema means NULL

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified).
Base: `origin/master` `f1de667bb14dff143594d24404463ed41228e921`. Files: `backend/src/routes/admin.ts`, `mobile/src/screens/AdminUsersScreen.tsx`, this note.

## Old behaviour (base)
- The mobile form starts with `school_code: ''` and `assigned_class: ''` (`AdminUsersScreen.tsx:101`, `:160`, and `:177` for edits of accounts with none) and submits `...form` unchanged (`:201-203`), so accounts with no school or class send `''`.
- `PUT /admin/users/:id` (`admin.ts:180` at base) passed the body values straight into `COALESCE($3,school_code)`, `COALESCE($4,assigned_class)`, `COALESCE($6,phone)`, `COALESCE($7,email)` (`admin.ts:192-201`). `COALESCE` treats `''` as a value, so it overwrote the stored value with an empty string.
- **Contradiction with the prompt's premise:** the prompt says the create paths "already normalise with `school_code ?? null`". They do not for `''`: `??` converts only `undefined` and `null` (`admin.ts:126`, `:149` at base), so a create request carrying `''` inserted `''`. The mobile create form sends `''` for these fields, so the create path had the same defect. Because the stated goal is for create and update to agree, I applied the same normalisation to create. This is the one place the "create path behaves as before" acceptance line cannot hold literally: create now stores NULL where it would have stored `''`.

## New behaviour
- `blankToNull` (`admin.ts:87`) returns `null` for `undefined`, `null` and empty or whitespace-only strings and returns every other value untouched (not trimmed).
- **Create** (`POST /admin/users`, both the teacher and non-teacher inserts): `school_code`, `assigned_class`, `phone` and `email` go through `blankToNull` before the parameter array is built. Nothing else changed; the class-teacher detection still reads the raw `assigned_class`.
- **Update** (`PUT /admin/users/:id`): the same four fields are normalised to null before the parameter array, so the query can no longer persist `''` for them. `COALESCE` semantics for `full_name`, `role`, `is_active`, expiry and revocation reason are unchanged.
- **Staff rule:** `assigned_class` is now `CASE WHEN COALESCE($2,role) IN ('admin','finance_admin') THEN NULL ELSE COALESCE($4,assigned_class) END`. The effective role is the requested role or, if none is sent, the stored role. This is done in SQL because `COALESCE(NULL, assigned_class)` alone would keep an existing class when an account becomes, or already is, a staff account.
- **Mobile:** `handleSave` sets `payload.school_code = form.school_code || null` and `payload.assigned_class = form.assigned_class || null` (`AdminUsersScreen.tsx:206-207`); form state stays strings. The payload is typed `any`, and the axios client sends JSON, so `null` is allowed.

## Exact parameter values (base vs new)
| Request | `school_code` / `assigned_class` / `phone` / `email` at base | New |
|---|---|---|
| Create admin, form blank | `''` / `''` / `''` or undefined / undefined | null / null / null / null |
| Update admin, form blank | `''` / `''` / `''` / undefined (writes `''` over stored value) | null / null / null / null (stored school/phone/email left unchanged; class cleared by the staff rule) |
| Update teacher, class cleared in form | `assigned_class` `''` (writes `''`) | null (stored class left unchanged) |
| Update teacher, value set | the value | the value (unchanged) |

## Behaviour changes to be aware of
- On update, an empty field now means "leave unchanged", not "clear". A teacher's school, class, phone or email therefore cannot be blanked through this route; only the staff `assigned_class` rule clears a value. Clearing a stored value on purpose would need an explicit field (as `clear_expiry` does for expiry). That is a product choice and is not added here.
- The mobile form sends `null` on **create** too, which the backend already tolerated.

## Existing rows
Accounts already stored with `''` are not touched: no SQL was run and no repair migration is written. A separate, owner-approved cleanup is needed (for example setting `school_code`, `assigned_class`, `phone` and `email` to NULL where they equal `''`, after checking each). Until then an edit that sends null leaves such a `''` in place for the school, phone and email fields.

## Not changed
`users` table, `CHECK` constraints, `PUT` for teachers or students beyond blank normalisation, `AcademicMgmtScreens.tsx`. The student self-learning flow (AI-taught, independent of teachers) is untouched.

No tests, typechecks, DB, migrations, server or device checks were run. Testing deferred by owner.
