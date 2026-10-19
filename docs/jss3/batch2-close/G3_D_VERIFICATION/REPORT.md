# G3 — D (French, Social Studies, Civic Education, Agricultural Science) verification

Date: 19 Oct 2026. Base: master `072fbce`. Search-based verification; the private corpus was not available, so real-source tests were not re-run.

## Verified and corrected
| Claim | Result | Source |
|---|---|---|
| NBS GDP rebasing | Base year 2019, released 21 Jul 2025; 2024 nominal GDP N372.82 trillion. 2019 shares: services 53.09, agriculture 25.83, industry 21.08. The 2024 shares (55.5 / 27.8 / 16.7) come from Africa Check (secondary); the NBS table itself was not retrieved. Lesson now names both. | Channels TV, NAN, Africa Check |
| NDLEA | Decree 48 of 1989, now Cap N30 LFN 2004, operations from 1990. Original note "2000" is wrong. | NDLEA annual reports (ndlea.gov.ng) |
| NDE | National Directorate of Employment Act, 1989 No. 24, commencement 19 Oct 1989. | Laws of Nigeria (PLAC); labour.gov.ng |
| FCT area councils | INEC conducts them and is the only body that conducts local government elections (2026 poll was 21 Feb 2026). | INEC Chairman's remarks |
| Green Revolution | Launched 14 Apr 1980 (Federal Government publication, National Library repository). OFN launched May 1976 (20 May per one academic source). D-B05 closed. | nigeriareposit.nln.gov.ng; Nwaobi |
| Constitution amendment bill | **Error fixed.** The Sixth Alteration Bill 2026 provides for State Police Services only. It was sent to the 36 Houses of Assembly on 16 Sep 2026, and the Clerk stated it is the only alteration bill transmitted. Lessons previously said it covered electoral, judicial, local government and human-rights reform. It is a bill, not law; needs 24 states and assent. | Clerk of the National Assembly statement (VON, Leadership, Arise) |
| NAPEP | Launched 2001 (some sources 2000); FG accepted scrapping it; 2025 official warnings that it had long ceased. | Daily Trust; Wikipedia (secondary) |
| Section 9 thresholds | Two-thirds each House + 24 of 36 states; four-fifths for s.8, s.9, Chapter IV. | Constitution; Leadership; The Nigeria Lawyer |

## Still hedged
- Back to Land (Buhari, 1983-85): no reliable launch date found; lesson tells pupils not to memorise one.
- The 2024 GDP shares rest on Africa Check, not the NBS table.
- DSS 1986 Decree 19, NSCDC Act 2003/2007, SIEC ss.197-198 were verified earlier by worker D and not re-fetched here.

## French review
All 20 lessons read for conjugations, agreement, questions and mark totals (all totals re-added). One answer-key slip fixed (SUP-FR-PRESENT question 2: "nous nous levons"); one doubtful material answer softened (SUP-FR-GOUTS-OBJETS, "tableau"). Not certified by a teacher; no spoken French tested.

## Delivery corrections
All 23 D corrections are present in `jss3DeliveryCorrections.json`, match D's source hashes and replacement ids, and are covered by `tests/jss3-d-verification.test.mts` (fail-closed on changed text). The mechanism itself is on master (`jss3DeliveryCorrection.ts`). Hash-level matching against the real source text needs the private corpus and was not re-run.

## Open
- **SL-281**: needs the actual last-term French examination paper and mark scheme. Not supplied; not fabricated.
- Teacher certification; Node 24.19.0 full-source run with the corpus.

## Records
`IMPLEMENTED_LESSONS.csv` body hashes and URLs refreshed for the 7 changed lessons (hash method re-checked against an unchanged lesson). `RG-21` updated. `CURRENT_COVERAGE`/`SEMANTIC_CLOSURE` rebuilds need the corpus and were not run; no ids or coverage statuses changed.
