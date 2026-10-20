#!/usr/bin/env python3
"""Compare before/after captured rows by identity AND body hash (not counts). Usage: compare_rows.py <before.json> <after.json>"""
import json, sys, hashlib
b = json.load(open(sys.argv[1])); a = json.load(open(sys.argv[2]))
key = lambda r: (r['filePath'].split('/')[-1], r['termLabel'], r['subjectName'], r['weekLabel'], r['title'])
h = lambda r: hashlib.sha256(r['sourceReference'].encode()).hexdigest()
bm = {key(r): (r, h(r)) for r in b}; am = {key(r): (r, h(r)) for r in a}
assert len(bm) == len(b) and len(am) == len(a), 'identity not unique'
removed = [k for k in bm if k not in am]; added = [k for k in am if k not in bm]
changed_body = [k for k in bm if k in am and bm[k][1] != am[k][1]]
moved = [k for k in bm if k in am and bm[k][0]['orderIndex'] != am[k][0]['orderIndex']]
out = {'before_rows': len(b), 'after_rows': len(a), 'removed': removed, 'changed_body': changed_body, 'order_changed': moved,
       'added': [{'lesson': k[3], 'term': k[1], 'orderIndex': am[k][0]['orderIndex']} for k in added]}
print(json.dumps(out, indent=1)); sys.exit(1 if removed or changed_body or moved else 0)
