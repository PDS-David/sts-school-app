"""F integration: rebase A's two Mathematics replacements that conflict with master commit 82528bb.
Master only changed wording about equations the importer now recovers. Each edit below is an exact-once
before/after pair; a miss aborts. Output: docs/jss3/batch2-close/F_INTEGRATION/REBASED_UPSERTS.json"""
import json,hashlib,subprocess,sys
def h(o): return hashlib.sha256(json.dumps(o,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
D='docs/jss3/batch2-close/'
A={u['id']:u for u in json.load(open(D+'A_MATH_TECH_BUSINESS/SUPPLEMENT_UPSERTS.json'))}
cur={l['id']:l for l in json.load(open('backend/src/db/data/jss3Supplements.json'))}
base={l['id']:l for l in json.loads(subprocess.check_output(['git','show','86a1a61:backend/src/db/data/jss3Supplements.json']))}
def once(t,a,b,why):
    if t.count(a)!=1: sys.exit(f'REBASE ABORT ({why}): expected exactly one match, found {t.count(a)}: {a[:80]!r}')
    return t.replace(a,b)
out=[];ids=['SUP-MATH-AVERAGES','SUP-MATH-TRIG-RATIOS']
for i in ids:
    assert A[i]['expected_old_sha256']==h(base[i]) and h(cur[i])!=h(base[i])
    L=json.loads(json.dumps(A[i]['lesson']))
    # origin: adopt master's recovered-equation wording exactly (the base->master origin edit)
    L['origin']=cur[i]['origin']
    if i=='SUP-MATH-AVERAGES':
        L['body']=once(L['body'],"whose formulas (for example mean = sum ÷ number) are missing from the imported text.","whose formulas are now recovered in the original row.",i)
        n=L['body'].count("The imported note");assert n==3,n
        L['body']=L['body'].replace("(The imported note","(The school's original note")
    else:
        old=[x for x in L['body'].split('\n') if x.startswith('Teacher note:')][0]
        new=[x for x in cur[i]['body'].split('\n') if x.startswith('Teacher note:')][0]
        L['body']=once(L['body'],old,new,i)
    assert 'imported text' not in L['body'] and 'imported note' not in L['body']
    out.append({'op':'replace','id':i,'expected_old_sha256':h(cur[i]),'rebased_from':'A_MATH_TECH_BUSINESS','superseded_guard_sha256':A[i]['expected_old_sha256'],'reason':'master 82528bb changed equation-recovery wording after A base 86a1a61; A body kept, master wording adopted','lesson':L})
json.dump(out,open(D+'F_INTEGRATION/REBASED_UPSERTS.json','w'),ensure_ascii=False,indent=2);print('rebased',[o['id'] for o in out])
