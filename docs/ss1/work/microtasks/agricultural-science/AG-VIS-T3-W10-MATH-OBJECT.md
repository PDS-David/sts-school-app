# AG-VIS-T3-W10-MATH-OBJECT — Agricultural Science, Third Term Week Ten

Status: **IMPLEMENTED_TESTING_DEFERRED**. The inline Office Math object has been inspected. It is a semantic fraction, not an image or decorative formatting. Its value must be retained in any plain-text or semantic delivery representation.

## Integrity and locator
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact source member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`; 5,406,306 bytes; SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified against the manifest.
- Source locator: `word/document.xml`, zero-based direct-body block 1165, within the cattle characteristics paragraph.
- Exactly one inline Office Math node (`m:oMath`) is present in the paragraph. It contains an `m:f` fraction with numerator `1` and denominator `2`; no image relationship, raster media, OLE object or separate visual asset is involved.

## Exact mathematical content
- The preceding Word text run ends: **“They have a gestation period of about 275-283 days (9”**.
- The inline OMML node contributes the stacked fraction **1/2**.
- The following Word text run begins: **“ months).”**
- Combined source statement: **“They have a gestation period of about 275-283 days (9 1/2 months).”**
- This is a mixed number, nine and one-half months. It is encoded semantically as a numerator/denominator fraction, not as an image or a pair of styled text characters.
- A text-only extraction of the paragraph's `w:t` nodes returns **“They have a gestation period of about 275-283 days (9 months).”** because it omits the OMML fraction. This changes the numeric statement and is not a faithful extraction.
- The rendered source page 38 displays the fraction vertically as a stacked 1 over 2 after the 9.

## Disposition and preservation
- **Classification:** semantic inline mathematics (OMML fraction), not plain formatted text.
- **Preservation:** keep the OMML fraction when supported; otherwise serialize it faithfully as `1/2` or the Unicode half symbol `½`. The resulting value must remain **275-283 days (9 1/2 months)**.
- Do not flatten the paragraph to “9 months”, omit the fraction, or change the 275–283 day range.
- No derivative image, screenshot, separate asset file or alt-text record is needed. The object is inline text mathematics and should remain part of the paragraph flow.
- This task records the source value; it does not fact-check or endorse the cattle gestation range. The existing Week Six reproductive-timings fact blocker is separate and does not validate this Week Ten statement.

## Rights and source handling
- The fraction is a conventional mathematical expression embedded in the source paragraph; it is not a third-party image/media asset.
- No separate media reuse licence or derivative-asset decision is applicable to the OMML node. Any reuse of the surrounding source lesson text remains subject to the package's general source-rights conditions.
- No source bytes, OMML, text runs or media were altered.

## Changes and validation
- Added blocking open item `AGRICULTURAL-SCIENCE-T3-W10-GESTATION-FRACTION-PRESERVATION` because text-only extraction drops the numerator/denominator and changes the value.
- Marked `AG-VIS-T3-W10-MATH-OBJECT` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue kind counts, status counts and `next_runnable`.
- Verified archive and DOCX member hashes; inspected the block-1165 paragraph XML, OMML fraction structure, numerator/denominator and surrounding text runs.
- Rendered the source page for visual inspection; the stacked fraction is visible on page 38.
- Package and queue JSON parsed; no duplicate queue-item or open-item IDs introduced.
- Importer, compiler, tests, typecheck, learner rendering, app/device display and CI were not run; testing remains deferred.
- No source media, lesson bodies, asset rows, shared schema/compiler, other subject or delivery assets changed.
