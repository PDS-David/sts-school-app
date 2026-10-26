"""Deferred verification: synthetic fixtures only, no private sources or DB."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


checker = load('sequence_readiness', ROOT / 'scripts/jss3/check_sequence_readiness.py')
fixtures = load('converter_fixtures', ROOT / 'tests/test_jss3_placement_converter.py')
converter = checker.converter


class SequenceReadinessTests(unittest.TestCase):
    def setUp(self):
        self.inputs, self.auth = fixtures.fixture()
        self.bundle()

    def bundle(self):
        self.auth_bytes = converter.encoded(self.auth)
        plan, receipt = converter.convert(self.inputs, self.auth_bytes)
        self.plan = converter.encoded(plan)
        receipt['plan_sha256'] = converter.sha(self.plan)
        self.receipt = converter.encoded(receipt)

    def check(self, school='test-school'):
        return checker.assess(self.inputs, self.auth_bytes, self.plan, self.receipt, school)

    def test_consistency_is_not_activation_authority(self):
        r = self.check()
        self.assertEqual(r['status'], 'CONSISTENT_FOR_OPERATOR_REVIEW')
        self.assertTrue(r['ready_for_operator_review'])
        self.assertFalse(r['ready_for_activation'])
        self.assertFalse(r['database_actions'])
        self.assertEqual(r['pending_supplement_ids'], ['SUP-TEST-B'])
        self.assertEqual(r['counts']['APPROVED'], 1)
        self.assertFalse(r['expected_term_pin_enforced'])
        self.assertEqual(r['plan_sha256'], converter.sha(self.plan))
        self.assertTrue(all(x['status'] == 'NOT_CHECKED_OFFLINE' for x in r['remaining_activation_requirements']))
        self.assertEqual(r, self.check())

    def test_tampered_plan_with_recomputed_receipt_hash_refused(self):
        plan = json.loads(self.plan)
        plan['placements'][0]['after_original_order_index'] = 2
        self.plan = converter.encoded(plan)
        receipt = json.loads(self.receipt)
        receipt['plan_sha256'] = converter.sha(self.plan)
        self.receipt = converter.encoded(receipt)
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_receipt_count_pin_status_edits_refused(self):
        original = self.receipt
        for field, value in [('counts', {'APPROVED': 99}), ('term_pin_enforced', True), ('status', 'ACTIVATED')]:
            with self.subTest(field=field):
                receipt = json.loads(original)
                receipt[field] = value
                self.receipt = converter.encoded(receipt)
                self.assertEqual(self.check()['status'], 'BLOCKED')
        self.receipt = original

    def test_every_stale_reviewed_input_refused(self):
        for key in converter.INPUT_NAMES:
            with self.subTest(key=key):
                original = self.inputs[key]
                self.inputs[key] += b'\n'
                self.assertEqual(self.check()['status'], 'BLOCKED')
                self.inputs[key] = original

    def test_wrong_school_and_duplicate_keys_refused(self):
        for school in ['other-school', '', ' test-school ']:
            self.assertEqual(self.check(school)['status'], 'BLOCKED')
        self.plan = b'{"placements":[],"placements":[]}'
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_reformatted_plan_refused(self):
        self.plan += b'\n'
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_changed_authorization_refused(self):
        self.auth['term_pin_enforced'] = True
        self.auth_bytes = converter.encoded(self.auth)
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_all_pending_is_inert(self):
        fixtures.edit_response(self.inputs, self.auth, decision='PENDING')
        self.bundle()
        r = self.check()
        self.assertEqual(r['status'], 'NO_APPROVED_PLACEMENTS')
        self.assertFalse(r['ready_for_operator_review'])
        self.assertFalse(r['ready_for_activation'])

    def test_cli_report_only_no_overwrite_and_missing_inputs(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            r2 = root / 'docs/jss3/completion/R2_SEQUENCING'
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
            auth_path = root / 'authorization.json'
            auth_path.write_bytes(self.auth_bytes)
            bundle = root / 'bundle'
            bundle.mkdir()
            plan_path = bundle / 'jss3SequencePlan.json'
            plan_path.write_bytes(self.plan)
            (bundle / 'conversion-receipt.json').write_bytes(self.receipt)
            args = ['--response', str(paths['response_csv']), '--authorization', str(auth_path),
                    '--originals', str(paths['original_rows_json']), '--bundle', str(bundle),
                    '--school-code', 'test-school']
            with patch.object(checker, 'ROOT', root), contextlib.redirect_stdout(io.StringIO()), \
                    contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(checker.main(args + ['--output', str(root / 'report.json')]), 0)
                self.assertFalse(json.loads((root / 'report.json').read_text())['ready_for_activation'])
                self.assertEqual(checker.main(args + ['--output', str(plan_path)]), 2)
                self.assertEqual(plan_path.read_bytes(), self.plan)
                paths['response_csv'].unlink()
                auth_path.unlink()
                self.assertEqual(checker.main(args + ['--output', str(root / 'blocked.json')]), 2)
                self.assertEqual(len(json.loads((root / 'blocked.json').read_text())['blocking_findings']), 2)


if __name__ == '__main__':
    unittest.main()
