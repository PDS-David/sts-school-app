import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { isSafeSvg, prepareAssets } from '../backend/src/db/attachTopicAssets.ts';

const valid = Buffer.from('<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><title>Safe</title><path d="M0 0 L100 50" stroke="#000"/></svg>');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

test('SVG assets pass signature, UTF-8, root, viewBox and active-content validation', () => {
  assert.equal(isSafeSvg(valid), true);
  const root = mkdtempSync(path.join(tmpdir(), 'topic-svg-'));
  try {
    writeFileSync(path.join(root, 'safe.svg'), valid);
    const rows = [{ asset_key:'svg-1', file:'safe.svg', sha256:digest(valid), order_index:1, caption:null, alt_text:'Safe figure', kind:'diagram', displayed:true, sort_order:1, expected_title:'SVG lesson' }];
    const prepared = prepareAssets(rows, root);
    assert.equal(prepared.length, 1);
    assert.equal(prepared[0].mime, 'image/svg+xml');
    assert.deepEqual(prepared[0].bytes, valid);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test('SVG active content, event handlers, external references, DTDs and missing viewBox fail closed', () => {
  const unsafe = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><script>alert(1)</script></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" onload="alert(1)"></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><image href="https://example.com/x.png"/></svg>',
    '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg viewBox="0 0 1 1">&x;</svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 1"></svg>',
  ];
  for (const value of unsafe) assert.equal(isSafeSvg(Buffer.from(value)), false);
});
