#!/usr/bin/env python3
"""Compile an explicitly authorised R2 response into a NEW, inert plan bundle.

Standard library only. No network, DB, environment mutation or activation.
Recorded names/references are provenance, not cryptographic authentication.
See docs/jss3/completion/R2_SEQUENCING/CONVERTER.md for the input contract.
"""
import argparse
import csv
from datetime import date
import hashlib
import io
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
R2 = ROOT / 'docs/jss3/completion/R2_SEQUENCING'
TEMPLATE_COLUMNS = [
    'supplement_id', 'term', 'subject', 'title', 'proposed_after_original_index',
    'proposed_anchor_original_title', 'confidence', 'overlap_supports_relation',
    'recommended_decision', 'decision', 'approved_after_original_index',
    'approver_name', 'approver_role', 'decided_on', 'basis',
]
EDITABLE = TEMPLATE_COLUMNS[9:]
INPUT_NAMES = {
    'response_csv', 'original_rows_json', 'proposal_csv', 'response_template_csv',
    'supplements_json', 'relations_csv', 'policy_md',
}
AUTH_FIELDS = {
    'plan_version', 'owner_name', 'owner_authority_reference', 'approved_on',
    'school_codes', 'term_pin_enforced', 'approvers', 'reviewed_inputs',
}
TERMS = {'1st Term', '2nd Term'}
POLICY = ('R2 D1-D4: non-gating supplements; legacy open/passed access retained; '
          'original #1 remains first; unplaced supplements remain appended.')


class ConversionError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise ConversionError(message)


def text(value, label, minimum=1):
    require(isinstance(value, str) and len(value.strip()) >= minimum,
            f'{label}: nonblank text of at least {minimum} characters required')
    return value.strip()


def calendar_date(value, label):
    require(isinstance(value, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', value),
            f'{label}: YYYY-MM-DD required')
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ConversionError(f'{label}: invalid calendar date') from exc


def positive_index(value, label):
    require(isinstance(value, str) and re.fullmatch(r'[1-9][0-9]*', value),
            f'{label}: positive original integer index required')
    return int(value)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def json_bytes(data, label):
    def unique(pairs):
        obj = {}
        for key, val in pairs:
            require(key not in obj, f'{label}: duplicate JSON key {key}')
            obj[key] = val
        return obj
    try:
        return json.loads(data.decode('utf-8-sig'), object_pairs_hook=unique)
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ConversionError(f'{label}: invalid UTF-8 JSON') from exc


def csv_bytes(data, label, exact_columns=None):
    try:
        reader = csv.reader(io.StringIO(data.decode('utf-8-sig'), newline=''), strict=True)
        headers = next(reader)
        require(headers and len(headers) == len(set(headers)), f'{label}: duplicate/empty header')
        if exact_columns is not None:
            require(headers == exact_columns, f'{label}: use the exact response-template columns/order')
        rows = []
        for values in reader:
            if not values:  # empty physical lines, not an empty record
                continue
            require(len(values) == len(headers), f'{label}: malformed record at line {reader.line_num}')
            rows.append(dict(zip(headers, values)))
        return rows
    except (UnicodeError, csv.Error, StopIteration) as exc:
        raise ConversionError(f'{label}: invalid UTF-8 CSV') from exc


def indexed(rows, field, label):
    require(isinstance(rows, list), f'{label}: array required')
    result = {}
    for row in rows:
        require(isinstance(row, dict), f'{label}: object required')
        key = text(row.get(field), f'{label}.{field}')
        require(key == row[field], f'{label}: whitespace in identifier')
        require(key not in result, f'{label}: duplicate {key}')
        result[key] = row
    return result


def validate_authorization(auth, inputs):
    require(isinstance(auth, dict) and set(auth) == AUTH_FIELDS,
            'authorization: missing or unknown fields; use the supplied template')
    version = text(auth['plan_version'], 'plan_version')
    require(version == auth['plan_version'] and re.fullmatch(r'[A-Za-z0-9._-]+', version),
            'plan_version: invalid identifier')
    text(auth['owner_name'], 'owner_name', 2)
    text(auth['owner_authority_reference'], 'owner_authority_reference', 10)
    authorized_on = calendar_date(auth['approved_on'], 'authorization.approved_on')
    schools = auth['school_codes']
    require(isinstance(schools, list) and schools, 'D6: at least one explicitly authorised school_code required')
    for school in schools:
        require(isinstance(school, str) and school == school.strip() and bool(school),
                'D6: blank or padded school_code')
    require(len(schools) == len(set(schools)), 'D6: duplicate school_code')
    require(type(auth['term_pin_enforced']) is bool, 'D7: explicit boolean term_pin_enforced required')
    hashes = auth['reviewed_inputs']
    require(isinstance(hashes, dict) and set(hashes) == INPUT_NAMES,
            'reviewed_inputs: exact seven input hashes required')
    for key, data in inputs.items():
        require(isinstance(hashes[key], str) and re.fullmatch(r'[0-9a-f]{64}', hashes[key]),
                f'reviewed_inputs.{key}: SHA-256 required')
        require(sha(data) == hashes[key], f'{key}: bytes differ from owner-reviewed SHA-256')
    require(isinstance(auth['approvers'], list) and auth['approvers'], 'named approvers required')
    approvers = set()
    for person in auth['approvers']:
        require(isinstance(person, dict) and set(person) == {'name', 'role', 'authority_reference'},
                'approvers: name, role and authority_reference required')
        pair = (text(person['name'], 'approver.name', 2), text(person['role'], 'approver.role', 2))
        text(person['authority_reference'], 'approver.authority_reference', 10)
        require(pair not in approvers, 'duplicate authorised approver')
        approvers.add(pair)
    return authorized_on, approvers


def convert(inputs, authorization_bytes):
    """Pure conversion. All files are bytes, so hashes bind exactly what is read."""
    require(set(inputs) == INPUT_NAMES, 'exact seven input files required')
    auth = json_bytes(authorization_bytes, 'authorization')
    authorized_on, approvers = validate_authorization(auth, inputs)
    supplements = indexed(json_bytes(inputs['supplements_json'], 'supplements'), 'id', 'supplements')
    template = indexed(csv_bytes(inputs['response_template_csv'], 'template', TEMPLATE_COLUMNS),
                       'supplement_id', 'template')
    responses = indexed(csv_bytes(inputs['response_csv'], 'response', TEMPLATE_COLUMNS),
                        'supplement_id', 'response')
    proposal = indexed(csv_bytes(inputs['proposal_csv'], 'proposal'), 'supplement_id', 'proposal')
    relations = indexed(csv_bytes(inputs['relations_csv'], 'relations'), 'supplement_id', 'relations')
    require(supplements and set(supplements) == set(template) == set(proposal) == set(relations),
            'current supplement/proposal/template/relation IDs differ; refresh proposal before approval')
    require(set(responses) <= set(supplements), 'response: unknown supplement ID')

    originals = json_bytes(inputs['original_rows_json'], 'original rows')
    require(isinstance(originals, list) and originals, 'original rows: nonempty array required')
    buckets = {}
    for row in originals:
        require(isinstance(row, dict) and row.get('className') == 'JSS 3',
                'original rows: only JSS 3 capture rows are accepted')
        require(isinstance(row.get('termLabel'), str) and row['termLabel'] in TERMS,
                'original rows: invalid instructional term')
        subject = text(row.get('subjectName'), 'original subject')
        index = row.get('orderIndex')
        require(type(index) is int and index >= 1, 'original orderIndex: positive integer required')
        text(row.get('title'), 'original title')
        require(isinstance(row.get('sourceReference'), str), 'original sourceReference required')
        file_path = text(row.get('filePath'), 'original filePath')
        require(not re.fullmatch(r'SUP-[A-Z0-9-]+\.json', file_path.replace('\\', '/').split('/')[-1]),
                'original capture contains a supplement row')
        bucket = buckets.setdefault((row['termLabel'], subject), {})
        require(index not in bucket, 'original rows: duplicate bucket/index')
        bucket[index] = row
    for bucket in buckets.values():
        require(sorted(bucket) == list(range(1, len(bucket) + 1)), 'original bucket indices are not contiguous')

    placements, dispositions = [], []
    for sid in sorted(supplements):
        lesson, suggested, t = supplements[sid], proposal[sid], template[sid]
        require(re.fullmatch(r'SUP-[A-Z0-9-]+', sid), f'{sid}: invalid supplement identifier')
        term, subject, title = lesson.get('termLabel'), lesson.get('subjectName'), lesson.get('title')
        require(isinstance(term, str) and term in TERMS and isinstance(subject, str) and isinstance(title, str),
                f'{sid}: invalid lesson scope')
        bucket = buckets.get((term, subject))
        require(bucket is not None, f'{sid}: no original subject/term bucket')
        require(suggested.get('class_name') == 'JSS 3', f'{sid}: wrong proposal class')
        for field, current in [('term', term), ('subject', subject), ('title', title)]:
            require(t.get(field) == suggested.get(field) == current, f'{sid}: stale {field} metadata')
        require(suggested.get('current_original_count') == str(len(bucket)), f'{sid}: stale original bucket count')
        require(all(not t.get(field) for field in EDITABLE), f'{sid}: template must not contain decisions')
        k_text = suggested.get('proposed_after_original_index', '')
        require(t['proposed_after_original_index'] == k_text, f'{sid}: template/proposal anchor mismatch')
        for field in ['confidence', 'overlap_supports_relation']:
            require(t[field] == suggested.get(field), f'{sid}: template/proposal {field} mismatch')
        recommendation = ('KEEP_AT_END' if not k_text else 'APPROVE_AS_PROPOSED'
                          if t['confidence'] == 'HIGH' and t['overlap_supports_relation'] == 'YES' else 'PENDING')
        require(t['recommended_decision'] == recommendation, f'{sid}: stale recommendation')
        if k_text:
            k = positive_index(k_text, f'{sid} proposed anchor')
            require(k in bucket, f'{sid}: proposed anchor outside original bucket')
            # Existing proposal/template titles are deliberately truncated to 80 chars.
            require(t['proposed_anchor_original_title'] == bucket[k]['title'].strip()[:80],
                    f'{sid}: proposed anchor title differs from original capture')
            indices = suggested.get('related_original_indices', '').split(';')
            hashes = suggested.get('related_original_source_sha256_12', '').split(';')
            require(len(indices) == len(set(indices)) and len(indices) == len(hashes) and k_text in indices,
                    f'{sid}: proposed anchor has no unambiguous source-body evidence')
            require(hashes[indices.index(k_text)] == sha(bucket[k]['sourceReference'].encode('utf-8'))[:12],
                    f'{sid}: proposed anchor source body differs')
        else:
            require(t['proposed_anchor_original_title'] == '', f'{sid}: title without a proposed anchor')

        response = responses.get(sid)
        if response is None:
            placements.append({'supplement_id': sid, 'status': 'PENDING'})
            dispositions.append({'supplement_id': sid, 'decision': 'OMITTED', 'status': 'PENDING'})
            continue
        for field in TEMPLATE_COLUMNS[:9]:
            require(response[field] == t[field], f'{sid}: response changed immutable {field}; refresh the template')
        values = {field: response[field].strip() for field in EDITABLE}
        decision = values['decision']
        require(decision in {'', 'PENDING', 'KEEP_AT_END', 'APPROVE_AS_PROPOSED', 'OVERRIDE'},
                f'{sid}: unknown decision')
        if not decision:
            require(not any(values.values()), f'{sid}: incomplete decision/approval fields')
            placements.append({'supplement_id': sid, 'status': 'PENDING'})
            dispositions.append({'supplement_id': sid, 'decision': 'BLANK', 'status': 'PENDING'})
            continue

        nonplacement = decision in {'PENDING', 'KEEP_AT_END'}
        if nonplacement:
            require(not values['approved_after_original_index'], f'{sid}: non-placement carries an approved anchor')
        fields = ['approver_name', 'approver_role', 'decided_on', 'basis']
        # Bare explicit PENDING is allowed. All other decisions require a recorded person.
        recorded = decision != 'PENDING' or any(values[f] for f in fields)
        if recorded:
            pair = (text(values['approver_name'], f'{sid} approver name', 2),
                    text(values['approver_role'], f'{sid} approver role', 2))
            require(pair in approvers, f'{sid}: approver name/role not authorised')
            decided = calendar_date(values['decided_on'], f'{sid} decided_on')
            require(decided <= authorized_on, f'{sid}: decision is later than owner sign-off')
            text(values['basis'], f'{sid} basis', 10)
        if nonplacement:
            p = {'supplement_id': sid, 'status': decision}
            if values['basis']:
                p['basis'] = values['basis']
        else:
            if decision == 'APPROVE_AS_PROPOSED':
                require(bool(k_text), f'{sid}: no proposed anchor; use explicit OVERRIDE')
                require(values['approved_after_original_index'] in {'', k_text},
                        f'{sid}: differing anchor requires OVERRIDE')
                anchor_index = positive_index(k_text, f'{sid} approved anchor')
            else:
                anchor_index = positive_index(values['approved_after_original_index'], f'{sid} override anchor')
            require(anchor_index in bucket, f'{sid}: approved anchor outside original subject/term bucket')
            p = {
                'supplement_id': sid, 'status': 'APPROVED',
                'after_original_order_index': anchor_index,
                'anchor_title': bucket[anchor_index]['title'],  # full title, never the truncated template title
                'approver': f'{pair[0]} ({pair[1]})', 'approved_on': values['decided_on'],
                'basis': values['basis'],
            }
        placements.append(p)
        dispositions.append({'supplement_id': sid, 'decision': decision, 'status': p['status']})

    plan = {'plan_version': auth['plan_version'], 'policy': POLICY,
            'school_codes': sorted(auth['school_codes']), 'placements': placements}
    receipt = {
        'status': 'CONVERTED_NOT_ACTIVATED', 'database_actions': False,
        'authorization_sha256': sha(authorization_bytes), 'reviewed_inputs': auth['reviewed_inputs'],
        'owner_name': auth['owner_name'], 'owner_authority_reference': auth['owner_authority_reference'],
        'authorized_on': auth['approved_on'], 'school_codes': plan['school_codes'],
        'term_pin_enforced': auth['term_pin_enforced'], 'term_pin_applied': False,
        'approvers': auth['approvers'], 'dispositions': dispositions,
        'counts': {s: sum(p['status'] == s for p in placements) for s in ['APPROVED', 'KEEP_AT_END', 'PENDING']},
    }
    return plan, receipt


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n').encode('utf-8')


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--response', type=Path, required=True)
    parser.add_argument('--authorization', type=Path, required=True)
    parser.add_argument('--originals', type=Path, required=True, help='private original-rows.json from the real importer capture')
    parser.add_argument('--output', type=Path, required=True, help='NEW directory; existing paths are never overwritten')
    args = parser.parse_args(argv)
    paths = {
        'response_csv': args.response, 'original_rows_json': args.originals,
        'proposal_csv': R2 / 'PLACEMENT_PROPOSAL_R2.csv',
        'response_template_csv': R2 / 'PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv',
        'supplements_json': ROOT / 'backend/src/db/data/jss3Supplements.json',
        'relations_csv': R2 / 'R2_RELATION_DECISIONS.csv',
        'policy_md': ROOT / 'docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md',
    }
    try:
        require(not args.output.exists() and not args.output.is_symlink(), 'output already exists; choose a NEW directory')
        plan, receipt = convert({key: path.read_bytes() for key, path in paths.items()}, args.authorization.read_bytes())
        plan_bytes = encoded(plan)
        receipt['plan_sha256'] = sha(plan_bytes)
        receipt_bytes = encoded(receipt)
        # All input checks and serialization complete before any output is created.
        args.output.mkdir(parents=False, exist_ok=False)
        with (args.output / 'jss3SequencePlan.json').open('xb') as f:
            f.write(plan_bytes)
        with (args.output / 'conversion-receipt.json').open('xb') as f:
            f.write(receipt_bytes)
        print(json.dumps({'status': receipt['status'], 'counts': receipt['counts'],
                          'output': str(args.output), 'plan_sha256': receipt['plan_sha256']}))
        return 0
    except (ConversionError, OSError) as exc:
        print(f'CONVERSION REFUSED: {exc}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
