// Automated Geography package regression suite.
// Task boundary: authoring only. This file has NOT been run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(
  readFileSync(new URL('../../backend/src/db/ss1/subjects/geography.json', import.meta.url), 'utf8'),
);
const manifestText = readFileSync(
  new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url),
  'utf8',
);
const manifestRows = manifestText.trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const assignedRows = manifestRows.filter(row => row[5] === 'geography');

test('Geography package follows the frozen schema and retains its three source terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'geography');
  assert.equal(p.canonical_subject, 'Geography');
  assert.equal(p.package_status, 'PENDING');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert(p.sources.every(source => source.class_name === 'SS 1'));
  assert.equal(p.sources.length, 3);
});

test('Every package source matches exactly one manifest assignment by ID, member, hash and term', () => {
  const p = packageSchema.parse(raw);
  assert.equal(assignedRows.length, 3, 'manifest must contain exactly three Geography sources');
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
    assert.equal(row[5], 'geography', source.source_id);
  }
});

test('Pending Geography package does not fabricate lessons, corrections, assets or approval', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  assert.equal(p.lessons.length, 0);
  assert.equal(p.delivery_corrections.length, 0);
  assert.equal(p.assets.length, 0);
  assert(p.sources.every(source => source.canonical_subject === 'Geography'));
  assert.equal(p.source_rules.length, 3);
  assert(p.source_rules.every(rule => rule.op === 'source_alias'));
  assert(p.source_rules.every(rule => /PENDING-OWNER/.test(rule.approval_reference)));
  assert(p.source_rules.every(rule => p.sources.some(source =>
    source.source_id === rule.source_id && source.sha256 === rule.source_sha256
  )));
  for (const id of [
    'GEOGRAPHY-ALIAS-APPROVAL',
    'GEOGRAPHY-T2-ALIAS-APPROVAL',
    'GEOGRAPHY-T3-ALIAS-APPROVAL',
  ]) {
    const gate = p.open_items.find(item => item.id === id);
    assert(gate, `missing owner approval gate ${id}`);
    assert.equal(gate.kind, 'OWNER_ACTION');
    assert.equal(gate.blocks_delivery, true);
  }
});

test('Geography source-alias guards reject wrong hashes, ambiguous anchors and missing anchors', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-geography-scope-probe.doc',
      text: rule.anchor,
    };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});

test('Current Geography coverage remains supported/partial/unresolved and has no lesson targets', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));
  const lessonIds = new Set(p.lessons.map(lesson => lesson.id));
  const sourceBodyTarget = (id: string) => [...sourceIds].some(sourceId => id.startsWith(sourceId + ':BODY:'));
  assert.equal(p.coverage.length, 7);
  assert.deepEqual(
    p.coverage.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] ?? 0) + 1;
      return counts;
    }, {} as Record<string, number>),
    { SUPPORTED: 3, PARTIAL: 2, UNRESOLVED: 2 },
  );
  for (const entry of p.coverage) {
    assert(sourceIds.has(entry.source_id), `unknown source in ${entry.id}`);
    assert(entry.evidence.length > 0, `missing source evidence in ${entry.id}`);
    for (const id of entry.lesson_ids) assert(lessonIds.has(id) || ruleIds.has(id) || sourceBodyTarget(id), `unresolved target ${entry.id} -> ${id}`);
    if (entry.status === 'SUPPORTED') assert(entry.lesson_ids.some(sourceBodyTarget), `supported source coverage has no parsed source-body target: ${entry.id}`);
  }
  assert(p.open_items.some(item => item.id === 'GEOGRAPHY-T1-W01-STATE-CAPITALS-SCOPE' && item.blocks_delivery));
});
