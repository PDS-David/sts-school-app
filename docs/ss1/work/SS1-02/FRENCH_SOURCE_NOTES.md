# French authoring checkpoint — 27 October 2026

The three full extracts were read. Original bytes are private and match the manifest.
The package contains independently authored equivalents, not edited originals.
No test, typecheck, compiler/importer run or app/device check was performed.

## Source interpretation already established

- T1 has teaching weeks 1–9. Its profession table, accent drawings, routine and
  embedded agreement/disagreement activity all need explicit treatment.
- T2 has an opening scheme followed by weeks 1–9. Scheme week 7 says imperfect,
  while body week 7 is air travel; body week 8 supplies imperfect. Scheme week 9
  says future but body week 9 is passé composé. The new future lesson fills the
  identified objective without rewriting source week numbers.
- T3 has ten teaching weeks; the opening scheme lists revision/examination.
  The cassette/CD exam activity has no supplied recording or complete identity.
  Its new library dialogue is original, not a fabricated examination passage.
- Geography: all 38 unique named countries have UNData capital/currency references
  in french_country_facts.json. The repeated Morocco entry is not a separate
  country. Country language usage is not equated with sole official status.
- Source profession strings `computateur` and `couteur` remain unresolved;
  no guessed profession is presented as their confirmed correction.

## Visual/object findings (not app-display verification)

T1 contains 73 Word drawing occurrences with 73 fallback pict representations;
these are alternate representations, not 146 independent illustrations. There
are no word/media images. Direct-body paragraph locators below use document.xml,
counting w:p children of w:body, not mammoth lines.

- Paragraphs 24, 31–47, 53–67, 72–74: country/demonym list separators or grouping.
- Paragraphs 150–160 and 188, 190–197: bilingual auxiliary-verb list separators.
- Paragraphs 234, 244, 250–255, 257, 264: accent/diacritic drawings, including
  grouped shapes. The rendered page 9 was inspected at readable resolution.
  The drawings add marks that plain extraction omits. The replacement teaches
  actual Unicode letters (é, è, â, ê, î, ô, û, ç, ï, ë); it does not pretend the
  original blank extracted slots contained those characters.
- Paragraph 278 has a punctuation drawing, paragraph 347 a routine-section
  drawing. These and the separator groups still require visual dispositions.
- The profession table is textual; it is not an embedded image.
- T2 contains three OMML objects: p66 `ɲ`, p67 `Ↄ`, p77 `ḝ`. Mammoth omits their
  contents. The source's p67 combines incompatible examples (`peigne, camping`),
  so the glyph is not silently interpreted as a single known consonant. The new
  sound lesson explicitly teaches /ɲ/ with montagne and other clear examples.
- T3 has no inline/anchored drawings or media images in document.xml.

## Required continuation before French completion

1. Complete visual dispositions for every T1 separator/shape group and T2 OMML
   context; a PDF conversion alone is not visual inspection.
2. Add explicit scheme-level coverage for every objective, not just a week-body
   link. In particular retain oral observation separately from written coverage,
   and account for revision/examination scheme markers and the T1 final orphan
   `a silent h.` fragment.
3. Reconcile full replacement scope with every source exercise. Do not infer
   exhaustive equivalence from similar headings. Current references are authored
   expected bodies; later real-parser checks must prove their identities.
4. Keep the two ambiguous profession strings and missing exact exam recording
   as precise unresolved items; do not let them block work on other subjects.
5. Add future full-source parser/asset regression checks. The package test file
   is written but not run. It currently checks schema/hash/guard relationships
   and specific corrected examples, not educational completeness.
6. Get content approval and later verification through their separate stages.
   The package is PENDING and cannot be called delivery-ready.

## Authorship and references

`author_french.py` contains the lesson prose, complete questions and marking
criteria. Public reference URLs are included in each lesson. Their excerpts were
consulted on 27 October 2026; no third-party passage, audio or image was copied
into a lesson. Country facts are separately recorded with exact profile URLs.
The new dialogues and narrative examples are explicitly fictional/original.
