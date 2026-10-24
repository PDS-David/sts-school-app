// R1: Ọya pípè and iwì egúngún. Neither genre is delivered (no byte-verified source). These tests keep the
// evidence-only state honest and keep the drafted iwì lesson consistent with its candidate record.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
import { JSS3_ATTRIBUTIONS, attributionBodyHash } from '../backend/src/db/jss3Attributions.js';
import { iwiClaimProblems } from './jss3-yo-iwi.test.mts';

const root = path.resolve(import.meta.dirname, '..');
const R1 = path.join(root, 'docs/jss3/completion/R1_YORUBA_TEXTS');
const register = JSON.parse(readFileSync(path.join(root, 'docs/jss3/completion/YO_TEXT/SOURCE_RIGHTS_REGISTER.json'), 'utf8'));
const cand = JSON.parse(readFileSync(path.join(R1, 'IWI_CANDIDATE.json'), 'utf8'));
const body = readFileSync(path.join(root, cand.draft_lesson.body_file), 'utf8');
const genre = (id: string) => register.genres.find((g: any) => g.id === id);

test('draft iwì lesson quotes exactly the candidate lines and is hash-pinned', () => {
  assert.equal(createHash('sha256').update(body).digest('hex'), cand.draft_lesson.draft_body_sha256);
  for (const l of cand.selected_lines) {
    assert.ok(body.includes(l.yoruba), `missing Yoruba line ${l.printed_line}`);
    assert.ok(body.includes(`"${l.printed_english}"`), `missing English line ${l.printed_line}`);
  }
  assert.equal(cand.omitted_printed_line, 3);
  assert.ok(!body.includes('ìdílẹ̀kẹ̀'), 'omitted line 3 must not be reproduced');
});

test('draft is labelled modern, has answers, and its marks add up', () => {
  assert.match(body, /MODERN EQUIVALENT/);
  assert.doesNotMatch(body, /inherited traditional/i);
  assert.match(body, /not a chant handed down/);
  assert.ok(body.includes('Practice:') && body.includes('Answers and marking guide'));
  const practice = body.slice(body.indexOf('Practice:'), body.indexOf('Answers and marking guide'));
  const marks = [...practice.matchAll(/\((\d)\)\s*$/gm)].map(m => Number(m[1]));
  assert.equal(marks.length, 7);
  assert.equal(marks.reduce((a, b) => a + b, 0), cand.draft_lesson.written_marks);
  assert.match(body, /Total 15 marks/);
  assert.ok(body.includes('https://doi.org/10.3389/fcomm.2022.1029400') && body.includes('CC BY'));
});

test('neither R1 lesson is delivered and both genres stay NOT_SUPPORTED with a single named action', () => {
  for (const id of ['SUP-YO-OYA-TEXT', 'SUP-YO-IWI-TEXT']) {
    assert.equal(JSS3_SUPPLEMENTS.filter(s => s.id === id).length, 0);
    assert.equal(JSS3_ATTRIBUTIONS.filter(a => a.supplement_id === id).length, 0);
  }
  for (const id of ['oya-pipe', 'iwi-egungun']) {
    assert.equal(genre(id).status, 'NOT_SUPPORTED');
    assert.equal(genre(id).lesson_id, null);
    assert.match(genre(id).missing, /SINGLE ACQUISITION ACTION \(R1\)/);
  }
  const row = register.sources.find((s: any) => s.id === 'YT-R1-IWI-01');
  assert.equal(row.verdict, 'UNVERIFIED_LEAD');
  assert.equal(row.text_kind, 'labelled_modern_equivalent');
  assert.ok(!row.source_sha256);
  assert.ok(register.sources.every((s: any) => s.verdict !== 'USABLE_VERIFIED' || s.id === 'YT-13'));
});

test('negative control: delivering the draft without a byte-verified source is rejected by the real iwì gate', () => {
  const lesson = { id: 'SUP-YO-IWI-TEXT', termLabel: '1st Term', gapIds: ['YO-SL-094'], body };
  const attr = { supplement_id: 'SUP-YO-IWI-TEXT', body_sha256: attributionBodyHash(body) };
  const reg = structuredClone(register);
  const g = reg.genres.find((x: any) => x.id === 'iwi-egungun');
  g.status = 'SUPPORTED'; g.lesson_id = 'SUP-YO-IWI-TEXT';
  const row = reg.sources.find((s: any) => s.id === 'YT-R1-IWI-01'); row.lesson_id = 'SUP-YO-IWI-TEXT';
  assert.ok(iwiClaimProblems(reg, [lesson as any], [attr as any]).some(p => /no byte-verified source/.test(p)));
  // the same claim passes the source check only with a 64-hex hash and verdict, which R1 does not have
  row.verdict = 'USABLE_VERIFIED'; row.source_sha256 = 'c'.repeat(64);
  assert.deepEqual(iwiClaimProblems(reg, [lesson as any], [attr as any]), []);
});

const hasLxml = spawnSync('python3', ['-c', 'import lxml'], { encoding: 'utf8' }).status === 0;
// Explicit skip when python lxml is missing; the verifier is an owner-run tool, not a CI dependency.
test('verifier script: synthetic fixture passes, altered line fails (fixture is synthetic, not a capture)', { skip: !hasLxml && 'python3 lxml not installed' }, () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'r1-'));
  const page = (alter: boolean) => '<html><body><p>Ìwí Egúngún triply long vowel vowel insertion and lengthening. composed by the third author of this paper. Creative Commons Attribution License (CC BY).</p>'
    + cand.selected_lines.map((l: any, i: number) => `<p>${alter && i === 1 ? l.yoruba.replace('Lépolóyin', 'Lépolóyiñ') : l.yoruba}</p><p>"${l.printed_english}"</p>`).join('') + '</body></html>';
  const run = (name: string, alter: boolean) => {
    const f = path.join(dir, name); writeFileSync(f, page(alter), 'utf8');
    return { f, r: spawnSync('python3', [path.join(root, 'scripts/jss3/yo_text/verify_iwi_candidate.py'), f], { encoding: 'utf8' }) };
  };
  const ok = run('ok.html', false);
  assert.equal(ok.r.status, 0, ok.r.stderr);
  assert.equal(JSON.parse(ok.r.stdout).source_sha256, createHash('sha256').update(readFileSync(ok.f)).digest('hex'));
  const bad = run('bad.html', true);
  assert.equal(bad.r.status, 1);
  assert.equal(JSON.parse(bad.r.stdout).yoruba_lines_match, false);
});
