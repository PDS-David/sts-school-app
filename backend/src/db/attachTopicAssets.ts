// Attach lesson assets (images) to existing curriculum topics — Task 2.
//
// Reads a manifest CSV + a folder of asset files and inserts them into
// topic_assets (schema.sql). It NEVER inserts, updates or deletes `topics`
// rows: topics are only looked up, by their importer identity
//   (school_code, subject name, class_name, term_label, order_index).
//
// Safety properties (each has a test in tests/topic-assets.*):
//   - DRY RUN is the default. Nothing is written without --apply.
//   - Every file's sha256 is checked against the manifest BEFORE any database
//     work; one mismatch aborts the whole run with nothing written.
//   - Every topic must resolve (exactly one row) or the run fails loudly.
//   - Optional title guard: if the manifest has an expected title, the topic's
//     title must match (whitespace/case-insensitive) — protects against a
//     shifted order_index. Bypass with --skip-title-check only after review.
//   - --apply runs in ONE transaction; any error rolls everything back.
//   - Idempotent: INSERT ... ON CONFLICT (topic_id, asset_key) DO NOTHING, so a
//     second --apply adds 0 rows. An existing key with a DIFFERENT sha256 is
//     reported as a conflict and aborts (it is never silently overwritten).
//   - Metadata drift also aborts unless --update-metadata is explicitly supplied.
//     That flag previews updates by default; only --apply writes them. Bytes,
//     sha256, topic identity and MIME are never changed on an existing asset.
//
// Usage (run from backend/, DATABASE_URL must point at the intended database):
//   node --import tsx src/db/attachTopicAssets.ts \
//     --manifest <manifest.csv> --assets <folder> \
//     --subject "Music" --class-name "JSS 3" --term-label "1st Term" \
//     [--school-code secondary] [--dry-run | --apply] [--skip-title-check] [--update-metadata]
//
// Manifest columns (aliases accepted so the Task 2 manifests work as-is):
//   asset_key    ← asset_key | asset_id                    (required)
//   file         ← file | original_file                    (required, name inside --assets)
//   sha256       ← sha256 | sha256_verified                (required)
//   order_index  ← topic_order_index | destination_order_index | order_index (required)
//   caption, kind, displayed, sort_order, expected_title|lesson_title_per_R2_R2V (optional)

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { pool } from './pool.js';

export interface ManifestRow {
  asset_key: string;
  file: string;
  sha256: string;
  order_index: number;
  caption: string | null;
  kind: string;
  displayed: boolean;
  sort_order: number;
  expected_title: string | null;
}

export interface PreparedAsset extends ManifestRow {
  bytes: Buffer;
  mime: string;
}

// ── CSV (RFC-4180 subset: quoted fields, "" escapes, CRLF/LF) ────────────────
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

const pick = (hdr: string[], ...names: string[]): number => {
  for (const n of names) { const i = hdr.indexOf(n); if (i >= 0) return i; }
  return -1;
};

export function loadManifest(manifestPath: string): ManifestRow[] {
  const rows = parseCsv(readFileSync(manifestPath, 'utf-8'));
  if (rows.length < 2) throw new Error(`Manifest ${manifestPath} has no data rows`);
  const hdr = rows[0].map((h) => h.trim());
  const ix = {
    key: pick(hdr, 'asset_key', 'asset_id'),
    file: pick(hdr, 'file', 'original_file'),
    sha: pick(hdr, 'sha256', 'sha256_verified'),
    ord: pick(hdr, 'topic_order_index', 'destination_order_index', 'order_index'),
    cap: pick(hdr, 'caption'),
    kind: pick(hdr, 'kind'),
    disp: pick(hdr, 'displayed'),
    sort: pick(hdr, 'sort_order'),
    title: pick(hdr, 'expected_title', 'lesson_title_per_R2_R2V'),
  };
  for (const [name, i] of Object.entries({ asset_key: ix.key, file: ix.file, sha256: ix.sha, order_index: ix.ord })) {
    if (i < 0) throw new Error(`Manifest is missing a required column: ${name}`);
  }
  const perTopic = new Map<number, number>();
  const seen = new Set<string>();
  return rows.slice(1).map((r, n) => {
    const get = (i: number) => (i >= 0 ? (r[i] ?? '').trim() : '');
    const order = Number(get(ix.ord));
    if (!Number.isInteger(order)) throw new Error(`Manifest row ${n + 2}: order_index "${get(ix.ord)}" is not an integer`);
    const key = get(ix.key);
    if (!key) throw new Error(`Manifest row ${n + 2}: empty asset_key`);
    if (seen.has(`${order}|${key}`)) throw new Error(`Manifest row ${n + 2}: duplicate asset_key ${key} for order_index ${order}`);
    seen.add(`${order}|${key}`);
    const seq = (perTopic.get(order) ?? 0) + 1;
    perTopic.set(order, seq);
    const dispRaw = get(ix.disp).toLowerCase();
    return {
      asset_key: key,
      file: get(ix.file),
      sha256: get(ix.sha).toLowerCase(),
      order_index: order,
      caption: get(ix.cap) || null,
      kind: get(ix.kind) || 'image',
      displayed: dispRaw === '' ? true : ['true', 't', '1', 'yes'].includes(dispRaw),
      sort_order: get(ix.sort) !== '' ? Number(get(ix.sort)) : seq * 10,
      expected_title: get(ix.title) || null,
    };
  });
}

const SIGNATURES: Array<{ mime: string; test: (b: Buffer) => boolean }> = [
  { mime: 'image/png', test: (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: 'image/jpeg', test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/gif', test: (b) => b.length > 6 && ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString('latin1')) },
];

/** Reads every file, checks sha256 against the manifest, and sniffs the real
 *  image type from the file's magic bytes. Throws on the first problem. */
export function prepareAssets(rows: ManifestRow[], assetsDir: string): PreparedAsset[] {
  const problems: string[] = [];
  const out: PreparedAsset[] = [];
  for (const r of rows) {
    const p = path.join(assetsDir, r.file);
    if (!existsSync(p)) { problems.push(`${r.asset_key}: file not found: ${p}`); continue; }
    const bytes = readFileSync(p);
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== r.sha256) {
      problems.push(`${r.asset_key}: sha256 mismatch for ${r.file} (manifest ${r.sha256}, file ${actual})`);
      continue;
    }
    const sig = SIGNATURES.find((s) => s.test(bytes));
    if (!sig) { problems.push(`${r.asset_key}: ${r.file} is not a PNG/JPEG/GIF`); continue; }
    out.push({ ...r, bytes, mime: sig.mime });
  }
  if (problems.length) {
    throw new Error(`Asset verification failed — nothing was written:\n  ${problems.join('\n  ')}`);
  }
  return out;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

export interface AttachOptions {
  schoolCode: string;
  subject: string;
  className: string;
  termLabel: string;
  apply: boolean;
  skipTitleCheck: boolean;
  updateMetadata?: boolean;
}

export interface AttachResult {
  planned: number;
  inserted: number;
  alreadyPresent: number;
  metadataPlanned: number;
  metadataUpdated: number;
}

export async function attachAssets(assets: PreparedAsset[], opt: AttachOptions): Promise<AttachResult> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Resolve every topic first (read-only) — fail loudly, before inserting.
    const topicIds = new Map<number, number>();
    for (const order of [...new Set(assets.map((a) => a.order_index))].sort((a, b) => a - b)) {
      const { rows } = await client.query(
        `SELECT t.id, t.title
           FROM topics t
           JOIN subjects s ON s.id=t.subject_id AND s.school_code=t.school_code
          WHERE t.school_code=$1 AND s.name=$2 AND t.class_name=$3
            AND t.term_label=$4 AND t.order_index=$5
          FOR UPDATE OF t`,
        [opt.schoolCode, opt.subject, opt.className, opt.termLabel, order],
      );
      if (rows.length !== 1) {
        throw new Error(
          `Topic not found (or ambiguous: ${rows.length} rows): ${opt.schoolCode} / ${opt.subject} / ${opt.className} / ${opt.termLabel} / order_index ${order}`,
        );
      }
      for (const a of assets.filter((x) => x.order_index === order)) {
        if (!opt.skipTitleCheck && a.expected_title && norm(a.expected_title) !== norm(rows[0].title)) {
          throw new Error(
            `Title guard: ${a.asset_key} expects "${a.expected_title}" but order_index ${order} is "${rows[0].title}". ` +
            `Review the order_index, or pass --skip-title-check if the title text legitimately differs.`,
          );
        }
      }
      topicIds.set(order, rows[0].id);
    }

    // 2. Existing rows with the same key must carry the same bytes.
    let alreadyPresent = 0;
    const toInsert: PreparedAsset[] = [];
    const toUpdate: PreparedAsset[] = [];
    for (const a of assets) {
      const topicId = topicIds.get(a.order_index)!;
      const { rows } = await client.query(
        'SELECT sha256, mime, kind, caption, sort_order, displayed FROM topic_assets WHERE topic_id=$1 AND asset_key=$2', [topicId, a.asset_key],
      );
      if (rows[0]) {
        if (rows[0].sha256 !== a.sha256) {
          throw new Error(`Conflict: ${a.asset_key} already exists on topic ${topicId} with a different sha256 — refusing to overwrite.`);
        }
        if (rows[0].mime !== a.mime) {
          throw new Error(`Conflict: ${a.asset_key} has a different MIME type — refusing to overwrite.`);
        }
        const changed = (['kind', 'caption', 'sort_order', 'displayed'] as const)
          .filter(field => rows[0][field] !== a[field]);
        if (changed.length) {
          if (!opt.updateMetadata) {
            throw new Error(`Metadata conflict: ${a.asset_key} differs in ${changed.join(', ')}. Review a dry run with --update-metadata before applying.`);
          }
          console.log(`Metadata update ${a.asset_key}: ${JSON.stringify(Object.fromEntries(changed.map(field => [field, { before: rows[0][field], after: a[field] }])) )}`);
          toUpdate.push(a);
        } else alreadyPresent++;
      } else toInsert.push(a);
    }

    if (!opt.apply) {
      await client.query('ROLLBACK');
      return { planned: toInsert.length, inserted: 0, alreadyPresent, metadataPlanned: toUpdate.length, metadataUpdated: 0 };
    }

    // 3. Insert (idempotent), all in this one transaction.
    let inserted = 0;
    for (const a of toInsert) {
      const r = await client.query(
        `INSERT INTO topic_assets(topic_id, asset_key, kind, mime, sha256, caption, sort_order, displayed, bytes)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (topic_id, asset_key) DO NOTHING`,
        [topicIds.get(a.order_index), a.asset_key, a.kind, a.mime, a.sha256, a.caption, a.sort_order, a.displayed, a.bytes],
      );
      inserted += r.rowCount ?? 0;
    }
    let metadataUpdated = 0;
    for (const a of toUpdate) {
      const r = await client.query(
        `UPDATE topic_assets SET kind=$3, caption=$4, sort_order=$5, displayed=$6
          WHERE topic_id=$1 AND asset_key=$2 AND sha256=$7 AND mime=$8`,
        [topicIds.get(a.order_index), a.asset_key, a.kind, a.caption, a.sort_order, a.displayed, a.sha256, a.mime],
      );
      if (r.rowCount !== 1) throw new Error(`Metadata update conflict: ${a.asset_key}; rolling back.`);
      metadataUpdated++;
    }
    await client.query('COMMIT');
    return { planned: toInsert.length, inserted, alreadyPresent, metadataPlanned: toUpdate.length, metadataUpdated };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function main() {
  const manifest = arg('manifest');
  const assetsDir = arg('assets');
  const subject = arg('subject');
  const className = arg('class-name');
  const termLabel = arg('term-label');
  if (!manifest || !assetsDir || !subject || !className || !termLabel) {
    console.error('Required: --manifest <csv> --assets <dir> --subject <name> --class-name <name> --term-label <label>');
    process.exit(2);
  }
  if (flag('apply') && flag('dry-run')) { console.error('Use either --dry-run or --apply, not both.'); process.exit(2); }
  const apply = flag('apply');

  let host = '(DATABASE_URL not set)';
  try { host = new URL(process.env.DATABASE_URL ?? '').host || host; } catch { /* keep default */ }
  console.log(`Mode: ${apply ? 'APPLY (writes)' : 'DRY RUN (no writes)'}   Database host: ${host}`);

  const rows = loadManifest(manifest);
  const assets = prepareAssets(rows, assetsDir);
  console.log(`Verified ${assets.length} file(s): sha256 matches manifest, image type confirmed.`);

  const res = await attachAssets(assets, {
    schoolCode: arg('school-code') ?? 'secondary',
    subject, className, termLabel, apply,
    skipTitleCheck: flag('skip-title-check'),
    updateMetadata: flag('update-metadata'),
  });
  console.log(
    apply
      ? `Inserted ${res.inserted} row(s); updated metadata for ${res.metadataUpdated}; ${res.alreadyPresent} already present (unchanged).`
      : `Would insert ${res.planned} row(s); update metadata for ${res.metadataPlanned}; ${res.alreadyPresent} already present (unchanged). Re-run with --apply to write.`,
  );
}

// Run only when executed directly (tests import this module).
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main()
    .then(() => pool.end())
    .catch(async (e) => { console.error(e instanceof Error ? e.message : e); await pool.end().catch(() => {}); process.exit(1); });
}
