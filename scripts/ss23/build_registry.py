"""Build backend/src/db/ss23/sourceRegistry.json from docs/ss23/sources/HEADER_VERIFICATION.csv.
usage: python3 -I build_registry.py <HEADER_VERIFICATION.csv> <out.json>"""
import csv, json, sys
rows = list(csv.DictReader(open(sys.argv[1])))
out = []
for r in sorted(rows, key=lambda r: (r['class'], r['term'], r['filename_subject'], r['archive_member'])):
    dup = r['mapping_status'].split(':', 1)[1].split(';') if r['mapping_status'].startswith('BYTE_IDENTICAL') else []
    twins = sorted(x['source_id'] for x in rows if x['archive_member'] in dup)
    out.append({'source_id': r['source_id'], 'sha256': r['sha256'], 'bytes': int(r['bytes']),
                'archive_member': r['archive_member'], 'class_name': 'SS ' + r['class'][2], 'term': r['term'],
                'assigned_subject_slug': r['filename_subject'], 'header_status': r['header_status'],
                'identical_to': twins})
json.dump(out, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False); open(sys.argv[2], 'a').write('\n')
print(len(out), 'registry rows')
