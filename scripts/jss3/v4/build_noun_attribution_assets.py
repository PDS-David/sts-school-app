#!/usr/bin/env python3
"""Extract the NOUN ENG105 Module 2 cover/logo images from the PDF the repository records, and write an
attachTopicAssets manifest bound to SUP-YO-ORAL-TEXTS. Fails closed:

  * the PDF's SHA-256 must equal the recorded value (docs/jss3/batch2-close/G2_REVIEW/SOURCE_CHECKS.json) unless
    --accept-new-hash is given (a re-download is not assumed byte-identical; the new hash is then printed);
  * `inspect` lists every embedded image on pages 1-3 so a person can choose; nothing is guessed;
  * `build` requires the exact image xrefs for cover and logo and the importer capture (supplemented-rows.json from
    scripts/jss3/capture_rows.py) so order_index comes from the real lesson row, never a hard-coded index.

No database operation. Usage:
  python3 -I scripts/jss3/v4/build_noun_attribution_assets.py inspect --pdf ENG105_02.pdf
  python3 -I scripts/jss3/v4/build_noun_attribution_assets.py build --pdf ENG105_02.pdf --cover-xref N --logo-xref M \
      --capture supplemented-rows.json [--out curriculum-assets/jss3/v4-attribution]
"""
import argparse, csv, hashlib, json, sys
from pathlib import Path

R = Path(__file__).resolve().parents[3]
LESSON = 'SUP-YO-ORAL-TEXTS'
KEYS = {'cover': 'NOUN-ENG105-M2-COVER', 'logo': 'NOUN-ENG105-M2-LOGO'}
ALT = {
 'cover': 'Cover of the National Open University of Nigeria course module ENG 105 Introduction to Literature II, Module 2, as printed on the first page of the source PDF. Shown because the source asks that its cover accompany the attribution.',
 'logo': 'Logo of the National Open University of Nigeria as printed in the source PDF. Shown because the source asks that its logo accompany the attribution.',
}
CAPTION = {
 'cover': 'Cover of NOUN ENG 105 Module 2 (CC BY-SA 4.0), the source of Text 2. First produced by the National Open University of Nigeria.',
 'logo': 'National Open University of Nigeria logo, as the source requests with its attribution. First produced by the National Open University of Nigeria.',
}

def recorded_hash():
    d = json.loads((R / 'docs/jss3/batch2-close/G2_REVIEW/SOURCE_CHECKS.json').read_text())
    return next(p['sha256'] for p in d['pdfs'] if p['file'] == 'noun.pdf')

def open_pdf(path, accept_new):
    import pymupdf
    raw = Path(path).read_bytes(); h = hashlib.sha256(raw).hexdigest()
    if h != recorded_hash():
        if not accept_new:
            sys.exit(f'REFUSED: PDF sha256 {h} != recorded {recorded_hash()}. Re-check the source text and licence page, then pass --accept-new-hash.')
        print(f'WARNING: new PDF hash {h} accepted explicitly; record it in the handoff', file=sys.stderr)
    return pymupdf.open(stream=raw, filetype='pdf'), h

def images(doc, pages=3):
    out = []
    for pno in range(min(pages, doc.page_count)):
        for im in doc[pno].get_images(full=True):
            xref = im[0]; info = doc.extract_image(xref)
            out.append(dict(page=pno + 1, xref=xref, width=info['width'], height=info['height'], ext=info['ext'], bytes=len(info['image'])))
    return out

def main():
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest='cmd', required=True)
    for n in ('inspect', 'build'):
        p = sub.add_parser(n); p.add_argument('--pdf', required=True); p.add_argument('--accept-new-hash', action='store_true')
    b = sub.choices['build']; b.add_argument('--cover-xref', type=int, required=True); b.add_argument('--logo-xref', type=int, required=True)
    b.add_argument('--capture', type=Path, required=True); b.add_argument('--out', type=Path, default=R / 'curriculum-assets/jss3/v4-attribution')
    a = ap.parse_args()
    doc, h = open_pdf(a.pdf, a.accept_new_hash)
    found = images(doc)
    if a.cmd == 'inspect':
        print(json.dumps(dict(pdf_sha256=h, pages=doc.page_count, images=found), indent=1)); return
    by_xref = {i['xref']: i for i in found}
    if a.cover_xref == a.logo_xref: sys.exit('cover and logo must be different images')
    rows = json.loads(a.capture.read_text())
    lesson = [r for r in rows if r['weekLabel'] == 'SUPPLEMENT ' + LESSON and r['className'] == 'JSS 3']
    if len(lesson) != 1: sys.exit(f'expected exactly one {LESSON} row in capture, found {len(lesson)}')
    out_rows = []; a.out.mkdir(parents=True, exist_ok=True)
    for sort, (role, xref) in enumerate((('cover', a.cover_xref), ('logo', a.logo_xref)), 1):
        if xref not in by_xref: sys.exit(f'{role} xref {xref} is not an image on pages 1-3')
        info = doc.extract_image(xref); ext = {'jpeg': 'jpeg', 'jpg': 'jpeg', 'png': 'png', 'gif': 'gif'}.get(info['ext'])
        if not ext: sys.exit(f'{role}: unsupported image type {info["ext"]}; convert losslessly and review before binding')
        fn = f'{KEYS[role].lower()}.{ext}'; (a.out / fn).write_bytes(info['image'])
        out_rows.append(dict(asset_key=KEYS[role], file=fn, sha256=hashlib.sha256(info['image']).hexdigest(), order_index=lesson[0]['orderIndex'],
                             expected_title=lesson[0]['title'], caption=CAPTION[role], alt_text=ALT[role], displayed='true', sort_order=sort))
    with (a.out / 'NOUN_ATTRIBUTION_2ND_MANIFEST.csv').open('w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(out_rows[0]), lineterminator='\n'); w.writeheader(); w.writerows(out_rows)
    (a.out / 'SOURCE.json').write_text(json.dumps(dict(pdf_sha256=h, cover_xref=a.cover_xref, logo_xref=a.logo_xref, lesson=LESSON), indent=2) + '\n')
    print(json.dumps(dict(assets=len(out_rows), pdf_sha256=h)))

if __name__ == '__main__': main()
