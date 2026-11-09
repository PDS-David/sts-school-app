# AG-CORR-T3-W01-TOOL-NAMES — Agricultural Science, Third Term Week One

Status: **BLOCKED — intended tool name verified; delivery binding awaits an original lesson.**

## Source identity and exact locators

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Exact direct-body locators:
  - Block 36: tool list contains “28. Hand trowel”.
  - Block 67: “Which of these farm tools is used for transplanting of seedling? A. Go-to-hell B. Shears C. Hand Towel”
  - Block 66: a separate earlier MCQ uses “Hand towel” as an obviously incorrect distractor for a question whose correct answer is garden fork.
- Recomputed UTF-8 block SHA-256:
  - Block 36: `28bfedef98dd4d82e8b4f6500a7edc48557034eae883aac5b663e5e0c054736f`
  - Block 67: `4ba8749f05ebe9a294043f9dd791b2f18140e3bec811d9ebf19c4387388a9745`

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Finding

The intended option at block 67 is **Hand trowel**, not “Hand Towel.”

The source's own tool list at block 36 contains “Hand trowel” as one of the 30 farm tools. A hand trowel is a small hand tool used for digging small planting holes, transplanting seedlings and working around plants. A hand towel is a cloth and is not a farm tool. The MCQ asks specifically for the tool used in transplanting seedlings, so “Hand Towel” is a clear spelling/transcription error for “Hand Trowel.”

External horticulture and extension references confirm the hand trowel's use for transplanting seedlings and small plants. Parallel copies of the same SS1 Week One note on Ecolebooks, EduPodia and Lessonotes reproduce “Hand Towel” at the same MCQ, so those copies do not independently correct the defect. The original source's own list at block 36 is the direct internal evidence.

## Recommended delivery correction

At block 67, replace option C:

- Source: `C. Hand Towel`
- Recommended delivery wording: `C. Hand Trowel`

This is a delivery-only spelling correction. Do not alter the original DOCX or source transcript.

**Scope restraint:** Block 66 also contains “Hand towel” as a distractor in a different question. Its intended distractor wording is not established by this task, and it is not the correct answer to that question. Do not change block 66 under this correction.

## Why no delivery correction is bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating a delivery-correction record now would require fabricated identifiers.

Therefore:
- The intended tool name is verified by the source's own list and standard horticultural use.
- No source bytes or source transcript are changed.
- No `delivery_corrections` record is created yet.
- The binding remains blocked until an original Week One lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T3-W01-TOOL-NAMES` is updated with the correction and this exact binding gate.

## Sources consulted

1. **Original source document**, Third Term Week One tool list, block 36. Direct evidence that “Hand trowel” is a taught farm tool.
2. **University of Minnesota Extension**, “Garden tools.” Describes hand trowels as small hand tools used for planting and transplanting. https://extension.umn.edu/planting-and-growing-guides/garden-tools
3. **University of Maryland Extension**, “Tools for the Vegetable Garden.” Identifies hand trowels as tools for transplanting small plants and seedlings. https://extension.umd.edu/resource/tools-vegetable-garden/
4. **Ecolebooks Nigeria**, “Week 1 – SS1 Third Term Agricultural Science Notes.” Parallel copy reproduces “Hand Towel” at the transplanting MCQ and “Hand trowel” in the tool list; used as evidence of a propagated error, not as correction authority. https://ecolebooks.com/nigeria/posts/week-1-ss1-third-term-agricultural-science-notes/
5. **EduPodia**, “Agricultural Science Lesson Note for Third Term SS1.” Parallel copy reproduces the same “Hand Towel” option. https://edupodia.com/2022-agricultural-science-lesson-note-for-third-term-ss1/

## Changes and remaining gate

- Added this correction investigation record with exact source/member/block hashes.
- Verified “Hand Towel” → “Hand Trowel” at MCQ block 67 using the same-source tool list and extension references.
- Explicitly left block 66 unchanged because “Hand towel” is a distractor there and no correction is required by this task.
- Updated the existing package tool-names open item with the verified correction and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T3-W01-TOOL-NAMES` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
