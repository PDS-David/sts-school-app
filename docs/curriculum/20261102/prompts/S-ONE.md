# S-ONE — Execute ONE named later SS1 queue item

## Execution contract — applies to this prompt

Repository: https://github.com/PDS-David/sts-school-app . Target branch: master. Inspected snapshot: `541e8b0182a1bf31807cb84713b23b8fe3d1ad38` (2 November 2026). Fetch current master, record its full SHA, read applicable AGENTS.md, and inspect open PRs for overlapping paths. Work on a unique isolated branch. Never reset master to this snapshot. The owner assigning THIS prompt authorises only its bounded task, not the next batch.

**Decisions go to the owner during execution.** Before any unresolved choice about curriculum meaning, equivalent content, exclusion, source assignment, licence/distribution, scope, schema change, testing resumption, target, deployment or release, present the concrete evidence and ask the owner directly: (1) exact item/IDs and current fact; (2) 2–3 viable options with consequences; (3) your recommendation; (4) the exact answer/file/access needed; (5) what you will implement for each answer. Do not wait until your final report to reveal the decision. Record the actual answer and date, then implement it; never invent a signature, permission or expertise. Do independent work while waiting. If the owner explicitly says unavailable, propose a defensible equivalent or a clearly labelled scope decision; do not silently drop the objective. Acceptance of an equivalent does not prove the original's identity. An approval cannot create missing factual evidence or third-party rights.

**Missing prerequisites are a conversation, not an abandoned task.** Check current repo evidence first, then supplied files and connected Library where available. For a known source, request its exact standalone filename/member/hash below, not a huge ZIP unnecessarily. If absent, ask the owner during execution and keep the task pending; save concrete independent work. Do not fabricate source bytes. For a missing tool, use a compatible installed tool and record differences; if it changes correctness, ask. For unavailable GitHub write access, finish local work and provide a binary-capable patch, a git bundle if a commit exists, base/head SHA and apply instructions, and ask the owner to link GitHub or designate a publisher. Never request a token/password pasted in chat. For no repository access, ask for a current repository archive/bundle plus master SHA; do not substitute an old audit patch chain. A required unanswered decision remains pending, not automatically approved.

**Scope and preservation.** Preserve all original instructional content/provenance and other classes, UI and learner records. JSS3 instruction belongs in First/Second; Third is BECE preparation and Computer Studies is excluded. SS1 uses all THREE instructional terms and includes Data Processing. Senior substantive teaching must finish by end SS2; SS3 is exam preparation. Never apply JSS3 exclusions to SS1. Preserve existing order/PIN settings unless the owner separately authorises a concrete change. No production connection/import/migration/cache retirement/deployment is authorised by an implementation prompt.

**Verification policy.** Full testing remains deferred until the owner explicitly resumes the relevant phase. During implementation, do source reading, extraction/rendering, JSON parsing, file/body hashing, unique-ID/reference checks, marking arithmetic and diff review. Write regression tests where needed, but do not execute suites, typechecks, importer/DB/device checks. Automatic CI may run; do not disable it or call it full acceptance. Verification prompts below must ask for testing resumption before executing. Never weaken a gate to make a count pass.

**Publication and continuity.** Implement actual lesson/code/asset changes where assigned, not only recommendations. Use existing schema; request a concrete versioned extension if it cannot express the requirement. Keep private originals/full extracts/renders/snapshots/secrets out of Git. Save an early checkpoint of completed changes and exact next action; publish it as a draft PR if useful. Finish one task, commit/push its branch and open one PR to master; do not merge another worker or force-push master. If overlap exists, ask the owner which worker owns it, while completing safe analysis. Report IMPLEMENTED, VERIFIED, MERGED and DEPLOYED separately. End with changed files, base/head, PR or patch, actual checks, unresolved decisions, and the next task ID. Do not declare the class complete from task completion. No agent can promise unavailable evidence or a remote service will never block; it must make that dependency actionable for the owner.

## This task only

**Prerequisites:** One owner-assigned live task with its actual prerequisites; same-subject single-writer rule.

## Read these existing repository files

- `docs/ss1/contracts/CONTRACT.md`
- `backend/src/db/ss1/subjectPackageSchema.ts`
- `backend/src/db/ss1/compiler.ts`
- `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`

## Required inputs and owner questions

Ask the owner to name the subject and task ID; if the instruction says “next”, read that subject's live QUEUE.json and offer the first PENDING non-TEST item with satisfied implementation dependencies. The owner confirms that one assignment. Read the complete item from the live queue, not only the snapshot index. Obtain its exact required_attachments (member and SHA256), required_files, allowed_write_paths, objective, locator and completion_condition. Check supplied files/Library before asking the owner for the exact missing standalone member. The full SS1 ZIP is optional for a single-member task.

## Implement

Copy the selected item's actual values into the task checkpoint before editing. Verify dependency evidence and inspect open PR ownership. If a dependency is unfinished or a genuine ambiguity exists, show the owner the exact prerequisite and proposed bounded way forward; do not silently choose another task. For a TEST item, use the verification phase only after explicit testing resumption. For OWNER_DECISION/APPROVAL use S-DECISION's procedure; no fabricated approvals.

For source inventory/indexing read only the assigned unit, preserve all substantive teaching and document objective-level evidence. For LESSON deliver the actual complete taught content, keyed practice/marks, provenance and UTF-8 body hash in the existing subject package. For ASSET preserve required notation/labels/animation, record original/derived provenance and rights, and bind a stable lesson ID. For RULE implement only uniquely anchored hash-bound structural changes, preserving originals and recording provenance. For BRANCH_COMPARISON read the exact published SHA named by the item; port unique useful material into master's existing schema only after overlap review, never merge the incompatible #71 foundation. For factual/source defects use primary evidence or ask the owner for a clearly labelled equivalent policy; do not guess meaning.

If an item is too broad, complete a coherent subunit and present the exact remainder for the owner's next assignment; keep the parent incomplete. Update status only if the original completion_condition is actually met. Preserve all unrelated items, recompute counts, and publish one subject-only PR with concrete code/content/evidence. No whole-subject rewrite, shared schema change or runtime activation under this prompt.

## Owned outputs

Only the selected live item allowed_write_paths plus its subject-local task evidence note. Shared edits require a separate owner-approved task.

## Completion condition

Exactly the named live task completion_condition is met and actual deliverables are in its permitted paths; status IMPLEMENTED_TESTING_DEFERRED only when justified. Next item named but not automatically begun.
