import json,csv,re,os,sys,unicodedata,hashlib,collections,glob
# usage: build_semantic_closure.py ORIGINAL_ROWS_JSON INPUTS_DIR OUTPUT_CSV SUPPLEMENTED_ROWS_JSON  (run from repo root)
# Word-overlap triage is a LEAD generator only. SEMANTIC_DECISIONS.csv holds individually reviewed decisions whose anchors are re-verified here.
R=os.getcwd(); ROWS_JSON,INPUTS,OUTCSV,SUPP_JSON=sys.argv[1:5]
rows=json.load(open(ROWS_JSON))
sup=json.load(open(R+'/backend/src/db/data/jss3Supplements.json'))
inv={}
for x in csv.DictReader(open(''+INPUTS+'/SOURCE_INVENTORY.csv')): inv[x.get('path') or x.get(list(x.keys())[0])]=x
def norm(s):
    s=unicodedata.normalize('NFKD',s); s=''.join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r'[^a-z0-9 ]+',' ',s)
STOP=set('the and of in to a for on with their its be as is by an or at from week term work lesson'.split())
def toks(s): return {t for t in norm(s).split() if len(t)>2 and t not in STOP and not t.isdigit()}
def clean(t): return re.sub(r'^\s*(wk\s*\d+|week\s*\w+|\d+\s*(and|&|-)?\s*\d*\s*e?[.)]?|\d+\s*(e|eme|ere|iere)\b)\s*[-:—]?\s*','',t.replace('\xa0',' ').strip(),flags=re.I)
def srckey(r): return (os.path.basename(os.path.dirname(r['filePath'])).strip(),os.path.basename(r['filePath']).strip())
fsubj={srckey(r):r['subjectName'] for r in rows}
srcsha={}
for p in glob.glob(INPUTS+'/ALL/*/*'):
    srcsha[(os.path.basename(os.path.dirname(p)).strip(),os.path.basename(p).strip())]=hashlib.sha256(open(p,'rb').read()).hexdigest()
lines=[x for x in csv.DictReader(open(R+'/docs/jss3/LATEST_SOURCE_LINE_DISPOSITION.csv')) if x['latest_disposition']=='SEMANTIC_REVIEW_REQUIRED']
def ismarker(t):
    c=clean(t).lower()
    c=re.sub(r'(revision|examination|examiniation|exam|jsce|periodic|test|first|second|third|term|half|work|of|and|the|[0-9&/\-–:.()\s]|wk|week)','',c)
    return c.strip()==''
bt=[toks(r['sourceReference']) for r in rows]; tt=[toks(r['title']) for r in rows]
out=[]
for l in lines:
    doc=l['source_document']; folder=doc.split('/')[0].strip(); base=doc.split('/',1)[1].strip(); k=(folder,base)
    subj=fsubj.get(k)
    if subj is None:
        # e.g. third-term docs: subject from sibling rows of the same file name stem
        m=[v for kk,v in fsubj.items() if kk[0]==folder and kk[1].split('.')[0].lower()[:5]==base.split('.')[0].lower()[:5]]
        subj=m[0] if m else None
    lt=toks(clean(l['text']))
    rec=dict(candidate_id=l['candidate_id'],source_document=doc,source_sha256=srcsha.get(k,''),source_text_line=l['source_text_line'],objective_text=re.sub(r'\s+',' ',l['text']).strip(),canonical_subject=subj or '')
    if ismarker(l['text']):
        rec.update(disposition='STRUCTURAL_MARKER',support_row='',support_term='',support_title='',support_locator='',evidence_excerpt='',title_overlap='',body_overlap='',rationale='Line is only an examination/revision/test marker with no instructional objective of its own.',limitation='Marker only; surrounding teaching is covered by other candidates.'); out.append(rec); continue
    best=None
    for i,r in enumerate(rows):
        if not lt or (subj and r['subjectName']!=subj): continue
        T=len(lt&tt[i])/len(lt); B=len(lt&bt[i])/len(lt); sf=srckey(r)==k
        T2=(len(lt&tt[i])/len(tt[i])) if tt[i] else 0
        sc=max(T,T2*0.9)+B+(0.3 if sf else 0)
        if not best or sc>best[0]: best=(sc,i,T,B,sf,T2)
    if not best:
        rec.update(disposition='UNRESOLVED_NO_CANDIDATE_ROW',support_row='',support_term='',support_title='',support_locator='',evidence_excerpt='',title_overlap='',body_overlap='',rationale='No same-subject original row candidate located.',limitation='Needs source reading.'); out.append(rec); continue
    sc,i,T,B,sf,T2=best; r=rows[i]
    # excerpt: window around first matching token in the body
    body=r['sourceReference']; first=None
    for t in sorted(lt,key=len,reverse=True):
        m=re.search(re.escape(t),norm(body)); 
        if m: first=t;break
    pos=body.lower().find(first) if first else -1
    ex=re.sub(r'\s+',' ',body[max(0,pos-40):pos+120]) if pos>=0 else ''
    band='STRONG' if (T>=0.8 and B>=0.9) else 'GOOD' if (B>=0.9 and T>=0.4) else 'BODY_ONLY' if B>=0.9 else 'WEAK'
    if band in('WEAK','BODY_ONLY') and sf and T2>=0.8 and len(tt[i])>=1:
        band='TITLE'
    disp={'TITLE':'ORIGINAL_LESSON_TITLE_NAMED_TOPIC_LEVEL','STRONG':'ORIGINAL_LESSON_EVIDENCE_STRONG','GOOD':'ORIGINAL_LESSON_EVIDENCE_STRONG','BODY_ONLY':'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION','WEAK':'LEAD_ONLY_NEEDS_READING'}[band]
    rec.update(disposition=disp,support_row=f"{os.path.basename(r['filePath']).strip()}#order{r['orderIndex']}",support_term=r['termLabel'],support_title=r['title'],
      support_locator=f"row_sha256={hashlib.sha256(body.encode()).hexdigest()[:16]}; same_source_file={'yes' if sf else 'no'}",evidence_excerpt='',title_overlap=round(T,2),body_overlap=round(B,2),
      rationale=(f"Original row titled '{r['title'][:50]}' in the same source file; the objective names this lesson topic (title-word coverage {T2:.2f}). Topic-level only." if band=='TITLE' else f"{int(round(B*len(lt)))}/{len(lt)} objective content words occur in the original row body; {int(round(T*len(lt)))}/{len(lt)} in its title."),
      limitation='Word-overlap evidence against the captured original row; not teacher-certified semantic coverage.' if band not in('WEAK',) else 'Weak overlap; objective components not demonstrated. Read source and row before any closure.')
    out.append(rec)
print(collections.Counter(o['disposition'] for o in out))
supp=json.load(open(SUPP_JSON)); byid={o['candidate_id']:o for o in out}
for d in csv.DictReader(open(R+'/docs/jss3/replacements/SEMANTIC_DECISIONS.csv')):
    o=byid[d['candidate_id']]; kind=d['support_kind']; o.update(disposition=d['disposition'],rationale=d['rationale'],limitation=d['limitation'])
    if kind=='marker': o.update(support_row='',support_term='',support_title='',support_locator='',title_overlap='',body_overlap=''); continue
    if kind=='original':
        sj,tm,od=d['row_filter'].split('|'); row=next(r for r in rows if r['subjectName']==sj and r['termLabel']==tm and r['orderIndex']==int(od))
    else:
        row=next(r for r in supp if r['filePath'].endswith('/'+d['row_filter']+'.json'))
    m=re.search(re.escape(d['anchor_regex']),row['sourceReference'],re.I); assert m,(d['candidate_id'],d['anchor_regex'])
    o.update(support_row=f"{os.path.basename(row['filePath']).strip()}#order{row['orderIndex']}",support_term=row['termLabel'],support_title=row['title'],
      support_locator=f"chars {m.start()}-{m.end()}; anchor_sha256={hashlib.sha256(m.group(0).encode()).hexdigest()[:16]}; row_sha256={hashlib.sha256(row['sourceReference'].encode()).hexdigest()[:16]}; verified_by=SEMANTIC_DECISIONS.csv",
      title_overlap='',body_overlap='',evidence_excerpt='')
with open(OUTCSV,'w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(out[0].keys()),lineterminator='\n'); w.writeheader(); w.writerows(out)
