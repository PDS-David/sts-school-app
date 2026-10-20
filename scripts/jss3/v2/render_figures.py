"""V2 Mathematics: render a SCRATCH copy of each original so that figures are complete, then crop them.

Why a scratch copy: LibreOffice does not draw Office Math (OMML) that sits inside text boxes, so labels such as
"Opposite to B" and the marked-angle symbol are silently dropped from a plain render. The scratch copy replaces each
OMML run inside a text box by the same characters as an ordinary run (no character is added or changed) and may insert a
page break before a named paragraph so a figure is not split across pages. Geometry (shapes, connectors, charts, pictures)
is untouched and is drawn by the real renderer. The original .docx is only read.

Usage: python3 render_figures.py --m1 <JSS 3 MATHEMATICS.docx> --m2 <BASIC 9 MATHEMATICS E-NOTE.docx> --spec figures_spec.json --out DIR
"""
import argparse, json, shutil, subprocess, tempfile, zipfile, hashlib
from pathlib import Path
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
M = 'http://schemas.openxmlformats.org/officeDocument/2006/math'
XML = '{http://www.w3.org/XML/1998/namespace}space'


def flatten_textbox_math(root):
    n = 0
    for tb in root.iter('{%s}txbxContent' % W):
        for om in list(tb.iter('{%s}oMath' % M)):
            text = ''.join(t.text or '' for t in om.iter('{%s}t' % M))
            r = etree.Element('{%s}r' % W)
            t = etree.SubElement(r, '{%s}t' % W); t.text = text; t.set(XML, 'preserve')
            parent = om.getparent()
            if parent.tag == '{%s}oMathPara' % M:
                om = parent; parent = om.getparent()
            parent.replace(om, r); n += 1
    return n


def page_break_before(root, para_indexes):
    paras = list(root.iter('{%s}p' % W))
    for i in sorted(set(para_indexes)):
        p = paras[i]
        r = etree.Element('{%s}r' % W); br = etree.SubElement(r, '{%s}br' % W); br.set('{%s}type' % W, 'page')
        ppr = p.find('{%s}pPr' % W)
        p.insert(1 if ppr is not None else 0, r)


def make_scratch(src, dst, breaks):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                root = etree.fromstring(data)
                flat = flatten_textbox_math(root)
                page_break_before(root, breaks)
                data = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
            zout.writestr(item, data)
    return flat


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--m1', required=True); ap.add_argument('--m2', required=True)
    ap.add_argument('--spec', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--dpi', type=int, default=220)
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text())
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix='v2render-'))
    pdfs = {}
    for key, src in (('m1', a.m1), ('m2', a.m2)):
        dst = work / f'{key}.docx'
        flat = make_scratch(src, dst, spec['page_breaks_before_paragraph'][key])
        subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', str(work), str(dst)], check=True, capture_output=True, timeout=280)
        pdfs[key] = work / f'{key}.pdf'
        shutil.copyfile(pdfs[key], out / f'{key}_scratch.pdf')
        print(key, 'text-box math runs flattened:', flat)
    from PIL import Image
    manifest = []
    for fig in spec['figures']:
        pdf = pdfs[fig['doc']]
        prefix = work / f"{fig['id']}"
        subprocess.run(['pdftoppm', '-r', str(a.dpi), '-png', '-f', str(fig['page']), '-l', str(fig['page']), '-singlefile', str(pdf), str(prefix)], check=True)
        im = Image.open(f'{prefix}.png').convert('RGB')
        s = a.dpi / 72.0
        x0, y0, x1, y1 = [int(v * s) for v in fig['box_pt']]
        from PIL import ImageChops, ImageDraw
        for mx0, my0, mx1, my1 in fig.get('mask_pt', []):
            ImageDraw.Draw(im).rectangle([int(mx0 * s), int(my0 * s), int(mx1 * s), int(my1 * s)], fill='white')
        crop = im.crop((x0, y0, x1, y1))
        bbox = ImageChops.difference(crop, Image.new('RGB', crop.size, 'white')).getbbox()
        if bbox:
            crop = crop.crop(bbox)
        pad = 10
        canvas = Image.new('RGB', (crop.width + 2 * pad, crop.height + 2 * pad), 'white'); canvas.paste(crop, (pad, pad))
        path = out / f"{fig['file']}"
        canvas.save(path, optimize=True)
        manifest.append({'id': fig['id'], 'file': fig['file'], 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'size': canvas.size})
    (out / 'render_manifest.json').write_text(json.dumps(manifest, indent=1))
    print(json.dumps(manifest, indent=1))


if __name__ == '__main__':
    main()
