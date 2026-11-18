# Online question-bank ingestion and rights register

## Scope and separation
This is an independent online-learning corpus. It uses only the `question_bank_*` tables and the global-admin `/question-bank` API. It does not read from or write to `scores`, `assessment_questions`, `report_roster_memberships`, attendance, or physical report-card tables.

## Source research (18 November 2026)
- **WAEC:** WAEC Nigeria's FAQ directs candidates to its official e-learning portal: http://e-learning.waecnigeria.com. The portal is recorded as `reference_only`; no republication licence was verified.
  - FAQ: https://waecnigeria.org/faq
- **NECO:** https://neco.gov.ng/ provides official exam, syllabus, timetable and CBT information. No open past-question redistribution licence was verified.
- **JAMB:** https://www.jamb.gov.ng/ provides official information and links to IBASS (syllabus system). JAMB's published UTME training manuals document the exam format, but do not grant a third party a right to reproduce past questions.
  - JAMB site: https://www.jamb.gov.ng/
  - JAMB 2026 training manual: https://jamb.gov.ng/PDFs/2026/2026%20TRAINING%20MANUAL%20%20final.pdf
- Third-party question banks and PDFs are discovery leads only. Their accessibility, free access, or statement that questions are "past questions" is not proof of a transferable reproduction licence. Do not scrape them or import their content without rights evidence.

## Rights statuses
- `licensed`: a written licence/permission with scope, term, attribution and redistribution rights is recorded.
- `public_domain`: documented legal basis and evidence that the exact material is public domain.
- `original_generated`: original questions created for this platform; not copied from a past paper.
- `reference_only`: may be visited for research; no reproduction permission.
- `permission_pending`, `restricted`, `unknown`: ingestion blocked.

The database trigger enforces source-to-question rights status. The API rejects a past-question import unless the source is active, the board matches, the source is explicitly licensed/public-domain, and rights evidence is recorded. Original/AI-generated content must have no exam year and be labelled "Original practice — not a past paper".

## Pilot
Six original AI-generated practice questions were added as `reviewed` and answer-checked, but not published or represented as historical examination items. Subject-expert approval is still required before student delivery:
- WAEC track: Mathematics (linear equations), Biology (osmosis)
- NECO track: Mathematics (percentages), Biology (photosynthesis)
- JAMB track: Mathematics (arithmetic sequences), Chemistry (atomic structure)

Every pilot item has an answer, explanation, one mark, and a subject/topic mapping. The question number is an `AI-GEN-###` identifier; exam year is NULL; paper is explicitly labelled original practice. No restricted past-question wording was copied.

## Source gaps
For each WAEC, NECO and JAMB Mathematics, Biology and Chemistry combination, two distinct gap records are created: `past_question_rights` remains open until written reuse permission or a documented public-domain basis is obtained; `ai_generation` is marked `ready_for_ai_generation` for original content creation. The six pilot items cover WAEC Mathematics/Biology, NECO Mathematics/Biology, and JAMB Mathematics/Chemistry.

## API (global admin only)
- `GET /question-bank/summary`
- `GET /question-bank/subjects`
- `GET /question-bank/sources`
- `POST /question-bank/sources`
- `GET /question-bank/gaps`
- `GET /question-bank/questions?board=WAEC&subject_code=MATHEMATICS&review_status=reviewed`
- `POST /question-bank/ingest`

Import payload shape:
```json
{
  "batch_key": "waec-maths-licensed-2024-paper1-v1",
  "source_id": "source-uuid",
  "questions": [{
    "board": "WAEC",
    "exam_year": 2024,
    "subject_code": "MATHEMATICS",
    "paper": "Paper 1",
    "question_number": "12",
    "question_type": "mcq",
    "stem": "Question text",
    "options": [{"key":"A","text":"Option A"},{"key":"B","text":"Option B"}],
    "correct_answer": {"key":"B","value":"Option B"},
    "explanation": "Editorial explanation",
    "marks": 1,
    "topic_slug": "linear-equations",
    "content_origin": "past_question"
  }]
}
```

Imports are transactional and idempotency keys are unique. The pipeline does not download or scrape external sources. It requires the operator to provide the rights-reviewed material and source locator.

## Operational limitation
The first version is an ingestion and curation API, not a student-facing CBT delivery feature. Student delivery, attempt tracking and scoring must be added as a separate online-learning feature and must not be wired into physical school scores.
