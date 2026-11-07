#!/usr/bin/env python3
"""Read-only live English dispatch and SS1 counts; no cached status snapshot."""
import collections
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ss1/work/microtasks'

def main():
    overall = collections.Counter()
    for path in sorted(BASE.glob('*/QUEUE.json')):
        queue = json.loads(path.read_text())
        overall.update(item['status'] for item in queue['items'])
    queue = json.loads((BASE / 'english/QUEUE.json').read_text())
    items = queue['items']
    duplicate_ids = [key for key, n in collections.Counter(i['id'] for i in items).items() if n > 1]
    if duplicate_ids:
        raise SystemExit('Ambiguous queue IDs: ' + ', '.join(duplicate_ids))
    by_id = {item['id']: item for item in items}
    print('English:', dict(collections.Counter(i['status'] for i in items)))
    print('All SS1:', dict(overall))
    print('Implementation is not content approval, verification or delivery.')
    for item in items:
        if item['status'] == 'IMPLEMENTED_TESTING_DEFERRED':
            continue
        unmet = [dep for dep in item.get('depends_on', []) if by_id.get(dep, {}).get('status') != 'IMPLEMENTED_TESTING_DEFERRED']
        print(item['id'], item['status'], 'unmet=' + ','.join(unmet))

if __name__ == '__main__':
    main()
