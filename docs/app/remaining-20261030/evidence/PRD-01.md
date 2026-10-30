# PRD-01 — Announcements (read-only, admin-authored)

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `e271842d170bc74d6912d6040cfda086438be961`. Citations are at that base unless marked "new" (lines added by this change).
Owner decision D8: **not supplied in writing.** Implemented on the owner's instruction to execute PRD-01, using the prompt's recommended default (build read-only announcements). The owner must confirm D8 before merge; if D8 is "no", this whole change should be discarded.
OPS-01 has not landed, so there is no numbered migration to add. Per the README fallback the table is appended by hand to `backend/schema.sql` in its existing style (`CREATE TABLE IF NOT EXISTS`).
Files changed: `backend/schema.sql`, `backend/src/routes/announcements.ts` (new), `backend/src/index.ts`, `mobile/src/components/NotificationsContext.tsx`, `mobile/src/screens/NotificationsScreen.tsx`, this note.

## Old behaviour (base)

- No announcements table, route or client call exists. The bell builds its feed only from open assessments (students) and unread-message contacts (`NotificationsContext.tsx:56-80` at base). Its own header comment says a real endpoint should replace the body "once one exists" (`:27-31`).
- `backend/src/index.ts` mounts eleven routers; none is announcements (`index.ts:38-48`).

## New behaviour

### Table (`schema.sql:877`, new)

`announcements(id BIGSERIAL PK, school_code NOT NULL → schools(code) ON DELETE CASCADE, title, body, audience_role CHECK in student/parent/teacher/finance_admin (NULL = all), class_name (NULL = all), created_by → users(id), created_at, expires_at)` plus index `(school_code, created_at DESC)`.

Two deviations from the prompt's DDL: `created_by` is `ON DELETE SET NULL` (without it, `DELETE /admin/users/:id` would fail with a foreign-key error for any admin who ever posted — `admin.ts:262`), and `school_code` is `ON DELETE CASCADE`. The index is an addition. The reviewer may drop any of these.

### Routes (`announcements.ts`, mounted at `/announcements` in `index.ts`, new)

| Route | Gate | Behaviour |
|---|---|---|
| `GET /` (`:28`) | any authenticated role | Unexpired rows only, newest first, max 50, columns `id,title,body,audience_role,class_name,created_by,created_at,expires_at`. No school/class parameter except the admin override below. |
| `POST /` (`:87`) | `requireRole('admin')` | zod-validated; school = admin's own `school_code`, or the body's `school_code` for an admin with none; naming a different school than a school-bound admin's own → 403; unknown school → 400; `class_name` must exist in `classes` for that school (400 otherwise); `expires_at` must be an ISO datetime in the future. Audited (`create_announcement`). Returns 201. |
| `DELETE /:id` (`:128`) | `requireRole('admin')` | Non-numeric id → 404. A school-bound admin deletes only their own school's rows (the SQL makes another school's row look missing → 404); an admin with no school can delete any. Audited (`delete_announcement`). |

### Who sees what on `GET /`

- **student**: rows whose school equals the school of their own non-deleted `students` row and whose `class_name` is NULL or equals that row's class.
- **parent**: same, matched against **any** ward (`parent_wards`, non-deleted); school-wide rows of a ward's school match.
- **teacher**: their own `school_code`; `class_name` NULL or equal to their `assigned_class`. A teacher with no `assigned_class` sees school-wide (class-NULL) rows only. A teacher with no `school_code` sees nothing.
- **admin**: an admin with a `school_code` sees only that school; an admin with none (cross-school elsewhere in the app, `scope.ts:28`) sees all schools, optionally narrowed with `?school_code=`.
- **finance_admin and any other role**: empty list. `finance_admin` has no `school_code` (`students.ts:17-18` comment), so a school scope cannot be applied; failing closed was chosen over inventing a rule. The `finance_admin` value in the `audience_role` CHECK (kept as the prompt specifies) therefore targets nobody today.
- Every branch also requires `audience_role IS NULL` or equal to the viewer's role.

### Bell (`NotificationsContext.tsx:82-96`, new; `NotificationsScreen.tsx`)

`refresh()` already returns early for a missing user (`:45`). For any authenticated user it now also calls `GET /announcements` and pushes items `{ id: 'announcement-<id>', kind: 'announcement', title, body, createdAt }` (first 10). It sits in its own `try/catch` like the existing calls, so an older server (404) or offline failure leaves the feed unchanged. `AppNotification.kind` gained `'announcement'`, and `NotificationsScreen` got a `megaphone` icon for it. The existing list item shape (`id`, `kind`, `title`, `body`, `createdAt`) already matched; no screen was built. The screen shows the body with `numberOfLines={2}`, so a long notice is truncated in the bell; there is no detail view.

## Acceptance (static, by reading the SQL)

- A student in class A: the `EXISTS` requires `s.school_code = a.school_code` and `(a.class_name IS NULL OR a.class_name = s.class_name)`, so a class-B or other-school row cannot match.
- A parent: the same predicate over `parent_wards`; only school-wide rows or rows matching at least one ward's class.
- Only admins can create/delete (`requireRole('admin')`); `finance_admin` is refused (403).
- No push, email, SMS, read-receipt table, attachment, comment or reaction was added; `messages` is not reused.

## Gaps the owner should know about

1. **There is no way to author an announcement in the app.** The prompt authorises no new screen, so admins can only create them by calling `POST /announcements` directly. Read-only for users is delivered; admin authoring UI is a follow-up task.
2. **Read state:** the bell's "read" set is in-memory (`NotificationsContext.tsx`), so announcements reappear as unread after a restart, as the existing items do. No read-receipt table, per the prompt.
3. A `?school_code=` value from a school-bound admin is ignored (their own school wins).
4. Announcement text is student-visible content written by admins; nothing sanitises HTML (the client renders plain `Text`).
5. `schema.sql` is also edited by other open branches; the append is at the end of the file, but a merge-conflict at that location is likely if one lands first. OPS-01's numbered-migration form is not available yet.

Not claimed: that the endpoint works, that the table creates cleanly, or that the bell was seen on a device.

No tests, typechecks, DB, migrations, server or device checks were run. Testing deferred by owner.
