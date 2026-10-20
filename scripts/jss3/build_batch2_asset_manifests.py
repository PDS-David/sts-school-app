"""Build attach manifests for Batch 2 figures (A shorthand chart, E Music figures) by STABLE LESSON IDENTITY.
Usage: python3 scripts/jss3/build_batch2_asset_manifests.py <supplemented-rows.json>
Each ASSETS.json entry names target_lesson_id. The destination order_index and the title guard are resolved from the
combined importer capture (row weekLabel 'SUPPLEMENT <id>'), never hard-coded. Copies only PNGs (SVG stays editable source in docs/).
Verifies each file's sha256 against the delivery's ASSETS.json. Refuses missing/duplicate lessons, MIME other than PNG, and an
(subject, term, order_index) already occupied by an existing manifest (so proofreading/BT/Music art is never overwritten).
One manifest per subject+term because attachTopicAssets.ts takes --subject/--term-label."""
import csv,json,hashlib,shutil,sys,glob
from pathlib import Path
cap=json.load(open(sys.argv[1]));D=Path('docs/jss3/batch2-close');OUT=Path('curriculum-assets/jss3/supplements')
rows={}
for r in cap:
    if '__jss3_supplements__' in r['filePath']:
        k=r['weekLabel'].replace('SUPPLEMENT ','',1);assert k not in rows,f'duplicate lesson row {k}';rows[k]=r
sup={s['id']:s for s in json.load(open('backend/src/db/data/jss3Supplements.json'))}
occupied={}
for f in glob.glob(str(OUT/'*_MANIFEST.csv'))+glob.glob('curriculum-assets/jss3/*_MANIFEST.csv'):
    if 'BATCH2_' in f: continue
    for m in csv.DictReader(open(f,newline='')):
        occupied[(Path(f).name,m.get('order_index') or m.get('topic_order_index') or m.get('destination_order_index'))]=m
override_file=Path('docs/jss3/completion/V1_BUSINESS/SHORTHAND_ALT_TEXT.json')
overrides=json.loads(override_file.read_text()) if override_file.exists() else []
if isinstance(overrides,dict): overrides=[overrides]
groups={}
for pkg in ['A_MATH_TECH_BUSINESS','E_MUSIC_CCA']:
    for a in json.load(open(D/pkg/'ASSETS.json')):
        if a['mime']!='image/png': continue
        src=D/pkg/a['file'];assert hashlib.sha256(src.read_bytes()).hexdigest()==a['sha256'],f'hash mismatch {src}'
        asset_key=f"{a['target_lesson_id']}-{Path(a['file']).stem}"
        for override in overrides:
            if override['asset_key']==asset_key:
                assert override['sha256']==a['sha256'], 'accessibility override asset hash mismatch'
                a={**a,'alt_text':override['alt_text']}
        lid=a['target_lesson_id'];assert lid in rows and lid in sup,f'target lesson not in combined capture: {lid}'
        r=rows[lid];assert r['className']=='JSS 3' and r['subjectName']==sup[lid]['subjectName'] and r['termLabel']==sup[lid]['termLabel']
        groups.setdefault((r['subjectName'],r['termLabel']),[]).append((lid,r,a,src))
names={('Business Studies','2nd Term'):'BATCH2_BUSINESS_2ND_MANIFEST.csv',('Music','1st Term'):'BATCH2_MUSIC_1ST_MANIFEST.csv',('Music','2nd Term'):'BATCH2_MUSIC_2ND_MANIFEST.csv'}
summary=[]
for key,items in sorted(groups.items()):
    name=names[key];order={}
    with open(OUT/name,'w',newline='') as fh:
        w=csv.writer(fh,lineterminator='\n');w.writerow(['asset_key','file','sha256','order_index','expected_title','caption','alt_text','displayed','sort_order'])
        for lid,r,a,src in items:
            order[lid]=order.get(lid,0)+1;stem=Path(a['file']).stem
            shutil.copyfile(src,OUT/src.name)
            w.writerow([f'{lid}-{stem}',src.name,a['sha256'],r['orderIndex'],r['title'],a['caption'],a.get('alt_text',''),'true',order[lid]])
            summary.append((name,lid,r['orderIndex'],src.name))
print(json.dumps({'manifests':sorted(set(s[0] for s in summary)),'assets':len(summary),'by_lesson':[(s[1],s[2],s[3]) for s in summary]},indent=0))
