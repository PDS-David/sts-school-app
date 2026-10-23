// Y2: iwì egúngún text study. CI-safe: no database, no private corpus, no network.
// Gate: SUP-YO-IWI-TEXT may be claimed only with a delivered First-Term lesson, a fresh attribution record, a
// byte-verified source and no rejected candidate. Until then the register must say exactly that nothing is supported.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
import { JSS3_ATTRIBUTIONS, attributionBodyHash } from '../backend/src/db/jss3Attributions.js';

const root = path.resolve(import.meta.dirname, '..');
const read = (p: string) => readFileSync(path.join(root, p), 'utf8');
const register = JSON.parse(read('docs/jss3/completion/YO_TEXT/SOURCE_RIGHTS_REGISTER.json'));
const evidence = JSON.parse(read('docs/jss3/completion/YO_IWI_TEXT_20261023/IWI_SOURCE_CHECKS.json'));
const coverage = read('docs/jss3/replacements/CURRENT_COVERAGE.csv').split('\n');
const statusOf = (gapId: string) => coverage.find(l => l.startsWith(gapId + ','))?.split(',')[1];

type Sup = { id: string; body: string; termLabel?: string; gapIds?: string[] };
type Attr = { supplement_id: string; body_sha256: string };

const LESSON = 'SUP-YO-IWI-TEXT';
const REJECTED = ['YT-05', 'YT-06', 'YT-09', 'YT-IWI-01', 'YT-IWI-02', 'YT-IWI-03'];
const HEX64 = /^[0-9a-f]{64}$/;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Every reason the iwì claim in the register cannot be trusted. Empty list means consistent. */
export function iwiClaimProblems(reg: any, sups: Sup[], attrs: Attr[]): string[] {
  const out: string[] = [];
  const g = (reg.genres ?? []).find((x: any) => x.id === 'iwi-egungun');
  if (!g) return ['iwi-egungun missing from register'];
  const lesson = sups.find(s => s.id === LESSON);
  const attr = attrs.find(a => a.supplement_id === LESSON);
  if (g.status === 'NOT_SUPPORTED') {
    if (g.lesson_id) out.push('not supported but names a lesson');
    if (!String(g.missing ?? '').trim()) out.push('must say exactly what is missing');
    if (lesson) out.push(`${LESSON} is delivered while the register says NOT_SUPPORTED`);
    if (attr) out.push(`attribution record exists for undelivered ${LESSON}`);
    return out;
  }
  if (g.status !== 'SUPPORTED') return [`unknown status ${g.status}`];
  if (g.lesson_id !== LESSON) out.push(`supported lesson id must be ${LESSON}`);
  if (!lesson) return [...out, `lesson ${LESSON} is not delivered`];
  if (lesson.termLabel !== '1st Term') out.push('lesson must be First Term');
  if (!(lesson.gapIds ?? []).includes('YO-SL-094')) out.push('lesson must carry existing gap YO-SL-094');
  for (const need of ['Practice', 'Answers and marking guide'])
    if (!lesson.body.includes(need)) out.push(`lesson lacks "${need}"`);
  if (!attr) out.push('supported lesson has no attribution record');
  else if (attr.body_sha256 !== attributionBodyHash(lesson.body)) out.push('attribution body hash is stale');
  const bound = (reg.sources ?? []).filter((s: any) => s.lesson_id === LESSON);
  const verified = bound.filter((s: any) => s.verdict === 'USABLE_VERIFIED' && HEX64.test(s.source_sha256 ?? '') && (s.genres_checked ?? []).includes('iwi-egungun'));
  if (!verified.length) out.push('no byte-verified source (USABLE_VERIFIED with source_sha256) is bound to the lesson');
  for (const s of bound) {
    if (REJECTED.includes(s.id)) out.push(`${s.id} is a rejected candidate`);
    if (!['documented_traditional', 'labelled_modern_equivalent'].includes(s.text_kind)) out.push(`${s.id}: text_kind must say documented_traditional or labelled_modern_equivalent`);
    if (s.text_kind === 'labelled_modern_equivalent' && (!/modern/i.test(lesson.body) || /inherited traditional/i.test(lesson.body)))
      out.push(`${s.id}: a modern equivalent must be labelled modern and not called an inherited traditional chant`);
  }
  return out;
}

/** Problems with the recorded esa = iwi equivalence evidence. */
export function equivalenceProblems(ev: any, reg: any): string[] {
  const out: string[] = [];
  const e = ev.equivalence_esa_iwi ?? {};
  const srcs: any[] = e.sources ?? [];
  if (e.status !== 'SUPPORTED_BY_SCHOLARSHIP') out.push('equivalence status must be SUPPORTED_BY_SCHOLARSHIP');
  if (srcs.length < 3) out.push('equivalence needs at least three scholarly statements');
  if (new Set(srcs.map(s => s.work)).size !== srcs.length) out.push('equivalence sources must be different works');
  for (const s of srcs) {
    for (const f of ['register_id', 'work', 'locator', 'reported_wording', 'licence'])
      if (typeof s[f] !== 'string' || !s[f].trim()) out.push(`${s.register_id ?? '?'}: missing ${f}`);
    if (words(s.reported_wording ?? '') > 15) out.push(`${s.register_id}: quotation over 15 words`);
    if (!(reg.sources ?? []).some((r: any) => r.id === s.register_id)) out.push(`${s.register_id}: not in the register`);
  }
  if (srcs.filter(s => /^CC BY( |$)/.test(s.licence ?? '')).length < 2) out.push('at least two equivalence sources must be openly licensed CC BY');
  const g = (reg.genres ?? []).find((x: any) => x.id === 'iwi-egungun');
  if (g?.equivalence_with_esa?.status !== e.status) out.push('register genre entry and evidence file disagree on equivalence status');
  return out;
}

test('current register, lessons and attributions agree that iwì egúngún is not yet supported', () => {
  assert.deepEqual(iwiClaimProblems(register, JSS3_SUPPLEMENTS as Sup[], JSS3_ATTRIBUTIONS as Attr[]), []);
  const g = register.genres.find((x: any) => x.id === 'iwi-egungun');
  assert.equal(g.status, 'NOT_SUPPORTED');
  assert.equal(g.lesson_id, null);
  assert.equal(evidence.outcome, 'NO_SUPPORTABLE_PASSAGE');
  assert.equal(evidence.implemented, false);
  assert.equal(JSS3_SUPPLEMENTS.filter(s => s.id === LESSON).length, 0);
  assert.equal(statusOf('YO-SL-094'), 'REPLACEMENT_IMPLEMENTED_PARTIAL');
  for (const need of ['origin', 'translator', 'licence', 'source bytes or page images', 'non-commercial'])
    assert.ok(g.missing.includes(need), `missing-item text must name: ${need}`);
});

test('esa = iwi equivalence is evidenced from three scholarly works, not assumed', () => {
  assert.deepEqual(equivalenceProblems(evidence, register), []);
  const bad = (mutate: (e: any) => void) => { const e = structuredClone(evidence); mutate(e); return equivalenceProblems(e, register); };
  assert.ok(bad(e => { e.equivalence_esa_iwi.sources.pop(); }).some(p => /at least three/.test(p)));
  assert.ok(bad(e => { e.equivalence_esa_iwi.sources[1].work = e.equivalence_esa_iwi.sources[0].work; }).some(p => /different works/.test(p)));
  assert.ok(bad(e => { e.equivalence_esa_iwi.sources[0].locator = ''; }).some(p => /missing locator/.test(p)));
  assert.ok(bad(e => { e.equivalence_esa_iwi.sources[0].reported_wording = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen'; }).some(p => /over 15 words/.test(p)));
  assert.ok(bad(e => { e.equivalence_esa_iwi.sources[2].register_id = 'YT-NOPE'; }).some(p => /not in the register/.test(p)));
  assert.ok(bad(e => { e.equivalence_esa_iwi.sources.forEach((s: any) => { s.licence = 'All rights reserved'; }); }).some(p => /openly licensed/.test(p)));
  assert.ok(bad(e => { e.equivalence_esa_iwi.status = 'ASSUMED'; }).some(p => /SUPPORTED_BY_SCHOLARSHIP/.test(p)));
});

test('every candidate examined is registered, rejected for a stated reason, and none is marked usable', () => {
  const ids = evidence.candidates.map((c: any) => c.register_id);
  for (const id of REJECTED) assert.ok(ids.includes(id), `${id} must be in the evidence candidates`);
  for (const c of evidence.candidates) {
    const row = register.sources.find((s: any) => s.id === c.register_id);
    assert.ok(row, `${c.register_id} must be in the register`);
    assert.notEqual(row.verdict, 'USABLE_VERIFIED', `${c.register_id} must not be usable`);
    assert.equal(c.selectable, false);
    assert.ok(String(c.reason).trim() && String(c.finding).trim() && String(c.licence).trim(), `${c.register_id} needs finding, reason and licence`);
  }
  const akinbo = evidence.candidates.find((c: any) => c.register_id === 'YT-06');
  assert.match(akinbo.finding, /original oríkì written for the study/);
  assert.match(akinbo.finding, /speech mode, in ìjálá and in esa/);
  const aransi = evidence.candidates.find((c: any) => c.register_id === 'YT-05');
  assert.match(aransi.reason, /Unsuitable for a JSS3 pupil lesson/);
  const famule = register.sources.find((s: any) => s.id === 'YT-IWI-02');
  assert.equal(famule.verdict, 'REJECTED_PROVENANCE');
  assert.match(famule.rights_basis, /NonCommercial/);
  assert.match(famule.finding, /one line of two clauses/);
  for (const s of register.sources.filter((x: any) => x.id.startsWith('YT-IWI-'))) assert.ok(!HEX64.test(s.source_sha256 ?? ''), `${s.id}: no source bytes were downloaded, so no hash may be recorded`);
});

test('the Ṣàngó and Ọya sections and the Ṣàngó attribution are untouched', () => {
  const sango = register.genres.find((g: any) => g.id === 'sango-pipe');
  const oya = register.genres.find((g: any) => g.id === 'oya-pipe');
  assert.equal(sango.status, 'SUPPORTED');
  assert.equal(sango.lesson_id, 'SUP-YO-ORAL-GENRES');
  assert.equal(oya.status, 'NOT_SUPPORTED');
  assert.equal(oya.lesson_id, null);
  assert.equal(register.sources.find((s: any) => s.id === 'YT-13').source_sha256, '766bbd6485aa7f039734a0936ebad381060bc7c282e5be2dcda03b96770c24b6');
  const lesson = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-YO-ORAL-GENRES')!;
  const attr = JSS3_ATTRIBUTIONS.find(a => a.supplement_id === 'SUP-YO-ORAL-GENRES')!;
  assert.equal(attr.body_sha256, attributionBodyHash(lesson.body));
  assert.equal(JSS3_SUPPLEMENTS.filter(s => s.id === 'SUP-YO-ORAL-GENRES').length, 1);
});

test('the gate can be satisfied by a genuine future lesson (positive control)', () => {
  const body = 'Source status: documented traditional text.\nPractice\n1. …\nAnswers and marking guide\n1. …';
  const reg = structuredClone(register);
  const g = reg.genres.find((x: any) => x.id === 'iwi-egungun');
  g.status = 'SUPPORTED'; g.lesson_id = LESSON;
  reg.sources.push({ id: 'YT-SYNTH', verdict: 'USABLE_VERIFIED', source_sha256: 'a'.repeat(64), lesson_id: LESSON, genres_checked: ['iwi-egungun'], text_kind: 'documented_traditional' });
  const sups: Sup[] = [{ id: LESSON, body, termLabel: '1st Term', gapIds: ['YO-SL-094'] }];
  const attrs: Attr[] = [{ supplement_id: LESSON, body_sha256: attributionBodyHash(body) }];
  assert.deepEqual(iwiClaimProblems(reg, sups, attrs), []);
});

test('the gate rejects every false claim that iwì egúngún text study is delivered', () => {
  const body = 'Source status: modern equivalent, composed in 2026.\nPractice\n1. …\nAnswers and marking guide\n1. …';
  const good = () => {
    const reg = structuredClone(register);
    const g = reg.genres.find((x: any) => x.id === 'iwi-egungun');
    g.status = 'SUPPORTED'; g.lesson_id = LESSON;
    reg.sources.push({ id: 'YT-SYNTH', verdict: 'USABLE_VERIFIED', source_sha256: 'b'.repeat(64), lesson_id: LESSON, genres_checked: ['iwi-egungun'], text_kind: 'labelled_modern_equivalent' });
    const sups: Sup[] = [{ id: LESSON, body, termLabel: '1st Term', gapIds: ['YO-SL-094'] }];
    const attrs: Attr[] = [{ supplement_id: LESSON, body_sha256: attributionBodyHash(body) }];
    return { reg, sups, attrs };
  };
  const probe = (mutate: (x: ReturnType<typeof good>) => void) => { const x = good(); mutate(x); return iwiClaimProblems(x.reg, x.sups, x.attrs); };
  assert.deepEqual(probe(() => {}), []);
  assert.ok(probe(x => { x.sups.length = 0; }).some(p => /not delivered/.test(p)));
  assert.ok(probe(x => { x.attrs.length = 0; }).some(p => /no attribution record/.test(p)));
  assert.ok(probe(x => { x.attrs[0].body_sha256 = 'c'.repeat(64); }).some(p => /hash is stale/.test(p)));
  assert.ok(probe(x => { x.sups[0].body += ' tamper'; }).some(p => /hash is stale/.test(p)));
  assert.ok(probe(x => { x.sups[0].termLabel = '2nd Term'; }).some(p => /First Term/.test(p)));
  assert.ok(probe(x => { x.sups[0].gapIds = ['YO-SL-089']; }).some(p => /YO-SL-094/.test(p)));
  assert.ok(probe(x => { x.reg.genres.find((g: any) => g.id === 'iwi-egungun').lesson_id = 'SUP-OTHER'; }).some(p => /lesson id must be/.test(p)));
  assert.ok(probe(x => { x.sups[0].body = x.sups[0].body.replace('Answers and marking guide', ''); x.attrs[0].body_sha256 = attributionBodyHash(x.sups[0].body); }).some(p => /lacks "Answers and marking guide"/.test(p)));
  assert.ok(probe(x => { delete x.reg.sources.find((s: any) => s.id === 'YT-SYNTH').source_sha256; }).some(p => /byte-verified/.test(p)));
  assert.ok(probe(x => { x.reg.sources.find((s: any) => s.id === 'YT-SYNTH').verdict = 'REJECTED_PROVENANCE'; }).some(p => /byte-verified/.test(p)));
  assert.ok(probe(x => { x.reg.sources.find((s: any) => s.id === 'YT-SYNTH').text_kind = undefined; }).some(p => /text_kind/.test(p)));
  assert.ok(probe(x => { x.sups[0].body = 'Source status: documented.\nPractice\nAnswers and marking guide'; x.attrs[0].body_sha256 = attributionBodyHash(x.sups[0].body); }).some(p => /must be labelled modern/.test(p)));
  assert.ok(probe(x => { x.sups[0].body += ' This is an inherited traditional chant.'; x.attrs[0].body_sha256 = attributionBodyHash(x.sups[0].body); }).some(p => /not called an inherited traditional chant/.test(p)));
  for (const id of REJECTED)
    assert.ok(probe(x => { x.reg.sources.find((s: any) => s.id === id).lesson_id = LESSON; }).some(p => new RegExp(`${id} is a rejected candidate`).test(p)), `${id} must not be usable for the lesson`);
});

test('a lesson or attribution appearing while the register says NOT_SUPPORTED is rejected', () => {
  const sups: Sup[] = [{ id: LESSON, body: 'x' }];
  assert.ok(iwiClaimProblems(register, sups, []).some(p => /delivered while the register says NOT_SUPPORTED/.test(p)));
  assert.ok(iwiClaimProblems(register, [], [{ supplement_id: LESSON, body_sha256: 'd'.repeat(64) }]).some(p => /undelivered/.test(p)));
  const reg = structuredClone(register);
  const g = reg.genres.find((x: any) => x.id === 'iwi-egungun');
  g.lesson_id = LESSON;
  assert.ok(iwiClaimProblems(reg, [], []).some(p => /names a lesson/.test(p)));
  g.lesson_id = null; g.missing = '';
  assert.ok(iwiClaimProblems(reg, [], []).some(p => /exactly what is missing/.test(p)));
});

test('each candidate carries one acquisition status and the modern-equivalent assessment is explicit', () => {
  const allowed = Object.keys(evidence.status_vocabulary);
  assert.deepEqual(allowed.sort(), ['inaccessible', 'not_located', 'permission_unresolved', 'unsuitable_for_jss3']);
  for (const c of evidence.candidates) {
    assert.ok(allowed.includes(c.acquisition_status), `${c.register_id}: unknown acquisition_status`);
    for (const a of c.also) assert.ok(allowed.includes(a), `${c.register_id}: unknown also-status ${a}`);
  }
  for (const n of evidence.not_examined) assert.ok(allowed.includes(n.acquisition_status));
  const by = (id: string) => evidence.candidates.find((c: any) => c.register_id === id).acquisition_status;
  assert.equal(by('YT-05'), 'unsuitable_for_jss3');
  assert.equal(by('YT-IWI-02'), 'permission_unresolved');
  assert.equal(by('YT-IWI-01'), 'not_located');
  const m = evidence.modern_equivalent_assessment;
  assert.equal(m.verdict, 'NOT_ADOPTED');
  assert.match(m.principle, /not disqualified for being modern/);
  assert.match(m.principle, /never labelled an inherited traditional chant/);
  assert.match(m.objective_fit, /^Fails\./);
  assert.match(evidence.overall_acquisition_status.curriculum_gap, /OPEN/);
  assert.equal(evidence.status_separation.implementation, 'not done');
  assert.equal(statusOf('YO-SL-094'), 'REPLACEMENT_IMPLEMENTED_PARTIAL');
});
