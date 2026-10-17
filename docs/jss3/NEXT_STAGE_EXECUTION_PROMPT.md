# JSS3 successor execution prompt

Assessment date: 16 October 2026. Copy this whole prompt to the successor. Supply `JSS3_NEXT_STAGE_INPUTS_20261016.zip` and access to `PDS-David/sts-school-app`. The ZIP contains the original documents and portable evidence; it must not be published in the repository. This prompt supersedes the earlier handoff's scratch-path dependencies and any implication that only its author may implement or publish changes.

## 1. Your role, authority and outcome

You are the successor implementation lead for Sow the Seed School's JSS3 curriculum. Continue the work, implement the remaining justified corrections, verify them, and publish them safely. You are not restricted to auditing, proposing prompts or preparing reports. The owner has authorised completing JSS3, using the selected Civic attachment for First Term, sourcing internet equivalents for other missing material, and committing/pushing completed changes. This authority applies to you and subsequent successors, not just the previous agent. Use available repository credentials/connectors; do not confuse tool capability with owner permission.

You may inspect and edit curriculum data, importer/validation code, necessary backend/mobile behaviour, tests, asset manifests, scripts and documentation within this scope. You may create isolated branches/worktrees, resolve conflicts after reading both changes, commit and publish verified changes to the default branch. Follow branch protection; use a PR if direct publication is unavailable. Do not stop to obtain the previous agent's permission. Do not redesign the UI or change unrelated features.

Code publication does not authorise production database import, destructive migration or deployment. Prepare a concrete validated release/import plan first, then obtain specific operation approval if it has not subsequently been given. No production connection or import has been performed in this work. Do not use `--yes`, asset `--apply`, or production credentials during verification. Disposable test databases are permitted.

Policy: preserve all substantive original JSS3 instruction within First/Second Terms; Third Term is exclusively BECE preparation, revision, mock examinations, feedback and reassessment. Exclude Computer Studies. Preserve other grades, especially the certified 2,179 Primary/JSS1/JSS2 rows. Never fabricate recovered source text. Owner-authorised new equivalents must have separate provenance and defensible sources. Do not release held source headings merely because a replacement exists. Do not confuse tests passing, content coverage, deployed state and curriculum certification.

Continue autonomously through the stages below. Missing external evidence must be recorded precisely, but must not stop independent authorised work. Do not produce another chain of permission requests for each small batch.

## 2. Verified starting state — inspect, do not assume unchanged

The reviewed remote/local head is `afdf22a9493d0a5de864cf0295c7bc5c8367d594`, on **master** (not main). GitHub workflow run `38852226702` succeeded. Fetch current HEAD before editing: other agents have been active.

Implementation commit `557f45335f7efa3ec0b1b3a0b8f80dddbd20f9d8` contains the latest 41-lesson implementation; workflow `38847630924` succeeded. Three subsequent commits add review evidence/schedules, not new executable lessons: `7894996`, `be32ada`, `afdf22a`. Historical baseline `29f135b2...` and patches 01–08 are already incorporated. **Do not rebuild from the old baseline or apply those patches again.**

Observed baseline:

| Item | State |
|---|---|
| Original executable rows | 313: First 151, Second 162, Third 0 |
| Supplemented plan | 354: First 170, Second 184, Third 0 |
| Supplements | 41 attributed teaching bodies with exercises/assessment guides |
| Original preservation | All 313 original row objects equal between unflagged and supplemented runs |
| Computer Studies | 0 rows |
| Full real-source suite | 151 pass, 0 fail, 0 skipped in the implementation verification |
| Other checks | Backend/mobile types; 16 static checks; 12 focused asset checks |
| Original holds | Eight scheme-only entries plus Akanlo Ede and Taekwondo practical remain held; replacements are distinct |
| Historical 63-item register | 54 replacement implemented, 1 partial replacement, 5 provenance/mapping open, 2 owner-source-selected, 1 existing-coverage-verified |
| Source-line queue | 585 candidates, including 328 still needing semantic review; not 585 missing lessons |
| Production | No import/deployment established by these results |

The five open mapping entries are EN2-03, YO-T1-MAP, YO-T2-MAP, YO-T3-MAP and YO-OWE. The partial entry is YO-T1-W2. These are not the only possible remaining gaps: the source-line queue can reveal others. “Replacement implemented” is not a certification status.

Civic: the owner's selected attachment is byte-identical to the existing Omega-labelled First-Term source. Preserve its provenance and First-Term destination. No duplicate import or automatic request for another Alpha file is needed.

Music/Basic Technology: recovered original assets are implemented. Music composites preserve the source-rendered notation; Basic Technology includes unclipped image bytes and original animated GIFs. Server delivery and desktop evidence do not prove supported-device readability. Three new teaching graphics support room planning, proofreading and time signatures. Do not overwrite recovered assets with generated substitutes.

## 3. Exact inputs and where they are used

All repository paths below are relative to the checkout. The private ZIP eliminates dependency on the former agent's temporary directory.

| Task | Required files |
|---|---|
| Reproduce all-source plan/tests | ZIP: `ALL/` (39 original staged documents), `SOURCE_INVENTORY.csv`, `scheme_only_integration_manifest.csv`; repo: `scripts/jss3/verify_handoff.py`, `capture_rows.py`, package lockfile |
| Inspect original Music source | ZIP: `original_music/JSS3 Alpha term music Enote.rtf`; supplied DOCX is inside `ALL/`; repo: `curriculum-assets/jss3/`, `MUSIC_COMPOSITE_CHECK.json` |
| Trace historical gap definitions | `docs/jss3/CONTENT_GAPS_R9_UNCHANGED.csv`; current status: `replacements/CURRENT_COVERAGE.csv`, `IMPLEMENTED_LESSONS.csv`, `YORUBA_OBJECTIVE_MAP.csv`, `WIDER_WORKSTREAMS.csv` |
| Complete source-line review | `SOURCE_LINE_RECONCILIATION.csv`, `LATEST_SOURCE_LINE_DISPOSITION.csv`, `SOURCE_LINE_TRIAGE_SUMMARY.json`, `SEMANTIC_REVIEW_SUPPLEMENT_XREF.csv`; ZIP originals; fresh captured row JSON |
| Review Yoruba oral scope | `replacements/YO_T1_W2_ORAL_PERFORMANCE_REVIEW.md`, original First-Term Yoruba DOCX in ZIP, `YORUBA_OBJECTIVE_MAP.csv`, `backend/src/db/data/jss3Supplements.json` |
| Implement equivalent lessons | `backend/src/db/data/jss3Supplements.json`, `backend/src/db/jss3Supplements.ts`, `backend/src/db/ingestTopics.ts`, applicable `tests/jss3*.test.mts`; source URLs in lesson records |
| Fix sequencing if necessary | `replacements/TEACHING_SEQUENCE.md`, `TEACHER_SCHEDULE_SUPPLEMENTS.csv`, actual topic API/unlock code located by search, fresh row capture, asset manifests and loading tests |
| Verify preservation | Fresh original/supplemented captures; `replacements/VERIFICATION_ROW_PRESERVATION.json`, `KEY_BODY_VERIFICATIONS.csv`; ZIP `reference_evidence/` is historical comparison evidence |
| Protected-grade proof | `replacements/PROTECTED_SOURCE_COMPARISON.json`, `INPUT_INVENTORY.json`, `NESTED_ARCHIVES.json`; separately required exact certified 2,179-row baseline/export |

Paths in the table without a leading directory are under `docs/jss3/`. `INPUT_INVENTORY.json` in replacements concerns protected-grade archives, not the 39-file JSS3 inventory. Do not confuse them.

The ZIP inventory lists exactly 39 importer documents. The historical R5V inventory also listed the original Music RTF outside importer roots as a fortieth record. This package retains that RTF separately; do not stage both RTF and DOCX in ALL. Preserve filenames and trailing spaces in original term-folder names. If an extractor/platform cannot preserve them, use Python extraction and report any deliberate path mapping.

The package does **not** contain the authoritative certified 2,179-row database subset, production configuration, or device acceptance evidence. Those are distinct external inputs; do not ask the owner to resend all original term ZIPs for them. Do not require old patch/audit ZIPs just to repeat work already represented by code and current evidence. Request a specific historical package only if an unresolved assertion genuinely depends on evidence absent from both current inputs and repository.

## 4. Safe ownership and reproducible setup

1. Read applicable AGENTS.md if present. Record current branch, HEAD, tree, working-tree changes and remote master. Never discard another agent's uncommitted work. Create your own checkout or worktree/branch such as `jss3/semantic-completion-<date>-<unique>`; no destructive reset/clean or automatic stash of unknown work.
2. Read this prompt, current coverage, latest source-line disposition, implementation notes and the three recent review documents. Treat older STATUS.md sections as dated history; later verified evidence takes precedence. Check the latest CI SHA rather than quoting an older green badge.
3. Verify ZIP `SHA256SUMS`, then its 39 source hashes. Keep original files read-only in practice; work on extracted copies for conversions. Do not publish copyrighted/private original documents or full row captures in Git.
4. Use Node 24.19.0 where available and lockfile-pinned dependencies. Run `npm ci --ignore-scripts` from repository root; install required Python dependencies, including python-docx, without changing the repository lockfile. Do not substitute `npm install` silently.
5. Run the portable verifier once to establish your current baseline:

```bash
python3 scripts/jss3/verify_handoff.py \
  --inputs /absolute/path/JSS3_NEXT_STAGE_INPUTS \
  --output /absolute/path/jss3-baseline-evidence
```

It constructs FIRST/SECOND/THIRD/ENGLISH test roots, sets all seven source variables, runs types/static/full JSS3/asset checks, and captures actual importer main() rows. Check `RESULTS.json`, each log and the full-suite skip count. Zero exit from a partially skipped suite is not full-source verification. A tool/tsx IPC restriction is an environment failure, not permission to weaken tests; use the verifier’s explicit `--tsx-no-ipc` option only for that restriction and retain its LAUNCHER_DEVIATION.md. This option launches unchanged npx-tsx test subprocesses through `node --import tsx`; it does not alter assertions.

`capture_rows.py` uses a temporary instrumented copy, compares its stdout with the unmodified importer, checks exact original row objects and removes the copy. It does not accept `--yes`. Its expected anchor must fail closed if importer structure changes; adapt only after inspecting the new code. Cross-environment row comparisons may normalise the absolute source-root prefix, never bodies, titles, weeks or order values.

There must be one publication integrator at a time. Do not launch additional agents unless delegation is explicitly authorised. If several agents are already working, agree non-overlapping file ownership and exchange commit SHAs/patches; each retains an isolated branch. No agent may overwrite another's master update. Before publication fetch remote again, inspect changes, integrate deliberately, and rerun checks affected by the combined changes. Use non-force publication and expected-head checks where supported. A rejected lease means inspect the new head, not retry with force.

## 5. Stage A — close semantic content evidence and implement real gaps

Start with YO-T1-W2 and the five mapping entries, then work through the source-line queue by document/subject in manageable batches. Preserve the original 63 IDs and all historical candidate IDs. Keep historical CSVs unchanged; write a new `docs/jss3/SEMANTIC_CLOSURE.csv` linked back to their IDs.

For every candidate record: source filename/hash; reproducible paragraph/table/heading locator; exact objective or instructional fragment; disposition; supporting executable lesson ID/title and term; exact body excerpt or character/hash locator; rationale covering every objective component; replacement source/license where applicable; remaining limitation; verification date. Suggested dispositions: metadata, structural marker, exact duplicate, original teaching preserved, objective covered by named original lesson, objective covered by attributed replacement, unresolved content, unresolved mapping. Keep content coverage separate from practical performance/device acceptance.

The current 585-way triage is 113 document/reference lines, 102 text-presence matches, 29 objective-map links, one excursion replacement, six week labels, six prior observations and 328 semantic-review candidates. The keyword cross-reference file supplies leads only. Confirm actual canonical subjects and objectives; filename-derived subject guesses are not authoritative. Text presence, keyword similarity, a matching title or “covered elsewhere” cannot alone close an objective. Review the 102 presence matches and six inherited observations for what they actually establish, while retaining valid existing evidence rather than repeating it needlessly.

Preserve known substantial Third-Term English revision bodies and Basic Science Simple Machine under WEEK5-. Use the main() captures and KEY_BODY_VERIFICATIONS instead of assuming a revision heading means non-instructional. Distinguish original scheme-only omissions from extraction loss and from teaching already embedded under a broader title.

For genuinely uncovered objectives, implement the owner-authorised equivalent now: reliable source, complete age-appropriate teaching, worked example where appropriate, task/evaluation, answer or assessment guide, explicit attribution and replacement provenance. Browse and verify source contents; do not paste copyrighted textbook chapters or invent page numbers. Prefer openly licensed/public-domain material; otherwise use original explanations grounded in sources and limited attributed quotations. Preserve Yoruba spelling/diacritics with evidence. No invented traditional chants or claimed recovered source wording.

Use separate supplement IDs and gap mappings; preserve original source holds. Extend subject/gap validation deliberately if a new verified objective falls outside existing allowed IDs. Do not disable validators or mislabel a subject to get a row accepted. Reuse a complete existing lesson when it demonstrably covers the objective instead of creating redundant supplements.

### Yoruba oral-performance caution

> **Owner decision, 16 Oct 2026:** the Week 2 printed `yala` is ìjálá (owner-confirmed, not inferred; no Yoruba word "yala" exists in this scheme). The sentence below about `yala` is retained as the original instruction history and is superseded for Week 2. The Week 3 spelling `ijale` remains an inferred reading.

Read the original scheme and the actual NOUN/source sections, not just the recent review's summary. The original can establish that the printed wording is `yala`; it cannot necessarily establish the author's intended genre. Record ambiguity separately from an explicitly selected owner-authorised replacement. Recognition of Ìjálá, iwì egúngún and Ọya pípè alone does not prove coverage of performance texts, language/imagery analysis or delivery practice.

Supply authentic reusable excerpts and meaningful analysis/performance tasks where required. Distinguish availability of a teaching task from evidence that students performed it. The NOUN guide is all-rights-reserved; respect reuse limits. A failed fetch does not prove a URL dead. The earlier review's proposed 354→355 is not a target: choose appropriate lesson scope, observe actual row delta, and justify it. Inspect existing SUP-ID validation before extending it unnecessarily.

For EN2-03 and Yoruba mappings, preserve original labels/provenance, record inferred positional mappings as inferred, and verify coverage independently of ambiguous week numbers. Do not invent an original heading merely to tidy metadata. For YO-OWE, teaching preserved within a broader row and separately addressable teaching are different questions; resolve the useful instructional issue without deleting preserved text.

Save a reviewable checkpoint after each subject/batch, update `OPEN_BLOCKERS.csv`, and continue. Do not stop after merely identifying another gap that your existing sourcing authority permits you to fill.

## 6. Stage B — make instructional sequence executable

The newer teacher schedule is useful planning evidence, but it does not change app unlock behaviour. Inspect the actual API ordering and prerequisite logic: supplements append after existing rows to preserve original order/asset identities, and some original rows are revision/examination markers. Determine exactly which supplemented lessons are reached after an assessment or blocked by an unsuitable prerequisite.

Produce an executable sequence solution if that problem is confirmed. Preserve stable topic IDs and asset bindings; do not blindly renumber existing `order_index` values. A separate logical teaching sequence may be appropriate, but select the smallest coherent change based on actual schema/routes/mobile usage. Necessary scoped implementation and migration code may be prepared/tested under your authority; production migration execution remains separately gated. A paper teacher schedule alone is not acceptance evidence for the student unlock path.

Test first/second-term transitions, assessment placement, repeated imports/idempotence, unchanged other-grade ordering, and exact asset target resolution. Keep visual design unchanged unless a necessary functional change is explicitly justified. Refresh the teacher schedule to match implemented behaviour. Verify Third-Term BECE/revision/mock access separately: zero Third-Term instructional rows is not proof that the exam-preparation experience functions.

## 7. Stage C — protections, assets and final validation

The earlier protected-grade source comparison found 2,233 identical generated candidates (1,492 Primary + 741 JSS1/JSS2). This is useful regression evidence but does not identify the certified 2,179 database rows. Locate an authoritative baseline/export through provided records or authorised read-only access. If unavailable, record the exact required export/schema/identity fields and keep this certification/import gate open. Do not declare preservation by subtracting counts or choosing 2,179 arbitrary records. Do not probe credentials or connect to production opportunistically.

Before any future production write, require stable identities and field/body/asset comparisons for that exact baseline, a backup, explicit target environment, precise planned inserts/updates, compatibility checks and rollback. Prepare these concretely; do not execute them without operation approval.

Inspect Music and Basic Technology in the supported app view where tooling permits: complete clefs/flats/time signatures, unclipped Week 3 electronics diagram, readable labels, animation of all three GIFs, asset loading after navigation/reload, hidden-asset behaviour and accessibility/readability. Reuse existing byte/hash proofs. If a device/session is unavailable, provide exact outstanding acceptance steps and do not claim a phone test occurred.

After implementation, run the portable verifier again and only additional tests needed by changed behaviour. Run database integration on disposable PostgreSQL or existing CI, never production. Compare original and supplemented actual main() rows, all holds, term/subject exclusions, source hashes, new row provenance and asset manifests. Explain every intentional original-row difference if a justified correction requires one; default is exact preservation. Repin counts only from verified row deltas, never to make a red suite green. Do not remove/skip/loosen checks to obtain acceptance.

## 8. Publish, report and transfer without dependence on you

Before pushing, fetch current master and reconcile other agents' commits. Publish only scoped files; exclude originals, credentials, raw private row dumps and generated temporary importer copies. Use normal Git push or the authorised GitHub connector. With the connector, create blobs/tree/commit on the current parent and update master with `expected_sha` and `force:false`. If access/branch protection blocks publication, report the exact capability issue and provide the complete patch/PR; do not claim only the prior agent is permitted to push.

Verify CI for the exact published SHA. Record commit, parent, tree, changed files, check results and any skipped source checks. Preserve unrelated work. Do not keep retrying a stale branch update. Do not wait for a successor to publish already verified authorised work merely because this prompt was written by someone else.

Required repository deliverables:
- Implemented corrections with focused regression coverage.
- `docs/jss3/SEMANTIC_CLOSURE.csv` and `OPEN_BLOCKERS.csv` with complete ID traceability.
- Updated current coverage/objective map/lesson inventory and actual sequence documentation.
- `docs/jss3/NEXT_STAGE_REPORT.md`: changes, objective evidence, observed counts, checks, source/legal limits, production status and exact remaining external gates.
- Updated `NEXT_AGENT_HANDOFF.md` pointing to a self-contained prompt for any genuinely unfinished stage.

Keep private evidence in a downloadable, checksum-verified package with portable commands, source inventory references, row comparisons and full logs. Save it before announcing it. Never rely solely on a path in your transient workspace. Do not republish original copyrighted sources publicly; retain the private input bundle separately.

If a successor is needed, the new prompt must carry: repository/default branch; latest verified SHA and remote state; owner authority and production boundary; completed work and its evidence; exact input filenames and durable availability; files the successor may edit; one ordered executable task list; acceptance criteria; concurrency/publication procedure; precise unresolved decisions. No “only I can write” rules, unexplained audit acronyms, missing attachments, forced counts or dependency on the previous agent's memory. Leave checkpoint work reviewable before context exhaustion.

Completion report must distinguish: implemented and pushed; tests passed; content objectives closed; external acceptance/protected-baseline gates; production import/deployment status. JSS3 is fully settled only when required coverage and acceptance gates are evidenced. If an external gate remains, state the exact missing input or operation rather than claiming certification. Then hand over to SS work with an accurate JSS3 outcome.
