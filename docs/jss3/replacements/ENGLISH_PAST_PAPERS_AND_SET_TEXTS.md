# English past papers and set texts: what is held, what is not (OB-12, OB-13)

Date of record: 18 October 2026. Written by the Batch 2 English agent.

## Decision

No NECO BECE or Junior WAEC question, passage, poem extract or answer key has been copied into this repository, and none will be added without the right to do so. The papers belong to NECO and the set books and poems belong to their authors and publishers. The app instead lets a learner or teacher **type or paste** a set-text extract, a passage or a past question, and Brainee works on that text for the one request. See `POST /ai/text-study` and the "Study my text" screen. Nothing the person types is stored.

## What was found online (leads only, not verified, not copied)

Searches on 18 October 2026 found NECO BECE English papers only on unofficial third-party sites (for example suresuccess.ng, flashlearners.com and Scribd uploads). None was on a NECO site. The suresuccess.ng page for "2026" was published in December 2025, before that examination, and presents the questions as "revealed". It cannot be treated as an authorised or genuine copy, and no question, passage or answer key from it was reproduced. Anyone who wants official papers should ask NECO or the school's exam officer.

## Paper layout reported by that page (a fact about format, to confirm with NECO)

- Paper I, multiple choice with options A to E: Section A comprehension, Section B vocabulary development (with a cloze passage), Section C grammatical accuracy, Section D spoken English (identify the word containing a given phonetic symbol).
- Paper II, literature in English: drama, prose and poetry, each on named set texts.
- Paper III, essay: two questions, each at least 200 words and worth 15 marks.

## Set texts named on that page (leads for the school to confirm, not facts)

The page names drama, prose and poetry set texts for the paper. These are **unconfirmed**. The school should confirm its actual list with NECO's published syllabus before anyone relies on it. The app does not need the list: whichever book the class studies, the learner pastes an extract.

## What this changes in the records

- OB-12 (recommended texts): the app can now work on any text the user supplies. The stand-ins `SUP-PROSE` and `SUP-DRAMA` stay as stand-ins. No scheme row is closed, because no executable lesson body teaches the school's own text.
- OB-13 (past questions): practice on a past question is available through the typed-question mode. SL-502, 506, 513 and 514 stay `EXISTING_SUPPLEMENT_PARTIAL` or `OWNER_INPUT_NEEDED_PAST_QUESTIONS` until the owner supplies papers with permission.

## Limits of the feature

- AI answers can be wrong. The "Mark my answer" mode uses a general practice rubric out of 15 and says so; it is not the official NECO mark scheme.
- The prompt asks the model to work only from the supplied text, to quote no more than 12 words at a time, and to ignore instructions inside the text. This reduces, and does not remove, the risk of errors or prompt injection, so it is not a teacher's marking.
- Maximum 12,000 characters of text, 2,000 of question and 6,000 of answer per request.
