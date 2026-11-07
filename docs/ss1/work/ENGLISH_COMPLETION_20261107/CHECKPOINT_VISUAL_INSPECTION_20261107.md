# English visual inspection checkpoint (2026-11-07) — NOT a closure record

Status: 031, 032, 033 are NOT implemented. This file only preserves inspection findings so the work need not be repeated.
No queue status, lesson, asset, approval or verification state was changed. 030 and 034-039 were not started in the repo.

## Source verification
- Archive docs/ss1/sources/SSS1-original.zip SHA256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e: matched.
- Members matched their registered SHA256 before reading (T1 4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef; T2 ea9c7d70ffb8682fcf9dd9c4ebc2155fc6aa17aededc4743354add0cfeb72966; T3 3a2174ad562794b593c42cbd61fc68843703846651fc0d2bbac3b38b0d9c0f5f).
- Private LibreOffice PDF renders (not committed): T1 42 pages, T2 11, T3 30. Every page was viewed. Renders are conversions, not the original layout.
- No special-font glyphs survive as extractable characters; garbled IPA must be settled from the rendered page.

## Decorative branding (exclude; do not commit; contains contact details)
- T1 page 1 full-page vision-statement graphic; T1 and T3 per-page header logo. T2 has none.

## Findings by term (page = LibreOffice render page)
T1
- Scheme table p1-3 (WEEK/TOPIC): scheme, not taught content.
- Plural tables p5-6 (regular, irregular, compound, zero): meaningful two-column tables. Collective-noun underline targets p5 (troupe/troup, band, bevy, class).
- Affix tables p35-36: blank first cell continues the previous prefix/suffix. Correct/Misspelt table p19: several rows have identical columns (source error; not misspellings).
- Underlined targets: phrasal verbs p10, noun-phrase p17, adjectival phrases p30, adverbial/prepositional p36-37, articles p39, synonym/antonym items p20, p31, p37-38, p41.
- Vowel-sound items p25 and consonant-sound items p29 use underlined letters as the target. Consonant item 4 (Gear) and 5 (Drink): underline does not match the tested sound; answer not derivable without a decision.
- IPA problems: velar nasal appears as a dot/superscript glyph instead of the eng symbol; /dʒ/ written dz; schwa written as capital Ə; diphthong list names eight but shows seven and uses əi for /ɔɪ/; /k/ entry illustrated with /t/ words.
- Stress options p31 use capitalised syllables; emphatic stress p33 uses capitalised words.
- Letter/report layouts: formal report p13, informal-letter closing p38 (right-aligned subscript, first name, full stop).
- Week-1 nine-word spelling task p9: libary, envinronment, milenium, writting, maneuver, continious, optamologist, neccessary, duely (verify spellings against the source before authoring).
- Week-1 Countdown 240-241 (p7): differentiate works/work, damages/damage, stationery/stationary. Effective English p273 (p9): reading assignment only.
- Week-2 p9: Effective English Unit 3 pp54-55 is a religion passage (Yoruba deity, householder ritual); Practice 3 p56; Countdown p160 Exercise (b), p159, pp271-272 Q91-100 are named only.
- Week-3 p15-16: Effective English p148 practice, Countdown p169, p352 Passage A 1-18 named only. Week-4 p16: drama passage has three characters (Salubi, Samson, Kotonou; source also spells Kotuno); pp68-71, Countdown pp144-145, 236, 353-354 Passage B 19-30 named only. Unified test only mentioned.
T2
- Tab-separated prefix/meaning/example columns p1; suffix lists numbered 1-3.
- Formal letter p3-4: right-aligned sender address and date, left addressee, centred bold underlined heading, indented closing block.
- Tense list p5: auto-numbered 1-6, tense names and key verbs bold+underlined; evaluation 1-5 inline options, none bold.
- Linking words / reporting verbs p2: two parallel tab lists, not row pairs.
- Photography/religion option rows p7-9: rows 5 and 6 of the religion block are bold; this is formatting, not an answer key. Blanks 1-7 underlined.
- Adjective/adverb two-column drawing p10 (8 pairs). Adverb word list p11: nine words under a duplicated number 4 (auto-number plus typed numbers).
- Scheme says Week 2 NOSEC/Home and family life; body is The Quest for Health pp68-69.
T3
- Scheme table p1-2: scheme, not taught content.
- Tab-column misspelling pairs p2 (cc/mm/nn underlines); adjunct category table p5 (Direction row has blank question cell); tick-mark outline lists p5, p8.
- Weekend item 5 p6 has no underlined target.
- Minimal-pair tables p13-14: /v/-/f/, /s/-/z/, /ʒ/-/ʃ/; headings of the /ʒ/-/ʃ/ table appear swapped against the words. Short-vowel heading carries a length mark p27. Source contains an inappropriate pair (bitch/beach) and non-minimal pairs (excess/example). Vowel-sound table p10: underline targets not verified from XML.
- Compound-plural tables p15; source error Headscarfs. Prefix table p16 has dubious rows (unn, ante, anti).
- Stress lists p17: capitalised stressed syllables; noun/verb pairs numbered across two columns.
- S/v/o/A labels positioned above words p19-20 and noun-clause arrow shape p7; intonation marks blank p22.

## Next real task
Start ENG-FACT-VISUAL-DISPOSITION-T1: re-extract members, re-check hashes, write the full per-element inventory (locator, function, extraction outcome, disposition, remedy ID) and implement remedies only in allowed paths. Then T2, T3, then 034-037 and 039; 030 needs access to the cited pages.
