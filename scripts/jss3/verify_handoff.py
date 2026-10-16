"""Portable full-source verification using JSS3_NEXT_STAGE_INPUTS_20261016.zip.
Run npm ci --ignore-scripts first. Requires Node, Python and python-docx.
No DB writes. Uses unchanged tests. Exits nonzero on any failed check.
"""
import argparse,csv,hashlib,json,os,shutil,subprocess,shlex
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--inputs',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--tsx-no-ipc',action='store_true',help='Explicit sandbox workaround: launch npx tsx calls through node --import tsx');a=p.parse_args()
repo=Path(__file__).resolve().parents[2];inputs=a.inputs.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=True);root=inputs/'ALL'
inventory=list(csv.DictReader((inputs/'SOURCE_INVENTORY.csv').open()));assert len(inventory)==39
for x in inventory:
 f=root/x['staged_path'];assert hashlib.sha256(f.read_bytes()).hexdigest()==x['sha256'],f
assert len([f for f in root.rglob('*') if f.is_file()])==39
stage=out/'test-roots';stage.mkdir(exist_ok=True)
env=os.environ.copy()
for k in list(env):
 if k.startswith('PG') or 'DATABASE_URL' in k:env.pop(k)
if a.tsx_no_ipc:
 adapter=out/'launcher-adapter';adapter.mkdir(exist_ok=True)
 real_npx=shutil.which('npx');node=shutil.which('node');assert real_npx and node
 launcher=adapter/'npx'
 launcher.write_text('#!/bin/sh\nif [ "$1" = "tsx" ]; then\n shift\n exec '+shlex.quote(node)+' --import tsx "$@"\nfi\nexec '+shlex.quote(real_npx)+' "$@"\n')
 launcher.chmod(0o755);env['PATH']=str(adapter)+os.pathsep+env.get('PATH','')
 (out/'LAUNCHER_DEVIATION.md').write_text('Explicit --tsx-no-ipc: npx tsx is launched as node --import tsx because the sandbox denies tsx CLI IPC sockets. No test or application assertion is changed. Other npx calls use the original launcher.\n')
terms=[('FIRST','1ST','JSS3_FIRST_TERM_ROOT'),('SECOND','2ND','JSS3_SECOND_TERM_ROOT'),('THIRD','3RD','JSS3_THIRD_TERM_ROOT')]
for name,match,var in terms:
 source=next(d for d in root.iterdir() if d.is_dir() and match in d.name.upper());destination=stage/name/source.name
 shutil.copytree(source,destination,dirs_exist_ok=True);env[var]=str(stage/name)
 for f in source.iterdir():
  if 'english' in f.name.lower():
   dest=stage/'ENGLISH'/source.name/f.name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
env.update(JSS3_ALL_ROOT=str(root),JSS3_SCHEME_MANIFEST=str(inputs/'scheme_only_integration_manifest.csv'),JSS3_THIRD_TERM_BASIC_TECH=str(next((stage/'THIRD').rglob('BASIC TECH.docx'))),JSS3_ENGLISH_SYMBOL_ROOT=str(stage/'ENGLISH'))
(out/'source-env.json').write_text(json.dumps({k:v for k,v in env.items() if k.startswith('JSS3_')},indent=2)+'\n')
checks=[('backend-types',['node','node_modules/typescript/bin/tsc','--noEmit','-p','backend/tsconfig.json']),('mobile-types',['node','node_modules/typescript/bin/tsc','--noEmit','-p','mobile/tsconfig.json']),('static',['node','--test',*[str(f.relative_to(repo)) for f in sorted((repo/'tests').glob('*.cjs'))]]),('jss3-full',['node','--import','tsx','--test',*[str(f.relative_to(repo)) for f in sorted((repo/'tests').glob('jss3*.test.mts'))]]),('asset-focused',['node','--import','tsx','--test','tests/topic-assets-metadata.test.mts','tests/topic-assets-loading.test.mts']),('capture',['python3','scripts/jss3/capture_rows.py','--root',str(root),'--output',str(out/'capture')])]
results=[]
for name,cmd in checks:
 with (out/f'{name}.log').open('w') as log:r=subprocess.run(cmd,cwd=repo,env=env,stdout=log,stderr=subprocess.STDOUT)
 results.append(dict(check=name,command=cmd,exit_code=r.returncode));(out/'RESULTS.json').write_text(json.dumps(results,indent=2)+'\n');print(name,r.returncode,flush=True)
raise SystemExit(1 if any(x['exit_code'] for x in results) else 0)
