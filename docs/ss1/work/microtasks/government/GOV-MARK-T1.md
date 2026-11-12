# GOV-MARK-T1 — Government, 1st Term marker disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. This records marker dispositions and structural findings only. It does not create teaching content, answer keys, coverage or new source rules.

## Source identity

- Source ID: SS1-SRC-40ce7dcaf672.
- Source SHA-256: 50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a.
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e.
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`.
- All line locators use the verified `word-extractor` 1.0.4 `getBody()` inventory in GOV-INV-T1.

## Marker inventory and disposition

All listed teaching-body markers are retained as **ORIGINAL** in their source-week context. The schema's `classify_marker` kinds are REVISION, EXAMINATION and SCHEME_ONLY; none of the recurring assessment/reading/weekend/theory headings is a scheme-only or examination marker. They must not be converted into a new classification rule merely because the heading contains the word “revision”.

| Exact marker form | Occurrences | Lines | Disposition |
|---|---:|---|---|
| EVALUATION QUESTION | 7 | 58, 74, 121, 203, 282, 311, 399 | ORIGINAL assessment headings |
| EVALUATION QUESTIONS | 8 | 147, 226, 347, 432, 523, 607, 675, 723 | ORIGINAL assessment headings |
| EVALUATION | 3 | 495, 796, 840 | ORIGINAL assessment headings |
| GENERAL EVALUATION/REVISION QUESTIONS | 10 | 78, 151, 230, 351, 436, 527, 611, 679, 727, 844 | ORIGINAL in-week review questions |
| GENERAL EVALUATION | 1 | 574 | ORIGINAL mid-week assessment heading |
| READING ASSIGNMENT | 10 | 84, 158, 236, 357, 442, 533, 617, 685, 731, 850 | ORIGINAL reading pointers; lines 357 and 617 have trailing colons |
| WEEKEND | 10 | 88, 162, 240, 361, 446, 537, 621, 689, 735, 854 | ORIGINAL weekend-assignment headings; spelling variants below |
| THEORY | 10 | 100, 174, 252, 373, 458, 549, 631, 699, 745, 862 | ORIGINAL theory-assessment headings; lines 174 and 549 have trailing spaces |

Weekend heading spellings are preserved:
- `WEEKEND ASSINGMENT`: 5 occurrences (88, 162, 240, 446, 735).
- `WEEKEND ASSINGNMENT`: 1 occurrence (361).
- `WEEKEND ASSIGNMENT`: 4 occurrences (537, 621, 689, 854).

The source therefore has 59 listed marker occurrences across the eight forms above. Each remains part of its teaching span; no marker is removed, normalized or treated as a separate lesson.

### Whole-line classification safeguard

The word `THEORY` occurs inside the Week One multiple-choice option at line 91: `The THEORY of a primitive society was initiated by`. This is an option sentence, not a marker. The actual Week One THEORY heading is the standalone line 100. Marker recognition must be by whole line, never substring.

## Irregular sections retained as findings

- **Week One:** two EVALUATION QUESTION blocks at lines 58–60 and 74–76 repeat the academic-field question. The first asks about the academic field before that section is taught at line 69. Preserve both source blocks; later delivery may place practice after the relevant teaching, but this item makes no lesson edit.
- **Week Six:** bare EVALUATION at line 495 follows the Socialism section. The capitalism class list has broken numbering at lines 511–517: “The Peasants” (511), “ii) The Bourgeoisie” (512), “c) The Petit Bourgeoisie” (516), and unnumbered “Proletariat” (517). Preserve source order and wording.
- **Week Seven:** GENERAL EVALUATION at line 574 is mid-week after Fascism; the standard EVALUATION QUESTIONS and GENERAL EVALUATION/REVISION QUESTIONS follow later. Retain all three in their original positions.
- **Week Nine:** “Religious Groups” at line 720 is indented within the agents list. Preserve its relationship to that list; it is not a stranded week/assessment label.
- **Week Ten:** bare EVALUATION headings at lines 796 and 840 occur after the unitary and federal sections. The READING ASSIGNMENT at line 850 ends with “pages” but gives no page numbers; retain as an unverified reading pointer, not supplied textbook content.
- Duplicate topic headings make topic-based splitting unsafe: `TOPIC: BASIC CONCEPTS IN GOVERNMENT` occurs at lines 258, 464, 554 and 636; `TOPIC: BASIC CONCEPTS OF GOVERNMENT` occurs at lines 180 and 379. `CONTENT` occurs ten times (47, 107, 181, 259, 380, 465, 555, 637, 705, 752).

## Parser-rule findings

- **split_before:** not needed. All ten teaching weeks already have standalone WEEK labels at lines 45, 105, 179, 257, 378, 463, 553, 635, 703 and 750. A rule targeting TOPIC or CONTENT would be ambiguous and could split the wrong week.
- **attach_stranded_label:** not needed. Evaluation, reading, weekend and theory labels begin their own lines; none is attached to the end of a content paragraph. Trailing colons and spelling variants are classification variants, not stranded labels.
- **classify_marker:** the only scheme-only revision/examination marker is row 42, already disposed by GOV-REV-T1 using rule `SS1-SRC-40ce7dcaf672-R002` (`SCHEME_ONLY`, `WHOLE_LINE`). The ten in-week GENERAL EVALUATION/REVISION headings are assessment content, not the scheme row.
- No additional source rule is warranted or added by GOV-MARK-T1.

## Checks and limits

- Accounted for all marker occurrences and spelling/spacing variants listed in GOV-INV-T1.
- Checked that the THEORY substring at line 91 is not treated as a standalone marker.
- Recorded irregular section positions and duplicate anchors; no split/attach rule was added.
- No package coverage, lesson, correction, asset, answer key or source rule was changed.
- No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed. Testing remains deferred by owner.
