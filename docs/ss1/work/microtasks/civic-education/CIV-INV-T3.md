# CIV-INV-T3 — Civic Education (3rd Term)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. Source inventory only. No lesson, coverage entry, rule, correction, asset, test, typecheck, importer run, database check, deployment or student-device check was performed.

## Input and identity

| Field | Value |
|---|---|
| Source | `SS1-SRC-0dc1f445683f` |
| Archive member | `SSS 1/3rd Term SS1_/3RD TERM S1 CIVIC EDUCATION.docx` |
| Member SHA-256 | `8790f478409619cb22a9a00d31a0069589c5277c27ecd81221ef76edf16d3ea1` (matches `SOURCE_ASSIGNMENTS.csv`) |
| Member size | 50,715 bytes |
| Container | Supplied composite archive, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified) |
| Header evidence | Paragraph 3: `S.S.1.       CIVICS   EDUCATION`; body content concerns Civic Education |
| Subject mapping | Canonical `Civic Education`; source heading uses `CIVICS EDUCATION`, so the existing alias approval gate remains open |

## Method and reproducible locators

- Extracted the exact DOCX member from the hash-verified ZIP without modifying its bytes.
- Read paragraphs and structure with `python-docx 1.2.0`. Paragraph locators are 1-based `word/document.xml` body paragraph positions; empty paragraphs are retained.
- Block digests are SHA-256 of UTF-8 paragraph text from inclusive start/end positions joined with newline, including empty paragraphs and without a trailing newline. These are structural paragraph-text digests, not Mammoth digests or DOCX hashes.
- Document body: 435 paragraphs; 0 Word tables; 0 inline shapes; 0 media parts; 0 drawings/blips, OLE objects, legacy pictures, text boxes, equations or hyperlinks. No separate visual-disposition item is warranted.
- No macros or embedded programs were executed. No source rendering or app importer/device test was performed.

## Opening scheme (paragraphs 2–38)

The scheme is ordinary paragraphs, not a Word table:

| Paragraph | Scheme label | Body correspondence |
|---:|---|---|
| 6 | WEEK 1 — Revision of last term’s work | No separate teaching body |
| 8–12 | WEEK 2–3 — Cultism; meaning/characteristics, groups/origin/reasons, government and society positions, prevention | Combined body `WEEKS 2 and 3` |
| 14–18 | WEEK 4–5 — Law and order; manifestations, importance, agencies and roles | Combined body `WEEKS 4 & 5` |
| 20–23 | WEEK 6 — Respect for constituted authority; meaning, types, importance | Body `WEEK 6` |
| 25–28 | WEEK 7 — Employment and unemployment; factors, poverty alleviation, guaranteed employment | Body `WEEKS 7 & 8` |
| 30–34 | WEEK 8–9 — Capitalist democracy; features, impediments, political parties and competition | Body `WEEK 9` |
| 36 | WEEK 10 — Revision of the term’s work | No separate general revision body |
| 38 | WEEK 11 & 12 — Examination & Closing | Marker only; no paper or marking scheme |

The body does not use the scheme numbering consistently. The combined employment body is labelled Weeks 7 & 8, while the scheme labels employment Week 7 and capitalist democracy Weeks 8–9. The democracy body is labelled only Week 9. Preserve the labels; do not renumber or infer missing lessons.

## Teaching-body inventory

| Body label | Paragraph range | SHA-256 | Content and assessment inventory |
|---|---:|---|---|
| `WEEKS 2 and 3` | 42–148 | `e1f97adfc85c4a6681f5c80a8acf13b8350e501534da1c6a047f9ecfe11d25c2` | Cultism: meaning (44), characteristics (45–53), groups/examples (55–78), origins (81–87), reasons students join (88–95), consequences (97–104), government position (106–110), society position (112–117), prevention (120–128), revision questions (130–136), essay questions (138–146). |
| `WEEKS 4 & 5` | 149–243 | `8d5be349145ace605fd4e55b03425a37c352b42fa6af1104b9c7b9943b403bb3` | Law and order: definitions (151–158), manifestations (160–171), importance (174–180), agencies (182–191), agency roles (193–203), citizen roles (206–212), revision questions (214–227), weekend assignment (228–240), reading assignment (242). |
| `WEEK 6` | 244–305 | `e498f658cee4838505538c6b178089de6b02ebe1037b21b663f92b60656f666b` | Respect for constituted authority: introduction and power/authority (245–249), constituted authority (251–252), respect (254–255), types (257–261), how leaders emerge (263–269), importance (270–276), revision questions (278–281), weekend assignment (283–299), reading assignment (301–303). |
| `WEEKS 7 & 8` | 306–367 | `0109f949dfe364294716fa5cfe0eed4427366d10cc5bd31b1795ec6195acaa9f` | Employment/unemployment definitions (308–309), factors (312–318), poverty (320), poverty alleviation (322–331), guaranteed employment (333–341), revision questions (343–355), weekend assignment (358–361), reading assignment (363–364). |
| `WEEK 9` | 368–435 | `875e5af48e132e7629b8b9fc90cdd5e4dac8f4bfc7a7c621c57e8825df4ba609` | Capitalist democracy definitions (370–371), features (374–380), factors impeding democracy (383–389), political parties (391–393), methods of political competition (395–402), revision questions (405–419), weekend assignment (422–425), reading assignment (428–430), reference (435). |

## Gaps, quality and factual flags

- Week 1 and Week 10 are revision markers only; Weeks 11–12 are examination/closing markers only. Revision questions are embedded in topic blocks, but there is no separate general revision section, examination paper, marking guide or answer key.
- Reading assignments point to external textbooks/pages (including Civics Education for SS2 and reference text page 65); those materials are not in the archive.
- Cultism section names multiple groups and makes broad claims about membership, conduct, mental health and criminality. Preserve as source wording only; the list is not a verified directory. Require independent evidence and safeguarding/neutrality review before student-facing reuse. Do not expand the list or add operational details.
- The historical account of the Pyrates Confraternity, University of Ibadan and 1952 date, founding aims and subsequent splintering needs independent historical sourcing.
- Government actions against cultism are described without applicable laws, dates, institutional policies or jurisdiction. Distinguish law in force from school policy and historical practice.
- Agency names and remits include legacy claims (for example, Nigerian Prisons Service). Verify current institutional names and statutory functions against primary Nigerian sources with effective/reference dates before teaching as current fact.
- Constitutional/administrative claims about organs of government and constituted authority need primary legal sources and dates.
- Employment, unemployment and poverty statements are general claims without dates or datasets; do not present them as current Nigerian statistics.
- The source recommends religious groups and religious fear as preventive measures. Student-facing treatment must distinguish this normative source position from neutral, inclusive safeguarding guidance.
- Preserve original spellings such as `GAURANTEED EMPLOYMENT`, `REVSION QUESTIONS`, `resulst`, `boarders` and `CONSTITUED` in source evidence; do not silently alter the original.

## Structural/parser findings (findings only; no rule written)

- Body labels are word/range labels (`WEEKS 2 and 3`, `WEEKS 4 & 5`, `WEEK 6`, `WEEKS 7 & 8`, `WEEK 9`), not consistent numeric markers. The importer's numeric `week_label` contract cannot represent these labels directly; do not add a rule without a versioned foundation decision.
- The first occurrences of WEEK 1, WEEK 2–3, WEEK 4–5, WEEK 6, WEEK 7–8, WEEK 8–9, WEEK 10 and WEEK 11 & 12 are scheme paragraphs. The body starts at paragraph 42; a parser must distinguish scheme headings from body markers.
- Combined body labels must not be split into fabricated individual weeks.
- No table/media rule is indicated by this document.

## Edits made

- This inventory record and its queue follow-up items are the only intended changes for `CIV-INV-T3`.
- No subject package content, lesson, coverage, rule, correction, answer, asset or approval state changed.
- Testing remains deferred; this is not approval, verification or student-readiness certification.
