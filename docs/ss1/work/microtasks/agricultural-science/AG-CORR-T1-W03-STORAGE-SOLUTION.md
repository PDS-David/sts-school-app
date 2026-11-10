# AG-CORR-T1-W03-STORAGE-SOLUTION — Agricultural Science, First Term Week Three

Status: **BLOCKED — corrected wording recovered, delivery binding awaits an original lesson.**

## Source identity and exact locator

- Source ID: `SS1-SRC-7aa642b0085b`
- Archive member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`
- Exact locator: `word/document.xml`, zero-based direct-body block 235, paragraph.
- Exact block SHA-256 (UTF-8 text): `ee1402a5ed7bfb9f2941dcfdcf12c2c57e6c4babcf4fa0e6ca1121ba6734bfbd`
- Verbatim source text: “(b) Government should such as millers and threshers should be made available to farmers at subsidized rate.”

The archive and member hashes were independently recomputed from the Library copy. The DOCX block hash matches the Week Three inventory. The archive contains one First Term SS1 Agricultural Science DOCX member; no second byte-level copy of that member exists inside the archive.

## Parallel-copy and internal-source evidence

The intended meaning can be recovered from parallel SS1 First Term Agricultural Science lesson notes:

1. **Lessonnotes.com**, SS1 First Term, “Problems of Agricultural Development and Possible Solutions,” Week 2, section “Inadequate storage and processing facilities,” solution 2: “Governments should make processing facilities such as millers and threshers available to the farmers at subsidized rate.” This is a parallel school lesson note with the same topic and solution sequence. https://lessonnotes.com/v2/senior-secondary-school-1/lesson-notes-for-senior-secondary-1-1st-term-week-2-agricultural-science-topic-is-roblems-of-agricultural-development-and-possible-.html
2. **Lessonnotes.ng**, “Problems of Agricultural Development and Possible Solutions – SS1 Agric Science,” section “Inadequate storage and processing facilities,” solution “Processing machines: millers and threshers should be supplied at a subsidised rate.” https://lessonnotes.ng/ss1/agricultural-science/problems-of-agricultural-development-and-possible-solutions/
3. **Internal corroboration in the original DOCX:** block 432 describes “processing facilities such as millers, shellers”; block 500 describes “processing facilities such as grinders, millers.” These later statements confirm that millers and related equipment are processing facilities/machines in the same source.
4. **Contrasting copy:** Edudelight's full SS1 First Term Agricultural Science note reproduces the same malformed sentence at its Week 3 storage/processing section. It is not a corrected parallel and is recorded only as evidence that the error has propagated in some copies. https://edudelight.com/lesson-note-on-agricultural-science-ss-1-first-term/

The two corrected parallel notes agree on the intended proposition: government should make processing machines/facilities, including millers and threshers, available to farmers at a subsidised rate. The original source's later blocks independently support the equipment category. The missing words can therefore be repaired without inventing a new policy or changing the substantive meaning.

## Recovered correction candidate

**Recommended replacement sentence:**

“Government should make processing machines such as millers and threshers available to farmers at a subsidised rate.”

This is a grammatical repair of the source sentence, preserves the government/facilities/millers-and-threshers/farmers/subsidy meaning, and is supported by both parallel notes. It is not a claim that the original DOCX contained this exact sentence; the original wording remains preserved.

## Why no delivery correction is bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires `source_id`, `source_sha256`, `source_lesson_id`, `body_sha256`, `replacement_id`, `reason` and evidence. The contract requires a correction to resolve an exact source ID/hash and original lesson ID/body hash to one replacement supplement from the same subject and term.

There is no original lesson row, lesson ID, lesson body hash or replacement lesson ID to bind to. Creating a correction record now would require fabricating those identifiers or attaching the correction to a lesson that does not exist. Neither is permitted. Therefore:
- The **source wording is resolved**; this is not an unresolved transcription question.
- The **delivery correction candidate is verified** and ready for use when the Week Three lesson is authored.
- The **binding remains blocked** until an original lesson and its body hash exist, and a valid replacement lesson is authored/identified.
- No `delivery_corrections` record has been created and no source bytes have been changed.

The existing package open item `AGRICULTURAL-SCIENCE-T1-W03-STORAGE-SOLUTION` is updated to record the recovered wording and the exact lesson-binding gate. Queue item `AG-CORR-T1-W03-STORAGE-SOLUTION` is marked `BLOCKED` for that same reason.

## Sources and provenance notes

- The parallel lesson notes are secondary educational copies, not official curriculum publications. They are used as textual parallel evidence, not as authoritative agricultural science references.
- The original DOCX itself supplies the subject, section context and internal references to millers/shellers/grinders as processing facilities.
- The correction does not alter or overwrite the archived source sentence.
- No missing phrase has been fabricated: the replacement proposition is attested in the parallel copies.

## Changes and remaining gate

- Added this correction investigation record.
- Recomputed the archive, member and block hashes.
- Updated the existing storage-solution open item with the parallel-copy evidence and exact binding gate.
- Left `delivery_corrections` unchanged because there is no original lesson row or body hash.
- Marked the queue item `BLOCKED`: **author/identify the original Week Three lesson and its body hash, then create a same-subject/same-term replacement lesson before binding this correction.**
- No lesson content, source bytes, other package rows, importer/compiler, schema, assets or other subject were changed.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
