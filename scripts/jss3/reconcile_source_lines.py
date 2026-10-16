"""Conservative text/structure triage. Never equates a phrase hit with objective coverage.
Input is a captured executable row set, not a database connection. Historical CSV stays intact.
"""
import argparse,csv,json,re,unicodedata,hashlib
from pathlib import Path
from collections import Counter
parser=argparse.ArgumentParser();parser.add_argument('--rows',type=Path,required=True);args=parser.parse_args()
repo=Path(__file__).resolve().parents[2];folder=repo/'docs/jss3';rows=json.loads(args.rows.read_text())
assert sum('__jss3_supplements__' not in r['filePath'] for r in rows)==313
assert all(r['className']=='JSS 3' and r['termLabel']!='3rd Term' and r['subjectName']!='Computer Studies' for r in rows)
def norm(s):return ' '.join(re.sub(r'[^\w]+',' ',unicodedata.normalize('NFKC',s).lower().replace('\\t',' ')).split())
def label(r):return f"{r['subjectName']} / {r['termLabel']} #{r['orderIndex']} / {r['title']}"
def sha(r):return hashlib.sha256(r['sourceReference'].encode()).hexdigest()
# Explicit document/class/school/author/table-heading/bibliography lines inspected on 16 October.
metadata={1,3,15,26,44,57,59,65,76,78,85,86,118,119,120,144,157,158,159,160,161,162,164,165,177,178,224,225,226,238,289,292,307,308,320,321,362,363,383,407,408,409,419,430,431,441,459,463,470,471,472,495,496,497,499,500,516,532,533,534,557,558,568,569,575,579}
yomap=list(csv.DictReader((folder/'replacements/YORUBA_OBJECTIVE_MAP.csv').open()))
source=list(csv.DictReader((folder/'SOURCE_LINE_RECONCILIATION.csv').open()));output=[]
for old in source:
 r=dict(old);id=int(r['candidate_id'].split('-')[1]);s=old['text'];q=norm(s)
 status='SEMANTIC_REVIEW_REQUIRED';evidence='No automatic conclusion: inspect the source objective and candidate teaching body.';hashes=''
 if id in metadata or old['current_presence_status']=='PREVIOUSLY_REVIEWED_METADATA':
  status='DOCUMENT_STRUCTURE_OR_REFERENCE';evidence='This specific line is a header, class/school/author identification, table label or bibliography. This does not dispose of surrounding lesson content.'
 else:
  mapped=[x for x in yomap if x['source_file']==old['source_document'] and norm(x['scheme_objective'])==q]
  if mapped:
   status='OBJECTIVE_MAP_AVAILABLE';evidence=' | '.join(x['coverage']+': '+x['lesson']+'; '+x['anchor'] for x in mapped);hashes=';'.join(x['body_sha256'] for x in mapped)
  elif id==12:
   a=next(x for x in rows if x['filePath'].endswith('/SUP-AGRIC-VISIT.json'));status='ATTRIBUTED_REPLACEMENT';evidence=label(a)+'; original excursion heading unchanged; practical participation not certified.';hashes=sha(a)
  else:
   # Strip numbering only, never remove an instructional strand or a compound objective.
   q=re.sub(r'^(?:week\s*)?(?:\d+(?:\s*(?:and|&)\s*\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen)\s+','',q)
   same=[x for x in rows if x['filePath'].endswith('/'+old['source_document'])]
   hits=[x for x in same if len(q)>=8 and re.search(r'(?<!\w)'+re.escape(q)+r'(?!\w)',norm(x['sourceReference']))]
   if hits:
    status='TEXT_PRESENT_OBJECTIVE_NOT_CERTIFIED';evidence=' | '.join(label(x) for x in hits);hashes=';'.join(sha(x) for x in hits)
   elif old['current_presence_status'] in ['PRESENT_IN_EXECUTABLE_BODY','TEXT_FOUND_ELSEWHERE_NOT_COVERAGE_PROOF','PRESENT_BEFORE_HOLD_OR_REDISTRIBUTION']:
    status='PRIOR_EVIDENCE_RETAINED';evidence=old['current_evidence']+'; historical text-presence observation is not upgraded to semantic coverage.'
   elif re.fullmatch(r'(?:ose (?:kinni|kerin|karun)|week two three)',q):
    status='STRUCTURAL_WEEK_LABEL';evidence='Week/ordinal heading only; original source-to-destination mapping remains separately recorded.'
 r.update(latest_disposition=status,latest_evidence=evidence,supporting_body_sha256=hashes);output.append(r)
assert [x['candidate_id'] for x in source]==[x['candidate_id'] for x in output]
with (folder/'LATEST_SOURCE_LINE_DISPOSITION.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=output[0].keys(),lineterminator="\n");w.writeheader();w.writerows(output)
summary={'date':'2026-10-16','input_rows_sha256':hashlib.sha256(args.rows.read_bytes()).hexdigest(),'candidate_count':len(output),'statuses':dict(Counter(x['latest_disposition'] for x in output)),'historical_register_modified':False,'text_match_is_curriculum_certification':False}
(folder/'SOURCE_LINE_TRIAGE_SUMMARY.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
