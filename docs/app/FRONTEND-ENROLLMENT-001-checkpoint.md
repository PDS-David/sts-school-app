# FRONTEND-ENROLLMENT-001 — Student enrollment recovery checkpoint

Task ID: FRONTEND-ENROLLMENT-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `c4a985d8eaad86c837259c900c700ba0f27738ba`
Worker branch: `agent/frontend-student-enrollment-recovery-20261113`

## Baseline and ownership checks
- Inspected current master and open enrollment-related PRs before editing.
- Public self-registration atomicity work is a separate auth route and was not modified.
- Read `AddStudentScreen.tsx`, `mobile/src/api/client.ts` and the existing student provisioning API contract.
- No backend student creation, parent-account de-duplication, validation or permission logic changed.

## Findings
- Class-list load errors were swallowed, leaving an empty picker with no recovery action.
- Switching selected school could retain a class name from the previous school because className was only set when initially empty.
- Success/error feedback used Alert.alert, which is unreliable on web; successful parent provisioning credentials could therefore be hidden from the admin.
- Date of birth, parent email and upper phone-length bounds were not validated client-side.
- Generic offline write queueing could return a synthetic success for student enrollment even though the UI relies on the server response to display one-time parent credentials.

## Implemented
- Add class loading/error/retry states; clear the previous school’s class selection before fetching the new school’s classes.
- Disable enrollment until a valid class list and class selection are available.
- Replace native alerts with the app’s ConfirmDialog so created parent credentials and errors are visible on web/mobile.
- Validate date-of-birth format and reject future dates.
- Validate parent phone length (10–15 digits) and optional email format.
- Prevent duplicate enrollment submissions.
- Exclude POST `/students` and POST `/admin/users` from synthetic offline write queueing because those calls return one-time account credentials; UI now requires a live server response before reporting account creation.

## Changed files
- `mobile/src/screens/AddStudentScreen.tsx`
- `mobile/src/api/client.ts`

## Commits
- `1ded2b2305fed0e584fca773e4c46ee81815e1f2` — enrollment form recovery and validation.
- `ac3a3f1da6a82b2ecee7e8b246c1a5cf948c2fde` — require live account provisioning responses.
- Checkpoint commit: `428235e72fb4eb62ae87b023c90dd112487c26b1`.

## Verification
- Static inspection confirms class list is scoped to selected school and stale class selections are cleared on school changes.
- Static inspection confirms one-time parent credentials are shown in an in-app dialog after a real server response.
- Static inspection confirms enrollment no longer reports success from a synthetic offline queue placeholder.
- Existing server-side phone/account de-duplication and student permissions remain unchanged.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime enrollment-readiness claim is made.

## Remaining work
- Verify new parent account creation, sibling account linking, and enrollment without parent details.
- Test invalid/future DOB, phone lengths, invalid email, no classes and failed class fetch/retry.
- Verify offline enrollment fails visibly and does not create a phantom local account.
- Audit AdminUsersScreen class/subject lookup failures and user-list retry separately.

## Exact next action
Compare with current `master`, open a focused PR, then continue the Admin Users management form audit.
