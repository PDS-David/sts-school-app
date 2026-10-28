#!/usr/bin/env python3
"""Read-only current-state snapshots; never historical certification.

No database driver required: capture invokes psql with libpq environment settings.
All columns are retained, including runtime fields and asset bytes. Pause unrelated
curriculum/learning writes for the entire before-operation-after maintenance window.
"""
import argparse
from datetime import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

VERSION = 'jss3-current-preservation-v1'
SCOPE = "ALL schools: topics.class_name IS DISTINCT FROM 'JSS 3'; referenced subjects; attached assets; ALL columns"
TABLES = ('topics', 'subjects', 'assets')


def unique_object(pairs):
    out = {}
    for key, value in pairs:
        if key in out:
            raise ValueError('duplicate JSON key')
        out[key] = value
    return out


def parse(text):
    return json.loads(text, object_pairs_hook=unique_object,
                      parse_constant=lambda _: (_ for _ in ()).throw(ValueError('non-finite JSON number')))


def digest(data):
    return hashlib.sha256(data).hexdigest()


def save(path, value):
    # Refuse overwriting evidence; owner chooses a fresh private output path.
    data = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'wb') as stream:
        stream.write(data)
    return digest(data)


def timestamp(value):
    result = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if result.tzinfo is None:
        raise ValueError('snapshot timestamp must include timezone')
    return result


def validate(value):
    if value.get('format') != VERSION or value.get('scope') != SCOPE:
        raise ValueError('unsupported snapshot format/scope')
    if value.get('phase') not in ('before', 'after'):
        raise ValueError('invalid phase')
    for key in ('target_label', 'operation_id', 'operator_reference', 'maintenance_reference'):
        if not isinstance(value.get(key), str) or not value[key].strip():
            raise ValueError('missing snapshot metadata: ' + key)
    raw = value['payload_json']
    if not isinstance(raw, str) or digest(raw.encode('utf-8')) != value['payload_sha256']:
        raise ValueError('payload digest mismatch')
    payload = parse(raw)
    db = payload['database']
    if not db.get('name') or not db.get('oid') or not payload.get('schema'):
        raise ValueError('database/schema identity missing')
    timestamp(payload['captured_at'])
    maps, decoded = {}, {}
    for table in TABLES:
        maps[table], decoded[table] = {}, {}
        for row in payload[table]:
            key, data = row['id'], row['data']
            if type(key) is not int or key <= 0 or key in maps[table] or not isinstance(data, str):
                raise ValueError('invalid/duplicate row identity in ' + table)
            obj = parse(data)
            if obj.get('id') != key:
                raise ValueError('row identity differs from payload')
            maps[table][key], decoded[table][key] = data, obj
    if not maps['topics']:
        raise ValueError('empty protected scope; cannot claim preservation')
    for topic in decoded['topics'].values():
        if topic.get('class_name') == 'JSS 3':
            raise ValueError('JSS3 row leaked into protected scope')
        subject = decoded['subjects'].get(topic.get('subject_id'))
        if subject is None or subject.get('school_code') != topic.get('school_code'):
            raise ValueError('missing or cross-school subject relationship')
    for asset in decoded['assets'].values():
        if asset.get('topic_id') not in maps['topics']:
            raise ValueError('asset outside protected scope')
    return payload, maps


def capture(args):
    # No URL/password on the command line; PGHOST/PGPORT/PGDATABASE/PGUSER and
    # PGPASSFILE/PGSERVICE are configured privately by the authorised operator.
    env = dict(os.environ)
    env['PGOPTIONS'] = '-c default_transaction_read_only=on'
    env['PGCONNECT_TIMEOUT'] = '10'
    command = ['psql', '-X', '-w', '-qAt', '-v', 'ON_ERROR_STOP=1',
               '-f', str(Path(__file__).with_name('snapshot.sql'))]
    result = subprocess.run(command, env=env, capture_output=True, text=True, timeout=120)
    if result.returncode:
        # Do not echo connection diagnostics or credentials to CI/chat logs.
        raise ValueError('read-only psql capture failed; inspect the authorised connection privately')
    raw = result.stdout.strip()
    value = dict(format=VERSION, scope=SCOPE, phase=args.phase,
                 target_label=args.target_label, operation_id=args.operation_id,
                 operator_reference=args.operator_reference,
                 maintenance_reference=args.maintenance_reference,
                 payload_json=raw, payload_sha256=digest(raw.encode('utf-8')))
    payload, rows = validate(value)
    sha = save(args.output, value)
    print(json.dumps({'status': 'CAPTURED_NOT_CERTIFIED', 'sha256': sha,
                      'counts': {t: len(rows[t]) for t in TABLES}}))


def compare(args):
    files = [Path(args.before).read_bytes(), Path(args.after).read_bytes()]
    before, after = [parse(b.decode('utf-8')) for b in files]
    bp, bm = validate(before)
    ap, am = validate(after)
    if before['phase'] != 'before' or after['phase'] != 'after':
        raise ValueError('expected before then after phases')
    for key in ('scope', 'target_label', 'operation_id', 'maintenance_reference'):
        if before[key] != after[key]:
            raise ValueError('incompatible ' + key)
    if bp['database'] != ap['database'] or bp['schema'] != ap['schema']:
        raise ValueError('different database endpoint/identity or schema; do not compare as same-state preservation')
    if timestamp(ap['captured_at']) <= timestamp(bp['captured_at']):
        raise ValueError('after snapshot is not later than before snapshot')
    differences = {}
    for table in TABLES:
        old, new = bm[table], am[table]
        changed = []
        for key in sorted(old.keys() & new.keys()):
            # Compare exact JSONB row strings, avoiding numeric precision loss.
            if old[key] != new[key]:
                changed.append({'id': key, 'before_sha256': digest(old[key].encode()),
                                'after_sha256': digest(new[key].encode())})
        differences[table] = {'added': sorted(new.keys() - old.keys()),
                              'removed': sorted(old.keys() - new.keys()), 'modified': changed}
    passed = not any(any(d.values()) for d in differences.values())
    report = {'status': 'UNCHANGED' if passed else 'CHANGED', 'format': VERSION,
              'historical_certification': False,
              'input_sha256': {'before': digest(files[0]), 'after': digest(files[1])},
              'counts': {t: {'before': len(bm[t]), 'after': len(am[t])} for t in TABLES},
              'differences': differences,
              'limitation': 'Current same-target preservation only; no proof of historical certification, operation causation or unobserved concurrent changes.'}
    save(args.output, report)
    print(json.dumps({'status': report['status'], 'historical_certification': False}))
    return 0 if passed else 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    cap = commands.add_parser('capture')
    cap.add_argument('--phase', choices=['before', 'after'], required=True)
    for arg in ('target-label', 'operation-id', 'operator-reference', 'maintenance-reference', 'output'):
        cap.add_argument('--' + arg, required=True)
    cmp = commands.add_parser('compare')
    for arg in ('before', 'after', 'output'):
        cmp.add_argument('--' + arg, required=True)
    args = parser.parse_args()
    try:
        if args.command == 'capture':
            capture(args)
            return 0
        return compare(args)
    except (ValueError, KeyError, TypeError, OSError, subprocess.TimeoutExpired):
        if args.command == 'compare':
            try:
                save(args.output, {'status': 'BLOCKED', 'historical_certification': False,
                                   'reason': 'Malformed/incompatible inputs or unavailable output; no comparison pass.'})
            except OSError:
                pass  # Never overwrite an existing evidence file.
        print('BLOCKED: malformed/incompatible input, failed read-only capture, or output unavailable; no preservation pass.', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
