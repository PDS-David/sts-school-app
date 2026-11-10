// Deferred by owner. Run only during the later authorised verification stage:
// node --import tsx --test tests/ss1/biology.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/biology.json', import.meta.url), 'utf8'));
const assignmentsText = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

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

const assignmentRows = parseCsv(assignmentsText);
const assignmentHeader = assignmentRows[0];
const assignmentIndex = Object.fromEntries(assignmentHeader.map((name, index) => [name, index]));
const biologyAssignments = assignmentRows.slice(1).filter(row => row[assignmentIndex.assigned_subject_slug] === 'biology');

test('Biology package parses and identifies all three SS1 terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'biology');
  assert.equal(p.canonical_subject, 'Biology');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert(p.sources.every(source => source.class_name === 'SS 1'));
});

test('Every assigned Biology document has exactly one registered source with matching identity and hash', () => {
  const p = packageSchema.parse(raw);
  assert.equal(biologyAssignments.length, 3);
  assert.equal(p.sources.length, biologyAssignments.length);
  for (const row of biologyAssignments) {
    const sourceId = row[assignmentIndex.source_id];
    const source = p.sources.find(candidate => candidate.source_id === sourceId);
    assert(source, `missing registered source ${sourceId}`);
    assert.equal(source.archive_member, row[assignmentIndex.archive_member]);
    assert.equal(source.sha256, row[assignmentIndex.sha256]);
    assert.equal(source.term, row[assignmentIndex.term_from_folder]);
    assert.equal(source.canonical_subject, 'Biology');
  }
  for (const source of p.sources) {
    const row = biologyAssignments.find(candidate => candidate[assignmentIndex.source_id] === source.source_id);
    assert(row, `unassigned Biology source ${source.source_id}`);
    assert.equal(source.archive_member, row[assignmentIndex.archive_member]);
    assert.equal(source.sha256, row[assignmentIndex.sha256]);
  }
});

test('Any authored lesson has exact body hash, complete practice marking and evidence-backed state', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const lesson of p.lessons) {
    assert(!ids.has(lesson.id), `duplicate lesson ${lesson.id}`);
    ids.add(lesson.id);
    assert.equal(hash(lesson.body), lesson.body_sha256);
    assert.equal(lesson.subject, 'Biology');
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0 && lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert(question.answer.trim().length > 0);
      assert.equal(question.marks, question.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
      assert(question.marking.every(criterion => criterion.criterion.trim().length > 0 && criterion.marks > 0));
    }
    if (lesson.state.content_approval === 'PENDING') assert.equal(lesson.state.approval_reference, null);
    else assert(lesson.state.approval_reference?.trim());
    if (lesson.state.verification === 'DEFERRED') assert.equal(lesson.state.verification_reference, null);
    else assert(lesson.state.verification_reference?.trim());
  }
});

test('Any source rules reject mismatched hashes, missing anchors and ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const input = { source_id: rule.source_id, sha256: rule.source_sha256, filePath: 'synthetic-scope-probe.docx', text: rule.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});

test('Any delivery corrections bind to the registered source and a same-term replacement lesson', () => {
  const p = packageSchema.parse(raw);
  for (const correction of p.delivery_corrections) {
    const source = p.sources.find(candidate => candidate.source_id === correction.source_id);
    const replacement = p.lessons.find(lesson => lesson.id === correction.replacement_id);
    assert(source && replacement);
    assert.equal(correction.source_sha256, source.sha256);
    assert.equal(correction.source_lesson_id, `${correction.source_id}:BODY:${correction.body_sha256}`);
    assert.equal(replacement.term, source.term);
  }
});

// The full-source compiler/parser comparison is a separate integration check and remains deferred.
