# PHYS-WK-T1-W02 — Physics, 1st Term, Week 2 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** — original source row indexed; original member visually inspected; lessons/coverage now updated. Content approval PENDING and verification DEFERRED.

## Inputs
- Base: `origin/master` `882224048a1628d1d9fd03e6ee79ff6ead148622` (after PHYS-WK-T1-W01, `b29de19`). Physics work already IMPLEMENTED_TESTING_DEFERRED on master: PHYS-SRC-T1/T2/T3, PHYS-PRE-T1, PHYS-PRE-T2, PHYS-WK-T1-W01. No `AGENTS.md` exists in the repository.
- Source: the standalone member `1ST TERM S1 PHYSICS.doc`, 8,479,232 bytes, SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`, exactly the `member_sha256` recorded by the queue item. Source `SS1-SRC-5c0149cda71d`. The member, its extract and every scratch script were kept outside Git; no source document, no credential and no personal name from the document is committed.
- Prerequisite PHYS-SRC-T1 is IMPLEMENTED_TESTING_DEFERRED; the registration and the locator method were reused, not re-derived.

## Locator rule (re-verified, numbering unchanged)
Line = 1-based line of the text `word-extractor` 1.0.4 `getBody()` returns for the verified member (what the importer stores, `backend/src/db/ingestTopics.ts:299-302`). Block digest = SHA-256 of the stated lines joined with `\n`, UTF-8, edge blank lines trimmed, no trailing newline, tabs and trailing spaces kept. Re-verified: 1,288 lines, whole text SHA-256 `23a1a9aed418ac382bcfa0c4302eaf70c8a348bba82dbe6c2893c10b9bd86908`; the method was also checked against two digests recorded by PHYS-WK-T1-W01 (scheme line 24 and block 41-42). WEEK TWO is parsed row 1: label line 194, topic line 195, body lines 194-340 with the trailing blank lines 341-342 removed by the importer's `trim()`, 8,197 characters, SHA-256 `b25cc5e52fe3eda43e116bfe65a3e741092f5690683031f26fc44ddbc2fea94e` — equal to the row identity `SS1-SRC-5c0149cda71d:BODY:b25cc5e5…` in `docs/ss1/work/SS1-03/evidence/parsed_rows.json`, which is the `lesson_ids` target of every PARTIAL entry below.

## Objective index
The scheme row for Week 2 (line 25) names four quantities: mass, weight, length and time. The week's own `CONTENT` outline (lines 196-200) names four headings: length, time, mass and **volume**. Weight is in the scheme but has no outline heading; volume has one but is not in the scheme row. Both were indexed.

| Coverage id | Objective | Lines | Status |
|---|---|---|---|
| `COV-PHYS-T1-W02-OBJ-1` | Techniques and measurement: a number and a unit | 202-203 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-2` | Length: metre rule and tape rule | 205-206 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-3` | Length: callipers | 208-209 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-4` | Length: vernier callipers and micrometer screw gauge | 211-215 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-5` | The vernier reading rule | 247-250 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-6` | Worked vernier reading, Example 3.1 (Fig. 3.3) | 252-268 | UNRESOLVED |
| `COV-PHYS-T1-W02-OBJ-7` | Micrometer reading, Example 3.2 (Fig. 3.4); no rule given | 271-285 | UNRESOLVED |
| `COV-PHYS-T1-W02-OBJ-8` | Time: clocks, watches, stop clocks and watches | 218-219 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-9` | Mass and the balance | 225-227 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-10` | Weight, the mass/weight table, W = mg | 229-242 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-11` | Volume: the graduated cylinder | 244-245 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-12` | EVALUATION 1: define length and time; list five instruments | 221-223 | UNRESOLVED |
| `COV-PHYS-T1-W02-OBJ-13` | EVALUATION 2: mass versus weight; weight of 5000 g | 287-289 | UNRESOLVED |
| `COV-PHYS-T1-W02-OBJ-14` | Reading assignment (Anyakoha, Pg3-11) | 291-292 | PARTIAL |
| `COV-PHYS-T1-W02-OBJ-15` | WEEKEND ASSIGNMENT: 10 objective questions | 294-309 | UNRESOLVED |
| `COV-PHYS-T1-W02-OBJ-16` | THEORY: 6 questions | 311-340 | UNRESOLVED |

Every PARTIAL row is PARTIAL for the same recorded reason: `physics.json` has `lessons[]` length 0, no supplement exists for this row and the importer has not been run. Taught in the source is not deliverable. `PHYSICS-T1-W02-COVERAGE` keeps the week blocking.

## Why the figures are missing (binary evidence)
`getBody()` cannot emit pictures or drawings. A scratch copy of word-extractor 1.0.4 (outside Git) was patched to write a private-use marker for each Word `0x08` drawn-object anchor and each `0x01` inline-picture anchor before the library's `clean()` step; with the markers removed the text is byte-identical to the stored body. Result for lines 194-340: **43 drawn-object anchors** — 35 at line 253, 2 at 257 and 1 at 262 (Example 3.1; caption `Fig. 3.3` at line 260), 1 at 273 (Example 3.2; caption `Fig. 3.4` at 280), and 1 each at 316, 321, 327 and 334 (theory items 2(a), 2(b), 3 and 4) — and no inline-picture anchor. Whole document: 139 drawn-object and 45 inline-picture anchors.

Weekend items 3, 7 and 10 (lines 297, 303-304, 308-309) each point at "the diagram below" or "the instrument", yet **lines 295-309 contain no anchor of either kind**. Whether those three diagrams were deleted, placed where the body text does not reach, or never present cannot be decided from the extract. The member's text-box stream (482 characters, SHA-256 `833455d3…`, also recorded by W01) holds short labels such as 4cm, 5cm, 15mm, A and B, but the extractor gives no anchor-to-label mapping, so no label is attributed to a figure. The figure inventory stays with `PHYS-VIS-T1`; the rendering decision stays with `PHYS-OWNER-EXTRACTION-STRATEGY` (BLOCKED).

## The `undefined` artefact (theory item 5, line 339)
The string `undefined` occurs 98 times on line 339 and once more in the whole extract (line 995, `m2undefined`, WEEK 8). It is not source text. The member holds 99 U+001F control characters in its main text; `filters.js` in word-extractor 1.0.4 builds its replacement table without an entry for U+001F, the replace callback returns the JavaScript value `undefined`, and `String.replace` writes the word. The importer stores this body, so a student would be shown "undefined". What the 98 characters stood for cannot be told from the body text (three underscore runs show three blanks). Open item `PHYSICS-T1-W02-EXTRACTION-ARTEFACT` blocks delivery; `PHYS-COR-T1-W02-BINDING` is the bounded correction. The line-995 instance is reported to WEEK 8's indexing task and not edited here.

## Assessment scope
No block has an answer key, worked answer or mark allocation (checked inside all four blocks for mark, answer, allocation, score, solution). No answer or option is supplied here.

| Block | Source support, from Week 2 text |
|---|---|
| EVALUATION 1, 221-223 | Q1 asks to define length and time: Week 2 defines neither (Week 1 does, lines 77 and 81). Q2 asks for five length instruments: five are named at 206-215. |
| EVALUATION 2, 287-289 | Q1 answerable from the table 232-238. Q2 needs W = mg (241-242) and a grams-to-kilograms step the week never teaches; the line uses the letter g for both the gram and gravity. |
| WEEKEND 294-309 | Item 1: the week gives internal diameters to the vernier callipers (212), which is not an option. Item 2: partly supported by 233-235. Items 3, 7, 10: diagrams absent, no anchor. Item 4: 229, 237. Item 5: burette and pipette occur nowhere else in the extract. Item 6: Week 1 content (143-147). Item 8: 215, but constantan and watt meter are not taught here. Item 9: hydrometer is Week 7 (961); relative humidity and dew point occur nowhere else. |
| THEORY 311-340 | Item 1: five of six quantities covered (229, 212, 226, 206, 215); 1(d) "the dimension of a compound" is undefined. Items 2-4: figures absent (anchors 316, 321, 327, 334). Item 5: corrupted stem. Item 6: table 232-238. |

## Observed defects (retained, uncorrected)
1. Line 203: "20 metres as the length of a table tennis's board" — implausible; a regulation table is about 2.74 m.
2. Example 3.2 (282-285): 17.00 + 0.11 = 17.11 mm, but line 285 prints `17.1mm   or 1.711cm`; 17.1 mm is 1.71 cm.
3. The week states no rule for reading a micrometer screw gauge; the vernier rule is at line 248 only. Zero error is not taught (`zero error` occurs nowhere).
4. Weekend item 1 has no option matching the week's own teaching.
5. Theory 1(d) "the dimension of a compound" is not defined.
6. Scheme row names weight, outline names volume.
7. Line 245: graduated cylinder "accurate to the nearest 1cm3" (source claim, unverified); the eureka can and the displacement method are named, not described.
8. Line 238 relies on "Hook's law" and the principle of moments; `hooke` occurs nowhere in the extract and neither idea is taught.
9. Lines 265-267: the brace, plus sign and rule of the worked sum were lost.
10. Wording: `time internal` twice (219); `guage` (297, 305); `Mere rule`, `watt meter` (305); `attitude` (307); `diametre` (313); `micro meter` (316); `List five instrument` (223); item 10 wraps its fourth option onto line 309 with `(C)` capitalised; numbering styles differ between the weekend and theory lists.
11. Flattened notation: `m/s2` (242, 289), `1cm3` (245); the force-dimension options at line 302 use U+2212 where Week 1 uses an ASCII hyphen; the letter x is the multiplication sign at 283.
12. Ambiguous anchors: outline lines 197-200 repeat the headings at 205, 218, 225 and 244 beyond case, and `EVALUATION` is the whole of lines 221 and 287; none is a unique anchor for a `classify_marker` rule.
Defects 1, 2 and 4-8 are the FACT item `PHYSICS-T1-W02-FACT-DEFECTS` (blocking); 3 is `PHYSICS-T1-W02-MICROMETER` (blocking); 9 and 11 are `PHYSICS-T1-W02-NOTATION-LOSS` and 10 and 12 are `PHYSICS-T1-W02-SOURCE-DEFECTS` (both non-blocking); the artefact has its own blocking item. No source byte was edited and no correction was authored, because a factual correction is a delivery replacement.

## Checks performed
Member SHA-256 re-computed from the supplied file before parsing; extraction re-run and its whole-text digest compared to the recorded value; parsed row 1 re-derived from lines 194-340 and compared to `parsed_rows.json` (hash and length 8,197); two W01 digests reproduced to confirm the locator method; every line-level claim in the new entries asserted against the extract by script (content of each cited line, the 98 + 1 `undefined` occurrences, single-occurrence terms such as burette, pipette, constantan, hooke and zero error, the absence of answer or mark words inside the four assessment blocks, and the anchor counts); the marker-stripped extract compared byte-for-byte to the stored body; every `lines a-b SHA-256` digest cited in the new records re-derived from the extract; package and queue JSON re-serialised byte-exactly before and after editing, re-validated against a field-for-field mirror of `subjectPackageSchema.ts` (strict keys, status vocabulary, digest pattern, non-empty `affected_ids`), and checked for duplicate IDs and reference integrity across coverage, open items and queue; `counts`, `status_counts`, `total` and `runnable_now` recomputed from `items` after confirming the runnable rule reproduces the stored 44-item list exactly before the edit; no credential, source document or extract committed.

## Deferred and remaining
Full tests, typechecks, importer runs, compiler plans, database and device checks remain deferred by owner instruction; CI was left enabled. `package_status` stays PENDING and `lessons[]` stays empty: nothing is deliverable and the week keeps blocking. Five bounded tasks are appended: `PHYS-LES-T1-W02-MICROMETER-READING`, `PHYS-LES-T1-W02-VOLUME-MEASUREMENT` (PENDING, runnable), `PHYS-LES-T1-W02-KEY-ASSESSMENT` (PENDING, waits for the expert item), `PHYS-COR-T1-W02-BINDING` (PENDING, waits for the supplements) and `PHYS-FACT-T1-W02-SCOPE` (BLOCKED, nine expert questions). `PHYS-VIS-T1` still owns the figures, `PHYS-OWNER-EXTRACTION-STRATEGY` the notation, and `PHYS-RULE-T1-REVISION-SCHEME` now also owns the repeated-heading constraint. Files outside this task's three allowed paths (including `NEXT_TASK.md`, `QUEUE_BUILD.md` and every other subject's files) were not written.


## Current source-render and delivery update — 2026-11-12 (supersedes stale statements above)

The original text-extraction and body-hash analysis above remains valid, but its delivery-state statements are historical. The exact original member was recovered from CI artifact `physics-original-source-evidence`, hash-verified and rendered to a 37-page PDF. Week Two is PDF pages 6–10.

- Three student supplements now exist: measurement basics, micrometer reading and volume measurement. Coverage rows 1–13 have lesson bindings and are marked implemented-equivalent; the textbook reading remains partial because the cited pages are unavailable; weekend and theory blocks remain partial because some figure questions/wording need teacher-approved replacements.
- Original figures that the text extractor omitted are visible in the rendered PDF. The micrometer and vernier examples are present; however, some assessment scale drawings are too low-resolution or absent to support a defensible numerical key. The new SVGs are original replacements, not copied source figures.
- Example 3.2's stated components give 17.00 mm + 0.11 mm = 17.11 mm = 1.711 cm. The source's “17.1 mm” is inconsistent. A clear original replacement-reading SVG is now registered with worked examples 17.11 mm, 4.37 cm and 1.76 cm.
- The original PDF page 10 shows the three blanks in the SI question and the micrometer/vernier figures. The 98 “undefined” strings are a word-extractor artefact from U+001F control characters; “undefined” is not printed in the rendered source.
- A proposed teacher-only 44-mark answer key is in `PHYS-LES-T1-W02-KEY-ASSESSMENT.md`. It keys text-answerable questions and explicitly flags weekend items 3/7/10 and theory items 2–4 for replacement rather than guessing readings. It also flags the missing vernier-callipers option, “dimension of a compound” and the three-blank SI wording.
- Volume coverage is now taught by `SUP-SS1-PHYSICS-T1-W02-VOLUME-MEASUREMENT`; a new displacement SVG is registered. Measurement basics includes vernier and micrometer assets; micrometer reading has its own companion lesson.
- Original source member and row identity remain unchanged. The micrometer worked-example delivery correction still needs a correction binding; teacher scope/approval and source-alias decisions remain open. Content approval is PENDING and verification DEFERRED.

Full page/visual evidence: `PHYS-SOURCE-VISUAL-RECONCILIATION-20261112.md`. Current coverage and open-item state is in `physics.json` and `QUEUE.json`.
