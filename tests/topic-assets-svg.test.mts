import test from 'node:test';
import assert from 'node:assert/strict';
import { isSafeSvg, prepareAssets } from '../backend/src/db/attachTopicAssets.ts';

const svg = (source: string) => Buffer.from(source, 'utf8');

test('SVG safety accepts simple SVG and an optional standard XML declaration', () => {
  const vb = 'viewBox="0 0 100 50"';
  assert.equal(isSafeSvg(svg(`<svg xmlns="http://www.w3.org/2000/svg" ${vb}><path d="M0 0"/></svg>`)), true);
  assert.equal(isSafeSvg(svg(`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" ${vb}></svg>`)), true);
  assert.equal(isSafeSvg(Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), svg(`<svg ${vb}></svg>`)])), true);
});

test('SVG safety rejects malformed documents and active or externally referenced content', () => {
  for (const source of [
    '<html><svg></svg></html>',
    '<svg><script>alert(1)</script></svg>',
    '<svg><foreignObject><div>HTML</div></foreignObject></svg>',
    '<svg><image href="https://example.com/a.png"/></svg>',
    '<svg><use href="data:image/svg+xml;base64,AAAA"/></svg>',
    '<svg onload="alert(1)"></svg>',
    '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg>&x;</svg>',
    '<?xml-stylesheet href="evil.css"?><svg></svg>',
    '<svg><style>@import "https://example.com/a.css";</style></svg>',
    '<svg><path style="fill:url(https://example.com/a.svg#x)"/></svg>',
    '<svg><iframe src="https://example.com"></iframe></svg>',
    '<svg><audio src="https://example.com/a.mp3"/></svg>',
    '<svg><object data="https://example.com/a.html"/></svg>',
    '<svg>',
  ]) assert.equal(isSafeSvg(svg(source)), false, source);
});

test('SVG safety rejects invalid UTF-8 and documents over the size limit', () => {
  assert.equal(isSafeSvg(Buffer.from([0xc3, 0x28])), false);
  assert.equal(isSafeSvg(Buffer.alloc(1_000_001, 0x20)), false);
});

test('SVG safety requires a positive viewBox and rejects inline style attributes', () => {
  assert.equal(isSafeSvg(svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M0 0"/></svg>')), true);
  assert.equal(isSafeSvg(svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><style>.label{font:700 18px Arial,sans-serif;fill:#18324b}.flow{marker-end:url(#arrow)}</style><text class="label">Safe</text></svg>')), true);
  assert.equal(isSafeSvg(svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><style>.label{background-image:url(https://evil.test/x)}</style></svg>')), false);
  assert.equal(isSafeSvg(svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 1"></svg>')), false);
  assert.equal(isSafeSvg(svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path style="fill:red"/></svg>')), false);
});

test('safe SVG is accepted by the real topic asset manifest preparation path', async () => {
  const { createHash } = await import('node:crypto');
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const path = await import('node:path');
  const { tmpdir } = await import('node:os');
  const root = mkdtempSync(path.join(tmpdir(), 'topic-svg-'));
  const bytes = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M0 0 L100 50"/></svg>');
  try {
    writeFileSync(path.join(root, 'figure.svg'), bytes);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const prepared = prepareAssets([{ asset_key:'svg-1', file:'figure.svg', sha256, order_index:1, caption:null, alt_text:'Figure', kind:'diagram', displayed:true, sort_order:1, expected_title:'Topic' }], root);
    assert.equal(prepared[0].mime, 'image/svg+xml');
    assert.deepEqual(prepared[0].bytes, bytes);
  } finally { rmSync(root, { recursive:true, force:true }); }
});
