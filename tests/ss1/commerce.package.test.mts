// Automated Commerce package regression suite.
// Task boundary: authoring only. This file has NOT been run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(
  readFileSync(new URL('../../backend/src/db/ss1/subjects/commerce.json', import.meta.url), 'utf8'),
);
const manifestText = readFileSync(
  new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url),
  'utf8',
);
const manifestRows = manifestText.trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const assignedRows = manifestRows.filter(row => row[5] === 'commerce');

test('Commerce package follows the frozen schema and retains its three source terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'commerce');
  assert.equal(p.canonical_subject, 'Commerce');
  assert.equal(p.package_status, 'PENDING');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert(p.sources.every(source => source.class_name === 'SS 1'));
  assert.equal(p.sources.length, 3);
});

test('Every package source matches exactly one manifest assignment by ID, member, hash and term', () => {
  const p = packageSchema.parse(raw);
  assert.equal(assignedRows.length, 3, 'manifest must contain exactly three Commerce sources');
  const assignments = new Map(assignedRows.map(row => [row[0], row]));
  assert.equal(assignments.size, assignedRows.length, 'manifest source IDs must be unique');
  const packageIds = new Set(p.sources.map(source => source.source_id));
  assert.equal(packageIds.size, p.sources.length, 'package source IDs must be unique');
  assert.equal(packageIds.size, assignments.size, 'package and manifest source counts must match');

  for (const source of p.sources) {
    const row = assignments.get(source.source_id);
    assert(row, `unregistered source ID: ${source.source_id}`);
    assert.equal(source.archive_member, row[1], source.source_id);
    assert.equal(source.sha256, row[2], source.source_id);
    assert.equal(source.term, row[4], source.source_id);
    assert.equal(row[5], 'commerce', source.source_id);
  }
});

test('Pending Commerce package does not fabricate lessons, corrections, assets or approval', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  assert.equal(p.lessons.length, 0);
  assert.equal(p.delivery_corrections.length, 0);
  assert.equal(p.assets.length, 0);
  assert.equal(p.sources.every(source => source.canonical_subject === 'Commerce'), true);
  assert.equal(p.source_rules.length, 3);
  assert(p.source_rules.every(rule => rule.op === 'source_alias'));
  assert(p.source_rules.every(rule => /PENDING-OWNER/.test(rule.approval_reference)));
  assert(p.source_rules.every(rule => p.sources.some(source =>
    source.source_id === rule.source_id && source.sha256 === rule.source_sha256
  )));
  for (const id of [
    'COMMERCE-ALIAS-APPROVAL',
    'COMMERCE-ALIAS-APPROVAL-T2',
    'COMMERCE-ALIAS-APPROVAL-T3',
  ]) {
    const gate = p.open_items.find(item => item.id === id);
    assert(gate, `missing owner approval gate ${id}`);
    assert.equal(gate.kind, 'OWNER_ACTION');
    assert.equal(gate.blocks_delivery, true);
  }
});

test('Commerce source-alias guards reject wrong hashes, ambiguous anchors and missing anchors', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-commerce-scope-probe.docx',
      text: rule.anchor,
    };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});

test('Current Commerce coverage remains partial/unresolved and has no unresolved lesson targets', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  assert.equal(p.coverage.length, 27);
  assert.deepEqual(
    p.coverage.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] ?? 0) + 1;
      return counts;
    }, {} as Record<string, number>),
    { PARTIAL: 20, UNRESOLVED: 7 },
  );
  for (const entry of p.coverage) {
    assert(sourceIds.has(entry.source_id), `unknown source in ${entry.id}`);
    assert(entry.evidence.length > 0, `missing source evidence in ${entry.id}`);
    assert.equal(entry.lesson_ids.length, 0, `no lessons exist yet for ${entry.id}`);
  }
});
