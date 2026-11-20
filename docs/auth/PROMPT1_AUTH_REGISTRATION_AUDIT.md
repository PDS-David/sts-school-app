# STS School App — Prompt 1: Authentication and Registration Audit

*Read-only audit of `PDS-David/sts-school-app`, base `master` at `2aee679`. No code, schema or data was changed. No tests, builds or database queries were run; everything below comes from reading the code. Items that could not be confirmed from the code are marked **UNVERIFIED**.*

Labels: **EXISTING** = what the code does today. **REQUIRED** = what the prompt pack asks for. **PROPOSED** = suggested change (nothing implemented).

**Constraint carried forward:** Operations Admin implementation is NOT APPROVED. Do not change the existing Operations Admin authority (`davidadmin`, `can_manage_all_schools`, migration 0010) or its credential workflow.

## 1. Headline findings

| # | Finding | Severity |
|---|---|---|
| 1 | **Forced password change is not enforced by the server and is lost on app restart.** `mustChangePw` and `mustSetSecurityQuestion` start `false` in `AuthContext` and are only set by `login()`. Restoring a saved session does not refetch them, and no middleware checks `must_change_pw`. | High |
| 2 | **Teacher PIN reset issues a 6-digit PIN, but the teacher login screen only accepts 4 digits.** `POST /admin/users/:id/reset-password` calls `generateNumericPin()` (default length 6) for teachers; `LoginScreen` slices input to 4 digits and rejects anything else. | High |
| 3 | **Free-launch exemption lets unapproved students in.** Students skip the pending check in `requireAuth`, in the `/auth/login` and `/auth/me` responses, and in the register response. Default is `true` when no settings row exists. | High (REQUIRED to remove) |
| 4 | **Parent-ward links have no verification state.** `parent_wards` has only `(parent_id, student_id)`. Admin approval is account-level, so approving a parent grants every claimed ward. | High |
| 5 | **Parent self-registration is guessable.** One admission number plus phone creates a ward link. The 404 vs 201 response reveals whether an admission number exists; prefixes default to `PRI` and `STD`. | High |
| 6 | **A 4-digit teacher PIN is brute-forceable within the current limiter.** 10 failures per 15 min per username is about 960 guesses/day, so the 10,000-PIN space takes roughly 10 days. The teacher username list is public (`GET /auth/teacher-logins`). | High |
| 7 | **Credential changes do not revoke sessions.** `change-password`, `forgot-password/reset` and admin reset never clear `refresh_token`. A comment in `AuthContext` claims the opposite. | Medium |
| 8 | **One refresh token per user** (single column, plaintext, no rotation). A second device login silently logs out the first. Conflicts with Remember me and shared family accounts. | Medium |
| 9 | **Usernames are not globally unique.** Teacher usernames are unique per school only; class-teacher usernames derive from the class name, so cross-school duplicates are very likely in production. | Medium (migration risk) |
| 10 | **Public forgot-password also works for teachers** who set a security question before it was hidden for that role. | Medium |
| 11 | **`Math.random()` generates temporary passwords, activation codes, class codes, term PINs and teacher reset PINs.** | Medium |
| 12 | **The `/auth` IP limiter (30 requests per 15 min) counts every call**, including successful logins and refreshes. Two campuses behind one school IP could throttle each other. | Medium |

## 2. Current registration flow by role (EXISTING)

**Student**
- `POST /auth/self-register` with `class_name`: creates a `users` row (`pending_admin_review=TRUE`) and a new `students` row with no admission number and no roster membership. The mobile app only sends this form.
- `POST /auth/self-register` with `admission_number` and no class: backend still accepts it and links to an existing physical student row. Mobile never sends it, so it is an unused public path.
- `POST /auth/self-claim` (class code, roster pick, admission number): creates the user with an auto-generated username. **`pending_admin_review` stays at default FALSE, so no admin approval.**
- Admin-created account with a one-time activation code (`POST /admin/users`, then `POST /auth/activate`).

**Parent**
- `POST /auth/self-register`: one `ward_admission_number`, school, phone of 10 to 15 digits. Rejected if any parent has the same last 10 phone digits (`parent_phone_exists`). Inserts one `parent_wards` row immediately. Pending TRUE.
- Admin auto-provisioning (`findOrCreateParent`): username `parent<last10digits>`, random temporary password, `must_change_pw=TRUE`.
- Admin link route: `POST /students/:id/link-parent`.
- No parent-facing add-another-ward endpoint; extra wards only come from admins.

**Teacher**
- `POST /auth/self-register`: school, name, phone, username, password (8+ characters). No class or subject request captured. Pending TRUE.
- Admin-created: 4-digit `initial_password`, `must_change_pw=TRUE`, class-teacher username forced to the lowercased class name, assignments validated.

**Admin / finance_admin:** created by seed scripts or admin routes only. **Out of scope. Not touched.**

## 3. Current login and authentication flow (EXISTING)

1. `LoginScreen` has an Account Type dropdown ("Teacher (PIN)" vs "Student / Parent / Admin") and a School dropdown. Teacher mode loads usernames from public `GET /auth/teacher-logins` and requires exactly 4 digits.
2. `POST /auth/login` sends `{username, password, school_code}`. Query: `lower(username)=lower($1) AND (role<>'teacher' OR school_code=$2)`, takes `rows[0]` with no ORDER BY. Returns 403 "not activated" if `password_hash` is NULL (before the password check), then bcrypt compare, then `is_active` and `access_expires_at` checks.
3. Response: 15-minute access JWT, 7-day refresh JWT (stored plaintext in `users.refresh_token`), `must_change_pw`, `must_set_security_question` (forced false for teachers), and a `user` object including `pending_admin_review`.
4. Mobile stores tokens in `expo-secure-store` and the `user` object in `AsyncStorage`. The session persists until the refresh token expires or fails. There is no Remember me today.
5. `POST /auth/refresh` issues a new access token only. Logout nulls the refresh token. Access tokens remain valid until their 15 minutes end.

## 4. How roles are determined (EXISTING)

- `users.role` (TEXT with CHECK in `student, parent, teacher, admin, finance_admin`). The client does not send a role to `/login`.
- `requireAuth` verifies the JWT, then **reloads role, school, class, subject and admin scope from the database** (`hydrateAuthUser`) on every request. A tampered JWT payload cannot change the role. Preserve this.
- The mobile app picks its dashboard from the stored `user.role` (`RootNavigator`); the server still enforces per call.
- **Gap:** no allow-list of assignable roles found in `POST /admin/users` or `PUT /admin/users/:id` beyond the DB CHECK. A school-scoped admin appears able to set `role='admin'` on another account. **UNVERIFIED.** Not probed, because it touches the Operations Admin restriction.

## 5. How pending approval is enforced (EXISTING)

- Flag: `users.pending_admin_review` (default FALSE), set TRUE only by `/auth/self-register`.
- Server: `requireAuth` returns 403 `PENDING_APPROVAL` outside `/auth` when TRUE.
- Client: `RootNavigator` shows `PendingApprovalScreen` from the stored flag. Mobile has **no handler for the 403 `PENDING_APPROVAL` code**.
- Approval: `POST /admin/users/:id/approve` sets the flag FALSE. It does not check the account is actually pending, that a teacher has assignments, or that a parent's wards are verified. **No reject endpoint exists** (rejection means delete).
- Pending users can call every `/auth/*` route with their token.

## 6. Every exception that lets an unapproved account in (EXISTING)

1. **Free-launch student exemption** (`middleware/auth.ts` lines 68 and 79; `routes/auth.ts` lines 163, 216, 564). `freeLaunchMode` defaults to `true` when `FREE_LAUNCH_MODE` is unset, the settings row is missing, or the table is missing (`learningAccessPolicy.ts`, `readLearningAccessPolicy`). It also skips the `access_expires_at` check for students. **REQUIRED (Prompt 3A): remove.**
2. **Self-claimed students** are never pending (`selfRegistration.ts` line 134 omits the flag). Gate is class code plus admission number only.
3. **Admin-created and activated accounts** are not pending by design.
4. **Client-only UI gate** for everyone else; data is protected server-side, but the app reads the flag from `AsyncStorage`.
5. **Inconsistency, not a leak:** `onlineExams.ts` requires `pending_admin_review=false` even in free launch.
6. **UNVERIFIED:** routers mounted before the `/auth` block in `index.ts` (`/question-bank`, `/class-practice`, `/online-exams`) were not checked for `requireAuth`.

## 7. Duplicate-account checks (EXISTING)

- DB: `users_username_global_non_teacher_uq` on `lower(username)` for non-teachers; `users_teacher_school_username_uq` on `(school_code, lower(username))` for teachers. `users.email` UNIQUE nullable. `students.user_id` UNIQUE. `students(school_code, admission_number)` unique.
- **Gaps against the Prompt 2 rule (globally unique, case-insensitive):**
  - Teacher usernames repeat across schools.
  - A teacher and a non-teacher can share a username, so `/login` picks `rows[0]` arbitrarily.
  - `/self-register` and `/self-claim` compare `username=$1` exactly; a race reaching the index surfaces as an unhandled unique violation (500), not a 409.
  - A teacher with NULL `school_code` is not covered by the teacher index.
- Parent: dedupe by last 10 phone digits, enforced only by an advisory lock. No unique constraint on phone.
- Student: nothing stops the same person registering twice online.
- **Identity model:** online students are rows in the same `students` table as physical students, distinguished only by having no active `report_roster_memberships` row (see migration 0006). There is no separate online UID or physical UID column; `students.id` serves as both.

## 8. Parent-to-child linking (EXISTING)

- Table `parent_wards(parent_id, student_id)`, composite PK, cascade deletes. No `status`, `verified_by`, `verified_at`, relationship or claimed-name fields.
- Created by self-register, admin provisioning, and admin link-parent.
- Self-register matches school plus admission number only. Ward name and class are **not collected or compared** (Prompt 3B asks for them).
- Read access: `/students/wards`, `scores.ts` and `attendance.ts` authorize on `parent_wards` existence alone. `/students/wards` inner-joins `report_roster_memberships` with no `status='active'` filter.
- A pending parent is blocked until approved, then every claimed ward becomes visible.

## 9. Teacher assignment and approval (EXISTING)

- Self-registered teachers have no assignments. An admin edits `assigned_class`, `assigned_class_names` and `teacher_subjects` via `PUT /admin/users/:id`, then calls approve.
- No table separates **requested** from **approved** assignments (REQUIRED by Prompt 3C).
- `validateTeacherAssignments` requires classes to belong to the teacher's own school, so **cross-school assignment is not supported today**.
- Teachers are blocked from DIY online-learning routes by `denyTeacherAccess`.

## 10. Password and PIN storage and recovery (EXISTING)

- Hashing: `bcryptjs` cost 10 for passwords, PINs and security answers. Pure-JS bcrypt blocks the event loop under load.
- Rules today: teacher PIN is 4 digits (change-password and admin create only). Everyone else 8+ characters. Self-registered teachers get 8+ characters, which the teacher login screen cannot type.
- No plaintext password or PIN logging found. `seed.ts` prints a default admin password to the console (seed-time only).
- Plaintext secrets in the DB: `users.activation_code`, `class_access_codes.code`, `term_access_pins.pin` (admin re-viewable). Access codes, not account PINs, but need an owner decision against "never display an existing PIN to an administrator".
- Recovery today: security question and answer for non-teachers (answer bcrypt-hashed, 5 failures leads to a 1-hour lock); teachers use admin reset, which returns a temporary credential in the API response.
- `GET /auth/forgot-password/question` returns different messages for no user, deactivated, expired, no question set, and available, so **it leaks account existence and state**. `/auth/login` returns "not activated" before the password check, which also reveals existence.
- Rate limits: per-username (keyed on `lower(username)`, shared across schools, so an attacker can lock out a victim) and per-IP on all `/auth` calls. No escalating lockout exists. State lives in `createPostgresRateLimitStore`.

## 11. Affected tables and constraints

`users` (role CHECK, two partial unique indexes, nullable `password_hash`, `refresh_token`, `pending_admin_review`, `must_change_pw`, security-question and activation columns), `students`, `parent_wards`, `teacher_subjects`, `classes`, `subjects`, `schools`, `class_access_codes`, `term_access_pins`, `report_roster_memberships` and `_events`, `device_push_tokens`, `audit_log`, `learning_access_settings`, and the rate-limit counters table (migration 0003). Latest migration is `0018`; the next is `0019`.

## 12. Risks to existing accounts and records

- **Existing credentials cannot be converted to 6-digit PINs automatically** (bcrypt hashes of arbitrary strings). Needs a server-enforced "must set PIN" state (absent today, see finding 1), a recovery path, and no silent invalidation.
- **Global username uniqueness may collide with live data.** Query production before any index change; any rename needs owner sign-off.
- **Operations Admin (`davidadmin`) and other admin or finance accounts must keep working unchanged.** Any username or index migration must exclude or verify them first.
- **Every existing `parent_wards` row becomes "unverified"** under the new rule. A backfill decision is needed.
- **Online vs physical identity:** migration 0006 already fixed one confusion. Reclassifying `students` rows needs a read-only classification report first.
- **Mobile offline layer:** cache is namespaced by user id; outbox is flushed at login and logout. Session changes must not strand unsynced work.
- **Shared family accounts across devices** need a multi-session refresh model (finding 8).
- **School Wi-Fi:** rethink the per-IP limiter before tightening anything.

## 13. Files and migrations to modify (PROPOSED, for Prompts 2 and 3)

**Backend:** `routes/auth.ts`, `middleware/auth.ts`, `utils/selfRegistration.ts`, `utils/credentialAttempts.ts`, `utils/password.ts` (CSPRNG), `utils/jwt.ts`, `utils/learningAccessPolicy.ts`, `utils/parentProvisioning.ts`, `routes/admin.ts` (approve, reset, user create, reject), `routes/students.ts` (ward routes), `routes/scores.ts` and `routes/attendance.ts` (ward authorization), `index.ts` (limiters), `schema.sql`.

**New migration `0019+`** (non-destructive): PIN credential state and lockout columns; sessions table (hashed refresh tokens, device label, revoked_at); case-insensitive global username index (after a data check); ward verification columns with an owner-approved backfill; requested-vs-approved teacher assignment tables; separation of online student UID from physical school UID; teacher assignment-request columns.

**Mobile:** `LoginScreen`, `SelfRegisterScreen` (split into three), `AuthContext`, `secureTokenStorage`, `RootNavigator`, `PendingApprovalScreen`, `ForgotPasswordScreen`, `ChangePasswordScreen`, `ActivateAccountScreen`, `StudentSelfClaimScreen`, parent dashboard (add-ward).

**Tests:** existing suites are `backend-auth-claims`, `backend-credential-attempts`, `backend-self-registration`, `backend-parent-provisioning`, `backend-parent-ward-link-scope`, `backend-student-login-link-atomicity` and the rate-limit store tests (all in `tests/`). No dedicated HTTP-level login, refresh or forgot-password tests found by file name (not exhaustive).

## 14. Decisions needed from the owner before Prompts 2 and 3

1. How to handle duplicate teacher usernames across schools that already exist.
2. Whether existing `parent_wards` rows are backfilled as verified.
3. How existing users move to 6-digit PINs (forced set on next login versus admin-issued).
4. What the "physical school UID" is (admission number, or a new column).
5. Whether class codes, term PINs and activation codes may stay admin-viewable.
6. Whether the teacher-username picker on the login screen stays (it conflicts with the "avoid account enumeration" requirement).
