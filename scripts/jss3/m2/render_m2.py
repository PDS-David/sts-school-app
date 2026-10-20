"""M2: render the substitution-method working of the Second Term Mathematics note, with its cancellation strokes and fractions.

Why a scratch copy: the repository importer drops Office Math (fractions) and the strokes are drawing objects, so the delivered row loses
"7/7 = 7x/7", "-11n/-11 = -12/-11", "n = 1 1/11", "m = 3 - 2(12/11)" and so on. LibreOffice draws them only when its Math module is installed
(Ubuntu package libreoffice-math). The scratch copy differs from the original in exactly two mechanical ways, both listed in m2_figures.json:
  1. page breaks are inserted before named paragraphs, so a working is not split across pages;
  2. drawing objects of named paragraphs may be removed ("omit_drawings_in_paragraphs"): used only for strokes whose target cannot be determined.
No character, equation, fraction or kept stroke is added or changed. The original .docx is only read.

Paragraph numbers are 0-based over ALL w:p elements of word/document.xml (the V2 convention; verified: 79, 80, 83, 111 each contain connector shapes).

Usage: python3 render_m2.py --docx "<.../BASIC 9 MATHEMATICS E-NOTE.docx>" --spec m2_figures.json --out DIR
"""
import argparse, hashlib, json, shutil, subprocess, tempfile, zipfile
from pathlib import Path
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}
DRAWING_TAGS = ('{%s}drawing' % W,)


def paragraphs(root):
    return list(root.iter('{%s}p' % W))


def make_scratch(src, dst, breaks, omit):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                root = etree.fromstring(data)
                paras = paragraphs(root)
                for i in sorted(set(omit)):
                    # remove the whole run that holds the drawing (mc:AlternateContent / w:drawing), nothing else
                    for run in [r for r in paras[i].findall('w:r', NS) if r.xpath('.//w:drawing', namespaces=NS)]:
                        paras[i].remove(run)
                for i in sorted(set(breaks)):
                    r = etree.Element('{%s}r' % W); br = etree.SubElement(r, '{%s}br' % W); br.set('{%s}type' % W, 'page')
                    ppr = paras[i].find('{%s}pPr' % W)
                    paras[i].insert(1 if ppr is not None else 0, r)
                data = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
            zout.writestr(item, data)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--docx', required=True); ap.add_argument('--spec', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--dpi', type=int, default=220); ap.add_argument('--probe', action='store_true', help='write whole pages only')
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text(encoding='utf-8'))
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix='m2render-'))
    dst = work / 'm2.docx'
    make_scratch(a.docx, dst, spec['page_breaks_before_paragraph'], spec['omit_drawings_in_paragraphs'])
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', str(work), str(dst)], check=True, capture_output=True, timeout=280)
    pdf = work / 'm2.pdf'; shutil.copyfile(pdf, out / 'm2_scratch.pdf')
    from PIL import Image, ImageChops
    manifest = []
    for fig in spec['figures']:
        prefix = work / fig['id']
        subprocess.run(['pdftoppm', '-r', str(a.dpi), '-png', '-f', str(fig['page']), '-l', str(fig['page']), '-singlefile', str(pdf), str(prefix)], check=True)
        im = Image.open(f'{prefix}.png').convert('RGB')
        if a.probe:
            im.save(out / f"probe_{fig['id']}.png"); continue
        s = a.dpi / 72.0
        x0, y0, x1, y1 = [int(v * s) for v in fig['box_pt']]
        crop = im.crop((x0, y0, x1, y1))
        bbox = ImageChops.difference(crop, Image.new('RGB', crop.size, 'white')).getbbox()
        if bbox: crop = crop.crop(bbox)
        pad = 12
        canvas = Image.new('RGB', (crop.width + 2 * pad, crop.height + 2 * pad), 'white'); canvas.paste(crop, (pad, pad))
        path = out / fig['file']; canvas.save(path, optimize=True)
        manifest.append({'id': fig['id'], 'file': fig['file'], 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'size': canvas.size})
    if not a.probe:
        (out / 'render_manifest.json').write_text(json.dumps(manifest, indent=1)); print(json.dumps(manifest, indent=1))


if __name__ == '__main__':
    main()
