#!/usr/bin/env python3
"""Record exact historical imported references for four reviewed Yoruba lessons.
History is pinned explicitly. No private corpus, DB or source text is written to Git.
"""
import argparse, hashlib, json, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
SOURCE='backend/src/db/data/jss3Supplements.json'
IDS=['SUP-YO-IBEERE','SUP-YO-IRANLOWO-PRACTICE','SUP-YO-LIT-METHOD','SUP-YO-MARRIAGE']
def git(*args): return subprocess.check_output(['git',*args],cwd=ROOT,text=True)
def reference(s):
    return s['title']+'\n\n'+s['origin']+'\nCoverage: '+', '.join(s['gapIds'])+'\n\n'+s['body']+'\n\nReference resources (not the original school textbook):\n'+'\n'.join(x['title']+': '+x['url'] for x in s['sources'])
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--history-ref',required=True);p.add_argument('--output',help='default: the checked-in registry');a=p.parse_args()
    ref=git('rev-parse','--verify',a.history_ref+'^{commit}').strip()
    current={s['id']:s for s in json.loads((ROOT/SOURCE).read_text())}
    versions={i:{} for i in IDS}
    # Only actual ancestors of the specified reviewed candidate, no unrelated branches.
    for commit in git('rev-list',ref,'--',SOURCE).splitlines():
        for s in json.loads(git('show',commit+':'+SOURCE)):
            i=s['id']
            if i not in versions: continue
            if any(s[k]!=current[i][k] for k in ('title','subjectName','termLabel')): continue
            h=hashlib.sha256(reference(s).encode()).hexdigest()
            versions[i].setdefault(h,commit)
    out=[{'lessonId':i,'versions':[{'sha256':h,'commit':c} for h,c in sorted(versions[i].items())]} for i in IDS]
    if any(not r['versions'] for r in out): raise ValueError('Missing reviewed history')
    Path(a.output or ROOT/'backend/src/db/data/jss3YorubaRevisions.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({'history_ref':ref,'versions':{i:len(v) for i,v in versions.items()}}))
if __name__=='__main__':main()
