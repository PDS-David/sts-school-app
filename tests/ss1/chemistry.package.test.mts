// Drafted only. Owner has deferred execution until the later authorised verification stage.
// Do NOT run this file as part of source indexing or implementation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/chemistry.json', import.meta.url), 'utf8'));
const manifestText = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');

// The assigned chemistry rows contain no quoted commas; preserve the exact member path and hash fields.
const manifestRows = manifestText.trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const chemistryAssignments = manifestRows.filter(row => row[5] === 'chemistry');

test('Chemistry package parses and registers exactly the four assigned source documents', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'chemistry');
  assert.equal(p.canonical_subject, 'Chemistry');
  assert.equal(p.sources.length, 4);
  assert.equal(chemistryAssignments.length, 4);

  const sourceIds = new Set<string>();
  const members = new Set<string>();
  for (const source of p.sources) {
    assert(!sourceIds.has(source.source_id), `duplicate source id: ${source.source_id}`);
    assert(!members.has(source.archive_member), `duplicate archive member: ${source.archive_member}`);
    sourceIds.add(source.source_id);
    members.add(source.archive_member);

    const assigned = chemistryAssignments.filter(row => row[0] === source.source_id);
    assert.equal(assigned.length, 1, `expected one manifest assignment for ${source.source_id}`);
    assert.equal(source.archive_member, assigned[0][1]);
    assert.equal(source.sha256, assigned[0][2]);
    assert.equal(source.class_name, 'SS 1');
    assert.equal(source.term, assigned[0][4]);
    assert.equal(assigned[0][5], p.subject_slug);
  }
  assert.deepEqual([...p.sources].map(s => s.term).sort(), ['1st Term', '1st Term', '2nd Term', '3rd Term']);
  assert.equal(sourceIds.has('SS1-SRC-58b4a44c3afa'), true);
  assert.equal(sourceIds.has('SS1-SRC-84df18289b7a'), true);
});

test('The two first-term Chemistry originals remain separate and are not marked as duplicates', () => {
  const p = packageSchema.parse(raw);
  const firstTerm = p.sources.filter(s => s.term === '1st Term');
  assert.equal(firstTerm.length, 2);
  assert.notEqual(firstTerm[0].sha256, firstTerm[1].sha256);
  assert.notEqual(firstTerm[0].archive_member, firstTerm[1].archive_member);
  assert(!p.source_rules.some(rule => rule.op === 'exclude_duplicate'));
});

test('Source aliases preserve exact observed anchors and remain explicitly owner-pending', () => {
  const p = packageSchema.parse(raw);
  const aliasRules = p.source_rules.filter(rule => rule.op === 'source_alias');
  assert.equal(aliasRules.length, 4);
  for (const rule of p.source_rules) {
    if (rule.op !== 'source_alias') continue;
    const source = p.sources.find(s => s.source_id === rule.source_id);
    assert(source);
    assert.equal(rule.source_sha256, source.sha256);
    assert.equal(rule.anchor, source.header_text);
    assert.equal(rule.observed_subject, source.header_text);
    assert.equal(rule.canonical_subject, p.canonical_subject);
    assert.match(rule.approval_reference, /^PENDING-OWNER:/);
    assert.doesNotMatch(rule.approval_reference, /approved|verified|signed off/i);
  }
});

test('All current coverage and lesson references resolve within the package', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(s => s.source_id));
  const lessonIds = new Set(p.lessons.map(l => l.id));
  for (const coverage of p.coverage) {
    assert(sourceIds.has(coverage.source_id), `unknown coverage source: ${coverage.id}`);
    for (const lessonId of coverage.lesson_ids) assert(lessonIds.has(lessonId), `unknown lesson: ${lessonId}`);
  }
  assert.equal(p.lessons.length, 0);
  assert.equal(p.assets.length, 0);
  assert.equal(p.delivery_corrections.length, 0);
  assert.equal(p.package_status, 'PENDING');
  assert(p.open_items.some(item => item.blocks_delivery));
});

test('No lesson or asset state fabricates content approval or verification', () => {
  const p = packageSchema.parse(raw);
  for (const item of [...p.lessons, ...p.assets]) {
    assert.equal(item.state.content_approval, 'PENDING');
    assert.equal(item.state.approval_reference, null);
    assert.equal(item.state.verification, 'DEFERRED');
    assert.equal(item.state.verification_reference, null);
  }
  for (const rule of p.source_rules) {
    if (rule.op === 'source_alias') assert.match(rule.approval_reference, /^PENDING-OWNER:/);
  }
});

test('Rule guards reject wrong-source hashes, repeated anchors and missing anchors', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-chemistry-source.docx',
      text: rule.anchor,
    };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent from source' }, [rule]), /missing/);
  }
});

// Full-source compiler/parser parity, database integration, and device/release checks are separate.
// These tests are drafted only; execution remains deferred by the owner.
