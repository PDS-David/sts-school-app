# SS2 Mathematics Source Reconciliation — 2026-11-17

## Source identity and extraction

The source documents below were read from the recovered original SS2 ZIP. The archive SHA-256 is `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153`; all 61 SS2 members match the extraction manifest by byte count and SHA-256.

| Term | Archive member | Member SHA-256 | Bytes | Rendered pages |
|---|---|---|---:|---:|
| Second | `SSS 2/2nd Term SS2_/MATHEMATICS.docx` | `9356b2d91b977ae828d0e5866fd51d24589c7e1751616c903c2a1041bee9b14d` | 301,805 | 24 |
| Third | `SSS 2/3rd Term SS2_/3RD TERM S2 MATHEMATICS.docx` | `1a0f6bf443be9356ad95a1e846c96e6bc30ce91ebaed50a8bffb030379860f22` | 633,856 | 31 |

Both documents were rendered to PDF with LibreOffice for page-level inspection. The Third-Term DOCX is a valid ZIP member and its original member hash matches. The normal python-docx parser fails on a malformed `word/NULL` relationship target; the exact member's `word/document.xml` was recovered directly using OpenXML. That extraction contains 27 tables, 3 embedded images and one embedded Excel worksheet. The embedded worksheet contains cumulative-frequency data for the ogive. The original source images/workbook have not been copied into student assets; source reuse and visual QA remain gated.

## Source-topic reconciliation

### Second Term

- Week 1: revision and straight-line/curve gradients, including gradient by tangent.
- No distinct Week 2 heading or substantive Week 2 body appears in the rendered source.
- Week 3: revision of linear inequalities in one variable.
- Week 4: inequalities in two variables and combined ranges.
- Week 5: applications of inequalities and linear programming.
- Week 6: algebraic fractions.
- Week 7: review and periodic test.
- Week 8: operations in algebraic fractions.
- Week 9: logic, propositions, truth tables and deductive reasoning.
- The scheme lists Week 10 chord properties (perpendicular bisector of a chord, equal chords and their distances from the centre). The body after Week 9 contains circle-theorem material on angles at the centre and in the same segment, but no distinct Week 10 chord-properties section was located.
- Week 11 heading appears before cyclic-quadrilateral material; opposite angles and tangent-chord properties are present.
- Weeks 12–13 are marked for revision and examinations.

The Week 2 and Week 10/11 discrepancies are retained as blocking open items. The available circle-theorem body has not been silently reassigned to a different week.

### Third Term

- Week 1: tangents from an external point and equal tangent lengths.
- Week 2: sine rule and cosine rule, including worked triangle solutions.
- Week 3: bearings, distances, and angles of elevation/depression.
- Week 4: grouped frequency distributions, class boundaries/marks, histograms and frequency polygons.
- Week 5: cumulative frequency and ogives, including the embedded worksheet data.
- Week 6: review/periodic-test marker; no distinct new instructional topic is introduced.
- Week 7: mean, median and mode of grouped data, including interpolation.
- Week 8: experimental and theoretical probability, events and sample spaces.
- Week 9: addition/multiplication rules, mutually exclusive/independent events and tree diagrams, including replacement cases.
- Week 10: revision marker.

## Package state

The draft package now contains 31 units: 10 First-Term, 11 Second-Term and 10 Third-Term records, with 62 authored supplementary practice records. All 31 body hashes were independently recomputed using UTF-8 SHA-256 and match the committed values.

The 42 Second-/Third-Term practice records are labelled `AUTHORED_SUPPLEMENT`; none is represented as an original source question. The source assessment blocks, textbook-referenced exercises, original evaluation prompts, and all worked examples still require item-by-item reconciliation. Coverage remains partial/marker/unresolved; four open items block delivery. The package remains `PENDING`, all units remain `DRAFT`, and student delivery remains disabled.

## Required next QA

1. Reconcile every original evaluation, general-evaluation, ticket-out, weekend-assignment and textbook-referenced exercise block across all three terms.
2. Inspect rendered diagrams, Word drawing shapes, fraction notation, angle/degree symbols, graph scales, tables and the three T3 embedded images.
3. Independently verify every authored answer and marking allocation.
4. Resolve the Week 2 and Week 10/11 source discrepancies without inventing a missing lesson.
5. Obtain subject-specialist review and source-reuse clearance before changing any delivery gate.
