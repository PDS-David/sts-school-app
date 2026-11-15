# SS2 / SS3 curriculum — agent handoff

Written 2026-11-13. Repo: `PDS-David/sts-school-app`. Branch: `agent/ss2-ss3-readiness-checkpoint-20261113` (PR #684, never merge without owner review). Read `CHECKPOINT.md` and `sources/README.md` first. Do not restart the investigation.

## 1. Assignment (from owner)
Audit and complete SS2 and SS3 curriculum content. Find and fix: missing terms/weeks, superficial lessons, wrong topic associations, missing assessment answers/explanations/marking guidance, broken source references, invalid content hashes, lessons students cannot access. Subject by subject, small tasks, focused PRs, validation workflows run. Preserve provenance; keep authored supplementary content distinct from original source. Never claim SS1 readiness proves SS2/SS3.

## 2. Standing rules
- One scoped PR per subject; never merge; never weaken tests/validation; never mark done without evidence.
- Never fabricate source text. Say "not tested" when not run. "Implemented", "source verified", "tested", "teacher-approved", "accepted" are different statuses.
- Do not commit extracted source files or conversions. Keep them in private scratch.
- Owner preferences: sequential steps, show the change before applying, complete corrected files (not diffs), shell one-liners, concise docs, all questions in ONE message, never say "complete" unless every gate passed.

## 3. Verified state of the repository (master @ 982c1d2)
- No SS2/SS3 subject packages, registry rows, branches or workflows existed. SS1 has 22 packages in `backend/src/db/ss1/subjects/`.
- SS1 tooling: `backend/src/db/ss1/` (`validateSubjectPackages.ts`, `refreshIntegrityHashes.ts`, `compiler.ts`, `studentDelivery.ts`, `subjectPackageSchema.ts`, `sourceRegistry.json`). npm: `validate:ss1`, `ss1:refresh-hashes`. CI: `.github/workflows/ss1-integrity-gate.yml`. SS1 rules to copy: `docs/ss1/AGENT_EXECUTION_MASTER_INSTRUCTION.md` section 8a (merge master, refresh hashes, validate, never hand-compute hashes).
- `ingestTopics.ts` treats `SS 3` as audit-only (excluded from normal curriculum). `SS 2`/`SS 3` exist as class names in `seed.ts`/`bootstrap.ts`.
- Not run by me: any validator, any test, any DB check, `npm install`.

## 4. Source archives (supplied in-session, NOT in the repo)
Hashes and per-member SHA-256 are in `docs/ss23/sources/SOURCE_ASSIGNMENTS.csv` (100 members). The owner must re-attach the six zips; verify each archive SHA-256 against `sources/README.md` before use. Extract each to its own empty scratch directory; run Python with `-I`. `soffice --convert-to txt` works but is slow (about 10 minutes for 100 files; run in batches with a long timeout) and loses tables, where the week/topic schemes live. Use python-docx for tables and inspect originals for equations/figures.

Findings so far:
1. SS3 Third Term zip is empty (folder entry only).
2. No source file at all for: Technical Drawing SS2 T1 and SS3 T1; Catering Craft SS2 T1, SS2 T3, SS3 T1; Food & Nutrition SS3 T2.
3. SS3 Literature T1 and T2 are byte-identical. SS2 Food & Nutrition `F _ N (1) (1).docx` (in the T2 folder) is the T1 file; real T2 is `F _ N (1).docx`.
4. Book-keeping T1 and T2 are identical after the title line for SS2 and SS3.
5. Some terms are titled "Alpha"/"Sigma" and `data.pptx` (SS2 T1 Data Processing) is a PowerPoint. Filename-to-subject mapping is unverified against document headers.
6. My week-marker heuristic was unreliable (tables); do not reuse it.

## 5. Open owner decisions (ask once, in one message)
1. Keep SS3 audit-only, or deliver as normal curriculum?
2. For the empty SS3 T3 and the missing/duplicated subject-terms in section 4: supply real files, or authorise clearly labelled authored supplementary content from the national syllabus?

## 6. Task queue (resume here)
| ID | Task | Status |
|---|---|---|
| SS23-00 | Baseline inspection | done |
| SS23-S0 | Hash + inventory sources | done |
| SS23-S1 | Verify each member's header subject/term/class against filename mapping; update CSV `mapping_status` | next |
| SS23-01 | Generalise SS1 validator/schema/registry to SS2/SS3 (new `ss2`/`ss3` package dirs or a class field) | blocked on decision 1 (can design while waiting) |
| SS23-02+ | Per-subject packages, SS2 alphabetical (agricultural-science first), one PR each: extract weeks/topics from tables, build lessons with objectives, examples, exercises, answers, marking guidance; coverage records; provenance flags (`original` vs `supplement`) | after SS23-01 |
| SS23-Q | Student delivery check: confirm each lesson resolves through `studentDelivery.ts`, hashes valid via `ss1:refresh-hashes` equivalent, no unreachable lessons | after packages |

Exact next action: re-attach the zips, verify hashes, run SS23-S1, and in parallel read `subjectPackageSchema.ts` and `validateSubjectPackages.ts` to plan SS23-01.

## 7. Commands (one-liners)
- Clone: `git clone --depth 1 https://github.com/PDS-David/sts-school-app && cd sts-school-app && git fetch --depth 50 origin agent/ss2-ss3-readiness-checkpoint-20261113 && git checkout agent/ss2-ss3-readiness-checkpoint-20261113`
- Rebuild inventory: `python3 -I scripts/ss23/build_source_inventory.py <dir-of-zips> docs/ss23/sources/SOURCE_ASSIGNMENTS.csv`
- Validate (SS1 baseline): `npm run validate:ss1`
- Push: `git -c push.negotiate=true push -u origin <branch>`; open PRs with `gh api repos/PDS-David/sts-school-app/pulls -f base=master -f head=<branch> -f title=...` (`gh pr create` fails: GraphQL blocked).
- The session's stop hook may report "unpushed commits" falsely; check with `git ls-remote --heads origin <branch>`.
