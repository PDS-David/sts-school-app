# FRONTEND-ATTENDANCE-SCORES-001 — Attendance and score entry usability

- Status: implementation committed; awaiting CI and review.
- Owner scope: teacher/admin attendance and score entry screens.
- Base branch: `master`
- Base commit: `acc6ff5f62113df659fbd0f39afe18ac44e7debf`
- Worker branch: `agent/frontend-attendance-score-ux-current-20261113`

## Commits
- `3dae1197aa3d1b75505dd1fe553693339665fa6b` — validate attendance values and replace native alerts with cross-platform feedback.
- `3bda2ede0b90b00e77777709ae5a74ddd45c3f80` — validate score values against school limits and replace native alerts with cross-platform feedback.
- Checkpoint commit: pending..

## Changes
- Attendance: validate days opened as a non-negative whole number; validate entered days present as whole, non-negative values not exceeding the target days-opened limit.
- Attendance: validate empty submissions and missing terms with visible feedback; update term limits before bulk attendance so the API validates against the intended limit.
- Attendance: replace native `Alert.alert` success/error/validation messages with the shared `ConfirmDialog`, which works on web and native.
- Scores: validate each CA1, CA2 and exam entry as finite, non-negative and within the selected school's configured maximum before submission.
- Scores: prevent duplicate save handling and replace native alert feedback with the shared cross-platform dialog.
- Subject creation: require a selected school for administrators and provide visible validation/API error feedback.

## Verification
- Static inspection: both screens contain no remaining `Alert.alert` calls.
- Static inspection: both screens render the shared `ConfirmDialog`.
- Static inspection: attendance value bounds and score-school caps are checked before writes.
- Branch comparison: 2 commits ahead, 0 behind master; only the two assigned screen files changed before this checkpoint.
- Automated Mobile TypeScript and repository CI have not yet completed. No runtime/device test is claimed.

- CI Mobile TypeScript run 43468340394 failed only on two unrelated current-master errors: `mobile/src/api/client.ts(366,50)` (`flushPromise` used before assignment) and `mobile/src/screens/NotificationsScreen.tsx(35,64)` (unsupported `Btn size` prop). Neither file is changed by this PR. Both are addressed by current-master remediation PR #788; merge #788 and rerun this PR's checks before treating CI as green.
- SS1 package integrity run 43468433891 was still in progress at the last check.

- Follow-up on shared blocker: PR #788 now has passing Mobile TypeScript, Android readiness and SS1 package-integrity checks on its latest head. It is still open; these checks must be rerun on this branch after #788 merges. PR #788's JSS3 and cross-subject package audits were still in progress at the last check.

## Remaining work
- Check the Mobile TypeScript and package integrity workflow results.
- Fix any genuine errors without weakening checks.
- Admin attendance read scoping has now been corrected: the UI sends selected school_code; backend requires it for admin reads, checks that the requested term belongs to that school, and filters the register by exact school_code.
- Next action: wait for CI, inspect any failures, then update this checkpoint and PR evidence.
