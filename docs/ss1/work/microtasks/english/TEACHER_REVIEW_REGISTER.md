# SS1 English Language — teacher review and student-readiness register

Generated from the current `master` English package for review; this is a worksheet, not an approval record.

## Current release position

- Package: `PENDING`
- Lessons requiring individual teacher/owner review: **149**
- Sources: 3 (1st, 2nd and 3rd Terms)
- Objective coverage records: 668
- Assets: 1
- Delivery corrections: 24
- Blocking open items: 1

- Coverage status: 616 implemented-equivalent, 12 supported, 32 scheme markers, 8 partial, 0 unresolved (668 total).
- Approval state: all 149 lessons are still PENDING; all 149 verification states remain DEFERRED.
- Asset state: 1 registered English asset; its approval/verification gate remains pending.

## Implementation and verification update — 11 November 2026

- The English-specific correction resolver is connected to learner topic listing, topic completion, assessment access, assessment withdrawal and stale-cache retirement.
- The resolver is restricted to secondary SS 1 English Language and exact source file/term/body identity. It withholds changed or unapproved/unverified source rows, retires linked stale assessments, and keeps answer keys and marking criteria out of student study notes.
- The Second Term affix assignment now teaches two examples and meanings for sixteen identifiable prefixes, with keyed practice. The source fragments `mat` and `ploy` remain explicitly unconfirmed and are not taught as prefixes.
- English verification passed: package tests **13/13**, learner-delivery regression tests **8/8**, package schema and registered-asset validation, all three source-member hash checks, and the real parser/compiler plan-only assertions.
- The real parser produced 37 First Term, 21 Second Term and 31 Third Term original rows; retained 32 scheme-only markers; and emitted all 149 authored English supplements. The English-specific blocker list matched the package exactly.
- The compiler plan is still **not ready for database import**: 160 English-specific blockers are expected (149 lesson approvals, 8 partial coverage entries, asset approval, pending package state and the blocking owner-approval item). No database write was attempted.
- PR #499 contains the English delivery integration; PR #500 contains the renderer and verification-workflow fix. PR #504 is a test-only follow-up with the current English verification run passing.


**Do not mark a lesson approved merely because it exists, has practice, or has been committed.** For each lesson, the reviewer must read the complete teaching body, inspect examples and every answer/marking criterion, then record a real decision and auditable reference.

## Review procedure

1. Open the lesson by its exact ID in `backend/src/db/ss1/subjects/english.json`.
2. Review factual accuracy, age/SS1 suitability, clarity, completeness against its objectives, examples, Nigerian/British English usage where relevant, and assessment/key correctness.
3. Record one decision: `APPROVE`, `REVISION REQUIRED`, or `HOLD`.
4. For approval, supply a unique, retrievable approval reference and reviewer/date. For revision, identify the exact lesson ID and required change.
5. Only after actual review should the owner update `state.content_approval` and `state.approval_reference`. Verification remains a separate gate.

## Lesson-by-lesson review register

Decision values: `PENDING` / `APPROVE` / `REVISION REQUIRED` / `HOLD`.
Approval references must be real evidence references; do not use this worksheet itself as an approval reference.

### 1st Term (66 lessons)

| Lesson ID | Title | Objectives | Practice items | Decision | Reviewer / date | Approval reference |
|---|---|---:|---:|---|---|---|
| `SUP-SS1-ENGLISH-WORD-CLASSES-T1` | Word classes and noun categories | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T1` | Phrases, clauses and sentence functions | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PHONETICS-T1` | English sound symbols and listening contrasts | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-LETTERS-T1` | Writing a respectful informal letter | 2 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-READING-T1` | Reading details, inference, scanning and summary with an original passage | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-NOUNS-T1` | Noun forms: plurals, possessives, collectives and special cases | 3 | 8 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PRONOUN-ADJ-VERB-T1` | Pronouns, adjectives and verbs: types, kinds, formation and look-alike pairs | 6 | 10 | PENDING |  |  |
| `SUP-SS1-ENGLISH-MEANING-T1` | Word meanings in context: clues, senses and figurative use | 3 | 8 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PHRASAL-VERBS-T1` | Phrasal verbs: meanings, object placement and gap-fill choices | 3 | 7 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERB-CONJ-PREP-T1` | Adverbs, conjunctions and prepositions: formation, function and dependent pairs | 5 | 8 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ESSAY-REPORT-T1` | The five essay types, the formal report and the minutes of a meeting | 6 | 9 | PENDING |  |  |
| `SUP-SS1-ENGLISH-IDIOMS-T1` | Idioms: fixed form, reviewed meanings and use in sentences | 6 | 9 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ENTERTAINMENT-VOCAB-T1` | Entertainment vocabulary: sport and the theatre, with reviewed glosses | 6 | 8 | PENDING |  |  |
| `SUP-SS1-ENGLISH-MONOPHTHONGS-T1` | Monophthongs: pure vowels and two examples of each sound | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-REVISION-W03-T1` | Revision: reported speech, suffixation and the passive voice | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-NOUN-PHRASE-FUNCTIONS-T1` | Noun phrases and verb phrases: heads, non-finite phrases and functions | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-AGRICULTURE-VOCAB-T1` | Agriculture vocabulary: general terms, livestock and fishery, with reviewed glosses | 6 | 7 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SPELLING-MISSPELT-T1` | Commonly misspelt words: patterns, dictionary checks and a keyed dictation | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-REVISION-W04-T1` | Revision: word meaning in context with a keyed nearest-meaning set | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SENTENCE-KINDS-T1` | Kinds of sentences: clause counting, the five-way label and a keyed write-five task | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-EXPOSITORY-ESSAY-T1` | Expository essay: features, a worked plan for ‘Honesty is the Best Legacy’ and a marked task | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-REVISION-W05-T1` | Revision: adjective order, tag questions, silent-letter spelling and determiners | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FIGURES-OF-SPEECH-T1` | Figures of speech: simile, metaphor, personification, irony and the rhetorical question | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-DESCRIPTIVE-ESSAY-T1` | The descriptive essay: scope, dominant impression, sensory detail and organisation | 5 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERBIAL-CLAUSE-T1` | The adverbial clause: definition, subordinators, the eight kinds, punctuation and a keyed exercise | 6 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-DIPHTHONGS-T1` | The eight diphthongs: definition, spellings, accent variation and checked examples | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-REVISION-W06-T1` | Revision: matching the single vowel sounds /æ/, /ɪ/, /iː/, /ʌ/ and /ɔː/ | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-STOCK-INSURANCE-VOCAB-T1` | Vocabulary development: stock exchange and insurance | 6 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W05-PASSAGE-C-EQUIVALENT-T1` | Original comprehension practice: a community seed-saving group (Week 5 parallel assignment) | 5 | 10 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERTISING-COMPREHENSION-T1` | Advertising: original comprehension passage, evaluation and oral announcement | 5 | 9 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W06-ORIGINAL-REVISION-SET-T1` | Original integrated revision practice: 20 English questions (Week 6 parallel assignment) | 5 | 20 | PENDING |  |  |
| `SUP-SS1-ENGLISH-TRANSPORT-T1` | Transport vocabulary: aviation, maritime, rail and road | 5 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-NOUN-CLAUSES-W07-T1` | Noun clauses: the five functions and their correct analysis | 6 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CONSONANTS-W07-T1` | The 24 English consonant sounds: place, manner, voicing and examples | 5 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-NARRATIVE-W07-T1` | Narrative writing: a worked plan, model ending and 20-mark rubric | 5 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W01-ORIGINAL-EQUIVALENTS-T1` | Original equivalent: reading, lexis and structure, and spelling practice | 3 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W01-GENERAL-DIAGNOSTIC-REVISION-T1` | General diagnostic revision: reading, language use, spelling and writing | 5 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W02-ORIGINAL-READING-LIBRARY-EQUIVALENTS-T1` | Original reading equivalents: belief, comprehension and library vocabulary | 5 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADJECTIVES-PHRASES-CLAUSES-T1-W08` | Adjectives, adjectival phrases and adjectival clauses | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ARGUMENTATIVE-ESSAY-T1-W08` | Argumentative essays: question types, planning and a worked justification | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEK8-REVISION-T1` | Week 8 original revision: word stress, contextual meaning and debate | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-COMPREHENSION-METHOD-T1-W09` | Answering comprehension questions and contextual synonyms | 3 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-EMPHATIC-STRESS-T1-W09` | Emphatic stress: contrast, correction and question matching | 4 | 7 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEK9-REVISION-T1` | Week 9 original revision: antonyms, word bank and informal letter | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SUMMARY-WRITING-T1-W10` | Summary writing: selecting, condensing and checking main points | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-AFFIXES-T1-W10` | Prefixes and suffixes: meanings, word formation and spelling changes | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERBIAL-PREPOSITIONAL-PHRASES-T1-W10` | Adverbial phrases and the functions of prepositional phrases | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEK10-REVISION-T1` | Week 10 original revision: phrasal verbs and contextual vocabulary | 2 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-INFORMAL-LETTER-FEATURES-T1-W11` | Informal letters: layout, openings, body and closing | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ARTICLES-T1-W11` | Articles: a, an, the and zero article | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CONSONANT-SPELLINGS-T1-W11` | Consonant sounds and spelling patterns: /b d k f g dʒ h/ | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEK11-REVISION-T1` | Week 11 original revision: sentence completion and contextual vocabulary | 2 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ENTERTAINMENT-READING-T1-W03` | Entertainment vocabulary and contextual reading: original replacement assignment | 4 | 20 | PENDING |  |  |
| `SUP-SS1-ENGLISH-DRAMA-READING-ASSIGNMENTS-T1-W04` | Week 4 original equivalents: drama, phrases, agriculture and reading | 5 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-READING-ASSIGNMENTS-T1-W08` | Week 8 original reading equivalents: comprehension, adjectives and argument | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CONSONANTS-READING-T1-W11` | Six consonant sounds: /v/, /θ/, /ð/, /n/, /t/ and /d/ | 3 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEK7-READING-ASSIGNMENTS-T1` | Week 7 original reading assignments and weekend parallel practice | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W04-UNIFIED-TEST` | Week 4 unified classroom test: reading, grammar, agriculture vocabulary and spelling | 6 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CONSONANT-APPLICATION-T1-W08` | Applying and distinguishing consonant sounds | 6 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-RELIGION-VOCAB-T1-W09` | Religion vocabulary: neutral meanings, traditions and respectful use | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-JUDICIARY-VOCAB-T1-W11` | Judiciary vocabulary: court roles, processes and legal terms | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-JEWISH-COMMUNITIES-READING-T1-W08` | Jewish communities: original reading comprehension and evidence-based answers | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-RELIGION-READING-T1-W09` | Religion vocabulary in context: original reading assignment | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-W07-CONSONANT-REVISION-EQUIVALENT-T1` | Original consonant sound-letter revision: marked targets and keyed practice | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-AUDIO-PRONUNCIATION-MODEL-T1` | Synthetic British English pronunciation model: listening contrasts and stress | 3 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FORMAL-INFORMAL-CONVERSATION-T1-W09` | Formal and informal conversation: register, dialogue and emphatic correction | 4 | 4 | PENDING |  |  |

### 2nd Term (23 lessons)

| Lesson ID | Title | Objectives | Practice items | Decision | Reviewer / date | Approval reference |
|---|---|---:|---:|---|---|---|
| `SUP-SS1-ENGLISH-AFFIXES-T2` | Affixes and reliable word formation | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-READING-T2` | Reading details, inference, scanning and summary with an original passage | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-MEANING-T2` | Synonyms, antonyms and contextual choice | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERBS-TENSE-T2` | Adverbs and tense in context | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ESSAY-TYPES-T2` | Planning four essay types | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-AFFIXES-ROOTS-T2-W01` | Affixes, roots and word formation across word classes | 5 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FAMILY-HEALTH-READING-SUMMARY-T2-W02` | Family wellbeing: comprehension, vocabulary, linking words and summary | 6 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FORMAL-LETTER-T2-W03` | Formal letters: purpose, layout, model and community request | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-TIME-TENSE-STRUCTURES-T2-W03` | Time, tense and selected verb structures | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SYNONYMS-PICTURE-WORDS-T2-W04` | Synonyms, picture words and meaning in context | 5 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SCANNING-COMPREHENSION-T2-W05` | Reading for facts: scanning and supported inference | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-RELIGION-VOCAB-T2-W06` | Religion vocabulary in context: neutral definitions and distinctions | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PHOTOGRAPHY-VOCAB-T2-W06` | Photography vocabulary: camera, lens, shutter and exposure | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERBS-FEATURES-T2-W07` | Adverb formation, kinds and functions in sentences | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PRESENT-TENSE-T2-W07` | The simple present: tense, time and use | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERB-CONVERSION-KEYS-T2-W07` | Adjective-to-adverb conversion: forms and exceptions | 3 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ANTONYM-PRACTICE-T2-W08` | Gradable and complementary antonyms: original practice | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-DESCRIPTIVE-NARRATIVE-WRITING-T2-W09` | Descriptive and narrative essays: plans, models and writing | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-T2-W07-ORIGINAL-ASSIGNMENT` | Original replacement assignment: adverbs and the simple present | 4 | 10 | PENDING |  |  |
| `SUP-SS1-ENGLISH-RELIGION-IPA-T2-W06` | Phonemic transcription of four religion-related words | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ESSAY-ASSIGNMENT-PLANS-T2-W09` | Original plans and marking rubric for the two Week 9 essay titles | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-REVISION-T2-W10` | Second Term cumulative revision: original passage, grammar, vocabulary and writing | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-STEEL-DEVELOPMENT-T2-W05` | Steel production and development: listening for facts and writing a report | 4 | 4 | PENDING |  |  |

### 3rd Term (60 lessons)

| Lesson ID | Title | Objectives | Practice items | Decision | Reviewer / date | Approval reference |
|---|---|---:|---:|---|---|---|
| `SUP-SS1-ENGLISH-PHONETICS-T3` | English sound symbols and listening contrasts | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-AFFIXES-T3` | Affixes and reliable word formation | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-STRESS-T3` | Word stress, intonation and dictionary use | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T3` | Phrases, clauses and sentence functions | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-MEANING-T3` | Synonyms, antonyms and contextual choice | 2 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-READING-T3` | Reading details, inference, scanning and summary with an original passage | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CONTEXTUAL-MEANING-T3-W01` | Contextual word meanings: man, appreciate, debt, forgiveness and rail | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-REVISION-T3-W01` | Original revision practice: all taught 2nd Term English topics | 7 | 12 | PENDING |  |  |
| `SUP-SS1-ENGLISH-DICTIONARY-USE-T3-W01` | Using a dictionary: word class, pronunciation, stress and collocation | 5 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SPELLING-T3-W01` | Commonly misspelt words: spelling patterns, word division and correction | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CONTEXTUAL-READING-T3-W01` | Contextual word meanings: an original reading passage and keyed comprehension | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-BEAUTY-MAIN-POINT-T3-W02` | Reading for the main point: Beauty (original passage and keyed comprehension) | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SUMMARY-WRITING-T3-W02` | Summary writing: question-and-answer summaries, precis and original reading practice | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADVERTISING-VOCAB-T3-W02` | Advertising vocabulary: six reviewed terms and original reading practice | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ADJUNCTS-T3-W02` | Adjuncts: forms, six classroom categories and original keyed practice | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-NARRATIVE-ESSAY-T3-W02` | The narrative essay: features, worked plan, model and marked practice | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-ASSESSMENTS-T3-W02` | Week 2 weekend assessment: antonyms in context and clause examples | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-COMPREHENSION-SUMMARY-T3-W03` | Comprehension and summary: original passages on fishing and leisure time | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-CLAUSES-T3-W03` | Introduction to clauses: features, finite and non-finite forms, and subordinate clause types | 5 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-EXPOSITORY-ESSAY-T3-W03` | The expository essay: purpose, structure, worked plan and marked practice | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FAMILY-HOUSEHOLD-VOCAB-T3-W03` | Family relationships and household vocabulary: reviewed definitions and keyed practice | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-ASSESSMENTS-T3-W03` | Week 3 weekend assessment: sounds in spelling and noun-clause functions | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-RHYMES-T3-W04` | Rhymes and vowel sounds: rhyme by sound, original pairs and keyed practice | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FORMAL-LETTER-T3-W04` | The formal letter: layout, register, model and keyed practice | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-GOVERNMENT-VOCAB-T3-W04` | Government and politics vocabulary: nine reviewed terms and keyed practice | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-ASSESSMENTS-T3-W04` | Week 4 weekend assessment: government vocabulary and balanced political letter writing | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SKIMMING-SCANNING-T3-W05` | Skimming and scanning: purpose, method and keyed practice | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SOUND-CONTRASTS-T3-W05` | Sound contrasts: /f/-/v/, /s/-/z/ and /ʃ/-/ʒ/ | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-NOMINALIZATION-T3-W05` | Nominalization: affixation, the + adjective, compounding and noun-forming suffixes | 5 | 7 | PENDING |  |  |
| `SUP-SS1-ENGLISH-AFFIXES-T3-W06` | Week 6 affixes: extended prefixes and suffixes | 5 | 8 | PENDING |  |  |
| `SUP-SS1-ENGLISH-STRESS-T3-W06` | Week 6: two-syllable word stress | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-STORY-WRITING-T3-W06` | Week 6 story writing: “It is a man’s world” | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-READING-ASSIGNMENTS-T3-W06` | Week 6 original reading equivalents: comprehension, syllables and stress | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-REVISION-T3-W06` | Week 6 original weekend revision: vocabulary, synonyms and determiners | 3 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SEMIFORMAL-LETTER-T3-W07` | Semi-formal letters: audience, register, layout and writing practice | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-READING-ENTERTAINMENT-T3-W07` | Reading for pleasure: Unit 9 Entertainment — original passage and comprehension | 4 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FINAL-E-SPELLING-T3-W07` | Spelling: dropping and retaining final e before suffixes | 4 | 7 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SENTENCE-ELEMENTS-PATTERNS-T3-W07` | Sentence elements and the seven basic simple-sentence patterns | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-HOMOPHONES-T3-W08` | Homophones: choosing the correct word from context | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-COMPARATIVES-T3-W08` | Functions and forms of comparatives | 5 | 7 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SUMMARY-WRITING-T3-W08` | Summary writing in a specified number of sentences | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-T3-W07-WEEKEND-REVISION` | Week 7 weekend parallel revision: sentence structure, spelling, reading and letter writing | 4 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ANTONYMS-T3-W09` | Antonyms: direct opposites, relationships and word formation | 4 | 10 | PENDING |  |  |
| `SUP-SS1-ENGLISH-JOURNALISM-ADVERTISING-VOCAB-T3-W09` | Journalism and advertising vocabulary: media, newsroom terms and scope | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PRONOUN-PERSON-T3-W10` | Pronoun reference: first, second and third person | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-ARGUMENTATIVE-ESSAYS-T3-W10` | Argumentative essays: indiscipline and co-education | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-COMPREHENSION-SPEAKING-T3-W10` | Comprehension and speaking sequence: a family discussion | 4 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-PHONETICS-T3-W10` | Contrasting /ɪ/ and /iː/: spelling variants and minimal pairs | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-REVISION-T3-W10` | Week 10 weekend parallel revision: pronouns, phonetics, speaking and argument | 4 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SUMMARY-WORD-COUNT-T3-W11` | Summary writing to a specified word count | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-BUILDING-VOCAB-T3-W11` | Building vocabulary: structure, materials, trades and fittings | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-COMPARATIVES-T3-W08` | Original Week 8 weekend comparative practice | 1 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-SYNONYMS-T3-W11` | Synonyms: shades of meaning, collocation and context | 4 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-ANTONYMS-T3-W09` | Original Week 9 weekend antonym practice | 1 | 5 | PENDING |  |  |
| `SUP-SS1-ENGLISH-WEEKEND-REVISION-T3-W11` | Week 11 weekend parallel revision: summary, building vocabulary and synonyms | 4 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FAST-READING-T3-W11` | Faster reading: skimming, scanning and accurate comprehension | 4 | 2 | PENDING |  |  |
| `SUP-SS1-ENGLISH-FINAL-E-READING-T3-W07` | Final-e spelling: original reading and word-hunt activity | 4 | 3 | PENDING |  |  |
| `SUP-SS1-ENGLISH-INTONATION-T3-W08` | Intonation in polite requests and greetings | 4 | 4 | PENDING |  |  |
| `SUP-SS1-ENGLISH-STATUTORY-TOPIC-T3-W09` | Topic, theme and key sentences: a worked passage analysis | 3 | 6 | PENDING |  |  |
| `SUP-SS1-ENGLISH-DIPHTHONGS-CONJUNCTS-DISJUNCTS-T3-W05` | Diphthongs /eɪ/ and /aɪ/; conjuncts and disjuncts | 5 | 6 | PENDING |  |  |

## Outstanding curriculum decisions and limitations

- **T2 Week 1 assignment:** the source asks for examples of prefixes `mat` and `ploy`. These are not accepted as independent productive English prefixes in the current teaching resource. The remaining assignment objective is unresolved. Teacher should either provide the intended corrected forms or explicitly confirm that these two malformed fragments are excluded while the other valid prefix targets are taught.
- **T2 Week 6 sexuality vocabulary:** the source heading mentions sexuality but provides no word list or objective detail. The current package teaches the substantiated photography and religion strands and does not invent age-sensitive content. Teacher may supply a precise SS1-appropriate scope if required.
- **T3 Week 1 reading vocabulary:** the exact source passage needed to validate the original contextual meanings was not supplied. The package uses a labelled original reading equivalent; the additional age-sensitive dictionary sense remains a teacher decision.
- **T3 Week 3 family vocabulary:** the culturally specific bride-price clue has no reliable universal answer. The package supplies neutral family/household teaching and does not guess a local term.
- Other open items record source defects, missing prescribed textbook pages, editorial choices, or later verification. Review their exact records in `open_items[]` before treating a source-specific task as satisfied.

## Technical and release gates

- Package JSON/schema, body hashes, IDs, references, marks and source-rule guards have existing drafted regression coverage. The English test file has **not** been executed.
- Full tests, TypeScript checks, importer/database checks, runtime checks, device checks and deployment remain deferred by the project owner. This register does not claim they passed.
- The SS1 contract explicitly states that package JSON alone does not prove student delivery. Shared runtime integration and the later SS1-08 verification/release process remain separate requirements.
- Do not set `package_status` to `IMPLEMENTED`, lesson approval to `APPROVED`, or verification to `VERIFIED` without the corresponding real evidence.

## Package state at generation

- Package status: `PENDING`
- Lessons: 149; approval states: {"PENDING":149}
- Verification states: {"DEFERRED":149}
- Blocking open items: ENGLISH-CONTENT-APPROVAL

Updated 2026-11-11 after English delivery integration and CI verification. Regenerate after any package change; do not treat this snapshot as live state.