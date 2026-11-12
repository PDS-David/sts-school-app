// Deferred by owner. Run only during the later authorised verification stage:
// node --import tsx --test tests/ss1/literature.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/literature.json', import.meta.url), 'utf8'));
const manifest = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const assignments = manifest.trim().split(/\r?\n/).slice(1).map(line => line.split(','));

test('Literature package follows the frozen schema and registers all three assigned SS1 terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'literature');
  assert.equal(p.canonical_subject, 'Literature-in-English');
  assert.equal(p.package_status, 'IMPLEMENTED');
  assert.equal(p.lessons.length, 27);
  for (const term of ['1st Term','2nd Term','3rd Term']) assert.equal(p.lessons.filter(l => l.term === term).length, 9);
  assert.deepEqual(p.sources.map(s => s.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  for (const s of p.sources) assert.equal(s.class_name, 'SS 1');
});

test('Each Literature source matches exactly one assigned document in SOURCE_ASSIGNMENTS.csv', () => {
  const p = packageSchema.parse(raw);
  const assigned = assignments.filter(row => row[5] === 'literature' && row[6] === 'A');
  assert.equal(assigned.length, 3);
  assert.equal(p.sources.length, assigned.length);
  const ids = new Set<string>();
  for (const s of p.sources) {
    assert(!ids.has(s.source_id)); ids.add(s.source_id);
    const rows = assigned.filter(row => row[0] === s.source_id);
    assert.equal(rows.length, 1, 'source must resolve to one assigned document');
    const row = rows[0];
    assert.equal(s.archive_member, row[1]);
    assert.equal(s.sha256, row[2]);
    assert.equal(s.term, row[4]);
    assert.equal(s.canonical_subject, 'Literature-in-English');
  }
});

test('Every registered Literature rule has a unique ID and binds to its registered source hash', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const r of p.source_rules) {
    assert(!ids.has(r.id)); ids.add(r.id);
    const s = p.sources.find(s => s.source_id === r.source_id);
    assert(s, 'rule source must be registered');
    assert.equal(r.source_sha256, s.sha256);
  }
  assert.deepEqual([...ids].sort(), [
    'SS1-SRC-470d43e54e5b-R001',
    'SS1-SRC-470d43e54e5b-R002',
    'SS1-SRC-470d43e54e5b-R003',
    'SS1-SRC-470d43e54e5b-R004',
    'SS1-SRC-470d43e54e5b-R005',
    'SS1-SRC-470d43e54e5b-R006',
    'SS1-SRC-470d43e54e5b-R007',
    'SS1-SRC-470d43e54e5b-R008',
    'SS1-SRC-470d43e54e5b-R009',
    'SS1-SRC-470d43e54e5b-R010',
    'SS1-SRC-470d43e54e5b-R011',
    'SS1-SRC-1728961e97b5-R001',
    'SS1-SRC-1728961e97b5-R002',
    'SS1-SRC-1728961e97b5-R003',
    'SS1-SRC-1728961e97b5-R004',
    'SS1-SRC-1728961e97b5-R005',
    'SS1-SRC-1728961e97b5-R006',
    'SS1-SRC-1728961e97b5-R007',
    'SS1-SRC-1728961e97b5-R008',
    'SS1-SRC-1728961e97b5-R009',
    'SS1-SRC-1728961e97b5-R010',
    'SS1-SRC-1728961e97b5-R011',
    'SS1-SRC-1728961e97b5-R012',
    'SS1-SRC-1728961e97b5-R013',
    'SS1-SRC-2422e423a240-R001',
    'SS1-SRC-2422e423a240-R002',
    'SS1-SRC-2422e423a240-R003',
    'SS1-SRC-2422e423a240-R004',
    'SS1-SRC-2422e423a240-R005',
    'SS1-SRC-2422e423a240-R006',
    'SS1-SRC-2422e423a240-R007',
    'SS1-SRC-2422e423a240-R008',
    'SS1-SRC-2422e423a240-R009',
    'SS1-SRC-2422e423a240-R010',
    'SS1-SRC-2422e423a240-R011',
    'SS1-SRC-2422e423a240-R012',
    'SS1-SRC-2422e423a240-R013',
  ].sort());
});

test('Literature source aliases have explicit owner approval and markers remain scheme-only', () => {
  const p = packageSchema.parse(raw);
  const aliases = p.source_rules.filter(r => r.op === 'source_alias');
  const markers = p.source_rules.filter(r => r.op === 'classify_marker');
  assert.equal(aliases.length, 3);
  assert.equal(markers.length, 34);
  for (const r of aliases) {
    const s = p.sources.find(s => s.source_id === r.source_id)!;
    assert.equal(r.canonical_subject, p.canonical_subject);
    assert.equal(r.observed_subject, s.header_text);
    assert.match(r.approval_reference, /^Owner instruction to implement SS1 Literature-in-English/);
  }
  for (const r of markers) assert.equal(r.kind, 'SCHEME_ONLY');
});

test('Rule guards reject wrong-source hashes, missing anchors and ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const r of p.source_rules) {
    const input = { source_id: r.source_id, sha256: r.source_sha256, filePath: 'synthetic-literature-probe.docx', text: r.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [r]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [r]), /missing/);
    assert.throws(() => applyRules({ ...input, text: r.anchor + '\n' + r.anchor }, [r]), /ambiguous/);
  }
});

test('Coverage IDs are unique and each coverage row resolves to a registered source', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const c of p.coverage) {
    assert(!ids.has(c.id)); ids.add(c.id);
    assert(p.sources.some(s => s.source_id === c.source_id));
    assert(c.objective.trim().length > 0);
    assert(c.objective_locator.trim().length > 0);
  }
});

test('All authored Literature lessons retain exact body hashes, complete marking and owner approval', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const l of p.lessons) {
    assert(!ids.has(l.id)); ids.add(l.id);
    assert.equal(hash(l.body), l.body_sha256);
    assert.equal(l.subject, 'Literature-in-English');
    assert.equal(l.class_name, 'SS 1');
    assert(l.objectives.length > 0 && l.practice.length > 0);
    for (const q of l.practice) {
      assert(q.answer.trim().length > 0);
      assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0));
      assert(q.marking.every(m => m.criterion.trim() && m.marks > 0));
    }
    assert.equal(l.state.content_approval, 'APPROVED');
    assert.match(l.state.approval_reference ?? '', /^Owner instruction to bring SS1 Literature/);
    assert.equal(l.state.verification, 'DEFERRED');
    assert.equal(l.state.verification_reference, null);
  }
});

test('Any delivery corrections bind the original source identity to a same-term replacement', () => {
  const p = packageSchema.parse(raw);
  for (const c of p.delivery_corrections) {
    const s = p.sources.find(s => s.source_id === c.source_id);
    const l = p.lessons.find(l => l.id === c.replacement_id);
    assert(s && l);
    assert.equal(c.source_sha256, s.sha256);
    assert.equal(c.source_lesson_id, c.source_id + ':BODY:' + c.body_sha256);
    assert.equal(l.term, s.term);
  }
});

test('Every term week has a delivered lesson and the three source documents remain separately registered', () => {
  const p = packageSchema.parse(raw);
  for (const term of ['1st Term','2nd Term','3rd Term']) {
    const lessons = p.lessons.filter(l => l.term === term);
    assert.equal(lessons.length, 9, term);
    assert.ok(lessons.every(l => l.practice.length >= 4), term);
  }
  for (const lesson of p.lessons) {
    const source = p.sources.find(s => s.term === lesson.term)!;
    assert.ok(p.coverage.some(c => c.source_id === source.source_id && c.lesson_ids.includes(lesson.id)), lesson.id);
  }
  assert.equal(p.lessons.reduce((n,l) => n + l.practice.length, 0), 111);
  assert.equal(p.lessons.reduce((n,l) => n + l.practice.reduce((a,q) => a + q.marks, 0), 0), 418);
});

test('Week One corrected lesson is mapped as an equivalent supplement without inventing a parser fingerprint', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(l => l.id === 'SUP-SS1-LITERATURE-T1-W01-CORRECTED');
  assert(lesson);
  const source = p.sources.find(s => s.term === '1st Term')!;
  assert.ok(p.coverage.some(c => c.source_id === source.source_id && c.lesson_ids.includes(lesson.id) && c.status === 'IMPLEMENTED_EQUIVALENT'));
  assert.equal(p.delivery_corrections.some(c => c.replacement_id === lesson.id), false, 'no source correction fingerprint is asserted until the importer confirms the parsed row identity');
});

// Full importer/parser comparison is a separate integration check.
// These synthetic rule tests do NOT prove that authored source-body references equal runtime rows.
