# YO-WK-T3-W11 — Yoruba, 3rd Term, Week 11 revision/test pair

Status: **IMPLEMENTED_TESTING_DEFERRED** (source indexing implemented; not approved, not verified). Testing deferred by owner. This task classifies the scheme's revision/test pair as a **SCHEME_ONLY marker**. No Week 11 teaching or examination content is authored, and no teaching objective is marked complete by this marker.

## Inputs and source identity

- Base: `master` at `54b57cba4f968a290c9e7fdbb4892e375a20634e` before this task's package change.
- Dependency `YO-SRC-T3`: `IMPLEMENTED_TESTING_DEFERRED`; source `SS1-SRC-4cc6aae9ed7d`.
- Attached source: `3RD TERM S1 YORUBA.docx`, 68,373 bytes; SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`. The hash was independently recomputed from both attached copies in this turn; both matched the registered source digest.
- Registered archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`; the package's `sources[]` entry carries the same member digest.
- Existing source inventory: `docs/ss1/work/microtasks/yoruba/YO-INV-T3.md`; its method is Mammoth 1.12.2 `extractRawText()`, with 1-based extracted-text line locators.

## Exact scheme pair

The exact extracted-text block is lines **81–83** (line 82 is blank), 129 characters, SHA-256:

`a8579d59815b77e42e64ccf1a8134d8ba38ca3a2620e47a3df08c1224f3934c3`

The two paragraphs read:

- Line 81: `EDE:\tAtunyewo eko lori ise saa yii ninu ede, asa, ati litireso.`
- Line 83: `  \tAtunyewo  idanwo lori ise odun yii ninu ede, asa ati litirso.`

The first is an EDE-labelled revision pointer for the term's EDE, ASA and LITIRESO work. The second is an unlabelled revision/test pointer. The pair has no numbered week label, no separate ASA or LIT row, and no supplied test paper. The inventory reports that these are the only two occurrences of `Atunyewo` in the source.

## Original document body check

- The existing inventory identifies ten teaching sections, Weeks 1–10, beginning at extracted-text line 121 (`OSE KINNI`) and ending at line 2463 (`OSE KEWAA`). The final section runs through its own exercises; there is no Week 11 teaching section after it.
- The attached DOCX was also inspected at the OOXML paragraph level in this turn: `word/document.xml` contains 1,231 body paragraphs. The two revision paragraphs occur at original body paragraph positions 41 and 42. The last non-empty body paragraphs are the Week 10 material, including its `IGBELEWON`, `Ise Asetilewa` and `Apa keji`; the document then ends. This confirms the inventory's finding that there is no Week 11 revision lesson, examination teaching body or test paper in the supplied document.
- The source inventory records no embedded drawings, tables, equations, images or other visual objects in this DOCX. No visual rendering claim is made.

## Classification

**Decision: SCHEME_ONLY marker, not an open item and not a teaching lesson.**

The existing schema at `backend/src/db/ss1/subjectPackageSchema.ts` permits `classify_marker` with `kind: SCHEME_ONLY`. The compiler at `backend/src/db/ss1/compiler.ts` explicitly emits a SCHEME_ONLY disposition when the unique exact anchor does not occur in a parsed teaching row. That is the correct disposition here: this pair is preamble scheme metadata before the first parsed lesson, not a parsed Week 11 body.

Added to `backend/src/db/ss1/subjects/yoruba.json`:

- Rule `SS1-SRC-4cc6aae9ed7d-R002`, `op: classify_marker`, `kind: SCHEME_ONLY`, bound to the source SHA-256 and the exact two-paragraph anchor.
- Coverage `YO-T3-W11-SCHEME-REVISION-TEST`, status `MARKER`, with the rule ID as its marker target and evidence for the exact scheme block and absence of a following teaching/examination body.

The marker classifies only the revision/test pointer. It does not stand for a lesson, supply an assessment, satisfy any untaught objective, or remove, replace or override the ten teaching sections already indexed for Weeks 1–10. No revision or examination content was invented.

## Queue update

- `YO-WK-T3-W11` → `IMPLEMENTED_TESTING_DEFERRED`.
- Yoruba queue status counts recomputed from its 152 items: **41 implemented/testing-deferred, 77 pending, 34 blocked**.
- Existing `next_runnable` list retained; this task was dispatched explicitly and the queue's independent sequencing list was not rewritten.
- No other task, subject, package or shared schema was changed.

## Checks and limits

Performed:
- SHA-256 and byte-count check of both attached DOCX copies against the registered member digest.
- Original OOXML paragraph inspection for the revision paragraphs and document ending.
- Confirmed the source entry exists and its digest matches the attached file.
- Confirmed the new source-rule and coverage IDs are unique.
- Confirmed the coverage target is the new SCHEME_ONLY rule, and the package and queue JSON parse.
- Recomputed queue status counts from actual queue items.

Deferred/not claimed:
- Full compiler, importer, package-schema CLI, type checks, full tests, CI, database, device/runtime, delivery and deployment checks were not run, in accordance with the owner's testing deferral.
- No teacher approval, source certification, formal acceptance or production delivery is claimed.
