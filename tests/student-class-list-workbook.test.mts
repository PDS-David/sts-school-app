import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { parseStudentClassListWorkbook } from '../backend/src/db/studentClassListWorkbook.ts';

const workbook = readFileSync(new URL('../backend/Student_Class_List.xlsx', import.meta.url));

test('approved physical class list contains exactly 104 correctly mapped students', () => {
  const entries = parseStudentClassListWorkbook(workbook);
  assert.equal(entries.length, 104);
  assert.equal(entries.filter(entry => entry.schoolCode === 'primary').length, 57);
  assert.equal(entries.filter(entry => entry.schoolCode === 'secondary').length, 47);

  const counts = Object.fromEntries(
    [...new Set(entries.map(entry => entry.className))].sort().map(className => [
      className, entries.filter(entry => entry.className === className).length,
    ]),
  );
  assert.deepEqual(counts, {
    'JSS 1': 8,
    'JSS 2': 14,
    'JSS 3': 5,
    'Primary 1': 8,
    'Primary 2': 15,
    'Primary 3': 9,
    'Primary 4': 16,
    'Primary 5': 9,
    'SS 1': 13,
    'SS 2': 7,
  });
});

test('parser rejects a workbook with a missing required worksheet', async () => {
  const XLSX = await import('xlsx');
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([['S/N', 'Student Name', 'Class', 'Section']]), 'Students');
  const invalid = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  assert.throws(() => parseStudentClassListWorkbook(invalid), /Students and Summary worksheets/);
});
