import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSafeSvg } from '../../backend/src/db/attachTopicAssets.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const svg = (s: string) => Buffer.from(s, 'utf8');
const ok = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#0a0"/></svg>';

test('accepts plain SVG, with prolog and with BOM', () => {
  assert.equal(isSafeSvg(svg(ok)), true);
  assert.equal(isSafeSvg(svg(`<?xml version="1.0" encoding="UTF-8"?>\n${ok}`)), true);
  assert.equal(isSafeSvg(svg(`﻿${ok}`)), true);
  assert.equal(isSafeSvg(svg(ok.replace('<rect', '<rect fill="url(#g)"'))), true);
});

test('rejects active content, external references and malformed input', () => {
  const bad: Record<string, string> = {
    script: ok.replace('<rect', '<script>alert(1)</script><rect'),
    onload: ok.replace('<svg ', '<svg onload="x()" '),
    href: ok.replace('<rect', '<a href="https://x.test"><rect'),
    src: ok.replace('<rect', '<rect src="x"'),
    foreignObject: ok.replace('<rect', '<foreignObject><div/></foreignObject><rect'),
    image: ok.replace('<rect', '<image/><rect'),
    style: ok.replace('<rect', '<style>*{}</style><rect'),
    doctype: `<!DOCTYPE svg>${ok}`,
    entity: `<?xml version="1.0"?><!ENTITY a "b">${ok}`,
    javascriptUrl: ok.replace('fill="#0a0"', 'fill="javascript:x"'),
    dataUri: ok.replace('fill="#0a0"', 'fill="data:text/html,x"'),
    externalUrl: ok.replace('fill="#0a0"', 'fill="url(https://x.test/a.svg#b)"'),
    stylesheet: `<?xml-stylesheet href="a.css"?>${ok}`,
    notSvg: '<html><body/></html>',
    unterminated: ok.replace('</svg>', ''),
  };
  for (const [name, body] of Object.entries(bad)) assert.equal(isSafeSvg(svg(body)), false, name);
  assert.equal(isSafeSvg(Buffer.alloc(0)), false, 'empty');
  assert.equal(isSafeSvg(Buffer.alloc(1_000_001, 0x20)), false, 'oversized');
  assert.equal(isSafeSvg(Buffer.from([0xff, 0xfe, 0x00])), false, 'invalid utf-8');
});

// Known offenders awaiting an owner decision (diagrams isSafeSvg rejects). Every committed SVG currently
// passes the constrained style allowlist, so nothing is pinned. Fixing an entry never fails CI (remove it
// from this list when you do); only a NEW unsafe SVG fails.
const KNOWN_REJECTED: string[] = [];

test('committed SS1 SVG assets pass the safety filter (except the known set)', () => {
  const root = path.resolve(here, '../../backend/src/db/ss1/assets');
  const files: string[] = [];
  const walk = (d: string) => { for (const e of readdirSync(d)) { const p = path.join(d, e); statSync(p).isDirectory() ? walk(p) : e.endsWith('.svg') && files.push(p); } };
  walk(root);
  assert.ok(files.length > 0);
  const rejected = files.filter(f => !isSafeSvg(readFileSync(f))).map(f => path.relative(root, f).split(path.sep).join('/')).sort();
  assert.deepEqual(rejected.filter(f => !KNOWN_REJECTED.includes(f)), [], 'new SVG(s) rejected by the safety filter');
});

test('mobile renderer uses the same unsafe-content pattern as the backend filter', () => {
  const pattern = (text: string) => text.match(/\/(<!DOCTYPE\|<!ENTITY[^\n]*?)\/i\.test\(/)?.[1];
  const backend = pattern(readFileSync(path.resolve(here, '../../backend/src/db/attachTopicAssets.ts'), 'utf8'));
  const mobile = pattern(readFileSync(path.resolve(here, '../../mobile/src/screens/TopicDetailScreen.tsx'), 'utf8'));
  assert.ok(backend && mobile, 'pattern found in both files');
  assert.equal(mobile, backend);
});
