# SS1-03 checkpoint (worker B: mathematics, further-mathematics, physics, technical-drawing)

Task branch: `ss1/SS1-03-20261027-b`. Base: master `77e67d5` (contains SS1-01 foundation, PR #69).
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
