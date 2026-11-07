# FR-LES-T1-W02-DEMONYMS

**Task:** FR-LES-T1-W02-DEMONYMS  
**Subject / term:** French, SS 1, 1st Term, Week 2  
**Base:** `815a442597d122d480869cc30f8116c4b23ca25d`  
**Status:** IMPLEMENTED — TESTING DEFERRED BY OWNER

## Implementation

Added `SUP-SS1-FRENCH-DEMONYMS-T1` to `backend/src/db/ss1/subjects/french.json`.

The original Week 2 exercise gives English examples for Nigeria, Egypt and Ghana. The existing lesson already supplies their French forms. This supplement supplies masculine and feminine forms for the remaining **35 countries** in the two Week 2 reference lists.

The lesson also teaches:
- the distinction between a capitalized noun naming an inhabitant and a lowercase nationality adjective;
- gender and number agreement in adjective use;
- the Niger/Nigéria distinction;
- the shared Congolais/Congolaise form for the two Congo countries;
- the same-form masculine/feminine gentilé Malgache and the Botswana variant recorded by OQLF.

## Provenance

- Office québécois de la langue française, Banque de dépannage linguistique, [Liste de noms de pays](https://vitrinelinguistique.oqlf.gouv.qc.ca/21941/les-noms-propres/noms-geographiques-et-gentiles/liste-de-noms-de-pays), accessed 2026-11-07.
- Académie française, [Adjectif ou nom de nationalité : « il est français » ou « il est Français » ?](https://dictionnaire-academie.fr/article/QDL006), accessed 2026-11-07.
- Académie française, [Dictionnaire, « gentilé »](https://dictionnaire-academie.fr/article/A9_0170), accessed 2026-11-07.

All teaching prose and practice are original. No source passage, table image or third-party illustration was reproduced.

## Package changes

- New lesson ID: `SUP-SS1-FRENCH-DEMONYMS-T1`
- Body SHA-256: `78a0169f7ecb0c7c4ea46bcbee3cafc908902737bccf281b2fc750a63749fcbc`
- Objectives: 3
- Practice: 5 items, 30 marks total
- Marking arithmetic: Q1 8/8; Q2 4/4; Q3 4/4; Q4 8/8; Q5 6/6
- State: content approval PENDING; implementation IMPLEMENTED; verification DEFERRED
- Coverage: `FRENCH-T1-W02-OBJ-3` changed from PARTIAL to IMPLEMENTED_EQUIVALENT and now references the new supplement.
- Open item `FRENCH-T1-W02-UNCOVERED-EXERCISES` removed because both Week 2 DEVOIR exercises now have counterparts. The separate Week 2 heading-intent and factual/source-check gates remain open.

## Checks and limits

- Reused the already-indexed Week 2 source locator and existing lesson evidence; this task required no new archive attachment.
- Checked lesson-ID uniqueness, coverage reference, body hash, package JSON parse and each marking total before publishing.
- Full package tests, typechecks, importer, database, device and delivery verification were not run, as required by the owner's testing deferral.
- No teacher approval or verification is claimed.


## Exact language-reference locators (review addendum)

The 35 masculine/feminine forms in the lesson table were checked against the OQLF BDL country/gentilé table. Exact rows (country/gentilé) are:

- Afrique du Sud 9–10; Algérie 15–16; Angola 24–25; Bénin 76–77; Botswana 89–91; Burkina Faso 102–103; Burundi 105–106; Cameroun 111–112; République du Congo 135–136; Côte d’Ivoire 149–150; Djibouti 161–162; Éthiopie 198–199; Gabon 210–211; Gambie 213–214; Guinée 231–232; Kenya 296–297; Libéria 326–327; Libye 329–330; Madagascar 344–345; Mali 357–358; Maroc 363–364; Mauritanie 369–370; Namibie 397–398; Niger 409–410; République centrafricaine 467–470; République démocratique du Congo 472–473; Rwanda 490–491; Sénégal 513–514; Sierra Leone 522–523; Somalie 534–535; Soudan 537–538; Tchad 565–566; Togo 576–577; Tunisie 586–587; Zambie 624–625.

- Académie française, “Adjectif ou nom de nationalité”, lines 842–845: capitalization of nouns naming inhabitants vs lowercase nationality adjectives and agreement/usage.
- Académie française, Dictionnaire, “gentilé”, lines 852–857: definition of a gentilé and its initial-capital rule.

This addendum improves source traceability only; lesson text, body hash, practice and task status are unchanged.
