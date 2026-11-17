# Yorùbá SS1 — Orthography and Tone-Marking Style Guide

**Status:** Draft editorial standard for the SS1 Yoruba implementation. Based on the JCC-approved 1974 orthography described in the National Language Centre manual edited by Professor Ayọ Bamgbóṣé. It is not yet a school-approved policy. Apply it consistently to newly authored supplements; preserve original source files unchanged.

## 1. Governing reference

National Language Centre, *Orthographies of Nigerian Languages, Manual I*, Yoruba Orthography by Professor Ayọ Bamgbóṣé, pp. 43–54. The manual records that the Joint Consultative Committee on Education adopted the revised Yoruba orthography in June 1974 for use by Ministries of Education and WAEC examinations.

The manual is the default standard for the SS1 draft materials unless the school's Yoruba subject reviewer records a more specific local decision.

## 2. Yorùbá alphabet

The standard alphabet contains 25 letters:

`A B D E Ẹ F G GB H I J K L M N O Ọ P R S Ṣ T U W Y`

The following are distinct letters and must not be substituted for their undotted forms:
- `ẹ` is not `e`;
- `ọ` is not `o`;
- `ṣ` is not `s`.

`gb` is one Yorùbá consonant letter/sound. Do not split it into two consonants when teaching syllable structure.

## 3. Vowels

Yorùbá has seven oral vowel letters:

`a, e, ẹ, i, o, ọ, u`

The five commonly taught nasal-vowel forms are:

`an, ẹn, in, ọn, un`

Preserve the underdot in `ẹ` and `ọ`. A source extraction that changes `ẹ` to `e`, `ọ` to `o`, or `ṣ` to `s` is defective and must not be treated as a corrected spelling.

The `n` in a nasal-vowel spelling indicates nasalisation; do not automatically interpret it as a consonant coda or as a separate syllable.

## 4. Tone marks

Yorùbá has three level tones:

| Tone | Name | Mark | Example |
|---|---|---|---|
| High | Ìró òkè | Acute (`´`) | `á` |
| Mid | Ìró àárín | No mark when all tones are marked | `a` |
| Low | Ìró ìsàlẹ̀ | Grave (`̀`) | `à` |

The manual's minimal contrast:
- `bá` — meet;
- `ba` — weave;
- `bà` — impinge upon.

### Full-tone teaching text

When a teaching manual marks the tones throughout, write high with acute, low with grave, and leave mid unmarked. Do not add macrons to every mid-tone syllable in a fully tone-marked lesson.

### Selective tone marking

The Bamgbóṣé manual describes a macron as a special option when a writer selectively marks tones and needs to distinguish an all-mid-tone word. The Linguistic Data Consortium's *Global Yoruba Lexical Database* follows the contemporary high/low/mid convention with mid unmarked. For consistency across SS1 materials, use full tone marking where lexical tones are known and leave mid tone unmarked; do not introduce macrons into ordinary student-facing examples.

### Tone on syllabic nasals

A syllabic nasal bears tone. Mark it where it could be confused with an `n` used to indicate vowel nasalisation.

## 5. Syllabic nasal

The manual describes the following spelling environments:
- `m` before `b`;
- `n` before other consonants;
- `ng` before vowels in one spelling convention, with `n` accepted as an alternative in the JCC-approved orthography.

Examples documented in the manual include a syllabic `m` before `b`, syllabic `n` before consonants, and the first-person singular syllabic nasal before a vowel.

When explaining syllable structure, distinguish:
- syllabic nasal: the nasal itself forms the syllable nucleus;
- nasalised vowel: the vowel is nasalised and the written `n` does not form a separate syllable.

## 6. Syllable structures

For SS1 introductory phonology, use the three patterns:
- V: a vowel forms the syllable;
- CV: a consonant onset followed by a vowel nucleus;
- N: a syllabic nasal forms the nucleus.

A CV syllable has an onset and a vowel nucleus. A V syllable has no consonant onset. The standard Yorùbá patterns are open; do not invent an ordinary consonant coda from an `n` that marks vowel nasalisation.

## 7. Long vowels and contour-tone sequences

Do not use a tilde (`~`) as a general modern spelling mark for rising or falling tone sequences. The manual explains that a tilde does not show which of the possible tone combinations is intended.

When a long vowel carries more than one tone, write the vowel sequence with the appropriate tone marks on the component vowels. Examples in the manual:
- `oòrùn` — sun;
- `òórùn` — smell;
- `gbóòórùn` — notice a smell.

Preserve the exact vowel length and tone sequence in these forms.

## 8. Word boundaries, elision and contractions

1. Do not remove word boundaries merely to make an expression look shorter.
2. Preserve contractions only when they are supported by a reliable source or approved by the subject reviewer.
3. Do not expand an elided form into a full phrase unless the grammar and tone marks are verified.
4. Do not insert tone marks into an unmarked source string based only on guesswork or the apparent meaning.
5. If a source proverb cannot be read reliably, preserve it in the source evidence and replace it in a student supplement with a separately sourced proverb rather than inventing a correction.

## 9. Unicode and data-integrity rules

1. Store Yorùbá content as UTF-8.
2. Use Unicode NFC for newly authored text where possible, while preserving the original source bytes separately.
3. Do not strip combining marks, underdots, acute accents or grave accents during import, export, search indexing or display.
4. Do not replace `ẹ`, `ọ`, `ṣ` with ASCII `e`, `o`, `s`.
5. Confirm that browser fonts and the student app render `ẹ`, `ọ`, `ṣ`, `gb`, acute and grave marks correctly.
6. Keep a raw source extract and a corrected teaching supplement as separate artifacts. Never overwrite the original DOCX-derived source text with editorial corrections.

## 10. Editorial review checklist

Before a Yoruba lesson is promoted:
- [ ] Every underdotted vowel and consonant is preserved.
- [ ] Every lexical tone mark is supported by a dictionary, published expert source or subject-teacher decision.
- [ ] Mid tone is unmarked in a fully tone-marked teaching text.
- [ ] Syllabic nasals are distinguished from vowel nasalisation.
- [ ] `gb` is treated as one consonant letter/sound.
- [ ] Long vowels and contour-tone sequences preserve each vowel and its tone.
- [ ] Proverbs have a traceable source, translation and explanation.
- [ ] Uncertain source strings are preserved as evidence and not silently corrected.
- [ ] The rendered student-facing content is checked for missing glyphs and broken combining marks.

## 11. Reference

1. National Language Centre, *Orthographies of Nigerian Languages, Manual I*, Yoruba Orthography by Professor Ayọ Bamgbóṣé, pp. 43–54. Source copy: https://doczz.net/doc/6421461/orthographies-of-nigerian-languages-manual-i-national-lan...
2. Linguistic Data Consortium, University of Pennsylvania, *Global Yoruba Lexical Database v1.0*, “Orthography”, “Vowels” and “Tones”, PDF pp. 16, 19–22: https://catalog.ldc.upenn.edu/docs/LDC2008L03/Global_Yoruba_Lexical_Database.pdf
3. West African Examinations Council (WAEC), Yoruba Paper 2 examiner reports, 2019 and 2020, for standard spellings and the seven oral/five nasal vowel forms: https://waeconline.org.ng/e-learning/Yoruba/Yor228mq2.html and https://waeconline.org.ng/e-learning/Yoruba/Yor230mq3.html

Supporting phonology references:
- University of Georgia, Yoruba Online, “Phonology”: https://africa.uga.edu/Yoruba/phonology.html
- University of Wisconsin, *Yorùbá Dictionary*, “Yoruba Sounds and Pronunciation”: https://wisc.pb.unizin.org/yorubadictionary/front-matter/yoruba-sounds-and-pronunciation/