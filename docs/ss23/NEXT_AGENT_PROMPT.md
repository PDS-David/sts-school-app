# Prompt for the next SS2/SS3 agent (paste as-is)

You are an autonomous implementation worker on `PDS-David/sts-school-app` (primary branch `master`). Your job is to complete SS2 and SS3 curriculum readiness, not to write a report. Do not ask the owner to coordinate, branch, run commands or repeat instructions already recorded in the repo.

## 0. Resume, do not restart
1. Clone and check out the checkpoint branch: `git clone --depth 1 https://github.com/PDS-David/sts-school-app && cd sts-school-app && git fetch --depth 50 origin agent/ss2-ss3-readiness-checkpoint-20261113 && git checkout agent/ss2-ss3-readiness-checkpoint-20261113`
2. Read, in order: `docs/ss23/CHECKPOINT.md`, `docs/ss23/HANDOFF.md`, `docs/ss23/sources/README.md`, `docs/ss23/sources/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/AGENT_EXECUTION_MASTER_INSTRUCTION.md` (sections 4, 5, 8, 8a), `docs/ss1/work/AGENT_PROTOCOL.md`.
3. Check open PRs and branches for any other agent touching `docs/ss23`, `scripts/ss23` or SS2/SS3 files. Do not overwrite another agent's work; use your own branch and PR.
4. Verified facts you must not re-investigate: master has no SS2/SS3 packages, registry rows or workflows; SS3 is audit-only in `ingestTopics.ts`; the six source zips were supplied in-session and are not in the repo; the SS3 Third Term zip is empty; Technical Drawing SS2/SS3 T1, Catering Craft SS2 T1/T3 and SS3 T1, and Food & Nutrition SS3 T2 have no source; SS3 Literature T1 = T2 byte-identical; SS2 `F _ N (1) (1).docx` (T2 folder) is the T1 file; Book-keeping T1 = T2 after the title line in both classes.

## 1. Inputs you need from the owner (ask ONCE, in one message, then continue independent work)
Source zips (re-attach; verify SHA-256 against `sources/README.md` first):
- 1st/2nd/3rd Term SS2 and 1st/2nd/3rd Term SS3 archives.
Decisions:
1. Keep SS3 audit-only, or deliver as normal curriculum?
2. For the empty SS3 T3 and missing/duplicated subject-terms: supply real files, or authorise clearly labelled authored supplementary content from the national syllabus?
If the owner has not answered, do SS23-S1 and SS2 work (SS2 is unaffected by decision 1) and park only the blocked items. Never silently decide these.

## 2. Task queue (work in this order, one small verifiable task at a time)
- **SS23-S1** Verify every one of the 100 members: read the document's own header (subject, class, term) and compare with `filename_subject`; update `mapping_status` (`HEADER_VERIFIED`, `HEADER_MISMATCH:<detail>`); record Alpha/Sigma term-name mapping and the `data.pptx` case. Commit CSV.
- **SS23-01** Generalise the SS1 package system to SS2/SS3: study `backend/src/db/ss1/subjectPackageSchema.ts`, `validateSubjectPackages.ts`, `refreshIntegrityHashes.ts`, `compiler.ts`, `loader.ts`, `studentDelivery.ts`, `sourceRegistry.json`, `.github/workflows/ss1-integrity-gate.yml`. Prefer extending with a class field or parallel `ss2/` and `ss3/` directories over copying; add `validate:ss2`, `validate:ss3`, `ss23:refresh-hashes` npm scripts and a CI gate. Do not break `validate:ss1`. Add tests.
- **SS23-02…** Per subject, SS2 first, alphabetical (agricultural-science, biology, bookkeeping, catering-craft, chemistry, civic-education, commerce, data-processing, economics, english, financial-accounting, food-and-nutrition, french, further-mathematics, geography, government, literature, mathematics, physics, technical-drawing, yoruba), then SS3. One PR per subject containing: package JSON, coverage records, provenance flags, tests, task-queue entry. Reuse an existing SS1 package as the template.
- **SS23-Q** Student-delivery check: every lesson reachable through `studentDelivery.ts`; no orphan, duplicate or wrongly-associated topic.

## 3. Per-subject method
1. Extract the source to a private scratch dir (new empty directory per archive; scripts elsewhere; Python with `-I`). `soffice --convert-to txt` is slow (about 10 minutes for 100 files) and loses tables, where week/topic schemes live. Use python-docx for tables; convert `.doc` with soffice; read the PPTX with python-pptx. Inspect originals for equations, symbols, figures and underlining.
2. Build the term x week x topic map from the scheme of work. Record missing weeks and missing terms explicitly; do not pad.
3. Compare scheme topics with the lesson notes in the same file; flag topics with no lesson, thin lessons (definition only, no examples/exercise), and wrong topic-to-week associations.
4. Check assessments: every question has an answer, an explanation and marking guidance. Where the source lacks answers, you may add them only as **authored supplementary** content, separately flagged, with the correct maths/science/language verified independently (re-compute calculations, check formulas, units, symbols, French accents, Yoruba tone marks and special characters).
5. Provenance: every lesson carries source id (`SS23-SRC-...`), member path, locator (week/section) and a flag `original` or `supplement`. Never present authored material as original. Never reproduce copyrighted prescribed-text excerpts; do not invent prescribed texts.
6. Run `refresh-hashes` after any body/asset change (never compute hashes by hand), then the validator and the subject tests. Merge `origin/master` first and resolve JSON conflicts per item.
7. Open the PR via `gh api repos/PDS-David/sts-school-app/pulls -f base=master -f head=<branch> -f title=... -f body=...` (`gh pr create` fails: GraphQL is blocked). Never merge.

## 4. Rules
- Never weaken tests, remove validation, fabricate approvals, or change approval/verification status because content was drafted. Distinguish: implemented, source verified, tested, teacher-approved, accepted.
- Never claim "complete" unless every acceptance gate passed; list unmet gates and anything not tested.
- Do not assume SS1 results prove SS2/SS3 readiness.
- Do not commit extracts, conversions, credentials or the zips.
- Commit often; push after each coherent unit (`git -c push.negotiate=true push -u origin <branch>`); end commit messages and PR bodies with the attribution lines your session requires. A stop hook may falsely report unpushed commits; check with `git ls-remote --heads origin <branch>`.
- Owner preferences: sequential steps, show the change before applying, complete corrected files not diffs, shell commands as one-liners, concise documentation.

## 5. Checkpoint (mandatory after every task)
Update `docs/ss23/CHECKPOINT.md` task table: task ID, status, changed files, commit SHA, test results (command + pass/fail/not-run), remaining work, exact next action. If your session nears its limit, commit all safe progress and update the checkpoint before stopping.

## 6. Definition of done for a subject-term
All weeks accounted for or explicitly marked source-missing; every lesson non-superficial with objectives, explanation, examples and exercise; every assessment has answer + explanation + marking guidance; provenance and hashes valid; validator and tests pass; lessons reachable by students; supplement content flagged; PR open with evidence.

## 7. Final report format
Subject x term table (implemented / source-verified / tested / approved / accepted / outstanding task IDs), totals, unresolved owner decisions with exact options, PR links with branch and SHA, exact commands with pass/fail/not-run, unverifiable sources, and the next action per blocker.
