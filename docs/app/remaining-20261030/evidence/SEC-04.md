# SEC-04 evidence — parent bell no longer requests assessments it cannot read

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `69e301c` (prompt line numbers were written against `8ffcd12`; cited code unchanged)
Owner decision applied: **D3 recommended default** — parents get no assessment-open items until a ward-scoped endpoint exists. Owner has not confirmed D3 in this session; PR is marked for owner review.

## Old behaviour (base `69e301c`)

- `mobile/src/components/NotificationsContext.tsx:49-50`: `if (user.role === 'student' || user.role === 'parent')` then `api.get('/learning/assessments')`.
- `backend/src/routes/learning.ts:798`: `router.get('/assessments', requirePerm('assessments.read'), ...)`.
- `backend/src/utils/rbac.ts:5-15` student list includes `assessments.read` (line 10); `rbac.ts:16-25` parent list does not.
- Result: every parent refresh sent a request that can only return 403; the bare `catch` at `NotificationsContext.tsx:62` swallowed it.

## New behaviour

- Condition is `user.role === 'student'` only, with a comment recording why parents are excluded (permission map + class-wide results).
- The `/messages/contacts` block (`NotificationsContext.tsx:63-75` at base) is untouched, so the parent bell still aggregates unread messages. That route requires authentication only (`routes/messages.ts:9,133`).

## Requests per role (this file, `refresh()`)

| Role | Before | After |
|---|---|---|
| student | `/learning/assessments`, `/messages/contacts` | unchanged |
| parent | `/learning/assessments` (403), `/messages/contacts` | `/messages/contacts` |
| teacher | `/messages/contacts` | unchanged |
| admin | `/messages/contacts` | unchanged |
| finance_admin | `/messages/contacts` | unchanged (returns an empty list once SEC-02 lands; today it returns the full directory) |

## Acceptance check (static)

The prompt says to check "the four other requests in the same file". At base the file contains one other request, `/messages/contacts`, not four. It needs no permission beyond authentication, so no role branch requests an endpoint whose permission it lacks after this change.

## Deliberately not changed

- `assessments.read` was not added to parent; the assessment route, `rbac.ts`, push logic and `learning.ts` are untouched.
- The assessment list was not broadened to parents.
- No mobile screen was edited; `kind: 'assessment'` entries simply no longer appear for parents (they never did, because of the 403).

## Not done / not verified

No tests, typechecks, DB, device or deploy were run (testing deferred by owner). The bell on a device was not observed.
