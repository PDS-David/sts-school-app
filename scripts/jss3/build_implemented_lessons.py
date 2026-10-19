#!/usr/bin/env python3
"""Regenerate docs/jss3/replacements/IMPLEMENTED_LESSONS.csv from the supplement
JSON and a supplemented capture (capture_rows.py output). Never hand-edit the CSV.
Usage: build_implemented_lessons.py SUPPLEMENTS_JSON SUPPLEMENTED_ROWS_JSON OUT_CSV [ORDER_REF_CSV (default OUT_CSV)]
order_index = the capture's orderIndex for that supplement's synthetic file
(<id>.json); body_sha256 = importer supplementBodyHash = sha256 of the captured sourceReference."""
import csv, hashlib, io, json, os, sys

def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def build(supp, rows):
    cap = {os.path.basename(r['filePath'])[:-5]: r
           for r in rows if '__jss3_supplements__' in r['filePath']}
    out = []
    for s in supp:
        gaps = s['gapIds']
        if isinstance(gaps, str):
            gaps = [gaps]
        urls = '; '.join(x['url'] for x in s['sources'] if x.get('url'))
        out.append([s['id'], '; '.join(gaps), s['subjectName'], s['termLabel'],
                    cap[s['id']]['orderIndex'], s['title'],
                    hashlib.sha256(cap[s['id']]['sourceReference'].encode('utf-8')).hexdigest(), urls])
    return out

def order_like(table, existing_csv):
    """Keep rows already in the published CSV in their file order (history is
    append-order, not JSON order); append new ids in JSON order."""
    if not existing_csv or not os.path.exists(existing_csv):
        return table
    with open(existing_csv, encoding='utf-8', newline='') as f:
        prior = [r['id'] for r in csv.DictReader(f)]
    pos = {i: n for n, i in enumerate(prior)}
    old = sorted((r for r in table if r[0] in pos), key=lambda r: pos[r[0]])
    new = [r for r in table if r[0] not in pos]
    return old + new

def render(table):
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator='\n')
    w.writerow(['id', 'gap_ids', 'subject', 'term', 'order_index', 'title', 'body_sha256', 'source_urls'])
    w.writerows(table)
    return buf.getvalue()

if __name__ == '__main__':
    supp, rows, out = sys.argv[1:4]
    ref = sys.argv[4] if len(sys.argv) > 4 else out
    with open(out + '.tmp', 'w', encoding='utf-8', newline='') as f:
        f.write(render(order_like(build(load(supp), load(rows)), ref)))
    os.replace(out + '.tmp', out)
