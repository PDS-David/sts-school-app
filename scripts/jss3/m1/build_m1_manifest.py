#!/usr/bin/env python3
"""Build the M1 manifest (two Mathematics equation layouts) with order_index resolved from a CURRENT row capture by exact
(term, original title); records the matched row-body sha256 in M1_ROW_GUARDS.csv (--expect-guards fails on drift).
Usage: build_m1_manifest.py --capture supplemented-rows.json --assets DIR --out DIR [--expect-guards FILE]"""
import argparse, csv, hashlib, json, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
COLS = ['asset_key', 'file', 'sha256', 'order_index', 'expected_title', 'caption', 'alt_text', 'displayed', 'sort_order']
sha = lambda b: hashlib.sha256(b).hexdigest()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--capture', required=True); ap.add_argument('--assets', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--spec', default=str(HERE / 'm1_equation_layouts.json')); ap.add_argument('--expect-guards')
    a = ap.parse_args()
    figs = json.loads(Path(a.spec).read_text(encoding='utf-8'))['figures']
    rows = [r for r in json.loads(Path(a.capture).read_text(encoding='utf-8'))
            if r['subjectName'] == 'Mathematics' and r['className'] == 'JSS 3' and not str(r['weekLabel']).startswith('SUPPLEMENT')]
    out, guards = [], set()
    for i, f in enumerate(figs):
        m = [r for r in rows if r['termLabel'] == f['term'] and r['title'] == f['row_title']]
        if len(m) != 1: print(f"identity not unique/present: {f['term']} / {f['row_title']} ({len(m)})"); return 1
        r = m[0]; p = Path(a.assets) / f['file']
        if not p.is_file(): print('missing asset', p); return 1
        guards.add((f['term'], f['row_title'], str(int(r['orderIndex'])), sha(r['sourceReference'].encode('utf-8'))))
        out.append(dict(asset_key='M1-' + f['id'], file=f['file'], sha256=sha(p.read_bytes()), order_index=int(r['orderIndex']),
                        expected_title=f['row_title'], caption=f['caption'], alt_text=f['alt_text'], displayed='true', sort_order=20 + i))
    o = Path(a.out); o.mkdir(parents=True, exist_ok=True)
    cur = sorted(guards)
    if a.expect_guards:
        old = [tuple(x) for x in csv.reader(open(a.expect_guards, encoding='utf-8'))][1:]
        if cur != sorted(old): print('row identity/body drift against', a.expect_guards); return 1
    with open(o / 'M1_EQUATIONS_MANIFEST.csv', 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, COLS, lineterminator='\n'); w.writeheader(); w.writerows(out)
    with open(o / 'M1_ROW_GUARDS.csv', 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh, lineterminator='\n'); w.writerow(['term', 'original_row_title', 'order_index', 'source_body_sha256']); w.writerows(cur)
    print('manifest rows:', len(out)); return 0
sys.exit(main())
