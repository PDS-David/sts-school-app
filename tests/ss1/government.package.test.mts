// Automated Government package regression suite; write-only in this phase.
// Owner instruction: do not run tests, typechecks, importer checks or database/device checks yet.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/government.json', import.meta.url), 'utf8'));
const assignmentCsv = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');

// The assigned archive paths contain no commas, but this parser also handles quoted CSV fields.
function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') {
      value += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      fields.push(value);
      value = '';
    } else {
      value += ch;
    }
  }
  fields.push(value);
  return fields;
}

const csvLines = assignmentCsv.trim().split(/\r?\n/);
const csvHeader = parseCsvRow(csvLines[0]);
const csvRows = csvLines.slice(1).map(parseCsvRow);
const governmentAssignments = csvRows
  .filter(row => row[csvHeader.indexOf('assigned_subject_slug')] === 'government')
  .map(row => Object.fromEntries(csvHeader.map((key, index) => [key, row[index]])));

test('Government package follows the frozen schema and registers one source per assigned document', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'government');
  assert.equal(p.canonical_subject, 'Government');
  assert.deepEqual(p.sources.map(s => s.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert.equal(p.sources.length, governmentAssignments.length);
  assert.equal(new Set(p.sources.map(s => s.source_id)).size, p.sources.length);

  const assignments = new Map(governmentAssignments.map(row => [row.source_id, row]));
  for (const source of p.sources) {
    const assigned = assignments.get(source.source_id);
    assert(assigned, `unassigned source registered: ${source.source_id}`);
    assert.equal(source.archive_member, assigned.archive_member, source.source_id);
    assert.equal(source.sha256, assigned.sha256, source.source_id);
    assert.equal(source.term, assigned.term_from_folder, source.source_id);
    assert.equal(source.class_name, 'SS 1');
    assert.equal(source.canonical_subject, 'Government');
  }
  for (const assigned of governmentAssignments) {
    assert(p.sources.some(source => source.source_id === assigned.source_id), `missing assigned source ${assigned.source_id}`);
  }
});

test('Government source identities and aliases do not fabricate owner or teacher approval', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  assert.equal(p.lessons.length, 0);
  assert.equal(p.delivery_corrections.length, 0);
  assert.equal(p.assets.length, 0);

  const aliases = p.source_rules.filter(rule => rule.op === 'source_alias');
  assert.equal(aliases.length, 3);
  for (const alias of aliases) {
    const source = p.sources.find(source => source.source_id === alias.source_id);
    assert(source, `alias has no registered source: ${alias.id}`);
    assert.equal(alias.source_sha256, source.sha256);
    assert.match(alias.approval_reference, /^PENDING-OWNER:/);
    assert.doesNotMatch(alias.approval_reference, /teacher approval|approved|verified/i);
  }
});

test('Every current Government rule is source-bound and rejects wrong hashes or ambiguous/missing anchors', () => {
  const p = packageSchema.parse(raw);
  const sourceById = new Map(p.sources.map(source => [source.source_id, source]));
  const ruleIds = new Set<string>();

  for (const rule of p.source_rules) {
    assert(!ruleIds.has(rule.id), `duplicate source rule ${rule.id}`);
    ruleIds.add(rule.id);
    const source = sourceById.get(rule.source_id);
    assert(source, `rule references unknown source ${rule.id}`);
    assert.equal(rule.source_sha256, source.sha256, rule.id);

    const input = {
      source_id: source.source_id,
      sha256: source.sha256,
      filePath: source.archive_member,
      text: rule.anchor,
    };
    assert.throws(
      () => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]),
      /source mismatch/,
      rule.id,
    );
    assert.throws(
      () => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]),
      /ambiguous/,
      rule.id,
    );
    assert.throws(
      () => applyRules({ ...input, text: 'anchor absent' }, [rule]),
      /missing/,
      rule.id,
    );
  }
});

test('Scheme-only revision/examination markers point to explicit SCHEME_ONLY rules', () => {
  const p = packageSchema.parse(raw);
  const markerRules = p.source_rules.filter(rule => rule.op === 'classify_marker');
  const markerCoverage = p.coverage.filter(entry => entry.status === 'MARKER');
  assert.equal(markerRules.length, 3);
  assert.equal(markerCoverage.length, 3);

  for (const marker of markerCoverage) {
    assert.equal(marker.lesson_ids.length, 1, marker.id);
    const rule = markerRules.find(candidate => candidate.id === marker.lesson_ids[0]);
    assert(rule, `marker target is not a registered rule: ${marker.id}`);
    assert.equal(rule.kind, 'SCHEME_ONLY', marker.id);
    assert.equal(rule.source_id, marker.source_id, marker.id);
  }
});

test('Government coverage references resolve to a source, rule, original-body identity or authored lesson', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const lessonIds = new Set(p.lessons.map(lesson => lesson.id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));

  for (const entry of p.coverage) {
    assert(sourceIds.has(entry.source_id), `unknown source in ${entry.id}`);
    assert(entry.evidence.length > 0, `missing evidence in ${entry.id}`);
    for (const id of entry.lesson_ids) {
      assert(
        lessonIds.has(id) || ruleIds.has(id) || [...sourceIds].some(sourceId => id.startsWith(sourceId + ':BODY:')),
        `unresolved coverage target ${entry.id} -> ${id}`,
      );
    }
    if (entry.status === 'MARKER') {
      assert(entry.lesson_ids.every(id => ruleIds.has(id)), `marker without source-rule target: ${entry.id}`);
    }
    if (entry.status === 'IMPLEMENTED_EQUIVALENT') {
      assert(entry.lesson_ids.some(id => lessonIds.has(id)), `equivalent without an authored lesson: ${entry.id}`);
    }
  }
});

// Lesson-body hashes, answer/mark totals, correction bindings and asset guards are
// added by the later lesson/correction/asset tasks as those records enter this package.
// Test execution remains deferred by the owner.
