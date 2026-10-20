"""Bind reviewed Science assets to exact captured original bodies and stable supplement IDs.
No database operations. Run with --capture supplemented-rows.json. Rejects drift before writing.
"""
import argparse,csv,hashlib,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--capture',type=Path,required=True);p.add_argument('--out',type=Path);a=p.parse_args()
R=Path(__file__).resolve().parents[3];base=R/'curriculum-assets/jss3/v3-science';out=a.out or base
rows=json.loads(a.capture.read_text());spec=json.loads((Path(__file__).parent/'science_assets.json').read_text());groups={};bindings=[]
replacements={'FAMILY TRAITS':'SUP-BS-FAMILY-TRAITS-V3','LIGHT ENERGY':'SUP-BS-LIGHT-V3'}
for asset in spec:
 assert hashlib.sha256((base/asset['file']).read_bytes()).hexdigest()==asset['sha256'],asset['file']
 candidates=[r for r in rows if r['className']=='JSS 3' and r['subjectName']=='Basic Science' and r['termLabel']==asset['term'] and r['title']==asset['title'] and '__jss3_supplements__' not in r['filePath']]
 assert len(candidates)==1, f"ambiguous/missing original {asset['asset_key']}"
 original=candidates[0];assert hashlib.sha256(original['sourceReference'].encode()).hexdigest()==asset['body_sha256'],f"body drift {asset['asset_key']}"
 targets=[('original',original)]
 if asset['displayed'] and asset['title'] in replacements:
  lid=replacements[asset['title']];found=[r for r in rows if r['weekLabel']=='SUPPLEMENT '+lid and r['subjectName']=='Basic Science' and r['termLabel']==asset['term']]
  assert len(found)==1,f'missing supplement {lid}';targets.append((lid,found[0]))
 for identity,r in targets:
  dest=dict(asset_key=asset['asset_key']+('' if identity=='original' else '-SUP'),file=asset['file'],sha256=asset['sha256'],order_index=r['orderIndex'],expected_title=r['title'],caption=asset['caption'],alt_text=asset['alt_text'],displayed=str(asset['displayed']).lower(),sort_order=1+sum(b['order_index']==r['orderIndex'] for b in groups.get(asset['term'],[])))
  groups.setdefault(asset['term'],[]).append(dest)
  bindings.append(dict(asset_key=dest['asset_key'],identity=identity,term=asset['term'],title=r['title'],order_index=r['orderIndex'],body_sha256=hashlib.sha256(r['sourceReference'].encode()).hexdigest(),displayed=asset['displayed']))
out.mkdir(parents=True,exist_ok=True)
for term,items in groups.items():
 with (out/f'V3_SCIENCE_{term[:3].upper()}_MANIFEST.csv').open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(items[0]),lineterminator='\n');w.writeheader();w.writerows(items)
(out/'V3_BINDINGS.json').write_text(json.dumps(bindings,indent=2)+'\n')
print(json.dumps({'unique_assets':len(spec),'bindings':len(bindings),'displayed_bindings':sum(b['displayed'] for b in bindings)}))
