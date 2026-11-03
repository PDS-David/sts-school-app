# S-DECISION — Resolve and implement ONE blocked SS1 item

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

- `docs/ss1/work/BLOCKED_DECISIONS_20261030.md`
- `docs/ss1/work/OWNER_DECISIONS_TECHNICAL_20261030.md`
- `docs/ss1/work/MISSING_MATERIAL_20261030.md`
- `docs/ss1/contracts/CONTRACT.md`
- `backend/src/db/ss1/subjectPackageSchema.ts`

## Required inputs and owner questions

Ask the owner at the start: “Which subject and one blocked task ID shall I resolve?” Display the live blocked IDs for the subject if none was named. Read that subject's QUEUE.json and package. Do not require every school's decision or every file before working on one item. Exact source files/hashes are in that queue item's required_attachments and SOURCE_ASSIGNMENTS.csv. For book extracts/audio, obtain edition/track, exact bytes and reuse basis only if that branch of the decision is chosen.

## Implement

Read the item's prerequisites and evidence, not just its BLOCKED label. Complete the factual preparation required for a meaningful question, or ask the owner to assign that prerequisite if it exceeds this scope. Present an exact decision with alternatives and a recommendation. Examples: source-preserving equation recovery versus reviewed replacements; named alias mapping; original excerpt versus explicit equivalent; an actual log-table edition versus calculator teaching. Do not presume teacher access: scholarly primary evidence or owner acceptance of an explicitly labelled equivalent may satisfy the appropriate claim, but not false expertise or rights.

Once answered, record the genuine decision with affected IDs. Implement the bounded consequence: update a permitted alias's approval_reference, add or correct one lesson/asset, or create the exact follow-up task if the answer requires a larger implementation. Do not mark a missing lesson implemented merely because its design was approved. If a new source is supplied, ask for the shared registry extension assignment before editing it; preserve its original hash/member and document why it is additional. A decision that “no file exists” closes receipt uncertainty only; it does not close an uncovered teaching objective or missing audio skill. A scheme-only entry is not a complete lesson. Do not take the old memo's “not required” alternatives as authority to erase an objective.

Publish the decision and actual implementation in one subject-only PR. Shared foundation changes are a separate explicitly approved task.

## Owned outputs

The selected subject package, queue, subject assets where justified, and one decision/task note. Shared schema/registry/runtime only in a separate owner-approved assignment.

## Completion condition

One identified decision actually answered by the owner, its legitimate implementation made, and any remaining objective gap accurately retained. If unanswered, checkpoint and keep the question pending; do not mark complete.
