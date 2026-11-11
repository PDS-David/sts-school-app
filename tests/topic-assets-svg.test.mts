import test from 'node:test';
import assert from 'node:assert/strict';
import { isSafeSvg } from '../backend/src/db/attachTopicAssets.ts';

const svg = (source: string) => Buffer.from(source, 'utf8');

test('SVG safety accepts simple SVG and an optional standard XML declaration', () => {
  assert.equal(isSafeSvg(svg('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>')), true);
  assert.equal(isSafeSvg(svg('<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>')), true);
  assert.equal(isSafeSvg(Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), svg('<svg></svg>')])), true);
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
