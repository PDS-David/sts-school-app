// Automated Civic Education package regression suite.
// Task boundary: authoring only. This file has NOT been run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(
  readFileSync(new URL('../../backend/src/db/ss1/subjects/civic-education.json', import.meta.url), 'utf8'),
);
const manifestText = readFileSync(
  new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url),
  'utf8',
);
const manifestRows = manifestText.trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const assignedRows = manifestRows.filter(row => row[5] === 'civic-education');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

test('Civic Education package follows the frozen schema and retains its three source terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'civic-education');
  assert.equal(p.canonical_subject, 'Civic Education');
  assert.equal(p.package_status, 'PENDING');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert(p.sources.every(source => source.class_name === 'SS 1'));
  assert.equal(p.sources.length, 3);
});

test('Every package source matches exactly one manifest assignment by ID, member, hash and term', () => {
  const p = packageSchema.parse(raw);
  assert.equal(assignedRows.length, 3, 'manifest must contain exactly three Civic Education sources');
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
    assert.equal(row[5], 'civic-education', source.source_id);
  }
});

test('Every Civic Education lesson has a valid body hash, complete marking and separate approval/verification state', () => {
  const p = packageSchema.parse(raw);
  assert.deepEqual(
    p.lessons.map(lesson => lesson.id).sort(),
    [
      'SUP-SS1-CIVIC-EDUCATION-T1-W01-MEANING',
      'SUP-SS1-CIVIC-EDUCATION-T1-W02-VALUES-TYPES',
    ].sort(),
  );
  for (const lesson of p.lessons) {
    assert.equal(hash(lesson.body), lesson.body_sha256, lesson.id);
    assert.equal(lesson.subject, 'Civic Education');
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0, lesson.id);
    assert(lesson.practice.length > 0, lesson.id);
    for (const question of lesson.practice) {
      assert(question.answer.trim().length > 0, question.id);
      assert.equal(question.marks, question.marking.reduce((sum, mark) => sum + mark.marks, 0), question.id);
      assert(question.marking.every(mark => mark.criterion.trim() && mark.marks > 0), question.id);
    }
    assert.equal(lesson.state.content_approval, 'PENDING', lesson.id);
    assert.equal(lesson.state.approval_reference, null, lesson.id);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED', lesson.id);
    assert.equal(lesson.state.verification, 'DEFERRED', lesson.id);
    assert.equal(lesson.state.verification_reference, null, lesson.id);
  }
  assert.equal(p.package_status, 'PENDING');
});

test('T1 Week 2 values supplement covers only the five body-listed values and keys the four-value assignment', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-CIVIC-EDUCATION-T1-W02-VALUES-TYPES');
  assert(lesson);
  for (const value of ['HARD WORK', 'DISCIPLINE', 'LOVE', 'CONTENTMENT', 'INTEGRITY']) {
    assert(lesson.body.includes(value), `missing lesson section: ${value}`);
  }
  assert.equal(lesson.practice.length, 4);
  const discussion = lesson.practice.find(question => question.id === 'C1W2-Q4');
  assert(discussion);
  assert.equal(discussion.marks, 16);
  assert.equal(discussion.marking.reduce((sum, mark) => sum + mark.marks, 0), 16);
  assert(lesson.body.includes('recorded as scheme-only'));
  const valuesCoverage = p.coverage.find(entry => entry.id === 'COV-CIV-T1-W02-TYPES-UNDEFINED');
  const assignmentCoverage = p.coverage.find(entry => entry.id === 'COV-CIV-T1-W02-ASSIGNMENT');
  assert.equal(valuesCoverage?.status, 'IMPLEMENTED_EQUIVALENT');
  assert(valuesCoverage?.lesson_ids.includes(lesson.id));
  assert.equal(assignmentCoverage?.status, 'IMPLEMENTED_EQUIVALENT');
  assert(assignmentCoverage?.lesson_ids.includes(lesson.id));
  const remainingGaps = p.open_items.find(entry => entry.id === 'CIVIC-EDUCATION-T1-W02-VALUES-GAPS');
  assert(remainingGaps?.blocks_delivery);
  assert(remainingGaps?.affected_ids.includes('COV-CIV-T1-W02-SELFLESSNESS'));
  assert(remainingGaps?.affected_ids.includes('COV-CIV-T1-W02-JUSTICE'));
});

test('Civic Education source-alias guards reject wrong hashes, ambiguous anchors and missing anchors', () => {
  const p = packageSchema.parse(raw);
  const aliases = p.source_rules.filter(rule => rule.op === 'source_alias');
  assert.equal(aliases.length, 3);
  const schemeMarkers = p.source_rules.filter(rule => rule.op === 'classify_marker');
  assert.equal(schemeMarkers.length, 8);
  assert(schemeMarkers.every(rule => rule.kind === 'SCHEME_ONLY' && rule.match_mode === 'WHOLE_LINE'));
  const schemeCoverage = p.coverage.find(entry => entry.id === 'COV-CIV-T3-SCHEME-MARKERS');
  assert(schemeCoverage && schemeCoverage.status === 'MARKER');
  assert.deepEqual(new Set(schemeCoverage.lesson_ids), new Set(schemeMarkers.map(rule => rule.id)));
  assert.equal(p.source_rules.length, 11);
  for (const rule of aliases) {
    const source = p.sources.find(entry => entry.source_id === rule.source_id);
    assert(source, `unknown rule source ${rule.id}`);
    assert.equal(rule.source_sha256, source.sha256, rule.id);
    assert.match(rule.approval_reference, /PENDING-OWNER/);
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-civic-education-scope-probe.docx',
      text: rule.anchor,
    };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});

test('Current Civic Education coverage references resolve and retain their partial boundaries', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));
  const lessonIds = new Set(p.lessons.map(lesson => lesson.id));
  assert.equal(p.coverage.length, 8);
  assert.deepEqual(
    p.coverage.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] ?? 0) + 1;
      return counts;
    }, {} as Record<string, number>),
    { IMPLEMENTED_EQUIVALENT: 3, PARTIAL: 4, MARKER: 1 },
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
  assert(p.open_items.some(item => item.id === 'CIVIC-EDUCATION-ALIAS-APPROVAL' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'CIVIC-EDUCATION-ALIAS-APPROVAL-T2' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'CIVIC-EDUCATION-ALIAS-APPROVAL-T3' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'CIVIC-EDUCATION-T1-W01-MEANING-REFERENCE-REUSE' && item.blocks_delivery));
});

test('Civic Education scheme-only markers are source-bound and cannot become teaching weeks', () => {
  const p = packageSchema.parse(raw);
  const schemeMarkers = p.source_rules.filter(rule => rule.op === 'classify_marker');
  assert.equal(schemeMarkers.length, 8);
  for (const rule of schemeMarkers) {
    assert.equal(rule.kind, 'SCHEME_ONLY');
    assert.equal(rule.match_mode, 'WHOLE_LINE');
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-civic-scheme-marker-probe.docx',
      text: rule.anchor,
    };
    assert.equal(applyRules(input, [rule]), rule.anchor);
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});
