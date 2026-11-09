# CHEM-MARK-T1A-REVEXAM — first-term scheme marker disposition

**Status:** IMPLEMENTED_TESTING_DEFERRED. The two rows are classified as scheme markers only; no revision or examination lesson, paper, answer key or marking scheme is invented.

## Source identity
- Source: `SS1-SRC-58b4a44c3afa`
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`
- Member SHA-256: `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`
- Extracted text SHA-256: `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702`
- Locator: mammoth 1.12.2 `extractRawText`, 1-based lines.

## Marker findings
| Scheme row | Source line | Disposition | Evidence |
|---|---:|---|---|
| REVISION | 69 | `classify_marker: REVISION` | Exists only in the scheme; there is no WEEK ELEVEN or later body, revision note or revision teaching passage. |
| EXAMINATION | 71 | `classify_marker: EXAMINATION` | Exists only in the scheme; there is no examination paper, marking scheme or examination body. |

The scheme has 13 rows but only ten body week labels. Scheme rows 10 and 11 both map to the one WEEK TEN body:
- Row 10: “STRUCTURE OF THE ATOM: ORBITALS AND ELECTRONIC” (line 65).
- Row 11: “STRUCTURE OF   THE ATOM” (line 67).
- One WEEK TEN marker/body begins at line 1896 and ends at 2129. No separate body exists for the second row.

## Package disposition
- Added two `classify_marker` source rules, each bound to the exact source ID and SHA-256.
- Added two `MARKER` coverage records with no lesson IDs.
- No lesson, delivery correction, asset, answer, marking scheme or revision content was created.
- Original scheme wording remains unchanged in the source archive.
- Testing, importer, database and device runs remain deferred by the owner.
