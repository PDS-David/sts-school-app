# STS Work Orchestrator (v1)

This repository is the durable source of truth for multi-agent work. Agent sessions are disposable; task records, checkpoints, commits, pull requests and verification evidence are not.

## Operating model

1. The controller decomposes the four completion gates into small tasks.
2. A worker claims one task by setting `status: in_progress`, `owner`, `lease_expires_at` and `heartbeat_at`.
3. Workers commit safe increments and update the checkpoint after each meaningful milestone.
4. A worker renews its lease while actively working. A lease is not proof of progress: heartbeat and checkpoint are both required.
5. On timeout, the task becomes `stalled` after its lease expires and the recovery grace period elapses. The next worker reads the checkpoint and resumes from the last verified commit.
6. A task becomes `completed` only when its acceptance criteria and verification evidence are recorded.
7. PRs are reviewed and merged under repository protections. The orchestrator never auto-merges or deploys.

## Files

- `tasks.json`: durable task queue and current ownership.
- `task.schema.json`: task record contract.
- `checkpoints/TASK-XXXX.md`: human-readable resume instructions.
- `scripts/validate_work_queue.py`: dependency-free structural and lifecycle validator.
- `scripts/build_completion_dashboard.py`: evidence-driven completion-gate dashboard.
- `tests/test_validate_work_queue.py`: regression tests for queue invariants and dashboard evidence rules.
- `work-queue.yml`: scheduled and change-triggered validation, unit tests and dashboard reporting.

## Worker claim protocol

A claim is provisional until its registry change is merged into the default branch. Workers must not begin task work from an unmerged claim PR. The claim PR must set the single task record to `in_progress` with one owner, a fresh heartbeat, lease expiry, and checkpoint. Before starting, the worker must update its branch from the latest default branch and rerun the queue validator. If another claim has already landed, the task record must be reconciled rather than overwritten. A single canonical task record can name only one active owner; duplicate task IDs and duplicate active ownership by the same worker are rejected by validation. This is a Git/PR-mediated claim protocol, not a standalone distributed lock service.

## Worker lease protocol

- Default lease: 45 minutes.
- Heartbeat target: every 10 minutes or after each meaningful milestone.
- Recovery grace: 15 minutes after lease expiry.
- A worker must commit or checkpoint before a planned handoff.
- A worker must not claim a task owned by another worker with a valid lease.
- Reassignment is a controller decision; v1 reports expired leases but does not pretend to launch replacement agents. Agent-platform launch integration remains blocked until the actual execution platform and its supported API/authentication contract are identified; no endpoint or credential scheme is assumed.

All timestamps are ISO-8601 UTC with a trailing `Z`. Use unique task IDs. Keep tasks small enough to complete in approximately 30–90 minutes. Split larger work.

## Status lifecycle

`backlog -> ready -> in_progress -> review -> completed`

Exceptional states: `blocked`, `stalled`, `cancelled`.

A blocked task must state the exact blocker and next action. A stalled task must preserve its owner, last heartbeat and checkpoint until reassigned. A task in review must link its PR and required checks.

## Commands

```bash
python scripts/validate_work_queue.py
python scripts/validate_work_queue.py --strict
```

Strict mode fails on operational warnings. Structural validation rejects malformed records, duplicate active ownership, dependency cycles, invalid leases, and completed tasks without passing evidence. Scheduled reporting uses non-strict mode so it can report stalled work without making the workflow itself fail.

## Safety and concurrency

- One active owner per task.
- Declare file ownership in each task.
- Avoid overlapping file ownership across concurrent tasks. Claims are not active until merged; always refresh against the latest default branch before beginning work. The validator rejects duplicate task IDs and duplicate active ownership by the same worker, but the PR process remains the serialization boundary rather than a transactional lock API.
- Never store secrets, tokens, personal student data or credentials in task records/checkpoints.
- Do not mark work complete because a PR exists or code merely compiles.
- A green workflow is evidence only for the checks it actually ran.
- The registry is updated through PRs; the controller must not race workers by writing the same file automatically.
