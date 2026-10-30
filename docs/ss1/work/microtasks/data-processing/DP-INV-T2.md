# DP-INV-T2 — Data Processing, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `c45ea6e` (fetched). `AGENTS.md` is absent. Open PRs at start: #238 (Biology), #239 (Commerce); none owns Data Processing.
- Prerequisite DP-SRC-T2 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/data-processing.json` exists with its source registered and no lessons or coverage.
- Original: `Data processing.docx`, SHA-256 `83221771b598f2ccfe1199bfc6f72c5ca9f09f6d899c0479cd128f59564500b4` — taken from the supplied `2nd Term SS1` archive (`SSS 1/2nd Term SS1_/Data processing.docx`). Hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was **not** supplied, so its hash was not checked.
- Method: `word/document.xml` read with lxml in a private scratch directory; all ten embedded images were viewed. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-261; block 262 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included.

## Week inventory (8 labels covering Weeks 2-10; no Week 1)
Labels are `WEEK 2` (fused with its topic line), `WEEK 3-4`, `WEEK 5`, `WEEK 6`, `WEEK 7`, `WEEK 8`, `WEEK 9` and `WEEK 10`. There is **no Week 1**, no scheme of work, no references list, and no revision or examination label.

| Weeks | Exact label (whitespace collapsed here) | Label block | Blocks | Label sha256 | Range sha256 | Table |
|---|---|---|---|---|---|---|
| 2 | `WEEK 2TOPIC: information processing` | 2 | 2-30 | `34318dd8f35b4dd372586bf9ca06f0dd9f71aad0d93d08e1b41ec0121664a070` | `b91c8db71c5bb8b4dbba677f00caf3b418e58f5f62253ac7c3fb57a610b9cdf6` | - |
| 3-4 | `WEEK 3-4` | 31 | 31-97 | `669f4bd65b43eba80377394dc6ae7e83b41aac7072ffd3fb814f181d176e5497` | `bc92f6a3ac9e32662be1547438da8dccd738a76fd60e99ffbbad3091dc75b823` | - |
| 5 | `WEEK 5` | 98 | 98-108 | `9b12d637a3be5c04d474a2a0a187bf2dbe2d7e32f3c32d244f3f83ddd4b7f550` | `d1f46e12939bc556937879cc4d401d218129a032fcd3c0e9d860ae954a14d829` | - |
| 6 | `WEEK 6` | 109 | 109-173 | `03792d537a25eed5326e922c8a90f71cfb1c9739ed47959db18710e2aa49a653` | `40fee4c3d4570646ff712c27d1e0cd57d32ab0111d295c6d555260b732e1a226` | - |
| 7 | `WEEK 7` | 174 | 174-188 | `5d222602d23f6b6f007aa6721de2a971a44013ddf864d5b98d8b6d25dcaeace1` | `af1b2e7ab31a573fb906dc085b6a460259bbbe459a7081b07a13e5c2609d96ff` | - |
| 8 | `WEEK 8` | 189 | 189-214 | `9d3aa1f293bf6811cada35e94cde675c7a57a2ed333349152dec9e06fdedf73c` | `9069b70bfd34238ffc6324ee38f60ccf2b6cf4bcb7fadead4717c795a5dfb12a` | block 193 |
| 9 | `WEEK 9` | 215 | 215-229 | `5507bbd0365e299edbfda9ab200d1c590f7f9ff975c5d8146b10662f82ed993e` | `4794d2c86e62ddbc8fa43ba139cdf4eed770f457dba115b67f5963f8c1a22347` | - |
| 10 | `WEEK 10` | 230 | 230-261 | `e43ab1958d1e3704a19d4eec692db39be153d434bff021e26302f680c1dfc4ac` | `386c4ec44eea2996becf8264570b188b0a2c1069d104dd2f286990bd233384de` | - |

There is no scheme of work in this document. Topic lines: W2 in block 2 (fused with the label), W3-4 block 32, W5 99, W6 110, W7 175, W8 190, W9 216, W10 231 (with a leading space). Week numbers are literal in the labels; Week 1 and Weeks 11-12 are absent.

## Other sections and objects
- Blocks 0-1: title `Data processing` and a blank block. Range sha256 `906999658bdbe8a8e746d16114778bde078577dca4a31e49d8b36a83eb9accd9`. No scheme table, references, SUBJECT/CLASS line or term title.
- Table: block 193 (Week 8): 5 rows x 1 column, a navigation-style list with an embedded layer diagram (`media/image9.png`) and a 20x20 icon (`image10.png`). No other tables.
- Pictures (viewed directly; all are inline `w:drawing`, empty block text; third-party provenance unknown): block 35 pie chart of seat counts (`image1.png`); 53 broadcasting mast and 55 radio dial (`image2.jpeg`, `image3.jpeg`); 61 rotary and 63 push-button telephones (`image4.jpeg`, `image5.jpeg`); 69 televisions (`image6.jpeg`); 77 handheld marine radio (`image7.jpeg`); 85 communications satellite (`image8.jpeg`). Captions are separate text blocks (54, 56, 62, 64, 70, 78, 86).
- No equations (`m:oMath` 0), no OLE objects, no shapes with text.
- Evaluations, assignments, practicals, revision and examination sections: none in any week.
- Provenance and currency: footnote-style markers ([n 1], [4], [1][2]) show pasted encyclopedia text; Week 6 is another school's lab rules and discipline policy (US place names, Social Security number); Week 7 is a bank customer-security page; Weeks 3-4 block 66 gives a 1876 patent statement; Week 9 lists Windows 7, Vista and Server 2003. Blocks 26-30 are survey items with coefficients. Later correction work must date and source these and keep source wording distinct from corrected fact; citations are not reuse permission.
- Unsafe or credential content: none. Passwords are mentioned generically (blocks 171, 182) with no value, and no commands, scripts or macros appear. Later items must not add executable steps.

## Structural rule findings (findings only; no rule written)
- `split_before`: Week 2's label is fused with its topic line in one paragraph (`WEEK 2TOPIC: information processing`, block 2), the Week 3-4 label is a range (`WEEK 3-4`), and `WEEK 10    ` has trailing spaces with a topic line that starts with a space. A parser that expects `WEEK <n>` alone on its line, or a separate `TOPIC:` block, will mis-handle block 2. Whether the importer does is **unverified**.
- `attach_stranded_label`: Week 2's topic is inside the label paragraph, not stranded; Weeks 3-4 and later have separate `TOPIC:` blocks.
- `classify_marker`: none needed; there is no revision, examination or scheme marker. The absence of Week 1 and Weeks 11-12 is a gap to record, not a marker.
- Extraction hazards (findings only): picture blocks (35, 53, 55, 61, 63, 69, 77, 85) have empty text; table block 193 concatenates cells with no separator and contains pictures.

## Edits
- `QUEUE.json`: DP-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; 16 PENDING items appended (DP-PRE-T2, DP-WK-T2-W02, DP-WK-T2-W03-04, DP-WK-T2-W05, DP-WK-T2-W06, DP-WK-T2-W07, DP-WK-T2-W08, DP-WK-T2-W09, DP-WK-T2-W10, DP-VIS-T2-FIG-CHART, DP-VIS-T2-FIG-RADIO, DP-VIS-T2-FIG-TELEPHONE, DP-VIS-T2-FIG-TELEVISION, DP-VIS-T2-FIG-WIRELESS, DP-VIS-T2-FIG-SATELLITE, DP-VIS-T2-TBL-OSLAYERS), each depending on DP-INV-T2 and DP-SRC-T2; counts, status_counts and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
The 3rd Term inventory (DP-INV-T3) is unread. Whether a Week 1 exists elsewhere is unanswered; ask the owner before any item assumes it. Next eligible: `DP-WK-T2-W06` (largest week, school-specific and US-specific text), then the remaining DP-WK, DP-PRE and DP-VIS items, which share one package file and should run sequentially. This does not claim the subject or class complete.
