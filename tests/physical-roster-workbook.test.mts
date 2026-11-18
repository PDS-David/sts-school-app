import assert from 'node:assert/strict';
import test from 'node:test';
import * as XLSX from 'xlsx';
import { parsePhysicalRosterWorkbook } from '../backend/src/db/physicalRosterWorkbook.js';

const headers = [
  'Student Name',
  'Last-Term Class',
  'School Section',
  'Roster Identity (not admission no.)',
  'Internal Student UUID',
  'Current Enrolment Status',
  'Current Class (verified)',
];

const primaryId = '1b4e1a4b-bf21-55f0-9cc1-30b56ff3b801';
const secondaryId = 'e21d9f73-1bd8-5acf-931b-6fdadf6b76bb';

function workbook(rows: Array<Record<string, unknown>>): Buffer {
  const sheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Teacher Verification');
  return XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

function row(overrides: Record<string, unknown> = {}) {
  return {
    'Student Name': 'Student Example',
    'Last-Term Class': 'Grade 1',
    'School Section': 'Primary',
    'Roster Identity (not admission no.)': 'PRI-GRADE-1-STUDENT-EXAMPLE-001',
    'Internal Student UUID': primaryId,
    'Current Enrolment Status': 'Unverified',
    'Current Class (verified)': '',
    ...overrides,
  };
}

test('parses historical classes into canonical database classes without using unverified current placement', () => {
  const entries = parsePhysicalRosterWorkbook(workbook([
    row(),
    row({
      'Student Name': 'Secondary Example',
      'Last-Term Class': 'JSS1',
      'School Section': 'Secondary',
      'Roster Identity (not admission no.)': 'SEC-JSS1-SECONDARY-EXAMPLE-002',
      'Internal Student UUID': secondaryId,
      'Current Enrolment Status': 'Promoted',
      'Current Class (verified)': 'SS1',
    }),
  ]), 2);

  assert.equal(entries[0].schoolCode, 'primary');
  assert.equal(entries[0].sourceClassName, 'Grade 1');
  assert.equal(entries[0].className, 'Primary 1');
  assert.equal(entries[0].studentId, primaryId);
  assert.equal(entries[1].schoolCode, 'secondary');
  assert.equal(entries[1].sourceClassName, 'JSS1');
  assert.equal(entries[1].className, 'JSS 1');
  assert.equal(entries[1].studentId, secondaryId);
});

test('rejects a duplicate UUID or duplicate class-and-name identity', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row(), row({
      'Student Name': 'Different Student',
      'Roster Identity (not admission no.)': 'PRI-GRADE-1-DIFFERENT-STUDENT-002',
    })]), 2),
    /duplicate Internal Student UUID/,
  );

  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row(), row({
      'Roster Identity (not admission no.)': 'PRI-GRADE-1-STUDENT-EXAMPLE-002',
      'Internal Student UUID': secondaryId,
    })]), 2),
    /duplicate student name in source class/,
  );
});

test('rejects unsupported source classes and inconsistent school sections', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Last-Term Class': 'Grade 6' })]), 1),
    /unsupported source class/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'School Section': 'Secondary' })]), 1),
    /school section does not match/,
  );
});

test('rejects missing identity fields, malformed UUIDs, and incorrect source row counts', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Student Name': '' })]), 1),
    /Student Name is required/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Internal Student UUID': 'not-a-uuid' })]), 1),
    /valid UUIDv5/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row()])),
    /Expected 104 historical roster rows/,
  );
});

test('requires the exact historical roster worksheet', () => {
  const sheet = XLSX.utils.json_to_sheet([row()]);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Wrong Sheet');
  const buffer = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  assert.throws(() => parsePhysicalRosterWorkbook(buffer, 1), /missing the "Teacher Verification" sheet/);
});
