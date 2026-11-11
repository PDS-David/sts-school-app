/**
 * Recompute the integrity fields that the SS1 validator enforces, so nobody has to
 * hash by hand:
 *   - lesson.body_sha256      = sha256(lesson.body, utf8)
 *   - asset.sha256 / asset.bytes = hash / size of the asset file at asset.path
 *
 * Usage (repo root):
 *   node --import tsx backend/src/db/ss1/refreshIntegrityHashes.ts            # fix in place
 *   node --import tsx backend/src/db/ss1/refreshIntegrityHashes.ts --check    # exit 1 if stale
 *   node --import tsx backend/src/db/ss1/refreshIntegrityHashes.ts english    # one subject
 *
 * Edits are textual (only the hash/byte values change), so file formatting is preserved.
 * A refreshed hash may also be quoted in coverage evidence or queue notes; the script
 * lists any other file under docs/ss1 and backend/src/db/ss1 that still quotes an old hash.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');
const subjectsDir = path.join(here, 'subjects');
const sha = (v: string | Uint8Array) => createHash('sha256').update(v).digest('hex');

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') await walk(p, out); }
    else if (/\.(json|md|csv|ts|mts)$/.test(e.name)) out.push(p);
  }
  return out;
}

function replaceOnce(raw: string, from: string, to: string, what: string): string {
  const n = raw.split(from).length - 1;
  if (n !== 1) throw new Error(`${what}: expected exactly 1 occurrence of ${from}, found ${n}; fix by hand`);
  return raw.replace(from, to);
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const slug = args.find(a => !a.startsWith('--'));
  const files = (await readdir(subjectsDir)).filter(f => f.endsWith('.json') && (!slug || f === `${slug}.json`)).sort();
  if (!files.length) throw new Error('No subject package JSON files matched');

  const changes: string[] = [];
  const staleHashes: string[] = [];
  for (const file of files) {
    const full = path.join(subjectsDir, file);
    let raw = await readFile(full, 'utf8');
    const data = JSON.parse(raw);
    for (const lesson of data.lessons ?? []) {
      const next = sha(Buffer.from(lesson.body, 'utf8'));
      if (next === lesson.body_sha256) continue;
      changes.push(`${file}: lesson ${lesson.id} body_sha256`);
      staleHashes.push(lesson.body_sha256);
      raw = replaceOnce(raw, `"body_sha256": "${lesson.body_sha256}"`, `"body_sha256": "${next}"`, `${file} ${lesson.id}`);
    }
    for (const asset of data.assets ?? []) {
      const bytes = await readFile(path.resolve(repoRoot, asset.path));
      const nextSha = sha(bytes);
      if (nextSha !== asset.sha256) {
        changes.push(`${file}: asset ${asset.id} sha256`);
        staleHashes.push(asset.sha256);
        raw = replaceOnce(raw, `"sha256": "${asset.sha256}"`, `"sha256": "${nextSha}"`, `${file} ${asset.id}`);
      }
      if (bytes.byteLength !== asset.bytes) {
        changes.push(`${file}: asset ${asset.id} bytes ${asset.bytes} -> ${bytes.byteLength}`);
        const pat = new RegExp(`("sha256": "${nextSha}",\\s*"bytes": )${asset.bytes}\\b|("bytes": )${asset.bytes}(,\\s*"sha256": "${nextSha}")`);
        if (!pat.test(raw)) throw new Error(`${file} ${asset.id}: cannot locate bytes field next to sha256; fix by hand`);
        raw = raw.replace(pat, (_m, a, b, c) => (a ? `${a}${bytes.byteLength}` : `${b}${bytes.byteLength}${c}`));
      }
    }
    if (!check && raw !== (await readFile(full, 'utf8'))) await writeFile(full, raw);
  }

  if (!changes.length) { console.log('SS1 integrity hashes are current.'); return; }
  console.log(`${check ? 'STALE' : 'Refreshed'} (${changes.length}):\n  ${changes.join('\n  ')}`);
  if (check) {
    console.log('\nRun: node --import tsx backend/src/db/ss1/refreshIntegrityHashes.ts');
    process.exitCode = 1;
    return;
  }
  const others = new Set<string>();
  for (const f of [...await walk(path.join(repoRoot, 'docs/ss1')), ...await walk(path.join(repoRoot, 'backend/src/db/ss1'))]) {
    const text = await readFile(f, 'utf8');
    if (staleHashes.some(h => text.includes(h))) others.add(path.relative(repoRoot, f));
  }
  if (others.size) console.log(`\nOld hashes are still quoted in these files; update them by hand if they should track the new value:\n  ${[...others].join('\n  ')}`);
}

main().catch(e => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
