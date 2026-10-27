# SS1-03 checkpoint (worker B: mathematics, further-mathematics, physics, technical-drawing)

Task branch: `ss1/SS1-03-20261027-b`. Base: master `af06b0d` (SS1-01 foundation PR #69 + SS1-02 PR #70). Contract followed: the MERGED #69 `ss1-subject-v1` (not open PR #71).
Contract: `ss1-subject-v1`. Status per subject below. Overall claim: **IMPLEMENTED — TESTING DEFERRED BY OWNER** only where a
subject says so; every package is `PENDING` with blocking open items, so none is deliverable yet.

Resume rule: do not re-read completed sources. Parsed row IDs, hashes and per-row equation-loss counts are in
`evidence/parsed_rows.json`. Authoring code is in `author/` (reads private extracts under /home/claude/work; regenerate with
`node author/extract_sources.cjs` against a staged archive).

## 1. mathematics — IMPLEMENTED (partial; testing deferred)
Sources (3): 1st/2nd/3rd term. Package: `backend/src/db/ss1/subjects/mathematics.json`; tests: `tests/ss1/mathematics.test.mts`.
- Authored and corrected: 1st-term Weeks 1, 3, 4, 5, 6, 10 (6 supplements, 6 delivery corrections). Each lesson has objectives, worked
  examples recomputed in code, practice with full answers and marking.
- Source defects found and corrected (kept in provenance, not delivered): 5430 vs 5454 column sum; "no rule for 7"; base x = ±8; 2033₄ vs 2032₄;
  "modulus must exceed the number"; 16×7=117; 2x+3≡1 (mod 6) has two solutions; standard-form range; g = 2lπ/T vs 4π²l/T²; joint-variation k = 6 vs 5;
  Week 6 (Indices) delivered with NO laws of indices at all.
- NOT done: 1st-term Weeks 2, 8, 9 (PARTIAL); all 2nd-term (10 rows) and 3rd-term (11 rows) bodies unreviewed (PARTIAL, `OI-MATH-002`);
  3rd-term WMF/OLE equation objects untranscribed (`OI-MATH-004`); log/antilog tables not supplied (`OI-MATH-003`).
- Foundation request `OI-MATH-001`: plain mammoth extraction drops OMML equations and superscripts/subscripts (see HANDOFF.json).
- Not executed: schema parse, compiler plan, tests, importer dry run.

## 2. further-mathematics — IMPLEMENTED (partial; testing deferred)
Sources (3). Package: `backend/src/db/ss1/subjects/further-mathematics.json`; test: `tests/ss1/further-mathematics.package.test.mts`;
asset: `backend/src/db/ss1/assets/further-mathematics/fm3-w2-flowchart-perimeter.svg` (authored derivative, sha/bytes in package).
- 3rd term: ALL six parsed rows replaced by authored lessons (flowcharts; gradients and curves; slope/parallel/perpendicular; vector magnitude/unit;
  vector operations/direction cosines; angle between lines and line forms). Six hash-bound delivery corrections. Answers verified in code.
- Source defects corrected: flowchart example had no figure or solution; `|-2i-5j| = √(-2²-5²)` notation; `3p` computed as 9i-9j so `3p-2q` was
  3i-19j (correct: -19j); perpendicular example headed "parallel"; vertical-line case unsolved; Week 6 repeats Week 5.
- Heading alias for the 3rd-term source rests on a textbook title only (no subject heading in the document) — `RULE-FM-T3-ALIAS`, owner confirmation needed.
- NOT done: 1st term (11 rows) and 2nd term (10 rows) unreviewed → PARTIAL (`OI-FM-002`); 3rd-term scheme and weeks 1, 7, 9-12 absent
  from the archive (`OI-FM-003`, UNRESOLVED). Rights: 2nd/3rd-term sources embed a commercial tutor's advertising pages with a personal phone
  number and e-mail (`OI-FM-004`); those images are NOT bound as assets. Same branding is in Mathematics 2nd/3rd term and other subjects' sources.
- Marker anchors for FM and Mathematics were checked against the importer's parser output (REVISION anchors in exactly one row; SCHEME_ONLY in none).

## 3. physics — NOT STARTED
Read so far: 3rd term Weeks 1-4 only. Defects already found (not yet authored): fuse "current rating" defined as the MINIMUM current (is the
maximum carried indefinitely); "merger tester" (megger); `I = E / R + r` needs brackets `E/(R+r)`; Week 4 assignment contains unrelated circular-motion items;
scheme says "Diffusion and Osmosis" but Week 5 body is matter/atomic structure/states.

## 4. technical-drawing — NOT STARTED
Known: parser yields 19 rows; rows 0-10 are scheme-table lines (15-79 chars) and rows 11-18 are the real lessons; 94 drawings, 17 OLE objects, WMF figures
(not an allowed asset MIME; need conversion + provenance or open items).
