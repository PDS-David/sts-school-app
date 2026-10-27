"""Author package references from exact private extracts; not an importer/test runner.
Usage: python docs/ss1/work/SS1-02/author_packages.py PRIVATE_INPUT_DIR
The source text itself is never copied into the package or Git.
"""
import json,re,hashlib,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
PRIVATE=Path(sys.argv[1]); RECORDS=json.loads((PRIVATE/'assigned.json').read_text())
def sha(t): return hashlib.sha256(t.encode()).hexdigest()
def read(r): return (PRIVATE/'texts'/f"{r['source_id']}.txt").read_text()
NAMES={'english':'English Language','french':'French','yoruba':'Yoruba','literature':'Literature-in-English'}
WEEK=re.compile(r'^[ \t]*week\s*[:.\-]*\s*((?:\d+(?:\s*(?:&|and|,|-)\s*\d+)?)|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen))',re.I|re.M)
NUM=dict(zip('one two three four five six seven eight nine ten eleven twelve thirteen'.split(),range(1,14)))
# Exact extracted line numbers select authored structural boundaries, never inferred target counts.
SPLITS={
'SS1-SRC-a00657d42196':[68,272,346,374,420,484,503,561,615,665,808,833,873,911,929,1061,1088,1151,1194,1225,1298,1320,1396,1462,1568,1625],
'SS1-SRC-d8bd8f85fd73':[233],
'SS1-SRC-50fa9b1eb2fd':[97,137,181,238,248,303,332,530,685,723,793,863,928,949,1027,1051,1109,1154,1199,1224]
}
def package(slug):
 p=dict(schema_version='ss1-subject-v1',subject_slug=slug,canonical_subject=NAMES[slug],package_status='IMPLEMENTED',sources=[],source_rules=[],lessons=[],delivery_corrections=[],assets=[],coverage=[],open_items=[])
 return p

def add_open(p,id,detail,action,affected,kind='CONTENT'):
 p['open_items'].append(dict(id=id,kind=kind,detail=detail,required_action=action,affected_ids=affected,blocks_delivery=True))

def source(p,r,split_lines=None):
 t=read(r);sid=r['source_id'];lines=t.splitlines(); header=next(l for l in lines if l.strip())
 # A full unique source header identifies context; canonical mapping is evidenced, not guessed from filename.
 if t.count(header)!=1:
  header='\n'.join(lines[:next(i for i,l in enumerate(lines) if l.strip())+3]).strip('\n')
 p['sources'].append(dict(source_id=sid,sha256=r['sha256'],archive_member=r['archive_member'],class_name='SS 1',term=r['term_from_folder'],canonical_subject=p['canonical_subject'],header_text=header,header_evidence=dict(locator=f"{sid}: extracted opening heading",explanation='Assigned subject is confirmed by the opening source heading and the teaching content; source spelling retained.')))
 def rule(op,anchor,extra):
  if t.count(anchor)!=1:raise ValueError(f'Author must choose a unique exact anchor: {sid}/{anchor!r}')
  q=dict(id=f"{sid}-R{len([x for x in p['source_rules'] if x['source_id']==sid])+1:03}",op=op,source_id=sid,source_sha256=r['sha256'],anchor=anchor,evidence=dict(locator=f"{sid}: exact mammoth/word-extractor text anchor",explanation='Structural boundary or source metadata only; original text is retained.'))
  q.update(extra);p['source_rules'].append(q);return q
 if header.strip().casefold()!=p['canonical_subject'].casefold():rule('source_alias',header,dict(observed_subject=header,canonical_subject=p['canonical_subject'],approval_reference='SS1-02 assigned-subject mapping supported by this source heading; not teacher approval of lesson content'))
 positions=[]
 offsets=[];n=0
 for line in lines:offsets.append(n);n+=len(line)+1
 for line_no in (split_lines or []):
  anchor=lines[line_no-1];pos=offsets[line_no-1]
  end=line_no
  while t.count(anchor)!=1 and end<len(lines):
   anchor+='\n'+lines[end];end+=1
  if not anchor.strip():raise ValueError(f'Empty selected line {sid}:{line_no}')
  previous=list(WEEK.finditer(t[:pos]));week=previous[-1].group(1).strip().lower() if previous else '1';week=str(NUM.get(week,week))
  q=rule('split_before',anchor,dict(week_label=week));positions.append((pos,f'WEEK {week}\n'))
 for pos,insert in sorted(positions,reverse=True):t=t[:pos]+insert+t[pos:]
 matches=list(WEEK.finditer(t));views=[]
 for i,m in enumerate(matches):
  b=t[m.start():matches[i+1].start() if i+1<len(matches) else len(t)].strip();rid=sid+':BODY:'+sha(b)
  # These authored body boundaries are expected values; deferred tests use the real parser.
  useful=[l.strip() for l in b.splitlines()[1:] if l.strip()]
  title=next((l for l in useful if not re.match(r'^(TOPICS?|CONTENT)\s*:?$',l,re.I)),b.splitlines()[0])
  views.append(dict(id=rid,body=b,title=title,week=m.group(1),source_id=sid,term=r['term_from_folder'],body_sha256=sha(b)))
 return views

def provenance(url,title):return dict(title=title,locator='Author reference consulted 2026-10-27; explanations and exercises newly authored',url=url,rights='Original teaching prose/examples authored for this project; no third-party passage or image reproduced.',reuse_status='PERMITTED',attribution=title)

def lesson(p,key,term,title,objectives,body,questions,refs):
 id='SUP-SS1-'+p['subject_slug'].upper()+'-'+key
 qs=[dict(id=f'Q{i+1}',question=q,answer=a,marks=len(criteria),marking=[dict(criterion=c,marks=1) for c in criteria]) for i,(q,a,criteria) in enumerate(questions)]
 l=dict(id=id,class_name='SS 1',term=term,subject=p['canonical_subject'],title=title,objectives=objectives,body=body,body_sha256=sha(body),practice=qs,provenance=[provenance(*ref) for ref in refs],state=dict(content_approval='PENDING',approval_reference=None,implementation='IMPLEMENTED',verification='DEFERRED',verification_reference=None))
 p['lessons'].append(l);return id

def correction(p,v,id,reason):
 r=next(r for r in RECORDS if r['source_id']==v['source_id'])
 p['delivery_corrections'].append(dict(id=f"SS1-02-{p['subject_slug']}-COR-{len(p['delivery_corrections'])+1:03}",source_id=r['source_id'],source_sha256=r['sha256'],source_lesson_id=v['id'],body_sha256=v['body_sha256'],replacement_id=id,reason=reason,evidence=dict(locator=f"{r['source_id']}: {v['title']}",explanation='Replacement is independently authored; original body remains unchanged. Runtime activation belongs to SS1-08.')))

def coverage(p,views):
 for v in views:
  c=next((x for x in p['delivery_corrections'] if x['source_lesson_id']==v['id']),None)
  p['coverage'].append(dict(id=f"{p['subject_slug'].upper()}-BODY-{len(p['coverage'])+1:03}",source_id=v['source_id'],objective=v['title'][:350],objective_locator=f"{v['source_id']}: {v['week']}; exact body hash {v['body_sha256']}",status='IMPLEMENTED_EQUIVALENT' if c else 'PARTIAL',lesson_ids=[c['replacement_id']] if c else [v['id']],evidence=[dict(locator=v['id'],explanation='Exact body reference for teaching review. A row-level association is not exhaustive scheme-objective certification; uncorrected bodies remain PARTIAL pending the detailed objective mapping.')]))

def save(p):
 out=ROOT/'backend/src/db/ss1/subjects'/f"{p['subject_slug']}.json";out.write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
