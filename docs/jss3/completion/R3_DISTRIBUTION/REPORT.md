# R3 — Yoruba distribution and attribution — 24 October 2026

Status, kept separate: **implementation: one omission fixed (attribution record for the African Storybook lesson)** · **tests: pass locally (Node 22.22.2, not 24.19.0)** · **owner distribution decision: still pending, nothing chosen or implied** · **legal clearance: none claimed** · **integrated/deployed: no**.
Base: master `c1699b5ee1e231a4ab4dacc02711e8aa754b0434` (after R1 #45 and R2 #44). Branch `jss3/r3-distribution-20261024-q4`. No AGENTS.md exists. No rights holder contacted.

## Inventory of delivered third-party Yoruba material
| Lesson ID | Source | Stated terms | Register record | Status |
|---|---|---|---|---|
| SUP-YO-ORAL-TEXTS (2nd Term) | NOUN ENG 105 Module 2 (Okunoye, 2021), 6 of 37 lines; selections | CC BY-SA 4.0; asks for "First produced by the National Open University of Nigeria", NOUN logo, cover (per YO_LICENSE report) | yes, body hash verified | cover/logo images committed under `curriculum-assets/jss3/v4-attribution/`; runtime shows them only when attached DB assets exist (not attached to any environment) |
| SUP-YO-ORAL-TEXTS | Kolawole (2023), Tydskrif vir Letterkunde 60(3), 7 of 12 lines | article page CC BY-SA 4.0; PDF front matter "Creative Commons Attribution License" | yes | discrepancy kept visible; stricter reading followed |
| SUP-YO-ORAL-GENRES (1st Term) | Láyadé and Ògúnyẹmí (2025), Ṣàngó 3 lines + translation | CC BY-SA 4.0 stated by publisher | yes, body hash verified | no cover/logo requirement |
| SUP-YO-LICENSED-STORY (1st Term) | African Storybook, Ramúramù ewúrẹ́ (Akoni; illus. Tettey Eugene), complete text | © African Storybook Initiative 2018, CC BY 4.0 (credit in lesson body); African Storybook collection is CC BY per publisher-adjacent pages | **was missing; added here** | credit existed only inside the body; the authenticated route and mobile "Sources and licences" block did not carry it |

Other Yoruba lessons mentioning Wikipedia, WAEC, Olaogun, etc. are marked paraphrase-only in their source lists; no verbatim third-party text found. The new test fails if a Yoruba lesson body gains a ©/licence statement without a register record.

## What was fixed
`jss3Attributions.json`: new body-hash-bound record for SUP-YO-LICENSED-STORY (credit, creator/illustrator, year, CC BY 4.0 link, source URL, changes). No lesson text changed, so no recapture or regeneration of IMPLEMENTED_LESSONS.csv/teacher schedule is needed. New `tests/jss3-yo-distribution-r3.test.mts` (6 tests, in the CI list) with negative controls: missing credit, changed body hash, wrong class/term/subject/title.

## Distribution question — facts, not a decision
- Login or Term PIN is not treated as a violation in itself. CC BY-SA 4.0 §3(b)(3)/§2(a)(5)(C) concern added terms or technological measures that restrict recipients' exercise of the licence. Whether app gating does that is ambiguous; this is my reading, not clearance, and no lawyer approval is declared mandatory.
- Existing owner options (YO_LICENSE/OWNER_DECISION.md) A/B/C remain open. The concrete choice needed, only for the two BY-SA lessons:
  - **SUP-YO-ORAL-TEXTS (2nd Term)** and **SUP-YO-ORAL-GENRES (1st Term, Ṣàngó section)**.
  - Keep as is: the app already shows the BY-SA notice with credit and licence link, and learners may reuse these excerpts on those terms; login gating applies to the app, not to reuse rights. Teaching unchanged.
  - Or replace the 6 NOUN lines, 7 Kolawole/Ifá lines and the 3 Ṣàngó lines with page/line pointers: this removes offline verbatim text study for those passages, so objectives, questions and answers would need rewriting and the body hashes and records regenerated (needs the private archive for a fresh capture).
  - SUP-YO-LICENSED-STORY (CC BY) has no share-alike condition and needs no choice.
Nothing is removed until the owner picks.

## Unresolved
- Publisher terms were read from repository records and search results here, not freshly fetched from NOUN or the journals (those pages were not re-fetched this session); the African Storybook collection licence was confirmed via secondary pages, not the story's own page.
- Playwright/device rendering of the mobile block, PostgreSQL route tests, `run_acceptance.py` and the private archive (SHA256 0a5b0d92…) were not run. CI must pass real PostgreSQL checks.
- Production rows imported earlier are not updated by a repository change.

## Checks
`node --import tsx --test` on the yo-distribution-r3, yo-license, yo-text, yo-iwi, yo-r1 suites: 45 pass, 0 fail. `tsc --noEmit` backend and mobile: exit 0. Node 22.22.2 used (CI pins 24.19.0).
