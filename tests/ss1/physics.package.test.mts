// Physics SS1 package regression checks.
// Authoring/structural checks only until the owner-authorised verification stage.
// Run with: node --import tsx --test tests/ss1/physics.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/physics.json', import.meta.url), 'utf8'));
const manifestText = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');
const queue = JSON.parse(readFileSync(new URL('../../docs/ss1/work/microtasks/physics/QUEUE.json', import.meta.url), 'utf8'));
const sha256 = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex');

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows;
}
const csv = parseCsv(manifestText);
const header = csv[0];
const column = Object.fromEntries(header.map((name, i) => [name, i]));
const assigned = csv.slice(1).filter(row => row[column.assigned_subject_slug] === 'physics');
const pkg = packageSchema.parse(raw);

test('Physics package identity and source registration match the SS1 assignment manifest', () => {
  assert.equal(pkg.schema_version, 'ss1-subject-v1');
  assert.equal(pkg.subject_slug, 'physics');
  assert.equal(pkg.canonical_subject, 'Physics');
  assert.equal(pkg.package_status, 'PENDING');
  assert.equal(assigned.length, 3);
  assert.equal(pkg.sources.length, assigned.length);
  assert.deepEqual(pkg.sources.map(s => s.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  const sourceIds = new Set<string>();
  const members = new Set<string>();
  for (const source of pkg.sources) {
    assert(!sourceIds.has(source.source_id), `duplicate source id ${source.source_id}`);
    assert(!members.has(source.archive_member), `duplicate source member ${source.archive_member}`);
    sourceIds.add(source.source_id); members.add(source.archive_member);
    const row = assigned.find(candidate => candidate[column.source_id] === source.source_id);
    assert(row, `unassigned source ${source.source_id}`);
    assert.equal(source.archive_member, row[column.archive_member]);
    assert.equal(source.sha256, row[column.sha256]);
    assert.equal(source.term, row[column.term_from_folder]);
    assert.equal(source.canonical_subject, 'Physics');
    assert.equal(source.class_name, 'SS 1');
  }
});

test('Every Physics source has explicit coverage and every coverage source is registered', () => {
  const sourceIds = new Set(pkg.sources.map(s => s.source_id));
  assert(pkg.coverage.length > 0);
  for (const source of pkg.sources) assert(pkg.coverage.some(c => c.source_id === source.source_id), source.source_id);
  for (const coverage of pkg.coverage) {
    assert(sourceIds.has(coverage.source_id), `unregistered source on ${coverage.id}`);
    assert(coverage.objective.trim().length > 0, coverage.id);
    assert(coverage.objective_locator.trim().length > 0, coverage.id);
    assert(coverage.evidence.length > 0, coverage.id);
  }
});

test('Every authored Physics lesson has a matching UTF-8 hash, objectives and complete marked practice', () => {
  assert(pkg.lessons.length > 0);
  const ids = new Set<string>();
  for (const lesson of pkg.lessons) {
    assert(!ids.has(lesson.id), `duplicate lesson ${lesson.id}`); ids.add(lesson.id);
    assert(lesson.id.startsWith('SUP-SS1-PHYSICS-'), lesson.id);
    assert.equal(lesson.class_name, 'SS 1');
    assert.equal(lesson.subject, 'Physics');
    assert(lesson.objectives.length > 0, lesson.id);
    assert(lesson.body.trim().length > 0, lesson.id);
    assert.equal(sha256(lesson.body), lesson.body_sha256, lesson.id);
    assert(lesson.practice.length > 0, lesson.id);
    assert(lesson.provenance.length > 0, lesson.id);
    for (const q of lesson.practice) {
      assert(q.question.trim().length > 0, `${lesson.id}/${q.id} question`);
      assert(q.answer.trim().length > 0, `${lesson.id}/${q.id} answer`);
      assert(q.marking.length > 0, `${lesson.id}/${q.id} marking`);
      assert(q.marking.every(m => m.criterion.trim().length > 0 && m.marks > 0), `${lesson.id}/${q.id} criteria`);
      assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0), `${lesson.id}/${q.id} total`);
    }
    assert.equal(lesson.state.content_approval, 'PENDING', lesson.id);
    assert.equal(lesson.state.approval_reference, null, lesson.id);
    assert.equal(lesson.state.verification, 'DEFERRED', lesson.id);
    assert.equal(lesson.state.verification_reference, null, lesson.id);
  }
});

test('Coverage targets resolve to a lesson or an explicit source rule', () => {
  const lessonIds = new Set(pkg.lessons.map(l => l.id));
  const ruleIds = new Set(pkg.source_rules.map(r => r.id));
  const sourceIds = new Set(pkg.sources.map(s => s.source_id));
  for (const coverage of pkg.coverage) {
    for (const target of coverage.lesson_ids) {
      const bodyRef = /^(SS1-SRC-[0-9a-f]{12}):BODY:([0-9a-f]{64})$/.exec(target);
      assert(lessonIds.has(target) || ruleIds.has(target) || (!!bodyRef && sourceIds.has(bodyRef[1])), `${coverage.id} -> ${target}`);
    }
  }
});

test('Source rules are bound to their registered source and reject ambiguous or missing anchors', () => {
  for (const rule of pkg.source_rules) {
    const source = pkg.sources.find(s => s.source_id === rule.source_id);
    assert(source, `missing source for rule ${rule.id}`);
    assert.equal(rule.source_sha256, source.sha256, rule.id);
    assert(rule.anchor.trim().length > 0, rule.id);
    const input = { source_id: rule.source_id, sha256: source.sha256, filePath: source.archive_member, text: rule.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent from source' }, [rule]), /missing/);
  }
});

test('Delivery corrections, assets and open-item references remain internally consistent', () => {
  const sourceIds = new Set(pkg.sources.map(s => s.source_id));
  const lessonIds = new Set(pkg.lessons.map(l => l.id));
  for (const correction of pkg.delivery_corrections) {
    const source = pkg.sources.find(s => s.source_id === correction.source_id);
    const replacement = pkg.lessons.find(l => l.id === correction.replacement_id);
    assert(source && replacement, correction.id);
    assert.equal(correction.source_sha256, source.sha256, correction.id);
    assert.equal(replacement.term, source.term, correction.id);
  }
  const assetIds = new Set<string>();
  for (const asset of pkg.assets) {
    assert(!assetIds.has(asset.id), `duplicate asset ${asset.id}`); assetIds.add(asset.id);
    assert(lessonIds.has(asset.lesson_id), asset.id);
    assert(asset.path.startsWith('backend/src/db/ss1/assets/physics/') && !asset.path.includes('..'), asset.id);
  }
  const queueIds = new Set(queue.items.map((item: any) => item.id));
  const known = new Set([...sourceIds, ...lessonIds, ...pkg.coverage.map(c => c.id), ...pkg.source_rules.map(r => r.id), ...pkg.open_items.map(o => o.id), ...assetIds, ...queueIds]);
  for (const item of pkg.open_items) for (const ref of item.affected_ids) {
    const sourceBody = /^SS1-SRC-[0-9a-f]{12}(?::|$)/.test(ref);
    assert(known.has(ref) || sourceBody, `${item.id} -> unresolved ${ref}`);
  }
});

test('Physics queue IDs, dependencies, status vocabulary and status counts are consistent', () => {
  const byId = new Map(queue.items.map((item: any) => [item.id, item]));
  assert.equal(byId.size, queue.items.length, 'duplicate queue item IDs');
  for (const item of queue.items) {
    assert(queue.status_vocabulary.includes(item.status), `${item.id}: invalid status ${item.status}`);
    for (const dep of item.depends_on ?? []) assert(byId.has(dep), `${item.id}: missing dependency ${dep}`);
  }
  const counts = queue.items.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1; return acc;
  }, {});
  assert.deepEqual(counts, queue.status_counts);

});

// Source-dependent compiler parity and runtime delivery checks are separate acceptance stages.
