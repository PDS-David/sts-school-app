import zipfile,re,sys,json,csv,os
from collections import Counter
from lxml import etree
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','wp':'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
'a':'http://schemas.openxmlformats.org/drawingml/2006/main','pic':'http://schemas.openxmlformats.org/drawingml/2006/picture','wps':'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
'wpg':'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup','mc':'http://schemas.openxmlformats.org/markup-compatibility/2006','v':'urn:schemas-microsoft-com:vml',
'm':'http://schemas.openxmlformats.org/officeDocument/2006/math','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
W='{%s}'%NS['w']
def ptext(p): return ''.join(t.text or '' for t in p.iter(W+'t'))
def inventory(path):
    z=zipfile.ZipFile(path); root=etree.fromstring(z.read('word/document.xml'))
    body=root.find('w:body',NS); rows=[]; last=''; pidx=0
    paras=list(root.iter(W+'p'))
    for p in paras:
        pidx+=1
        txt=ptext(p).strip()
        # find drawing objects owned by this paragraph (not nested paragraphs in textboxes)
        objs=[]
        for d in p.xpath('.//w:drawing[not(ancestor::mc:Fallback)]',namespaces=NS):
            kind='drawing'
            if d.xpath('.//pic:pic',namespaces=NS): kind='picture'
            elif d.xpath('.//wpg:wgp',namespaces=NS): kind='group'
            elif d.xpath('.//wps:wsp',namespaces=NS):
                g=d.xpath('.//a:prstGeom/@prst',namespaces=NS); kind='shape:'+(g[0] if g else 'freeform')
                if d.xpath('.//wps:txbx//w:t',namespaces=NS): kind='textbox'
            name=(d.xpath('.//wp:docPr/@name',namespaces=NS) or [''])[0]; descr=(d.xpath('.//wp:docPr/@descr',namespaces=NS) or [''])[0]
            ext=d.xpath('.//wp:extent',namespaces=NS); w=h=0
            if ext: w=int(ext[0].get('cx'))/12700; h=int(ext[0].get('cy'))/12700
            inner=''.join(d.xpath('.//wps:txbx//w:t/text()',namespaces=NS)).strip()
            objs.append((kind,name,descr,round(w,1),round(h,1),inner[:60]))
        # legacy VML-only objects (no wps twin)
        for v in p.xpath('.//w:pict[not(ancestor::mc:Fallback)]',namespaces=NS):
            kind='vml'
            ch=[etree.QName(c).localname for c in v if isinstance(c.tag,str)]
            objs.append(('vml:'+(ch[0] if ch else '?'),'','',0,0,''))
        om=len(p.xpath('.//m:oMath',namespaces=NS))
        for o in objs: rows.append(dict(para=pidx,anchor=(txt or last)[:80],kind=o[0],name=o[1],descr=o[2],w=o[3],h=o[4],inner=o[5]))
        if om: rows.append(dict(para=pidx,anchor=(txt or last)[:80],kind='equation',name='',descr='',w=0,h=0,inner=str(om)))
        if txt: last=txt
    return rows
if __name__=='__main__':
    rows=inventory(sys.argv[1]); c=Counter(r['kind'] for r in rows); print(os.path.basename(sys.argv[1]),dict(c))
