#!/usr/bin/env python3
"""Write VISUAL_REGISTER.csv: one row per reviewed occurrence (figure, drawn-object group or equation item) with a
source-to-delivery disposition. Figure rows come from v2_math_figures.json (so they cannot drift from the manifests);
other rows come from v2_math_reviewed_occurrences.json and retain completed recovery evidence. Usage: build_visual_register.py --guards V2_MATH_ROW_GUARDS.csv --out VISUAL_REGISTER.csv"""
import argparse, csv, json, hashlib
from pathlib import Path
HERE = Path(__file__).resolve().parent
COLS = ['occurrence_id','source_document','source_locator','object_kind','lesson_identity','source_body_sha256','asset_key','asset_file','asset_sha256','classification','disposition','review_method','evidence_and_notes','open_item']
D1 = 'JSS3 1ST TERM /JSS 3 MATHEMATICS.docx'; D2 = 'JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx'
def reviewed_occurrences(guards):
    """Reviewed non-figure dispositions are data; regeneration must preserve later recovery work."""
    records = json.loads((HERE / 'v2_math_reviewed_occurrences.json').read_text(encoding='utf-8'))
    seen = set()
    for row in records:
        if set(row) != set(COLS) or row['occurrence_id'] in seen:
            raise ValueError('Invalid or duplicate reviewed occurrence')
        seen.add(row['occurrence_id'])
        parts = row['lesson_identity'].split('|')
        if len(parts) not in (4, 5) or parts[:2] != ['Mathematics', 'JSS 3']:
            raise ValueError('Invalid reviewed lesson identity')
        if row['source_body_sha256']:
            guard = guards.get((parts[2], parts[3]))
            if not guard or guard['source_body_sha256'] != row['source_body_sha256']:
                raise ValueError('Reviewed occurrence body guard mismatch: ' + row['occurrence_id'])
            if parts[-1] != 'order ' + str(guard['order_index']):
                raise ValueError('Reviewed occurrence order guard mismatch: ' + row['occurrence_id'])
    return records

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--guards', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--manifests', required=True, help='folder with V2_MATH_*_MANIFEST.csv'); ap.add_argument('--extra-guards', action='append', default=[], help='optional further row-guard CSV (for example M2_ROW_GUARDS.csv)'); a = ap.parse_args()
    guards = {(r['term'], r['original_row_title']): r for r in csv.DictReader(open(a.guards, encoding='utf-8'))}
    for filename in a.extra_guards:
        for r in csv.DictReader(open(filename, encoding='utf-8')):
            key = (r['term'], r['original_row_title'])
            if key in guards and any(guards[key][f] != r[f] for f in ('source_body_sha256','order_index')):
                raise ValueError('Conflicting row guards: ' + str(key))
            guards[key] = r
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
    rows.extend([[row[col] for col in COLS] for row in reviewed_occurrences(guards)])
    with open(a.out,'w',newline='',encoding='utf-8') as fh:
        w = csv.writer(fh, lineterminator='\n'); w.writerow(COLS); w.writerows(rows)
    print(len(rows),'register rows')
if __name__ == '__main__': main()
