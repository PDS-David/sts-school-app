"""Cross-reference SEMANTIC_REVIEW_REQUIRED source lines to attributed supplement lessons.
Evidence is supplement text only (original row bodies are not in Git). A hit is a REVIEW LEAD,
never certification. Historical register and LATEST_SOURCE_LINE_DISPOSITION.csv are not modified."""
import csv, json, re, unicodedata
from pathlib import Path
repo = Path(__file__).resolve().parents[2]; docs = repo / 'docs/jss3'
sups = json.loads((repo / 'backend/src/db/data/jss3Supplements.json').read_text())
def norm(s): return ' '.join(re.sub(r'[^\w]+', ' ', unicodedata.normalize('NFKC', s).lower()).split())
SUBJ = {'Agric': 'Agricultural Science', 'BASIC SCIENCE': 'Basic Science', 'BASIC TECH': 'Basic Technology',
 'BUSINESS': 'Business Studies', 'FRENCH': 'French', 'YORUBA': 'Yoruba', 'CIVIC': 'Civic Education', 'MATH': 'Mathematics',
 'PHE': 'Physical & Health Education', 'P H E': 'Physical & Health Education', 'ENGLISH': 'English Language',
 'MUSIC': 'Music', 'FINE ART': 'Fine Art', 'SOCIAL': 'Social Studies', 'HOME': 'Home Economics', 'CCA': 'Cultural and Creative Arts'}
def subject(doc):
    d = doc.upper()
    for k, v in SUBJ.items():
        if k.upper() in d: return v
    return ''
def term(doc): return '1st Term' if '1ST' in doc else '2nd Term' if '2ND' in doc else '3rd Term'
STOP = set('and the of in to a for on with their its be as is by an or at from'.split())
def toks(s): return {t for t in norm(s).split() if len(t) > 3 and t not in STOP and not t.isdigit()}
rows = list(csv.DictReader((docs / 'LATEST_SOURCE_LINE_DISPOSITION.csv').open()))
out = []
for r in rows:
    if r['latest_disposition'] != 'SEMANTIC_REVIEW_REQUIRED': continue
    subj, tm = subject(r['source_document']), term(r['source_document'])
    line = re.sub(r'^\s*(?:week\s*\w+\s*[-:]?\s*|\d+(?:\s*and\s*\d+)?\s*[.\t ]+)', '', r['text'].strip(), flags=re.I)
    lt = toks(line); lead = []
    for s in sups:
        if s['subjectName'] != subj: continue
        title_t, body_t = toks(s['title']), toks(s['body'])
        if lt and len(lt) >= 2 and len(lt & title_t) / len(lt) >= 0.6:
            lead.append((s['id'], 'title', sorted(lt & title_t)))
        elif lt and len(lt) >= 3 and len(lt & body_t) / len(lt) >= 0.8:
            lead.append((s['id'], 'body', sorted(lt & body_t)))
    third = tm == '3rd Term'
    if lead: status = 'SUPPLEMENT_LEAD_REVIEW'
    elif third: status = 'THIRD_TERM_SOURCE_NEEDS_ORIGINAL_BODY_AND_DESTINATION_RULE'
    else: status = 'NEEDS_ORIGINAL_ROW_BODY'
    out.append({'candidate_id': r['candidate_id'], 'source_document': r['source_document'], 'source_text_line': r['source_text_line'],
      'text': r['text'], 'subject': subj, 'term': tm, 'xref_status': status,
      'supplement_leads': ' | '.join(f"{i} ({w}: {', '.join(k)})" for i, w, k in lead),
      'note': 'Lead only: same-subject supplement shares objective wording; not coverage certification.' if lead else
              ('Third-Term source: instruction must stay in First/Second; compare to original row bodies before any disposition.' if third else
               'No supplement lead. Original row body (not in Git) must be compared.')})
with (docs / 'SEMANTIC_REVIEW_SUPPLEMENT_XREF.csv').open('w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=out[0].keys(), lineterminator='\n'); w.writeheader(); w.writerows(out)
from collections import Counter
print(len(out), dict(Counter(x['xref_status'] for x in out)))
