# FRONTEND-ATTENDANCE-SCORES-001 — Attendance and score entry usability

- Status: implementation committed; awaiting CI and review.
- Owner scope: teacher/admin attendance and score entry screens.
- Base branch: `master`
- Base commit: `acc6ff5f62113df659fbd0f39afe18ac44e7debf`
- Worker branch: `agent/frontend-attendance-score-ux-current-20261113`

## Commits
- `3dae1197aa3d1b75505dd1fe553693339665fa6b` — refresh attendance route on current master.
- `3bda2ede0b90b00e77777709ae5a74ddd45c3f80` — refresh attendance screen on current master.
- `1f62b8737597998df51cf6a3547d4e00e666eccc` — refresh score entry screen on current master.
- `82d7bb24aace1dff63cd7af4117ff68d8a8d6bd2` — refresh term-school isolation integration test on current master.
- Checkpoint commit: `a0ed3565da41cd881e7676025a9463d712ada616`.

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
- Branch comparison: 6 commits ahead, 0 behind master; four implementation files and this checkpoint are the only changed paths.
- Automated Mobile TypeScript and repository CI have not yet completed. No runtime/device test is claimed.

- PR #788 has merged into master, resolving the two pre-existing TypeScript blockers. Fresh checks on this refreshed branch are pending.

- CI passed on current-master head `f6d2752fc9be858ac3d3961460a868d0bbcb4dcb`: Mobile TypeScript, Android mobile readiness, SS1 package integrity, backend attendance batch integrity, backend academic term tenant isolation, backend student report term scope, and JSS3 implementation/assets all completed successfully.

## Remaining work
- Check the Mobile TypeScript and package integrity workflow results.
- Fix any genuine errors without weakening checks.
- Admin attendance read scoping has now been corrected: the UI sends selected school_code; backend requires it for admin reads, checks that the requested term belongs to that school, and filters the register by exact school_code.
- Next action: wait for CI, inspect any failures, then update this checkpoint and PR evidence.
