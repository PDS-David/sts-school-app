"""Merge the five Batch 2 DELIVERY_CORRECTIONS.json files into ONE runtime table keyed by immutable source hash.
Usage: python scripts/jss3/build_delivery_corrections.py --base-capture DIR --current-capture DIR
  --base-capture    capture_rows.py output for the commit the workers audited (86a1a61): every worker hash must match one row
  --current-capture capture_rows.py output for the tree being integrated: gives the CURRENT hash of that row
Rows whose body changed legitimately between the two (master's Maths equation recovery) keep the worker's hash in
previous_source_body_sha256 so databases holding either text are still corrected. Subject/term come from the matched row.
Never reads or writes the database. Source rows stay private; only hashes/metadata are written."""
import argparse,glob,hashlib,json,sys
from pathlib import Path
ap=argparse.ArgumentParser();ap.add_argument('--base-capture',required=True);ap.add_argument('--current-capture',required=True)
ap.add_argument('--out',default='backend/src/db/data/jss3DeliveryCorrections.json');a=ap.parse_args()
sh=lambda s:hashlib.sha256(s.encode()).hexdigest()
key=lambda r:(r['subjectName'],r['termLabel'],r['className'],r['orderIndex'],r['title'])
base={sh(r['sourceReference']):r for r in json.load(open(Path(a.base_capture)/'original-rows.json'))}
cur={key(r):r for r in json.load(open(Path(a.current_capture)/'original-rows.json'))}
lessons={l['id'] for l in json.load(open('backend/src/db/data/jss3Supplements.json'))}
out=[];seen=set()
for p in sorted(glob.glob('docs/jss3/batch2-close/*/DELIVERY_CORRECTIONS.json')):
    pkg=p.split('/')[-2][0]
    for c in json.load(open(p)):
        r=base.get(c['source_body_sha256']);
        if r is None: sys.exit(f"{c['id']}: worker hash matches no audited row; refusing")
        if c['id'] in seen: sys.exit('duplicate id '+c['id'])
        seen.add(c['id']);now=cur[key(r)];h=sh(now['sourceReference'])
        for l in c['replacement_lesson_ids']:
            if l not in lessons: sys.exit(f"{c['id']}: missing replacement lesson {l}")
        e={'id':c['id'],'package':pkg,'school_code':c['school_code'],'class_name':c['class_name'],'subject_name':r['subjectName'],
           'term_label':r['termLabel'],'source_title':c['source_title'],'source_body_sha256':h}
        if h!=c['source_body_sha256']: e['previous_source_body_sha256']=[c['source_body_sha256']]
        e.update(replacement_lesson_ids=c['replacement_lesson_ids'],reason=c['reason'],affected_summary_and_question_paths=c['affected_summary_and_question_paths'])
        for k in ('source_selector','source_row'):
            if k in c:e['source_locator']=c[k]
        out.append(e)
hs=[x for e in out for x in [e['source_body_sha256'],*e.get('previous_source_body_sha256',[])]]
if len(hs)!=len(set(hs)): sys.exit('competing corrections for the same source hash')
Path(a.out).write_text(json.dumps(sorted(out,key=lambda e:e['id']),ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'corrections':len(out),'re_pointed_to_current_hash':sum('previous_source_body_sha256' in e for e in out)}))
