# FRONTEND-ATTENDANCE-SCORES-001 — Attendance and score entry usability

- Status: implementation committed; awaiting CI and review.
- Owner scope: teacher/admin attendance and score entry screens.
- Base branch: `master`
- Base commit: `b8651cebaa480097fd1c40c9b02c11b228187caa`
- Worker branch: `agent/frontend-attendance-score-ux-20261113`

## Commits
- `2d33ab8efaf5fc944196d3af97153e869898852f` — validate attendance values and replace native alerts with cross-platform feedback.
- `ad6a176cad87ae2fddd1fa7b2611532512d9bf84` — validate score values against school limits and replace native alerts with cross-platform feedback.
- Checkpoint commit: pending.

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

## Remaining work
- Check the Mobile TypeScript and package integrity workflow results.
- Fix any genuine errors without weakening checks.
- Revisit admin attendance school scoping: backend GET currently scopes attendance using the authenticated user's school, while admin selection is client-side. This requires a coordinated backend scope change and is intentionally not hidden by this UI-only patch.
- Next action: wait for CI, inspect any failures, then update this checkpoint and PR evidence.
