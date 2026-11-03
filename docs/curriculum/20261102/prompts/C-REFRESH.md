# C-REFRESH — Refresh the next one-task assignments after merges

## Execution contract — applies to this prompt

Repository: https://github.com/PDS-David/sts-school-app . Target branch: master. Inspected snapshot: `541e8b0182a1bf31807cb84713b23b8fe3d1ad38` (2 November 2026). Fetch current master, record its full SHA, read applicable AGENTS.md, and inspect open PRs for overlapping paths. Work on a unique isolated branch. Never reset master to this snapshot. The owner assigning THIS prompt authorises only its bounded task, not the next batch.

**Decisions go to the owner during execution.** Before any unresolved choice about curriculum meaning, equivalent content, exclusion, source assignment, licence/distribution, scope, schema change, testing resumption, target, deployment or release, present the concrete evidence and ask the owner directly: (1) exact item/IDs and current fact; (2) 2–3 viable options with consequences; (3) your recommendation; (4) the exact answer/file/access needed; (5) what you will implement for each answer. Do not wait until your final report to reveal the decision. Record the actual answer and date, then implement it; never invent a signature, permission or expertise. Do independent work while waiting. If the owner explicitly says unavailable, propose a defensible equivalent or a clearly labelled scope decision; do not silently drop the objective. Acceptance of an equivalent does not prove the original's identity. An approval cannot create missing factual evidence or third-party rights.

**Missing prerequisites are a conversation, not an abandoned task.** Check current repo evidence first, then supplied files and connected Library where available. For a known source, request its exact standalone filename/member/hash below, not a huge ZIP unnecessarily. If absent, ask the owner during execution and keep the task pending; save concrete independent work. Do not fabricate source bytes. For a missing tool, use a compatible installed tool and record differences; if it changes correctness, ask. For unavailable GitHub write access, finish local work and provide a binary-capable patch, a git bundle if a commit exists, base/head SHA and apply instructions, and ask the owner to link GitHub or designate a publisher. Never request a token/password pasted in chat. For no repository access, ask for a current repository archive/bundle plus master SHA; do not substitute an old audit patch chain. A required unanswered decision remains pending, not automatically approved.

**Scope and preservation.** Preserve all original instructional content/provenance and other classes, UI and learner records. JSS3 instruction belongs in First/Second; Third is BECE preparation and Computer Studies is excluded. SS1 uses all THREE instructional terms and includes Data Processing. Senior substantive teaching must finish by end SS2; SS3 is exam preparation. Never apply JSS3 exclusions to SS1. Preserve existing order/PIN settings unless the owner separately authorises a concrete change. No production connection/import/migration/cache retirement/deployment is authorised by an implementation prompt.

**Verification policy.** Full testing remains deferred until the owner explicitly resumes the relevant phase. During implementation, do source reading, extraction/rendering, JSON parsing, file/body hashing, unique-ID/reference checks, marking arithmetic and diff review. Write regression tests where needed, but do not execute suites, typechecks, importer/DB/device checks. Automatic CI may run; do not disable it or call it full acceptance. Verification prompts below must ask for testing resumption before executing. Never weaken a gate to make a count pass.

**Publication and continuity.** Implement actual lesson/code/asset changes where assigned, not only recommendations. Use existing schema; request a concrete versioned extension if it cannot express the requirement. Keep private originals/full extracts/renders/snapshots/secrets out of Git. Save an early checkpoint of completed changes and exact next action; publish it as a draft PR if useful. Finish one task, commit/push its branch and open one PR to master; do not merge another worker or force-push master. If overlap exists, ask the owner which worker owns it, while completing safe analysis. Report IMPLEMENTED, VERIFIED, MERGED and DEPLOYED separately. End with changed files, base/head, PR or patch, actual checks, unresolved decisions, and the next task ID. Do not declare the class complete from task completion. No agent can promise unavailable evidence or a remote service will never block; it must make that dependency actionable for the owner.

## This task only

**Prerequisites:** No implementation dependency; inspect current master first.

## Read these existing repository files

- `scripts/ss1/refresh_next_tasks.py`
- `docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md`
- `docs/jss3/completion/NO_RESPONSE_CLOSEOUT/REMAINING.md`

## Required inputs and owner questions

Repository only; no originals, DB or teacher response. Ask owner only if a live queue dependency/status or worker-ownership conflict cannot be resolved from actual merged evidence.

## Implement

Fetch master and inspect merged/open PRs. For SS1 use python3 scripts/ss1/refresh_next_tasks.py (documentation generation, not test execution), then review every selected task against live status/dependencies and source attachments. Extend the generated prompts to carry this pack's point-of-execution decision protocol; do not regress to “stop because a source is absent” without asking the owner. Retire stale indexes by a pointer to the current authoritative index, preserving old evidence as historical. Recompute counts and distinguish inventory/indexing from authored curriculum/runtime readiness. Update this pack's README or a new dated index for actual changed tasks only; do not close source/approval/verification gaps by inference. For JSS3 use its canonical remaining IDs; for senior/early-years only existing receipt/queue entries. No new invented task IDs in existing subject queues merely to increase coverage.

## Owned outputs

Prompt generator/assignment documentation only. No subject packages or runtime changes.

## Completion condition

Published current next assignments with no completed task reissued, exact per-task inputs and ownership; no curriculum statuses changed without evidence.
