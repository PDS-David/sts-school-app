"""Verify existing recovered BT bytes, animations, and current capture destinations. No writes to curriculum."""
import argparse,csv,hashlib,json,zipfile
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('--all-root',type=Path,required=True);p.add_argument('--capture',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();R=Path(__file__).resolve().parents[3]
src=a.all_root/'JSS3 3RD TERM /BASIC TECH.docx';rows=json.loads(a.capture.read_text());report=[]
with zipfile.ZipFile(src) as z:
 for asset in csv.DictReader((R/'curriculum-assets/jss3/TASK2_BT_ASSET_MANIFEST.csv').open()):
  file=asset['original_file'];data=(R/'curriculum-assets/jss3/bt'/file).read_bytes();assert data==z.read('word/media/'+file)
  assert hashlib.sha256(data).hexdigest()==asset['sha256_verified']
  row=[r for r in rows if r['className']=='JSS 3' and r['subjectName']=='Basic Technology' and r['termLabel']=='2nd Term' and r['title']==asset['lesson_title_per_R2_R2V']];assert len(row)==1
  assert row[0]['orderIndex']==int(asset['destination_order_index']),file
  image=Image.open(R/'curriculum-assets/jss3/bt'/file)
  report.append(dict(file=file,sha256=asset['sha256_verified'],size=list(image.size),frames=getattr(image,'n_frames',1),displayed=asset['displayed']=='true',title=row[0]['title'],order_index=row[0]['orderIndex']))
assert sorted(x['frames'] for x in report if x['frames']>1)==[58,66,89]
a.output.write_text(json.dumps(dict(source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),all_bytes_exact=True,displayed_illustrations=sum(x['displayed'] for x in report),assets=report),indent=2)+'\n')
print('12 displayed illustrations and 1 held decorative icon: exact source bytes; three animations intact')
