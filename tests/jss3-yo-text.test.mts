// YO-TEXT: source/rights register and a gate against marking Ṣàngó pípè, Ọya pípè or iwì egúngún text study as covered
// without a verified passage. CI-safe: no database, no private corpus.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
import { JSS3_ATTRIBUTIONS, attributionBodyHash } from '../backend/src/db/jss3Attributions.js';

const root = path.resolve(import.meta.dirname, '..');
const register = JSON.parse(readFileSync(path.join(root, 'docs/jss3/completion/YO_TEXT/SOURCE_RIGHTS_REGISTER.json'), 'utf8'));
const coverage = readFileSync(path.join(root, 'docs/jss3/replacements/CURRENT_COVERAGE.csv'), 'utf8').split('\n');

type Sup = { id: string; body: string };
type Attr = { supplement_id: string; body_sha256: string };
const TARGET_GENRES = ['sango-pipe', 'oya-pipe', 'iwi-egungun'];

/** Returns every reason the register cannot be trusted. Empty list means consistent. */
export function registerProblems(reg: any, sups: Sup[], attrs: Attr[]): string[] {
  const out: string[] = [];
  const verdicts = Object.keys(reg.verdicts ?? {});
  const ids = new Set<string>();
  for (const s of reg.sources ?? []) {
    if (ids.has(s.id)) out.push(`duplicate source id ${s.id}`);
    ids.add(s.id);
    for (const f of ['source', 'url', 'rights_basis', 'finding', 'verdict', 'unblock'])
      if (typeof s[f] !== 'string' || !s[f].trim()) out.push(`${s.id}: missing ${f}`);
    if (!verdicts.includes(s.verdict)) out.push(`${s.id}: unknown verdict ${s.verdict}`);
    if (!String(s.url).startsWith('https://')) out.push(`${s.id}: url must be https`);
    if (s.verdict === 'USABLE_VERIFIED') {
      if (!/^[0-9a-f]{64}$/.test(s.source_sha256 ?? '')) out.push(`${s.id}: usable source needs source_sha256`);
      if (!s.lesson_id) out.push(`${s.id}: usable source needs lesson_id`);
    }
  }
  const supported = new Set((reg.sources ?? []).filter((s: any) => s.verdict === 'USABLE_VERIFIED').map((s: any) => s.id));
  const genreIds = (reg.genres ?? []).map((g: any) => g.id);
  for (const g of TARGET_GENRES) if (!genreIds.includes(g)) out.push(`genre ${g} missing from register`);
  for (const g of reg.genres ?? []) {
    if (g.status === 'NOT_SUPPORTED') {
      if (g.lesson_id) out.push(`${g.id}: not supported but names a lesson`);
      if (!String(g.missing ?? '').trim()) out.push(`${g.id}: must say exactly what is missing`);
    } else if (g.status === 'SUPPORTED') {
      const lesson = sups.find(s => s.id === g.lesson_id);
      if (!lesson) { out.push(`${g.id}: supported but lesson ${g.lesson_id} is not delivered`); continue; }
      const a = attrs.find(x => x.supplement_id === lesson.id);
      if (!a) out.push(`${g.id}: supported lesson has no attribution record`);
      else if (a.body_sha256 !== attributionBodyHash(lesson.body)) out.push(`${g.id}: attribution body hash is stale`);
      for (const need of ['Practice', 'Answers and marking guide'])
        if (!lesson.body.includes(need)) out.push(`${g.id}: lesson lacks "${need}"`);
      if (!(reg.sources ?? []).some((s: any) => supported.has(s.id) && s.lesson_id === lesson.id && (s.genres_checked ?? []).includes(g.id)))
        out.push(`${g.id}: no verified source row is bound to its lesson`);
    } else out.push(`${g.id}: unknown status ${g.status}`);
  }
  return out;
}

const statusOf = (gapId: string) => coverage.find(l => l.startsWith(gapId + ','))?.split(',')[1];
const anySupported = (reg: any) => (reg.genres ?? []).some((g: any) => g.status === 'SUPPORTED');

test('the committed register is complete and internally consistent', () => {
  assert.deepEqual(registerProblems(register, JSS3_SUPPLEMENTS as Sup[], JSS3_ATTRIBUTIONS as Attr[]), []);
  assert.equal(register.base_sha.length, 40);
  assert.deepEqual(register.genres.map((g: any) => g.id).sort(), [...TARGET_GENRES].sort());
});

test('the validator rejects false claims of text coverage', () => {
  const sups = [{ id: 'SUP-X', body: 'Practice only' }];
  const bad = (mutate: (r: any) => void) => { const r = structuredClone(register); mutate(r); return registerProblems(r, sups, []); };
  assert.ok(bad(r => { r.genres[0].status = 'SUPPORTED'; r.genres[0].lesson_id = 'SUP-NOPE'; }).some(p => /not delivered/.test(p)));
  assert.ok(bad(r => { r.genres[0].status = 'SUPPORTED'; r.genres[0].lesson_id = 'SUP-X'; }).some(p => /no attribution record/.test(p)));
  assert.ok(bad(r => { r.genres[0].status = 'SUPPORTED'; r.genres[0].lesson_id = 'SUP-X'; }).some(p => /lacks "Answers and marking guide"/.test(p)));
  assert.ok(bad(r => { r.sources[0].verdict = 'USABLE_VERIFIED'; }).some(p => /needs source_sha256/.test(p)));
  assert.ok(bad(r => { r.sources[0].verdict = 'LOOKS_FINE'; }).some(p => /unknown verdict/.test(p)));
  assert.ok(bad(r => { r.sources[1].id = r.sources[0].id; }).some(p => /duplicate source id/.test(p)));
  assert.ok(bad(r => { r.genres[0].status = 'NOT_SUPPORTED'; r.genres[0].lesson_id = null; r.genres[0].missing = ''; }).some(p => /exactly what is missing/.test(p)));
  assert.ok(bad(r => { r.genres.pop(); }).some(p => /missing from register/.test(p)));
});

test('a genre with no verified passage keeps the delivered lessons and coverage records honest', () => {
  const genres = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-YO-ORAL-GENRES')!;
  const texts = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-YO-ORAL-TEXTS')!;
  if (!anySupported(register)) {
    assert.ok(genres.body.includes('this lesson supplies no verses'));
    assert.ok(texts.body.includes('No Ṣàngó pípè, Ọya pípè or iwì egúngún verse is supplied or invented'));
    assert.equal(statusOf('YO-SL-089'), 'REPLACEMENT_IMPLEMENTED_PARTIAL');
    assert.equal(statusOf('YO-SL-094'), 'REPLACEMENT_IMPLEMENTED_PARTIAL');
  }
  assert.ok(statusOf('YO-SL-094'), 'coverage record for YO-SL-094 must exist');
});

test('no source is marked usable while every target genre is unsupported', () => {
  const unsupported = register.genres.every((g: any) => g.status === 'NOT_SUPPORTED');
  if (unsupported) assert.ok(register.sources.every((s: any) => s.verdict !== 'USABLE_VERIFIED'));
});

test('existing Yoruba lessons and the NOUN/Kolawole attribution are preserved, not duplicated', () => {
  assert.equal(JSS3_SUPPLEMENTS.filter(s => s.id === 'SUP-YO-ORAL-GENRES').length, 1);
  assert.equal(JSS3_SUPPLEMENTS.filter(s => s.id === 'SUP-YO-ORAL-TEXTS').length, 1);
  const rec = JSS3_ATTRIBUTIONS.filter(a => a.supplement_id === 'SUP-YO-ORAL-TEXTS');
  assert.equal(rec.length, 1);
  assert.deepEqual(rec[0].credits.map(c => c.id).sort(), ['kolawole-2023', 'noun-eng105-m2']);
});


test('Sango excerpt is preserved exactly, has answers, and does not claim the two remaining genres', () => {
  const evidence = JSON.parse(readFileSync(path.join(root, 'docs/jss3/completion/YO_TEXT_IMPLEMENTATION/SANGO_EXCERPT.json'), 'utf8'));
  const lesson = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-YO-ORAL-GENRES')!;
  assert.ok(lesson.body.includes(evidence.yoruba.join('\n')));
  assert.ok(lesson.body.includes(evidence.printed_translation.join('\n')));
  assert.match(lesson.body, /27 without observation, or 35/);
  assert.match(lesson.body, /out of 19/);
  assert.match(lesson.body, /Accompaniment varies/);
  assert.doesNotMatch(lesson.body, /chanted speech without drum accompaniment/);
  assert.match(lesson.body, /10\. Mama Ṣàngódeyi/);
  assert.equal(register.genres.find((g:any)=>g.id==='sango-pipe').status, 'SUPPORTED');
  assert.equal(register.genres.find((g:any)=>g.id==='oya-pipe').status, 'NOT_SUPPORTED');
  assert.equal(register.genres.find((g:any)=>g.id==='iwi-egungun').status, 'SUPPORTED');
  assert.equal(statusOf('YO-SL-094'), 'REPLACEMENT_IMPLEMENTED_PARTIAL');
});

test('changed Sango body invalidates its attribution hash', () => {
 const modified = JSS3_SUPPLEMENTS.map(s => s.id==='SUP-YO-ORAL-GENRES' ? {...s, body:s.body+' tamper'} : s);
 assert.ok(registerProblems(register,modified,JSS3_ATTRIBUTIONS).some(p=>/attribution body hash is stale/.test(p)));
});

// Y1 (Ọya pípè): no passage is supportable yet, so the genre must stay open and say exactly what is missing.
test('Oya stays NOT_SUPPORTED, names its missing inputs, and no Oya-checked source is usable', () => {
  const oya = register.genres.find((g: any) => g.id === 'oya-pipe');
  assert.equal(oya.status, 'NOT_SUPPORTED');
  assert.equal(oya.lesson_id, null);
  assert.match(oya.missing, /tone marks/);
  assert.match(oya.missing, /reuse basis/);
  assert.match(oya.missing, /SHA-256/);
  const oyaSources = register.sources.filter((s: any) => (s.genres_checked ?? []).includes('oya-pipe'));
  assert.ok(oyaSources.length >= 3, 'examined Oya leads must be recorded');
  assert.ok(oyaSources.every((s: any) => s.verdict !== 'USABLE_VERIFIED'));
  assert.equal(JSS3_SUPPLEMENTS.filter(s => s.id === 'SUP-YO-OYA-TEXT').length, 0, 'no Oya lesson may exist without a verified passage');
  assert.equal(JSS3_ATTRIBUTIONS.filter(a => a.supplement_id === 'SUP-YO-OYA-TEXT').length, 0);
});

test('negative controls: Oya cannot be marked supported without lesson, attribution and a verified bound source', () => {
  const clone = () => structuredClone(register);
  const supported = (mutate: (r: any) => void) => {
    const r = clone();
    const g = r.genres.find((x: any) => x.id === 'oya-pipe');
    g.status = 'SUPPORTED'; g.lesson_id = 'SUP-YO-OYA-TEXT';
    mutate(r);
    return registerProblems(r, JSS3_SUPPLEMENTS as Sup[], JSS3_ATTRIBUTIONS as Attr[]);
  };
  assert.ok(supported(() => {}).some(p => /oya-pipe: supported but lesson SUP-YO-OYA-TEXT is not delivered/.test(p)));
  // a profile/paraphrase source cannot be promoted without hash and lesson binding
  assert.ok(supported(r => { r.sources.find((s: any) => s.id === 'YT-14').verdict = 'USABLE_VERIFIED'; })
    .some(p => /YT-14: usable source needs source_sha256/.test(p)));
  // an unsupported genre may not name a lesson
  const r2 = clone(); r2.genres.find((x: any) => x.id === 'oya-pipe').lesson_id = 'SUP-YO-OYA-TEXT';
  assert.ok(registerProblems(r2, JSS3_SUPPLEMENTS as Sup[], JSS3_ATTRIBUTIONS as Attr[]).some(p => /oya-pipe: not supported but names a lesson/.test(p)));
  // an unsupported genre must say what is missing
  const r3 = clone(); r3.genres.find((x: any) => x.id === 'oya-pipe').missing = ' ';
  assert.ok(registerProblems(r3, JSS3_SUPPLEMENTS as Sup[], JSS3_ATTRIBUTIONS as Attr[]).some(p => /oya-pipe: must say exactly what is missing/.test(p)));
});
