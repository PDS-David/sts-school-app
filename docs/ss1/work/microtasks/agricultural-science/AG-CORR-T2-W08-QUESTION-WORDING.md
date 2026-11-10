# AG-CORR-T2-W08-QUESTION-WORDING — Agricultural Science, Second Term Week Eight

Status: **BLOCKED — intended wording verified; delivery binding awaits an original lesson.**

## Source identity and exact locators

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Relevant direct-body blocks:
  - Scheme of work block 12: “Rock Weathering and Process of Rock Weathering”
  - Topic block 518: “TOPIC: ROCK WEATHERING”
  - Teaching heading block 527: “PROCESSES OF ROCK WEATHERING”
  - Evaluation block 568: “What are the processes of rock formation?”
  - General evaluation block 573: “What are the processes of rock formation?”
- Recomputed UTF-8 block SHA-256:
  - Block 12: `74b333be9d324f105edec4322c750ad1245abe57d9f5480257ef73fda17c9bb3`
  - Block 518: `9c94d3b2a51b6b8b34c75e8dc64989735a65279246d40964f74ca27aa122e6ba`
  - Block 527: `26ac0721ccf0bccf628473e0ce6291cd0524c3d87db452748a5702b22177239c`
  - Blocks 568 and 573: `76a611669bbbdbecf253d84c312d7b03e74e36d27a18907ccc5c07247e97e3bd`

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Finding

The two assessment questions at blocks 568 and 573 should ask for the **processes of rock weathering**, not the processes of rock formation.

This is supported by the source's own scheme, topic and teaching content:
- Week Eight scheme item 12 is “Rock Weathering and Process of Rock Weathering.”
- The Week Eight topic is “ROCK WEATHERING.”
- The teaching heading is “PROCESSES OF ROCK WEATHERING.”
- Block 528 explicitly introduces the “processes of soil formation (rock weathering)” and lists physical, chemical and biological processes.
- The previous week's topic is separately “Rock Formation and Types” (scheme block 11). “Rock formation” therefore belongs to the preceding topic, not the Week Eight weathering assessment.

The phrase “processes of rock formation” is a likely carry-over from the preceding rock-formation lesson. It is not an accurate description of the three processes taught in Week Eight: physical, chemical and biological weathering are processes by which rocks are broken down, not the processes by which igneous, sedimentary and metamorphic rocks are formed.

A parallel Week Eight SS1 Agricultural Science note on Ecolebooks reproduces the same “rock formation” wording in its evaluation, so that copy does not independently resolve the defect. Another SS1 Second Term parallel copy on Scribd has “processes of rock weathering” in its first evaluation but repeats “rock formation” in its general evaluation, illustrating the same inconsistent carry-over. The source's own scheme and teaching headings remain the strongest direct evidence.

## Recommended delivery correction

For both blocks 568 and 573, replace:

“What are the processes of rock formation?”

with:

“What are the processes of rock weathering?”

This is a delivery-only wording correction. It preserves the question's intent and aligns the assessment with the Week Eight scheme, topic and teaching content. The original DOCX text remains unchanged.

## Why no delivery correction is bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating a delivery-correction record now would require fabricated identifiers.

Therefore:
- The intended wording is **verified** by the scheme, topic and teaching content.
- No source bytes or source transcript are changed.
- No `delivery_corrections` record is created yet.
- The binding remains blocked until an original Week Eight lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T2-W08-QUESTION-WORDING` is updated with the exact correction and binding gate.

## Sources consulted

1. **Original source document**, Second Term scheme and Week Eight teaching blocks 12, 518, 527–530. Direct evidence that the Week Eight topic and taught processes are rock weathering.
2. **Ecolebooks Nigeria**, “Week 8 – SS1 Second Term Agricultural Science Notes.” Parallel note reproduces the Week Eight topic, content and evaluation; its evaluation also repeats “rock formation,” so it is evidence of a propagated copy error rather than an independent correction. https://ecolebooks.com/nigeria/posts/week-8-ss1-second-term-agricultural-science-notes/
3. **Scribd**, “SS1 Agricultural Science Second Term Notes.” A parallel version uses “processes of rock weathering” in one evaluation but repeats “processes of rock formation” in the general evaluation, supporting the interpretation that the latter is a carry-over. https://www.scribd.com/document/599453940/2ND-TERM-S1-AGRICULTRAL-SCIENCE
4. **Edudelight**, “Lesson Note on Agricultural Science SS1 Second Term.” Reproduces the same Week Eight teaching content and the “rock formation” evaluation wording. https://edudelight.com/lesson-note-on-agricultural-science-ss1-second-term/

## Changes and remaining gate

- Added this correction investigation record with source/member/block hashes.
- Verified the intended question wording from the source's Week Eight scheme, topic and teaching heading.
- Determined that blocks 568 and 573 should both use “processes of rock weathering.”
- Updated the existing package question-wording open item with the verified correction and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T2-W08-QUESTION-WORDING` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
