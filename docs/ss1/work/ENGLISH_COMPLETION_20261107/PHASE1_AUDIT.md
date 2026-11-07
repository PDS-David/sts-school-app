# English Phase 1 audit — 7 November 2026

## Scope and source of truth

- Repository: `PDS-David/sts-school-app`
- Branch: `master`
- Audited head before this report: `4246dec9d193ba64accad922bf747efeb6fab986`
- Live English queue: `docs/ss1/work/microtasks/english/QUEUE.json`
  - blob SHA: `3bdf7b77ab7af14bc933b3f29ab29fab67cde8e8`
- Live English package: `backend/src/db/ss1/subjects/english.json`
  - blob SHA: `130d28d1f2381b1a9a6b18e2c68c07e9193de408`
- Prompt pack: `docs/ss1/work/ENGLISH_COMPLETION_20261107/`
- No `AGENTS.md` exists anywhere in the current repository tree.
- No tests, typechecks, source importer, database operation, runtime/device check, or deployment was run during this audit.

The live queue and package are authoritative. Historical CLOSEOUT/RESUME documents and the uploaded snapshot are not live status sources.

## Prompt-pack audit

All 88 numbered prompt files exist in the repository: 001–084 are individual task prompts; 085–088 are completion instructions. The uploaded final prompts 087 and 088 are present in the repository folder. The current README and RUN_ALL instruction agree on the 88-prompt sequence and English-only scope.

The four completion instructions require:
1. Find and add newly discovered English work until no independent non-test follow-up remains.
2. Reconcile all three terms at objective level, including source/supplement coverage and correction scope.
3. Prepare a concrete verification handoff without running deferred verification.
4. Record a truthful acceptance decision; English remains incomplete if any gate remains.

Prompt categories:
- 001–025: term/week source indexing for remaining T1/T2/T3 weeks.
- 026–033: scheme-objective reconciliation, correction scope, reading-supplement binding, cross-term body review and visual dispositions.
- 034–044: external material decisions, skim/scan, unified test and vocabulary/comprehension follow-ups.
- 045–049: T1 Week 7 transport, noun clauses, consonants, narrative and revision.
- 050–073: 24 exact source-to-supplement correction bindings.
- 074–078: prescribed reading, oral audio, content approval, audio asset and T1 W07 textbook dependencies.
- 079–084: six test-draft tasks only; execution remains deferred.
- 085–088: new-gap closure, coverage closure, verification gate and acceptance.

Important prompt freshness issue: prompt 076 describes 16 lessons, but the live package contains 47. Apply its approval requirement to all 47 live lessons, not the stale count in the prompt. Do not alter original source files or shared schema/runtime under this pack.

## Live queue audit

The queue contains 242 items. Computed directly from all queue items:

| Status | Count |
|---|---:|
| IMPLEMENTED_TESTING_DEFERRED | 118 |
| PENDING | 118 |
| BLOCKED | 6 |
| **Total** | **242** |

Task kinds:
- 3 source registrations — implemented/testing deferred
- 32 source-week indexing tasks — implemented/testing deferred
- 138 lesson tasks — 46 implemented/testing deferred, 91 pending, 1 blocked
- 37 factual dependencies — 7 implemented/testing deferred, 27 pending, 3 blocked
- 24 correction bindings — implemented/testing deferred
- 1 asset task — blocked
- 6 test-draft tasks — implemented/testing deferred (tests not run)
- 1 owner decision — blocked

The queue's current `next_runnable` begins with T3 W01 revision, misspelt-word practice and dictionary-entry follow-ups, then the T3 W01 external-material follow-up and the T3 W02–W11 objective-level work. Always recompute from the live queue after each commit; do not rely on an old static next-task note.

## Live package audit

The actual package currently contains:

| Component | Count / state |
|---|---:|
| Registered source terms | 3 |
| Source rules | 82 |
| Authored lessons | 47 |
| Delivery corrections | 24 |
| Registered assets | 0 |
| Objective-level coverage rows | 668 |
| Open items | 138 |
| Package status | PENDING |

Coverage by term:

| Term | SUPPORTED | IMPLEMENTED_EQUIVALENT | PARTIAL | UNRESOLVED | MARKER | Total |
|---|---:|---:|---:|---:|---:|---:|
| 1st Term | 12 | 130 | 87 | 62 | 11 | 302 |
| 2nd Term | 0 | 22 | 53 | 20 | 10 | 105 |
| 3rd Term | 0 | 18 | 171 | 61 | 11 | 261 |
| **Total** | **12** | **170** | **311** | **143** | **32** | **668** |

There are 454 PARTIAL or UNRESOLVED coverage rows. Open items by kind: CONTENT 117 (112 blocking), VERIFICATION 2 (both blocking), FACT 10 (9 blocking), OWNER_ACTION 8 (all blocking), PERMISSION 1 (blocking). All 47 lesson records currently have implementation=IMPLEMENTED, content_approval=PENDING, and verification=DEFERRED. The package correctly remains PENDING.

The latest contextual word-meaning lesson is present as lesson `SUP-SS1-ENGLISH-CONTEXTUAL-MEANING-T3-W01`. Its four coverage rows are included in the 18 T3 IMPLEMENTED_EQUIVALENT count.

## Owner instruction received during this audit

The owner has explicitly authorised original, curriculum-aligned equivalent material wherever authorised textbook/prescribed material is inaccessible, including reading/comprehension passages, practice, listening/audio materials and content review. This permission is sufficient to proceed without waiting for textbook-page uploads or external teacher materials.

Operational consequences:
- The five material/owner-dependent queue blockers can be progressed through original equivalent material and a documented owner-delegated editorial review.
- Any approval record must truthfully identify itself as an agent-performed editorial/content review under the owner's explicit delegation. It must not impersonate a named teacher or claim a human signature that was not supplied.
- Any audio must be original or demonstrably rights-cleared, with actual bytes, exact hash, byte count, MIME type, attribution/rights and lesson binding. No placeholder asset.
- Preserve the original source and identify each equivalent as original; record objective alignment and provenance.
- The remaining technical gate is T1 W07 revision: its exact underlined targets must be visually inspected from the hash-verified original Word source before writing the keyed matching exercise. Do not guess from flattened text.

The six currently BLOCKED queue IDs are:
- `ENG-FACT-PRESCRIBED-PASSAGES`
- `ENG-FACT-ORAL-AUDIO`
- `ENG-FACT-CONTENT-APPROVAL`
- `ENG-ASSET-AUDIO-MODEL`
- `ENG-OWNER-T1-W07-TEXTBOOKS`
- `ENG-LES-T1-W07-REVISION`

Queue state has not yet been changed by this policy decision; task evidence and package/open-item updates must be committed before reclassifying any item.

## Source identity and access

The repository contains `docs/ss1/sources/SSS1-original.zip` (35,828,550 bytes; Git blob SHA `f5b5818fb301444043934219909f7ca1d45aec56`). The registered archive SHA256 is `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.

English source members:
- T1: `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc` — SHA256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`
- T2: `SSS 1/2nd Term SS1_/ENGLISH.docx` — SHA256 `ea9c7d70ffb8682fcf9dd9c4ebc2155fc6aa17aededc4743354add0cfeb72966`
- T3: `SSS 1/3rd Term SS1_/3RD TERM S1 ENGLISH LANGUAGE.doc` — SHA256 `3a2174ad562794b593c42cbd61fc68843703846651fc0d2bbac3b38b0d9c0f5f`

The archive and member identities are already registered. Do not ask for another upload. Verify the hashes before any source-dependent extraction. Keep extracted originals and private renders out of Git.

## Master execution checklist

### A. Complete the remaining authoring queue
- [ ] Recompute live queue and package state before each task.
- [ ] Complete remaining T1/T2/T3 objective-to-source indexing and every follow-up lesson raised by indexing.
- [ ] Use original equivalent passages, exercises and answer keys where prescribed material is inaccessible.
- [ ] Complete T1 W07 source visual inspection before keyed revision practice.
- [ ] Finish all 24 correction-scope reviews without losing any displaced objective.
- [ ] Complete provenance review; cite accurate sources and distinguish factual citation from reuse permission.
- [ ] Produce rights-cleared original audio and register actual asset bytes/metadata.
- [ ] Complete all 47 lesson editorial reviews under the owner's delegation; record a unique auditable review reference for each.
- [ ] Resolve all 668 coverage rows and every blocking open item; no PARTIAL/UNRESOLVED gaps at content-complete stage.
- [ ] Run the new-gap closure instruction again after indexing and authoring.

### B. Preserve the verification boundary
- [ ] Keep all six drafted test tasks as drafts only until the owner lifts testing deferral.
- [ ] Do not run tests, typechecks, source importers, DB operations, preservation captures, runtime/device checks or deployment during authoring.
- [ ] When authorised later, execute the exact deferred commands and retain logs, versions, exit codes and skipped checks.
- [ ] Complete separate SS1-08 runtime, asset sanitisation, device and DB compatibility gates before any release claim.

### C. Close out honestly
- [ ] Recompute queue counts and next_runnable after every bounded commit.
- [ ] Update the closeout with live hashes and status; do not reuse stale 46-lesson/139-open-item counts.
- [ ] Distinguish content-complete, owner-delegated editorially reviewed, technically verified and released.
- [ ] Do not mark package IMPLEMENTED or claim student delivery until the contract's real gates are met.

## Safe parallel-agent prompts

Parallel agents must work on separate draft files only. No agent may edit the shared English package JSON, queue JSON, source registry, schema, runtime or another agent's draft. The integrator will review and merge approved work sequentially.

**Prompt A — Term 1 draft author**
> Work only on assigned pending SS1 English Term 1 queue IDs. Read the live queue entry, task prompt, source locator and contract. Draft original curriculum-aligned lesson content and complete marked practice in a standalone file under `docs/ss1/work/ENGLISH_COMPLETION_20261107/agent-drafts/T1/`. Include exact objectives, lesson body, answers, marking criteria/totals, source/provenance notes and proposed coverage/open-item changes. Do not edit shared package or queue files. Do not invent source wording, textbook pages, permissions or approvals.

**Prompt B — Term 2 draft author**
> Same rules as Prompt A, restricted to Term 2 and a disjoint list of assigned queue IDs; write only under `agent-drafts/T2/`. Use original equivalents when source material is unavailable and label them clearly.

**Prompt C — Term 3 draft author**
> Same rules as Prompt A, restricted to Term 3 and a disjoint list of assigned queue IDs; write only under `agent-drafts/T3/`. Preserve the exact objectives and do not duplicate existing lessons.

**Prompt D — Audio and provenance researcher**
> Identify or create a rights-cleared original listening model suitable for the English phonetics/stress objectives. Deliver actual audio bytes plus creator/method, licence/rights basis, accent/model, objective mapping, MIME type, byte count and SHA256. Save a report and asset candidate only under `agent-drafts/audio/`; do not edit the shared package or register a placeholder.

**Prompt E — Independent content reviewer**
> Independently review the assigned English lesson drafts for SS1 suitability, objective coverage, factual accuracy, answer-key correctness, mark totals, clarity and originality. Return a concise pass/revise report with exact lesson IDs and evidence. Do not claim to be a human teacher, sign on another person's behalf, or edit shared package/queue files.

## Phase 1 decision

The repository and all 88 task prompts are present and reconciled. No further user upload is required to begin the remaining English authoring. The owner has removed the need to wait for prescribed textbook extracts or external teacher-supplied audio/material. The only source-specific authoring hold identified in the current queue is the T1 W07 underlining inspection; all other work can proceed in dependency order while verification remains deferred.
