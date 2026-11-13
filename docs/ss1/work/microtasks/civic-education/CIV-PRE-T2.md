# CIV-PRE-T2 — Civic Education (2nd Term preamble and scheme)

Status: IMPLEMENTED — TESTING DEFERRED. Preamble/scheme indexing only; no scheme row was converted into a lesson.

## Source identity

- Source ID: `SS1-SRC-21ddf6abc2dc`
- Member: `SSS 1/2nd Term SS1_/CIVIC.docx`
- Member SHA-256: `1e2505c4b9e197087a55e0532c3a6efc7c08765bf1d86697c6720d253d22cdef`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Existing Mammoth 1.12.2 locator: lines 1–74; scheme lines 7–73.
- Existing full raw-text SHA-256: `2fa8d04c6b9f241c5e2ef2a51cd6f6f9a2d925d222579eb4abb3f2c037589c26`.
- Existing scheme SHA-256: `0919ec7d70498d96522d01ae41e720c39dc4aa0523e2f6c094206b193816eb53`.

## Opening header

| Mammoth line | Raw source text |
|---:|---|
| 1 | `TERM:\t2ND TERM` |
| 3 | `SUBJECT:\tCIVIC EDUCATION` |
| 5 | `SS 1` |
| 7 | `SCHEME OF WORK` |
| 9 | `WEEKS [tabs] TOPICS` |

The source's scheme is ordinary paragraphs, not a native Word table. Ten of the paragraphs carry Word auto-numbering whose numbers are not present in the raw paragraph text. Preserve the numbering metadata/paragraph order; do not flatten the scheme into one string.

## Scheme topic groups and subtopics (Mammoth lines 11–73)

1. **Revision of Last Term’s Work** (line 11).
2. **Voter Education** (line 13): Meaning of voting (15); Voters Registration and related rules (17); Voter education (19); Process of voting (21); Importance of voting (23).
3. **Election** (line 25): Meaning (27); Importance of election (29).
4. **Electoral Bodies in Nigeria** (line 31): INEC, SIEC (33); Composition and roles (35–37).
5. **Free & Fair Elections** (line 39): Meaning (41); Importance (43).
6. **Electoral malpractice** (line 45): Meaning & Forms (47); Causes (49); Ways of preventing electoral malpractice (51).
7. **Planning for results** (line 53): Need for planning (55); Benefits (57); Consequences of not planning (59).
8. **The current Nigerian constitution** (line 61): Meaning (63); Sources of Nigerian constitution (64).
9. **The current Nigerian / Constitution** (split over lines 65–67): Features (69); Functions (71).

The final scheme row is line 73: `12 & 13 [tabs] Test & Examination`.

## Parser/body boundary

- The scheme is not teaching text; it is a preamble outline.
- There is no teaching text before the actual WEEK ONE marker (line 75 in the existing Mammoth inventory).
- The scheme's WEEKS column contains no week numbers except the final 12 & 13 Test & Examination row.
- The ninth topic label is split across two lines: “The current Nigerian” / “Constitution”. Preserve the split and do not merge it with the preceding “The current Nigerian constitution” topic group.
- No lesson, coverage, marker rule, correction or answer was added.

## Boundary

The original source remains authoritative. This transcription is for source review; it is not a replacement lesson or approval record.
