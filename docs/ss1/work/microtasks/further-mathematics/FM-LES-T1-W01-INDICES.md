# FM-LES-T1-W01-INDICES — Further Mathematics, 1st Term Week 1 indices replacement (reconciliation)

Status: **IMPLEMENTED_TESTING_DEFERRED**, closed **by reference** to the lesson ported by FM-PORT-D3-L001. No lesson was authored or edited here. Content approval PENDING, verification DEFERRED; not approved, not verified. Testing deferred by owner.

## Inputs
- Starting SHA: `eadc69f5b03aa57794bdfd4481bbd1fce53cbefa` (origin/master, 2026-11-05). No `AGENTS.md`.
- Prerequisites FM-SRC-T1, FM-WK-T1-W01 and FM-PORT-D3-L001 are IMPLEMENTED_TESTING_DEFERRED.
- Overlap check: no remote branch for this item; the only unmerged branches touching Further Mathematics files are the 2026-10-27 PR71 branches (package JSON and test only; not the queue or this note). The GitHub PR list was not available to this session (API rate limit), so open PRs were not confirmed directly.
- Original source not re-read. The recorded defect list in `OI-FM-T1-W01-FACT-DEFECTS` and the notes in FM-WK-T1-W01.md and FM-PORT-D3-L001.md were used.

## Authoring requirements against the existing lesson
Lesson: `SUP-SS1-FURTHER-MATHEMATICS-T1-W01-INDICES`, `body_sha256` `7745eb2b4ea9f09762f8fefac60339a4a998569ac635b13ceca9d6ab4aa2d4c8` (recomputed over the UTF-8 body: matches).

| Requirement (queue item) | Result |
|---|---|
| ONE replacement covering both objectives | Met: definition, Laws 1–8, Examples A–E |
| Original practice, complete answers, marks that sum | Met: 9 items, 30 marks; each marking list sums to its item; every answer present |
| Exact body hash; state PENDING / IMPLEMENTED / DEFERRED | Met; approval and verification references null |
| Provenance, stable ID convention | Met: 3 entries; `SUP-SS1-<SLUG>-<SUFFIX>` |
| Both coverage entries point at it with objective-level evidence | Met: OBJ-1 and OBJ-2 list the lesson id and carry a dedicated evidence entry |
| Printed source exercises not used as a key | Met; Q9 uses the printed cube-root error only as a find-the-error item |
| Every index, root and fraction explicit (NOTATION-LOSS) | Met: caret notation, roots in words or ∛ |

Defect list `OI-FM-T1-W01-FACT-DEFECTS`:

| # | Defect | In the lesson |
|---|---|---|
| 1 | zero index for 0 | Law 4 requires a ≠ 0; 0^0 undefined |
| 2, 3 | cube-root chains | Law 7 and Example A; Q9 |
| 4 | "m times" | m copies, m factors; m a positive whole number |
| 5 | missing conditions | stated for Laws 2, 5, 6, 7, 8 |
| 6 | skipped step | Law 8 shows (a^(1/n))^m = (a^m)^(1/n) |
| 7, 8 | Example iv, brackets, 4^2 | Example C; no unbalanced line (checked); 4^2 = 16 stated |
| 9 | letter o | digit 0 throughout |
| 10 | "Solve" | none used |
| 11 | item (f) | not reused |
| 12 | weekend item 2 | not reproduced |

Checks: lesson numerics (20 values, exact rational arithmetic), per-line bracket balance, JSON parse, queue counts and `depends_on` references. No tests run.

## Changes
- `QUEUE.json`: `FM-LES-T1-W01-INDICES` → IMPLEMENTED_TESTING_DEFERRED with a reference-based `implementation_reference`; `status_counts` 22/57 → 23/56 implemented/pending (blocked 7; total 86).
- Unchanged by design: `counts` (item kinds), `next_runnable` (`FM-SEC-T3-W08-PERIOD3`, still PENDING and still eligible), the package JSON, both coverage entries, the three `OI-FM-T1-W01-*` open items, `FM-COR-T1-W01` and all other items.

## Still separate and unresolved
- **Week 2 exponential equations:** weekend items 1, 3, 4 are not reproduced; `COV-FM-T1-W01-OBJ-2` stays PARTIAL; `FM-WK-T1-W02` PENDING.
- **Ambiguous exponent:** general-evaluation item (f); `FM-FACT-T1-W01-GEN-EVAL-F` BLOCKED on teacher or owner.
- **Reading reference:** page range "Chapter 2 pg. 4–6" unchecked; recorded in `OI-FM-T1-W01-ASSESSMENT-GAPS` and the OBJ-2 evidence. No queue item exists for it.
- **Delivery binding:** `FM-COR-T1-W01` PENDING; no delivery correction exists; nothing is activated for delivery.
- Open items `OI-FM-T1-W01-FACT-DEFECTS`, `-NOTATION-LOSS`, `-ASSESSMENT-GAPS` remain open and blocking.
- Owner content approval and verification.

## Observation (not a requirement failure)
Law 7 ends "the cube root of 27 is 3, not 27^(1/3) = 3^3". It is true (3^3 = 27) but can be misread as denying that the cube root is 27^(1/3). A one-sentence rewording is optional and was not made, per the instruction not to touch the lesson.
