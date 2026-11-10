# AG-CORR-T3-W10-CATTLE-TERMS — Agricultural Science, Third Term Week Ten

Status: **BLOCKED — the “pig houses” correction is verified; delivery binding awaits an original lesson.**

## Source identity and exact locator

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Exact direct-body locator: block 1210, cattle-mange section.
- Block SHA-256 (UTF-8 text): `b70c0f1cbd0f4a64c2b7e8f4f19f7cdbbb4c1b0db3cce3b7e6b4d02a3a9e6a01`
- Verbatim relevant source wording: “...maintain proper hygiene and sanitation in pig houses.”

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Verified correction

The surrounding passage is about **cattle mange**: it identifies mange mites in cattle, describes their spread among cattle and discusses cattle treatment. The phrase “pig houses” is a cross-topic copy error, likely carried over from the earlier pig-housing lesson in the same source document. The relevant environment is cattle housing, sheds or pens.

Merck Veterinary Manual's cattle-mange guidance describes mite transmission through direct contact and, for some mites, contaminated environments/fomites. Hygiene and sanitation of cattle housing are therefore relevant to cattle-mange prevention/control; hygiene in pig houses is not the correct subject in this cattle paragraph.

**Recommended delivery-only correction:**

- Source: “maintain proper hygiene and sanitation in pig houses.”
- Replacement: “maintain proper hygiene and sanitation in cattle housing.”

This correction changes only the animal-housing referent. It does not rewrite the original source or add treatment procedures.

## “Rational grazing” is not a correction

The related source term at block 1188, “rational grazing,” must **not** be changed to “rotational grazing.” The completed fact review `AG-FACT-T3-W10-CATTLE-TERMS` verified that rational grazing is a recognised term, described by FUNAAB as an elaboration of rotational grazing associated with André Voisin. The Week Ten assessment asks for rotational grazing, so both terms should be taught and distinguished in a lesson supplement. This is an assessment-alignment/content task, not a spelling correction.

## Why no delivery correction is bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating a delivery-correction record now would require fabricated identifiers.

Therefore:
- “Pig houses” → “cattle housing” is a verified correction candidate.
- “Rational grazing” remains unchanged; it is a legitimate term and requires teaching alignment, not a correction.
- No source bytes or source transcript are changed.
- No `delivery_corrections` record is created yet.
- The binding remains blocked until an original Week Ten lesson and its body hash exist and a valid replacement lesson is authored/identified.

## Sources consulted

1. **Completed project fact review**, `AG-FACT-T3-W10-CATTLE-TERMS.md`. Establishes that “rational grazing” is a valid term, not a typo, and supports a delivery-only correction from “pig houses” to “cattle housing.”
2. **Merck Veterinary Manual**, “Mange in Cattle,” full review March 2023, last updated September 2024. Describes cattle mange mites and transmission via direct contact and contaminated environments/fomites for certain mites. https://www.merckvetmanual.com/integumentary-system/mange/mange-in-cattle
3. **Original source document**, Week Nine pig-housing content and Week Ten cattle-mange block 1210. The earlier pig section provides the cross-topic source context; block 1210 itself is embedded in the cattle-mange passage.

## Changes and remaining gate

- Added this correction-binding investigation record with exact source/member/block hashes.
- Verified “pig houses” → “cattle housing” from the surrounding cattle-mange context and veterinary guidance.
- Explicitly excluded “rational grazing” from corrections; the term remains valid and its assessment mismatch belongs in a lesson supplement.
- Added/updated the package open item `AGRICULTURAL-SCIENCE-T3-W10-CATTLE-TERMS` with the correction candidate and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T3-W10-CATTLE-TERMS` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
