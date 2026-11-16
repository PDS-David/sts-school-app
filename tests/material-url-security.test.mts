import assert from 'node:assert/strict';
import test from 'node:test';
import { isSafeExternalMaterialUrl } from '../backend/src/utils/materialUrl.js';

test('backend material URL validation requires HTTPS public DNS hosts', () => {
  for (const value of [
    'http://example.com/lesson.pdf',
    'javascript:alert(1)',
    'file:///etc/passwd',
    'https://user:pass@example.com/lesson.pdf',
    'https://localhost/lesson.pdf',
    'https://127.0.0.1/lesson.pdf',
    'https://10.0.0.5/lesson.pdf',
    'https://192.168.0.10/lesson.pdf',
    'https://169.254.169.254/latest/meta-data',
    'https://[::1]/lesson.pdf',
    'https://server.local/lesson.pdf',
    'https://service.internal/lesson.pdf',
    'https://example.com:8443/lesson.pdf',
    ' https://example.com/lesson.pdf',
    'https://example.com/lesson.pdf ',
  ]) assert.equal(isSafeExternalMaterialUrl(value), false, String(value));

  assert.equal(isSafeExternalMaterialUrl('https://drive.google.com/file/d/abc/view'), true);
  assert.equal(isSafeExternalMaterialUrl('https://youtu.be/abc123'), true);
  assert.equal(isSafeExternalMaterialUrl('https://example.org/resources/lesson.pdf'), true);
});
