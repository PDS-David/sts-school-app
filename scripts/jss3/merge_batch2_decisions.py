"""Merge the five Batch 2 worker DECISIONS.csv files into docs/jss3/replacements/SEMANTIC_DECISIONS.csv by candidate_id.
Existing master order is kept; a worker row replaces the master row of the same id; new ids append in package order.
Aborts on a candidate decided by two packages, on a header mismatch, or on an empty disposition. A worker may NOT downgrade a master OWNER_INPUT_NEEDED_* disposition to a non-owner status: that row is kept and logged 'held_for_owner' with the worker's proposal. Writes a change log. Run on a pristine master SEMANTIC_DECISIONS.csv (git show master:docs/jss3/replacements/SEMANTIC_DECISIONS.csv)."""
import csv,glob,json,sys
from pathlib import Path
M=Path('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');LOG=Path('docs/jss3/batch2-close/F_INTEGRATION/DECISION_MERGE_LOG.csv')
rd=lambda p:list(csv.DictReader(open(p,newline='',encoding='utf-8-sig')))
master=rd(M);hdr=list(master[0].keys());rows=[dict(r) for r in master];idx={r['candidate_id']:i for i,r in enumerate(rows)}
seen={};log=[]
for p in sorted(glob.glob('docs/jss3/batch2-close/*/DECISIONS.csv')):
    pkg=p.split('/')[-2][0]
    for r in rd(p):
        if list(r.keys())!=hdr: sys.exit(f'{pkg}: header mismatch {list(r.keys())}')
        c=r['candidate_id']
        if c in seen: sys.exit(f'COMPETING decisions for {c}: {seen[c]} and {pkg}')
        if not r['disposition']: sys.exit(f'{c}: empty disposition')
        seen[c]=pkg
        if c in idx:
            old=rows[idx[c]]
            if old==r: continue
            if old['disposition'].startswith('OWNER_INPUT') and not r['disposition'].startswith('OWNER_INPUT'):
                log.append((c,pkg,'held_for_owner',old['disposition'],old['disposition'],r['disposition']));continue
            log.append((c,pkg,'revised',old['disposition'],r['disposition'],''));rows[idx[c]]=dict(r)
        else:
            idx[c]=len(rows);rows.append(dict(r));log.append((c,pkg,'added','',r['disposition'],''))
with M.open('w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=hdr,lineterminator='\r\n' if b'\r\n' in M.read_bytes() else '\n');w.writeheader();w.writerows(rows)
with LOG.open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['candidate_id','package','change','master_disposition','merged_disposition','worker_proposed_if_held']);w.writerows(log)
print(json.dumps({'master_before':len(master),'merged':len(rows),'added':sum(l[2]=='added' for l in log),'revised':sum(l[2]=='revised' for l in log),'held_for_owner':sum(l[2]=='held_for_owner' for l in log)}))
