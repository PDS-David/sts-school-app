# V3 Science figures and integration — 20 October 2026

## Implemented

Reviewed the three original Basic Science DOCX files through LibreOffice PDF rendering and their drawing/media structures. First-Term instructional drawings are the inheritance crosses on pages 6–7. Second-Term instructional figures occur on pages 7, 9–11, 13 and 16. Third-Term drawing objects reviewed were rules/underlines, not missing instructional diagrams. Page numbers refer to these LibreOffice renders, not Microsoft Word.

Twelve Science assets are recorded in `scripts/jss3/v3/science_assets.json`: six source-rendered crops, four byte-exact embedded images and two newly prepared corrected teaching figures. Eight unique assets are displayed. Four erroneous source crops are retained for audit with `displayed=false`. Binding to both original and replacement lessons gives 17 asset records, 13 displayed. This is not 17 unique illustrations.

The original inheritance drawings mislabel offspring and treat human height as a simple dominant/recessive trait. The new Family Traits lesson explains a hypothetical complete-dominance model, correct allele combinations and probabilities, and polygenic/environmental influences on human height. The original Light Energy lesson incorrectly equates incidence and refraction angles; its prism diagram also has inconsistent colours. The replacement distinguishes reflection and refraction and supplies a clearly labelled new spectrum schematic. Both replacements use the existing source-hash-guarded delivery resolver, including changed-source withholding and existing cache-fingerprint behaviour. Original bodies are unchanged.

Primary references: NHGRI glossary pages for Polygenic Trait, Dominant Traits and Alleles, Recessive Traits and Alleles, and Mendelian Inheritance; OpenStax Physics sections 16.1 Reflection and 16.2 Refraction. Exact URLs are stored in the lessons. New figures and teaching are explicitly equivalents, not claimed to be recovered source wording/geometry. Questions have answer and marking guides.

Existing Basic Technology assets were reconciled against the original Third-Term DOCX and current capture: 12 displayed illustrations plus one held decorative icon, all byte-exact; animations retain 58, 89 and 66 frames. The full electron-emission image is retained, avoiding the DOCX page clipping. Added descriptions to the existing manifest without changing image bytes or destinations. `BT_RECONCILIATION.json` records hashes, sizes, frame counts and lesson identities.

## Reproduce

Use Node 24.19.0, locked dependencies, Python with PyMuPDF/Pillow, LibreOffice, and the 39 inventoried sources in `JSS3_NEXT_STAGE_INPUTS_20261016.zip`. Do not put originals in Git. Create a current capture using `scripts/jss3/capture_rows.py`. Render each Science DOCX into separate `t1`, `t2`, `t3` directories using `soffice --headless --convert-to pdf --outdir <directory> <source>` with an isolated LibreOffice profile. Then:

```
python scripts/jss3/v3/recover_science.py --all-root <ALL> --renders <render-root> --capture <capture>/original-rows.json
python scripts/jss3/v3/build_science_manifests.py --capture <capture>/supplemented-rows.json
python scripts/jss3/v3/check_basic_technology.py --all-root <ALL> --capture <capture>/supplemented-rows.json --output <evidence>/BT_RECONCILIATION.json
```

Asset manifests are under `curriculum-assets/jss3/v3-science/`. The builder rejects missing/ambiguous original identities, changed source bodies, missing replacement lessons and changed image hashes. It resolves current order indices rather than embedding them in source definitions. The existing attachment parser verifies bytes and preserves captions, alt text and display holds. No database attachment was performed in this task.

## Limits

This was LibreOffice inspection, not Word or phone acceptance. The source eye image is low resolution; the original bytes and descriptive alternative are retained. B/H/M in the source magnetic panels are not added assessment objectives. The prism is a qualitative schematic, not a numerical ray trace. Third-party image rights were not independently established. No practical or teacher certification is claimed. Physics and inheritance corrections do not imply a complete proofreading of every Science sentence.

Database acceptance and real-device observation remain distinct gates. Existing production rows/assets/caches were not touched. The protected 2,179-row export was not available, so identity preservation of that historical set is not claimed.
