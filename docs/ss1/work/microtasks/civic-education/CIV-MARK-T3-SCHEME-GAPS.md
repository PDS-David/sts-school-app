# CIV-MARK-T3-SCHEME-GAPS — Third-Term scheme/body marker disposition

Status: `IMPLEMENTED_TESTING_DEFERRED`. Source marker comparison only. The original scheme labels and body labels are preserved. No numeric week is inferred, no combined body is split, and no lesson, coverage row, rule, correction, answer, asset, approval or verification is added.

## Verified input

- Source ID: `SS1-SRC-0dc1f445683f`.
- Exact member: `SSS 1/3rd Term SS1_/3RD TERM S1 CIVIC EDUCATION.docx`.
- Member SHA-256: `8790f478409619cb22a9a00d31a0069589c5277c27ecd81221ef76edf16d3ea1` (50,715 bytes).
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Scheme paragraphs: 2–38; body paragraphs: 42–435.
- Source inventory: `CIV-INV-T3.md`; all five body-block digests below were rechecked against the hash-verified member.

## Scheme markers — exact source labels

| Scheme paragraph(s) | Exact label / scope | Disposition against body |
| ---: | --- | --- |
| 6 | `WEEK 1 — Revision of last term’s work` | Revision marker only; no separate Week 1 teaching body appears. |
| 8–12 | `WEEK 2–3 — Cultism`; meaning/characteristics, groups/origin/reasons, government/society positions and prevention | One combined body `WEEKS 2 and 3`, paragraphs 42–148; indexed as `CIV-WK-T3-W02-03`. |
| 14–18 | `WEEK 4–5 — Law and order`; manifestations, importance, agencies and roles | One combined body `WEEKS 4 & 5`, paragraphs 149–243; indexed as `CIV-WK-T3-W04-05`. |
| 20–23 | `WEEK 6 — Respect for constituted authority`; meaning, types, importance | Body `WEEK 6`, paragraphs 244–305; indexed as `CIV-WK-T3-W06`. |
| 25–28 | `WEEK 7 — Employment and unemployment`; factors, poverty alleviation and guaranteed employment | Body is labelled `WEEKS 7 & 8`, paragraphs 306–367; indexed as `CIV-WK-T3-W07-08`. |
| 30–34 | `WEEK 8–9 — Capitalist democracy`; features, impediments, political parties and competition | Body is labelled only `WEEK 9`, paragraphs 368–435; indexed as `CIV-WK-T3-W09`. |
| 36 | `WEEK 10 — Revision of the term’s work` | Revision marker only; no separate general revision body appears. |
| 38 | `WEEK 11 & 12 — Examination & Closing` | Marker only; no examination paper, questions section, answer key or marking scheme appears. |

## Body labels — exact source sequence

| Body paragraph | Exact label | Body digest | Indexed record |
| ---: | --- | --- | --- |
| 42 | `WEEKS  2 and 3` | `e1f97adfc85c4a6681f5c80a8acf13b8350e501534da1c6a047f9ecfe11d25c2` | `CIV-WK-T3-W02-03.md` |
| 149 | `WEEKS 4 & 5` | `8d5be349145ace605fd4e55b03425a37c352b42fa6af1104b9c7b9943b403bb3` | `CIV-WK-T3-W04-05.md` |
| 244 | `WEEK 6` | `e498f658cee4838505538c6b178089de6b02ebe1037b21b663f92b60656f666b` | `CIV-WK-T3-W06.md` |
| 306 | `WEEKS  7 & 8` | `0109f949dfe364294716fa5cfe0eed4427366d10cc5bd31b1795ec6195acaa9f` | `CIV-WK-T3-W07-08.md` |
| 368 | `WEEK 9` | `875e5af48e132e7629b8b9fc90cdd5e4dac8f4bfc7a7c621c57e8825df4ba609` | `CIV-WK-T3-W09.md` |

## Exact marker/body mismatches and limits

1. **Week 1:** the scheme says revision of last term's work; no separate body follows. This is not evidence that the revision content or an assessment paper is present.
2. **Weeks 2–3:** scheme and body both indicate a combined unit. Preserve it as one source block.
3. **Weeks 4–5:** scheme and body both indicate a combined unit. Preserve it as one source block.
4. **Week 6:** scheme and body labels correspond.
5. **Employment:** scheme labels employment/unemployment as Week 7, but the body calls its employment block `WEEKS 7 & 8`. The body contains employment/unemployment, poverty and guaranteed-employment material. No separate Week 8 employment body is identified, and no split is inferred.
6. **Capitalist democracy:** scheme assigns the topic to Weeks 8–9, while the body labels the only corresponding block `WEEK 9`. The source does not provide a distinct Week 8 capitalist-democracy block. No material is moved from the employment block and no missing Week 8 lesson is fabricated.
7. **Week 10:** the scheme marker says revision, but there is no separate general revision body. Revision questions embedded within topic blocks are not a substitute for an identified general revision section.
8. **Weeks 11–12:** the scheme marker says examination and closing, but no examination paper, exam questions, marking guide or answer key is present in the member.

## Assessment and reading boundary by source block

| Body block | Assessment material actually present | What is absent |
| --- | --- | --- |
| Weeks 2–3 (pp.130–146) | Five multiple-choice revision prompts and essay questions | Answers, marks, marking guide, examination paper |
| Weeks 4–5 (pp.214–242) | Short-answer/revision prompts, multiple-choice items, weekend assignment and reading pointer | Answers, marks, marking guide, exam paper; referenced second-term e-note and external text |
| Week 6 (pp.278–303) | Two revision questions, multiple-choice and term-definition weekend tasks, reading pointer | Answers, marks, marking guide; referenced SS2 text |
| Weeks 7–8 (pp.343–364) | Two objective question blocks, short-answer prompts, weekend assignment and reading pointer | Answers, marks, marking guide; referenced SS2 text |
| Week 9 (pp.405–435) | Short-answer and multiple-choice revision, weekend assignment and reading assignment/reference | Answers, marks, marking guide; current party/logo list and referenced reading text |

The marker at scheme paragraph 38 does not establish that an examination exists. No assessment is inferred from the marker.

## Result and scope boundary

- Scheme/body alignment is recorded without correcting the source or changing any original labels.
- The combined blocks remain combined; no fabricated Week 2/3, Week 4/5, Week 7/8 or Week 8/9 splits are created.
- Week 1 and Week 10 remain revision markers only; Weeks 11–12 remain examination/closing markers only.
- No lesson, coverage row, package data, parser rule, answer, mark, exam paper, asset, correction or approval is added.
- The Third-Term source alias approval remains open.
- Automated tests, importer, database, runtime and student-device checks were not run; they remain deferred by the owner.

**Result:** `CIV-MARK-T3-SCHEME-GAPS` is complete as a source marker disposition only. It does not certify the term's curriculum or examination readiness.
