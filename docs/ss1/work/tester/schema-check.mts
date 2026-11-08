// Validate every SS1 package against the frozen schema and print grouped issues with exact IDs.
//   node --import tsx docs/ss1/work/tester/schema-check.mts [repoRoot]
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(process.argv[2] ?? process.cwd());
const { packageSchema } = await import(`${root}/backend/src/db/ss1/subjectPackageSchema.ts`);
const dir = `${root}/backend/src/db/ss1/subjects/`;
let bad = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
  const raw = JSON.parse(readFileSync(dir + f, 'utf8'));
  const r = packageSchema.safeParse(raw);
  if (r.success) { console.log(f.padEnd(28), 'OK'); continue; }
  bad++;
  console.log(f.padEnd(28), 'FAIL', r.error.issues.length, 'issues');
  const seen = new Set<string>();
  for (const i of r.error.issues) {
    const rec = raw[i.path[0] as string]?.[i.path[1] as number];
    const k = i.code + '|' + i.path.filter(p => typeof p !== 'number').join('.');
    if (seen.has(k)) continue; seen.add(k);
    console.log('   ', i.path.join('.'), `[id=${rec?.id ?? rec?.lesson_id ?? '-'}]`, i.code, i.message.slice(0, 80));
  }
}
console.log(bad ? `${bad} package(s) fail the schema` : 'all packages pass the schema');
