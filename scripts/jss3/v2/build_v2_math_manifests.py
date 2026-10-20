#!/usr/bin/env python3
"""Build the V2 Mathematics topic-asset manifests from v2_math_figures.json.

Identity chain per figure: original document -> source locator -> executable lesson identity
(subject, class, term, ORIGINAL row title, resolved order_index) -> asset bytes (sha256) -> topic_assets manifest row.

order_index is never typed in: it is resolved from a CURRENT row capture (scripts/jss3/capture_rows.py output,
supplemented-rows.json) by exact (term, title) of an ORIGINAL (non-supplement) row. The capture's source-body sha256 is
recorded in V2_MATH_ROW_GUARDS.csv so a reviewer can see which body the figure was matched to; --expect-guards checks
that a later capture still has the same bodies (drift => exit 1).

Alt text and captions live in v2_math_figures.json, so regenerating manifests never loses them.
Optional --m1/--m2 re-verify the embedded chart data against the original .docx files.
"""
import argparse, csv, hashlib, json, re, sys, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
TERM_FILE = {'1st Term': 'V2_MATH_1ST_MANIFEST.csv', '2nd Term': 'V2_MATH_2ND_MANIFEST.csv'}
COLS = ['asset_key', 'file', 'sha256', 'order_index', 'expected_title', 'caption', 'alt_text', 'displayed', 'sort_order']


def sha(b): return hashlib.sha256(b).hexdigest()


def resolve_rows(capture_path):
    rows = json.loads(Path(capture_path).read_text(encoding='utf-8'))
    out = {}
    for r in rows:
        if r['subjectName'] != 'Mathematics' or r['className'] != 'JSS 3' or str(r['weekLabel']).startswith('SUPPLEMENT'):
            continue
        key = (r['termLabel'], r['title'])
        if key in out:
            raise SystemExit(f'ambiguous original row identity {key}')
        out[key] = {'order_index': int(r['orderIndex']), 'body_sha256': sha(r['sourceReference'].encode('utf-8'))}
    return out


def chart_values(docx, n):
    t = zipfile.ZipFile(docx).read(f'word/charts/chart{n}.xml').decode('utf8')
    res = {}
    for ser in re.findall(r'<c:ser>.*?</c:ser>', t, re.S):
        name = re.findall(r'<c:tx>.*?<c:v>(.*?)</c:v>', ser, re.S)
        cats = re.findall(r'<c:v>(.*?)</c:v>', re.findall(r'<c:cat>.*?</c:cat>', ser, re.S)[0])
        vals = [float(v) for v in re.findall(r'<c:v>(.*?)</c:v>', re.findall(r'<c:val>.*?</c:val>', ser, re.S)[0])]
        res[name[0] if name else ''] = (cats, vals)
    return res


def check_charts(fig_list, m1):
    problems = []
    for f in fig_list:
        n = {'M1-F06': 1, 'M1-F07': 2, 'M1-F08': 3, 'M1-F09': 4}.get(f['id'])
        if not n: continue
        got = chart_values(m1, n); d = f['data']
        if f['id'] == 'M1-F06': ok = got and list(got.values())[0][1] == d['series']['Colour'] and list(got.values())[0][0] == d['categories']
        elif f['id'] == 'M1-F07':
            vs = list(got.values()); ok = vs[0][1] == d['boys'] and vs[1][1] == d['girls_chart']
        else: ok = list(got.values())[0][1] == d['values'] and list(got.values())[0][0] == d['categories']
        if not ok: problems.append(f"{f['id']}: chart{n}.xml {got} != figures json")
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--capture', required=True, help='supplemented-rows.json from capture_rows.py')
    ap.add_argument('--assets', required=True, help='folder holding the PNG files')
    ap.add_argument('--out', required=True, help='folder for the manifests and register')
    ap.add_argument('--figures', default=str(HERE / 'v2_math_figures.json'))
    ap.add_argument('--m1'); ap.add_argument('--expect-guards')
    a = ap.parse_args()
    figs = json.loads(Path(a.figures).read_text(encoding='utf-8'))['figures']
    rows = resolve_rows(a.capture)
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    if a.m1:
        bad = check_charts(figs, a.m1)
        if bad: print('\n'.join(bad)); return 1
    by_term = {'1st Term': [], '2nd Term': []}; guards = {}
    for i, f in enumerate(figs):
        ident = rows.get((f['term'], f['row_title']))
        if not ident: print(f"no original row for {f['term']} / {f['row_title']}"); return 1
        p = Path(a.assets) / f['file']
        if not p.is_file(): print(f"missing asset {p}"); return 1
        by_term[f['term']].append({'asset_key': 'V2-MATH-' + f['id'], 'file': f['file'], 'sha256': sha(p.read_bytes()),
            'order_index': ident['order_index'], 'expected_title': f['row_title'], 'caption': f['caption'], 'alt_text': f['alt_text'],
            'displayed': 'true', 'sort_order': 20 + len(by_term[f['term']])})
        guards[(f['term'], f['row_title'])] = ident
    for term, rs in by_term.items():
        with open(out / TERM_FILE[term], 'w', newline='', encoding='utf-8') as fh:
            w = csv.DictWriter(fh, COLS, lineterminator='\n'); w.writeheader(); w.writerows(rs)
    cur = [(t, ti, g['order_index'], g['body_sha256']) for (t, ti), g in sorted(guards.items())]
    if a.expect_guards:
        old = [tuple(r) for r in csv.reader(open(a.expect_guards, encoding='utf-8'))][1:]
        if [(t, ti, str(o), h) for t, ti, o, h in cur] != old: print('row identity/body drift against', a.expect_guards); return 1
    with open(out / 'V2_MATH_ROW_GUARDS.csv', 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh, lineterminator='\n'); w.writerow(['term', 'original_row_title', 'order_index', 'source_body_sha256']); w.writerows(cur)
    print('manifests written:', {t: len(r) for t, r in by_term.items()})
    return 0

if __name__ == '__main__':
    sys.exit(main())
