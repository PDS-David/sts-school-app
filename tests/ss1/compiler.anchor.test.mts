import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRules } from '../../backend/src/db/ss1/compiler.js';
import { loadPackages } from '../../backend/src/db/ss1/loader.js';

const agriculture = loadPackages().find(item => item.subject_slug === 'agricultural-science');
if (!agriculture) throw new Error('Agricultural Science package is missing');
const marker = agriculture.source_rules.find(item => item.id === 'SS1-SRC-956594d97094-R003');
if (!marker || marker.op !== 'classify_marker') {
  throw new Error('Expected terminal Agricultural Science revision marker rule is missing');
}

test('source anchors tolerate DOCX extraction whitespace differences without changing content', () => {
  const extractedText = marker.anchor.replace(/\s+/gu, ' ');
  const input = {
    source_id: marker.source_id,
    sha256: marker.source_sha256,
    filePath: 'SSS 1/1st Term SS1_/Agricultural Science.docx',
    text: extractedText,
  };
  assert.equal(applyRules(input, [marker]), extractedText);
});

test('source anchors still reject missing and ambiguous matches', () => {
  const base = {
    source_id: marker.source_id,
    sha256: marker.source_sha256,
    filePath: 'SSS 1/1st Term SS1_/Agricultural Science.docx',
  };
  assert.throws(
    () => applyRules({ ...base, text: 'unrelated source text' }, [marker]),
    /anchor missing or ambiguous/,
  );
  assert.throws(
    () => applyRules({ ...base, text: marker.anchor + '\n' + marker.anchor }, [marker]),
    /anchor missing or ambiguous/,
  );
});

const splitRule = (anchor: string) => ({
  id: 'RULE-ANCHOR-TEST',
  op: 'split_before' as const,
  source_id: 'SS1-SRC-ANCHOR-TEST',
  source_sha256: 'a'.repeat(64),
  anchor,
  week_label: '2',
  evidence: { locator: 'test', explanation: 'test' },
});
const anchorInput = (text: string) => ({ source_id: 'SS1-SRC-ANCHOR-TEST', sha256: 'a'.repeat(64), filePath: 'test.docx', text });

test('an indented anchor starts at the beginning of its line and the label goes before the indentation', () => {
  const rule = splitRule('    PETTY CASH BOOK');
  assert.equal(
    applyRules(anchorInput('intro\n    PETTY CASH BOOK\nbody'), [rule as never]),
    'intro\nWEEK 2\n    PETTY CASH BOOK\nbody',
  );
});

test('an indented anchor is still rejected when it does not start a line', () => {
  const rule = splitRule('    PETTY CASH BOOK');
  assert.throws(
    () => applyRules(anchorInput('intro text    PETTY CASH BOOK\nbody'), [rule as never]),
    /anchor must start at a line boundary/,
  );
});

test('runs of whitespace inside an anchor match any whitespace run without changing the text', () => {
  const rule = splitRule('PETTY  CASH   BOOK');
  assert.equal(
    applyRules(anchorInput('intro\nPETTY\tCASH BOOK\nbody'), [rule as never]),
    'intro\nWEEK 2\nPETTY\tCASH BOOK\nbody',
  );
});

test('anchors containing regex metacharacters are matched literally', () => {
  const rule = splitRule('Cash (Book) [A+B] $5.00?');
  assert.equal(
    applyRules(anchorInput('x\nCash (Book) [A+B] $5.00?\ny'), [rule as never]),
    'x\nWEEK 2\nCash (Book) [A+B] $5.00?\ny',
  );
  assert.throws(
    () => applyRules(anchorInput('x\nCash (Book) [A+B] $5X00?\ny'), [rule as never]),
    /anchor missing or ambiguous/,
  );
});
