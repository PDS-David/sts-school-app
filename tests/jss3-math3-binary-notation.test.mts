// MATH3: base/exponent notation in the First-Term Mathematics rows BINARY NUMBERS and APLLICATION OF BINARY NUMBERS.
// The school note writes bases (8 lowered 10, 1000 lowered 2) and powers (2 raised 2, 2 raised -1) as ordinary-run
// subscript/superscript formatting. The executable original text flattens them into glued digits ("1012", "1x22"), so
// learners are given the replacement lesson SUP-MATH-BINARY instead. These tests check the REPLACEMENT learners receive:
// its power/base notation is explicit, every expansion is numerically right, and the glued misreadings are refuted.
// CI-safe tests need no private corpus. The real-source test needs JSS3_ALL_ROOT (set by verify_handoff.py) and is an
// explicit skip without it: a skip is NOT a pass of the source check.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { createDeliveryResolver, deliveryHash, type DeliveryCorrection, type DeliveryLesson } from '../backend/src/utils/jss3DeliveryCorrection.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const lessons: any[] = JSON.parse(readFileSync(path.join(ROOT, 'backend/src/db/data/jss3Supplements.json'), 'utf8'));
const corrections: any[] = JSON.parse(readFileSync(path.join(ROOT, 'backend/src/db/data/jss3DeliveryCorrections.json'), 'utf8'));
const lesson = lessons.find(l => l.id === 'SUP-MATH-BINARY');
const body: string = lesson.body;

// ---- exact rational arithmetic ---------------------------------------------------------------------------------
type Q = [number, number];
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const q = (n: number, d = 1): Q => { const g = gcd(n, d) || 1; return [n / g, d / g]; };
const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const same = (a: Q, b: Q) => a[0] === b[0] && a[1] === b[1];
const pow2 = (k: number): Q => (k >= 0 ? q(2 ** k) : q(1, 2 ** -k));
const SUP: Record<string, number> = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4 };

/** Independent base-two reader: digits left of the point weigh 2^k, digits right of it weigh 2^-k. */
function binaryValue(numeral: string): Q {
  const [whole, frac = ''] = numeral.split('.');
  let v = q(0);
  [...whole].reverse().forEach((d, i) => { v = add(v, mul(q(Number(d)), pow2(i))); });
  [...frac].forEach((d, i) => { v = add(v, mul(q(Number(d)), pow2(-(i + 1)))); });
  return v;
}
/** "5", "1/2", "9/16" or the mixed number "2 9/16". */
function number(text: string): Q {
  const t = text.trim();
  const mixed = /^(\d+) (\d+)\/(\d+)$/.exec(t); if (mixed) return add(q(Number(mixed[1])), q(Number(mixed[2]), Number(mixed[3])));
  const frac = /^(\d+)\/(\d+)$/.exec(t); if (frac) return q(Number(frac[1]), Number(frac[2]));
  assert.match(t, /^\d+$/, `unreadable number ${t}`); return q(Number(t));
}
const sumOf = (text: string): Q => text.split(' + ').reduce((acc, t) => add(acc, number(t)), q(0));
/** "1×2² + 0×2^(-1)" read as digit × power of two. The exponent is the raised number, never part of the multiplier. */
function powerSum(terms: string): { value: Q; digits: string; exponents: number[] } {
  let value = q(0); let digits = ''; const exponents: number[] = [];
  for (const t of terms.split(' + ')) {
    const m = /^(\d)×2(?:([⁰¹²³⁴])|\^\(-(\d)\))$/.exec(t.trim()); assert.ok(m, `bad power term "${t}"`);
    const k = m[2] !== undefined ? SUP[m[2]] : -Number(m[3]);
    value = add(value, mul(q(Number(m[1])), pow2(k))); digits += m[1]; exponents.push(k);
  }
  return { value, digits, exponents };
}

const EXPANSION = /(\d+(?:\.\d+)?)(?: \(base 2\))? = ((?:\d×2(?:[⁰¹²³⁴]|\^\(-\d\))(?: \+ )?)+) = ([^=]+?) = (\d+(?: \d+\/\d+|\/\d+)?)(?= \(base 10\)| and |\.(?:\s|$))/g;
const expansions = [...body.matchAll(EXPANSION)];

test('replacement teaches powers of two explicitly: 2⁰…2⁴ and 2^(-1)…2^(-4) with the right values', () => {
  const table = /Powers of two: (2⁰ = 1, 2¹ = 2, 2² = 4, 2³ = 8, 2⁴ = 16)\. Right of the point the powers are negative: (2\^\(-1\) = 1\/2, 2\^\(-2\) = 1\/4, 2\^\(-3\) = 1\/8, 2\^\(-4\) = 1\/16)\./.exec(body);
  assert.ok(table, 'power table missing or reworded');
  for (const m of `${table[1]}, ${table[2]}`.matchAll(/2(?:([⁰¹²³⁴])|\^\(-(\d)\)) = (\d+(?:\/\d+)?)/g)) {
    const k = m[1] !== undefined ? SUP[m[1]] : -Number(m[2]);
    assert.ok(same(pow2(k), number(m[3])), `2 to the power ${k} is not ${m[3]}`);
  }
});

test('every power-of-two expansion in the replacement multiplies out to the numeral it expands, and to the stated base-ten value', () => {
  const found = expansions.map(m => m[1]);
  assert.deepEqual(found, ['101', '111', '10101', '10.1001', '1101', '0.11']);
  for (const m of expansions) {
    const [, numeral, terms, arithmetic, stated] = m;
    const { value, digits, exponents } = powerSum(terms);
    // A zero whole part ("0.11") is not expanded; every other digit is, in order.
    const shown = numeral.startsWith('0.') ? numeral.slice(1) : numeral;
    const plain = shown.replace('.', '');
    assert.equal(digits, plain, `${numeral}: the digits multiplied must be the numeral's digits in order`);
    const point = shown.includes('.') ? shown.indexOf('.') : shown.length;
    assert.deepEqual(exponents, [...plain].map((_, i) => point - 1 - i), `${numeral}: exponent of each digit follows its place`);
    assert.ok(same(value, binaryValue(numeral)), `${numeral}: expansion value`);
    assert.ok(same(sumOf(arithmetic), value), `${numeral}: the written sum ${arithmetic} is not the expansion value`);
    assert.ok(same(number(stated), value), `${numeral}: stated value ${stated}`);
  }
});

test('worked results are the independently computed values: 101 = 5, 111 = 7, 10101 = 21, 10.1001 = 2 9/16, 1101 = 13, 0.11 = 3/4', () => {
  const want: Record<string, string> = { '101': '5', '111': '7', '10101': '21', '10.1001': '2 9/16', '1101': '13', '0.11': '3/4' };
  for (const m of expansions) assert.ok(same(number(want[m[1]]), binaryValue(m[1])), m[1]);
  assert.equal(expansions.length, Object.keys(want).length);
  assert.ok(same(number('2 9/16'), q(41, 16)) && !same(number('2 9/16'), q(29, 16)), 'mixed number 2 9/16 is 41/16, not 29/16');
});

test('the glued misreadings are refuted, and they would give different numbers', () => {
  // Raised exponent read as a second digit of the multiplier ("1x22" as 1 x 22): wrong value for every note expansion.
  for (const m of expansions) {
    const { digits, exponents } = powerSum(m[2]);
    const glued = [...digits].reduce((s, d, i) => s + Number(d) * Number(`2${Math.abs(exponents[i])}`), 0);
    assert.notEqual(glued, Number(number(m[4])[0]) / Number(number(m[4])[1]), `${m[1]}: gluing the exponent must change the value`);
  }
  assert.match(body, /the note's 1x22 means 1×2² = 4, never 1×22/);
  assert.equal(1 * 22, 22); assert.notEqual(1 * 22, 4);
  // Negative power read as subtraction: 2 - 1 = 1, but 2^(-1) = 1/2.
  assert.match(body, /so 2\^\(-1\) is 1\/2, not 2 - 1/);
  assert.ok(!same(pow2(-1), q(2 - 1)));
  // Lowered base read as a digit: the numeral 1012 is a four-digit decimal numeral, 101 (base 2) is five.
  assert.match(body, /the note's 1012 means 101 \(base 2\) and 8510 means 85 \(base 10\)/);
  assert.ok(!same(q(1012), binaryValue('101')));
  // The three slips in the school note stay corrected in the lesson learners receive.
  assert.match(body, /10101 \(base 2\) = 16 \+ 4 \+ 1 = 21 \(base 10\), not 27/);
  assert.match(body, /111 \(base 2\) = 4 \+ 2 \+ 1 = 7, not 9/);
  assert.match(body, /P is 16, so its code is 10000, not 1000 \(which is 8\)/);
});

test('the one bare numeral in the practice questions carries its meaning: 102 (digits one, zero, two) is not a base-two numeral', () => {
  assert.match(body, /Explain why the numeral 102 \(the digits one, zero, two, with no base label\) cannot be a binary numeral/);
  assert.ok([...'102'].some(d => d !== '0' && d !== '1'));
});

test('runtime delivery for BINARY NUMBERS and APLLICATION OF BINARY NUMBERS serves this lesson (with the figures lesson), notation included', () => {
  const real = corrections.filter(c => c.id === 'A-MATHEMATICS-1-02' || c.id === 'A-MATHEMATICS-1-03');
  assert.equal(real.length, 2);
  for (const c of real) assert.deepEqual(c.replacement_lesson_ids, ['SUP-MATH-BINARY', 'SUP-MATH-V2-FIGURES-1']);
  // Same resolver code as production, with a stand-in source text hashing to the correction (the real hashes belong to the private originals).
  const standIn = 'stand-in for the audited original';
  const resolver = createDeliveryResolver(real.map(c => ({ ...c, source_body_sha256: deliveryHash(`${standIn} ${c.id}`) })) as DeliveryCorrection[], lessons as DeliveryLesson[]);
  for (const c of real) {
    const r = resolver({ school_code: c.school_code, class_name: c.class_name, subject_name: 'Mathematics', term_label: '1st Term', title: c.source_title, source_reference: `${standIn} ${c.id}` });
    assert.equal(r?.kind, 'corrected');
    if (r?.kind !== 'corrected') continue;
    assert.ok(r.text.includes(body), 'the learner-facing text must contain the whole current lesson body');
    assert.ok(r.text.includes('1×2² + 0×2¹ + 1×2⁰') && r.text.includes('2^(-4)'));
    assert.ok(!r.text.includes('8510 = 1010101two'), 'glued original text must not reach the learner');
    const before = r.fingerprint;
    const edited = createDeliveryResolver(real.map(x => ({ ...x, source_body_sha256: deliveryHash(`${standIn} ${x.id}`) })) as DeliveryCorrection[],
      (lessons as DeliveryLesson[]).map(l => (l.id === 'SUP-MATH-BINARY' ? { ...l, body: `${l.body} ` } : l)));
    const after = edited({ school_code: c.school_code, class_name: c.class_name, subject_name: 'Mathematics', term_label: '1st Term', title: c.source_title, source_reference: `${standIn} ${c.id}` });
    assert.ok(after?.kind === 'corrected' && after.fingerprint !== before, 'editing the lesson must change the fingerprint so cached assessments retire');
  }
});

const root = process.env.JSS3_ALL_ROOT;
test('REAL SOURCE: every power and base in the two binary rows is covered by the delivered notation; APPLICATION has none', { skip: root ? false : 'JSS3_ALL_ROOT not set: source check NOT run' }, () => {
  const docx = path.join(root!, 'JSS3 1ST TERM ', 'JSS 3 MATHEMATICS.docx');
  const script = `
import sys,json,zipfile
from lxml import etree
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
ps=list(etree.fromstring(zipfile.ZipFile(sys.argv[1]).read('word/document.xml')).iter('{%s}p'%W))
def text(p): return ''.join(t.text or '' for t in p.iter('{%s}t'%W))
def start(title): return next(i for i,p in enumerate(ps) if text(p).strip()==title)
b,a,e=start('BINARY NUMBERS'),start('APLLICATION OF BINARY NUMBERS'),start('ALGEBRAIC PROCESSES')
def runs(lo,hi):
    out=[]
    for i in range(lo,hi):
        for r in ps[i].iter('{%s}r'%W):
            va=r.find('{%s}rPr/{%s}vertAlign'%(W,W))
            if va is not None: out.append([va.get('{%s}val'%W),''.join(t.text or '' for t in r.iter('{%s}t'%W)).strip()])
    return out
print(json.dumps(dict(binary=runs(b,a),application=runs(a,e))))`;
  const r = spawnSync('python3', ['-I', '-c', script, docx], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr);
  const s = JSON.parse(r.stdout) as { binary: [string, string][]; application: [string, string][] };
  assert.deepEqual(s.application, [], 'APLLICATION OF BINARY NUMBERS has no superscript/subscript run');
  const sup = new Set(s.binary.filter(([k, t]) => k === 'superscript' && t).map(([, t]) => Number(t)));
  assert.deepEqual([...sup].sort((x, y) => x - y), [-4, -3, -2, -1, 0, 1, 2, 3, 4], 'powers used by the note');
  const sub = new Set(s.binary.filter(([k, t]) => k === 'subscript' && /^[\w]+$/.test(t)).map(([, t]) => t));
  for (const label of sub) assert.ok(['10', 'ten', '2', 'two'].includes(label), `unexpected base label ${label}`);
  assert.ok(sub.has('10') && sub.has('ten') && sub.has('2') && sub.has('two'));
  // Delivered coverage: each power in the note appears in the replacement in explicit notation; each base label as "(base 2)" / "(base 10)".
  const exponents = new Set(expansions.flatMap(m => powerSum(m[2]).exponents));
  for (const k of sup) assert.ok(exponents.has(k), `power ${k} used in the note is not expanded in the replacement`);
  assert.ok(body.includes('(base 2)') && body.includes('(base 10)'));
});
