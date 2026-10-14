// Run (unit tests only):
//   cd backend && npx tsx --test ../tests/jss3-first-term.test.mts
// Run with the real-source dry-run audit (no database is touched; --yes is never passed):
//   cd backend && JSS3_FIRST_TERM_ROOT=/path/to/root npx tsx --test ../tests/jss3-first-term.test.mts
// where the root holds the 13 original files from "JSS3 1ST TERM" plus
// "JSS3 Alpha term music Enote.docx" (the converted Music source) and NO .rtf.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  JSS3_FIRST_TERM_REVIEWED_SOURCES,
  applyJss3SourceTextResolution as apply,
  canonicalJss3Week,
  hasJss3SourceResolution,
  resolveJss3ParsedTopic as resolveTopic,
} from '../backend/src/db/jss3CurriculumResolutions.ts';
import { JSS3_ENGLISH_SYMBOL_OCCURRENCES } from '../backend/src/db/jss3EnglishSymbolCorrections.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(here, '..', 'backend');
const T1 = '1st Term';

// ── Fixtures (synthetic, structure-only) ───────────────────────────────────
const BASIC_TECH = [
  'BST – BASIC TECHNOLOGY JSS3', 'SCHEME OF WORK', '10. orthographic drawing ',
  '          11. scale drawing ', '          12. simple blue print reading ', '',
  'week 1; carrier opportunities in technology', 'body one',
  'week 10; orthographic drawing', 'body ten', '',
].join('\n');

const nb = '\u00a0'.repeat(12);
const PHE = [
  'SCHEME', 'WEEK ONE', 'TOPIC: Field Event; POLE VAULT',
  `${nb}WEEK`.concat(' TWO'), 'TOPIC:-JAVELIN',
  `WEEK${nb}3`, 'TOPIC: COMBINED EVENTS',
  `${nb}4TH WEEK`, 'TOPIC: HOCHEY',
  `${nb}5TH ${nb}WEEK`, 'PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY', '',
  'CLASS: J.S.S 3', '', 'SUBJECT: PHYSICAL AND HEALTH EDUCATION', '', 'TOPIC: FEMALE GENITAL MUTILATION', 'fgm body',
  'WEEK 7 & 8', 'TOPIC: FAMILY LIFE', 'WEEK 9', 'TOPIC: AGEING',
  `${nb}WEEK 10`, 'Topic: Physical Fitness', `${nb}WEEK 11`, 'TOPIC: ENERGY', '',
].join('\n');

// ── Scope guards ───────────────────────────────────────────────────────────
test('only First-Term reviewed JSS3 files carry a text rule', () => {
  for (const f of ['BASIC SCIENCE.docx', 'BASIC TECH.docx', 'PHE JS 3.docx', 'js 3 english.doc', 'JS3 YORUBA.docx']) {
    assert.equal(hasJss3SourceResolution(f, T1), true, f);
    assert.equal(hasJss3SourceResolution(f, '2nd Term'), false, `${f} must not resolve in 2nd Term`);
    assert.equal(hasJss3SourceResolution(f, '3rd Term'), false, `${f} must not resolve in 3rd Term`);
  }
  assert.equal(hasJss3SourceResolution('Agric 3.doc', T1), false);
});

test('Second/Third Term and unreviewed files are returned byte-for-byte unchanged', () => {
  for (const term of ['2nd Term', '3rd Term']) {
    assert.equal(apply('BASIC TECH.docx', term, BASIC_TECH), BASIC_TECH);
    assert.equal(apply('PHE JS 3.docx', term, PHE), PHE);
    const topic = { weekLabel: 'week 6', title: 'Covered', body: 'Topics Covered' };
    assert.strictEqual(resolveTopic('BASIC TECH.docx', term, topic), topic);
  }
  assert.equal(apply('SOMETHING ELSE.docx', T1, 'x'), 'x');
});

test('Computer Studies is not part of the reviewed JSS3 First-Term source set', () => {
  assert.equal(JSS3_FIRST_TERM_REVIEWED_SOURCES.some(f => /comput/i.test(f)), false);
  assert.equal(JSS3_FIRST_TERM_REVIEWED_SOURCES.length, 14);
  assert.ok(JSS3_FIRST_TERM_REVIEWED_SOURCES.includes('JSS3 Alpha term music Enote.docx'));
  assert.equal(JSS3_FIRST_TERM_REVIEWED_SOURCES.some(f => /\.rtf$/i.test(f)), false);
});

// ── Basic Technology: scale drawing + simple blueprint reading ─────────────
test('Basic Tech: appends exactly the two scheme-only headings, phrases verbatim from the scheme', () => {
  const out = apply('BASIC TECH.docx', T1, BASIC_TECH);
  assert.ok(out.startsWith(BASIC_TECH.replace(/\s+$/, '')), 'original text is preserved as a prefix');
  const tail = out.slice(BASIC_TECH.replace(/\s+$/, '').length).split('\n').filter(Boolean);
  assert.deepEqual(tail, ['week 11; scale drawing', 'week 12; simple blue print reading']);
});
test('Basic Tech: throws if a scheme anchor is missing or a Week 11/12 body now exists', () => {
  assert.throws(() => apply('BASIC TECH.docx', T1, BASIC_TECH.replace('11. scale drawing', '11. scaling')), /scale drawing/);
  assert.throws(() => apply('BASIC TECH.docx', T1, BASIC_TECH.replace('12. simple blue print reading', '12. other')), /blue print/);
  assert.throws(() => apply('BASIC TECH.docx', T1, `${BASIC_TECH}\nweek 11; scale drawing\nreal body`), /no longer applies/);
});
test('Basic Tech: title comes from the week heading (fixes "Topics Covered" -> "Covered")', () => {
  const t = resolveTopic('BASIC TECH.docx', T1, {
    weekLabel: 'week 6', title: 'Covered',
    body: 'week 6; processing of ceramics and glass\n\nTopics Covered\nx',
  });
  assert.equal(t?.title, 'processing of ceramics and glass');
  assert.equal(t?.weekLabel, 'week 6');
});

// ── PHE: hockey heading + week-marker recovery ─────────────────────────────
test('PHE: NBSP / ordinal-first markers normalised, Week 6 inserted, hockey heading sits under Week 5', () => {
  const out = apply('PHE JS 3.docx', T1, PHE);
  const markers = out.split('\n').filter(l => /^WEEK\b/.test(l)).map(l => l.trim());
  assert.deepEqual(markers, ['WEEK ONE', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5', 'WEEK 6', 'WEEK 7 & 8', 'WEEK 9', 'WEEK 10', 'WEEK 11']);
  assert.match(out, /WEEK 5\n+PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY\n+WEEK 6\n+CLASS: J\.S\.S 3/);
  // Nothing beyond marker lines changed; only "WEEK 6" is new.
  const strip = (s: string) => s.split('\n').filter(l => !/week/i.test(l)).map(l => l.replace(/[\s\u00a0]+/g, ' ').trim()).filter(Boolean);
  assert.deepEqual(strip(out), strip(PHE));
});
test('PHE: throws if the marker defects are not exactly the six reviewed ones', () => {
  assert.throws(() => apply('PHE JS 3.docx', T1, PHE.replace(`${nb}WEEK 11`, 'WEEK 11')), /expected 6/);
  assert.throws(() => apply('PHE JS 3.docx', T1, PHE.replace('TOPIC: FEMALE GENITAL MUTILATION', 'TOPIC: OTHER')), /Female Genital|FEMALE GENITAL/i);
});

// ── Other rules ────────────────────────────────────────────────────────────
test('Basic Science: scheme cut, EIEGHT fixed, Week 3 marker added; throws without anchors', () => {
  const src = [
    'Jss 3 Alpha Term E-note', 'Week ONE—Drug and Substances Abuse', 'Week THREE- Family Traits', 'Week EIGHT-Environmental Hazard FIVE (Desertification)',
    'WEEK ONE-DRUG AND SUBSTANCES ABUSE (!)', 'a', 'WEEK TWO', 'b', 'CAPTER THREE --FAMILY TRAITS', 'c',
    'WEEK FOUR-SOIL EROSION', 'WEEK EIEGHT- DESERTIFICATION', 'd', '',
  ].join('\n');
  const out = apply('BASIC SCIENCE.docx', T1, src);
  assert.ok(out.startsWith('WEEK ONE-DRUG AND SUBSTANCES ABUSE (!)'));
  assert.match(out, /WEEK THREE-FAMILY TRAITS\n\nCAPTER THREE --FAMILY TRAITS/);
  assert.match(out, /^WEEK EIGHT- DESERTIFICATION$/m);
  assert.doesNotMatch(out, /EIEGHT/);
  assert.throws(() => apply('BASIC SCIENCE.docx', T1, src.replace('CAPTER THREE --FAMILY TRAITS', 'X')), /anchor missing/);
});
test('English: starts at WEEK ONE (1); throws if absent', () => {
  // Task 3: the English rule also requires every symbol-correction anchor, so the fixture carries them (as the real source does).
  const ctx = JSS3_ENGLISH_SYMBOL_OCCURRENCES.map(o => o.before).join('\n');
  const src = `ENGLISH\nSCHEME\nWEEK\n1\nRevision\nWEEK ONE (1)\nbody\n${ctx}\n`;
  const out = apply('js 3 english.doc', T1, src);
  assert.ok(out.startsWith('WEEK ONE (1)\nbody\n'));
  assert.ok(!out.includes('ENGLISH\nSCHEME'));
  assert.throws(() => apply('js 3 english.doc', T1, 'no body'), /anchor missing/);
  assert.throws(() => apply('js 3 english.doc', T1, 'WEEK ONE (1)\nbody\n'), /expected exactly one match/);
});
test('Yoruba: scheme cut and exactly six OSE ordinals translated; unreviewed OSE heading throws', () => {
  const body = ['KINNI', 'KETA', 'KERIN', 'KARUN', 'KEFA', 'KEJE'].map(o => `OSE ${o}\nAKORI EKO: x\ntext`).join('\n');
  const src = `ALPHA TERM\nOSE\n1\nEDE – a\n13\nIdanwo\n${body}\n`;
  const out = apply('JS3 YORUBA.docx', T1, src);
  assert.deepEqual(out.split('\n').filter(l => /^WEEK/.test(l)), ['WEEK 1', 'WEEK 3', 'WEEK 4', 'WEEK 5', 'WEEK 6', 'WEEK 7']);
  assert.doesNotMatch(out, /OSE/);
  assert.throws(() => apply('JS3 YORUBA.docx', T1, `${src}OSE KEJO\nx`), /unreviewed Yoruba OSE/);
  assert.throws(() => apply('JS3 YORUBA.docx', T1, src.replace('OSE KEFA', 'OSE KEFAA')), /expected exactly one "OSE KEFA"/);
});

// ── Title-only corrections ─────────────────────────────────────────────────
test('Titles: Music wk5 / Home Econ wk2 recovered; separators stripped; weeks and bodies untouched', () => {
  const m = resolveTopic('JSS3 Alpha term music Enote.docx', T1, {
    weekLabel: 'WEEK FIVE', title: 'There some musical terms', body: 'WEEK FIVE\n\nTERMS AND SIGNS\n\nThere some musical terms',
  });
  assert.equal(m?.title, 'TERMS AND SIGNS');
  const h = resolveTopic('HOME ECONS JS3 WK7-10.docx', T1, {
    weekLabel: 'WEEK 2', title: 'Fibres are classified', body: 'WEEK 2\n\nCLASSES AND PROPERTIES OF FIBRES\n\nFibres are classified',
  });
  assert.equal(h?.title, 'CLASSES AND PROPERTIES OF FIBRES');
  const b = resolveTopic('BASIC SCIENCE.docx', T1, { weekLabel: 'WEEK FOUR', title: '-SOIL EROSION', body: 'x' });
  assert.deepEqual([b?.title, b?.weekLabel, b?.body], ['SOIL EROSION', 'WEEK FOUR', 'x']);
  assert.throws(() => resolveTopic('JSS3 Alpha term music Enote.docx', T1, { weekLabel: 'WEEK FIVE', title: 't', body: 'no heading' }), /anchor missing/);
});
test('canonicalJss3Week', () => {
  assert.deepEqual(['WEEK ONE', 'week 7 & 8', 'Week: Two', 'WEEK   7', 'WEEK 7 and 8'].map(canonicalJss3Week), ['1', '7&8', '2', '7', '7&8']);
});

// ── Wiring: JSS1/JSS2 branches untouched, JSS3 branches present ────────────
test('ingestTopics.ts wires JSS3 without altering the JSS1/JSS2 branches', () => {
  const s = readFileSync(path.join(backendDir, 'src/db/ingestTopics.ts'), 'utf8');
  assert.match(s, /text = applyJss1SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);/);
  assert.match(s, /text = applyJss2SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);/);
  assert.match(s, /\} else if \(validClassNames\.includes\('JSS 3'\)\) \{\s*text = applyJss3SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);/);
  assert.match(s, /className === 'JSS 1'\s*\? resolveJss1ParsedTopic\(path\.basename\(filePath\), termLabel, topic\)\s*: className === 'JSS 3'\s*\? resolveJss3ParsedTopic/);
});

// ── Real-source dry-run audit (only when a root is supplied) ───────────────
const ROOT = process.env.JSS3_FIRST_TERM_ROOT;
const real = { skip: ROOT ? false : 'set JSS3_FIRST_TERM_ROOT to run the real-source audit' } as const;

function audit(): string {
  assert.ok(ROOT && existsSync(ROOT), 'JSS3_FIRST_TERM_ROOT must exist');
  // Dry run only: --yes is intentionally never passed, so no DB connection is opened.
  return execFileSync('npx', ['tsx', 'src/db/ingestTopics.ts', '--root', ROOT!, '--school-code', 'secondary'], {
    cwd: backendDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
}
// 1F-R4C reconciliation (evidence: AGENT_1F-R4B full-source run, First-only dry run = 131 rows):
//   English Language 9 -> 20   patches 01-04: js 3 english.doc is split into its separate weekly activities
//   Basic Technology 12 -> 10  patch 06 holds weeks 11 "scale drawing" and 12 "simple blue print reading"
//   Physical & Health Education 10 -> 9  patch 06 holds week 5 hockey practical demonstration
// 123 + 11 - 2 - 1 = 131. Every other subject is unchanged.
const EXPECTED: Record<string, number> = {
  'Agricultural Science': 7, 'Basic Science': 9, 'Basic Technology': 10, 'Business Studies': 6,
  'Civic Education': 8, 'Cultural & Creative Arts': 11, 'English Language': 20, 'French': 9,
  'Home Economics': 7, 'Mathematics': 10, 'Music': 8, 'Physical & Health Education': 9,
  'Social Studies': 11, 'Yoruba': 6,
};
let cached: string | undefined;
const out = () => (cached ??= audit());

test('real sources: audit passes, 14 files, 131 rows, per-subject counts as reviewed', real, () => {
  const o = out();
  assert.match(o, /Parsed 131 topic row\(s\) from 14 file\(s\)\./);
  assert.match(o, /FILE AUDIT PASSED/);
  assert.match(o, /Dry run only — no database connection or changes\./);
  for (const [subject, n] of Object.entries(EXPECTED)) {
    assert.ok(o.includes(`  JSS 3 / ${subject} / 1st Term: ${n}\n`), `${subject} should have ${n} rows`);
  }
  assert.equal(Object.values(EXPECTED).reduce((a, b) => a + b, 0), 131);
});
test('real sources: First Term only, no Computer Studies, no RTF, Music comes from the converted docx', real, () => {
  const o = out();
  assert.doesNotMatch(o, /JSS 3 \/ [^\n]* \/ (2nd|3rd) Term/);
  assert.doesNotMatch(o, /Computer/i);
  assert.doesNotMatch(o, /Unsupported source format/);
  assert.equal(readdirSync(ROOT!, { recursive: true }).some(f => /\.rtf$/i.test(String(f))), false);
  assert.match(o, /JSS 3 \/ Music \/ 1st Term #1: [^\n]*JSS3 Alpha term music Enote\.docx \/ WEEK ONE/);
});
// 1F-R3: the manifest marks these three "pending parser and plan integration; do not import" and no approval was
// supplied. They are HELD in the audit report, not import rows. Female Genital Mutilation (Week 6) stays, now #5.
test('real sources: the three scheme-only headings are held in the audit report and are not import rows (1F-R3)', real, () => {
  const o = out();
  assert.match(o, /JSS3 PENDING ENTRIES — HELD, NOT IMPORTED .*: 3\n/);
  assert.match(o, /HELD: JSS 3 \/ Basic Technology \/ original term 1st Term \/ [^\n]*BASIC TECH\.docx \/ week 11 [^\n]*\/ scale drawing\n/);
  assert.match(o, /HELD: JSS 3 \/ Basic Technology \/ original term 1st Term \/ [^\n]*BASIC TECH\.docx \/ week 12 [^\n]*\/ simple blue print reading\n/);
  assert.match(o, /HELD: JSS 3 \/ Physical & Health Education \/ original term 1st Term \/ [^\n]*PHE JS 3\.docx \/ WEEK 5 [^\n]*\/ Practical demonstration of basic skills of hockey\n/);
  const order = o.slice(o.indexOf('Normal curriculum order'));
  assert.doesNotMatch(order, /BASIC TECH\.docx \/ week 1[12] \//);
  assert.doesNotMatch(order, /PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY/);
  assert.match(order, /Physical & Health Education \/ 1st Term #4: [^\n]*WEEK 4 \/ HOCHEY\n/);
  assert.match(order, /Physical & Health Education \/ 1st Term #5: [^\n]*WEEK 6 \/ FEMALE GENITAL MUTILATION\n/);
});
test('real sources: per-subject order is gap-free and week numbers never go backwards', real, () => {
  const rows = [...out().matchAll(/^  JSS 3 \/ (.+?) \/ 1st Term #(\d+): (.+?) \/ ([^/\n]+?) \/ (.*)$/gm)];
  assert.equal(rows.length, 131);
  const bySubject = new Map<string, Array<{ n: number; wk: number }>>();
  for (const [, subject, n, , week] of rows) {
    const wk = Number(canonicalJss3Week(week).match(/^\d+/)?.[0] ?? NaN);
    assert.ok(Number.isFinite(wk), `unparseable week "${week}" in ${subject}`);
    (bySubject.get(subject) ?? bySubject.set(subject, []).get(subject)!).push({ n: Number(n), wk });
  }
  for (const [subject, list] of bySubject) {
    list.forEach((r, i) => assert.equal(r.n, i + 1, `${subject}: order gap at #${i + 1}`));
    list.forEach((r, i) => i > 0 && assert.ok(r.wk >= list[i - 1].wk, `${subject}: week order regresses at #${r.n}`));
  }
});
test('real sources: the defects found in review are gone', real, () => {
  const o = out();
  assert.doesNotMatch(o, /week 6 \/ Covered/);
  assert.doesNotMatch(o, /js 3 english\.doc \/ WEEK \n/);
  assert.doesNotMatch(o, /Basic Science \/ 1st Term #\d+: [^\n]*\/ Week (ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE) \//);
  assert.doesNotMatch(o, /Yoruba \/ 1st Term #\d+: [^\n]*\/ Week 13/);
  assert.doesNotMatch(o, /Music \/ 1st Term #5: [^\n]*There some musical/);
  assert.doesNotMatch(o, /\/ (week \d+|WEEK [A-Z]+|WEEK \d+) \/ [;:\-–—]/);
});
