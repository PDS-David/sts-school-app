"""Deferred by owner: run later with unittest discovery; all inputs are synthetic."""
import contextlib
import copy
import csv
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('placement_converter', ROOT / 'scripts/jss3/convert_placement_approvals.py')
converter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(converter)


def csv_data(rows, headers):
    stream = io.StringIO(newline='')
    writer = csv.DictWriter(stream, headers, lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue().encode()


def fixture():
    # The title exceeds the proposal's 80-character preview and has CSV-sensitive content.
    title = 'A title with a comma, a "quote", and Yorùbá: ' + 'full title ' * 8
    originals = [dict(className='JSS 3', termLabel='1st Term', subjectName='Yoruba',
                      orderIndex=i, title=title if i == 1 else 'Second original',
                      sourceReference=f'Original body {i}', filePath='source/Yoruba.docx') for i in [1, 2]]
    supplements = [dict(id=sid, subjectName='Yoruba', termLabel='1st Term', title=f'Lesson {sid}', body='Teaching')
                   for sid in ['SUP-TEST-A', 'SUP-TEST-B']]
    templates, proposals = [], []
    for lesson in supplements:
        row = {field: '' for field in converter.TEMPLATE_COLUMNS}
        row.update(supplement_id=lesson['id'], term='1st Term', subject='Yoruba', title=lesson['title'],
                   proposed_after_original_index='1', proposed_anchor_original_title=title[:80],
                   confidence='HIGH', overlap_supports_relation='YES', recommended_decision='APPROVE_AS_PROPOSED')
        templates.append(row)
        proposals.append(dict(supplement_id=lesson['id'], class_name='JSS 3', term='1st Term',
                              subject='Yoruba', title=lesson['title'], current_original_count='2',
                              proposed_after_original_index='1', confidence='HIGH', overlap_supports_relation='YES',
                              related_original_indices='1', related_original_source_sha256_12=converter.sha(b'Original body 1')[:12]))
    responses = copy.deepcopy(templates)
    responses[0].update(decision='APPROVE_AS_PROPOSED', approver_name='Teacher A', approver_role='Teacher',
                        decided_on='2026-10-25', basis='Source read and anchor reviewed, in context.\nSecond line of rationale.')
    inputs = {
        'response_csv': csv_data(responses, converter.TEMPLATE_COLUMNS),
        'original_rows_json': converter.encoded(originals),
        'proposal_csv': csv_data(proposals, list(proposals[0])),
        'response_template_csv': csv_data(templates, converter.TEMPLATE_COLUMNS),
        'supplements_json': converter.encoded(supplements),
        'relations_csv': csv_data([{'supplement_id': s['id']} for s in supplements], ['supplement_id']),
        'policy_md': b'Synthetic non-gating policy\n',
    }
    auth = dict(plan_version='TEST-v1', owner_name='Test Owner', owner_authority_reference='Synthetic fixture authority only',
                approved_on='2026-10-26', school_codes=['test-school'], term_pin_enforced=False,
                approvers=[dict(name='Teacher A', role='Teacher', authority_reference='Synthetic owner delegation')],
                reviewed_inputs={k: converter.sha(v) for k, v in inputs.items()})
    return inputs, auth


def resign(inputs, auth):
    auth['reviewed_inputs'] = {k: converter.sha(v) for k, v in inputs.items()}


def edit_response(inputs, auth, index=0, **changes):
    rows = converter.csv_bytes(inputs['response_csv'], 'fixture', converter.TEMPLATE_COLUMNS)
    rows[index].update(changes)
    inputs['response_csv'] = csv_data(rows, converter.TEMPLATE_COLUMNS)
    resign(inputs, auth)


class PlacementConverterTests(unittest.TestCase):
    def setUp(self):
        self.inputs, self.auth = fixture()

    def run_conversion(self):
        return converter.convert(self.inputs, converter.encoded(self.auth))

    def test_exact_plan_and_full_anchor_title_without_activation(self):
        plan, receipt = self.run_conversion()
        original = json.loads(self.inputs['original_rows_json'])[0]
        self.assertEqual(plan['placements'][0], {
            'supplement_id': 'SUP-TEST-A', 'status': 'APPROVED', 'after_original_order_index': 1,
            'anchor_title': original['title'], 'approver': 'Teacher A (Teacher)', 'approved_on': '2026-10-25',
            'basis': 'Source read and anchor reviewed, in context.\nSecond line of rationale.',
        })
        self.assertEqual(plan['placements'][1], {'supplement_id': 'SUP-TEST-B', 'status': 'PENDING'})
        self.assertEqual(receipt['counts'], {'APPROVED': 1, 'KEEP_AT_END': 0, 'PENDING': 1})
        self.assertFalse(receipt['database_actions'])
        self.assertFalse(receipt['term_pin_applied'])
        self.assertNotIn('term_pin_enforced', plan)  # runtime plan schema is strict
        self.assertEqual(self.run_conversion(), (plan, receipt))

    def test_override_uses_actual_other_anchor(self):
        edit_response(self.inputs, self.auth, decision='OVERRIDE', approved_after_original_index='2')
        self.assertEqual(self.run_conversion()[0]['placements'][0]['anchor_title'], 'Second original')

    def test_omitted_row_is_pending_never_recommended_approval(self):
        rows = converter.csv_bytes(self.inputs['response_csv'], 'fixture')
        self.inputs['response_csv'] = csv_data(rows[:1], converter.TEMPLATE_COLUMNS)
        resign(self.inputs, self.auth)
        plan, receipt = self.run_conversion()
        self.assertEqual(plan['placements'][1], {'supplement_id': 'SUP-TEST-B', 'status': 'PENDING'})
        self.assertEqual(receipt['dispositions'][1]['decision'], 'OMITTED')

    def test_explicit_nonplacements_strip_approval_fields_from_plan(self):
        for status in ['PENDING', 'KEEP_AT_END']:
            with self.subTest(status=status):
                self.inputs, self.auth = fixture()
                edit_response(self.inputs, self.auth, decision=status)
                p = self.run_conversion()[0]['placements'][0]
                self.assertEqual(set(p), {'supplement_id', 'status', 'basis'})
                self.assertEqual(p['status'], status)

    def test_bare_pending_is_valid_but_partial_signature_is_not(self):
        edit_response(self.inputs, self.auth, index=1, decision='PENDING')
        self.run_conversion()
        edit_response(self.inputs, self.auth, index=1, approver_name='Teacher A')
        with self.assertRaises(converter.ConversionError):
            self.run_conversion()

    def test_bad_decisions_anchors_and_signatures_refused(self):
        cases = [dict(decision='YES'), dict(decision=''), dict(approver_name=''), dict(approver_role=''),
                 dict(approver_name='Someone Else'), dict(basis='short'), dict(decided_on='2026-02-30'),
                 dict(decided_on='2026-10-27'), dict(approved_after_original_index='2'),
                 dict(decision='OVERRIDE', approved_after_original_index='0'),
                 dict(decision='OVERRIDE', approved_after_original_index='99'),
                 dict(decision='OVERRIDE', approved_after_original_index='1.5'),
                 dict(decision='KEEP_AT_END', approved_after_original_index='1'),
                 dict(decision='PENDING', approved_after_original_index='1'),
                 dict(subject='Other subject'), dict(proposed_anchor_original_title='Changed')]
        for changes in cases:
            with self.subTest(changes=changes):
                self.inputs, self.auth = fixture()
                edit_response(self.inputs, self.auth, **changes)
                with self.assertRaises(converter.ConversionError):
                    self.run_conversion()

    def test_blank_d6_d7_invalid_date_and_padded_plan_version_refused(self):
        for changes in [dict(school_codes=[]), dict(school_codes=['x', 'x']), dict(school_codes=[' ']),
                        dict(term_pin_enforced='false'), dict(approved_on='2026-13-01'),
                        dict(plan_version=' padded '), dict(owner_authority_reference=''), dict(approvers=[])]:
            with self.subTest(changes=changes):
                self.inputs, self.auth = fixture()
                self.auth.update(changes)
                with self.assertRaises(converter.ConversionError):
                    self.run_conversion()

    def test_every_reviewed_hash_is_enforced(self):
        for key in sorted(converter.INPUT_NAMES):
            with self.subTest(key=key):
                self.inputs, self.auth = fixture()
                self.inputs[key] += b'\n'
                with self.assertRaisesRegex(converter.ConversionError, 'SHA-256'):
                    self.run_conversion()

    def test_duplicate_unknown_and_malformed_csv_rows_refused(self):
        rows = converter.csv_bytes(self.inputs['response_csv'], 'fixture')
        for new_rows in [rows + [rows[0]], [dict(rows[0], supplement_id='SUP-UNKNOWN')]]:
            self.inputs, self.auth = fixture()
            self.inputs['response_csv'] = csv_data(new_rows, converter.TEMPLATE_COLUMNS)
            resign(self.inputs, self.auth)
            with self.assertRaises(converter.ConversionError):
                self.run_conversion()
        for data in [b'decision,decision\nYES,YES\n', b'supplement_id\nSUP-A,extra\n', b'']:
            with self.assertRaises(converter.ConversionError):
                converter.csv_bytes(data, 'bad', converter.TEMPLATE_COLUMNS)

    def test_wrong_bucket_duplicate_original_and_changed_source_body_refused(self):
        for field, value in [('className', 'SS 1'), ('termLabel', '3rd Term'),
                             ('subjectName', 'French'), ('sourceReference', 'Changed body'),
                             ('filePath', 'SUP-TEST-A.json'), ('orderIndex', True)]:
            with self.subTest(field=field):
                self.inputs, self.auth = fixture()
                rows = json.loads(self.inputs['original_rows_json'])
                rows[0][field] = value
                self.inputs['original_rows_json'] = converter.encoded(rows)
                resign(self.inputs, self.auth)
                with self.assertRaises(converter.ConversionError):
                    self.run_conversion()
        self.inputs, self.auth = fixture()
        rows = json.loads(self.inputs['original_rows_json'])
        rows.append(rows[0])
        self.inputs['original_rows_json'] = converter.encoded(rows)
        resign(self.inputs, self.auth)
        with self.assertRaisesRegex(converter.ConversionError, 'duplicate'):
            self.run_conversion()

    def test_duplicate_json_keys_are_not_silently_accepted(self):
        with self.assertRaisesRegex(converter.ConversionError, 'duplicate JSON key'):
            converter.json_bytes(b'{"x":1,"x":2}', 'input')

    def test_cli_new_bundle_only_and_refusal_creates_no_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            r2 = root / 'r2'
            r2.mkdir()
            paths = {
                'response_csv': root / 'response.csv', 'original_rows_json': root / 'originals.json',
                'proposal_csv': r2 / 'PLACEMENT_PROPOSAL_R2.csv',
                'response_template_csv': r2 / 'PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv',
                'supplements_json': root / 'backend/src/db/data/jss3Supplements.json',
                'relations_csv': r2 / 'R2_RELATION_DECISIONS.csv',
                'policy_md': root / 'docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md',
            }
            for key, path in paths.items():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(self.inputs[key])
            authorization = root / 'authorization.json'
            authorization.write_bytes(converter.encoded(self.auth))
            output = root / 'new-plan'
            args = ['--response', str(paths['response_csv']), '--authorization', str(authorization),
                    '--originals', str(paths['original_rows_json']), '--output', str(output)]
            with patch.object(converter, 'ROOT', root), patch.object(converter, 'R2', r2), \
                    contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(converter.main(args), 0)
                plan_bytes = (output / 'jss3SequencePlan.json').read_bytes()
                receipt = json.loads((output / 'conversion-receipt.json').read_bytes())
                self.assertEqual(receipt['plan_sha256'], converter.sha(plan_bytes))
                self.assertEqual(converter.main(args), 2)
                self.assertEqual((output / 'jss3SequencePlan.json').read_bytes(), plan_bytes)
                paths['response_csv'].write_bytes(b'invalid')
                refused = root / 'refused'
                self.assertEqual(converter.main(args[:-1] + [str(refused)]), 2)
                self.assertFalse(refused.exists())


if __name__ == '__main__':
    unittest.main()
