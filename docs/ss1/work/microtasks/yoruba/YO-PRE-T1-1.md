# YO-PRE-T1-1 — Yoruba, 1st Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The opening block is classified **SCHEME_ONLY**, not as teaching text: three MARKER coverage entries and one `classify_marker` rule record it, and one open item keeps the term-wide scheme confirmation with the owner. No lesson, asset or delivery change.

## Inputs
- Base: `ss1/yo-wk-t1-w08` at `4dd88b4` (the Week 8 branch head, PR #203), stacked on #202, #201, #200 and #199 back to master `f4f0719d57b11fba39b499501060da59efe6532b`. PRs #199–#203 are open and unmerged, so this branch is **stacked** and its PR targets `ss1/yo-wk-t1-w08`; it is merged after #199–#203, following the precedent recorded in `ceb9a31`.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. `YO-PRE-T1-1` was the `next_runnable` recorded by Week 8 in #203.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1–8 (1,781 lines). Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Opening block
- The document opens at line 3 and reaches Week 1 at line 61, so the block is lines 3–51 after the blank lines 52–60. It is **not** a teaching body and has no week marker; the teaching weeks use `OSE ...` labels and Week 1 begins with `OSE KIN-IN-NI` (line 61, `3dbfebf0…bbebcee3`).

| Element | Lines | Hash (1 line) | Role |
|---|---|---|---|
| Title `ODUN IGBEKO YORUBA-SS 1` | 3 | `d8437b73…998f09a9` | Names the year group and subject; already the anchor of rule R001 |
| Term heading `ISE OOJO-SAA KIN-IN-NI` | 5 | `fc6b29dc…617e42b5` | The document's only term heading; irregular spelling, no teaching text |
| Scheme list, 22 topic paragraphs | 9–51 | `afccd54e…5b4f6af6` | Unnumbered topic list for the term |
| Whole block | 3–51 | `843e0cf1…ab741e32` | Trimmed block hash, no non-ASCII character |

- The block contains **0** characters in U+00C0–U+024F, **0** combining marks and **0** other non-ASCII characters.

## The 22-topic list
- The list is 22 topic paragraphs, from `Atunyewo awon eya ara ifo` (9) to `Itupale asayan iwe ti ajo WAEC/NECO yan.` (51). There is no list heading of its own and no topic number in the text: extraction returns the paragraphs one after another.
- The topics are bound to the eight teaching weeks by position and exact heading match — three topics for Weeks 1–5 and Week 8, two for Weeks 6 and 7 — and each binding is asserted with its own line hash in `YO-T1-W01..W08-SCHEME-*`. The list itself teaches nothing, so the coverage entries for the list are MARKER, not PARTIAL.
- The list is the only place the term's topics appear together: the week headings are Yoruba ordinals and the parser produces no rows for this source (`YO-FND-T1-01`).

## Coverage entries added (3, all MARKER)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-PRE-TITLE` | Document title naming the year group and subject | 3 | `d8437b73…998f09a9` |
| `YO-T1-PRE-TERM` | Term heading announcing the first-term scheme | 5 | `fc6b29dc…617e42b5` |
| `YO-T1-PRE-SCHEME-LIST` | The unnumbered 22-topic scheme list | 9–51 | `afccd54e…5b4f6af6` |

All three carry `lesson_ids: []` and two or three evidence entries. A MARKER entry records scheme or preamble text that must not be taught and must not be discarded; it is not a delivery claim.

## Classification
- Rule `SS1-SRC-48b641249e3b-R002` (`classify_marker`, kind `SCHEME_ONLY`) is anchored at `ODUN IGBEKO YORUBA-SS 1`, which occurs exactly once, and covers the block lines 3–51. This is the fourth rule on the source, after the three `source_alias` rules R001 for the 1st, 2nd and 3rd Term documents.
- The classification is scheme-only because the block has no teaching proposition: it names the subject and term and lists 22 topics without defining, explaining or illustrating any of them. The week bodies are indexed separately (Weeks 1–8).
- Open item `YORUBA-T1-PRE-SCHEME-LIST` (CONTENT, blocking) keeps the term-wide confirmation open: the subject owner or expert must confirm the 22-to-eight mapping and decide the irregular term heading under the notation and defect decisions. The per-week `YORUBA-T1-W01..W08-SCHEME-MAPPING` items therefore stay open.

## Queue changes
- YO-PRE-T1-1 → `IMPLEMENTED_TESTING_DEFERRED`; the previous `next_runnable` value is consumed. No item was appended: preamble indexing produces no lesson or asset task.
- Counts: **79 items unchanged**; status 15 implemented / 56 pending / 8 blocked; `next_runnable` → `YO-VIS-T1-01`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records the indexed preamble and its required action starts at the visual and foundation items, then the 2nd- and 3rd-Term indexes.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add the three MARKER coverage entries, the scheme-only rule and the open item.
- Not approved and not verified. The block is recorded verbatim; no correction to `ISE OOJO-SAA KIN-IN-NI` is authored here, and no topic is renumbered.
