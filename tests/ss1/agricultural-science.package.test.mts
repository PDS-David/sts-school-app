// Subject-specific CI guard. This checks package structure and the real source parser/compiler identities.
// It does not certify teacher approval, learner-route delivery, database import or release readiness.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules, compilePackages } from '../../backend/src/db/ss1/compiler.ts';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';

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

// This CI test executes the real parser/compiler in a source-only plan. Full learner-route delivery,
// database rehearsal, asset rendering, subject-expert approval and release verification remain separate.


test('Agricultural Science original row identities match the real Mammoth parser and SS1 compiler', async () => {
  const p = packageSchema.parse(raw);
  const archiveBytes = readFileSync(new URL('../../docs/ss1/sources/SSS1-original.zip', import.meta.url));
  const archive = await JSZip.loadAsync(archiveBytes);
  const inputs = [];

  for (const source of p.sources) {
    const member = archive.file(source.archive_member);
    assert(member, `archive member missing: ${source.archive_member}`);
    const bytes = await member.async('nodebuffer');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256, `source bytes changed: ${source.source_id}`);
    const extracted = await mammoth.extractRawText({ buffer: bytes });
    inputs.push({
      source_id: source.source_id,
      sha256: source.sha256,
      filePath: source.archive_member,
      text: extracted.value,
    });
  }

  const plan = compilePackages([p], inputs, parseTopics);
  const identified = new Map(plan.identified_rows.map(row => [row.id, row]));

  // These are the exact original week rows behind the outstanding correction reviews.
  // They are intentionally asserted against the actual importer parser, not hand-entered hashes.
  const correctionSourceRows = [
    'SS1-SRC-7aa642b0085b:BODY:de6febf42e9195e6171f87f05840f7ac0d5a7337820ec98392670ebc3b1485aa',
    'SS1-SRC-956594d97094:BODY:1beb6d785bb09aa20fdffc82f7efaa1cdcdbd565c29d689f4575757ec6ea20e9',
    'SS1-SRC-956594d97094:BODY:12d2bff62a3b676cec1218abdde9a8f57a09e2057bd5f6d880e50cb0dee77886',
    'SS1-SRC-956594d97094:BODY:5e12e6d75046c73227b73e5a70eb56fd6a83ccbaf4d206b9dc3d4cc609e008f6',
    'SS1-SRC-956594d97094:BODY:d6a132c9ce637c6fee7ca4e1e88aa707220a68298bde2794d5657e49533c9e22',
    'SS1-SRC-956594d97094:BODY:1f941dd52a764e5665229f0caad9aa3a3bca2ecf1ffad1ac4f3810601bfa573b',
    'SS1-SRC-956594d97094:BODY:1d566e884981c34293a7c08a90ce5177dc063ea5813da9a7f27e69e09c5f77ee',
    'SS1-SRC-458a07f7ea5a:BODY:0c06c5383b974616b0e06a23a1165fe3beeeec8b89b232c0383f83a6d2e056ff',
    'SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b',
  ];
  for (const id of correctionSourceRows) {
    assert(identified.has(id), `actual parser/compiler did not reproduce correction source row ${id}`);
  }

  for (const correction of p.delivery_corrections) {
    assert(identified.has(correction.source_lesson_id), `correction source row is not compiler-identified: ${correction.id}`);
    assert(identified.has(correction.replacement_id), `correction replacement is not compiler-identified: ${correction.id}`);
  }

  for (const coverage of p.coverage) {
    for (const id of coverage.lesson_ids) {
      if (id.includes(':BODY:')) {
        assert(identified.has(id), `coverage references an unrecognized original source row: ${coverage.id} -> ${id}`);
      }
    }
  }
});
