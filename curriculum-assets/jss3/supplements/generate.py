from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import hashlib,csv,json
root=Path(__file__).resolve().parent;root.mkdir(exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def canvas(title):
 im=Image.new('RGB',(1200,900),'white');d=ImageDraw.Draw(im);d.text((50,30),title,font=ImageFont.truetype(font,34),fill='#143850');return im,d
def txt(d,p,s,size=25):d.text(p,s,font=ImageFont.truetype(font,size),fill='#143850')
im,d=canvas('Reading a room plan — original practice drawing')
# Interior 5m x3m drawn consistently at 120px/m; labelled sizes, not screen measurement.
x,y=250,180;w,h=600,360
# window centred on top wall, door on bottom left: openings exactly 1.2m/0.9m in geometry.
d.line([(x,y),(478,y)],fill='black',width=6);d.line([(622,y),(850,y),(850,540),(398,540)],fill='black',width=6);d.line([(290,540),(250,540),(250,180)],fill='black',width=6)
d.line([(478,175),(622,175)],fill='#216e8c',width=4);d.line([(478,185),(622,185)],fill='#216e8c',width=4)
d.line([(290,540),(290,432)],fill='#993c3c',width=4);d.arc((182,432,398,648),270,360,fill='#993c3c',width=3)
# true door arc hinge (290,540), radius108, from up to right
# replace the above arc with white then exact upper-right quarter of hinge-centred circle
# previous box correct: centre290,540, arc270..360 from290,432 to398,540.
for a,b,label,pos in [((250,120),(850,120),'5 m',(515,82)),((920,180),(920,540),'3 m',(940,340))]:
 d.line([a,b],fill='#143850',width=2)
 for xx,yy in (a,b):d.line([(xx-6,yy-6),(xx+6,yy+6)],fill='#143850',width=2)
 txt(d,pos,label)
txt(d,(493,217),'Window 1.2 m',21);txt(d,(435,340),'ROOM',32);txt(d,(270,575),'Door opening 0.9 m',23)
txt(d,(60,650),'View: plan (looking down)    Units: metres    Revision: A',25)
txt(d,(60,695),'Design scale 1:100 on a correctly sized print; read labelled dimensions.',23)
txt(d,(60,740),'Key: blue double line = window; red leaf and arc = door and swing.',23)
txt(d,(60,790),'This screen image is not a ruler scale. Floor area = 5 × 3 = 15 m².',23)
im.save(root/'room-plan.png')
im,d=canvas('Proofreading key — original classroom chart')
items=[('^','Insert at the caret position'),('del','Delete the marked text'),('tr','Transpose (exchange the marked items)'),('caps','Change to CAPITAL letters'),('lc','Change to lowercase letters'),('¶','Begin a new paragraph'),('stet','Cancel a correction; retain the original')]
for i,(mark,meaning) in enumerate(items):
 yy=115+i*86;d.rectangle((55,yy,210,yy+66),outline='#8ca5b1',width=2);txt(d,(80,yy+10),mark,34);txt(d,(240,yy+15),meaning,27)
txt(d,(55,760),'Use each instruction with the marked location, not on the whole page.',24)
txt(d,(55,807),'Symbols and abbreviations vary by house style. Follow the supplied key.',23)
im.save(root/'proofreading-key.png')
for name,filename,idx,title,caption in [('BASIC_TECH','room-plan.png',12,'Simple blueprint reading','Original room plan: 5 m by 3 m; 0.9 m door and 1.2 m window. Read the dimension labels, not screen size.'),('BUSINESS','proofreading-key.png',12,'Proofreading and speed development','Original classroom proofreading key: insert, delete, transpose, capitals, lowercase, paragraph and stet.')]:
 with (root/f'{name}_MANIFEST.csv').open('w',newline='') as f:
  writer=csv.DictWriter(f,fieldnames=['asset_key','file','sha256','order_index','expected_title','caption','displayed','sort_order']);writer.writeheader();writer.writerow(dict(asset_key=f'SUP-{name}',file=filename,sha256=hashlib.sha256((root/filename).read_bytes()).hexdigest(),order_index=idx,expected_title=title,caption=caption,displayed='true',sort_order=1))
print(root)
