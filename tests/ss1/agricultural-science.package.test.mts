// Deferred by owner. Write now; run only during the later authorised verification stage:
// node --import tsx --test tests/ss1/agricultural-science.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/agricultural-science.json', import.meta.url), 'utf8'));
const manifestText = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');

// Small CSV reader for this plain-text manifest, including quoted commas and escaped quotes.
function parseCsv(value: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quoted) {
      if (char === '"' && value[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field.length === 0) quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') {
      row.push(field);
      if (row.some(cell => cell.length > 0)) rows.push(row);
      row = []; field = '';
    } else if (char !== '\r') field += char;
  }
  assert.equal(quoted, false, 'manifest CSV must not end inside a quoted field');
  if (row.length || field.length) { row.push(field); if (row.some(cell => cell.length > 0)) rows.push(row); }
  return rows;
}

const manifestRows = parseCsv(manifestText);
const manifestHeader = manifestRows[0] ?? [];
const manifest = manifestRows.slice(1).map(cells =>
  Object.fromEntries(manifestHeader.map((key, index) => [key, cells[index] ?? '']))
);
const assigned = manifest.filter(row => row.assigned_subject_slug === 'agricultural-science');

test('Agricultural Science package follows the frozen SS1 schema and registers all assigned terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'agricultural-science');
  assert.equal(p.canonical_subject, 'Agricultural Science');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert.equal(p.sources.length, assigned.length, 'exactly one registered source per assigned manifest document');
  assert.equal(new Set(p.sources.map(source => source.source_id)).size, p.sources.length);
  assert.equal(new Set(p.sources.map(source => source.archive_member)).size, p.sources.length);
});

test('Every registered source identity, SHA-256 and archive member matches SOURCE_ASSIGNMENTS.csv', () => {
  const p = packageSchema.parse(raw);
  assert.deepEqual(
    p.sources.map(source => ({
      source_id: source.source_id,
      sha256: source.sha256,
      archive_member: source.archive_member,
      term: source.term,
      class_name: source.class_name,
      canonical_subject: source.canonical_subject,
    })).sort((a, b) => a.source_id.localeCompare(b.source_id)),
    assigned.map(row => ({
      source_id: row.source_id,
      sha256: row.sha256,
      archive_member: row.archive_member,
      term: row.term_from_folder,
      class_name: 'SS 1',
      canonical_subject: 'Agricultural Science',
    })).sort((a, b) => a.source_id.localeCompare(b.source_id)),
  );
  for (const row of assigned) {
    assert.match(row.sha256, /^[a-f0-9]{64}$/);
    assert(row.archive_member.length > 0);
    assert(['1st Term', '2nd Term', '3rd Term'].includes(row.term_from_folder));
  }
});

test('Source rules bind registered source hashes and pending aliases remain visibly blocked', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const source = p.sources.find(candidate => candidate.source_id === rule.source_id);
    assert(source, `rule ${rule.id} must reference a registered source`);
    assert.equal(rule.source_sha256, source.sha256, `rule ${rule.id} must bind the registered source hash`);
    assert(rule.anchor.trim().length > 0);
    if (rule.op === 'source_alias') {
      assert.match(rule.approval_reference, /^PENDING-OWNER:/, 'a source-heading alias must not invent owner approval');
      const pendingOwnerAction = p.open_items.find(item =>
        item.kind === 'OWNER_ACTION' &&
        item.blocks_delivery &&
        item.affected_ids.includes(rule.id) &&
        item.affected_ids.includes(rule.source_id)
      );
      assert(pendingOwnerAction, `alias ${rule.id} needs a blocking owner-approval item`);
    }
  }
});

test('No lesson claims unreferenced approval or completed verification', () => {
  const p = packageSchema.parse(raw);
  for (const lesson of p.lessons) {
    assert.equal(lesson.state.content_approval === 'APPROVED', Boolean(lesson.state.approval_reference));
    assert.equal(lesson.state.verification === 'VERIFIED', Boolean(lesson.state.verification_reference));
    assert.equal(hash(lesson.body), lesson.body_sha256, `lesson body hash ${lesson.id}`);
    assert.equal(lesson.subject, p.canonical_subject);
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0 && lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert(question.answer.trim().length > 0, `complete answer required: ${lesson.id}/${question.id}`);
      assert.equal(question.marks, question.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
      assert(question.marking.every(criterion => criterion.criterion.trim() && criterion.marks > 0));
    }
  }
});

test('Agricultural Science source-rule guards reject wrong hashes and missing or ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const input = { source_id: rule.source_id, sha256: rule.source_sha256, filePath: 'synthetic-scope-probe.docx', text: rule.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});

// Full-source compiler/parser comparison, asset validation, corrections and learner delivery
// are separate integration checks for the later authorised verification stage. This file is
// intentionally written but NOT RUN under the owner's testing deferral.
