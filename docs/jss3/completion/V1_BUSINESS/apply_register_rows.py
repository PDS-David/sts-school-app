#!/usr/bin/env python3
"""Append (never edit) the four V1 supplements to the shared replacement registers. Idempotent.
Usage (repo root): python3 docs/jss3/completion/V1_BUSINESS/apply_register_rows.py <supplemented-rows.json> <SOURCE_INVENTORY.csv>
Also writes docs/jss3/completion/V1_BUSINESS/REGISTER_APPENDS.csv (exact appended rows) for the integration agent."""
import csv, hashlib, json, sys
from pathlib import Path
cap = json.load(open(sys.argv[1])); inv = {r['staged_path'].split('/')[-1]: r['sha256'] for r in csv.DictReader(open(sys.argv[2]))}
sup = {s['id']: s for s in json.load(open('backend/src/db/data/jss3Supplements.json'))}
R = Path('docs/jss3/replacements')
SPEC = [('SUP-BUS-LEDGER-ANSWERS', 'WG-BUS-V1-LEDGER', 'BUSINESS STUDIES_1.docx', 6, 'First-Term Week 5 double-entry T-accounts and Papaluwe exercise (V1 visual recovery)'),
        ('SUP-BUS-TRIALBAL-PRACTICE', 'WG-BUS-V1-TRIALBAL', 'BUSINESS STUDIES_1.docx', 6, 'First-Term Week 6 cash book, ledgers, trial balances incl. corrected second method (V1 visual recovery)'),
        ('SUP-BUS-TRADING-PL-ANSWER', 'WG-BUS-V1-TRADINGPL', 'business_studies JSS3.docx', 9, 'Second-Term Week 5 trading and profit-and-loss layouts and babasuwe assignment (V1 visual recovery)'),
        ('SUP-BUS-PAPER-SIZES', 'WG-BUS-V1-PAPER', 'business_studies JSS3.docx', 9, 'Second-Term Week 7 A-series paper-size table, A4 width correction (V1 visual recovery)')]
def has(path, col, val): return any(r[col] == val for r in csv.DictReader(open(path, newline='')))
def add(path, row):
    with open(path, 'a', newline='') as f: csv.writer(f, lineterminator='\n').writerow(row)
log = []
for sid, gap, src, nroot, locator in SPEC:
    s = sup[sid]; row = next(r for r in cap if r['weekLabel'] == 'SUPPLEMENT ' + sid)
    body = hashlib.sha256(row['sourceReference'].encode()).hexdigest(); order = str(row['orderIndex'])
    rows = {'IMPLEMENTED_LESSONS.csv': ('id', [sid, gap, s['subjectName'], s['termLabel'], order, s['title'], body, ';'.join(x['url'] for x in s['sources'])]),
     'CURRENT_COVERAGE.csv': ('id', [gap, 'REPLACEMENT_IMPLEMENTED', sid, 'Explicitly new teaching and assessment available through --jss3-supplements. Implementation coverage, not independent pedagogical certification or a production import.']),
     'WIDER_WORKSTREAMS.csv': ('id', [gap, 'JSS3 %s TERM /%s' % ('1ST' if '1st' in s['termLabel'] else '2ND', src), inv[src], locator, sid, 'REPLACEMENT_IMPLEMENTED', 'Newly prepared teaching; original source remains unchanged and no teacher answer key is claimed.']),
     'TEACHER_SCHEDULE_SUPPLEMENTS.csv': ('supplement_id', [sid, s['subjectName'], s['termLabel'], order, str(nroot), '', '', gap + ': ' + locator, 'No scheme week recorded: teach after the original lesson it supports.'])}
    for f, (col, r) in rows.items():
        if not has(R / f, col, r[0]): add(R / f, r); log.append([f] + r)
with open('docs/jss3/completion/V1_BUSINESS/REGISTER_APPENDS.csv', 'w', newline='') as f: csv.writer(f, lineterminator='\n').writerows([['register', 'row...']] + log)
print('appended', len(log), 'rows')
