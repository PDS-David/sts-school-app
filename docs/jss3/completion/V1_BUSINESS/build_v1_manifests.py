#!/usr/bin/env python3
"""Build V1 Business attach manifests by STABLE identity (never a hard-coded row number).
Usage (from repo root):
  python3 docs/jss3/completion/V1_BUSINESS/build_v1_manifests.py --capture <supplemented-rows.json> --all-root <ALL dir>
Original rows are resolved by source file + term + title + sha256(body); supplement rows by lesson id + term.
Original embedded JPEGs are extracted from the source .docx and pinned by sha256. Fails on 0 or >1 matches.
Alt text/captions come from V1_ASSET_SPEC.json, so regenerating the manifests cannot drop them."""
import argparse, csv, hashlib, json, shutil, zipfile
from pathlib import Path
HERE = Path(__file__).parent; OUT = Path('curriculum-assets/jss3/supplements')
JPEG_PINS = {'image3.jpeg': '7eccd80855cefb1617d340506d3e1da9605598f4094817e2d7377aa9e7473c3f',
             'image4.jpeg': '07b72a3a49c7d6b6361146b7d3307acb70eafa310c6c793d0d05b60b1b030139'}
ap = argparse.ArgumentParser(); ap.add_argument('--capture', required=True); ap.add_argument('--all-root', required=True); a = ap.parse_args()
cap = json.load(open(a.capture)); spec = json.load(open(HERE / 'V1_ASSET_SPEC.json')); assets = HERE / 'assets'
sha = lambda b: hashlib.sha256(b).hexdigest()
third = next(Path(a.all_root).glob('*3RD TERM*/BUSINESS STUDIES FOR JSS3.docx'))
with zipfile.ZipFile(third) as z:
    for name, pin in JPEG_PINS.items():
        data = z.read('word/media/' + name); assert sha(data) == pin, f'{name} hash drift'
        (assets / name).write_bytes(data)
def resolve(t):
    if t['kind'] == 'original':
        m = [r for r in cap if r['subjectName'] == 'Business Studies' and r['className'] == 'JSS 3' and 'SUPPLEMENT' not in r['weekLabel']
             and r['filePath'].split('/')[-1] == t['basename'] and r['termLabel'] == t['term'] and r['title'] == t['title']
             and sha(r['sourceReference'].encode()) == t['body_sha256']]
    else:
        m = [r for r in cap if r['weekLabel'] == 'SUPPLEMENT ' + t['lesson_id'] and r['termLabel'] == t['term'] and r['subjectName'] == 'Business Studies']
    assert len(m) == 1, f'{t} resolved to {len(m)} rows'; return m[0]
groups = {}; seen = set(); bindings = []
for s in spec:
    assert s['asset_key'] not in seen; seen.add(s['asset_key'])
    row = resolve(s['target']); src = assets / s['file']
    if s['file'].startswith('image'):
        dst_name = s['asset_key'] + '.jpeg'; shutil.copyfile(src, OUT / dst_name)
    else:
        dst_name = s['file']; assert src.exists(), src; shutil.copyfile(src, OUT / dst_name)
    n = sum(1 for g in groups.get(row['termLabel'], []) if g[0] == row['orderIndex']) + 1
    groups.setdefault(row['termLabel'], []).append((row['orderIndex'], [s['asset_key'], dst_name, sha((OUT / dst_name).read_bytes()), row['orderIndex'], row['title'], s['caption'], s['alt_text'], 'true', n]))
    bindings.append([s['asset_key'], row['termLabel'], row['orderIndex'], row['title'], s['target']['kind'], s['origin'], dst_name, sha((OUT / dst_name).read_bytes())])
for term, tag in (('1st Term', '1ST'), ('2nd Term', '2ND')):
    with open(OUT / f'V1_BUSINESS_{tag}_MANIFEST.csv', 'w', newline='') as fh:
        w = csv.writer(fh, lineterminator='\n'); w.writerow(['asset_key', 'file', 'sha256', 'order_index', 'expected_title', 'caption', 'alt_text', 'displayed', 'sort_order'])
        for _, r in groups[term]: w.writerow(r)
with open(HERE / 'V1_ASSET_BINDINGS.csv', 'w', newline='') as fh:
    w = csv.writer(fh, lineterminator='\n'); w.writerow(['asset_key', 'term', 'resolved_order_index', 'lesson_title', 'target_kind', 'origin', 'file', 'sha256']); w.writerows(bindings)
print(len(spec), 'assets bound;', {t: len(g) for t, g in groups.items()})
