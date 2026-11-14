# YO-FACT-T1-W03-DEFECTS — First-Term Week 3 source and chart decision

Status: **IMPLEMENTED — TESTING DEFERRED**. The replacement lessons use the decisions below. The private source document remains unchanged. The cited authorities are reference sources; they did not personally review this school document.

## Evidence boundary

- Registered source: `SS1-SRC-48b641249e3b`
- Member: `SSS 1/1st Term SS1_/YORUBA.docx`
- Member SHA-256 recorded in the prior inventory: `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`
- Archive SHA-256 recorded in the prior inventory: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Week 3 source locators: `YO-WK-T1-W03.md`, source lines 485–719.
- The private archive was not reopened in this task; the hash-verified source inventory and week index were reused.

## Named reference authorities

1. **Linguistic Data Consortium, University of Pennsylvania**, *Global Yoruba Lexical Database v1.0*, orthography, vowels and tone sections. [PDF](https://catalog.ldc.upenn.edu/docs/LDC2008L03/Global_Yoruba_Lexical_Database.pdf)
2. **Adeola Agoke**, University of Wisconsin–Madison, *Yorùbá Dictionary: Yoruba Sounds and Pronunciation* (2024), for the oral/nasal vowel inventory and tone notation. [Reference](https://wisc.pb.unizin.org/yorubadictionary/front-matter/yoruba-sounds-and-pronunciation/)
3. **Isaac O. Delano**, *Òwe l'ẹṣin ọ̀rọ̀: Yoruba Proverbs, Their Meaning and Usage* (Oxford University Press, 1966), for proverb categories and usage. [Catalogue/reference](https://books.google.com/books/about/Owe_l_ẹsin_ọrọ.html?id=KqIJAQAAIAAJ)
4. **Claudius Olayemi Olaniyan**, “Rethinking the Dynamics of Yoruba Dundun Music Resource Materials in Music Performance Practice” (2020), which uses `ìsírí` for encouragement in the proverb-category discussion. [Article](https://www.africamusicologyonline.com/index.php/amo/article/view/77)
5. **Prof. Philip Adédòtun Ògúndèjì and Prof. Adésọlá Olátéjú**, National Open University of Nigeria, YOR 215, *Ìfáàrà sí Lítírésọ̀ Alohùn Yorùbá*, for oral-literature terminology and performance context. [Courseware](https://nou.edu.ng/coursewarecontent/YOR%20215%20INTRODUCTION%20TO%20YOR%C3%99B%C3%81%20ORAL%20LITERATURE.pdf)

The curriculum implementation agent adopts the following editorial decisions from these published references. This is not represented as a personal sign-off by the cited authors.

## EDE: vowel-description criteria and chart

### Four criteria

The four independent criteria for describing vowels are:

1. **Velum position / oral–nasal quality:** raised velum gives an oral vowel; lowered velum allows nasal airflow.
2. **Tongue height:** high, mid or low.
3. **Tongue frontness/backness:** front, central or back.
4. **Lip shape:** spread/unrounded or rounded.

The source repeats a label for the velum/lip criterion and uses two labels for lip position. Treat these as four distinct criteria above; do not teach the duplicated labels as separate fifth or sixth criteria.

### “Perese” and “roboto” lists

The source lists at lines 513 and 515 mix oral and nasal forms. Do not memorise those mixed lists as separate vowel inventories. Teach the categories independently:
- oral vs nasal is determined by the velum and airflow;
- front/central/back and high/mid/low describe tongue position;
- spread/rounded describes lip shape.

The replacement lesson therefore uses the seven oral forms `a, e, ẹ, i, o, ọ, u` and five nasal spellings `an, ẹn, in, ọn, un`, then separately explains tongue and lip criteria. The term-wide acute/grave/unmarked-mid and underdot convention established in the Week 1 decision applies.

### Accessible vowel chart asset

The source's tab-positioned chart is replaced by a project-authored, accessible SVG:
- Asset ID: `YO-T1-W03-EDE-VOWEL-CHART-1`
- Path: `backend/src/db/ss1/assets/yoruba/yoruba-t1-w03-vowel-chart.svg`
- SHA-256: `f04606a8d65e14d030ab2a05003cebda73263cbcd363e2b25089c0b01bbc2db4`
- UTF-8 bytes: `3578`
- The chart shows seven oral vowels in a four-height / three-frontness grid and lists the five nasal spellings with IPA.

Static asset inspection confirms: no `script`, no `foreignObject`, no event-handler attributes, no external HTTP references, and the expected twelve spellings are present. The SVG contains a title/description and is linked to the Week 3 EDE lesson. **Runtime rendering verification remains DEFERRED**; no browser or app render was run.

## ASA: proverb categories and examples

- Use the standard spelling **`ìsírí`** (encouragement), with plain `s`, not underdotted `ṣ`. The published Delano reference and Olaniyan's academic discussion support the encouragement category.
- The five categories used in the replacement lesson are `ìbáwí` (admonition), `ìkìlọ̀` (warning), `ìmọ̀ràn` (advice), `àlàyé` (explanation) and `ìsírí` (encouragement).
- The seven source proverb/gloss pairs recorded in the week index are too corrupted or incomplete to restore reliably. Do not invent their missing words or translations.
- The replacement lesson uses clearly labelled **new classroom examples**, not claimed traditional proverbs. The student must be told that these examples were composed for practice and are not quoted from the source.
- The practical task requires two examples each for three categories. Supply six original proverb-like teaching lines and explain them; mark the exercise as an original composition task, not a memorisation of historical sayings.

## LITIRESO: terminology and unrecoverable passage

- Use **`lítírésọ̀ alohùn`** and introduce **`lítírésọ̀ àtẹnudẹnu`** as a descriptive equivalent for oral literature. Do not use the corrupted `litireso atenudanu` as a student-facing term.
- Retain the clearly indexed concepts: eré oníṣe, ewì egúngún, ìjálá, oríkì and ìtàn ìdí-abájọ.
- The strings `ìṣẹ̀dálẹ̀/ìsẹ̀dálẹ̀/ìsẹ̀dálá`, `kiki ati kike`, `leti orirun`, `onirunru`, `tita-opolo` and `ji po jatirere` are not reliably recoverable from the extracted source. Do not teach them as confirmed terms.
- Replace them with original, clear explanations of oral recitation, praise, call-and-response, vocal projection, cultural context and social values. Explain `kíkì` and `kíké` only as vocal performance actions where relevant; do not present them as a newly verified named genre.
- The replacement lesson's examples are explicitly original and are not presented as inherited chants or sacred text.

## Assessment decision

The Week 3 source includes five assessment questions and a practical task, but the answer/marking evidence is incomplete. The replacement lessons now provide:
- EDE questions with answers and marking, plus a vowel-chart task with a ten-mark rubric;
- ASA questions with answers and marking, including two newly composed examples each for ìmọ̀ràn, ìbáwí and ìkìlọ̀;
- LITIRESO questions with answers and marking.

No missing source proverb or oral text has been reconstructed by guesswork.

## Package disposition

- The Week 3 replacement lessons use the term-wide Yoruba orthography convention.
- The accessible chart is registered and statically inspected; runtime rendering is still deferred.
- The original source DOCX and its chart are unchanged.
- Scheme-position mapping and parsed-row identity remain separate open items.
- Content approval remains PENDING; verification remains DEFERRED.

## Verification disposition

No tests, typechecks, parser/compiler, importer, database or device checks were run. Static SVG safety and hash checks were performed. Runtime chart rendering and all curriculum tests remain deferred until implementation is complete.
