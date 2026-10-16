from pathlib import Path
import json,csv,hashlib
from docx import Document
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--sources',type=Path,required=True);parser.add_argument('--rows',type=Path,required=True);args=parser.parse_args()
repo=Path(__file__).resolve().parents[2];sources=args.sources;rows=json.loads(args.rows.read_text());dest=repo/'docs/jss3/replacements'

def support(key,anchor):
 r=next(x for x in rows if (key.startswith('SUP-') and x['filePath'].endswith('/'+key+'.json')) or (not key.startswith('SUP-') and x['subjectName']=='Yoruba' and x['termLabel']==key.split(':')[0] and x['orderIndex']==int(key.split(':')[1])))
 start=r['sourceReference'].find(anchor);assert start>=0,(key,anchor)
 return dict(lesson=f"{r['subjectName']} / {r['termLabel']} #{r['orderIndex']} / {r['title']}",body_sha256=hashlib.sha256(r['sourceReference'].encode()).hexdigest(),anchor=anchor,character_start=start,character_end=start+len(anchor))
# One mapping per scheme strand. Exact original source labels retained.
spec=[('YO-T1-W2',1,2,[('SUP-YO-COMPOSITION','Objectives'),('SUP-YO-INHERITANCE','Ogún pípín concerns'),('SUP-YO-CULTURE','Ìjálá is associated')]),('YO-T1-W8',1,8,[('2nd Term:1','Orisii awe gbolohun'),('2nd Term:2','2. Ogun:'),('SUP-YO-LICENSED-STORY','Complete story text:')]),('YO-T2-W3',2,3,[('2nd Term:1','APOLA (PHRASE)'),('SUP-YO-CULTURE','An origin narrative'),('SUP-YO-LICENSED-STORY','Complete story text:')]),('YO-T2-W4',2,4,[('SUP-YO-COMPOSITION','Objectives'),('2nd Term:2','OWE ILE YORUBA'),('SUP-YO-LINEAGE','A — Ẹlẹ́rìn:')]),('YO-T2-W5',2,5,[('SUP-YO-GRAMMAR','Objectives'),('SUP-YO-IDIOM','Objectives'),('SUP-YO-LICENSED-STORY','Complete story text:')]),('YO-T2-W6-7',2,6,[('SUP-YO-READ','Ìwé tí ó sọnù'),('2nd Term:2','AWON ORISA ILE YORUBA ATI AWON EEWO WON'),('SUP-YO-LICENSED-STORY','Complete story text:')]),('YO-T2-W6-7',2,7,[('SUP-YO-POEM','Ìwé mi'),('2nd Term:2','AWON ORISA ILE YORUBA ATI AWON EEWO WON'),('SUP-YO-LICENSED-STORY','Complete story text:')]),('YO-T2-W9',2,9,[('SUP-YO-ADV','Objectives'),('SUP-YO-NAMING','Objectives'),('SUP-YO-LICENSED-STORY','Complete story text:')])]
files={1:next(sources.rglob('JS3 YORUBA.docx')),2:next(sources.rglob('YORUBA  JS 3.docx'))};out=[]
for id,term,week,supports in spec:
 p=files[term];table=Document(p).tables[0];tr=next((i,r) for i,r in enumerate(table.rows) if r.cells[0].text.strip().rstrip('.')==str(week));i,r=tr;objectives=r.cells[1].text.splitlines();assert len(objectives)==3,(id,objectives)
 for objective,(key,anchor) in zip(objectives,supports):
  ev=support(key,anchor);out.append(dict(gap_id=id,source_file=str(p.relative_to(sources)),source_sha256=hashlib.sha256(p.read_bytes()).hexdigest(),locator=f'table 1, row {i+1}, column 2',scheme_objective=objective,coverage='GENRE_RECOGNITION_PARTIAL' if id=='YO-T1-W2' and key=='SUP-YO-CULTURE' else ('ORIGINAL_BODY' if not key.startswith('SUP-') else 'OWNER_AUTHORISED_REPLACEMENT'),**ev,limit='Replacement reading is not represented as the unidentified government-prescribed book.' if 'LITIRESO' in objective and key=='SUP-YO-LICENSED-STORY' else ''))
with (dest/'YORUBA_OBJECTIVE_MAP.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=out[0].keys(),lineterminator="\n");w.writeheader();w.writerows(out)
print(len(out),'source strands mapped and anchors verified')
