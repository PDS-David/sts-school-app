#!/usr/bin/env python3
"""Build the M2 topic-asset manifest and row guard from m2_figures.json (same identity chain as scripts/jss3/v2/build_v2_math_manifests.py).

order_index is resolved from a CURRENT capture (supplemented-rows.json) by exact (term, ORIGINAL row title); the row-body sha256 is written to
M2_ROW_GUARDS.csv and --expect-guards fails on drift. Captions and alt text live in m2_figures.json so regeneration never loses them.
"""
import argparse, csv, hashlib, importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('v2build', HERE.parent / 'v2' / 'build_v2_math_manifests.py')
v2 = importlib.util.module_from_spec(spec); spec.loader.exec_module(v2)
COLS = v2.COLS
MANIFEST = 'M2_SIMULTANEOUS_2ND_MANIFEST.csv'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--capture', required=True); ap.add_argument('--assets', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--figures', default=str(HERE / 'm2_figures.json')); ap.add_argument('--expect-guards')
    a = ap.parse_args()
    figs = json.loads(Path(a.figures).read_text(encoding='utf-8'))['figures']
    rows = v2.resolve_rows(a.capture)
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    man, guards = [], {}
    for i, f in enumerate(figs):
        ident = rows.get((f['term'], f['row_title']))
        if not ident: print(f"no original row for {f['term']} / {f['row_title']}"); return 1
        p = Path(a.assets) / f['file']
        if not p.is_file(): print(f'missing asset {p}'); return 1
        man.append({'asset_key': 'V2-MATH-' + f['id'], 'file': f['file'], 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'order_index': ident['order_index'],
                    'expected_title': f['row_title'], 'caption': f['caption'], 'alt_text': f['alt_text'], 'displayed': 'true', 'sort_order': 20 + i})
        guards[(f['term'], f['row_title'])] = ident
    cur = [(t, ti, g['order_index'], g['body_sha256']) for (t, ti), g in sorted(guards.items())]
    if a.expect_guards:
        old = [tuple(r) for r in csv.reader(open(a.expect_guards, encoding='utf-8'))][1:]
        if [(t, ti, str(o), h) for t, ti, o, h in cur] != old: print('row identity/body drift against', a.expect_guards); return 1
    with open(out / MANIFEST, 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, COLS, lineterminator='\n'); w.writeheader(); w.writerows(man)
    with open(out / 'M2_ROW_GUARDS.csv', 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh, lineterminator='\n'); w.writerow(['term', 'original_row_title', 'order_index', 'source_body_sha256']); w.writerows(cur)
    print('manifest written:', len(man)); return 0


if __name__ == '__main__':
    sys.exit(main())
