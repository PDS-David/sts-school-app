# UNR-02 Yoruba unresolved register (read-only)

Status: `IMPLEMENTED_TESTING_DEFERRED` (register written; not approved, not verified). Testing deferred by owner. This note proposes candidates for a later Yoruba task. It binds nothing, and no package or queue was edited.

## Inputs and method

- Base: `origin/master` `b6fef5ed7618a11a766011763f84dfc5737e8b4f` (30 October 2026). `yoruba.json` then had 319 coverage entries, 0 lessons and 43 UNRESOLVED. The 35 entries named in UNR-02 are all still UNRESOLVED and are the scope here. The other 8 are new `YO-T3-W02-*` entries added by the curriculum worker after the prompt: `YO-T3-W02-SCHEME-ASA`, `-EDE-03`, `-EDE-05`, `-ASA-01`, `-ASA-02`, `-LIT-01`, `-LIT-02`, `-SCHEME-LIT`. They are out of scope and need a refresh of this register.
- Sources (SHA-256 re-verified from the supplied 1st, 2nd and 3rd Term SS1 archives, matching `yoruba.json`): `SS1-SRC-48b641249e3b` 1st Term `7403d824…a6aef`; `SS1-SRC-ec4a5095420d` 2nd Term `73bfb976…c9ac`; `SS1-SRC-4cc6aae9ed7d` 3rd Term `a057f7f7…16e3`.
- Private extraction (outside Git): mammoth 1.12.2 `extractRawText`; 1,781 / 2,433 / 2,463 lines. Line numbers are 1-based lines of `extractRawText().split("\n")`. Hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The recipe reproduced three existing hashes exactly (`0fb18f89…`, `eee9b750…`, `e12aaf57…`) before use.
- Search: for each entry, case-insensitive keyword searches of all three extractions (the objective terms and variants), then reading each hit in context. "None" means no hit taught the objective; the zero or non-teaching hits are stated per row. No source text is copied here; titles and passages are referred to by line range and hash only.
- Classes: **A** scheme term never used in the body (named only in the scheme or an exercise); **B** strand absent in that week; **C** cross-week or cross-term mismatch (taught elsewhere); **D** truncated source (heading with no body, missing week, or list cut off).

Class counts: A 8, B 9, C 5, D 13. Total 35.

## Candidate blocks (hash-accounted)

| Key | Source | Lines | SHA-256 | What it is |
|---|---|---|---|---|
| C1 | 3rd Term | 97-113 | `cca082ee2481df24e47d0e01348b4e6ef707ea785859834166fcef5b9ef7c493` | 3rd Term reference list: nine titles with named authors, each marked WAEC or NECO; genre not stated; no text |
| C2 | 3rd Term | 913-925 | `c51db3623f86ebc26ae8409d82a4c843f757611ba6b5216c12d2bd2485e42706` | 3rd Term LITIRESO APILEKO part: names one WAEC text, tells pupils to analyse its chapters 3 and 4; no text, no analysis |
| C3 | 3rd Term | 363-385 | `e12aaf57954e421b722ac1b0bb9bd5ff5ae2f27a137fb4874877ee73b5975718` | 3rd Term Ewi apileko: definition and devices (existing entry YO-T3-W01-LIT-01); generic poem-analysis method, not tied to a named text |
| C4 | 1st Term | 1709-1721 | `e780f7ffc22e34856e0cff7955abe83e142dbe564126b375c69138989252a7dc` | 1st Term Week 8: short list of points for writing an essay |
| C5 | 3rd Term | 1891-1899 | `c676ba490c4e800a589c76f3c69fdb4513ee7ec753f87d292e4e3225347764a0` | 3rd Term Week 8: steps for writing an argumentative essay |
| C6 | 2nd Term | 1453-1545 | `4975303b639ab3d757f24ad536d59009690dfc82d13b866dccf5c2fe035cea50` | 2nd Term Week 5 translation lesson (definition 1453-1461 and rules 1469-1489 are owned by YO-T2-W05-EDE-01 and -EDE-03) |
| C6a | 2nd Term | 1491-1527 | `8f3d1af144c72d4adf1751de48f26be31057a6e72fbf4f201eb47c34edfd08ed` | Week 5 translation lesson: idiom pairs (English expression with Yoruba rendering) |
| C6b | 2nd Term | 1531-1545 | `cbaa6f58696e0f022e78dec46f4327323aa5ef02d79e3fc1125e46319e75ada5` | Week 5 translation lesson: passage-translation task with a rendering |
| C7 | 2nd Term | 1927-1969 | `00025aec37f6a6f8d096fcec8d27ebe8009d38d166672e780d9f96f92d5dc1fb` | 2nd Term Week 7 LITIRESO part: oral prose and poetry as a source of Yoruba history and culture (existing entry YO-T2-W07-SCHEME-LIT) |
| C8 | 3rd Term | 1523-1563 | `c3cee16b09fe21c42f853b0a6981e7255d4c029dcd3447319e42efaa9a86067a` | 3rd Term Week 6 literature part: heading names Ese Ifa and Aalo Apagbe; the body teaches Ese Ifa only |
| C9a | 3rd Term | 125-135 | `74733dbce9f175e3958abba77fb90ab458e9def28693e7e55d76dfd00c465973` | 3rd Term Week 1: oriki listed first under Oro-oruko; definition at 135 |
| C9b | 2nd Term | 157-169 | `329d6ee568ebdf53530e0af1278e7414e99727265bbc55ead510c2419c921a72` | 2nd Term Week 1: oriki listed first under Oro aropo oruko; definition at 169 |
| C9c | 3rd Term | 1633-1641 | `9617c5512655247c8cf80c71b2fd615f1cdefc74f4ae7441091f18bf3e3eaafa` | 3rd Term Week 7: Oriki heading followed by the definition of gbolohun oniponna |
| C10 | 3rd Term | 2049-2061 | `9a257d87f79da38d3bf7a11bebf5cd1109bcdefe59bf32722b405730b851d72d` | 3rd Term Week 9: list of what a funeral chant brings out, one item being oriki-orile (a mention) |
| C11 | 3rd Term | 99 | `4ecc68d0a567459128dfec3bfa17e02b88d4c54739c1baab4f53622f25dddfa5` | 3rd Term reference list: one WAEC title naming an oriki orile collection (name only) |
| C12 | 1st Term | 683-691 | `6fe740c383f4d12b7906c4e1c7b0a411bfa12aaacbee369c5e2784624c754285` | 1st Term LITIRESO: oral-literature enjoyment; names ijala in a short listing |
| C13 | 2nd Term | 1203-1253 | `b2a90f0ca446c2f473710ab0c88dfbc1c396942543829125621ea3ac11ee2e2b` | 2nd Term Week 3 ila kiko lesson (a separate scheme objective); ends with an oge sise question at 1253 |
| C14 | 2nd Term | 797-799 | `d702aef216a254e47ca7f4a0c2622feb7501c8f644eacf86880cd428d0dc7231` | 2nd Term Week 1 evaluation questions asking for oge sise |
| C15 | 2nd Term | 1005 | `128ce18c1c7aa533ad721e2b2407832f2fdc00450a60f013c61e2e51bb40273c` | 2nd Term Week 2: passing mention of oge in the dress-change paragraph |
| C16 | 3rd Term | 1291 | `601e4dc0594fa9b667470c0a88fb6f3e31009af6db544e33608b60faec647c7f` | 3rd Term Week 5: oge as an essay topic only |
| C17 | 3rd Term | 351 | `c5ce94b5f658b98e27f8a8fe971bc298b97e7078b7779088bc311d8feedc1daf` | 3rd Term Week 1: evaluation question about naming-ceremony materials (no body list) |
| C18 | 3rd Term | 935 | `7561e82e528d521365621d6b6ca3175b9c71520221b46fd49074768c3192bc61` | 3rd Term Week 4: evaluation question using the term koko ewi (no definition) |
| C19 | 2nd Term | 1037 | `82805a338a7a67a4035764adcb2095b5ff58da072e0e6dccef88110750ce1114` | 2nd Term Week 3: only other occurrence of gbolohun alaye, as a multiple-choice option |
| C20 | 1st Term | 1643-1667 | `afeefeac7862f376f508becc0f78ff24a92bd8c0c40e49ca38390ce98949d61d` | 1st Term Week 7 ASA block on iwa omoluabi (the block the entry already cites): definition and eight behaviours, no benefits |

Candidates are textual matches by locator, not judgements that the lesson is accurate or sufficient. Whether a candidate satisfies an objective is for the later Yoruba task and a Yoruba reader.

## Register (35 rows)

| # | ID | Objective (from the package) | Class | Candidate | Finding | Decision |
|---|---|---|---|---|---|---|
| 1 | `YO-T1-W05-SCHEME-LIT` | Scheme topic 15: Itupale asayan iwe itan aroso ti ajo WAEC/NECO yan (analysis of the WAEC/NECO-selected pro... | D | C1, C3 | No in-repo analysis of the 1st Term set prose text. C1 names WAEC/NECO titles but not which is the 1st Term prose text, and no genre is stated; C3 is a generic method for poems only. | D1 |
| 2 | `YO-T1-W05-LIT-01` | Analysis of the prose text selected by WAEC/NECO for the year | D | C1, C3 | As above: the strand is a heading with no body. | D1 |
| 3 | `YO-T1-W07-ASA-03` | The benefits (anfaani) of iwa omoluabi promised by the topic | D | none (C20 is the block with no benefits) | No in-repo equivalent. anfaani occurs in the 1st Term only in the heading (45, 1645); the 3rd Term occurrences concern games, loans and advertising, not iwa omoluabi. | S5 |
| 4 | `YO-T1-W08-SCHEME-LIT` | Scheme topic 22: Itupale asayan iwe ti ajo WAEC/NECO yan (analysis of the set literature text) | D | C1, C3 | No in-repo analysis of the 1st Term Week 8 set text; heading only. | D1 |
| 5 | `YO-T1-W08-LIT-01` | Analysis of the set WAEC/NECO literature text | D | C1, C3 | As above. | D1 |
| 6 | `YO-T2-W01-SCHEME-ASA` | Scheme Week 1 ASA objective: Oge sise (personal adornment and plaiting) | A | related only: C13; questions C14; mention C15 | No in-repo equivalent. oge sise is asked about (C14, 1023-1025, 1067-1069, 1253) but never defined or listed. C13 teaches ila kiko, a different objective; whether it counts as adornment is a Yoruba-reader decision. | D5 |
| 7 | `YO-T2-W01-SCHEME-LIT` | Scheme Week 1 LITIRESO objective: Itupale asayan iwe litireso (study of a selected literature text) | D | C1, C3 | Pointer only (405-407). No in-repo analysis of a selected text; C3 is generic. | D1 |
| 8 | `YO-T2-W02-ASA-01` | Oge sise (scheme line 29): definition and old-time forms of adornment | A | related only: C13, C15; questions C14 | Same as YO-T2-W01-SCHEME-ASA; reuse one lesson for both. | D5 |
| 9 | `YO-T2-W02-SCHEME-LIT` | Scheme Week 2 LITIRESO objective: Itupale asayan iwe litireso (study of a selected literature text) | B | C1, C3 | No literature heading or body in Week 2. | D1 |
| 10 | `YO-T2-W03-EDE-08` | Gbolohun alaye: listed as a type but no definition or example | A | none (C19 is only a question option) | No in-repo equivalent. gbolohun alaye occurs only in the type list (1113) and one option (C19); the 1st and 3rd Terms do not use it. | S1 |
| 11 | `YO-T2-W03-SCHEME-LIT` | Scheme Week 3 LITIRESO objective: Itupale asayan iwe litireso (study of a selected literature text) | B | C1, C3 | No literature heading or body in Week 3. | D1 |
| 12 | `YO-T2-W04-EDE-03` | Ilana kiko aroko: the procedure for writing an essay, named in the scheme | C | C4 (1st Term), C5 (3rd Term, argumentative only) | Partial candidate. C4 lists general essay-writing points; C5 gives steps for one other essay type. Neither is about the descriptive essay Week 4 teaches; an owner decision on whether a general procedure suffices. | D9 |
| 13 | `YO-T2-W04-ASA-08` | Awon ohun elo idana: the items required for the marriage payment, named in the scheme | A | none | No in-repo equivalent. idana occurs only in Week 4 (53, 1361-1419, 1633), never as a list of items; the 1st and 3rd Terms do not use it. | S2 |
| 14 | `YO-T2-W04-SCHEME-LIT` | Scheme Week 4 LITIRESO objective: Itupale asayan iwe litireso (study of a selected literature text) | B | C1, C3 | No literature heading or body in Week 4. | D1 |
| 15 | `YO-T2-W05-ASA-06` | Ana sise ni ile Yoruba: the in-law strand named in the scheme but absent from the body | A | none | No in-repo equivalent. The matches for ana (677, 2273, 3rd Term 175) sit inside an example sentence and a list of time words, not an in-law strand. | S3 |
| 16 | `YO-T2-W05-SCHEME-LIT` | Scheme Week 5 LITIRESO objective: Itupale asayan iwe litireso (study of a selected literature text) | B | C1, C3 | No literature heading or body in Week 5. | D1 |
| 17 | `YO-T2-W06-SCHEME-EDE` | Scheme Week 6 EDE objectives: Aayan Ogbufo (translation) and sise ogbufo ayoka ede Geesi si ede Yoruba (ren... | C | C6 | The same objective (Aayan Ogbufo and rendering a passage into Yoruba) is taught in Week 5 (1453-1545), not Week 6. The Week 6 heading (1613) has no body. | D2 |
| 18 | `YO-T2-W06-EDE-01` | Aayan Ogbufo defined: what translation is and how an English text is rendered into Yoruba | C | C6 (definition 1453-1461, existing YO-T2-W05-EDE-01) | Taught in Week 5; cross-week mismatch. | D2 |
| 19 | `YO-T2-W06-EDE-02` | Sise ogbufo ayoka ede Geesi si ede Yoruba: the practice of rendering idiomatic English expressions into Yoruba | C | C6a, C6b | Idiom pairs and a passage-translation task exist in Week 5 (1491-1545); no Week 6 body. Check which Week 5 entries already own C6a and C6b before binding. | D2 |
| 20 | `YO-T2-W06-ASA-06` | Yigi: the third modern marriage type named in the scheme | A | none | No in-repo equivalent. Yigi occurs once in all three sources (2nd Term line 71); whether it is a variant of a taught type cannot be decided from the repo. | S4 |
| 21 | `YO-T2-W06-SCHEME-LIT` | Scheme Week 6 LITIRESO objectives: itan olorogeere as a source of Yoruba history and culture, itan isedale... | C | C7 (itan oloro geere as a source of history and culture); C12 (itan isedale mention) | Two of the three sub-objectives have a Week 7 candidate under a matching heading (C7, existing YO-T2-W07-SCHEME-LIT). itan awon eya Yoruba has none. | D8 |
| 22 | `YO-T2-W08-SCHEME-EDE` | Scheme EDE objectives: atunyewo eko lori eka ede Yoruba (Ijesa, Ekiti, Oyo and others), iwulo Yoruba ajumol... | D | none | Week 8 has no body (no OSE KEJO label). Ijesa, Ekiti and ajumolo occur only at 93-97 in all three sources. | D3 |
| 23 | `YO-T2-W08-EDE-01` | Atunyewo eko lori eka ede Yoruba: review of Yoruba dialects, naming Ijesa, Ekiti, Oyo and others | D | none | As above: dialect review untaught anywhere. | D3 |
| 24 | `YO-T2-W08-EDE-02` | Iwulo Yoruba ajumolo: the usefulness of standard Yoruba | D | none | As above: iwulo Yoruba ajumolo untaught anywhere. | D3 |
| 25 | `YO-T2-W08-EDE-03` | Fifi eka ede we Yoruba ajumolo: comparing a Yoruba dialect with standard Yoruba | D | none | As above: comparing a dialect with standard Yoruba untaught anywhere. | D3 |
| 26 | `YO-T2-W08-ASA-03` | Ohun elo ati isomoloruko: the materials used in the naming ceremony | D | none (C17 shows the same question without a body list) | No in-repo list of naming-ceremony materials; the 3rd Term question at C17 presupposes one. | D3 |
| 27 | `YO-T2-W08-SCHEME-LIT` | Scheme LITIRESO objective: itupale asayan iwe litireso (analysis of a selected literature text) | D | C1, C3 | Week 8 has no body; no in-repo analysis of a selected text. | D1 |
| 28 | `YO-T2-W09-SCHEME-LIT` | Scheme Week 9 LITIRESO objectives: litireso alohun oloro wuuru and aalo with its types apamo and apagbe, iw... | B | C8 (heading only), C3 | Week 9 has no literature part. C8 names Aalo Apagbe in a heading but teaches only Ese Ifa. | D4 |
| 29 | `YO-T2-W09-LIT-01` | Aalo as litireso alohun: the types apamo and apagbe | D | C8 (heading only) | apamo occurs only at 119; apagbe only at 119 and as the C8 heading. No definition or example anywhere. The scheme line ends in a comma, so the list of types may be cut off. | D4 |
| 30 | `YO-T2-W09-LIT-02` | Iwulo aalo: the uses of aalo | B | none | iwulo aalo occurs nowhere else; untaught. | D4 |
| 31 | `YO-T2-W09-LIT-03` | Awon ona ede ti o wa ninu aalo: the language devices used in aalo | B | C3 (devices for poems, not for aalo) | No language devices of aalo are taught; C3 is generic and is about ewi. | D4 |
| 32 | `YO-T2-W10-LIT-02` | Oriki orile: the praise poetry of lineages and towns | B | C10 (mention), C11 (name only) | No teaching of oriki orile. C10 lists it as one item of a funeral chant; C11 names a collection. | D6 |
| 33 | `YO-T2-W10-LIT-03` | Ijala: the hunters praise chant | B | C12 (listing) | ijala is named in a listing only; no definition or example. | D6 |
| 34 | `YO-T3-W01-EDE-04` | Oriki as a named sub-topic of oro oruko | A | C9a, C9b, C9c | Candidate by usage: in all three blocks oriki is the first item of a lesson contents list or heading, and a definition follows (3rd Term 135; 2nd Term 169; 3rd Term 1641). So the definition at 135 may be the oriki; a Yoruba reader should confirm before binding. | D7 |
| 35 | `YO-T3-W01-LIT-02` | Amuye ewi and koko ewi as named in the scheme | A | C3 (related), C18 (question only) | amuye ewi and koko ewi are never defined; koko ewi appears only in an evaluation question (C18). C3 teaches a different poem-analysis topic; equivalence is an owner decision. | S6 |

## Ranking by entries one decision would close

| Rank | Decision | Entries | What it needs | Note |
|---|---|---|---|---|
| 1 | D1 | 10 | Name the WAEC/NECO set text(s) for each term, and supply the analysis content (or accept C3 as a labelled generic method) | C1 and C2 name texts but state no genre or year |
| 2 | D3 | 5 | Supply the missing 2nd Term Week 8 body (dialect review, iwulo Yoruba ajumolo, comparing a dialect with standard Yoruba, naming-ceremony materials) | Week 8 has no body in the source |
| 3 | D4 | 4 | Supply aalo teaching (types apamo and apagbe, uses, language devices), or confirm the Week 9 literature strand is intentionally absent | C8 is a heading only |
| 4 | D2 | 3 | Accept the Week 5 translation lesson (C6) as the teaching for the Week 6 scheme objectives, and re-bind the Week 6 entries | Content exists in Week 5 |
| 5 | D5 | 2 | Supply the oge sise definition and old-time forms of adornment (or accept C13 as related) | Asked in four questions, never taught |
| 6 | D6 | 2 | Supply oriki orile and ijala teaching for Week 10 | Only mentions and names exist |

Single-entry decisions (1 each): **D7** Confirm that oriki means the definition in these lessons (YO-T3-W01-EDE-04).; **D8** Re-bind two Week 6 literature sub-objectives to the Week 7 part (C7); supply itan awon eya Yoruba (YO-T2-W06-SCHEME-LIT).; **D9** Accept a general essay procedure (C4 or C5) for YO-T2-W04-EDE-03, or supply the descriptive-essay steps.; **S1** Supply the definition and an example of gbolohun alaye (YO-T2-W03-EDE-08).; **S2** Supply the list of items for the marriage payment (YO-T2-W04-ASA-08).; **S3** Supply the ana sise strand (YO-T2-W05-ASA-06).; **S4** Confirm what Yigi means or whether it is a typo (YO-T2-W06-ASA-06).; **S5** Supply the benefits (anfaani) of iwa omoluabi (YO-T1-W07-ASA-03).; **S6** Define amuye ewi and koko ewi, or accept C3 and the question at C18 as the treatment (YO-T3-W01-LIT-02).

Check: 26 entries under D1-D6 plus 9 single-entry decisions = 35.

Reading the ranking: D1 would close the most only if the owner names the set texts and supplies authorised analysis content; accepting C3 as a labelled generic method would let a later task bind the generic part but not a named text. D2, D7, D8 and D9 are decisions about material already in the sources; D3, D4, D5, D6 and the singles need new source content.

## Observations

- Existing Week 6 evidence says ogbufo and aayan do not occur in Week 6. That is correct; they are taught in Week 5 (C6), which the Week 6 entries do not point to.
- The 3rd Term question at C17 asks for naming-ceremony materials with no body list, the same pattern as 2nd Term Week 8.
- No unresolved entry has an in-repo lesson to bind: `yoruba.json` has 0 lessons.

## Acceptance (static)

35 rows, each with a candidate or an explicit none; every hash reproducible from the private extract with the recipe above; `yoruba.json`, `QUEUE.json` and every other file untouched. Checks run: hash recomputation and ID cross-check against `yoruba.json` only, which are authoring checks, not tests. No importer, compiler, tests, database or device run.
