# AG-FACT-T1-W07-LAND-MOBILITY — Agricultural Science, First Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. The source sentence contains a direct adjective–explanation contradiction. The explanation describes geographical immobility; the adjective should be corrected from “mobile” to “geographically immobile”.

## Source integrity and exact wording
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact First Term DOCX member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`; SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Week Seven characteristics, block 549, reads: **“Land is mobile i.e. cannot be moved from a place of plenty to a place of scarcity.”**
- The definition is internally inconsistent: “mobile” means capable of movement, while the explanation says the land itself cannot be moved.

## Authoritative evidence

### National Open University of Nigeria (NOUN)
- NOUN's AEA 308 *Principles of Farm Management* courseware states under the characteristics of land: **“Land is Passive and immobile”** and explains that land is fixed at a location and cannot be moved.
- This is directly relevant Nigerian university courseware for farm management/agricultural economics.
- Source: [NOUN — AEA 308 Principles of Farm Management (PDF)](https://nou.edu.ng/coursewarecontent/AEA%20308.pdf), Module 3, “Characteristics of Land” (the courseware identifies NOUN and © 2020 at the front matter).

### West African Examinations Council (WAEC)
- WAEC's 2017 WASSCE Economics Paper 2 examiner report lists **“Land is geographically immobile”** as an expected feature of land as a factor of production.
- This supports the expected secondary-school terminology in the Nigerian/West African examination context.
- Source: [WAEC — Economics Paper 2, WASSCE (SC), 2017](https://www.waeconline.org.ng/e-learning/Economics/econs226mq3.html), examiner's expected answer, lines 110–117.

### Cambridge IGCSE Economics
- Cambridge distinguishes two different meanings:
  - **Geographical immobility:** a particular parcel cannot be moved from one location to another.
  - **Occupational mobility:** land can be changed from one use to another (for example, farming land may be used for housing).
- This distinction explains the likely source error: it may have confused geographical immobility with the fact that land can be put to different uses.
- Source: [Cambridge IGCSE & O Level Economics Coursebook excerpt](https://assets.cambridge.org/97811084/40387/excerpt/9781108440387_excerpt.pdf), section “The mobility of land”, lines 355–366.

## Finding
The source's explanatory gloss is correct for **geographical immobility**: a particular parcel of land cannot be physically moved from a place of plenty to a place of scarcity. The word **“mobile”** is the error. Land can, however, be **occupationally mobile** to some degree because its use can change, such as from agriculture to housing or another purpose. These are distinct concepts and should not be conflated.

## Recommended correction
Replace the source sentence with:

> **Land is geographically immobile; that is, a particular piece of land cannot be moved from one location to another. However, land may be changed from one use to another.**

If the lesson is intended to give only the characteristic stated in the original gloss, the minimal correction is:

> **Land is immobile, i.e. it cannot be moved from a place of plenty to a place of scarcity.**

“Geographically immobile” is the more precise term. The optional second sentence prevents confusion with occupational mobility.

## Disposition
- **Correction recommended; no factual uncertainty remains** about the contradiction.
- No source text, DOCX bytes, package lesson or answer key was altered.
- The task's allowed write paths permit only the queue and this evidence note. The source remains unchanged pending the separately authorised correction/mapping stage.

## Repository disposition and verification
- Marked `AG-FACT-T1-W07-LAND-MOBILITY` `IMPLEMENTED_TESTING_DEFERRED` and appended the sourced correction recommendation to the Agricultural Science queue.
- Verified archive and exact First Term DOCX member hashes; inspected source block 549.
- Reviewed NOUN farm-management courseware, the WAEC examiner report and Cambridge's distinction between geographical and occupational mobility.
- Importer, TypeScript checks, database, learner rendering and tests were not run; testing remains deferred.
- No source bytes, lesson content, package data, schema/compiler or other subject files were changed.
