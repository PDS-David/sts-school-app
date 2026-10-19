# Prompt G5 - recover and attach the cross-subject figures (continues G4)

Start from branch `jss3/g4-music-visual-20261019` (already merged with master's G4, `d306f78`; also read `G4_MUSIC_VISUALS/REPORT.md`; read `docs/jss3/batch2-close/G4_VISUAL/FINDINGS.md` first; do not redo it).
Inputs: the private corpus `JSS3_NEXT_STAGE_INPUTS_20261016` (verify `SHA256SUMS`; NEVER commit it or any source body text),
`G4_VISUAL/DRAWN_OBJECT_INVENTORY.csv`, `scripts/jss3/g4/` and master's `scripts/jss3/inventory_drawings.py`, `curriculum-assets/jss3/supplements/`, `backend/src/db/attachTopicAssets.ts`.
Needs: LibreOffice, pdfplumber, ImageMagick, Node 22 (`npm ci --ignore-scripts`). Work one subject at a time and commit after each.

1. Review the inventory visually (render each source to PDF; view pages). Mark each row INSTRUCTIONAL / DECORATIVE / ALREADY-DELIVERED.
   Decorative rules, borders and underlines are not missing lessons. Check existing supplements and Basic Technology assets first.
2. Priority order: Business Studies (wk5 Double Entry and wk6 Trial Balance T-accounts, then 2nd-term trading/P&L), Mathematics, Basic Science.
3. For each instructional figure, crop it from the rendered original (pdfplumber for bounding boxes, ~200 dpi PNG). Do NOT redraw or invent
   diagrams. Verify every crop by eye. Compare its meaning with what the lesson delivers; if the delivered text is wrong or lossy, correct the
   lesson through the existing supplement/correction mechanism and keep the original as the figure.
4. Attach with a new manifest per subject/term (columns as in `BATCH2_MUSIC_2ND_MANIFEST.csv`, including `alt_text`), dry-run `attachTopicAssets.ts`
   first. Captions must say the figure is a render of the school's original and is not certified against Word. No production writes.
5. Tests: per-lesson (figure -> correct lesson id/title, sha256, alt text, dimensions), plus a guard that every INSTRUCTIONAL inventory row has
   an attached asset or a recorded decision. Run `node --import tsx --test tests/*.test.mts`, the `.cjs` static tests, and both `tsc --noEmit`.
6. Update `F_INTEGRATION/REMAINING_GAPS.csv` (RG-32, RG-34, RG-35, RG-36 and RG-22 are open; RG-33 is delivered in code; close only what is evidenced). Keep SL-559 chord 5 (RG-35) and the
   clef wording (RG-22) as teacher questions unless someone supplies the Word view or the answer. Keep practical-performance
   certification separate from written completeness.
7. Push to a branch and tell the owner exactly when finished so the PAT can be revoked. Do not merge to master without the owner.
