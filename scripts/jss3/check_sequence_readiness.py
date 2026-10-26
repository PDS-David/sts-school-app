#!/usr/bin/env python3
"""Offline JSS3 sequence-bundle consistency checker; NEVER authorises activation.
Exit 0: consistent bundle with approved placements, for operator review only.
Exit 2: blocked inputs, wrong school or no approved placements.
"""
import argparse
import importlib.util
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
CONVERTER_PATH = Path(__file__).with_name('convert_placement_approvals.py')
spec = importlib.util.spec_from_file_location('jss3_approval_converter', CONVERTER_PATH)
converter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(converter)

EXTERNAL_REQUIREMENTS = (
    ('OWNER_AUTHORITY', 'Confirm actual owner/delegate authority; recorded names/hashes are not digital signatures.'),
    ('FINAL_VERIFICATION', 'Use completed later-stage converter, plan-schema and sequence/API/PostgreSQL verification for this candidate.'),
    ('TARGET_AND_PIN', 'Verify the designated target/school and actual TERM_PIN_ENFORCED against recorded D6/D7.'),
    ('SCHEMA_AND_ROWS', 'On the authorised target, verify rank/audit schema and stored identities/content with the existing apply-tool dry run.'),
    ('PLAN_HISTORY', 'Check target audit history, plan_version and already applied or externally edited ranks.'),
    ('REHEARSAL_AND_ROLLBACK', 'Provide the appropriate staging apply/rollback rehearsal and recoverable backup.'),
    ('EXPLICIT_APPLY_AUTHORITY', 'Locate authority for this exact plan hash, school and target before apply; converter sign-off is not production-write approval.'),
)


def new_report(school):
    return {
        'status': 'BLOCKED', 'ready_for_operator_review': False,
        'ready_for_activation': False, 'database_actions': False,
        'requested_school_code': school, 'blocking_findings': [],
        'remaining_activation_requirements': [
            {'id': key, 'status': 'NOT_CHECKED_OFFLINE', 'action': action}
            for key, action in EXTERNAL_REQUIREMENTS
        ],
        'scope': 'Offline snapshot consistency only; no signer authentication, live DB/PIN inspection, test pass, activation or curriculum certification.',
    }


def assess(inputs, authorization_bytes, plan_bytes, receipt_bytes, school_code):
    """Recompute using the current converter/catalog; compare the entire bundle."""
    report = new_report(school_code)
    try:
        converter.require(isinstance(school_code, str) and bool(school_code)
                          and school_code == school_code.strip(), 'exact nonblank school_code required')
        plan, receipt = converter.convert(inputs, authorization_bytes)
        expected_plan = converter.encoded(plan)
        receipt['plan_sha256'] = converter.sha(expected_plan)
        expected_receipt = converter.encoded(receipt)
        converter.json_bytes(plan_bytes, 'plan')
        converter.json_bytes(receipt_bytes, 'receipt')
        converter.require(plan_bytes == expected_plan,
                          'plan differs from current conversion of reviewed inputs; regenerate/review, do not edit by hand')
        converter.require(receipt_bytes == expected_receipt,
                          'receipt differs from current conversion; an edited hash/count/status is not evidence')
        converter.require(school_code in plan['school_codes'],
                          'requested school absent from recorded D6 school_codes')
        report.update({
            'plan_version': plan['plan_version'],
            'plan_sha256': converter.sha(plan_bytes),
            'receipt_sha256': converter.sha(receipt_bytes),
            'authorization_sha256': converter.sha(authorization_bytes),
            'reviewed_input_hashes': receipt['reviewed_inputs'],
            'authorised_school_codes': plan['school_codes'],
            'expected_term_pin_enforced': receipt['term_pin_enforced'],
            'counts': receipt['counts'],
            'pending_supplement_ids': [p['supplement_id'] for p in plan['placements'] if p['status'] == 'PENDING'],
            'keep_at_end_supplement_ids': [p['supplement_id'] for p in plan['placements'] if p['status'] == 'KEEP_AT_END'],
            'pending_handling': 'Unapproved rows remain appended; they do not become approvals or block a separately authorised approved subset.',
        })
        if receipt['counts']['APPROVED'] == 0:
            report['status'] = 'NO_APPROVED_PLACEMENTS'
            report['blocking_findings'].append('No approved placements to activate; keep the plan inert.')
        else:
            report['status'] = 'CONSISTENT_FOR_OPERATOR_REVIEW'
            report['ready_for_operator_review'] = True
    except (ValueError, TypeError, KeyError) as exc:
        report['blocking_findings'].append(str(exc))
    return report


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--response', type=Path, required=True)
    parser.add_argument('--authorization', type=Path, required=True)
    parser.add_argument('--originals', type=Path, required=True)
    parser.add_argument('--bundle', type=Path, required=True, help='converter output directory')
    parser.add_argument('--school-code', required=True, help='exact intended school; no default')
    parser.add_argument('--output', type=Path, help='optional NEW report file; never overwritten')
    args = parser.parse_args(argv)
    r2 = ROOT / 'docs/jss3/completion/R2_SEQUENCING'
    paths = {
        'response_csv': args.response, 'original_rows_json': args.originals,
        'proposal_csv': r2 / 'PLACEMENT_PROPOSAL_R2.csv',
        'response_template_csv': r2 / 'PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv',
        'supplements_json': ROOT / 'backend/src/db/data/jss3Supplements.json',
        'relations_csv': r2 / 'R2_RELATION_DECISIONS.csv',
        'policy_md': ROOT / 'docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md',
    }
    other = {'authorization': args.authorization,
             'plan': args.bundle / 'jss3SequencePlan.json',
             'receipt': args.bundle / 'conversion-receipt.json'}
    report, data = new_report(args.school_code), {}
    for label, path in {**paths, **other}.items():
        try:
            data[label] = path.read_bytes()
        except OSError:
            report['blocking_findings'].append(f'{label}: required input missing or unreadable')
    if not report['blocking_findings']:
        report = assess({key: data[key] for key in paths}, data['authorization'],
                        data['plan'], data['receipt'], args.school_code)
    report['implementation_hashes'] = {
        'converter': converter.sha(CONVERTER_PATH.read_bytes()),
        'checker': converter.sha(Path(__file__).read_bytes()),
    }
    report_bytes = converter.encoded(report)
    if args.output is not None:
        try:
            with args.output.open('xb') as output:
                output.write(report_bytes)
        except OSError:
            print('REPORT NOT WRITTEN: choose a NEW file in an existing writable directory.', file=sys.stderr)
            return 2
    sys.stdout.write(report_bytes.decode('utf-8'))
    return 0 if report['ready_for_operator_review'] else 2


if __name__ == '__main__':
    sys.exit(main())
