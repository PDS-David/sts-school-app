import pathlib,json,hashlib,zipfile,fitz,csv
from PIL import Image,ImageDraw,ImageFont
import argparse
ap=argparse.ArgumentParser();ap.add_argument('--all-root',type=pathlib.Path,required=True);ap.add_argument('--renders',type=pathlib.Path,required=True);ap.add_argument('--capture',type=pathlib.Path,required=True);args=ap.parse_args()
R=pathlib.Path(__file__).resolve().parents[3];out=R/'curriculum-assets/jss3/v3-science';out.mkdir(parents=True,exist_ok=True);src=args.all_root;render=args.renders;records=[]
rows=json.loads(args.capture.read_text())
def rec(key,file,term,title,caption,alt,source,locator,display=True,kind='source-recovered'):
 rr=[r for r in rows if r['subjectName']=='Basic Science' and r['termLabel']==term and r['title']==title];assert len(rr)==1
 records.append(dict(asset_key=key,file=file,sha256=hashlib.sha256((out/file).read_bytes()).hexdigest(),term=term,title=title,body_sha256=hashlib.sha256(rr[0]['sourceReference'].encode()).hexdigest(),caption=caption,alt_text=alt,source_document=source,source_sha256=hashlib.sha256((src/source).read_bytes()).hexdigest(),locator=locator,displayed=display,kind=kind))
s1='JSS3 1ST TERM /BASIC SCIENCE.docx';s2='JSS3 2ND TERM /Basic science.docx'
for key,term,page,rect,title,caption,alt,display in [
 ('BS-GEN-SOURCE-1','t1',6,(65,400,540,645),'FAMILY TRAITS','Withdrawn source drawing: offspring labels and human-height model are incorrect.','Original TT by Tt source cross, retained for audit only.',False),
 ('BS-GEN-SOURCE-2','t1',7,(65,145,560,380),'FAMILY TRAITS','Withdrawn source human-height cross; see the corrected simple-trait model.','Original TT by tt cross, retained for audit only.',False),
 ('BS-GEN-SOURCE-3','t1',7,(65,385,560,655),'FAMILY TRAITS','Withdrawn source human-height model; ratios are probabilities, not guaranteed children.','Original Tt by Tt cross, retained for audit only.',False),
 ('BS-BEAMS','t2',7,(65,365,575,735),'LIGHT ENERGY','Recovered source: parallel, convergent and divergent beams.','Three source ray groups: parallel rays keep the same direction, converging rays approach a point, diverging rays spread out.',True),
 ('BS-REFLECTION','t2',9,(60,110,365,240),'LIGHT ENERGY','Recovered single-ray mirror diagram: i = r, measured from the normal. This is not a diagram of diffuse reflection.','Incident and reflected rays meet a flat mirror on opposite sides of a dashed perpendicular normal; i and r mark equal angles.',True),
 ('BS-PRISM-SOURCE','t2',10,(65,185,510,380),'LIGHT ENERGY','Withdrawn source prism: colour order and deviation are inconsistent; use the corrected diagram.','Original prism drawing retained for audit only.',False)]:
 d=fitz.open(next((render/term).glob('*.pdf')));name=key.lower()+'.png';d[page-1].get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(rect)).save(out/name)
 rec(key,name,'1st Term' if term=='t1' else '2nd Term',title,caption,alt,s1 if term=='t1' else s2,f'LibreOffice rendered page {page}; crop {rect}',display)
with zipfile.ZipFile(src/s2) as z:
 for n,title,key,cap,alt in [
 ('image1.jpeg','LIGHT ENERGY','BS-EYE','Source eye diagram, original embedded bytes.','Cross-section of the eye with sclera, choroid, cornea, pupil, lens, iris, ciliary body, retina, fovea and optic nerve labelled.'),
 ('image2.jpeg','SOUND ENERGY','BS-EAR','Source ear diagram, original embedded bytes.','Outer, middle and inner ear: pinna and canal lead to the eardrum, ossicles, cochlea and auditory nerve; semicircular canals and Eustachian tube are shown.'),
 ('image3.png','Magnetism-','BS-MAGNET-FIELD','Source magnet field illustration; read with the corrected magnetism lesson.','Field lines loop around a bar magnet; north and south ends are labelled. Outside the magnet the field runs from north to south.'),
 ('image4.png','Magnetism-','BS-MAGNET-PANELS','Source three-panel magnetic-field illustration; advanced B, H and M labels are retained, not additional assessed JSS3 objectives.','Three source panels labelled B, H and M compare field patterns around and inside a magnet; the original labels and arrows are preserved.')]:
  name=key.lower()+pathlib.Path(n).suffix;(out/name).write_bytes(z.read('word/media/'+n));rec(key,name,'2nd Term',title,cap,alt,s2,'word/media/'+n)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
# Newly prepared equivalent, deliberately not presented as recovered geometry.
im=Image.new('RGB',(720,1050),'white');dr=ImageDraw.Draw(im);ft=ImageFont.truetype(font,24);big=ImageFont.truetype(font,30)
dr.text((25,15),'Simple inheritance: model crosses',font=big,fill='black');dr.text((25,58),'New teaching figure. Not human height.',font=ft,fill='black')
for i,(a,b,caption) in enumerate([('TT','Tt','1/2 TT, 1/2 Tt; all show the dominant trait'),('TT','tt','All Tt; all show the dominant trait'),('Tt','Tt','1/4 TT, 1/2 Tt, 1/4 tt; phenotype 3:1')]):
 y=105+i*305;dr.text((25,y),f'{a} x {b}',font=big,fill='black')
 for col in range(3):
  for row in range(3):
   x0=70+col*110;y0=y+43+row*60;dr.rectangle((x0,y0,x0+110,y0+60),outline='black',width=2)
   text='' if row==col==0 else a[col-1] if row==0 else b[row-1] if col==0 else ''.join(sorted(a[col-1]+b[row-1]))
   dr.text((x0+30,y0+12),text,font=big,fill='black')
 dr.text((25,y+238),caption,font=ft,fill='black')
dr.text((25,1020),'Each box is equally likely; ratios are not promises.',font=ImageFont.truetype(font,21),fill='black');im.save(out/'bs-genetics-corrected.png')
rec('BS-GENETICS-CORRECTED','bs-genetics-corrected.png','1st Term','FAMILY TRAITS','Newly prepared corrected simple-trait crosses; not human-height prediction.','Punnett squares: TT by Tt gives half TT and half Tt; TT by tt gives all Tt; Tt by Tt gives one TT, two Tt and one tt. Dominant phenotype probabilities are 100%, 100% and 75%.',s1,'Replacement of source pages 6-7; new equivalent based on allele combinations',True,'new-corrected-equivalent')
im=Image.new('RGB',(900,550),'white');dr=ImageDraw.Draw(im);ft=ImageFont.truetype(font,22)
dr.text((20,20),'Dispersion: newly prepared schematic (not to scale)',font=ft,fill='black');dr.polygon([(260,95),(180,435),(430,435)],outline='black',width=3)
dr.line([(25,274),(230,222.5),(323.75,222.5)],fill='black',width=4);dr.text((25,230),'White light',font=ft,fill='black')
for i,(name,color) in enumerate([('Red','#c00000'),('Orange','#a65000'),('Yellow','#907800'),('Green','#008000'),('Blue','#0040c0'),('Indigo','#4b0082'),('Violet','#8c00ae')]):
 y=330+i*23;dr.line([(323.75,222.5),(675,y)],fill=color,width=3);dr.text((685,y-12),name,font=ft,fill=color)
dr.text((20,515),'Ordinary glass prism: red deviates least, violet most.',font=ft,fill='black');im.save(out/'bs-prism-corrected.png')
rec('BS-PRISM-CORRECTED','bs-prism-corrected.png','2nd Term','LIGHT ENERGY','Newly prepared dispersion schematic; not a measured ray trace.','White light enters a triangular prism. The emerging spectrum is ordered red, orange, yellow, green, blue, indigo, violet, with red deviating least and violet most.',s2,'Replacement of inconsistent source page 10 prism; new equivalent',True,'new-corrected-equivalent')
(R/'scripts/jss3/v3/science_assets.json').write_text(json.dumps(records,indent=2,ensure_ascii=False)+'\n')
print(len(records),'Science assets; displayed',sum(x['displayed'] for x in records))
