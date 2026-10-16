"""Teacher schedule for appended JSS3 supplements. Anchors come only from recorded scheme weeks
(R9 register / WIDER_WORKSTREAMS) and the importer's append order_index (IMPLEMENTED_LESSONS.csv).
It does not renumber anything and is not an app/database change."""
import csv, re
from pathlib import Path
from collections import defaultdict
docs = Path(__file__).resolve().parents[2] / 'docs/jss3'
r9 = {r['id']: r for r in csv.DictReader((docs / 'CONTENT_GAPS_R9_UNCHANGED.csv').open(encoding='utf-8-sig'))}
wg = {r['id']: r for r in csv.DictReader((docs / 'replacements/WIDER_WORKSTREAMS.csv').open())}
imp = list(csv.DictReader((docs / 'replacements/IMPLEMENTED_LESSONS.csv').open()))
WORDS = {'ONE':1,'TWO':2,'THREE':3,'FOUR':4,'FIVE':5,'SIX':6,'SEVEN':7,'EIGHT':8,'NINE':9,'TEN':10}
def wk(s):
    """First scheme week/ordinal named in the text; (n, kind) or None. 'item N' is a scheme list position, not a week."""
    m = re.search(r'(week|wk|ose|item)s?\s*(\d+|' + '|'.join(WORDS) + r')', s, re.I)
    if not m: return None
    v = m.group(2).upper(); return (int(v) if v.isdigit() else WORDS[v], 'item' if m.group(1).lower() == 'item' else 'week')
bucket = defaultdict(list)
for r in imp: bucket[(r['subject'], r['term'])].append(int(r['order_index']))
out = []
for r in imp:
    weeks, heads = [], []
    for g in re.split('[;,]', r['gap_ids']):
        g = g.strip()
        if g in r9 and r9[g]['original_term'].startswith(r['term']):   # only gaps from this supplement's own term
            w = wk(r9[g]['source_week'])
            if w: weeks.append(w)
            heads.append(f"{g}: {r9[g]['source_week']}")
        elif g in wg:
            w = wk(wg[g]['locator'].replace('scheme week', 'week'))
            if w: weeks.append(w)
            heads.append(f"{g}: {wg[g]['locator'][:70]}")
    kinds = {k for _, k in weeks}
    first = min(n for n, _ in weeks) if weeks else ''
    out.append({'supplement_id': r['id'], 'subject': r['subject'], 'term': r['term'],
      'app_order_index_append': r['order_index'], 'appended_after_originals': min(bucket[(r['subject'], r['term'])]) - 1,
      'scheme_week_anchor': first, 'anchor_kind': ('scheme_list_item' if kinds == {'item'} else 'scheme_week') if weeks else '', 'anchor_evidence': ' | '.join(heads),
      'teacher_instruction': (f"Teach from scheme {'list item' if kinds == {'item'} else 'week'} {first} onward, before the term's assessment/exam week." if first != '' else
         'No scheme week recorded: teach before the term assessment week; owner/teacher chooses the week.')})
out.sort(key=lambda x: (x['subject'], x['term'], x['scheme_week_anchor'] if x['scheme_week_anchor'] != '' else 99, int(x['app_order_index_append'])))
with (docs / 'replacements/TEACHER_SCHEDULE_SUPPLEMENTS.csv').open('w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=out[0].keys(), lineterminator='\n'); w.writeheader(); w.writerows(out)
print(len(out), sum(1 for x in out if x['scheme_week_anchor'] == ''), 'without recorded week')
