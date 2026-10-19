#!/usr/bin/env python3
"""Inventory drawn/embedded objects in the JSS3 source .docx files (text extraction cannot see them).
Usage: inventory_drawings.py <root-with-docx> <out.csv> [--only SUBSTRING ...]
One row per paragraph that holds a picture, a drawing canvas/group, a text box or loose vector shapes:
  file, para_index, heading_context (last short text line before it), text_before, text_after,
  kind (picture | textbox | vector | picture+vector), pictures, vector_shapes, textbox_text, width_pt, height_pt, media
Classification is factual only. 'Decorative or instructional' is a human decision: rows with no media, no text and
a tiny size are marked review=low (likely rule/border); everything else review=check. Never count review=low as a missing lesson.
Needs only the standard library."""
import csv, re, sys, zipfile
from xml.etree import ElementTree as ET
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W, 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main', 'v': 'urn:schemas-microsoft-com:vml',
      'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
      'wps': 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'rel': 'http://schemas.openxmlformats.org/package/2006/relationships'}
q = lambda p, t: '{%s}%s' % (NS[p], t)
def ptext(p): return ''.join(t.text or '' for t in p.iter(q('w', 't'))).strip()
def own_text(p):
    """Paragraph text excluding text boxes."""
    out = []
    for r in p.iter(q('w', 'r')):
        if any(a.tag == q('w', 'txbxContent') for a in r.iter()): continue
        out.append(''.join(t.text or '' for t in r.iter(q('w', 't'))))
    return ''.join(out).strip()
def size_pt(p):
    for e in p.iter(q('wp', 'extent')):
        return round(int(e.get('cx', 0)) / 12700), round(int(e.get('cy', 0)) / 12700)
    for s in p.iter(q('v', 'shape')):
        m = re.search(r'width:([\d.]+)pt;height:([\d.]+)pt', s.get('style', '')); 
        if m: return round(float(m.group(1))), round(float(m.group(2)))
    return '', ''
def inventory(path):
    z = zipfile.ZipFile(path); root = ET.fromstring(z.read('word/document.xml'))
    rels = {}
    if 'word/_rels/document.xml.rels' in z.namelist():
        for r in ET.fromstring(z.read('word/_rels/document.xml.rels')): rels[r.get('Id')] = r.get('Target')
    nested = {id(x) for b in root.iter(q('w', 'txbxContent')) for x in b.iter(q('w', 'p'))}
    paras = [x for x in root.iter(q('w', 'p')) if id(x) not in nested]; rows = []; heading = ''
    for i, p in enumerate(paras):
        pics = list(p.iter(q('a', 'blip'))) + list(p.iter(q('v', 'imagedata')))
        vec = [e for e in p.iter() if e.tag in (q('v', 'line'), q('v', 'shape'), q('v', 'rect'), q('v', 'oval'), q('v', 'polyline'), q('v', 'curve'), q('wps', 'wsp'))
               and not (e.tag == q('v', 'shape') and any(c.tag == q('v', 'imagedata') for c in e))
               and not any(c.tag == q('w', 'txbxContent') for c in e.iter())]
        boxes = [ptext(b) for b in p.iter(q('w', 'txbxContent'))]
        if pics or vec or any(boxes):
            media = [rels.get(b.get(q('r', 'embed')) or b.get(q('r', 'id')), '') for b in pics]
            w, h = size_pt(p); box = ' | '.join(b for b in boxes if b)
            kind = 'picture+vector' if pics and vec else 'picture' if pics else 'textbox' if box and not vec else 'vector'
            tiny = isinstance(w, int) and isinstance(h, int) and not pics and not box and (w < 4 or h < 4 or (w * h) < 40)
            nxt = next((own_text(x) for x in paras[i + 1:i + 6] if own_text(x)), '')
            rows.append([path.split('/')[-1], i, heading, own_text(p)[:160], nxt[:160], kind, len(pics), len(vec), box[:200], w, h, ';'.join(m for m in media if m), 'low' if tiny else 'check'])
        t = own_text(p)
        if t and len(t) <= 80: heading = t
    return rows
def main():
    import os
    root, out, only = sys.argv[1], sys.argv[2], sys.argv[sys.argv.index('--only') + 1:] if '--only' in sys.argv else []
    hdr = ['file', 'para_index', 'heading_context', 'text_before', 'text_after', 'kind', 'pictures', 'vector_shapes', 'textbox_text', 'width_pt', 'height_pt', 'media', 'review']
    n = 0
    with open(out, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f); w.writerow(hdr)
        for d, _, fs in sorted(os.walk(root)):
            for fn in sorted(fs):
                if fn.lower().endswith('.docx') and not fn.startswith('~$') and (not only or any(o.lower() in fn.lower() for o in only)):
                    for r in inventory(os.path.join(d, fn)): w.writerow(r); n += 1
    print(f'{n} object paragraphs written to {out}')
if __name__ == '__main__': main()
