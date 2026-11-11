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

// Owner decision pending: these committed diagrams use <style>, which isSafeSvg rejects by design
// (SVG is rendered as native vector primitives). Either inline their styling or consciously allow
// <style>. Until then they are pinned here so that any NEW unsafe SVG still fails CI.
const KNOWN_REJECTED = [
  'agricultural-science/t3-w02-eight-farm-power-sources.svg',
  'agricultural-science/t3-w07-female-poultry-reproductive-system.svg',
  'agricultural-science/t3-w07-fertile-egg-cross-section.svg',
  'agricultural-science/t3-w07-male-poultry-reproductive-system.svg',
  'agricultural-science/t3-w07-poultry-oviduct.svg',
  'biology/forest-food-web.svg',
];

test('committed SS1 SVG assets pass the safety filter (except the pinned known set)', () => {
  const root = path.resolve(here, '../../backend/src/db/ss1/assets');
  const files: string[] = [];
  const walk = (d: string) => { for (const e of readdirSync(d)) { const p = path.join(d, e); statSync(p).isDirectory() ? walk(p) : e.endsWith('.svg') && files.push(p); } };
  walk(root);
  assert.ok(files.length > 0);
  const rejected = files.filter(f => !isSafeSvg(readFileSync(f))).map(f => path.relative(root, f).split(path.sep).join('/')).sort();
  assert.deepEqual(rejected, KNOWN_REJECTED);
});
