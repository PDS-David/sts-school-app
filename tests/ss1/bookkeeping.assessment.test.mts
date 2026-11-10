import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../docs/ss1/work/microtasks/bookkeeping/', import.meta.url);
const resources = [
  ['ASSESSMENT-T1-W01-REVISION.md', 40],
  ['ASSESSMENT-T1-W11-REVISION.md', 50],
  ['ASSESSMENT-T1-W12-EXAM.md', 60],
  ['ASSESSMENT-T2-W11-REVISION.md', 50],
  ['ASSESSMENT-T2-W12-EXAM.md', 60],
  ['ASSESSMENT-T3-W11-REVISION.md', 50],
  ['ASSESSMENT-T3-W12-EXAM.md', 60],
] as const;

const read = (file: string) => readFileSync(new URL(file, root), 'utf8');

test('All scheduled Bookkeeping revision and examination resources exist with provenance and marking guides', () => {
  for (const [file, total] of resources) {
    const body = read(file);
    assert.match(body, /^# SS1 Bookkeeping —/m, file);
    assert.match(body, /project-authored/i, file);
    assert.match(body, /answer key|answers and marking guide|marking guide/i, file);
    assert.match(body, new RegExp(`Total:\\*\\*?\\s*${total} marks`, 'i'), file);
    assert.match(body, /## Section A/i, file);
    assert.match(body, /## Section B/i, file);
    assert.match(body, /## Section C/i, file);
  }
});

test('Assessment index covers every new resource and the existing third-term Week 1 revision lesson', () => {
  const index = read('ASSESSMENT-RESOURCE-INDEX.md');
  for (const [file] of resources) assert(index.includes(file), `index missing ${file}`);
  assert.match(index, /SUP-SS1-BOOKKEEPING-T3-W01-REVISION/);
  assert.match(index, /not recovered original/i);
});

test('Arithmetic review records independently checked answer-key totals', () => {
  const review = read('ASSESSMENT-RESOURCE-REVIEW.md');
  for (const expected of [
    '₦15,000', '₦58,000', '₦20,000', '₦65,000',
    '₦29,000', '₦91,000', '₦68,400', '₦38,000',
    '₦99,960', '₦55,500', '₦11,000', '₦124,000',
    '₦56,000', '₦28,000', '₦75,000', '₦8,500',
    '₦82,000', '₦38,000', '₦95,000',
  ]) assert(review.includes(expected), `review missing checked value ${expected}`);
});
