// Deferred by owner. Write now; execute only during the later authorised verification stage:
// node --import tsx --test tests/ss1/bookkeeping.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/bookkeeping.json', import.meta.url), 'utf8'));
const manifest = [
  { source_id: 'SS1-SRC-62b02f2adcb3', sha256: '9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0', archive_member: 'SSS 1/1st Term SS1_/book keeping.docx', term: '1st Term' },
  { source_id: 'SS1-SRC-97c1db5b1eb0', sha256: 'c8c75f55e327d7d3e6ece8b0b8a2a5b8', archive_member: 'SSS 1/2nd Term SS1_/Book keeping.docx', term: '2nd Term' },
  { source_id: 'SS1-SRC-97f226215927', sha256: '343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d', archive_member: 'SSS 1/3rd Term SS1_/BOOK KEEPING_.docx', term: '3rd Term' },
];
const hash = (s: string) => createHash('sha256').update(s).digest('hex');

test('Bookkeeping package follows the frozen schema and registers the three assigned sources', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'bookkeeping');
  assert.equal(p.canonical_subject, 'Bookkeeping');
  assert.deepEqual(
    p.sources.map(s => ({ source_id: s.source_id, sha256: s.sha256, archive_member: s.archive_member, term: s.term })),
    manifest,
  );
  assert(p.sources.every(s => s.class_name === 'SS 1'));
});

test('Authored lesson bodies have exact hashes and complete keyed marking', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const l of p.lessons) {
    assert(!ids.has(l.id), `duplicate lesson id: ${l.id}`);
    ids.add(l.id);
    assert.equal(hash(l.body), l.body_sha256);
    assert.equal(l.subject, 'Bookkeeping');
    assert.equal(l.class_name, 'SS 1');
    assert(l.objectives.length > 0 && l.practice.length > 0);
    for (const q of l.practice) {
      assert(q.answer.trim().length > 0);
      assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0));
      assert(q.marking.every(m => m.criterion.trim() && m.marks > 0));
    }
  }
});

test('Delivery corrections bind the exact original identity to a same-term replacement', () => {
  const p = packageSchema.parse(raw);
  for (const c of p.delivery_corrections) {
    const s = p.sources.find(s => s.source_id === c.source_id);
    const l = p.lessons.find(l => l.id === c.replacement_id);
    assert(s && l);
    assert.equal(c.source_sha256, s.sha256);
    assert.equal(c.source_lesson_id, `${c.source_id}:BODY:${c.body_sha256}`);
    assert.equal(l.term, s.term);
  }
});

test('No lesson checkpoint fabricates content approval or completed verification', () => {
  for (const l of packageSchema.parse(raw).lessons) {
    assert.equal(l.state.content_approval, 'PENDING');
    assert.equal(l.state.approval_reference, null);
    assert.equal(l.state.verification, 'DEFERRED');
    assert.equal(l.state.verification_reference, null);
  }
});

test('Source aliases remain visibly pending owner confirmation', () => {
  const p = packageSchema.parse(raw);
  for (const r of p.source_rules.filter(r => r.op === 'source_alias')) {
    assert.match(r.approval_reference, /^PENDING-OWNER:/);
    assert(p.sources.some(s => s.source_id === r.source_id && s.sha256 === r.source_sha256));
  }
});

test('Rule guards reject wrong source hashes and missing or ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const r of p.source_rules) {
    const input = { source_id: r.source_id, sha256: r.source_sha256, filePath: 'synthetic-bookkeeping-probe.docx', text: r.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [r]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: r.anchor + '\\n' + r.anchor }, [r]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [r]), /missing/);
  }
});

test('Preamble marker coverage targets its exact SCHEME_ONLY rule, not an invented lesson', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['COV-BK-T1-REVISION-1', 'RULE-BK-T1-REVISION-1'],
    ['COV-BK-T1-REVISION-11', 'RULE-BK-T1-REVISION-11'],
    ['COV-BK-T1-EXAM-12', 'RULE-BK-T1-EXAM-12'],
  ]);
  for (const [coverageId, ruleId] of expected) {
    const c = p.coverage.find(x => x.id === coverageId);
    const r = p.source_rules.find(x => x.id === ruleId);
    assert(c && r);
    assert.equal(c.status, 'MARKER');
    assert.deepEqual(c.lesson_ids, [ruleId]);
    assert.equal(r.op, 'classify_marker');
    assert.equal(r.kind, 'SCHEME_ONLY');
  }
});

// The full-source compiler/parser comparison is a separate integration check.
// These tests are written only; execution, typecheck and importer verification remain deferred.
