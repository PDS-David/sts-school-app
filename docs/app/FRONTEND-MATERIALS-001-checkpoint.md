# FRONTEND-MATERIALS-001 — Learning material recovery and controls

- Status: implementation committed; awaiting CI and review.
- Base branch: `master`
- Base commit: `b8651cebaa480097fd1c40c9b02c11b228187caa`
- Worker branch: `agent/frontend-materials-recovery-20261113`

## Commits
- `d3dc3425cf0c8f9f03217510d184fa42b6e12f55` — add loading/error/retry, cross-platform feedback, guarded upload and confirmed deletion.
- Checkpoint commit: pending.

## Changes
- Replace the silent materials/subjects fetch catch with a visible error state and retry.
- Encode the selected subject filter before requesting materials.
- Replace native alert calls for open/download validation and failures with the shared ConfirmDialog.
- Guard duplicate material uploads; trim and validate title/HTTPS URL; show visible success/error feedback.
- Confirm deletion, catch delete failures, await refreshed material list, and report the outcome.
- Expose upload progress and disable repeated upload actions.
- Preserve existing secure-HTTPS URL checks and file download/share behavior.

## Verification
- Static inspection: no `Alert.alert` remains in MaterialsScreen.
- Static inspection: no empty catch block remains.
- Static inspection: list fetch has a visible retry path; upload has a saving guard; delete is confirmed and catches failures.
- CI pending; no runtime web/mobile download test is claimed.

## Remaining work
- Check Mobile TypeScript, Android readiness, and package integrity.
- Inspect the parent/teacher/student material visibility rules in the API and verify UI empty states against them.
- Next action: run CI and correct any genuine failures.
