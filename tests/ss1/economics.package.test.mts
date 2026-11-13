// Automated Economics package regression suite.
// Task boundary: authoring only. This file has NOT been run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(
  readFileSync(new URL('../../backend/src/db/ss1/subjects/economics.json', import.meta.url), 'utf8'),
);
const manifestText = readFileSync(
  new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url),
  'utf8',
);
const manifestRows = manifestText.trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const assignedRows = manifestRows.filter(row => row[5] === 'economics');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

test('Economics package follows the frozen schema and retains its three source terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'economics');
  assert.equal(p.canonical_subject, 'Economics');
  assert.equal(p.package_status, 'PENDING');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert(p.sources.every(source => source.class_name === 'SS 1'));
  assert.equal(p.sources.length, 3);
});

test('Every package source matches exactly one manifest assignment by ID, member, hash and term', () => {
  const p = packageSchema.parse(raw);
  assert.equal(assignedRows.length, 3, 'manifest must contain exactly three Economics sources');
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
    assert.equal(row[5], 'economics', source.source_id);
  }
});

test('The existing Economics lesson has exact body hash and complete marking totals without invented approval', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.lessons.length, 1);
  const lesson = p.lessons[0];
  assert.equal(lesson.id, 'SUP-SS1-ECONOMICS-T1-W01-WHY-STUDY');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.subject, 'Economics');
  assert.equal(lesson.class_name, 'SS 1');
  assert.equal(lesson.term, '1st Term');
  assert(lesson.objectives.length > 0);
  assert(lesson.practice.length > 0);
  for (const question of lesson.practice) {
    assert(question.answer.trim().length > 0);
    assert.equal(question.marks, question.marking.reduce((sum, mark) => sum + mark.marks, 0), question.id);
    assert(question.marking.every(mark => mark.criterion.trim() && mark.marks > 0), question.id);
  }
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.implementation, 'IMPLEMENTED');
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
});

test('Economics source-rule guards reject wrong hashes, ambiguous anchors and missing anchors', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.source_rules.length, 5);
  for (const rule of p.source_rules) {
    const source = p.sources.find(entry => entry.source_id === rule.source_id);
    assert(source, `unknown rule source ${rule.id}`);
    assert.equal(rule.source_sha256, source.sha256, rule.id);
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-economics-scope-probe.docx',
      text: rule.anchor,
    };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
  assert.equal(p.source_rules.filter(rule => rule.op === 'source_alias').length, 3);
  assert.equal(p.source_rules.filter(rule => rule.op === 'classify_marker').length, 2);
  assert(p.source_rules.filter(rule => rule.op === 'source_alias').every(rule =>
    /PENDING-OWNER/.test(rule.approval_reference)
  ));
  assert(p.source_rules.filter(rule => rule.op === 'classify_marker').every(rule => rule.kind === 'SCHEME_ONLY'));
});

test('Coverage references resolve and current status counts preserve partial work and scheme markers', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));
  const lessonIds = new Set(p.lessons.map(lesson => lesson.id));
  assert.equal(p.coverage.length, 35);
  assert.deepEqual(
    p.coverage.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] ?? 0) + 1;
      return counts;
    }, {} as Record<string, number>),
    { MARKER: 2, PARTIAL: 17, IMPLEMENTED_EQUIVALENT: 1, UNRESOLVED: 15 },
  );
  for (const entry of p.coverage) {
    assert(sourceIds.has(entry.source_id), `unknown source in ${entry.id}`);
    assert(entry.evidence.length > 0, `missing source evidence in ${entry.id}`);
    for (const id of entry.lesson_ids) {
      assert(lessonIds.has(id) || ruleIds.has(id), `unresolved coverage target ${entry.id} -> ${id}`);
    }
    if (entry.status === 'IMPLEMENTED_EQUIVALENT') {
      assert(entry.lesson_ids.some(id => lessonIds.has(id)), `equivalent without lesson: ${entry.id}`);
    }
  }
  assert(p.open_items.some(item => item.id === 'ECONOMICS-ALIAS-APPROVAL' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'ECONOMICS-ALIAS-APPROVAL-T2' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'ECONOMICS-ALIAS-APPROVAL-T3' && item.blocks_delivery));
});
