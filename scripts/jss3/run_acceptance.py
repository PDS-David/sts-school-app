#!/usr/bin/env python3
"""One entry point for JSS3 corpus + local DB acceptance. Never deploys/imports production.
Default requires an explicitly supplied disposable loopback DB named jss3_test_*.
--without-db runs all available corpus checks but exits 2 (INCOMPLETE), never a full PASS.
"""
import argparse,csv,hashlib,io,json,os,re,shutil,subprocess,sys,zipfile
from pathlib import Path,PurePosixPath
from urllib.parse import urlparse
REPO=Path(__file__).resolve().parents[2]

def stage_archive(archive,out):
    with zipfile.ZipFile(archive) as z:
        invs=[n for n in z.namelist() if n.endswith('/SOURCE_INVENTORY.csv') or n=='SOURCE_INVENTORY.csv']
        if len(invs)!=1:raise ValueError('Archive must contain exactly one SOURCE_INVENTORY.csv')
        prefix=invs[0][:-len('SOURCE_INVENTORY.csv')]
        inv=list(csv.DictReader(io.StringIO(z.read(invs[0]).decode('utf-8-sig'))))
        if len(inv)!=39:raise ValueError('Inventory must contain 39 documents')
        if len({r['staged_path'] for r in inv})!=39:raise ValueError('Duplicate inventory paths')
        for row in inv:
            rel=PurePosixPath(row['staged_path'])
            if rel.is_absolute() or '..' in rel.parts or '\\' in str(rel):raise ValueError('Unsafe inventory path')
            data=z.read(prefix+'ALL/'+str(rel))
            if hashlib.sha256(data).hexdigest()!=row['sha256']:raise ValueError('Source hash mismatch: '+str(rel))
            dest=out/'ALL'/str(rel);dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
        (out/'SOURCE_INVENTORY.csv').write_bytes(z.read(invs[0]))
        (out/'scheme_only_integration_manifest.csv').write_bytes(z.read(prefix+'scheme_only_integration_manifest.csv'))
        b=out/'audited-base-capture';b.mkdir(exist_ok=True)
        data=z.read(prefix+'portable_verification/capture/original-rows.json')
        if len(json.loads(data))!=313:raise ValueError('Packaged audited capture must have 313 rows')
        # Verify packaged baseline against its own recorded checksum, not a guessed historical SHA.
        checksum_lines=z.read(prefix+'SHA256SUMS').decode().splitlines()
        entry=[l for l in checksum_lines if l.split(maxsplit=1)[-1].lstrip(' *./')=='portable_verification/capture/original-rows.json']
        if len(entry)!=1 or entry[0].split()[0]!=hashlib.sha256(data).hexdigest():raise ValueError('Packaged baseline checksum mismatch')
        (b/'original-rows.json').write_bytes(data)
    return b

def local_url(value):
    p=urlparse(value)
    if p.scheme not in ('postgres','postgresql') or p.hostname not in ('localhost','127.0.0.1','::1') or not p.path.startswith('/jss3_test_') or p.query:
        raise ValueError('Use a disposable loopback postgres database named jss3_test_* without connection query overrides')
    return value

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--archive',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--database-url-env',default='JSS3_LOCAL_TEST_DATABASE_URL');p.add_argument('--without-db',action='store_true');p.add_argument('--tsx-no-ipc',action='store_true');a=p.parse_args()
    out=a.output.resolve();out.mkdir(parents=True,exist_ok=True);summary={'status':'RUNNING','checks':[],'production_actions':False}
    def save(): (out/'ACCEPTANCE.json').write_text(json.dumps(summary,indent=2)+'\n')
    def run(name,cmd,env):
        with (out/(name+'.log')).open('w') as f:r=subprocess.run(cmd,cwd=REPO,env=env,stdout=f,stderr=subprocess.STDOUT)
        summary['checks'].append({'name':name,'command':cmd,'exit_code':r.returncode});save();print(name,r.returncode,flush=True);return r.returncode
    try:
        if subprocess.check_output(['node','--version'],text=True).strip()!='v24.19.0':raise ValueError('Node v24.19.0 required; record a deviation separately instead of silently changing it')
        if not a.archive.is_file():raise ValueError('Required input archive missing')
        if (out/'inputs').exists():raise ValueError('Use a fresh --output directory; inputs must not contain stale files')
        base=stage_archive(a.archive,out/'inputs');env=os.environ.copy()
        # No ambient production variables reach corpus or DB tests.
        db=None if a.without_db else local_url(env.get(a.database_url_env,''))
        for k in list(env):
            if 'DATABASE_URL' in k or k.startswith('PG'):env.pop(k)
        env['JSS3_REQUIRE_VISUAL_DEPS']='1'
        if run('python-dependencies',['python3','-c','import cairosvg,lxml,docx,PIL'],env):raise ValueError('Install scripts/jss3/acceptance-requirements.txt')
        root=out/'inputs/ALL';capture=out/'capture'
        if run('capture',['python3','scripts/jss3/capture_rows.py','--root',str(root),'--output',str(capture)],env):raise RuntimeError('Capture failed')
        env.update(JSS3_CAPTURE_DIR=str(capture),JSS3_BASE_CAPTURE_DIR=str(base),JSS3_V1_CAPTURE=str(capture/'supplemented-rows.json'),JSS3_ALL_ROOT=str(root),JSS3_M2_SOURCE_DOCX=str(root/'JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx'))
        cmd=['python3','scripts/jss3/verify_handoff.py','--inputs',str(out/'inputs'),'--output',str(out/'corpus')]
        if a.tsx_no_ipc:cmd.append('--tsx-no-ipc')
        if run('corpus',cmd,env):raise RuntimeError('Corpus checks failed')
        corpus=(out/'corpus/jss3-full.log').read_text()
        # Only explicit DB skips are acceptable in this stage. Missing source/dependency checks are failures.
        skips=[l for l in corpus.splitlines() if '# SKIP' in l or re.match(r'^ok .*# SKIP',l)]
        summary['corpus_skips']=skips
        if any('database' not in l.lower() and ' db ' not in l.lower() for l in skips):raise RuntimeError('Unexpected corpus skip; inspect full log')
        if run('protected-comparer-unit',['python3','-m','unittest','discover','-s','docs/jss3/completion/P1_BASELINE','-p','test_*.py'],env):raise RuntimeError('Comparator unit tests failed')
        if run('runner-unit',['python3','-m','unittest','discover','-s','tests','-p','test_jss3_acceptance_runner.py'],env):raise RuntimeError('Runner unit tests failed')
        if a.without_db:
            summary.update(status='INCOMPLETE',reason='Corpus passed; database acceptance deliberately not run');save();return 2
        for variable in ['TOPIC_ASSETS_TEST_DATABASE_URL','JSS3_ASSET_TEST_DATABASE_URL','JSS3_DELIVERY_TEST_DATABASE_URL','JSS3_V2_TEST_DATABASE_URL','JSS3_V3_TEST_DATABASE_URL','JSS3_YO_TEST_DATABASE_URL']:env[variable]=db
        env['T2_REAL_ASSETS']=str(REPO/'curriculum-assets/jss3')
        suites=['topic-assets.db','jss3-batch2-assets.db','jss3-delivery-correction.db','jss3-v1-business.db','jss3-v2-math-assets.db','jss3-v3-science-assets.db','jss3-v3-science-ci.db','jss3-yo-license.db']
        for name in suites:
            if run(name,['node','--import','tsx','--test','--test-reporter=tap','tests/'+name+'.test.mts'],env):raise RuntimeError(name+' failed')
            log=(out/(name+'.log')).read_text();m=re.search(r'^# skipped (\d+)$',log,re.M)
            if not m or int(m.group(1))!=0:raise RuntimeError(name+' skipped tests or lacks completion summary')
        summary.update(status='PASS',scope='repository + real-source + disposable database acceptance; excludes phone, teacher, protected baseline and production');save();return 0
    except ValueError as e:summary.update(status='BLOCKED',reason=str(e));save();print(str(e));return 2
    except Exception as e:summary.update(status='FAIL',reason=str(e));save();print(str(e));return 1

if __name__=='__main__':sys.exit(main())
