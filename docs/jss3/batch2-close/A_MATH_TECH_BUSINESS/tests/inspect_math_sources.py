"""Private reproducible Office Math inventory. No copyrighted body dump is published.
Usage: python inspect_math_sources.py INPUTS/ALL OUTPUT.json
Counts all oMath nodes and records per-object XML hashes and paragraph locators.
An inventory is not proof that all formulas are correct or recovered in the app.
"""
import sys,json,hashlib,zipfile
from pathlib import Path
import xml.etree.ElementTree as E
root=Path(sys.argv[1]);out=Path(sys.argv[2]);W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';M='http://schemas.openxmlformats.org/officeDocument/2006/math';records=[]
for f in sorted(root.glob('*/*')):
 if 'MATH' not in f.name.upper() or f.suffix!='.docx':continue
 raw=f.read_bytes();tree=E.fromstring(zipfile.ZipFile(f).read('word/document.xml'));objects=[];seen=set()
 for pnum,p in enumerate(tree.iter('{'+W+'}p'),1):
  for e in p.iter('{'+M+'}oMath'):
   if id(e) in seen:continue
   seen.add(id(e))
   xml=E.tostring(e);objects.append(dict(index=len(objects)+1,paragraph_index=pnum,xml_sha256=hashlib.sha256(xml).hexdigest(),text_runs=len(list(e.iter('{'+M+'}t'))),fraction_count=len(list(e.iter('{'+M+'}f')))))
 records.append(dict(source=str(f.relative_to(root)),source_sha256=hashlib.sha256(raw).hexdigest(),equation_count=len(objects),objects=objects))
assert sorted(r['equation_count'] for r in records)==[75,379]
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(records,indent=2)+'\n');print('Office Math inventory:',[r['equation_count'] for r in records])
