"""M1 Mathematics: render the two graph-table layouts (First Term paragraphs 704-705 and 708-709) from a SCRATCH copy.

Paragraph convention (verified against the source): zero-based index over every w:p in word/document.xml in document
order (the same convention as scripts/jss3/v2/render_figures.py; this document has no nested paragraphs, so it equals the
body-paragraph index). Paragraphs 704/705 hold the two tables of example (a); 708/709 hold the two tables of example (b).

LibreOffice does not draw inline Office Math, so the row headings "x" and "y" and the "x =" answer labels vanish from a plain
render. The scratch copy replaces each OMML run in the four paragraphs by an ordinary run with the SAME characters.
Nothing is added, redrawn or corrected; the drawn lines are rendered by the real renderer. The original is only read.

Usage: python3 render_equation_layouts.py --m1 "<JSS 3 MATHEMATICS.docx>" --spec m1_equation_layouts.json --out DIR
"""
import argparse, hashlib, json, subprocess, tempfile, zipfile
from pathlib import Path
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
M = 'http://schemas.openxmlformats.org/officeDocument/2006/math'
XML = '{http://www.w3.org/XML/1998/namespace}space'


def flatten_math_in(root, indexes):
    paras = list(root.iter('{%s}p' % W)); n = 0
    for i in indexes:
        for om in list(paras[i].iter('{%s}oMath' % M)):
            text = ''.join(t.text or '' for t in om.iter('{%s}t' % M))
            r = etree.Element('{%s}r' % W)
            t = etree.SubElement(r, '{%s}t' % W); t.text = text; t.set(XML, 'preserve')
            parent = om.getparent()
            if parent.tag == '{%s}oMathPara' % M:
                om = parent; parent = om.getparent()
            parent.replace(om, r); n += 1
    return n


def make_scratch(src, dst, indexes):
    flat = 0
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                root = etree.fromstring(data)
                flat = flatten_math_in(root, indexes)
                data = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
            zout.writestr(item, data)
    return flat


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--m1', required=True); ap.add_argument('--spec', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--dpi', type=int, default=220)
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text(encoding='utf-8'))
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix='m1render-'))
    idx = sorted({i for f in spec['figures'] for i in f['paragraphs']})
    dst = work / 'm1.docx'
    flat = make_scratch(a.m1, dst, idx)
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', str(work), str(dst)], check=True, capture_output=True, timeout=280)
    print('OMML runs flattened in paragraphs', idx, ':', flat)
    from PIL import Image, ImageChops
    res = []
    for fig in spec['figures']:
        prefix = work / fig['id']
        subprocess.run(['pdftoppm', '-r', str(a.dpi), '-png', '-f', str(fig['page']), '-l', str(fig['page']), '-singlefile', str(work / 'm1.pdf'), str(prefix)], check=True)
        im = Image.open(f'{prefix}.png').convert('RGB'); s = a.dpi / 72.0
        x0, y0, x1, y1 = [int(v * s) for v in fig['box_pt']]
        crop = im.crop((x0, y0, x1, y1))
        bb = ImageChops.difference(crop, Image.new('RGB', crop.size, 'white')).getbbox()
        if bb: crop = crop.crop(bb)
        pad = 10
        canvas = Image.new('RGB', (crop.width + 2 * pad, crop.height + 2 * pad), 'white'); canvas.paste(crop, (pad, pad))
        p = out / fig['file']; canvas.save(p, optimize=True)
        res.append({'id': fig['id'], 'file': fig['file'], 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'size': canvas.size})
    print(json.dumps(res, indent=1))


if __name__ == '__main__':
    main()
