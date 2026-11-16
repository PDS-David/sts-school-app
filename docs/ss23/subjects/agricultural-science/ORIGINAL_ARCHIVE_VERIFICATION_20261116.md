# SS2 Agricultural Science — original archive verification

**Audit date:** 2026-11-16  
**Scope:** Original SS2 source archive only; no package content, approval, delivery or database state changed.

## Archive identity

| Archive | SHA-256 | ZIP members |
|---|---|---:|
| `SSS 2-20260507T072840Z-3-001.zip` | `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153` | 61 |

The archive was retrieved from the owner's Library file and inspected as ZIP bytes. It contains exactly three Agricultural Science source documents, one for each term:

| Term | Exact archive member | Bytes | SHA-256 | Extracted text |
|---|---|---:|---|---:|
| First | `SSS 2/1st Term SS2_/1ST TERM S2 AGRICULTURAL SCIENCE.doc` | 10,759,168 | `225f920d3751892fcdd870b7c2bfb35ed6d773e70f317a60e72c07445e621316` | 10,925 words |
| Second | `SSS 2/2nd Term SS2_/2ND TERM S2 AGRICULTURAL SCIENCE.doc` | 344,064 | `cd612ad10f404af75ceb55b288d606e49ab534388dda2151239b9114180f82b5` | 6,136 words |
| Third | `SSS 2/3rd Term SS2_/3RD TERM S2 AGRICULTURAL SCIENCE.doc` | 408,064 | `6abb32818845fa3739f287d2cc3e274149313bfb381074a623a2bce8c02b2811` | 7,089 words |

The extracted word counts are from the legacy Word `.doc` members using Antiword. They are inventory diagnostics, not a claim that extraction preserves every embedded visual or layout element. The original member bytes and hashes remain authoritative.

## Source identity and term check

All three files' internal visible headings identify their respective term and SS2 Agricultural Science. The First-Term file's OLE metadata misleadingly records the document title as **“THIRD TERM E-LEARNING NOTE”**. This conflicts with:
- its archive path under `1st Term SS2_`;
- its visible document heading **“FIRST TERM E-LEARNING NOTE”**;
- its SS2 Agricultural Science subject/class line; and
- its First-Term scheme and lesson sequence.

Therefore the First-Term attribution is supported by the archive path and visible content, not the inconsistent OLE title metadata. Do not rename or rewrite the source file to conceal this metadata discrepancy.

## Term coverage observed in source

### First Term
Scheme topics:
1. Soil: meaning, types, composition and properties (Weeks 1–2).
2. Farm machinery and implements (Week 3).
3. Surveying and planning of farmstead (Weeks 4–5).
4. Irrigation and drainage (Week 6).
5. Environmental factors affecting agricultural production (Week 7).
6. Plant nutrients and nutrient cycles (Weeks 8–9).
7. Factors influencing nutrient availability, replenishing soil nutrients and farming practices (Week 10).

Visible lesson headings include Weeks One, Two, Three, Four and Five, Six, Seven, Eight and Ten. The source has one Week Eight heading for the combined Weeks 8–9 scheme topic; no distinct Week Nine lesson heading was observed. This corroborates the existing open coverage question; it does not justify inventing a separate Week Nine lesson.

### Second Term
Scheme topics:
1. Pasture and forage crops (Weeks 1–2).
2. Forest management (Week 3).
3. Floriculture (Week 4).
4. Diseases of crops (Weeks 5–6).
5. Pests of crops (Weeks 7–8).
6. General prevention and control of crop pests (Week 9).
7. Revision (Week 10).
8. Examination (Weeks 11–12).

The source body includes corresponding lesson sections for pasture/forage, forest management, floriculture, crop diseases, crop pests and general pest prevention/control. It ends with a Week Ten section. The source scheme/body distinction and all assessment clusters still require row-level reconciliation; this archive check alone does not establish that every prompt or answer has been mapped.

### Third Term
Scheme topics:
1. Common weeds found on farms (Weeks 1–2).
2. Crop improvement (Weeks 3–4).
3. Basic economic principles (Weeks 5–6).
4. Farm records and farm accounts (Weeks 7–8).
5. Animal nutrition (Weeks 9–10).
6. Revision (Week 11).
7. Examination (Week 12).

The source body includes lesson sections for Weeks One and Two (weeds), Three and Four (crop improvement), Five and Six (economic principles), and Nine and Ten (animal nutrition). The source's scheme lists Weeks 7–8 farm records/accounts; that body section must be reconciled against the original pages and package mapping. Revision and examination are markers, not new instructional topics.


## Follow-up inspection: Third-Term farm-records body is present

A full-text extraction of the exact Third-Term member (`6abb32818845fa3739f287d2cc3e274149313bfb381074a623a2bce8c02b2811`) confirms that the Weeks 7–8 farm-records/accounts teaching body is present even though the extracted text does not show a distinct `WEEK SEVEN AND EIGHT` heading.

The body begins after the economic-principles material and includes:
- farm records and farm accounts;
- balance sheet/net-worth statement and profit-and-loss account;
- a worked Segun Farms profit-and-loss example;
- definitions of assets, fixed/current assets, costs, liabilities, owner equity, liquidity, solvency, appreciation, depreciation, salvage value and useful life;
- total and annual depreciation calculations;
- evaluation questions, class activity, general evaluation, reading assignment and weekend assignment.

The extracted text also exposes source defects requiring correction/review, not silent acceptance: the example's credit-side table labels a ₦2,000 receipt as sales of spent layers although the input list says sales of eggs; “value of stick left” appears where “stock” may be intended; and an input-output table is interleaved with the economic-principles class activity. These observations support the existing accounting-example and assessment-reconciliation holds. They do not authorize changing the source or approving the model answer.

**Disposition:** do not classify Weeks 7–8 as wholly absent. Treat the body as present but structurally under-labelled, and keep its exact package mapping and assessment/source reconciliation open until checked against the original rendered pages.


## Cross-check against the merged Agriculture package

I also fetched and parsed the package blob at master (`a61d1fff21ffe09f122eab69db734fef6b781841`) and reconciled its top-level source/question inventory with the package register:

| Term | Units | Practice records | Marked ORIGINAL_SOURCE | Marked AUTHORED_SUPPLEMENT |
|---|---:|---:|---:|---:|
| First | 8 | 150 | 128 | 22 |
| Second | 6 | 24 | 0 | 24 |
| Third | 5 | 21 | 0 | 21 |
| **Total** | **19** | **195** | **128** | **67** |

Structural checks on the fetched JSON found:
- 195 practice records with unique question IDs;
- no marking-total mismatches (criterion marks sum to the question's declared marks);
- no missing question or answer locator fields;
- 3 registered original source records, 48 external factual references, 52 asset records and 47 open items.

These checks confirm record structure and the package's own origin labels only. They do not establish answer accuracy, completeness of source-question transcription, correctness of source locators, rights, teacher approval or release readiness. In particular, the Second- and Third-Term source assessment inventories remain open because their 45 current practice records are explicitly authored supplements, not source-verbatim questions.

## Decisions this audit does not make

- It does not select between conflicting source versions for other SS2 subjects.
- It does not certify substantive accuracy of the existing authored lessons or assessment answers.
- It does not grant school/teacher/specialist approval, copyright permission or student-delivery permission.
- It does not close any of the 47 Agricultural Science open items or change package status.
- It does not authorise SS2 Biology to start before the Agriculture gates recorded in the decision register pass.

## Next bounded implementation task

Use these exact member hashes to finish Agriculture's source-to-package reconciliation, beginning with:
1. a one-to-one inventory of every original assessment prompt and its page/section locator for all three terms;
2. exact reconciliation of Third-Term Weeks 7–8 farm records/accounts against the full original document, not just the extracted heading list;
3. First-Term Week 8–9 source coverage and the six soil practical procedures; and
4. Second-Term floriculture, disease and pest-table source-row checks.

Keep source-verbatim questions distinct from authored supplements. Where original wording is malformed or the source is incomplete, retain an explicit unresolved record rather than guessing.
