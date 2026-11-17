# CHEM-PRES-T2-TABLES — Chemistry Second Term table preservation

Status: **IMPLEMENTED_TESTING_DEFERRED** (table inventory and structural disposition; no table normalisation or approval).

## Source identity
- Member `SSS 1/2nd Term SS1_/CHEMISTRY.docx`; SHA-256 `236b1bdb2e752f652dd22e8f2df831279237e669ceeec356825cecc4ef8911e7`.
- Whole `w:body` blocks 0-2220; SHA-256 `60db0c49b150ebdab160d6d3ee7cb86629788cd1a73c58ace7f1cef831f74c72`.
- Locator: direct child of `w:body` in `word/document.xml`, 0-based. Text is concatenated `w:t` runs in order; tabs omitted; no normalisation.

## Seven top-level tables
| Block | Shape | Cell content / disposition |
|---:|---|---|
| 963 | 3×3 | Zinc Oxide mass data. Header plus Sample 1: 20.0 g / 16.22 g; Sample 2: 26.4 g / 21.7 g. Preserve figures, units and row pairing exactly. |
| 991 | 3×3 | Sodium/chlorine before-and-after electron configurations. Teaching table. |
| 1000 | 3×3 | Magnesium/oxygen before-and-after electron configurations. Teaching table. |
| 1006 | 3×3 | Magnesium/chlorine before-and-after electron configurations. Teaching table. |
| 1043 | 2×1 | One cell contains web article text headed “Covalent Bonds”; the other contains image9.gif showing ionic MgO/MgCl shell formation. This is a mixed text/image layout table and an explicit subject mismatch. Do not move either object. |
| 2201 | 2×1 | Empty layout wrapper; no teaching cells. |
| 2212 | 1×1 | Layout wrapper around 1,356 characters of Bunsen-burner prose with three bullet-numbered paragraphs. Preserve as text in a layout cell, not a data table. |

## Teaching data that exist only as raster images
- image11.png: compound-name/formula/structural-formula table.
- image14.png: kernel/mobile-electron table.
- image15.png: Na/Mg/Al metal-bond-strength table.
- image17.png: metal-properties table.
- image18.png: metal-properties diagram.

These are image-only source objects, not recovered text. Do not treat them as transcribed or replace them with guessed rows.

## Preservation decisions
Preserve all seven top-level table objects, their dimensions, cell order and mixed image/text structure. Do not flatten cells into unrelated lines, merge tables or normalize formula notation. The source inventory does not provide separate per-table XML hashes; the member and whole-body hashes above bind the source version, not each individual table.

No source text, cell value or table is changed. No approval or verification is claimed.
