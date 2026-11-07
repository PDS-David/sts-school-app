# MATH-LES-T1-W02-NUMBER-BASES — Mathematics, 1st Term Week 2 replacement lesson

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; not approved, not verified). Week 2 is **not delivered**: the row is not yet bound to this lesson (`MATH-COR-T1-W02-NUMBER-BASES`), and `OI-MATH-T1-W02-FACT-DEFECTS` and `OI-MATH-T1-W02-ASSESSMENT-GAPS` still need teacher confirmation, so `package_status` stays **PENDING**.

## Inputs
- Base: master `679ab8b` (cloned 2026-11-07); branch `agent/maths-further-maths-ss1`. No `AGENTS.md` consulted beyond the repository README and SS1 contract files already named by the task.
- Archive `docs/ss1/sources/SSS1-original.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**. All six assigned Mathematics and Further Mathematics members were extracted to private scratch and each member's SHA-256 and byte count **matched** `SOURCE_ASSIGNMENTS.csv` (`SS1-SRC-0c9004137f95` d8cd4954…671cb, 819,678 bytes, used here). Nothing extracted is committed.
- Equation-aware reading: a private OMML render of `word/document.xml` of `MATHss1.docx` (`m:f` as `(num)/(den)`, `m:sSub` as `base_{script}`, `m:sSup` as `base^{script}`). Paragraph indices follow the existing convention (`p0` = `Week 2.`). The 20 exercise items were read at p74 (assessment 1), p76 (assessment 2) and p78 (assessment 3).

## Source items recovered (not visible in the delivered text)
| Assessment | Items as printed |
|---|---|
| 1 | 312.21 (base 4); 1051.11 (base 8); 23411 (base 6) |
| 2 | 2/5; 9/20; 3/4; 6/7; 5/6 (to bicimals) |
| 3 | 56 (base 8); 124 (base 7); 10001 (base 2); 121103 (base 4), each to base 5, base 12, base 15 |

## Change
`mathematics.json`: lesson `SUP-SS1-MATHEMATICS-T1-W02-NUMBER-BASES` added after the Week 1 lesson (body SHA-256 `70b38e8812081ad677d210c6c99ea6dc2452c2c7ab556ff85f4a79e4b9202b66`; 4 objectives; practice `M1W2-Q1` to `Q4`, 36 marks). It teaches: base and digit-versus-number with names and digit letters; conversion to base ten including an unknown base; fractional numerals (1011.01 in base two = 11 1/4); repeated division with complete ladders; conversion through base ten; base ten fraction to bicimal with recurring notation. Q1–Q3 key all 20 source items; Q4 is original (unknown base). Seven W02 coverage entries now `IMPLEMENTED_EQUIVALENT` with objective-level evidence. Required-action notes appended to the two open items (blocking flags unchanged). Queue item implemented, counts recomputed (25 / 65 / 9), `MATH-COR-T1-W02-NUMBER-BASES` now runnable.

## Mathematical checking (all recomputed; nothing taken from the source)
- Conversions to base ten: 95, 117, 281 (unknown base, x = 8), 11 1/4, 14 3/5, 54 9/16, 553 9/64, 3391, and 46, 67, 17, 1619 — by exact fractions and by Python `int(s, base)`.
- Ladders: 63 division steps checked with `divmod`; every answer converted back to base ten. Answers: 1757 (base 8), 1111101111 (base 2), 535 (base 12), 2F9 (base 16), 165 (base 8), 3B (base 12); 141/3A/31, 232/57/47, 32/15/12, 22434/B2B/72E.
- Bicimals: 2/5 = 0.(0110), 9/20 = 0.01(1100), 3/4 = 0.11, 6/7 = 0.(110), 5/6 = 0.1(10), 2/3 = 0.(10), 3/8 = 0.011. 23 doubling steps checked; each bicimal summed back (terminating part plus geometric series of the repeating block) to its fraction.
- Quadratics: (x − 8)(4x + 35) = 4x² + 3x − 280 and (x − 6)(2x + 13) = 2x² + x − 78 expand correctly; only whole-number roots larger than every digit are kept.
- Digit validity: every printed numeral uses only digits below its base.
- Marking: every practice item's criterion marks sum to its marks (6, 10, 16, 4).
- Schema: the repository's own `packageSchema` (zod 3, installed in scratch, not in the repo) parses both packages; lesson body hashes and `lesson_ids` references resolve.

## Source defects found (kept in provenance, not delivered)
1011.01 in base two printed as 11 3/4 (correct 11 1/4); unusable definition of base number; "no number" for "no digit"; the hexadecimal line lists digits as bases; base twelve and fifteen symbols never defined; `1twelve` subscript typo; the 117-to-octal ladder omits its last step; assessment 2 direction is never taught by a method.

## Decisions for the teacher/owner (not invented)
1. The school's wording for the definition of a base.
2. Digit letters for base twelve and fifteen: this lesson uses A, B, ... (A = ten, B = eleven; base fifteen up to E). Another set (for example T and E) would change Q3 answers (3A, B2B, 72E).
3. Recurring bicimal notation or number of places expected: the lesson shows the repeating block in brackets and also two blocks with three dots.

## Not done / not run
Importer, compiler plan, `tests/ss1/mathematics.package.test.mts`, type checks, database and device checks were not run (owner-deferred). The delivery correction binding the source row to this lesson is a separate task (`MATH-COR-T1-W02-NUMBER-BASES`). No asset was needed (the row's drawings are division brackets and 1×1 placeholder pictures; disposition stays with `MATH-VIS-T1`).
