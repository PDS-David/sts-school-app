"""Capture unmodified main() row objects using a disposable instrumented copy.
Usage: python scripts/jss3/capture_rows.py --root /inputs/ALL --output /evidence
No --yes, database URL, or production operation is accepted.
"""
import argparse,json,os,subprocess,tempfile,hashlib
from pathlib import Path
from collections import Counter
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
repo=Path(__file__).resolve().parents[2];root=a.root.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=True)
source=repo/'backend/src/db/ingestTopics.ts';text=source.read_text();anchor="  console.log('\\nFILE AUDIT PASSED — this does not certify curriculum completeness or existing database compatibility.');"
if text.count(anchor)!=1:raise SystemExit('Capture anchor changed: inspect importer before adapting helper. No output certified.')
env=os.environ.copy()
for k in list(env):
 if k.startswith('PG') or 'DATABASE_URL' in k:env.pop(k)
fd,name=tempfile.mkstemp(prefix='ingestTopics.capture-',suffix='.ts',dir=source.parent);os.close(fd);temporary=Path(name)
try:
 temporary.write_text("import { writeFileSync as captureWrite } from 'node:fs';\n"+text.replace(anchor,"  captureWrite(process.env.CAPTURE_PATH!, JSON.stringify(normalRows,null,2));\n"+anchor))
 result={}
 for label,extra in [('original',[]),('supplemented',['--jss3-supplements'])]:
  env['CAPTURE_PATH']=str(out/f'{label}-rows.json');tail=['--root',str(root),'--school-code','secondary',*extra]
  captured=subprocess.run(['node','--import','tsx',str(temporary),*tail],cwd=repo,env=env,capture_output=True,text=True)
  plain=subprocess.run(['node','--import','tsx',str(source),*tail],cwd=repo,env=env,capture_output=True,text=True)
  (out/f'{label}-dry-run.log').write_text(plain.stdout+plain.stderr)
  if captured.returncode or plain.returncode:raise RuntimeError(f'{label} audit blocked: see logs; no database write attempted')
  if captured.stdout!=plain.stdout:raise RuntimeError('Capture changed stdout; investigate instrumentation')
  result[label]=json.loads(Path(env['CAPTURE_PATH']).read_text())
 original=result['original'];final=result['supplemented'];kept=[r for r in final if '__jss3_supplements__' not in r['filePath']]
 if kept!=original:raise RuntimeError('Supplement path changes original row objects')
 summary=dict(original_rows=len(original),supplement_rows=len(final)-len(original),total_rows=len(final),all_original_row_objects_exactly_equal=True,capture_stdout_matches_unmodified_importer=True,destinations=dict(Counter(r['termLabel'] for r in final)),computer_rows=sum(r['subjectName']=='Computer Studies' for r in final),database_connection=False,importer_sha256=hashlib.sha256(source.read_bytes()).hexdigest())
 (out/'ROW_PRESERVATION.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
finally:temporary.unlink(missing_ok=True)
