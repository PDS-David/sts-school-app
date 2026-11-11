// Automated French package regression suite; run through npm run test:ss1:french.
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
  assert.match(byId.get('SUP-SS1-FRENCH-SOUNDS-T2')!.body, /\/ŋ\//);
  assert.match(byId.get('SUP-SS1-FRENCH-ACCENTS-T1')!.body, /h muet/);
  assert.match(byId.get('SUP-SS1-FRENCH-ACCENTS-T1')!.body, /h aspiré/);
  assert.match(byId.get('SUP-SS1-FRENCH-PROFESSIONS-T1')!.body, /computateur/);
  assert.match(byId.get('SUP-SS1-FRENCH-PROFESSIONS-T1')!.body, /couteur/);
  assert.match(byId.get('SUP-SS1-FRENCH-OPINION-T1')!.body, /L’argent fait-il le bonheur/);
  assert.match(byId.get('SUP-SS1-FRENCH-ENVIRONMENT-T1')!.body, /réfrigérateur/);
  assert.match(byId.get('SUP-SS1-FRENCH-PREFERENCES-T1')!.body, /nous goûtons/);
  assert.match(byId.get('SUP-SS1-FRENCH-COUNTRIES-T1')!.body, /Burundi — Gitega/);
});
// The full-source compiler/parser comparison is a separate required integration check.
// Synthetic guard tests above do NOT prove authored source-body references equal runtime rows.

test('Coverage references resolve and every partial item remains explicitly blocking', () => {
  const p = packageSchema.parse(raw);
  const lessonIds = new Set(p.lessons.map(l => l.id));
  const sourceIds = new Set(p.sources.map(s => s.source_id));
  const ruleIds = new Set(p.source_rules.map(r => r.id));
  assert.equal(p.lessons.length, 40);
  assert.equal(p.coverage.length, 55);
  for (const c of p.coverage) {
    assert(sourceIds.has(c.source_id), `unknown source in ${c.id}`);
    assert(c.evidence.length > 0, `missing evidence in ${c.id}`);
    for (const id of c.lesson_ids) {
      assert(
        lessonIds.has(id) || ruleIds.has(id) || [...sourceIds].some(sourceId => id.startsWith(sourceId + ':BODY:')),
        `unresolved coverage target ${c.id} -> ${id}`
      );
    }
    if (c.status === 'IMPLEMENTED_EQUIVALENT') {
      assert(c.lesson_ids.some(id => lessonIds.has(id)), `equivalent without a lesson: ${c.id}`);
    }
  }
  const blocking = p.open_items.filter(item => item.blocks_delivery);
  assert(blocking.length > 0, 'French must not be declared complete while delivery blockers remain');
});
test('Third-Term revision and examination markers have original supplements and complete marking totals', () => {
  const p = packageSchema.parse(raw);
  const revision = p.lessons.find(l => l.id === 'SUP-SS1-FRENCH-REVISION-T3');
  const exam = p.lessons.find(l => l.id === 'SUP-SS1-FRENCH-EXAM-T3');
  assert(revision);
  assert(exam);
  assert.equal(revision.practice.reduce((sum, q) => sum + q.marks, 0), 20);
  assert.equal(exam.practice.length, 24);
  assert.equal(exam.practice.reduce((sum, q) => sum + q.marks, 0), 40);
  assert(exam.practice.slice(0, 20).every(q => q.marks === 1));
  assert(exam.practice.slice(20).every(q => q.marks === 5));
  for (const q of [...revision.practice, ...exam.practice]) {
    assert.equal(q.marking.reduce((sum, m) => sum + m.marks, 0), q.marks, q.id);
  }
  const markers = p.coverage.filter(c => c.id === 'FRENCH-T3-REVISION-MARKER' || c.id === 'FRENCH-T3-EXAMINATION-MARKER');
  assert.equal(markers.length, 2);
  assert(markers.every(c => c.status === 'MARKER'));
  assert(markers.every(c => c.lesson_ids.every(id => p.source_rules.some(rule => rule.id === id && rule.kind === 'SCHEME_ONLY'))));
});
test('Scheme-only markers are explicit and unresolved source rows remain partial', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.source_rules.find(r => r.id === 'SS1-SRC-8a2ec1fe30e3-R002')?.kind, 'SCHEME_ONLY');
  assert.equal(p.source_rules.find(r => r.id === 'SS1-SRC-8a2ec1fe30e3-R003')?.kind, 'SCHEME_ONLY');
  assert.equal(p.coverage.find(c => c.id === 'FRENCH-BODY-006')?.status, 'PARTIAL');
  assert.equal(p.coverage.find(c => c.id === 'FRENCH-BODY-019')?.status, 'PARTIAL');
  assert(p.open_items.some(item => item.id === 'FRENCH-UNCLEAR-OCCUPATIONS' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'FRENCH-EXAM-AUDIO' && item.blocks_delivery));
});
test('Package does not claim completion, approval, or verification prematurely', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  for (const l of p.lessons) {
    assert.equal(l.state.content_approval, 'PENDING');
    assert.equal(l.state.approval_reference, null);
    assert.equal(l.state.implementation, 'IMPLEMENTED');
    assert.equal(l.state.verification, 'DEFERRED');
    assert.equal(l.state.verification_reference, null);
  }
  assert(p.open_items.some(item => item.blocks_delivery));
  assert.equal(p.assets.length, 0);
});
