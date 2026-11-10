// Deferred by owner. Run only during the later authorised verification stage:
// node --import tsx --test tests/ss1/catering-craft.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema, type SourceRule, type SubjectPackage } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const raw = JSON.parse(readFileSync(path.join(repo, 'backend/src/db/ss1/subjects/catering-craft.json'), 'utf8'));
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const assigned = readFileSync(path.join(repo, 'docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv'), 'utf8')
  .split(/\r?\n/)
  .filter(line => line.length > 0)
  .slice(1)
  .map(line => line.split(','))
  .filter(cols => cols[5] === 'catering-craft');
const aliasRules = (p: SubjectPackage): Extract<SourceRule, { op: 'source_alias' }>[] =>
  p.source_rules.filter((r): r is Extract<SourceRule, { op: 'source_alias' }> => r.op === 'source_alias');

test('Catering Craft accounts for two archive documents plus a separately hash-bound First Term scheme source', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v2');
  assert('external_sources' in p);
  assert.equal(p.subject_slug, 'catering-craft');
  assert.equal(p.canonical_subject, 'Catering Craft');
  assert.equal(assigned.length, 2);
  assert(!assigned.some(cols => cols[4] === '1st Term'));
  assert.deepEqual(p.sources.map(s => s.source_id).sort(), assigned.map(cols => cols[0]).sort());
  assert.deepEqual(p.sources.map(s => s.term).sort(), ['2nd Term', '3rd Term']);
  assert.equal(p.external_sources.length, 1);
  assert.equal(p.external_sources[0].source_id, 'SS1-EXT-CC-T1-LAGOS-UNIFIED-SCHEME-2026');
  assert.equal(p.external_sources[0].term, '1st Term');
  assert.equal(p.external_sources[0].sha256, hash(p.external_sources[0].content));
  assert.match(p.external_sources[0].url, /^https:\/\//);
  for (const s of p.sources) {
    const row = assigned.find(cols => cols[0] === s.source_id);
    assert(row, s.source_id);
    assert.equal(s.archive_member, row[1]);
    assert.equal(s.sha256, row[2]);
    assert.equal(s.term, row[4]);
    assert.equal(s.class_name, 'SS 1');
    assert.equal(s.canonical_subject, p.canonical_subject);
  }
});

test('Alias rules bind the exact heading and record explicit owner approval', () => {
  const p = packageSchema.parse(raw);
  const aliases = aliasRules(p);
  assert.equal(aliases.length, 2);
  for (const r of aliases) {
    const s = p.sources.find(source => source.source_id === r.source_id);
    assert(s, r.id);
    assert.equal(r.source_sha256, s.sha256);
    assert.equal(r.observed_subject, r.anchor);
    assert.equal(r.anchor, s.header_text);
    assert.equal(r.canonical_subject, p.canonical_subject);
    assert.match(r.approval_reference, /Owner approval recorded in chat on 2026-11-09/);
    assert.doesNotMatch(r.approval_reference, /PENDING-OWNER/);
  }
  const pending = p.open_items.find(o => o.id === 'CATERING-CRAFT-ALIAS-APPROVAL');
  assert(pending && !pending.blocks_delivery);
});

test('Owner approval is recorded without claiming later verification', () => {
  const p = packageSchema.parse(raw);
  for (const x of [...p.lessons.map(l => l.state), ...p.assets.map(a => a.state)]) {
    assert.equal(x.content_approval, 'APPROVED');
    assert(x.approval_reference !== null && /Owner approval recorded in chat on 2026-11-09/.test(x.approval_reference));
    assert.equal(x.verification, 'DEFERRED');
    assert.equal(x.verification_reference, null);
  }
  for (const c of p.delivery_corrections) {
    const source = p.sources.find(s => s.source_id === c.source_id);
    const replacement = p.lessons.find(l => l.id === c.replacement_id);
    assert(source, c.id);
    assert(replacement, c.id);
    assert.equal(c.source_sha256, source.sha256);
    assert.equal(c.source_lesson_id, `${c.source_id}:BODY:${c.body_sha256}`);
    if (c.id === 'CC-CORR-T2-W06-FRYING') {
      assert.equal(c.source_lesson_id, 'SS1-SRC-f433169ca25c:BODY:fb7e873509e94a65eaba0d93790c2171ee68729f1bc5ee049e8dc8bed204e1de');
      assert.equal(c.replacement_id, 'SUP-SS1-CC-T2-W06-COOKING-PRINCIPLES');
    }
    assert.equal(replacement.term, source.term);
  }
});

test('Lessons, if any, have exact bodies and complete marking totals', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const l of p.lessons) {
    assert(!ids.has(l.id));
    ids.add(l.id);
    assert.match(l.id, /^SUP-SS1-[A-Z0-9]+(?:-[A-Z0-9]+)*$/);
    assert.equal(l.class_name, 'SS 1');
    assert.equal(l.subject, p.canonical_subject);
    assert.equal(hash(l.body), l.body_sha256);
    assert(l.objectives.length > 0 && l.practice.length > 0 && l.provenance.length > 0);
    for (const q of l.practice) {
      assert(q.answer.trim().length > 0);
      assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0));
      assert(q.marking.every(m => m.criterion.trim().length > 0 && m.marks > 0));
    }
  }
});

test('Coverage targets resolve and incomplete coverage stays visible', () => {
  const p = packageSchema.parse(raw);
  const targets = new Set([...p.lessons.map(l => l.id), ...p.source_rules.map(r => r.id), ...p.assets.map(a => a.id)]);
  for (const c of p.coverage) {
    assert(p.sources.some(s => s.source_id === c.source_id) || p.external_sources.some(s => s.source_id === c.source_id), c.id);
    for (const id of c.lesson_ids) assert(targets.has(id), `${c.id}/${id}`);
    assert(c.evidence.length > 0, c.id);
  }
  const incomplete = p.coverage.filter(c => c.status === 'PARTIAL' || c.status === 'UNRESOLVED');
  if (incomplete.length > 0) {
    assert.equal(p.package_status, 'PENDING');
    assert(p.open_items.some(o => o.blocks_delivery));
  }
});

test('Alias rule guards reject wrong-source hashes and ambiguous or missing anchors', () => {
  const p = packageSchema.parse(raw);
  for (const r of aliasRules(p)) {
    const input = { source_id: r.source_id, sha256: r.source_sha256, filePath: 'synthetic-scope-probe.doc', text: r.anchor };
    assert.equal(applyRules(input, [r]), r.anchor);
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [r]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: r.anchor + '\n' + r.anchor }, [r]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [r]), /missing/);
  }
});

// Synthetic guard tests above do NOT prove authored source-body references equal runtime rows.


test('First Term external scheme covers all thirteen calendar weeks without inventing an archive member', () => {
  const p = packageSchema.parse(raw);
  assert('external_sources' in p);
  const ext = p.external_sources[0];
  const coverage = p.coverage.filter(c => c.source_id === ext.source_id);
  assert.equal(coverage.length, 13);
  assert.deepEqual(coverage.map(c => c.objective_locator.match(/Week (\\d+)/)?.[1]), Array.from({ length: 13 }, (_, i) => String(i + 1)));
  assert(coverage.every(c => c.status === 'IMPLEMENTED_EQUIVALENT' && c.lesson_ids.length > 0 && c.evidence.length > 0));
  assert(!p.sources.some(s => s.term === '1st Term'));
  assert(!assigned.some(cols => cols[4] === '1st Term'));
  assert(p.open_items.some(o => o.id === 'CC-T1-SOURCE-MISSING' && !o.blocks_delivery));
});
