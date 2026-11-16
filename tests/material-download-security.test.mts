import assert from 'node:assert/strict';
import test from 'node:test';
import { getMaterialDownloadTarget, isSafeMaterialUrl } from '../mobile/src/utils/materialDownload.ts';

test('only public HTTPS hostnames without credentials or non-standard ports are accepted', () => {
  for (const value of [
    'http://example.com/file.pdf',
    'javascript:alert(1)',
    'file:///etc/passwd',
    'https://user:password@example.com/file.pdf',
    'https://localhost/file.pdf',
    'https://127.0.0.1/file.pdf',
    'https://10.0.0.8/file.pdf',
    'https://192.168.1.2/file.pdf',
    'https://169.254.169.254/latest/meta-data',
    'https://[::1]/file.pdf',
    'https://school.local/file.pdf',
    'https://db.internal/file.pdf',
    'https://127.0.0.1.nip.io/file.pdf',
    'https://999.999.999.999/file.pdf',
    'https://example.com:8443/file.pdf',
    'https://example.com/file.pdf ',
    'https://example.com\\\\@evil.test/file.pdf',
  ]) assert.equal(isSafeMaterialUrl(value), false, value);

  assert.equal(isSafeMaterialUrl('https://drive.google.com/file/d/abc/view'), true);
  assert.equal(isSafeMaterialUrl('https://youtu.be/abc123'), true);
  assert.equal(isSafeMaterialUrl('https://example.org/resources/lesson.pdf'), true);
});

test('download targets accept only matching PDF and Word file links', () => {
  const pdf = getMaterialDownloadTarget('https://example.org/lesson.pdf?download=1', 'Lesson 1', 'pdf');
  assert.equal(pdf?.fileName, 'Lesson_1.pdf');
  assert.equal(pdf?.mimeType, 'application/pdf');
  assert.equal(pdf?.maxBytes, 25 * 1024 * 1024);

  const docx = getMaterialDownloadTarget('https://example.org/lesson.docx', 'Lesson 2', 'doc');
  assert.equal(docx?.fileName, 'Lesson_2.docx');
  assert.equal(docx?.mimeType, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  assert.equal(getMaterialDownloadTarget('https://example.org/lesson.exe', 'Lesson', 'pdf'), null);
  assert.equal(getMaterialDownloadTarget('https://example.org/lesson.doc', 'Lesson', 'pdf'), null);
  assert.equal(getMaterialDownloadTarget('https://example.org/lesson.pdf', 'Lesson', 'video'), null);
  assert.equal(getMaterialDownloadTarget('https://example.org/lesson.pdf', 'Lesson', 'link'), null);
  assert.equal(getMaterialDownloadTarget('http://example.org/lesson.pdf', 'Lesson', 'pdf'), null);
});

test('safe download filenames cannot contain path separators or control characters', () => {
  const target = getMaterialDownloadTarget('https://example.org/file.pdf', '../../My Lesson\n', 'pdf');
  assert.equal(target?.fileName, 'My_Lesson.pdf');
  assert.ok(!target?.fileName.includes('/'));
  assert.ok(!target?.fileName.includes('\\\\'));
});
