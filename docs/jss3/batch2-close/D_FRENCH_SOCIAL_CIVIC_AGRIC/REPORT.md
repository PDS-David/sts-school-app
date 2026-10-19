# Worker D report: French, Social Studies, Civic Education, Agricultural Science

Base: master `9ee05972d93b896fca9a6b73a09ec4628fb5e08c` (pack snapshot was 86a1a61, absent from the shallow clone; counts match: 90 supplements, 177 decisions, 328 candidates). Branch `jss3/b2-close-d-20261018-a1`. No AGENTS.md. Clean tree at start.
Environment: Node **v22.22.0** (not 24.19.0), `npm ci --ignore-scripts`. The Node 24.19.0 rerun is still required. The 39 source hashes and the inner ZIP hash (0a5b0d92...) verified.

## Status (prepared / staged-tested / integrated)
- Prepared: 20 new lessons, 1 targeted replacement, 45 decisions, 23 delivery-correction proposals, tests, code patch.
- Staged-tested (disposable copy, patch applied): importer capture 423 rows = 313 original + 110 supplements, original rows exactly equal, stdout equal to unmodified importer, Third Term 0, Computer Studies 0; backend `tsc --noEmit` exit 0; my 8 tests pass (and 2 fail on unpatched master as the negative control); real `build_semantic_closure.py` accepts all 45 decisions (anchors asserted).
- Integrated on master: **nothing**. F must integrate. Delivery corrections are NOT implemented in runtime.

## Changed IDs
Adds (20): SUP-AGRIC-PACK-BRAND, SUP-AGRIC-ADVERT (1st); SUP-AGRIC-RECORDS, SUP-AGRIC-STOCK-EXCHANGE (2nd); SUP-FR-DECRIRE-PERSONNE, SUP-FR-PAYSAGE, SUP-FR-JOURNEE-DUREE, SUP-FR-ACCORD, SUP-FR-PRESENT, SUP-FR-GOUTS-OBJETS, SUP-FR-MON-ECOLE (1st); SUP-FR-PASSE-COMPOSE, SUP-FR-PASSE-RECENT, SUP-FR-JOURNAL (2nd); SUP-SS-HARMFUL-PRACTICES (1st), SUP-SS-AGRIC-ECONOMY (2nd); SUP-CIVIC-SECURITY, SUP-CIVIC-SELF-EMPLOYMENT (1st); SUP-CIVIC-FREE-FAIR, SUP-CIVIC-CONSTITUTION (2nd).
Replace (1): SUP-SS-NATURE-ECONOMY (only the dated Q3-2022 GDP sentence, now the 2025-rebased 2024 shares, plus one source). Guard hash `2444e6ac...`.
Decisions: all 45 mandatory candidates (25 replacement, 1 partial replacement (SL-281), 10 original-covered, 9 markers; includes the blank-subject Omega Civic lines, mapped to the owner-selected First-Term file with no duplicate).

## Facts verified (18-19 Oct 2026) and where
NDLEA: Decree No. 48 of 1989 (ndlea.gov.ng). SSS to DSS (1986 Decree 19). NSCDC Act 2003, amended 2007. SIEC: governor appoints, House of Assembly confirms, ss.197-198 and Third Schedule (IDEA). Section 9 thresholds (two-thirds, and four-fifths for s.8, s.9, Chapter IV; 24 of 36 states). Sixth Alteration Bill 2026 sent to states 16 Sep 2026, not law (Blueprint; single source, dated in lessons). Democracy Day 12 June (changed 2018). OFN May 1976 under Obasanjo. GDP rebasing 2025 (base 2019; 2024 shares services 55.5, agriculture 27.8, industry 16.7; Africa Check). NAPEP set up 2001, no longer operating (Wikipedia; secondary source). NGX demutualisation 2021; AFEX as licensed commodity exchange (Guardian). NAFDAC Pre-Packaged Food (Labelling) Regulations and ARCON Act 2022 (law-firm summaries).
Weaker or hedged: Green Revolution year ("around 1980", D-B05); Child's Rights Act and state adoption not counted; VAPP applicability per state flagged "check"; INEC conducting FCT area council elections stated from general knowledge, not from a page fetched (INEC FAQ page did not mention it). Several sources were summaries (Wikipedia, law-firm notes), not primary texts; the primary texts should be checked before release.
A fetch of labour.gov.ng (NDE) and the CBN agricultural review failed or was blocked; NDE statements rely on the 1989 Act title from Policy Vault and the school notes.

## Errors found in the original rows (preserved, to be overridden in delivery)
French: dozens of wrong forms (see DELIVERY_CORRECTIONS.json), novembre as 12th month with decembre missing, 29 May as Democracy Day, partir as "to have". Civic: NDLEA 2000, SIEC appointed by INEC, partisan 2015 praise/blame, incomplete s.9 rule. Social: ethnic generalisation for child marriage, FGM "automatically" HIV, OFN 1978.

## Semantic overlaps
SUP-FR-JOURNEE-DUREE with SUP-FR-DATES (depuis/pendant, clock); SUP-FR-PASSE-COMPOSE and SUP-FR-JOURNAL with SUP-FR-RECIT (past tenses, Bola report); SUP-SS-AGRIC-ECONOMY with SUP-SS-NATURE-ECONOMY (sectors); SUP-CIVIC-FREE-FAIR with SUP-CIVIC-ELECTIONS (INEC, SIEC). Optional drafts (SUP-FR-RECENT, -AGREEMENT, -PAST-REPORT) were reference only; none applied.

## Shared files F must touch
`backend/src/db/jss3Supplements.ts` (30 new WG gap IDs in the allow-list, see code.patch), `backend/src/db/data/jss3Supplements.json` (upserts), `docs/jss3/replacements/SEMANTIC_DECISIONS.csv` (append DECISIONS.csv), IMPLEMENTED_LESSONS.csv, CURRENT_COVERAGE.csv, SEMANTIC_CLOSURE.csv, OPEN_BLOCKERS.csv, and count assertions in `tests/jss3-batch2-content.test.mts` (two tests fail on the 90-lesson counts until records are regenerated). Order indexes are not hard-coded.

## Unmet gates and untested
- Delivery overrides for 23 original rows: not implemented or tested (D-B03). Cached summaries and generated assessments for those rows need retiring.
- Examination correction for SL-281 needs the missing last-term paper (D-B01).
- No teacher certification; no spoken French, no practical or device testing; lesson readability on phones not checked.
- Node 24.19.0 and the full-source combined run not done; only focused tests ran. Facts should be rechecked against primary texts before release (above).
- Not pushed to master; only this branch.
