# YO-FACT-T1-W01-DEFECTS — source correction and orthography decision

Status: **IMPLEMENTED — TESTING DEFERRED**. This is an evidence-based editorial decision for the replacement lessons. It does not alter the private source document, claim that an external author reviewed this school source, or mark the package approved.

## Evidence boundary

- Registered source: `SS1-SRC-48b641249e3b`
- Archive: `SSS 1-20260507T072431Z-3-001.zip`
- Member: `SSS 1/1st Term SS1_/YORUBA.docx`
- Archive SHA-256 recorded in `YO-INV-T1.md`: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256 recorded in `YO-INV-T1.md`: `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`
- Source locators and defect list: `YO-WK-T1-W01.md`, lines 61–310.
- This decision reuses the earlier hash-verified source inventory and the committed week index. The private DOCX was not reopened in this bounded task. The source's original bytes and wording remain unchanged.

## Named authority and decision basis

The editorial decisions below use published Yoruba-language and cultural sources rather than guessed reconstructions:

1. **Linguistic Data Consortium, University of Pennsylvania**, *Global Yoruba Lexical Database v1.0*, “Orthography”, “Vowels” and “Tones” (PDF pp. 16, 19–22). It states that the database follows the orthography used in Nigerian schools and formal publications; documents seven oral vowels, the five nasal-vowel forms and the current high/low/mid tone-marking convention. [Source](https://catalog.ldc.upenn.edu/docs/LDC2008L03/Global_Yoruba_Lexical_Database.pdf)
2. **West African Examinations Council (WAEC)**, Yoruba Paper 2 examiner reports, 2019 and 2020. The 2019 report supplies standard spellings for speech organs including `Èrìgì`, `Ìwájú ahọ́n`, `Àárín ahọ́n`, `Ẹ̀yìn ahọ́n`, `Àjà ẹnu` and `eyín ìsàlẹ̀`; the 2020 report distinguishes the seven oral and five nasal vowel forms. [2019 report](https://waeconline.org.ng/e-learning/Yoruba/Yor228mq2.html) · [2020 report](https://waeconline.org.ng/e-learning/Yoruba/Yor230mq3.html)
3. **WAEC**, Yoruba Paper 2 examiner report, 2022, question 13, which identifies `Ọ̀tayò` as an Ayò player and records the greeting and response used for the two players. [2022 report](https://waeconline.org.ng/e-Learning/Yoruba/Yor235mq13.html)
4. **Prof. Philip Adédòtun Ògúndèjì and Prof. Adésọlá Olátéjú**, National Open University of Nigeria, YOR 215, *Ìfáàrà sí Lítírésọ̀ Alohùn Yorùbá* (2023), especially the course team (pp. i–ii) and the comparison of oral and written literature (pp. 5–7). [NOUN courseware](https://nou.edu.ng/coursewarecontent/YOR%20215%20INTRODUCTION%20TO%20YOR%C3%99B%C3%81%20ORAL%20LITERATURE.pdf)
5. **Benson O. Igboin**, “The Semiotic of Greetings in Yoruba Culture”, *Cultura: International Journal of Philosophy of Culture and Axiology* 9(2) (2012), pp. 123–142, especially p. 127 for farmer, palm-wine tapper and Ifá-priest greetings. [Article](https://culturajournal.com/wp-content/uploads/2023/08/Cultura-9-2-9.pdf)
6. **Akinrinmade Olayemi Esther, Olafusi Tosin Aanuoluwapo and Yomi-Enitan Omonike Eunice**, “A Comparative Analysis of Salutations in Yoruba and French Cultures: Linguistic and Sociocultural Perspectives”, *Journal of Literature and Linguistics Studies* 3(1) (2025), DOI 10.61424/jlls.v3.i1.203, pp. 9–10, for trader and driver greetings. [Article](https://bluemarkpublishers.org/index.php/JLLS/article/download/203/171)

These are named published authorities and official examination references. The implementation decision is made by the curriculum author from those sources; it is not represented as a personal sign-off by the cited authors.

## Term-wide notation decision

Use standard contemporary Yoruba school orthography in all replacement lessons:

- **Seven oral vowels:** `a, e, ẹ, i, o, ọ, u`.
- **Five commonly taught nasal vowels:** `an, ẹn, in, ọn, un`. The `ẹ` and `ọ` underdots are phonemic distinctions, not decoration.
- **Consonants:** preserve `ṣ` as distinct from `s`; the consonant inventory includes `ṣ`.
- **Tones:** high tone takes an acute accent (◌́); low tone takes a grave accent (◌̀); mid tone is unmarked. Mark each relevant syllable. Do not use macron, circumflex or caron as substitutes for the current standard tone marks. In a long/repeated vowel sequence, mark each vowel according to its own tone.
- Use Unicode precomposed Yoruba characters where available (`ẹ Ẹ ọ Ọ ṣ Ṣ`) and combining acute/grave marks where needed. Do not transliterate these distinctions to plain ASCII in student-facing Yoruba.
- Do not mechanically add tone marks to a word whose lexical tone has not been checked. Use the cited standard and a reliable Yoruba lexical source for each lesson example; leave any unresolved lexical item out of the student-facing example rather than inventing its tone.

## Decisions on the nine recorded source defects

| Source locator | Decision for the replacement lesson |
|---|---|
| Line 93: central vowel set `a, en` | Correct to `a, an`. The front nasal `ẹn` belongs with the front set; central nasal is `an`. Keep the full seven-oral/five-nasal inventory consistent with the WAEC/UPenn references. |
| Lines 71 and 83: `evigi` / `erigi` | Use `Èrìgì` (alveolar ridge) consistently. The WAEC 2019 speech-organ list supplies this term. |
| Line 71: `iwaju a lo n` and `aarin lion` | Correct the intended labels to `Ìwájú ahọ́n` (front of the tongue) and `Àárín ahọ́n` (middle of the tongue), using the WAEC 2019 spellings. |
| Line 71: `e yin isale`; line 81: `Eju isale` | Use `eyín ìsàlẹ̀` (lower teeth) consistently. Line 81 is a transcription error, not a second organ. |
| Lines 71 and 83: `aja enu` / `aja-enu` | Standardise to `Àjà ẹnu` (hard palate), as in the WAEC 2019 list. Do not alternate hyphenated and unhyphenated forms. |
| Line 199: Babalawo greeting and `Amin` response | Replace the corrupted pair with `Àbọ̀rú, àbọ̀yè, àbọ̀ṣíṣẹ́`; a documented response is `Ogbó atọ́, àsúre Ìwòrìwòfún`. Igboin also records `Àbọ̀rú` / `Ẹbọ̀ à fín` and the response `Àbọ̀yè bó ṣeṣẹ́`; treat the response as a documented Ifá variant, not a generic `Àmín`. |
| Line 253: garbled oral-literature explanation | Do not attempt a word-for-word reconstruction. Replace it with this original teaching explanation: **`Lítírésọ̀ alohùn kún fún ọgbọ́n, ìmọ̀ àti ìrírí àwọn àgbà. Àwọn baba ńlá wa máa ń gbé ìtàn, ewì àti orin láti ẹnu dé ẹnu kí kíkọ àti kíkà tó di ohun tí ó wọ́pọ̀ ní àwùjọ Yorùbá.`** This explains oral transmission without pretending to recover the corrupted sentence. |
| Line 269: `Litireso yin je litireso alakosile` | Correct `yin` to `yìí` and use the taught category term: **`Lítírésọ̀ yìí jẹ́ lítírésọ̀ àpilẹ̀kọ.`** |
| Lines 261–265 and 275–279: `a., b., d.` | Renumber the three sub-types sequentially as `a., b., c.`. The third item is not a fourth category. |
| Time-table row labels: `I, Ii, Iii, Iv, V, Vi, Vii` | Standardise the display to `I, II, III, IV, V, VI, VII`; preserve the row order and greeting-to-time pairing. |
| Line 299: `Ontayo` | Correct the label to `Ọ̀tayò` and move it out of the occupation list: it names the Ayò player, not a trade. The greeting is `Mo kí ọ̀ta, mo kí òpè o`; the WAEC 2022 report gives the response `Ọ̀ta ń jẹ́, òpè ni kò gbọdọ̀ fọhùn`. |

## Replacement wording for the Week 1 occupational-greeting table

The original greeting table is not copied verbatim. Use these sourced or clearly labelled generic replacements:

| Person / work | Greeting to teach | Response / teaching note |
|---|---|---|
| Àgbẹ̀ (farmer) | `Àrokò bọ́dún dé o` | `Ọdún á yá wa` is a documented response variant. |
| Onídìrí (hairdresser) | `Ojú gbooro o` or `Ẹ kú ẹwà o` | `Oòyà o, Ìyá Mọ́jà á gbé ọ` is a documented response variant. |
| Bàbáláwo (Ifá priest) | `Àbọ̀rú, àbọ̀yè, àbọ̀ṣíṣẹ́` | `Ogbó atọ́, àsúre Ìwòrìwòfún`; `Àbọ̀yè bó ṣeṣẹ́` is also recorded. |
| Awákọ̀ (driver) | `Ọkọ̀ á ré fò o` | `Àṣẹ` is a documented response. |
| Akọ̀pẹ̀ (palm-tree climber / tapper) | `Ìgbà á rọ̀ o` | `A dúpẹ́ o` is a documented response. |
| Oṣiṣẹ́ ìjọba (public servant) | `Ẹ kú iṣẹ́ o` | Teach as a **general work greeting**, not as a unique civil-service formula; a polite `Ẹ ṣé` is an acceptable general response. |
| Ìyá ọjà (market trader) | `Ẹ kú ọ̀rọ̀ Ajé o` or `Ajé á wọ̀ gbà ọ́` | The source confirms the greeting form; do not claim a unique traditional response where the reference does not supply one. A courteous `Ẹ ṣé` may be used as a general response. |

The separate Ayò greeting is taught as a game-context greeting, not an occupation:
- Greeter: `Mo kí ọ̀ta, mo kí òpè o.`
- Response: `Ọ̀ta ń jẹ́, òpè ni kò gbọdọ̀ fọhùn.`

The Week 1 assessment prompts for Oba, Aláboyún, Ijoye, a new mother and Akọ̀pẹ̀ remain in the assessment task; this decision does not invent answers for those separate prompts.

## Package and lesson disposition

- The source DOCX remains unchanged. These corrections bind only the replacement lessons.
- The three Week 1 replacement lessons must use this decision and the term-wide notation convention; do not copy the corrupt source strings.
- No source text is claimed to be a newly approved set text. The replacement oral-literature explanation is original teaching prose.
- The separate assessment gap remains open until its questions receive complete model answers and a marking scheme.
- The remaining scheme mapping, parsed-row identity and missing-content items remain separate tasks; this decision does not close them.
- Content approval remains PENDING and verification remains DEFERRED.

## Verification disposition

No tests, typechecks, parser/compiler, importer, database or device checks were run. The source correction decision is recorded so the Week 1 lesson tasks can proceed; tests remain deferred until the curriculum authoring work is complete.
