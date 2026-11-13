// Automated Food and Nutrition package regression suite.
// Task boundary: authoring only. This file has NOT been run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(
  readFileSync(new URL('../../backend/src/db/ss1/subjects/food-and-nutrition.json', import.meta.url), 'utf8'),
);
const manifestText = readFileSync(
  new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url),
  'utf8',
);
const manifestRows = manifestText.trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const assignedRows = manifestRows.filter(row => row[5] === 'food-and-nutrition');

test('Food and Nutrition package follows the frozen schema and retains its three assigned source terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'food-and-nutrition');
  assert.equal(p.canonical_subject, 'Food and Nutrition');
  assert.equal(p.package_status, 'PENDING');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert(p.sources.every(source => source.class_name === 'SS 1'));
  assert.equal(p.sources.length, 3);
});

test('Every package source matches exactly one manifest assignment by ID, member, hash and term', () => {
  const p = packageSchema.parse(raw);
  assert.equal(assignedRows.length, 3, 'manifest must contain exactly three Food and Nutrition sources');
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
    assert.equal(row[5], 'food-and-nutrition', source.source_id);
  }
});

test('Pending Food and Nutrition package does not fabricate lessons, corrections, assets or approval', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  assert.equal(p.lessons.length, 0);
  assert.equal(p.delivery_corrections.length, 0);
  assert.equal(p.assets.length, 0);
  assert(p.sources.every(source => source.canonical_subject === 'Food and Nutrition'));

  const aliases = p.source_rules.filter(rule => rule.op === 'source_alias');
  assert.equal(aliases.length, 2);
  assert(aliases.every(rule => /PENDING-OWNER/.test(rule.approval_reference)));
  assert(aliases.every(rule => p.sources.some(source =>
    source.source_id === rule.source_id && source.sha256 === rule.source_sha256
  )));

  for (const id of [
    'FOOD-AND-NUTRITION-ALIAS-APPROVAL',
    'FOOD-AND-NUTRITION-ALIAS-APPROVAL-3RD-TERM',
  ]) {
    const gate = p.open_items.find(item => item.id === id);
    assert(gate, `missing owner approval gate ${id}`);
    assert.equal(gate.kind, 'OWNER_ACTION');
    assert.equal(gate.blocks_delivery, true);
  }
});

test('Food and Nutrition source-rule guards reject wrong hashes, ambiguous anchors and missing anchors', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.source_rules.length, 3);
  for (const rule of p.source_rules) {
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-food-and-nutrition-scope-probe.docx',
      text: rule.anchor,
    };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
  const schemeOnly = p.source_rules.find(rule => rule.op === 'classify_marker');
  assert(schemeOnly);
  assert.equal(schemeOnly.kind, 'SCHEME_ONLY');
  assert.equal(schemeOnly.source_id, 'SS1-SRC-de2cdd0b85f6');
});

test('Current coverage remains explicitly partial/marker-only and all references resolve', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));
  assert.equal(p.coverage.length, 21);
  assert.deepEqual(
    p.coverage.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] ?? 0) + 1;
      return counts;
    }, {} as Record<string, number>),
    { PARTIAL: 19, UNRESOLVED: 1, MARKER: 1 },
  );
  for (const entry of p.coverage) {
    assert(sourceIds.has(entry.source_id), `unknown source in ${entry.id}`);
    assert(entry.evidence.length > 0, `missing source evidence in ${entry.id}`);
    for (const id of entry.lesson_ids) assert(ruleIds.has(id), `unexpected coverage target ${entry.id} -> ${id}`);
  }
  assert(p.open_items.some(item => item.id === 'FOOD-AND-NUTRITION-T1-W01-COVERAGE' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'FOOD-AND-NUTRITION-T1-W01-NUTRITION-CLAIMS' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'FOOD-AND-NUTRITION-T1-W01-THIN-TEACHING' && !item.blocks_delivery));
  assert(p.coverage.some(entry => entry.id === 'COV-FN-T1-W02-CAREER-OVERVIEW' && entry.status === 'PARTIAL'));
  assert.equal(p.coverage.filter(entry => entry.id.startsWith('COV-FN-T1-W02-CAREER-') && entry.id !== 'COV-FN-T1-W02-CAREER-OVERVIEW' && entry.status === 'PARTIAL').length, 12);
  assert(p.open_items.some(item => item.id === 'FOOD-AND-NUTRITION-T1-W02-CAREER-DESCRIPTIONS' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'FOOD-AND-NUTRITION-T1-W02-MISFILED-EVALUATION' && item.blocks_delivery));
});
