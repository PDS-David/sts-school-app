# SS1 Physics — remaining owner/teacher decisions

Prepared: 2026-11-12  
Branch: `agent/physics-source-fact-reconciliation-20261112`  
This is a decision brief, not an approval record. No approval reference has been fabricated.

## Work already completed

- 33 authored lesson objects; 173/173 non-marker coverage rows are `IMPLEMENTED_EQUIVALENT`; 7 markers remain for scheme/revision/examination records.
- 30 registered SVG assets; 20 are original assets added during this work.
- Three original .doc members were hash-verified and rendered (37/22/14 pages). Their page/figure inventory is in `PHYS-SOURCE-VISUAL-RECONCILIATION-20261112.md`.
- First Term Week One and Week Two reading/assessment gaps have in-app replacements; the Week Two source row is bound to the corrected measurement lesson plus companion micrometer/volume lessons.
- Original .doc bytes are unchanged.
- All lesson content approvals remain PENDING and lesson verification remains DEFERRED. The current package status is therefore not READY.

## 1. Source identity and aliases

| Source | Evidence | Recommended disposition | Approval state |
|---|---|---|---|
| First Term | Original member title/body explicitly identify SS1 Physics; archive member and hash match the assignment manifest. | Approve the Physics/SS1/1st Term alias. | PENDING |
| Second Term | Original member title/body explicitly identify SS1 Physics; archive member and hash match the assignment manifest. | Approve the Physics/SS1/2nd Term alias. | PENDING |
| Third Term | Original file name is `3RD TERM S1 PHYSICS.doc`; rendered document identifies SS1/3rd Term/Physics in its header/body. | Approve the Physics/SS1/3rd Term alias if the owner accepts the filename/header as sufficient source identity. | PENDING |

The exact source hashes and rendered page evidence are in the source reconciliation report. Do not edit the original archive members.

## 2. First Term Week One

The original scheme includes laboratory familiarisation. The source body does not teach it. A bounded independent lesson now covers apparatus groups, measurement routine, safe habits and hazard reporting without assuming local facilities or authorising unsupervised experiments.

The original page 3 evaluation asks for the scientific-method steps, but the source body does not teach them. A separate independent lesson now covers observation, question, hypothesis, fair testing, variables, data, conclusion and communication.

The source page 6 classification question lists seven derived quantities, while the prose says “three” basic quantities and the table shows seven SI base quantities. The new lesson teaches the seven base quantities and the relevant derived quantities. Source PDF pages 4–5 show the formulae/derivations as embedded equation images; the old text-only extraction omitted them. The rendered source confirms that the Time unit and derivation cells are present.

**Recommended disposition:** retain both independent supplements; retain the seven-quantity scope; use the corrected SI symbols and in-app keyed practice. Teacher approval is still required for the lab and scientific-method supplements. The proposed teacher key is `PHYS-LES-T1-W01-KEY-ASSESSMENT.md`.

## 3. First Term Week Two

The rendered source confirms:
- the 20 m table-tennis-board example is implausible and has been removed/reworded in the replacement;
- 17.00 mm + 0.11 mm = 17.11 mm = 1.711 cm, not 17.1 mm;
- the internal-diameter MCQ omits vernier callipers;
- “dimension of a compound” is ambiguous;
- the SI question contains three visible blanks, not 98 printed “undefined” tokens;
- some source scale drawings are too low-resolution or absent to key reliably.

The replacement lesson has clear original reading examples: 17.11 mm, 4.37 cm and 1.76 cm. Ten MCQs and six theory replacements are now included in student practice with answers and marking. The external textbook reading has been replaced by the three in-app lessons.

**Recommended disposition:** keep pipette and hydrometer as clearly labelled extension/instrument-selection knowledge; keep the force-dimension item as retrieval from Week One; include volume because it appears in the scheme/outline; replace the ambiguous and unreadable source questions with the new keyed practice. The proposed teacher key is `PHYS-LES-T1-W02-KEY-ASSESSMENT.md`.

## 4. Revision and examination weeks

The registered original term documents contain ten teaching-week bodies. The preamble/scheme markers for revision/examination do not have corresponding teaching bodies in the original source archive.

**Recommended disposition:** preserve revision/examination markers as non-teaching records. Do not invent additional week lessons until the owner supplies the intended plan or confirms that the markers are placeholders.

## 5. Source extraction strategy

The original .doc extraction loses or flattens some equation objects, superscripts, figures and control characters. The rendered PDFs show that several supposed missing formulas/figures are present in the original document. The correct interpretation is:
- preserve original .doc bytes and the text extraction as provenance;
- use rendered PDF pages to inspect embedded equation/figure objects;
- never publish U+001F or the extractor's “undefined” representation as student text;
- use typed equations and clearly labelled original SVG replacements in lessons;
- improve the repository-wide extractor later to export embedded images/equations and retain page/anchor locators.

This is a foundation-wide decision, not a Physics content correction.

## 6. Content approval and verification

There are 33 lesson objects and 30 assets. Every lesson/asset is still PENDING approval and DEFERRED verification. The teacher should review the lesson content and diagrams and record an approval reference per lesson/asset, or return defects. Final verification still needs the full source regression, importer/database rehearsal and student-device acceptance.

**Bottom line:** authoring, source indexing, visual inventory, coverage mapping and the Week Two correction binding are complete. The remaining blockers are genuine owner/teacher decisions and final verification; they must not be silently converted to approvals.
