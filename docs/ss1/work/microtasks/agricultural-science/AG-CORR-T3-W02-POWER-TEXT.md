# AG-CORR-T3-W02-POWER-TEXT — Agricultural Science, Third Term Week Two

Status: **BLOCKED — both intended phrases verified in a parallel copy; delivery binding awaits an original lesson.**

## Source identity and exact locators

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Exact direct-body locators:
  - Block 107: animal power/animal traction description contains “Pair of working bullyolked together…”
  - Block 138: mechanical-power disadvantage says “High capital investment is involved in the accusation of machineries.”
- Recomputed UTF-8 block SHA-256:
  - Block 107: `bd33c0597ced9c82966cb08843c45a934b49f665708cc7d9d1e16d8e1627b883`
  - Block 138: `81e76adb4141613aebccd848329d131f52d39d72a9a794b38096ea628369b9fe`

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Parallel-copy evidence

The **Lessonnotes.ng** parallel Week Two SS1 Agricultural Science note, “Sources of Farm Power,” contains the corresponding corrected phrases in the same topic structure:

- Animal traction: “Pair of working bullocks yoked together, camels, donkeys etc., are common animals normally used.”
- Mechanical-power disadvantage: “High capital investment is involved in the acquisition of machinery.”

This is a close parallel copy of the same Week Two lesson: it follows the same sequence of farm-power sources, reproduces the same surrounding descriptions and advantages/disadvantages, and preserves the same distinctive examples. It therefore supplies direct textual evidence for both intended phrases.

Other copies (Classnotes.ng, Ecolebooks and Edudelight) reproduce the corrupted spellings “bullyolked” and “accusation of machinery,” so they are not used as correction evidence.

## Findings and recommended delivery corrections

### 1. “bullyolked” (block 107)

**Finding:** The phrase is a fused/malformed rendering of **“bullocks yoked”**. A bullock is a working ox, and a pair of bullocks can be yoked together for animal traction. The parallel Week Two lesson gives the exact phrase “Pair of working bullocks yoked together…”

**Recommended delivery wording:**

“Pair of working bullocks yoked together, camels, donkeys, etc., are common animals normally used.”

This restores the missing word boundary and the intended animal name. It does not change the source's list of animals or the meaning of the paragraph.

### 2. “accusation of machineries” (block 138)

**Finding:** The intended phrase is **“acquisition of machinery.”** The parallel Week Two lesson uses that exact wording in the same mechanical-power disadvantage. “Accusation” is not semantically appropriate in a sentence about high capital investment, and “machinery” is the standard uncountable noun in this construction.

**Recommended delivery wording:**

“High capital investment is involved in the acquisition of machinery.”

This is a direct parallel-copy correction, not a newly invented phrase.

## Why no delivery corrections are bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating delivery-correction records now would require fabricated identifiers.

Therefore:
- Both intended phrases are **verified** by a close parallel copy.
- No source bytes or source transcript are changed.
- No `delivery_corrections` records are created yet.
- The binding remains blocked until an original Week Two lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T3-W02-POWER-TEXT` is updated with the exact replacement wording and this binding gate.

## Sources consulted

1. **Lessonnotes.ng**, “Sources of Farm Power – SS1 Agricultural Science Lesson Note.” Close parallel copy with the corrected phrases “Pair of working bullocks yoked together…” and “High capital investment is involved in the acquisition of machinery.” https://lessonnotes.ng/ss1/agricultural-science/sources-of-farm-power/
2. **Classnotes.ng**, “Farm Power.” Reproduces the same lesson sequence but retains the corrupted “bullyolked” and “accusation of machinery” wording; used only to document the propagated error. https://classnotes.ng/lesson/farm-power-agriculture-sss1/
3. **Ecolebooks Nigeria**, “Week 2 – SS1 Third Term Agricultural Science Notes.” Reproduces the corrupted animal-power wording; used only to document the propagated error. https://ecolebooks.com/nigeria/posts/week-2-ss1-third-term-agricultural-science-notes/

## Changes and remaining gate

- Added this correction investigation record with exact source/member/block hashes.
- Verified “bullyolked” → “bullocks yoked” and “accusation of machineries” → “acquisition of machinery” against the close parallel Week Two lesson.
- Updated the existing package power-text open item with the verified replacements and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T3-W02-POWER-TEXT` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
