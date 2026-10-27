// Deferred by owner. Run only during the later authorised verification stage:
// node --import tsx --test tests/ss1/french.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';
const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/french.json', import.meta.url), 'utf8'));
const hash = (s: string) => createHash('sha256').update(s).digest('hex');

test('French authored package follows the frozen schema and keeps all three source terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'french');
  assert.deepEqual(p.sources.map(s => s.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  for (const s of p.sources) assert.equal(s.class_name, 'SS 1');
});
test('Authored bodies have exact hashes and complete marking totals', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const l of p.lessons) {
    assert(!ids.has(l.id)); ids.add(l.id);
    assert.equal(hash(l.body), l.body_sha256);
    assert.equal(l.subject, 'French');
    assert.equal(l.class_name, 'SS 1');
    assert(l.objectives.length > 0 && l.practice.length > 0);
    for (const q of l.practice) {
      assert(q.answer.trim().length > 0);
      assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0));
      assert(q.marking.every(m => m.criterion.trim() && m.marks > 0));
    }
  }
});
test('Corrections bind a same-term replacement and preserve original identity hashes', () => {
  const p = packageSchema.parse(raw);
  for (const c of p.delivery_corrections) {
    const s = p.sources.find(s => s.source_id === c.source_id)!;
    const l = p.lessons.find(l => l.id === c.replacement_id)!;
    assert(s && l);
    assert.equal(c.source_sha256, s.sha256);
    assert.equal(c.source_lesson_id, `${c.source_id}:BODY:${c.body_sha256}`);
    assert.equal(l.term, s.term);
  }
});
test('No checkpoint fabricates approval or completed verification', () => {
  for (const l of packageSchema.parse(raw).lessons) {
    assert.equal(l.state.content_approval, 'PENDING');
    assert.equal(l.state.approval_reference, null);
    assert.equal(l.state.verification, 'DEFERRED');
    assert.equal(l.state.verification_reference, null);
  }
});
test('French rule guards reject wrong-source hashes and ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const r of p.source_rules) {
    const input = { source_id: r.source_id, sha256: r.source_sha256, filePath: 'synthetic-scope-probe.docx', text: r.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [r]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: r.anchor + '\n' + r.anchor }, [r]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [r]), /missing/);
  }
});
test('Regression examples preserve accents, the missing alphabet letter and future-tense teaching', () => {
  const byId = new Map(packageSchema.parse(raw).lessons.map(l => [l.id, l]));
  assert.match(byId.get('SUP-SS1-FRENCH-ALPHABET-T2')!.body, /M N O/);
  assert.match(byId.get('SUP-SS1-FRENCH-ACCENTS-T1')!.body, /école/);
  assert.match(byId.get('SUP-SS1-FRENCH-ACCENTS-T1')!.body, /garçon/);
  assert.match(byId.get('SUP-SS1-FRENCH-ACCENTS-T1')!.body, /Noël/);
  assert.match(byId.get('SUP-SS1-FRENCH-FUTURE-T2')!.body, /nous parlerons/);
  assert.match(byId.get('SUP-SS1-FRENCH-SOUNDS-T2')!.body, /\/ɲ\//);
  assert.match(byId.get('SUP-SS1-FRENCH-COUNTRIES-T1')!.body, /Burundi — Gitega/);
});
// The full-source compiler/parser comparison is a separate required integration check.
// Synthetic guard tests above do NOT prove authored source-body references equal runtime rows.
