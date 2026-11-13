import zipfile, hashlib, csv, re, sys, os
A, OUT = sys.argv[1], sys.argv[2]
RULES = [  # (regex on filename, slug) ordered
 (r'book.?keeping','bookkeeping'),(r'financial','financial-accounting'),(r'chem','chemistry'),(r'physics','physics'),
 (r'literature','literature'),(r'f _ n|food','food-and-nutrition'),(r'english','english'),(r'biology','biology'),
 (r'civic','civic-education'),(r'econ','economics'),(r'data','data-processing'),(r'geog','geography'),
 (r'further','further-mathematics'),(r'french','french'),(r'commerce','commerce'),(r'govern','government'),
 (r'math','mathematics'),(r'yoruba','yoruba'),(r'agric','agricultural-science'),(r'technical','technical-drawing'),
 (r'catering|ccp','catering-craft')]
KEY = {'bookkeeping':'book','financial-accounting':'financ','chemistry':'chem','physics':'physics','literature':'literature',
 'food-and-nutrition':'food','english':'english','biology':'biology','civic-education':'civic','economics':'economics',
 'data-processing':'data processing','geography':'geograph','further-mathematics':'further','french':'franc|french|semaine|schema|trimestre',
 'commerce':'commerce','government':'government','mathematics':'math','yoruba':'yoruba|ilaana|ilana','agricultural-science':'agric',
 'technical-drawing':'technical','catering-craft':'catering'}
rows=[]; byhash={}
for zf in sorted(os.listdir(A)):
    if not zf.endswith('.zip'): continue
    zp=os.path.join(A,zf); zsha=hashlib.sha256(open(zp,'rb').read()).hexdigest()
    m=re.search(r'(\d)(?:st|nd|rd)_Term_SS(\d)',zf); term,cls=int(m[1]),int(m[2])
    for i in zipfile.ZipFile(zp).infolist():
        if i.is_dir(): continue
        data=zipfile.ZipFile(zp).read(i); sha=hashlib.sha256(data).hexdigest()
        base=i.filename.split('/')[-1]; low=base.lower()
        slug=next((s for r,s in RULES if re.search(r,low)),'UNMAPPED')
        rows.append(dict(source_id='SS23-SRC-'+sha[:12],class_=f'SS{cls}',term=f'{term}{["st","nd","rd"][term-1]} Term',
          archive=re.sub(r'^[0-9a-f]{8}-','',zf),archive_sha256=zsha,archive_member=i.filename,sha256=sha,bytes=len(data),
          filename_subject=slug,mapping_status='FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER'))
        byhash.setdefault(sha,[]).append(len(rows)-1)
for sha,ix in byhash.items():
    if len(ix)>1:
        for k in ix:
            rows[k]['mapping_status']='BYTE_IDENTICAL_DUPLICATE_ACROSS_MEMBERS:'+';'.join(rows[j]['archive_member'] for j in ix if j!=k)
cols=['source_id','class_','term','archive','archive_sha256','archive_member','sha256','bytes','filename_subject','mapping_status']
with open(OUT,'w',newline='') as f:
    w=csv.writer(f); w.writerow([c.rstrip('_') for c in cols])
    for r in rows: w.writerow([r[c] for c in cols])
print(len(rows),'members;',sum(1 for r in rows if r['filename_subject']=='UNMAPPED'),'unmapped;',sum(1 for r in rows if r['mapping_status'].startswith('BYTE'))," byte-duplicate rows")
