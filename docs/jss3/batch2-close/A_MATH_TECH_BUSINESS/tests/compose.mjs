// Run ONLY in a disposable clean integration copy, from repo root.
// node docs/jss3/batch2-close/A_MATH_TECH_BUSINESS/tests/compose.mjs --write
import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const p='backend/src/db/data/jss3Supplements.json',d='docs/jss3/batch2-close/A_MATH_TECH_BUSINESS/';const all=JSON.parse(fs.readFileSync(p));const up=JSON.parse(fs.readFileSync(d+'SUPPLEMENT_UPSERTS.json'));
const hash=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
// Validate entire transaction before writing; concurrent edits cannot be overwritten.
for(const u of up){const old=all.find(l=>l.id===u.id);assert.equal(u.id,u.lesson.id);assert.equal(u.expected_old_sha256,old?hash(old):null,`Conflict on ${u.id}: review before composing`);assert.equal(u.op,old?'replace':'add');}
for(const u of up){const index=all.findIndex(l=>l.id===u.id);if(index<0)all.push(u.lesson);else all[index]=u.lesson;}
assert.equal(new Set(all.map(l=>l.id)).size,all.length);
if(process.argv.includes('--write'))fs.writeFileSync(p,JSON.stringify(all,null,2)+'\n');
console.log(JSON.stringify({validated:true,written:process.argv.includes('--write'),lessons:all.length}));
