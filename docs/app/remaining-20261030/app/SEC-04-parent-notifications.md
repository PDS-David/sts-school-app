# SEC-04 — Stop the parent bell requesting assessments it cannot read

Status: READY, subject to owner decision D3 · Depends: none · Base: `origin/master` (record the SHA)
Writes: `mobile/src/components/NotificationsContext.tsx`, `docs/app/remaining-20261030/evidence/SEC-04.md`

## Why (verified at master `8ffcd12`)

`NotificationsContext.tsx:49-50` requests `GET /learning/assessments` whenever `user.role === 'student' || user.role === 'parent'`. The parent permission map (`backend/src/utils/rbac.ts:16-25`) does **not** include `assessments.read` — only the student map does (`rbac.ts:5-15`) — and the route requires that permission at `backend/src/routes/learning.ts:798`.

The result is a guaranteed 403 for every parent refresh, swallowed by the bare `catch` at `NotificationsContext.tsx:62`, so parents silently never get assessment notification items while the app makes a request that can only fail. The reference manual lists this as an unresolved permission mismatch.

## Do

1. Under decision D3 (recommended: do not show assessment-open items to parents until a ward-scoped endpoint exists), change the condition to `user.role === 'student'` only.
2. Leave the message-unread block untouched — it works for all roles that can call `/messages/contacts`.
3. Add one short comment recording *why* parents are excluded (permission map + ward scoping), so a future change does not re-add the failing call by accident.
4. If the owner chooses the alternative (parents should see ward assessments), stop and report: that requires a new ward-scoped backend endpoint and a permission decision, and must not be approximated by widening `assessments.read` — the current route returns class-wide assessments and would leak other pupils' material.
5. Record the before/after request list per role in the evidence note (student, parent, teacher, admin, finance_admin).

## Acceptance (static)

- No role branch requests an endpoint whose permission it lacks (check the four other requests in the same file against `rbac.ts`).
- The parent bell still aggregates unread messages.
- No change to the assessment route, RBAC map, or push logic.

## Do not

- Add `assessments.read` to the parent role.
- Broaden the assessment list to parents without ward filtering.
- Claim the bell was observed working on a device.
