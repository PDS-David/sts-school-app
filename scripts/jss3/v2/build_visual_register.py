#!/usr/bin/env python3
"""Write VISUAL_REGISTER.csv: one row per reviewed occurrence (figure, drawn-object group or equation item) with a
source-to-delivery disposition. Figure rows come from v2_math_figures.json (so they cannot drift from the manifests);
the other rows are fixed review decisions listed below. Usage: build_visual_register.py --guards V2_MATH_ROW_GUARDS.csv --out VISUAL_REGISTER.csv"""
import argparse, csv, json, hashlib
from pathlib import Path
HERE = Path(__file__).resolve().parent
COLS = ['occurrence_id','source_document','source_locator','object_kind','lesson_identity','source_body_sha256','asset_key','asset_file','asset_sha256','classification','disposition','review_method','evidence_and_notes','open_item']
D1 = 'JSS3 1ST TERM /JSS 3 MATHEMATICS.docx'; D2 = 'JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx'
# (id, doc, locator, kind, term, row title, classification, disposition, method, notes, open)
OTHER = [
 ('M1-O01',D1,'paragraphs 55,58,59,74,82,83,101,102,145-158 (connectors)','ladder rules and column rules','1st Term','BINARY NUMBERS','covered by figure','COVERED_BY M1-F01..F03','rendered and compared','Individual connectors are the rules of the ladders and column layouts; grouped into the three recovered figures.',''),
 ('M1-O02',D1,'paragraphs 466-472 (connectors)','tally strokes and table rules','1st Term','EVERYDAY STATISTICS','covered by figure','COVERED_BY M1-F04','rendered; strokes counted per row','Stroke counts per row 3,6,4,9,5,0,2.',''),
 ('M1-O03',D1,'paragraphs 480,509,535,536,544-550,566-572,601,627-638 (connectors)','table rules','1st Term','EVERYDAY STATISTICS / MEASURE OF CENTRAL TENDENCY','DECORATION (table borders)','NO_ASSET: table cells are extracted text; the rules carry no data','paragraph text compared with rendered table (pages 12-17)','Frequency and angle tables read correctly from extracted text; only their ruling lines are drawn objects. Pages 16-17 tables were not re-rendered individually.','partly inspected'),
 ('M1-O04',D1,'paragraphs 704,708 (8 connectors each)','equation layouts with drawn bars','1st Term','SIMPLE EQUATIONS INVOLVING FRACTIONS','NOT VISUALLY RESOLVED','RETAINED_OPEN','inventory and extracted text only','Text reads " 0 2 4 -1 0 5 = 2" with drawn lines; the layout was not rendered and checked in this pass, so no reading is asserted.','yes: needs a rendered check'),
 ('M1-O05',D1,'paragraphs 810-812, 815 (triangle shape 97 x 80 pt)','equilateral triangle with side expressions','1st Term','SIMPLE EQUATIONS INVOLVING FRACTIONS','genuinely ambiguous source content','UNRESOLVED: no asset delivered','rendered page; text and Office Math of the labels dumped','Exercise: equilateral triangle, find the perimeter. Side labels in the file are 2x+5y-2, 4x-y+1 and x+y+5 (the last stored as split pieces). Equating pairs gives non-integer x and y, which suggests the intended labels or the third label differ. No reading is chosen, no answer key written.','UNRESOLVED - teacher decision needed'),
 ('M2-O01',D2,'paragraphs 22,23 (rtTriangle 29 x 32 pt, two connectors)','scheme-of-work bullet marks','2nd Term','(scheme of work page)','DECORATION','NO_ASSET','rendered page 1','Small marks in the scheme-of-work list; no instructional content.',''),
 ('M2-O02',D2,'paragraphs 79,80,83,111 (connectors; 0-based over all w:p, verified)','cancellation strokes in the substitution-method working (not elimination)','2nd Term','SOLVING OF SIMULTANEOUS LINEAR EQUATIONS','missing extraction (fractions lost by importer) + decoration/ambiguous strokes','PARTLY RECOVERED: paragraphs 79 and 80 (four strokes cancelling 7/7 and 7x/7) recovered as asset V2-MATH-M2-F10 and the Example 2 fractions as V2-MATH-M2-F11 (both bound to this row); strokes at 83 (over the words Step 5) and 111 (target undeterminable) RETAINED_OPEN, no operation asserted','LibreOffice render (Math module installed) of a scratch copy: page breaks only, paragraph-111 stroke omitted; XML anchor geometry; exact-fraction arithmetic','V2 location correction: these paragraphs are in Example 1 and Example 2 of the substitution method, before the ELIMINATION METHOD heading; the ELIMINATION METHOD row contains no connector. Cancelling the 7s in 7/7 = 7x/7 gives 1 = x, matching x = 1. Source slips kept, not edited: printed line 12 - 5 - 7x = 10 (does not follow from 12 - 7x = 5) and 3/11 - 24/1 = 9/11 (denominators misplaced; result right). The ELIMINATION METHOD row has fraction steps lost by the importer (3x/3 = 3/3 and similar) but no connector; that is outside M2.','UNRESOLVED for paragraphs 83 and 111 only: stroke targets unknown (teacher or Word view needed)'),
 ('M2-O03',D2,'paragraph 302 (two zero-size connectors)','accent marks over C and B in the exercise "in ABC, C = 90, B = 28 degrees"','2nd Term','THE TRIGONOMETRIC RATIOS','DECORATION (symbol accents)','NO_ASSET','rendered page 11','Hat marks over the letters; the text already reads "C = 90, B = 28 degrees and CA = 12cm". The exercise has no drawn triangle.',''),
 ('M1-E01',D1,'row BINARY NUMBERS, example iii (10.1001 in base two)','equation flattened to a mixed number','1st Term','BINARY NUMBERS','equation fidelity: flattened mixed number','DELIVERED_AS_NEW_TEACHING SUP-MATH-V2-FIGURES-1 (declarative patch)','calculation','2 + 1/2 + 1/16 = 2 9/16 = 41/16; the text "29/16" is a flattened mixed number (29/16 would be 1.8125).','patch must be applied by the integration agent'),
 ('M1-E02',D1,'assignment formula T = 2 pi sqrt(m/k)','plain-text root sign','1st Term','CHANGE OF SUBJECT OF A FORMULA','genuinely ambiguous source content','UNRESOLVED (existing open slip M1-T-FORMULA); not changed','existing record','Whether the root covers m or m/k cannot be told from the note; no formula is chosen.','UNRESOLVED - teacher decision needed'),
 ('M1-E03',D1,'row BINARY NUMBERS, sums and subscripts typed as run formatting (x2, 810, 1012)','superscripts and subscripts typed as ordinary run formatting','1st Term','BINARY NUMBERS / others','missing extraction (OB-14 item 1)','NOT FIXED in importer text; delivered figures show them correctly','figure crops show true sub/superscripts','The importer text still flattens run-formatted subscripts (for example 810 for 8 in base ten). Fixing that needs an importer change that would alter row hashes and the hash-keyed delivery corrections; deliberately not done on this branch.','yes: importer change + hash update by the integration agent'),
 ('M1-E04',D1,'EVERYDAY STATISTICS part (c) "x 100 = 16%"','rounding of 5/30 x 100','1st Term','EVERYDAY STATISTICS','original source error (rounding)','Existing SUP-MATH-DATA-DISPLAY already states 16 2/3 per cent; figure note added','calculation','5/30 x 100 = 16.67; "16%" truncates.',''),
]
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--guards', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--manifests', required=True, help='folder with V2_MATH_*_MANIFEST.csv'); ap.add_argument('--extra-guards', help='optional further row-guard CSV (for example M2_ROW_GUARDS.csv)'); a = ap.parse_args()
    guards = {(r['term'], r['original_row_title']): r for r in csv.DictReader(open(a.guards, encoding='utf-8'))}
    if a.extra_guards: guards.update({(r['term'], r['original_row_title']): r for r in csv.DictReader(open(a.extra_guards, encoding='utf-8'))})
    man = {}
    for f in ('V2_MATH_1ST_MANIFEST.csv','V2_MATH_2ND_MANIFEST.csv'):
        for r in csv.DictReader(open(Path(a.manifests)/f, encoding='utf-8')): man[r['asset_key']] = r
    figs = json.load(open(HERE/'v2_math_figures.json', encoding='utf-8'))['figures']
    rows = []
    for f in figs:
        g = guards[(f['term'], f['row_title'])]; m = man['V2-MATH-'+f['id']]
        unresolved = any(w in f['source_status'] for w in ('ambiguous','inconsistent'))
        rows.append([f['id'], f['source_doc'], f"{f['source_locator']}; scratch-render page {f['scratch_pdf_page']}", 'figure group', f"Mathematics|JSS 3|{f['term']}|{f['row_title']}|order {m['order_index']}", g['source_body_sha256'], m['asset_key'], m['file'], m['sha256'], f['source_status'],
            'RECOVERED_ASSET attached to original lesson via topic_assets manifest' + ('; ambiguity kept explicit' if unresolved else ''), 'LibreOffice render of a scratch copy (text-box math flattened, page breaks only) + XML geometry/chart data', f['notes'], (('OWNER-DIRECTED INTERIM DECISION ' + f['decision']['date'] + ' (not teacher-certified); teacher confirmation outstanding - see notes') if f.get('decision') else ('UNRESOLVED - see notes' if unresolved else ''))])
    for (i,doc,loc,kind,term,title,cls,disp,method,notes,openi) in OTHER:
        g = guards.get((term, title)); lid = f'Mathematics|JSS 3|{term}|{title}' + (f"|order {g['order_index']}" if g else '')
        rows.append([i,doc,loc,kind,lid,g['source_body_sha256'] if g else '','','','',cls,disp,method,notes,openi])
    with open(a.out,'w',newline='',encoding='utf-8') as fh:
        w = csv.writer(fh, lineterminator='\n'); w.writerow(COLS); w.writerows(rows)
    print(len(rows),'register rows')
if __name__ == '__main__': main()
