"""Original unpitched rhythm chart: geometry is explicit, no music font required."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import csv,hashlib
root=Path(__file__).resolve().parent
im=Image.new('RGB',(1200,980),'white'); d=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def t(x,y,s,size=25): d.text((x,y),s,font=ImageFont.truetype(font,size),fill='#143850')
def note(x,y,open=False):
 d.ellipse((x-15,y-9,x+15,y+9),fill='white' if open else 'black',outline='black',width=3)
 d.line((x+14,y,x+14,y-82),fill='black',width=3)
def staff(y,top,bottom):
 d.line((175,y,1090,y),fill='#888888',width=2)
 d.line((1090,y-40,1090,y+40),fill='black',width=3)
 t(110,y-52,str(top),43);t(110,y-4,str(bottom),43)
t(45,30,'Simple and compound time — original worked examples',32)
t(45,85,'Rhythm-only notation: one line, no pitch or clef implied.',24)
t(45,150,'A. 4/4: minim + crotchet + crotchet',28);staff(300,4,4)
for x,op in [(260,True),(660,False),(860,False)]:note(x,300,op)
for x,s in [(240,'1'),(440,'2'),(640,'3'),(840,'4')]:t(x,350,s,28)
t(240,395,'Hold through 1–2',23);t(650,395,'1 beat',23);t(850,395,'1 beat',23)
t(45,455,'2 + 1 + 1 = 4 crotchet beats',27)
t(45,535,'B. 6/8: six quavers grouped 3 + 3',28);staff(690,6,8)
for group in [[260,380,500],[700,820,940]]:
 for x in group:note(x,690)
 d.line((group[0]+14,608,group[-1]+14,608),fill='black',width=9)
for x,s in [(245,'1'),(363,'la'),(482,'li'),(685,'2'),(803,'la'),(922,'li')]:t(x,735,s,28)
t(230,795,'Main beat 1',25);t(670,795,'Main beat 2',25)
t(45,865,'6 quaver divisions = 2 dotted-crotchet beats',27)
t(45,920,'3/4 groups six quavers as 2 + 2 + 2; 6/8 groups them as 3 + 3.',23)
p=root/'simple-compound-time.png';im.save(p)
with (root/'MUSIC_MANIFEST.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=['asset_key','file','sha256','order_index','expected_title','caption','displayed','sort_order']);w.writeheader();w.writerow(dict(asset_key='SUP-MUSIC-TIME',file=p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),order_index=12,expected_title='Simple and compound time: worked rhythm examples',caption='Original unpitched rhythm examples: 4/4 minim plus two crotchets; 6/8 two beamed groups of three quavers. Main beats and subdivisions are labelled.',displayed='true',sort_order=1))
