/**
 * Refresh SS23 body and stored-asset integrity fields.
 *
 * Supports current unit packages in subjects/*.json and legacy registry audit packages
 * in subjects/ss2/*.json and subjects/ss3/*.json. Pending source-extract references may
 * intentionally have no stored file; approved, implemented, verified assets may not.
 *
 * Usage:
 *   node --import tsx backend/src/db/ss23/refreshIntegrityHashes.ts [ss2|ss3] [subject-slug] [--check]
 */
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, sha256, subjectsDir } from './validateSubjectPackages.js';

function replaceAllChecked(raw: string, from: string, to: string, what: string): string {
  const count = raw.split(from).length - 1;
  if (count < 1) throw new Error(what + ': expected to find ' + from + ', found 0; fix by hand');
  return raw.split(from).join(to);
}

function isApprovedAsset(asset: any): boolean {
  return asset.state?.content_approval === 'APPROVED' &&
    asset.state?.implementation === 'IMPLEMENTED' &&
    asset.state?.verification === 'VERIFIED' &&
    asset.provenance?.reuse_status === 'PERMITTED';
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const pos = args.filter(arg => !arg.startsWith('--'));
  const only = pos.find(arg => /^ss[23]$/.test(arg));
  const slug = pos.find(arg => arg !== only);
  const files: Array<{ fullPath: string; label: string; expectedClass?: string }> = [];

  const rootFiles = (await readdir(subjectsDir, { withFileTypes: true }).catch(() => []))
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => ({ fullPath: path.join(subjectsDir, entry.name), label: entry.name }));
  files.push(...rootFiles);

  for (const directory of ['ss2', 'ss3']) {
    if (only && only !== directory) continue;
    const dir = path.join(subjectsDir, directory);
    const names = (await readdir(dir).catch(() => [] as string[]))
      .filter(name => name.endsWith('.json'));
    for (const name of names) {
      files.push({
        fullPath: path.join(dir, name),
        label: directory + '/' + name,
        expectedClass: 'SS ' + directory.slice(-1),
      });
    }
  }

  const changes: string[] = [];
  let seen = 0;
  for (const file of files.sort((a, b) => a.label.localeCompare(b.label))) {
    if (slug && path.basename(file.label) !== slug + '.json') continue;
    const original = await readFile(file.fullPath, 'utf8');
    const data = JSON.parse(original);
    const className = data.class_name ?? file.expectedClass;
    if (only && className && className !== 'SS ' + only.slice(-1)) continue;
    seen++;
    let raw = original;
    const label = file.label;

    const bodies = Array.isArray(data.units) ? data.units : Array.isArray(data.lessons) ? data.lessons : [];
    for (const unit of bodies) {
      if (typeof unit.body !== 'string') continue;
      const next = sha256(Buffer.from(unit.body, 'utf8'));
      if (next === unit.body_sha256) continue;
      changes.push(label + ': body ' + unit.id + ' body_sha256');
      raw = replaceAllChecked(
        raw,
        '"body_sha256": "' + unit.body_sha256 + '"',
        '"body_sha256": "' + next + '"',
        label + ' ' + unit.id,
      );
    }

    for (const asset of data.assets ?? []) {
      const assetPath = path.resolve(repoRoot, asset.path);
      const relative = path.relative(repoRoot, assetPath);
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error(label + ' ' + asset.id + ': asset path escapes repository');
      }
      if (!existsSync(assetPath)) {
        if (isApprovedAsset(asset)) {
          throw new Error(label + ' ' + asset.id + ': approved asset file is missing');
        }
        continue;
      }
      const bytes = await readFile(assetPath);
      const nextSha = sha256(bytes);
      if (nextSha !== asset.sha256) {
        changes.push(label + ': asset ' + asset.id + ' sha256');
        raw = replaceAllChecked(
          raw,
          '"sha256": "' + asset.sha256 + '"',
          '"sha256": "' + nextSha + '"',
          label + ' ' + asset.id,
        );
      }
      if (bytes.byteLength !== asset.bytes) {
        changes.push(label + ': asset ' + asset.id + ' bytes ' + asset.bytes + ' -> ' + bytes.byteLength);
        const pattern = new RegExp(
          '("sha256": "' + nextSha + '",\\s*"bytes": )' + asset.bytes + '\\b|("bytes": )' + asset.bytes + '(,\\s*"sha256": "' + nextSha + '")',
          'g',
        );
        if (!pattern.test(raw)) throw new Error(label + ' ' + asset.id + ': cannot locate bytes field next to sha256; fix by hand');
        raw = raw.replace(pattern, (_match, before, middle, after) =>
          before ? before + bytes.byteLength : middle + bytes.byteLength + after,
        );
      }
    }

    if (!check && raw !== original) await writeFile(file.fullPath, raw);
  }

  if (!seen) {
    console.log('No SS2/SS3 package files matched; nothing to refresh.');
    return;
  }
  if (!changes.length) {
    console.log('SS23 integrity hashes are current (' + seen + ' package file(s) checked).');
    return;
  }
  console.log((check ? 'STALE' : 'Refreshed') + ' (' + changes.length + '):\n  ' + changes.join('\n  '));
  if (check) process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
