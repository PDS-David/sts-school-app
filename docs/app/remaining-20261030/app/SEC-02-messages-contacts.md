# SEC-02 — Fail closed on message contacts and decide Finance Admin Chats

Status: READY, subject to owner decision D2 · Depends: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/utils/scope.ts`, `mobile/src/navigation/FinanceAdminTabs.tsx`, `mobile/src/screens/MessagesScreen.tsx` (only if the decision requires removing finance-admin copy), `docs/app/remaining-20261030/evidence/SEC-02.md`

## Why (verified at master `8ffcd12`)

`getMessageableUsers` (`backend/src/utils/scope.ts:353-472`) has explicit branches for `student` (354-399), `parent` (401-433) and `teacher` (435-459). The final branch (461-471) is commented as the admin case and returns **every active user across every school**, with no role filter. Because it is a default branch rather than `if (user.role === 'admin')`, a `finance_admin` session falls into it.

Consequences today:

- `GET /messages/contacts` returns the whole user directory (names, usernames, roles) to a Finance Admin.
- `POST /messages` calls the same helper (`messages.ts:41`) but is blocked earlier by the missing `messages.write` permission (`messages.ts:21-23`). The send path is therefore closed; the directory disclosure is not.
- The mobile shell still offers Chats to this role: `FinanceAdminTabs.tsx:54-58` adds a sidebar item and `:73` registers `ChatsTab` with `MessagesScreen`.

The reference manual flags exactly this mismatch: Finance Admin's permissions are `finance.read`, `finance.write`, `students.read`, but its navigation and the messages helper's default branch assume staff-wide messaging.

## Do

1. Replace the default branch with explicit role handling: `if (user.role === 'admin') { ...existing query... }` and a final fail-closed return for any other role (`finance_admin` included). Return an empty list rather than another role's scope; do not throw a 500.
2. If decision D2 is "no Chats for Finance Admin" (recommended, and consistent with the permission map):
   - remove the `ChatsTab` screen, the `ChatsStackNavigator` wrapper and the `SIDEBAR_ITEMS` entry from `FinanceAdminTabs.tsx`;
   - remove any finance-admin-specific fallback text in `MessagesScreen.tsx` if it becomes unreachable — search for `finance_admin` first.
   If the owner instead wants Finance Admin messaging, stop and report: that requires a permission change (`messages.write`, `messages.read`), a scoped contact rule, and a product decision, none of which this task authorises.
3. Confirm in the note that `POST /messages` remains blocked for `finance_admin` by permission and now also by contact scope (defence in depth).
4. Do not change the student/parent/teacher branches, their queries, or the teacher-student `deleted_at` filters.

## Acceptance (static)

- No code path returns a cross-school directory for a role that lacks an explicit branch.
- An unknown/future role gets `[]`, not the admin list.
- The Finance Admin shell contains no route to a chat screen under the recommended decision.
- Student/parent/teacher contact lists are byte-for-byte behaviourally unchanged (same queries, same order).

## Do not

- Grant `messages.*` permissions to `finance_admin`.
- Add a "finance_admin" special case that returns admins — that is a product decision, not a bug fix.
- Touch `GET /messages` inbox or `/conversation/:other`, which are already viewer-scoped (`messages.ts:88-120`).
