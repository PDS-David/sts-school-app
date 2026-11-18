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
  'Verified By',
  'Verification Date',
  'Evidence / Notes',
  'Matched Production Student ID',
];

const primaryId = '1b4e1a4b-bf21-55f0-9cc1-30b56ff3b801';
const secondaryId = 'e21d9f73-1bd8-5acf-931b-6fdadf6b76bb';
const matchedId = '550e8400-e29b-41d4-a716-446655440000';

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
    'Current Enrolment Status': 'Still enrolled - same class',
    'Current Class (verified)': 'Primary 1',
    'Verified By': 'School Administrator',
    'Verification Date': '2026-11-18',
    'Evidence / Notes': '',
    'Matched Production Student ID': '',
    ...overrides,
  };
}

test('imports only verified current enrolments and uses the verified current class', () => {
  const entries = parsePhysicalRosterWorkbook(workbook([
    row(),
    row({
      'Student Name': 'Secondary Example',
      'Last-Term Class': 'JSS1',
      'School Section': 'Secondary',
      'Roster Identity (not admission no.)': 'SEC-JSS1-SECONDARY-EXAMPLE-002',
      'Internal Student UUID': secondaryId,
      'Current Enrolment Status': 'Promoted',
      'Current Class (verified)': 'JSS 2',
    }),
    row({
      'Student Name': 'Primary-to-Secondary Example',
      'Last-Term Class': 'Grade 5',
      'School Section': 'Primary',
      'Roster Identity (not admission no.)': 'PRI-GRADE-5-PRIMARY-TO-SECONDARY-003',
      'Internal Student UUID': '4c4cfd4e-96bb-5f7a-92b6-05e3a8214e1a',
      'Current Enrolment Status': 'Promoted',
      'Current Class (verified)': 'JSS 1',
    }),
  ]), 3);

  assert.equal(entries[0].schoolCode, 'primary');
  assert.equal(entries[0].sourceClassName, 'Grade 1');
  assert.equal(entries[0].className, 'Primary 1');
  assert.equal(entries[0].enrolmentStatus, 'active');
  assert.equal(entries[0].studentId, primaryId);
  assert.equal(entries[1].schoolCode, 'secondary');
  assert.equal(entries[1].sourceClassName, 'JSS1');
  assert.equal(entries[1].className, 'JSS 2');
  assert.equal(entries[1].enrolmentStatus, 'active');
  assert.equal(entries[2].schoolCode, 'secondary');
  assert.equal(entries[2].sourceClassName, 'Grade 5');
  assert.equal(entries[2].className, 'JSS 1');
  assert.equal(entries[2].enrolmentStatus, 'active');
});

test('transferred and left-school students are validated but returned as non-enrolment rows', () => {
  const entries = parsePhysicalRosterWorkbook(workbook([
    row({
      'Current Enrolment Status': 'Transferred',
      'Current Class (verified)': '',
      'Evidence / Notes': 'Transfer confirmed in school register',
    }),
    row({
      'Student Name': 'Left Student',
      'Roster Identity (not admission no.)': 'PRI-GRADE-1-LEFT-STUDENT-002',
      'Internal Student UUID': secondaryId,
      'Current Enrolment Status': 'Left school',
      'Current Class (verified)': '',
      'Evidence / Notes': 'Withdrawal recorded by school office',
    }),
  ]), 2);

  assert.equal(entries[0].enrolmentStatus, 'transferred');
  assert.equal(entries[0].className, null);
  assert.equal(entries[1].enrolmentStatus, 'left');
  assert.equal(entries[1].className, null);
});

test('uses a verified production student ID when an existing online record has been matched', () => {
  const entries = parsePhysicalRosterWorkbook(workbook([
    row({ 'Matched Production Student ID': matchedId }),
  ]), 1);

  assert.equal(entries[0].studentId, matchedId);
  assert.equal(entries[0].matchedProductionStudentId, matchedId);
  assert.equal(entries[0].internalStudentId, primaryId);
});

test('rejects duplicate UUIDs, duplicate targets and duplicate historical class/name identities', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row(), row({
      'Student Name': 'Different Student',
      'Roster Identity (not admission no.)': 'PRI-GRADE-1-DIFFERENT-STUDENT-002',
    })]), 2),
    /duplicate Internal Student UUID/,
  );

  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Matched Production Student ID': matchedId }), row({
      'Student Name': 'Different Student',
      'Roster Identity (not admission no.)': 'PRI-GRADE-1-DIFFERENT-STUDENT-002',
      'Internal Student UUID': secondaryId,
      'Matched Production Student ID': matchedId,
    })]), 2),
    /duplicate target student UUID/,
  );

  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row(), row({
      'Roster Identity (not admission no.)': 'PRI-GRADE-1-STUDENT-EXAMPLE-002',
      'Internal Student UUID': secondaryId,
    })]), 2),
    /duplicate student name in historical source class/,
  );
});

test('rejects unverified or awaiting-confirmation enrolment status', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Current Enrolment Status': 'Unverified' })]), 1),
    /not verified for import/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Current Enrolment Status': 'Awaiting confirmation' })]), 1),
    /not verified for import/,
  );
});

test('requires verifier, valid verification date, and a current class for active students', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Verified By': '' })]), 1),
    /Verified By is required/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Verification Date': 'not-a-date' })]), 1),
    /Verification Date must be a valid date/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Current Class (verified)': '' })]), 1),
    /Current Class \(verified\) is required/,
  );
});

test('requires evidence for leavers/transfers and rejects inconsistent current class decisions', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({
      'Current Enrolment Status': 'Transferred',
      'Current Class (verified)': '',
    })]), 1),
    /Evidence \/ Notes is required/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({
      'Current Enrolment Status': 'Still enrolled - same class',
      'Current Class (verified)': 'Primary 2',
    })]), 1),
    /same-class\/retained status must keep the historical class/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({
      'Current Enrolment Status': 'Promoted',
      'Current Class (verified)': 'Primary 1',
    })]), 1),
    /promoted status requires a different verified current class/,
  );
});

test('rejects unsupported source/current classes and inconsistent school sections', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Last-Term Class': 'Grade 6' })]), 1),
    /unsupported source class/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'School Section': 'Secondary' })]), 1),
    /school section does not match historical source class/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Current Class (verified)': 'JSS 1' })]), 1),
    /only a promoted student may move between Primary and Secondary sections/,
  );
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row({ 'Matched Production Student ID': 'not-a-uuid' })]), 1),
    /Matched Production Student ID must be a valid UUID/,
  );
});

test('rejects incorrect source row counts and requires the exact historical worksheet', () => {
  assert.throws(
    () => parsePhysicalRosterWorkbook(workbook([row()])),
    /Expected 104 historical roster rows/,
  );
  const sheet = XLSX.utils.json_to_sheet([row()]);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Wrong Sheet');
  const buffer = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  assert.throws(() => parsePhysicalRosterWorkbook(buffer, 1), /missing the "Teacher Verification" sheet/);
});
