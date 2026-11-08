# SS1 agent protocol (read this first, every session)

Repository: `PDS-David/sts-school-app`. Integration branch: `master`.
This file extends `docs/ss1/AGENT_EXECUTION_MASTER_INSTRUCTION.md`, `docs/ss1/contracts/CONTRACT.md`
and `docs/ss1/sources/README.md`. If a queue item's own text is stricter, follow the stricter rule.
Your prompt gives you a ROLE (default `WORKER`) and an `AGENT_ID` (any short unique string, for example `A1`).

## 1. The situation you are working in

- Several agents (four or more) work on this repository at the same time against a tight deadline. `origin/master` keeps moving. Any count, status, queue or file you read earlier may already be stale, including numbers in this file or in your prompt.
- Therefore: **one agent per subject at a time, one not-yet-executed item at a time**, claimed before you start and released after you push.
- Never repeat work that master already contains. Never choose an item another agent has claimed.

## 2. Hard rules (never break)

1. Never force-push. Never rewrite published history. Never commit a token, extracted original, rendering or private scratch file. Never write credentials into a file, commit message or report.
2. Never set or imply approval, verification, certification or deployment. Packages stay `PENDING`, verification stays `DEFERRED`, `approval_reference` is never invented.
3. Never invent source material, pages, answers, rights, URLs checked, or owner decisions. A source or provenance reference counts as checked only if you opened it.
4. Preserve source wording, hashes and IDs. Write only the paths your item's `allowed_write_paths` lists, plus `docs/ss1/work/claims/` (through `claim.sh` only).
5. Do not touch other subjects, UI, mobile, shared code, the DB or production data.
6. If you cannot push (no credentials, protection refuses), stop, produce `git format-patch` files, and say plainly that nothing was pushed.

## 3. The loop — repeat until your session ends

Run from the repository root with a clean working tree and Node 22. Replace `A1` with your AGENT_ID.

**Step 1 — sync.** `git fetch origin && git pull --rebase origin master`. Record the SHA you started from.

**Step 2 — find candidates.** `docs/ss1/work/claims/claim.sh next`. It lists, from current master, subjects that have at least one PENDING item whose dependencies are all `IMPLEMENTED_TESTING_DEFERRED`, with the first item in the required kind order. Subjects marked `locked` are being worked on: skip them. `claim.sh status` shows who holds what and for how long.
Also skip a subject if another branch is active there:
`for b in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin/agent); do git log "$b" --since='3 hours ago' --format="$b %h %s" -- backend/src/db/ss1/subjects/<slug>.json docs/ss1/work/microtasks/<slug>; done`
Any output means someone else is working on `<slug>`; pick a different subject. (`AGENT_EXECUTION_MASTER_INSTRUCTION.md` assigns several subjects to `agent/*` branches; do not work there unless that is your assigned branch.)

**Step 3 — check the item is genuinely not done.** In the subject's `docs/ss1/work/microtasks/<slug>/QUEUE.json` read the item and its `implementation_reference`; run `git log origin/master --oneline --grep='<ITEM-ID>'`; check that its dependencies' evidence is real. If it is done, skip it and take the next eligible item. Never use `IN_PROGRESS` in the queue; the claim file is the in-progress marker.

**Step 4 — claim it.** `docs/ss1/work/claims/claim.sh acquire <slug> <ITEM-ID> A1`
- exit 0: it is yours. Proceed.
- exit 3: busy or lost the race. Do not retry that subject; go back to Step 2.
- exit 4: the item is no longer runnable on master (done, blocked, or a dependency is open). Go back to Step 2.
- exit 5: your tree is not clean or you have unpushed commits. Fix, then retry.
- exit 6: stale claim. Check `git log` for work on that subject in the last two hours; only if there is none, retry with `--takeover`.

**Step 5 — do exactly that one item** (section 4). For anything longer than about 45 minutes run `claim.sh heartbeat <slug> A1`. Claims older than 120 minutes are treated as abandoned.

**Step 6 — validate, update the queue, commit, push** (sections 5 and 6).

**Step 7 — release.** `docs/ss1/work/claims/claim.sh release <slug> A1`, then report (section 8) and return to Step 1.

**If nothing is runnable** (every subject locked, blocked or done): report that, list the blocked items and their exact gates, and stop. Do not invent tasks or take a locked subject.

## 4. Doing an item

Order of kinds inside a subject (the helper already applies it): SOURCE_WEEK_INVENTORY, SOURCE_PREAMBLE_INDEXING, SOURCE_WEEK_INDEXING, SOURCE_SECTION_INDEXING, SOURCE_MARKER_DISPOSITION, SOURCE_PRESERVATION, VISUAL_DISPOSITION, FACTUAL_DEPENDENCY, SCOPE_DECOMPOSITION, CORRECTION_BINDING, LESSON, then TEST.

**Source access.** The archive is in the repo: `docs/ss1/sources/SSS1-original.zip`, SHA256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. Verify it, then extract only the member(s) the item names (hashes in `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv` and the item) into private scratch space outside the repo. Verify each member hash. Do not ask for another upload when verified bytes are present. Use established locators; inspect original structure when text extraction loses tables, underlining, figures or symbols.

**Indexing items.** Every objective gets its own coverage entry with an exact locator and evidence. Classify every scheme-table row. Every PARTIAL or UNRESOLVED entry gets an open item with one precise blocker or follow-up. Append new lesson, fact or asset items to the queue only after indexing. Indexing is not lesson completion. Do not invent a lesson for unreviewed content.

**Disposition items (visual, marker, preservation).** Record the disposition from a fresh private render or inspection. Commit no render. A needed figure becomes a separate ASSET item.

**Lesson items.** New teaching is labelled original, with truthful provenance (cite only what you opened; otherwise a general-knowledge entry), stated taught objectives, keyed practice with correct marks, a recomputed `body_sha256` (SHA-256 of the UTF-8 body), and bindings to exact coverage entries. Do not claim an objective the lesson does not teach.

**Correction-binding and fact items.** Follow the item text. Do not bind or decide beyond the evidence. A genuine policy choice goes to the owner as one precise question and the item becomes BLOCKED; source comparison and ordinary fact or URL checks never go to the owner.

**Test items.** Draft only the assertions the item specifies and only for authored content.

**Gates.** An owner or material gate is real only if the queue or an open item says so (for example `*-FACT-CONTENT-APPROVAL`, `*-TEACHER-DECISIONS`, `*-MISSING-*`, `*-OWNER-*`). Do not work around it; mark the item BLOCKED with the exact question, release the claim, and take another item.

## 5. Validation and queue update

Before committing check: JSON parses; IDs unique; references resolve; hashes recompute; marks total; every PARTIAL/UNRESOLVED entry is referenced by an open item. Run the subject's own test only if it exists (`node --import tsx --test tests/ss1/<slug>.package.test.mts`). Full tests, typechecks, importer, DB and deployment stay deferred unless the item says otherwise.

Update the queue item: `status` (`IMPLEMENTED_TESTING_DEFERRED`, or `BLOCKED` with the exact gate), a dated `implementation_reference` stating what changed and what is still open. Recompute `status_counts` and `next_runnable` from the items (`next_runnable` = PENDING items whose `depends_on` are all `IMPLEMENTED_TESTING_DEFERRED`) and `counts` if you added items. Keep 2-space indentation, `ensure_ascii=false` and a trailing newline so diffs stay small.

## 6. Commit, push, conflicts

- One bounded commit per item. Subject: `<PREFIX>-<ITEM-ID>: <what changed>`.
- `git fetch origin && git pull --rebase origin master`, then `git push origin HEAD:master` (never `--force`). Use a subject PR only if branch protection refuses a direct push.
- **Conflict rule.** If a rebase or push conflicts in a QUEUE.json or package JSON, do NOT hand-merge. Abort the rebase, run `git checkout origin/master -- <file>`, re-apply your change to that fresh copy (ideally with a small script), re-run the section 5 checks, and commit again. If another agent has since completed your item, drop your change and release the claim.
- Push promptly after each item. Never leave an item half-finished in the working tree: commit a bounded, valid piece or discard it.

## 7. Roles other than WORKER

**TESTER** (`claim.sh acquire role-tester <any-id> A1`; one at a time). Writes only `tests/ss1/*.test.mts` and `docs/ss1/work/TEST_REPORT_<YYYYMMDD>.md`; never edits subject packages, queues or source. Each run: fetch master and record the SHA; run `node --import tsx --test tests/ss1/*.test.mts` and `cd backend && npx tsc --noEmit`; keep one generic invariant test, `tests/ss1/_invariants.test.mts`, that loops over every `backend/src/db/ss1/subjects/*.json` and checks schema validity, unique IDs, hash and marks recomputation, resolvable references, every PARTIAL/UNRESOLVED referenced by an open item, no fabricated approval or verification, correction identity, provenance basis present, and queue counts and `next_runnable` equal a recount. Spot-check three coverage locators per subject against the source archive. Report defects with exact IDs; never fix content. Treat unfinished packages as INCOMPLETE, not failing. Release the role claim when done.

**OWNER-BRIEF** (`claim.sh acquire role-owner-brief <any-id> A1`). Writes only `docs/ss1/work/OWNER_DECISIONS_<YYYYMMDD>.md`. Collect every BLOCKED item across all queues and the open items they cite, group by subject, and for each give: item ID, the exact question, the options and their consequences, what is blocked behind it, the evidence locator, and whether the owner or a teacher must answer. Put decisions that unblock the most pending items first. Decide nothing and edit nothing else.

## 8. Report and handover

After each item report separately: item ID and change; checks run; commit SHA; CI status (say "not checked" if you did not look); remaining gates; the master SHA you started from and the one you pushed on top of. Do not claim certification, coverage completeness or deployment.

When your session is about to end: release your claim, make sure nothing is left uncommitted, and give a short handover note: last pushed SHA, items finished this session, the next eligible item per `claim.sh next`, BLOCKED items with their exact questions, and anything surprising (for example a task you found already done).
