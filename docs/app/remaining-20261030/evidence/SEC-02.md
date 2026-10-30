# SEC-02 evidence — fail closed on message contacts

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `f1de667` (prompt line numbers were written against `8ffcd12`; cited code was unchanged between the two)
Owner decision applied: **D2 recommended default** — no Chats for Finance Admin. Owner has not confirmed D2 in this session; PR is marked for owner review.

## Old behaviour (base `f1de667`)

- `backend/src/utils/scope.ts:353` `getMessageableUsers` has explicit branches for `student` (354), `parent` (401) and `teacher` (435).
- `scope.ts:461-471` is the final, unconditional branch commented "admin". It selects every active user (students filtered by `deleted_at`) with no role check, so any role not matched above — `finance_admin` included — received the whole cross-school directory from `GET /messages/contacts` (`routes/messages.ts:135`).
- `POST /messages` is blocked for `finance_admin` by permission: `messages.ts:21-23` requires `messages.write`; the role's map is `finance.read`, `finance.write`, `students.read` (`utils/rbac.ts:60`). Send path was closed; directory disclosure was not.
- Mobile: `mobile/src/navigation/FinanceAdminTabs.tsx` registered `ChatsStack`/`ChatsStackNavigator` (lines 23, 36-42), a `ChatsTab` sidebar item (56) and `ChatsTab` tab screen (73) rendering `MessagesScreen`.

## New behaviour

- `scope.ts`: final branch is now `if (user.role === 'admin') { ...same query... }`, followed by `return []` for any other role. Admin query text and parameters are unchanged (re-indented only).
- `POST /messages` for `finance_admin` remains blocked by permission and is now also blocked by contact scope (`allowed` is `[]`, so `messages.ts:43` returns 403) — defence in depth. No permission was granted.
- `FinanceAdminTabs.tsx`: removed `ChatsStack`, `ChatsStackNavigator`, the `ChatsTab` sidebar item, the `ChatsTab` tab screen and the now-unused `MessagesScreen` import. Tabs are Finance and More. Header comment updated.
- `MessagesScreen.tsx`: comment only — it no longer claims `finance_admin` uses this screen. No `finance_admin` fallback text existed (grep: single comment hit at line 20).

## Deliberately not changed

- Student, parent and teacher branches and their queries, ordering and `deleted_at` filters.
- `GET /messages` inbox and `/conversation/:other`.
- `rbac.ts` (no `messages.*` for `finance_admin`).
- `mobile/src/App.tsx` push-tap comment (~line 76-77) still mentions `finance_admin` / `FinanceAdminTabs` for the `'Messages'` screen name. It is a comment outside this task's Writes; it is stale, harmless, and left for the integrator. Server-side `data.screen` selection in `messages.ts` was not touched; a finance_admin cannot receive messages because it cannot be a contact.
- `NotificationsContext.tsx` still requests `/messages/contacts` for all roles; for `finance_admin` that now returns `[]` (SEC-04 owns that file).

## Acceptance (static)

- No role without an explicit branch reaches the directory: yes, by reading `scope.ts` final lines.
- Unknown/future role gets `[]`: yes.
- Finance Admin shell has no route to a chat screen: `grep -n "Chats\|MessagesScreen" FinanceAdminTabs.tsx` should return only the explanatory comment.
- Student/parent/teacher lists unchanged: those branches were not edited.

## Not done / not verified

No tests, typechecks, DB, device or deploy were run (testing deferred by owner). The mobile type-correctness of the trimmed navigator, and finance-admin behaviour on a device, are unverified.
