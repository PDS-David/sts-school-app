// Run:  cd backend && npx tsx --test ../tests/ingest-class-folder-conflict.test.mts
//
// Guards the importer against filing a document under the wrong class when
// the FILENAME names one class and the FOLDER names another. Real case: a file
// called "2nd term grade 3 dig.docx" sitting in a Primary 4 folder was ingested
// as Primary 3 because inferClassNames() trusts the filename.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classFolderConflict, inferClassNames } from '../backend/src/db/ingestTopics.ts';

const check = (relativeDir: string, fileName: string) =>
  classFolderConflict(inferClassNames(`${relativeDir}/${fileName}`), relativeDir);

test('stale class in filename inside another class folder is a conflict', () => {
  const found = check('BASIC FOUR/1st Term Basic 4', '2nd term grade 3 dig.docx');
  assert.ok(found, 'expected a conflict');
  assert.match(found!, /Primary 3/);
  assert.match(found!, /Primary 4/);
});

test('matching filename and folder is fine', () => {
  assert.equal(check('Basic 3/1st Term', 'PRY 3 ICT IST TERM.docx'), undefined);
  assert.equal(check('BASIC THREE/3rd Term Basic 3', 'pry 3 mathematics 3rd term.doc'), undefined);
  assert.equal(check('SSS 1/1st Term SS1_', '1ST TERM S1 ENGLISH LANGUAGE.doc'), undefined);
});

test('a file with no class in its name takes the folder class and never conflicts', () => {
  assert.equal(check('JSS 2/2nd Term', '2ND TERM.docx'), undefined);
});

test('a folder that names no class never conflicts', () => {
  assert.equal(check('1st Term', 'PRY 3 ICT IST TERM.docx'), undefined);
  assert.equal(check('', 'PRY 3 ICT IST TERM.docx'), undefined);
});

test('shared Pre-Nursery/Reception folder passes for both files', () => {
  const dir = 'PRE NURSERY AND RECEPTION';
  assert.equal(check(dir, 'Reception.doc'), undefined);
  assert.equal(check(dir, 'Pre-Nursery.doc'), undefined);
});

test('secondary file in a primary folder is still a conflict', () => {
  assert.ok(check('Basic 3/1st Term', 'JSS 1 MATHS.docx'));
});

test('unrecognised file class is left to the existing unmapped-class blocker', () => {
  assert.equal(classFolderConflict(undefined, 'Basic 3/1st Term'), undefined);
});
