# CHEM-IDX-T1A-OPEN — Chemistry First Term opening and scheme index

Status: **IMPLEMENTED_TESTING_DEFERRED** (source indexing only; not approved or verified).

## Source identity and locator
- Source: `SS1-SRC-58b4a44c3afa`.
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`.
- Member SHA-256: `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`.
- Whole Mammoth 1.12.2 extracted text: 55,382 characters, 2,129 lines; SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702`.
- Opening range: lines 1-89; SHA-256 `d01fc682173f614403ea120cd39a74318967565bb9f054c12bec8f916f5f0722`.
- Locator rule: Mammoth `extractRawText`; split on newline, 1-based lines; hash UTF-8 lines joined with newline, no trailing newline. Full inventory: `CHEM-INV-T1A.md`.

## Opening blocks
| Lines | Source text / object | Disposition |
|---|---|---|
| 33 | FIRST TERM E-LEARNING NOTE | Document title; not a lesson objective. |
| 37 | SUBJECT:  CHEMISTRY + seven tabs + CLASS: SS1 | Registered subject/class header; preserve exact whitespace. |
| 41 | SCHEME OF WORK | Preamble heading. |
| 45 | WEEK / TOPIC | Scheme column heading. |
| 47-71 | Thirteen scheme topic rows | Indexed below; extracted rows carry no week numbers. |
| 75 | REFERENCE MATERIALS | Bibliographic heading. |
| 77-85 | Five named works | Preserve as source bibliography; no edition/publisher/reuse rights inferred. |

## Scheme rows and body mapping
| Row | Line | Exact scheme topic | Body mapping / discrepancy |
|---:|---:|---|---|
| 1 | 47 | INTRODUCTION TO CHEMISTRY | WEEK ONE |
| 2 | 49 | LABORATORY FAMILIARIZATION | WEEK TWO |
| 3 | 51 | NATURE OF MATTER | WEEK THREE |
| 4 | 53 | ELEMENTS & SYMBOLS, VALENCY | WEEK FOUR |
| 5 | 55 | COMPOUNDS AND MIXTURES | WEEK FIVE |
| 6 | 57 | STANDARD SEPARATION TECHNIQUES FOR MIXTURES | WEEK SIX title omits “FOR MIXTURES”. |
| 7 | 59 | PARTICULATE NATURE OF MATTER | WEEK SEVEN |
| 8 | 61 | IUPAC NOMENCLATURE OF CHEMICAL COMPOUNDS | WEEK EIGHT |
| 9 | 63 | ATOMIC NUMBER, MASS NUMBER, ISOTOPES AND CALCULATIONS | WEEK NINE says “RELATIVE ATOMIC MASSES” instead of “MASS NUMBER”. |
| 10 | 65 | STRUCTURE OF THE ATOM: ORBITALS AND ELECTRONIC | WEEK TEN |
| 11 | 67 | STRUCTURE OF   THE ATOM | WEEK TEN is the only matching body; two scheme rows map to one body and remain unresolved for scope. |
| 12 | 69 | REVISION | No body; do not attach to Week Ten. |
| 13 | 71 | EXAMINATION | No body, paper or marking scheme exists. |

The rows have no extracted week numerals. The unindented row 11 is a source formatting anomaly, not a week marker. No weekly numbering is inferred from row order.

## Structural objects
The DOCX contains one empty 1x1 Word table at body child 2, used for cover layout; it contains no text or teaching material. The comparison tables, element/symbol tables, valency rules, radical table and energy-level table are tab-separated paragraph text, not Word tables; see `CHEM-INV-T1A.md` for exact ranges and formatting evidence.

## Scope boundary
This index records the opening and source scheme only. It does not author lessons, coverage, rules, corrections, answers or assessment materials. Scheme rows 12-13 and the two-row-to-one-body mismatch remain for the separate marker/scheme disposition item `CHEM-MARK-T1A-REVEXAM`. Source wording and whitespace are not altered.

## Remaining
Owner/source alias confirmation, teacher content approval and later verification remain separate states. No test, importer, database or device run was performed; testing remains deferred by owner.
