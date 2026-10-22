> Update: the consolidation recovered the exact recorded PDF and committed both extracted attribution assets. The download/binding-preparation blocker below is historical; see ../CONSOLIDATION_20261021/REPORT.md. No stage attachment, phone observation or distribution approval is implied.

# YO-LICENSE handoff

Status, kept separate: **implementation partial** (attribution delivery done; NOUN cover/logo binding blocked on image bytes) · **tests passed locally (below)** · **branch published: see PR line** · **integrated into master: no (not my role)** · **external acceptance: none** · **deployment: none** · **legal clearance: none claimed**.

Base: master `a1db3dc3a23017bbb305cce4d8422ff7c4158b67` (Merge PR #22). Branch `jss3/yo-license-20261021-a7k2`. Head SHA and PR URL: recorded in the PR description and in the final message (a report cannot contain its own commit hash).

## Implemented behaviour
- `backend/src/db/data/jss3Attributions.json` + `jss3Attributions.ts`: validated credit register for SUP-YO-ORAL-TEXTS (NOUN ENG 105 Module 2 and Kolawole 2023): required credit, creators, publisher, year, licence and URL, source URL, recorded PDF sha256, download line, what was changed, and the requested cover/logo with `unbound` state and reason. Matched by exact class + subject + term + title only.
- `GET /learning/topics/:id/assets` now also returns `attributions` (same visibility rules as assets; empty for other lessons/classes). A requested visual is reported `displayed:true` only when a displayed asset with its key exists.
- Mobile: `lessonAssets.ts` carries `attributions` (older servers → none; malformed → error); `lessonAttribution.ts` builds the learner wording; `TopicDetailScreen.tsx` shows a "Sources and licences" block with accessibility labels.
- `scripts/jss3/v4/build_noun_attribution_assets.py`: `inspect` lists the PDF's embedded images; `build --cover-xref N --logo-xref M --capture supplemented-rows.json` writes the two images and an `attachTopicAssets` manifest bound to the real lesson row (title guard, hashes). Refuses a PDF whose sha256 differs from the recorded `23cb6992…` unless `--accept-new-hash`.
- Lesson text and all existing rows are unchanged; the register pins the lesson body sha256 (`3870c07c…`).

## Blocked item (exact)
NOUN cover and logo are **not bound**. Shell egress to `oer.nou.edu.ng` is refused by the session proxy (403 on CONNECT), and the fetch tool returns page text only, no image bytes. Nothing was drawn, substituted or guessed. To finish: run `inspect` on a legitimately retrieved copy of `ENG105_02.pdf`, identify the cover and logo xrefs by eye, run `build`, attach with `attachTopicAssets.ts` (dry run first), and add the two manifest-rows test. Attribution requested "in any reasonable manner" (CC BY-SA 4.0 §3(a)(1)(A)(i)) is therefore **not fully met yet**. Owner choice: `OWNER_DECISION.md`.

## Commands and results (local, Node 22.22.0 — CI pins 24.19.0; PostgreSQL 16 on loopback, DB `jss3_test_yo`)
- `tsc --noEmit` backend and mobile: clean.
- `node --test tests/*.cjs`: 16/16.
- 17 static TS suites incl. new `jss3-yo-license.test.mts` and `jss3-batch2-content.test.mts`: 160 pass, 0 fail, 10 skipped. All 10 skips are existing source-backed checks that need the JSS3 ZIP/capture (`JSS3_CAPTURE_DIR`, `JSS3_ALL_ROOT`) or CairoSVG; none touches files changed here. The ZIP was not available and is not needed: no lesson row changed.
- `tests/jss3-yo-license.db.test.mts` (new, real route, real attach path, real DB): 3/3. `topic-assets.db.test.mts`: 18/18. `jss3-v3-science-ci.db.test.mts`: 5/5.
- Python: new `test_jss3_noun_attribution_assets.py` 4/4 (synthetic PDF); visual-register, DEVICE1, acceptance-runner suites OK.
- `run_acceptance.py` was **not run** (no ZIP). Seven-suite DB runner not run.
- Real versus static: route/API metadata and bytes are real (HTTP against Express + PostgreSQL); the cover/logo bytes in that test are 16-byte synthetic fixtures, not NOUN images; the mobile block is checked as exact wording through the pure formatter and type-checked, **not rendered on a device**.

## Regenerate
Nothing generated is committed besides the register JSON (hand-authored from `G2_REVIEW/SOURCE_CHECKS.json` and the lesson). After the real images exist: `build` as above.

## Shared files / YO-TEXT
- YO-TEXT must preserve in `jss3Supplements.json`: SUP-YO-ORAL-TEXTS id, subject, term and **title** (the attribution match key), the NOUN required credit and download line, the licence URL, and the Kolawole discrepancy sentence. If it edits the body it must update `body_sha256` in `jss3Attributions.json` deliberately (the test fails otherwise).
- Any new lesson that quotes a third party needs its own register record; unmatched lessons get none.
- Files also touched: `jss3-assets.yml` (two new steps), `acceptance-requirements.txt` (+PyMuPDF==2.0), `tests/topic-assets-loading.test.mts` (expectation now includes `attributions`).
- Not edited, to avoid collisions: OPEN_BLOCKERS.csv OB-11, SCHOOL_DECISIONS_REQUIRED.md D1, coverage/schedule CSVs. OB-11 should be updated by the integrator to say the digital attribution is now delivered by the route and only cover/logo and the distribution decision remain.
