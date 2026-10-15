from pathlib import Path
import subprocess,os,json,hashlib
import argparse
a=argparse.ArgumentParser();a.add_argument('--repo',type=Path,required=True);a.add_argument('--sources',type=Path,required=True);a.add_argument('--output',type=Path,required=True);args=a.parse_args()
r=args.repo.resolve();out=args.output.resolve();out.mkdir(parents=True,exist_ok=True);source_root=args.sources.resolve()
env=os.environ.copy()
for k in ['DATABASE_URL','PGHOST','PGUSER','PGPASSWORD','PGDATABASE']:env.pop(k,None)
for state in ['baseline','current']:
 s=subprocess.check_output(['git','show','29f135b2:backend/src/db/ingestTopics.ts'],cwd=r,text=True) if state=='baseline' else (r/'backend/src/db/ingestTopics.ts').read_text()
 needle='  // Compare topic bodies only within the SAME class/subject/term.'
 assert s.count(needle)==1
 s="import { writeFileSync as auditWrite } from 'fs';\n"+s
 s=s.replace(needle,"  auditWrite(process.env.PROTECTED_CAPTURE!, JSON.stringify(normalRows));\n"+needle)
 p=r/'backend/src/db/ingestTopics.protected-audit.ts'
 if p.exists():raise RuntimeError('Temporary audit filename already exists; refusing overwrite')
 p.write_text(s)
 try:
  for school in ['primary','secondary']:
   env['PROTECTED_CAPTURE']=str(out/f'{state}-{school}-rows.json')
   cmd=['node','--import','tsx',str(p),'--root',str(source_root),'--school-code',school]
   with (out/f'{state}-{school}.log').open('w') as f:
    result=subprocess.run(cmd,cwd=r,env=env,stdout=f,stderr=subprocess.STDOUT)
   print(state,school,result.returncode,flush=True)
 finally:p.unlink(missing_ok=True)
result=[]
for school in ['primary','secondary']:
 a=json.loads((out/f'baseline-{school}-rows.json').read_text());b=json.loads((out/f'current-{school}-rows.json').read_text());result.append({'school':school,'baseline_rows':len(a),'current_rows':len(b),'exact_rows_equal':a==b})
(out/'PROTECTED_SOURCE_COMPARISON.json').write_text(json.dumps(result,indent=2));print(result)
