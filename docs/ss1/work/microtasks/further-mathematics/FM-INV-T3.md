# FM-INV-T3 — Further Mathematics, 3rd Term inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `0d9ba31` (fetched). `AGENTS.md` is absent. Open PRs at start: #245 (Food and Nutrition FN-INV-T2) and #246 (French FR-WK-T1-W04); neither touches Further Mathematics.
- Prerequisite FM-SRC-T3 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/further-mathematics.json` already holds source `SS1-SRC-c7a7523bdb0d` (sha256 below).
- Original: `3RD TERM S1 FURTHER MATHEMATICS.docx` from the supplied `3rd Term SS1` archive, SHA-256 `83af98556a1b01fa0811df6274e7cca3bec978d1e7b411c17994613b2a34a2c5` — hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was not supplied, so its hash was **not checked**.
- Method: `word/document.xml`, `header1.xml` and the relationships read with lxml in a private scratch directory; both embedded images were viewed. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-476; block 477 is `w:sectPr`). Block text = concatenation of its `w:t` runs (UTF-8, no normalisation; math runs inside `m:oMath` are included only as their `w:t` text, so equations contribute little or no text). Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included.

## No scheme of work (confirmed)
The document has no title, subject/class line, scheme-of-work heading or table, revision/examination line or reference list. Blocks 0-4 hold no text (empty paragraphs 0, 1, 3; a one-row empty table at block 2; block 4 carries the cover image, below). Range sha256 of blocks 0-4: `545c38b0922de19734fbffde62792c37c2aef6a3216cfa472449173165220f7d`. The first text is `WEEK 2` at block 5. The text search for `week` (any case) finds only the six labels below.

## Week inventory (6 labels; Weeks 2, 3, 4, 5, 6, 8)
Matches the six rows of SS1-03 `parsed_rows.json`. Labels are plain `WEEK n` paragraphs with no `DATE` run. Blocks 474-476 are trailing empty paragraphs after Week 8.

| Week | Exact label | Label block | Blocks | Label sha256 | Range sha256 | `m:oMath` | `w:pict` |
|---|---|---|---|---|---|---|---|
| 2 | `WEEK 2` | 5 | 5-50 | `b965fc72e053cb77e3cb76cbdeb0726b6e140bfc28a749ae12fb258d0b930a03` | `d744c4c1c37304887fa2ec8d541bfefb29095d2ee37de9cbda15987e0839010c` | 0 | 2 |
| 3 | `WEEK 3` | 51 | 51-179 | `2aaaeeb02f5a3bd5c26e312af994b4ea2aad781293f878095335525dea72028e` | `b6491988947da0db8ddc16c69140b943320602e6988fe36a941a6c2f2f108c86` | 20 | 6 |
| 4 | `WEEK 4` | 180 | 180-256 | `b3f936b4823f7d98598f38964d0c5c5c0d91adb471fa266c3aea6ddbe6b69ea4` | `23969d605fc5be049ddee268608bdd058d4220122104938b1991ae1eb5c4da61` | 32 | 0 |
| 5 | `WEEK 5` | 257 | 257-333 | `9b12d637a3be5c04d474a2a0a187bf2dbe2d7e32f3c32d244f3f83ddd4b7f550` | `eb1e45b774bad626f125347003df9ef55d70f579ba23dba18558b503622ca9f4` | 34 | 0 |
| 6 | `WEEK 6` | 334 | 334-409 | `03792d537a25eed5326e922c8a90f71cfb1c9739ed47959db18710e2aa49a653` | `35b486a6bd931d0bde1d19d0749bf14b2ed007c733c27bc16d2996c0577e8771` | 34 | 0 |
| 8 | `WEEK 8` | 410 | 410-476 | `9d3aa1f293bf6811cada35e94cde675c7a57a2ed333349152dec9e06fdedf73c` | `a2c101c08b7b981578dd4317df689c3edbbcab10e49ffbe3aca5831a9570a229` | 9 | 0 |

Absence of Weeks 1, 7 and 9-12 is **confirmed**: there is no heading, label, scheme row or body text for them anywhere in the body, header, footnote or endnote parts. This does not say the school lacks those weeks, only that this source does not contain them; nothing is invented. Existing queue items already cover all six weeks (FM-WK-T3-W02..W06, W08), so **no new week item was needed**.

Per-week structure (topics read from the source; no content copied):
- Week 2 (5-50): no Topic/Sub-topic/Duration lines; starts at `Reference Materials` (block 6), `Previous Knowledge` (7), `Instructional Materials` (8), then `ContentFLOWCHART` (9). Two VML figure groups (blocks 12, 31).
- Week 3 (51-179): `Topic: Gradients of straight lines and curves` (52), sub-topic gradients of straight lines (53). VML figures at blocks 62, 72 (two), 104, 117, 133; the one table at block 169 (2 rows, x and y values for a line graph).
- Week 4 (180-256): `Topic: Straight line`, sub-topic angle of slope and angle between lines (181-182). No drawing objects.
- Week 5 (257-333): `Topic: Vectors`, sub-topic modulus of a vector (258-259); evaluation 330, conclusion 331, assignment 332. No drawing objects.
- Week 6 (334-409): no Topic/Reference lines; opens at `MAGNITUDE OF A VECTOR` (335) and repeats the Week 5 example set with three Evaluation/Conclusion/Assignment triples (367-369, 385-387, 406-408). Already tracked as FM-FACT-T3-W06-REPEATS-W05.
- Week 8 (410-476): lesson `Topic: Straight line`, sub-topic angle between lines (411-412; teaching 418-441) and then a second, unlabelled lesson (see below).

## Further unlabelled substantive section (appended as an item)
- Week 8 blocks 443-473: the paragraph `PERIOD 3` (block 443, sha256 `ced01b423102c586b9ed9d23acb24d2d75d6a46ca97170a24a5d9123447edd34`) followed by a complete lesson header (`Topic: Equation of a straight line`, block 444, sha256 `5f1ea5453107309c00bcd0f8e3bd3116c488bf924350d6eb72bf377fd898a92b`), sub-topic gradient/one-point/two-point form, duration 40 minutes, references (448), previous knowledge, instructional materials, content (451-469), `Evaluation` (470), `Conclusion` (471) and two `Assignment` lines (472-473). Range sha256 of 443-473: `bc586a6d016376bb45a0097567d73f1f20a741dca876c37996a4925968b22ec9`. It carries its own objective and is not preceded by a Period 1 or Period 2 label; the only `PERIOD` marker in the document is this one. Blocks 442 and 474-476 are empty. Appended as `FM-SEC-T3-W08-PERIOD3`.

## Header evidence
No header or subject line exists. The registered `header_text` `New Further Mathematics project 1, by Adigun et al. Page 178` is the first reference-material line inside Week 2 (block 6; the string occurs exactly once; block text sha256 `a45d5634b34be1965873277f037b29b405865aa9e9c8a6d236b7d32a1f77c44b`). It is a textbook citation, not a heading. The subject therefore still rests on the cited textbook titles (Further Mathematics Project 1 and 2 in Weeks 2 and 4-8; General Mathematics for SSS 2 in Week 3), filename and content; `RULE-FM-T3-ALIAS` stays an inference awaiting owner confirmation (FM-FACT-ALIAS-APPROVAL). `header1.xml` has no text; no footer part exists.

## Other objects
- Images: `word/media/image1.jpeg` (3306x2515, sha256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a`) is a full-page tutor-brand cover with a vision statement, logo and a personal phone number and e-mail; it is anchored in block 4 (`w:drawing` via `rId7`, with a `w:pict` text box in the same paragraph). `word/media/image2.jpeg` (949x359, sha256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14`) is the tutor-brand banner used only in `header1.xml`. Neither is a teaching figure. This records the locations that FM-VIS-T3-BRANDING says were not recorded; the contact details are not republished and the images are not committed.
- Figures: seven body paragraphs hold eight `w:pict` objects (VML shapes/groups, no raster; block 72 holds two): blocks 12 and 31 (Week 2 flowchart), 62, 72, 104, 117, 133 (Week 3 graphs; the text refers to `the figure below` at blocks 115 and 130). **This refutes** the OI-FM-003/FM-VIS-T3-W03-GRAPHS statement that the source does not draw the Week 3 graphs: it draws them as VML, which a text extractor would drop. Weeks 4, 5, 6 and 8 hold **no** drawing, picture, OLE or VML object, so FM-VIS-T3-VECTOR-FIGURES and FM-VIS-T3-LINE-FIGURES have no body figure in this source to dispose of beyond equations.
- Equations: 129 `m:oMath` groups (Week 3: 20, Week 4: 32, Week 5: 34, Week 6: 34, Week 8: 9). No OLE equation objects.
- Textbook-reference blocks: Weeks 2, 3, 4 and 5 (blocks 6, 56, 185, 262; Week 6 has none) and Week 8 (415, 448); Evaluation/Assignment lines in Weeks 5, 6 and 8 cite pages of the same books. No standalone reference list.
- Practical/observation and safe-chemical-handling content: none (pure mathematics); no doses or rates.

## Structural rule findings (findings only; no rule written)
- `split_before`: week labels are bare `WEEK n` paragraphs, so a digit pattern finds them; Week 8 contains a second lesson introduced only by `PERIOD 3` and a repeated `Topic:` line, which a week-only splitter would keep inside Week 8. Whether the importer splits there is **unverified**.
- `attach_stranded_label`: no stranded label observed.
- `classify_marker`: `PERIOD 3` (block 443) is a section marker that precedes teaching, not a marker without a body; it must not be classified away.

## Edits
- `QUEUE.json`: FM-INV-T3 -> `IMPLEMENTED_TESTING_DEFERRED`; one PENDING item appended (`FM-SEC-T3-W08-PERIOD3`, depends on FM-INV-T3 and FM-SRC-T3); `counts`, `status_counts` and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
Alias approval, the missing-material blocker (FM-FACT-T3-MISSING-MATERIAL, now confirmed from the document) and content approval remain owner items. Next eligible: `FM-SEC-T3-W08-PERIOD3`. This does not claim the subject or class complete.
