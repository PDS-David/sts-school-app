# PRD-01 — Add announcements

Status: BLOCKED ON OWNER DECISION D8 · Depends: OPS-01 · Base: `origin/master` (record the SHA)
Writes: `backend/schema.sql`, the OPS-01 migration, `backend/src/routes/announcements.ts` (new), `backend/src/index.ts` (mount), `mobile/src/components/NotificationsContext.tsx`, `mobile/src/screens/NotificationsScreen.tsx`, `docs/app/remaining-20261030/evidence/PRD-01.md`

## Why

`TODO.md:688-696` records "no announcements endpoint" as an unresolved product gap, and the reference manual confirms there is no universal notifications table: the bell aggregates open assessments and unread messages locally (`NotificationsContext.tsx:46-80`). Schools currently have no way to publish a notice to a class or a role; they can only send individual messages, which also push to each recipient.

The manual also records what is already true and must not be rebuilt: `messages` (one-to-one), `notification_settings`, `device_push_tokens`, `email_log_queue`. There is no fan-out announcement concept.

## Do (only after D8 is answered; recommended default is yes, read-only)

1. Schema: `announcements(id BIGSERIAL PRIMARY KEY, school_code TEXT NOT NULL REFERENCES schools(code), title TEXT NOT NULL, body TEXT NOT NULL, audience_role TEXT NULL CHECK (audience_role IN ('student','parent','teacher','finance_admin')), class_name TEXT NULL, created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ NULL)`. No attachments in this version.
2. Routes (`backend/src/routes/announcements.ts`, mounted at `/announcements`):
   - `GET /announcements` — authenticated; returns announcements for the viewer's school that are unexpired and match the viewer: `audience_role IS NULL OR audience_role = user.role`, and `class_name IS NULL OR class_name = viewer's class` (student: own `students.class_name`; parent: any ward's class; teacher: `assigned_class`; admin: all in school). Never return another school's rows.
   - `POST /announcements`, `DELETE /announcements/:id` — `requireRole('admin')` only; admin's `school_code` must match the target.
   - Validate `class_name` against the school's `classes` table; reject unknown names.
3. No push in this version. The bell integration is a read: add one `GET /announcements` call for every authenticated role in `NotificationsContext.tsx`, producing items with `kind: 'announcement'`; do not call it for unauthenticated users.
4. `NotificationsScreen` already renders a generic list — confirm the item shape (`id`, `kind`, `title`, `body`, `createdAt`) matches; do not build a new screen.
5. If D8 is "no", stop and record the decision; do not add the table.

## Acceptance (static)

- A student in class A never receives a class-B or other-school announcement.
- A parent sees only announcements matching at least one ward's class (or school-wide ones).
- Only admins can create or delete; `finance_admin` cannot.
- No push, no email, no SMS, no read-receipt table.
- The bell degrades gracefully if the endpoint is absent (web/older client), as the existing catch does.

## Do not

- Add attachments, comments, reactions or acknowledgement tracking.
- Reuse the `messages` table for announcements.
- Claim the bell was observed on a device.
