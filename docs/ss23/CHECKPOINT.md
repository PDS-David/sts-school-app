# SS2 / SS3 curriculum readiness — checkpoint

Task: SS23-00 baseline inspection. Date: 2026-11-13. Base: master @ 982c1d2.
Status: **SOURCES RECEIVED 2026-11-13 (task SS23-00 done); content work not started.** See `docs/ss23/sources/README.md` for hashes and gaps. SS3 Third Term source archive is EMPTY.

## Evidence (live repository, not assumed)
| Check | Result |
|---|---|
| SS2/SS3 source archive under `docs/` | None. Only `docs/ss1/sources/SSS1-original.zip` (SSS1 members only; no SS2/SS3 member names) |
| SS2/SS3 subject packages (`backend/src/db/ss1/subjects/`) | None. 22 SS1 packages only |
| Source registry (`sourceRegistry.json`) / `SOURCE_ASSIGNMENTS.csv` | 61 rows, all SS1 |
| SS2/SS3 branches / PRs | None (400 branches listed, none SS2/SS3-named) |
| Class registration | `SS 2`, `SS 3` exist as class names (`seed.ts`, `bootstrap.ts`) only |
| SS 3 ingestion | `ingestTopics.ts` treats SS 3 as **audit-only, excluded from normal curriculum and subject creation** |
| SS1 tooling reusable for SS2/SS3 | `validateSubjectPackages.ts`, `refreshIntegrityHashes.ts`, `compiler.ts`, `studentDelivery.ts` are SS1-scoped; extending needs a decision on schema/class scope |

Not run: `npm run validate:ss1` (no code changed; SS1 status is not evidence for SS2/SS3).

## Task log
| Task | Status | Evidence |
|---|---|---|
| SS23-00 baseline | done | this file |
| SS23-S0 source receipt + inventory | done | `docs/ss23/sources/` (100 members hashed; not committed as extracts) |
| SS23-01 generalise validator to SS2/SS3 | pending | needs owner policy answers below |
| SS23-02… per-subject packages | pending | after SS23-01; SS2 alphabetical, one PR per subject |

## Owner decisions still needed (one message)
1. SS3 policy: `ingestTopics.ts` treats SS 3 as audit-only. Keep that, or deliver SS3 as normal curriculum?
2. SS3 Third Term (empty archive), missing Technical Drawing / Catering Craft / SS3 T2 Food & Nutrition, and duplicated Literature and Book-keeping terms: supply the real files, or authorise clearly-labelled authored supplementary content from the national syllabus?

## Exact next action
Resume from the latest commit on this branch; start SS23-01 once decision 1 is answered, otherwise begin per-subject header/week verification for SS2 (needs re-supplied archives: verify SHA-256 against README first).
