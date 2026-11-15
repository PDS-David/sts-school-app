# CHEM-PRES-T1A-FORMULAE — source-faithful chemical notation preservation

**Status:** IMPLEMENTED_TESTING_DEFERRED. This record specifies how the original chemical notation must be preserved. It does not normalise, correct or recreate the original DOCX runs.

## Verified source
- Source: `SS1-SRC-58b4a44c3afa`
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`
- Member SHA-256: `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`
- Extracted raw text SHA-256: `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702`
- The inventory records 168 superscript and 140 subscript runs in `word/document.xml`. Mammoth raw text flattens these runs; plain-text appearance is not a reliable representation of chemical notation.

## Notation and source locators to preserve
| Source line(s) | Flattened extraction | Required interpretation from run formatting |
|---|---|---|
| 925 | `H2`, `02` | H₂ and O₂ |
| 941 | `H20` | H₂O |
| 945 | `C02` | CO₂ |
| 949 | `Ca(NO3)2` | Ca(NO₃)₂ |
| 971, 975 | `S04` | SO₄ |
| 975 | `Na2S04` | Na₂SO₄ |
| 1951 | `n2` | n² |
| 1953–1969 | `2n2` | 2n² |
| 1957–1969 | `12 =1`, `22 = 4`, `32 = 9`, etc. | 1² = 1, 2² = 4, 3² = 9, etc. |
| 1957–1961 | `2-12`, `2-22` | 2 × 1² and 2 × 2² |
| 1697 | `ZXA` | stacked Z/A/X notation, not a three-letter symbol |
| 1703–1707 | flattened calcium example | mass number 40 over atomic number 20 beside Ca |

## Additional structured content to preserve
- Element/symbol tables: lines 627–697.
- Valency rules and examples: lines 765–791.
- Radical table: lines 793–819.
- Formula examples: lines 935–949.
- Formula-writing rules and worked examples: lines 953–987.
- Week Nine Z/A/X notation and calcium example: lines 1697–1707.
- Week Ten energy-level/sub-shell table: lines 1955–1969.
- Week Ten electron-configuration table: lines 2037–2077.

Preserve each table's original order, row/column relationships and run formatting. The source inventory notes that several apparent tables are tab-separated paragraphs rather than Word tables; retain them as ordered text/table data only after their original structure is verified. Do not convert the source into flattened text and then infer subscripts or superscripts from character position alone.

## Integrity and correction boundary
- Original bytes and formatted runs remain in the archived DOCX. This note does not reproduce the binary source or claim that a replacement rendering has been generated.
- Any formula, valency or nomenclature correction must be a separate delivery correction with the original source wording and hash retained.
- No lesson, coverage, source rule, correction, asset or answer is created by this preservation item.
- No tests, typechecks, importer, database or device runs were performed; testing remains deferred by the owner.
