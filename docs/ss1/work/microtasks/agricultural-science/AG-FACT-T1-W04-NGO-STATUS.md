# AG-FACT-T1-W04-NGO-STATUS — Agricultural Science, First Term Week Four

Status: **IMPLEMENTED_TESTING_DEFERRED**. The organisation classifications have been checked against official Nigerian and institutional records. The current single-answer MCQ has at least two non-NGO options and should be corrected or withdrawn. No answer key or teacher decision has been applied.

## Source integrity and exact item
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact First Term DOCX member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`; SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- The Week Four NGO examples are in source blocks 387–392. The Weekend Assignment Q5 is block 417:
  - A. Hunger Project in Ghana
  - B. IITA
  - C. Agricultural Development Authority
  - D. West Africa Rice Development Agency
- The source prose also lists FAO and Catholic Relief Service (Gambia) among the supposed NGO examples.
- The option “Agricultural Development Authority” does not name a state, legal entity or acronym; it is therefore not enough to identify one particular Nigerian authority.

## Classification of the four options

### A. The Hunger Project (Ghana)
- The United Nations Civil Society Participation database identifies **The Hunger Project** and explicitly records its organization type as **Non-governmental organization**.
- The Ghana country programme is part of this organization.
- Source: [UN Civil Society Participation — The Hunger Project profile](https://esango.un.org/civilsociety/showProfileDetail.do?method=showProfileDetails&profileCode=843), organization type at the profile.

### B. International Institute of Tropical Agriculture (IITA)
- IITA's own audited 2015 financial statements describe it as a **private, autonomous, not-for-profit, scientific and educational institute**, chartered under Nigerian law by Decree No. 32 of July 1967.
- It is not a Nigerian government ministry or public agricultural-development authority. The precise institutional description is an autonomous international non-profit research institute; “NGO” is a broad educational shorthand rather than its formal name.
- Source: [IITA — 2015 Financial Statements](https://www.iita.org/wp-content/uploads/2020/03/2015-Financial-Statement.pdf), Note 1, “Charter of Incorporation”, PDF p. 9 / extracted lines 727–730.

### C. Agricultural Development Authority
- The option is under-specified: Nigeria has state-level agricultural development authorities/programmes, not one uniquely identifiable federal body with this generic name.
- The official Lagos State Ministry of Agriculture and Food Systems website lists a **Program Manager, Agricultural Development Authority** among the Ministry's principal officers and separately refers to the Lagos State Agricultural Development Authority (LSADA) in the officer's public-service history.
- The official Kaduna State Ministry of Agriculture identifies the **Kaduna State Agricultural Development Authority (KADA)** as a parastatal under the Ministry and says it was established by state law.
- These named authorities are public/state-government bodies, not NGOs. The question should name the state/entity rather than use a generic label.
- Sources:
  - [Lagos State Ministry of Agriculture and Food Systems — Principal Officers](https://lagosagric.com/principal-officers/), especially the Agricultural Development Authority entry and LSADA references.
  - [Kaduna State Ministry of Agriculture — About Us](https://agriculture.kdsg.gov.ng/about-us/), KADA's status as a ministry parastatal (the ministry site may restrict automated access).

### D. West Africa Rice Development Agency (WARDA)
- The formal historical name was **West Africa Rice Development Association (WARDA)**, not “Agency”.
- AfricaRice's official profile says it was established by 11 African countries under the WARDA name, and that it is an **intergovernmental association of African member countries**. Its Council of Ministers changed its name to Africa Rice Center (AfricaRice) in 2009.
- An intergovernmental organization is not an NGO. The current option therefore is also a non-NGO, not a valid NGO distractor.
- Source: [AfricaRice — Official Profile](https://www.africarice.org/who-we-are/africarice-profile), lines 181–187.

## Other errors in the source's NGO example list
- **FAO** is the Food and Agriculture Organization (not “Food and Agricultural Organization”) and is a **specialized agency of the United Nations**, not an NGO.
  - Source: [FAO — About FAO](https://www.fao.org/about/about-fao/en/), lines 11–12.
- **Catholic Relief Services (CRS)** describes itself as an international not-for-profit non-governmental organization. The source's singular “Catholic Relief Service” should be corrected to the formal plural name.
  - Source: [Catholic Relief Services — 2025 RFP](https://www.crs.org/sites/default/files/2025-06/US9701%20-%20DCT%20RFP%20Document.pdf), lines 16–20.
- **IITA** is a private autonomous non-profit research institute; it is non-governmental, but its more precise institutional description should be retained.
- **WARDA/AfricaRice** and **FAO** should not be presented as NGOs under a strict organizational classification.

## Finding
The current Q5 does not have a unique correct answer:
- **C** is a government authority if it means a named Nigerian state Agricultural Development Authority such as LSADA or KADA.
- **D** is also not an NGO: WARDA/AfricaRice is an intergovernmental association of African states.
- The generic wording of C does not identify which authority is intended.
- The source's own list also wrongly treats FAO and WARDA as NGOs.

The intended answer may have been C, but D is also defensible under the ordinary meaning of “non-governmental organization”. A single-answer key of C would therefore be incomplete.

## Recommendation — no teacher decision presumed
**Correct the item before use; otherwise withdraw it.**
- If C is intended as the exception, specify the exact authority (for example, “Lagos State Agricultural Development Authority (LSADA)”) and replace D with a verified NGO.
- Correct D's name to **AfricaRice (formerly West Africa Rice Development Association, WARDA)** and classify it as intergovernmental, not NGO.
- Correct the source list's FAO classification and full name; describe IITA as an autonomous non-profit research institute; use the formal plural name Catholic Relief Services.
- Do not mark C as the sole exception while D remains WARDA/AfricaRice.

A clearer replacement stem would be: **“Which of the following is a Nigerian state-government agricultural agency rather than a non-governmental organisation?”** The options must then be rebuilt so that only one option is a named public authority and every other option is a verified NGO. No answer key has been changed and no teacher/owner decision is presumed.

## Repository disposition and verification
- Marked `AG-FACT-T1-W04-NGO-STATUS` `IMPLEMENTED_TESTING_DEFERRED` and appended the sourced classification/recommendation to the Agricultural Science queue.
- The task's `allowed_write_paths` permit only the queue and this task note. The package open item remains unchanged pending owner action.
- Verified archive and exact First Term DOCX member hashes; inspected source blocks 387–392 and 417.
- Reviewed UN Civil Society, IITA's audited financial statements, Lagos/Kaduna government records, AfricaRice, FAO and CRS institutional sources.
- Importer, TypeScript checks, database, learner rendering and tests were not run; testing remains deferred.
- No source bytes, lesson content, package data, schema/compiler or other subject files were changed.
