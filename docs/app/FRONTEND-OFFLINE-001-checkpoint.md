# FRONTEND-OFFLINE-001 — Immediate-confirmation write policy checkpoint

Task ID: FRONTEND-OFFLINE-001
Status: IMPLEMENTED — awaiting PR review and CI
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-offline-write-safety-current-20261113`

## Baseline and ownership checks
- Inspected current master and the shared API offline queue before editing.
- Confirmed separate UI PRs for student enrollment (#745), academic setup (#750) and finance actions (#759) need server-confirmed responses to safely report completion.
- No outbox retry logic, queue persistence, or assessment offline submission behavior was changed.

## Findings
The generic offline outbox returns synthetic queued responses for writes. Several screens depend on the actual server response or immediately refreshed state:
- Student enrollment and admin user creation return one-time parent credentials or activation information.
- Finance invoice/fee-item creation and payment-status updates must not be shown as complete before server confirmation.
- Academic term/subject creation, update and deletion are expected to appear in the selected school's refreshed lists immediately.

## Implemented
Exclude the following write endpoints from synthetic offline queueing so they fail visibly when the server is unavailable:
- `/students` (student provisioning)
- `/students/:id/promotion` and `/students/:id/restore` (class progression and restore actions)
- `/admin/users` (admin account provisioning)
- `/academic/terms` and `/academic/terms/:id`
- `/academic/subjects` and `/academic/subjects/:id`
- `/academic/class-locks` (class lock/unlock)
- `/finance/fee-items`
- `/finance/invoices`
- `/finance/invoices/:id/status`

Assessment submission and Term PIN exclusions already in master remain unchanged.

## Changed files
- `mobile/src/api/client.ts`

## Commits
- `eb5b3c3738a5a5cf6d957e609ef26245cd5eb8a7` — reapply immediate-confirmation write policy on current master.
- Checkpoint commit: `c2ee8591ab6347ddf88352bef9fa5376816a78e9`.

- CI evidence: Mobile TypeScript workflow run 43458238318 completed successfully on the current-master PR head.

## Verification
- Static inspection confirms the exclusions are added only in the write-error/offline-queue branch; GET requests are unaffected.
- Existing queue persistence and retry handling for other offline-capable writes remain unchanged.
- No offline outbox logic was removed or weakened globally.
- No runtime/offline integration test was run because no local checkout/device execution environment is available.

## Dependencies
- PR #745 student enrollment
- PR #750 academic setup
- PR #759 finance actions

Those UI PRs now explicitly depend on this shared policy PR before merging.

## Exact next action
Open this focused PR and coordinate merge order with dependent UI PRs; then verify online/offline behavior for every excluded write endpoint.
