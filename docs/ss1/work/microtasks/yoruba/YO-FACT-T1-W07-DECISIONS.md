# YO-FACT-T1-W07-DECISIONS — Evidence-based orthography and spelling decisions

Status: **IMPLEMENTED_TESTING_DEFERRED** for the EDE spelling/orthography strand; ASA and exact source-table issues remain open.

## Source identity
- School source: `SS1-SRC-48b641249e3b`; `YORUBA.docx`, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`.
- Week Seven: lines 1503-1684; SHA-256 `bfab796f499c382f7b0df35ae0cccafe235f26d7f6e845a93f43e763f54a7ef9`.
- EDE heading lines 1505/1507; source table approximately lines 1513-1639.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.

## Named subject-source decision
The working orthographic authority is the Joint Consultative Committee on Education's 1974 *Revised Official Orthography for the Yorùbá Language*. Tèmítọ́pẹ́ Olúmúyìwá (2013), “Yoruba Writing: Standards and Trends,” is used as a named scholarly analysis of that standard. F. O. Asahiah (2014) is used as a further scholarly reference for the alphabet, tone and syllabic nasal system. These are cited authorities; this record does not claim that any author personally reviewed this school document.

## Decisions
1. **Tone marks:** high = acute; low = grave; mid = unmarked in ordinary standard writing. Macron is not used as the ordinary mid-tone mark; caron is not adopted.
2. **Underdots:** use ẹ, ọ and ṣ where required. These are distinct letters, not decorative marks.
3. **Alphabet:** use the 25-letter standard set; gb is taught as a single consonant/digraph.
4. **Word division:** use standard separate forms such as ta ni, kí ni, wí pé, gẹ́gẹ́ bí, nítorí pé, jẹ́ kí and bí ó tilẹ̀ jẹ́ pé.
5. **Nasalised pronouns:** use standard forms such as fún un, nà án, dín in and pọn ọn.
6. **Older/new spelling pairs:** historical forms are labelled as older; learner-facing examples use standard forms. Eight documented examples are provided in the new EDE lesson.
7. **Ambiguous pair:** do not accept “Okorin → Okunrin” as a spelling change without inspecting the original table and confirming the intended lexical item. The forms may not represent the same word.
8. **Missing IFIYESI note:** do not invent the note or assign it to a row from table position alone. Recover the original source table and the authoritative explanation.

## Implemented teaching asset
Added `SUP-SS1-YORUBA-T1-W07-EDE-ORTHOGRAPHY` to `backend/src/db/ss1/subjects/yoruba.json`. It contains:
- standard alphabet and under-dotted letter distinctions;
- high, low and mid tone rules;
- syllabic nasal examples;
- eight documented old/standard spelling pairs with meanings;
- word division and nasalised pronoun forms;
- eight original practice questions with answers and marking (35 marks).

The lesson is a supplementary original lesson, not a verbatim replacement of the school's 5-row source table.

## Remaining source gaps
- Exact 5-row source table cell order, all 24 forms and incomplete fifth-row IFIYESI note remain open in `YORUBA-T1-W07-SOURCE-TABLE-ALIGNMENT`.
- The ASA strand's missing benefits paragraph still requires a named, approved source or an owner-approved scope decision. This record does not invent benefits or close the ASA task.
- Full Week Seven LITIRESO component heading is absent; no literature text is invented.

## References
- Nigeria, JCCE (1974), *Revised Official Orthography for the Yorùbá Language*.
- Olúmúyìwá, Tèmítọ́pẹ́ (2013), “Yoruba Writing: Standards and Trends,” https://doi.org/10.18533/journal.v2i1.50.
- Asahiah, F. O. (2014), https://scholar.oauife.edu.ng/sites/default/files/asahiah/files/thesis_-_copy.pdf.

This is a scoped EDE decision only. It does not certify the full Yoruba package or the ASA strand.
