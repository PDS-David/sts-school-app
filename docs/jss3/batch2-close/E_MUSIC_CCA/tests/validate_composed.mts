// Focused gate for Prompt E. Run inside an integration copy that has node_modules:
//   INTEG=/path/to/copy UPSERTS=/path/to/SUPPLEMENT_UPSERTS.json node --import tsx validate_composed.mts
// Exit 0 = composed corpus validates and every negative control is rejected.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const integ = process.env.INTEG!;
const upserts = JSON.parse(fs.readFileSync(process.env.UPSERTS!, 'utf8'));
const mod = await import(pathToFileURL(path.join(integ, 'backend/src/db/jss3Supplements.ts')).href);
const base = JSON.parse(fs.readFileSync(path.join(integ, 'backend/src/db/data/jss3Supplements.json'), 'utf8'));
// base here may already contain the upserts (integration copy). Rebuild from ids to be safe.
const ids = new Set(upserts.map((u: any) => u.id));
const composed = base.filter((l: any) => !ids.has(l.id));
for (const u of upserts) composed.push(u.lesson);
const out = mod.validateJss3Supplements(composed);
assert.equal(out.length, composed.length);
const mine = out.filter((l: any) => ids.has(l.id));
assert.equal(mine.length, upserts.length);

const clone = () => JSON.parse(JSON.stringify(composed));
const mustThrow = (name: string, f: (c: any[]) => void) => {
  const c = clone(); f(c);
  let threw = false;
  try { mod.validateJss3Supplements(c); } catch { threw = true; }
  assert.ok(threw, 'negative control did not fail: ' + name);
};
const i0 = composed.findIndex((l: any) => l.id === 'SUP-MUSIC-CADENCES');
mustThrow('unregistered WG gap id', c => { c[i0].gapIds = ['WG-MUSIC-NOT-REGISTERED']; });
mustThrow('no answers/marking text', c => { c[i0].body = 'Objectives only. '.repeat(60) + 'Practice (questions): none.'; });
mustThrow('duplicate id', c => { c.push(JSON.parse(JSON.stringify(c[i0]))); });
mustThrow('non-https source', c => { c[i0].sources = [{ title: 'x', url: 'http://example.com' }]; });
mustThrow('extra field (asset reference) in lesson', c => { c[i0].asset = 'x.png'; });
console.log('validated', out.length, 'lessons;', mine.length, 'from Prompt E; 5 negative controls rejected');
