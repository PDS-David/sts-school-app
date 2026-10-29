# FR-WK-T1-W03 — French, 1st Term Week 3 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The week is **not fully covered**: both objectives are PARTIAL by design of the completion condition.

## Inputs
- Starting SHA: `20fa3e0eafbf11052611495bcca7d9424adcae4f` (origin/master, after PR #183 merged by owner). GitHub API listed one open PR (#184, Food and Nutrition, unrelated) and no French branch for Week 3. Prerequisite FR-SRC-T1 is IMPLEMENTED_TESTING_DEFERRED. No `AGENTS.md`.
- Member `SSS 1/1st Term SS1_/FRENCH Ss1.docx`, SHA-256 `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864` **verified**; source `SS1-SRC-945dfb24eaf6`; 97,321 bytes. Composite archive `SSS 1-20260507T072431Z-3-001.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Method: member extracted privately outside Git; `word/document.xml` parsed with Python `lxml`; locators are 0-based children of `w:body` (convention of `FRENCH_SOURCE_NOTES.md`). Child-text hash = SHA-256 over the UTF-8 of each child's concatenated `w:t` text, joined by `\n`. The importer was not run, so the existing body hash `142d0eb60b9384edcf42f8a302829dc51b7c3277fcda1457c70d19ffcec59f98` was **not recomputed**.

## Findings
- Week 3 = body children **78–145** (label `WEEK 3` at 78, next label `WEEK 4` at 146).
- There is **no scheme-of-work table** in this document, so objectives are the week's own sections: lead-in (79–82: heading, one preamble line ending `Ex:`, and two list paragraphs `Les salutations` / `Presenter /Presentation`), empty paragraph 83, greeting list (84–133), empty paragraph 135, self-presentation (136–145). No REVISION/EXAMINATION/SCHEME_ONLY row, so no `classify_marker` rule was added.
- No table, drawing, `pict`, text box, OMML, hyperlink, tracked change, hidden run, list numbering or page/section break occurs anywhere in 78–145; every child is a plain paragraph.
- **Greeting list:** heading `LES SALUTATIONS` (84) followed by **49 rows carrying 47 distinct strings**. `Bon noel` appears twice (98, 133) and `Je vais bien` twice (113, 129). Three rows have no confident reading: `Bonsoir nuit` (92), `Bonjour nee` (96), `Bon paque` (114). `Bonjourmes mes camarades de la classe` (117) is garbled. `Vous avez bien` (128) is not a greeting or a formula. Standard orthography differs from several rows (`Bien venu` 101, `Bon aniversaire` 100, `Bonne appetite` 122, `Bon vaccance` 123, `A dimance` 119, `Cava` 112/127, `Bon marriage` 131, `Bon naissance / felicitation` 132), and accents are absent on most rows. The rows are reproduced verbatim below; this record does not present the errors as correct French.
- **Self-presentation:** heading `L’introduction/presentation` (136), one task line `Ecrivez sur une redaction moi-meme` (137), then eight prompts: nom, age, nationalite, etat, langue, address/domicile, profession, plat/couleur favori (138–145). There is no model text, no answer and no mark allocation. `Votre etat` (141) names a state or status field with no explanation; `Votre address/domicile` (143) asks for a home address that the replacement deliberately does not require.

### Greeting rows, children 84–133 (verbatim child text)
```
84: LES SALUTATIONS
85: Bonjour
86: Bonsoir
87: Bonjour monsieur
88: Bonjour madame
89: Bonjour mademoiselle
90: Bon après midi
91: Bonne nuit
92: Bonsoir nuit
93: Bonsoir papa
94: Bonjour maman
95: Au revoir
96: Bonjour nee
97: A bientot
98: Bon noel
99: Bonne annee
100: Bon aniversaire
101: Bien venu
102: Du courage
103: Bon travail
104: A lundi
105: A demain
106: A la prochaine fois
107: A tout a l’heure
108: Merci
109: Merci beaucoup
110: De rien
111: Comment?
112: Cava?
113: Je vais bien
114: Bon paque
115: Bonjour mon ami (e)
116: Bonjour mes am (e) s
117: Bonjourmes mes camarades de la classe
118: A mardi
119: A dimance
120: Bon week-end
121: Bonne chance
122: Bonne appetite
123: Bon vaccance
124: Soyez le bien venu
125: Bonne soiree
126: Bonjour maman, comment?
127: Cava mon enfant
128: Vous avez bien
129: Je vais bien
130: Bonsoir Cherie
131: Bon marriage
132: Bon naissance / felicitation
133: Bon noel
```

### Displacement by `SUP-SS1-FRENCH-GREETINGS-T1`
- **Objective 1 (greetings).** The replacement teaches `bonjour`, `bonsoir`, `salut`, `au revoir`, `à demain`, `merci`, `s’il vous plaît` and tu/vous with situations, and practices polite address and `à demain ; merci`. It has no counterpart for the celebration, weekday, departure, meal, work, encouragement, comeback, response or address-form rows of the source list, so the objective is PARTIAL.
- **Objective 2 (self-presentation).** The replacement teaches name, age, nationality, residence and profession in first and third person and practices a three-sentence third-person introduction. It has no counterpart for the source's self-description essay, and no teaching for the state, language, address or domicile and favourite dish or colour fields, so the objective is PARTIAL.

| Coverage id | Source children | Status | Binding |
|---|---|---|---|
| `FRENCH-T1-W03-OBJ-1` greeting and courtesy expressions | 84–133 | PARTIAL | `SUP-SS1-FRENCH-GREETINGS-T1` (core greetings only) |
| `FRENCH-T1-W03-OBJ-2` eight-field written self-presentation | 136–145 | PARTIAL | same (five fields; no essay) |

`FRENCH-BODY-003` and correction `SS1-02-french-COR-003` are unchanged. The correction's stated "scope review not done" is now partly answered by this record; the binding itself needs no change from this review.

## Edits
- `french.json`: added coverage entries `FRENCH-T1-W03-OBJ-1` (child-text hash `0af4ba74…09e0e`) and `FRENCH-T1-W03-OBJ-2` (child-text hash `c74af09a…a8630`), both PARTIAL to `SUP-SS1-FRENCH-GREETINGS-T1`, and open items `FRENCH-T1-W03-GREETING-SCOPE` (CONTENT, blocking) and `FRENCH-T1-W03-ESSAY-SCOPE` (CONTENT, blocking). No lesson, correction or asset added or changed.
- `QUEUE.json`: FR-WK-T1-W03 → IMPLEMENTED_TESTING_DEFERRED; added PENDING `FR-LES-T1-W03-GREETING-SET` and `FR-LES-T1-W03-SELF-ESSAY`; added both to `FR-SCOPE-AUTHORING-FINISH.depends_on` after `FR-LES-T1-W02-DEMONYMS`; counts recomputed (LESSON 33, 112 items); `next_runnable` set to the next in order.
- No lesson was authored and no source claim was verified or taught; the verbatim block above is evidence, not teaching material.

## Remaining
- Sourced practice for the untaught greeting categories and for the eight-field self-presentation, with the three unreadable rows recorded as owner decisions.
- Same-file edits should run sequentially: next in order is `FR-WK-T1-W04`.
