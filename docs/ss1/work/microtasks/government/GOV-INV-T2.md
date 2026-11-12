# GOV-INV-T2 — Government, 2nd Term source inventory

**Status:** IMPLEMENTED — TESTING DEFERRED. This is a source inventory, not a lesson package, approval, verification or acceptance. No package, coverage, source rule, lesson, correction or asset was changed by this item.

## Source identity and method

- Source ID: SS1-SRC-c76f430c7cf8.
- Archive member: SSS 1/2nd Term SS1_/GOVT.docx.
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e — verified.
- Member size: 591,018 bytes.
- Member SHA-256: bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782 — verified.
- The filename is GOVT.docx, but the document itself identifies TERM: 2ND TERM, SUBJECT: GOVERNMENT and CLASS: SS 1. This confirms Government; no Civic Education handoff is indicated.
- Inspected the original DOCX package and word/document.xml directly with ZIP/XML parsing. The extracted member remained in private scratch space and was not added to Git.
- word/document.xml is 637,995 bytes, SHA-256 50b0775ae25120cc7626d08fcef87c62566b48917812eede383b26a41a942aad.
- The inventory locators below use 1-based top-level child ordinals of w:body in word/document.xml. Each week hash is SHA-256 of the canonical XML (C14N 1.0) for the stated child range, concatenated with a newline between child elements. This avoids ambiguous flattened line numbering and retains the comparison table and Office Math structure. It is a source-structure locator, not a claim that Mammoth line numbers were generated in this inventory.

## Document structure

- 512 top-level w:body children: 510 paragraphs, one table and one section-properties element.
- One table at body child 162: six rows and eighteen cells (three cells per row). The first cell of each row is empty; the second and third columns compare indirect rule with the policy of assimilation.
- No embedded raster/vector media, DrawingML pictures, VML pictures, drawings, text boxes, hyperlinks, headers or footers were found in this DOCX package.
- One native Office Math object occurs in the Week Five constitutional material: the pound sign (£), in the voting-income qualification paragraph at body child 232. Preserve it as text/math; it is not a figure.
- Five superscript runs occur at body children 1, 44, 197, 237 and 274: “ND” in 2ND; “th” in 17th; “th” in 14th; “st” in 1st January; and “st” in 1st April. These are ordinal formatting, not independent diagrams.
- 263 w:numPr numbering-property occurrences were found. Later week indexing should inspect list numbering and retain the source's list sequence.
- The scheme of work is plain paragraphs, not a Word table. The only actual table is the Week Three comparison.

## Preamble and scheme of work

The preamble is body children 1–34, C14N SHA-256 7df3af37ac3307035c8b7d43421ee754018a8ccc3deb5ed651da10d764ad56a0.

| Body child | Source text / role |
|---:|---|
| 1 | TERM: 2ND TERM |
| 2 | SUBJECT: GOVERNMENT (trailing whitespace in the source paragraph) |
| 3 | CLASS: SS 1 |
| 4 | Blank paragraph |
| 5 | SCHEME OF WORK |
| 6 | WEEK / TOPIC header |
| 7–15 | First scheme entry: Colonial Administration / historical background, reasons for European arrival, British colonial policy, indirect rule and its Nigerian regional operation, and colonial impacts |
| 16–17 | Scheme entry 3: advantages and disadvantages of colonial rule; comparison of British indirect rule and French assimilation/association |
| 18–19 | Scheme entry 4: nationalism, its growth and effects, and nationalist leaders |
| 20–25 | Scheme entry 5: constitutional development and pre-independence constitutions |
| 26–27 | Scheme entry 6: Lyttleton constitution and Lagos conference |
| 28 | Scheme entry 7: post-independence constitutions |
| 29 | Scheme entry 8: 1989/1999 constitutions |
| 30–31 | Scheme entry 9: federalism and its features |
| 32 | Scheme entry 10: problems of Nigerian federalism |
| 33 | Scheme entry 11: development of political parties |
| 34 | Scheme entry 12–13: Revision and Examination |

Scheme mapping:
- Scheme entry 1 & 2 map to teaching Weeks One and Two.
- Entry 3 maps to Week Three.
- Entry 4 maps to Week Four.
- Entry 5 maps to Week Five.
- Entry 6 maps to Week Six.
- Entry 7 maps to Week Seven.
- Entry 8 maps to Week Eight.
- Entry 9 maps to Week Nine.
- Entry 10 maps to Week Ten.
- Entry 11 maps to Week Eleven.
- Entry 12–13 is a scheme-only revision/examination marker. There is no Week Twelve or Week Thirteen teaching body in this document.

Source discrepancy preserved verbatim for later factual review: scheme child 22 says “Clifford constitution of 1992”; the Week Five body heading at child 212 says “CLIFFORD CONSTITUTION OF 1922”. Do not silently harmonise the scheme or body. The scheme also contains the wording “pool i lol” at child 9; preserve it as source text pending any separately justified correction.

## Teaching-week inventory

All eleven WEEK labels occur exactly once. Week ranges are inclusive and end immediately before the next WEEK label. The hashes below are over canonical XML for the stated top-level body children.

| Week | Exact label and body-child range | C14N SHA-256 | Topic / main sections |
|---|---|---|---|
| W01 | WEEK ONE; children 35–88 | 491d4a2a7ec077af389fc995ebe43a2d75dfac5d11bd60954f17e946637d31ad | Colonial Administration (Historical Background); reasons for colonialism; indirect rule; features; reasons for its introduction; roles of traditional rulers; indirect rule in Northern Nigeria |
| W02 | WEEK TWO; children 89–148 | 7e79e0f9de9f1909a853fd09d50ecc80bc09122120fcd4c7029eee926f605782 | System of Indirect Rule in Western Nigeria; indirect rule in Eastern Nigeria; reasons for failure in Eastern Nigeria; merits/demerits of indirect rule; positive/negative impacts of colonial rule in West Africa |
| W03 | WEEK THREE; children 149–176 | 0606f62b70ff5309010f52586899b06c38c949cf46f7eb97f9374f58d6c6e177 | Advantages/disadvantages of colonial rule; comparison of British indirect rule and French assimilation; six-row comparison table at child 162; functions of the British colonial governor in West Africa |
| W04 | WEEK FOUR; children 177–209 | d6f82017c91ef3cc580f63e9ad4922478bba1e7db520dd5d8774163571113aac | Nationalism; effects of nationalism in Nigeria/West Africa; key nationalist leaders and contributions |
| W05 | WEEK FIVE; children 210–287 | d37f05d486499d940557f0e598b1a7c83101958108c50a73363e91b49bfb01c6 | Clifford Constitution of 1922; features, merits and demerits; Richards Constitution features, merits and demerits; Macpherson Constitution 1951 features, merits and demerits |
| W06 | WEEK SIX; children 288–322 | 2d7358099b33a7fb3b26a5b27db09dd566cf0b01d340d47f0c1b3bf5b1d60206 | Lyttleton Constitution of 1954; merits/demerits; 1958 Constitutional Conference |
| W07 | WEEK SEVEN; children 323–373 | 8f8ea27b63ac7fe82d26b05cd8c1d7cece77434d0694625d8a9962d7b84af987 | Independence Constitution of 1960; features, merits and weaknesses; Republican Constitution of 1963; merits and demerits |
| W08 | WEEK EIGHT; children 374–417 | e88704dbce633832d6a02893344cfe61bc6fb11e60f63801175b15868d99fbb4 | Features, merits and demerits of the 1989 Constitution; features, advantages and demerits of the 1999 Constitution |
| W09 | WEEK NINE; children 418–429 | c9c39d30a7b8b668a029afa490512afe3e525940fb3ce7ff507c96724b0051b5 | Features of Nigerian federalism |
| W10 | WEEK TEN; children 430–446 | a8734e97dc7f3f2f1fe9e5c17fee138cd4d328a34910d4f4a4bc0b79e4af0bdd | Problems of Nigerian federalism |
| W11 | WEEK ELEVEN; children 447–511 | 1c7e59e69bc84d55a3c2b1cf86ef2003f5e9ea33add6a9844d71a2faf4ec3886 | Development of political parties: NNDP, NYM, Action Group and NPC; objectives and achievements |

Week Six and Week Seven begin directly with their constitution headings and do not have a separate TOPIC/CONTENT paragraph. Do not invent those labels. Week Nine and Week Ten are short source sections and must not be expanded by assuming missing material.

## Marker inventory

- Ten standalone EVALUATION paragraphs occur at body children 82, 141, 172, 205, 278, 318, 369, 414, 442 and 505.
- Week Nine has no EVALUATION paragraph.
- No body occurrences of READING ASSIGNMENT, WEEKEND, THEORY, GENERAL EVALUATION, REVISION or EXAMINATION were found. The only revision/examination wording is scheme child 34.
- The ten EVALUATION headings are part of their respective teaching spans. They are not revision/examination markers and should not be reclassified as scheme-only content.

## Parser-rule findings (findings only; no rule is written by this inventory)

- split_before: not needed. Every teaching week already begins with its own standalone WEEK ONE through WEEK ELEVEN paragraph; all labels are unique.
- attach_stranded_label: not needed. Week labels and EVALUATION labels are standalone paragraphs; no stranded week label needs attachment to a following topic anchor.
- classify_marker: required for scheme child 34, “12 - 13<TAB><TAB>Revision and Examination”, as SCHEME_ONLY. The exact anchor occurs once and no Week Twelve/Thirteen body exists. Do not classify the ten EVALUATION paragraphs as revision/examination.
- The row “WEEK<TAB><TAB>TOPIC” at child 6 is a scheme header, not a teaching week.
- No parser rule was added by GOV-INV-T2.

## Factual and neutrality flags for later work

This inventory does not adjudicate historical or constitutional claims. The following areas need dated primary or authoritative sources before any replacement lesson presents them as current law or settled fact:

- Colonial period and administration: Berlin Conference dates, partition and colonial rule dates, the role attributed to Bismarck, the roles of Britain/France/Germany/Portugal, amalgamation in 1914, and the claimed introduction and regional operation of indirect rule.
- Regional historical accounts: claims about Northern, Western and Eastern Nigerian political institutions, taxation, warrant chiefs, resistance/riots and the colonial governor's powers.
- Constitutional development: 1922, 1946, 1951, 1954, 1958, 1960, 1963, 1989 and 1999 dates, membership, voting qualifications, legislative/executive/judicial powers, constitutional status and the distinction between enacted law, proposals and historical arrangements.
- Nationalist leaders and political parties: biographical dates, officeholding, party formation, election results and claimed achievements for Herbert Macaulay, Nnamdi Azikiwe, Ahmadu Bello, Obafemi Awolowo, NNDP, NYM, Action Group and NPC.
- Nigerian federalism: claims about constitutional rigidity, state and local-government structures, federal character, Senate representation, secession, revenue allocation and boundary disputes.

The source uses evaluative headings such as merits, demerits, positive impacts and negative effects. Teach these as attributed historical interpretations and compare evidence; do not turn them into political endorsements or uncontested judgments. Keep Government separate from Civic Education. No external factual source was consulted for this inventory.

## Items appended to the queue

Fifteen bounded follow-up items were added. All are PENDING and depend on both GOV-INV-T2 and GOV-SRC-T2:

- GOV-PRE-T2 — source preamble and scheme mapping, children 1–34.
- GOV-REV-T2 — scheme-only revision/examination row at child 34.
- GOV-MARK-T2 — disposition of the ten EVALUATION headings and marker vocabulary.
- GOV-WK-T2-W01 through GOV-WK-T2-W11 — one indexing item for each of the eleven teaching weeks, using the exact child ranges and hashes above.
- GOV-VIS-T2 — disposition of the comparison table, Office Math pound sign and superscript formatting; no asset is assumed.

## Checks and limits

- Recomputed the archive and assigned member SHA-256 values; both match the registry.
- Inspected the original DOCX XML structure, scheme, all eleven WEEK labels, section headings, evaluation markers, table, Office Math object and superscript runs.
- Recomputed all eleven week-range C14N hashes and the preamble C14N hash.
- No tests, typechecks, importer/compiler run, database write, lesson authoring, package coverage update, app/device check or teacher review was performed. Testing remains deferred by owner.
- No content approval, verification, certification, acceptance or deployment is claimed.
