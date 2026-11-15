/**
 * Recompute integrity fields enforced by the SS2/SS3 validator (never hash by hand):
 *   lesson.body_sha256 = sha256(lesson.body, utf8);  asset.sha256 / asset.bytes from the file at asset.path.
 * Usage (repo root):
 *   node --import tsx backend/src/db/ss23/refreshIntegrityHashes.ts [ss2|ss3] [subject-slug] [--check]
 * Edits are textual (only hash/byte values change). --check exits 1 if anything is stale.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, sha256, subjectsDir } from './validateSubjectPackages.js';

function replaceOnce(raw: string, from: string, to: string, what: string): string {
  const n = raw.split(from).length - 1;
  if (n !== 1) throw new Error(`${what}: expected exactly 1 occurrence of ${from}, found ${n}; fix by hand`);
  return raw.replace(from, to);
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const pos = args.filter(a => !a.startsWith('--'));
  const only = pos.find(a => /^ss[23]$/.test(a));
  const slug = pos.find(a => a !== only);
  const changes: string[] = [];
  let seen = 0;
  for (const d of ['ss2', 'ss3']) {
    if (only && only !== d) continue;
    const dir = path.join(subjectsDir, d);
    const files = (await readdir(dir).catch(() => [] as string[])).filter(f => f.endsWith('.json') && (!slug || f === `${slug}.json`)).sort();
    for (const f of files) {
      seen++;
      const full = path.join(dir, f); const label = `${d}/${f}`;
      const original = await readFile(full, 'utf8'); let raw = original;
      const data = JSON.parse(raw);
      for (const l of data.lessons ?? []) {
        const next = sha256(Buffer.from(l.body, 'utf8'));
        if (next === l.body_sha256) continue;
        changes.push(`${label}: lesson ${l.id} body_sha256`);
        raw = replaceOnce(raw, `"body_sha256": "${l.body_sha256}"`, `"body_sha256": "${next}"`, `${label} ${l.id}`);
      }
      for (const a of data.assets ?? []) {
        const bytes = await readFile(path.resolve(repoRoot, a.path));
        const nextSha = sha256(bytes);
        if (nextSha !== a.sha256) { changes.push(`${label}: asset ${a.id} sha256`); raw = replaceOnce(raw, `"sha256": "${a.sha256}"`, `"sha256": "${nextSha}"`, `${label} ${a.id}`); }
        if (bytes.byteLength !== a.bytes) {
          changes.push(`${label}: asset ${a.id} bytes ${a.bytes} -> ${bytes.byteLength}`);
          const pat = new RegExp(`("sha256": "${nextSha}",\\s*"bytes": )${a.bytes}\\b|("bytes": )${a.bytes}(,\\s*"sha256": "${nextSha}")`);
          if (!pat.test(raw)) throw new Error(`${label} ${a.id}: cannot locate bytes field next to sha256; fix by hand`);
          raw = raw.replace(pat, (_m, x, y, z) => (x ? `${x}${bytes.byteLength}` : `${y}${bytes.byteLength}${z}`));
        }
      }
      if (!check && raw !== original) await writeFile(full, raw);
    }
  }
  if (!seen) { console.log('No SS2/SS3 package files matched; nothing to refresh.'); return; }
  if (!changes.length) { console.log('SS23 integrity hashes are current.'); return; }
  console.log(`${check ? 'STALE' : 'Refreshed'} (${changes.length}):\n  ${changes.join('\n  ')}`);
  if (check) process.exitCode = 1;
}
main().catch(e => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
