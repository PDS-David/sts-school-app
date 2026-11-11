#!/usr/bin/env node
/**
 * Build approved SS1 topic_assets manifests from the real compiler plan.
 *
 * This is a planning step only. It never writes to PostgreSQL. It refuses to
 * emit attachable manifests until the package, lesson and asset have explicit
 * content approval, verification evidence and permitted provenance.
 *
 * Example:
 *   node scripts/ss1/build_asset_plan.mjs \
 *     --plan <private-ss1-plan.json> \
 *     --package backend/src/db/ss1/subjects/agricultural-science.json \
 *     --repo-root . --out-dir <private-output-dir>
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const norm = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
const csvCell = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const safeSvg = (bytes) => {
  if (!bytes.length || bytes.length > 1_000_000) return false;
  let xml;
  try { xml = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '').trim(); }
  catch { return false; }
  return /^(?:<\?xml\s+version=["']1\.[01]["'][^?]*\?>\s*)?<svg\b[\s\S]*<\/svg>$/i.test(xml)
    && !/<!DOCTYPE|<!ENTITY|<\s*(?:script|foreignObject|iframe|object|embed|image|audio|video|style)\b|<\?xml-stylesheet|\bon[a-z][\w:-]*\s*=|\b(?:href|src|style)\s*=|javascript:|data:|@import|url\(\s*(?!["']?#)/i.test(xml)
    && /\bviewBox=["']\s*[0-9.+-]+[,\s]+[0-9.+-]+[,\s]+[0-9.+-]+[,\s]+[0-9.+-]+\s*["']/i.test(xml);
};
const detectMime = (bytes) => {
  if (bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return 'image/png';
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length > 6 && ['GIF87a','GIF89a'].includes(bytes.subarray(0,6).toString('latin1'))) return 'image/gif';
  if (safeSvg(bytes)) return 'image/svg+xml';
  return null;
};

export function buildAssetPlan({ compilerPlan, subjectPackage, repoRoot = process.cwd() }) {
  const root = path.resolve(repoRoot);
  const lessonById = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  const rowById = new Map(compilerPlan.identified_rows.map(item => [item.id, item.row]));
  const compiledAssets = new Map((compilerPlan.assets ?? []).map(asset => [asset.id, asset]));
  const records = [];
  const blockers = [];
  if (subjectPackage.package_status !== 'IMPLEMENTED') blockers.push(`PACKAGE_NOT_IMPLEMENTED:${subjectPackage.subject_slug}`);

  for (const asset of subjectPackage.assets) {
    const compiledAsset = compiledAssets.get(asset.id);
    if (!compiledAsset || compiledAsset.sha256 !== asset.sha256 || compiledAsset.lesson_id !== asset.lesson_id || compiledAsset.path !== asset.path) { blockers.push(`ASSET_NOT_IN_COMPILER_PLAN_OR_IDENTITY_MISMATCH:${asset.id}`); continue; }
    const lesson = lessonById.get(asset.lesson_id);
    const row = rowById.get(asset.lesson_id);
    if (!lesson) { blockers.push(`UNKNOWN_ASSET_LESSON:${asset.id}`); continue; }
    if (!row) { blockers.push(`UNRESOLVED_ASSET_TOPIC_ROW:${asset.id}`); continue; }
    if (row.className !== lesson.class_name || row.termLabel !== lesson.term || row.subjectName !== subjectPackage.canonical_subject || norm(row.title) !== norm(lesson.title) || !Number.isInteger(row.orderIndex) || row.orderIndex < 1) {
      blockers.push(`ASSET_TOPIC_IDENTITY_MISMATCH:${asset.id}`);
      continue;
    }
    const absolute = path.resolve(root, asset.path);
    if (!absolute.startsWith(root + path.sep) || !existsSync(absolute)) { blockers.push(`ASSET_PATH_MISSING_OR_OUTSIDE_REPO:${asset.id}`); continue; }
    const bytes = readFileSync(absolute);
    if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) { blockers.push(`ASSET_BYTES_OR_HASH_MISMATCH:${asset.id}`); continue; }
    const mime = detectMime(bytes);
    if (!mime || mime !== asset.media_type) { blockers.push(`ASSET_MIME_OR_SAFETY_MISMATCH:${asset.id}`); continue; }
    for (const [owner, state] of [['LESSON', lesson.state], ['ASSET', asset.state]]) {
      if (state.content_approval !== 'APPROVED' || !state.approval_reference) blockers.push(`${owner}_CONTENT_NOT_APPROVED:${asset.id}`);
      if (state.implementation !== 'IMPLEMENTED') blockers.push(`${owner}_NOT_IMPLEMENTED:${asset.id}`);
      if (state.verification !== 'VERIFIED' || !state.verification_reference) blockers.push(`${owner}_NOT_VERIFIED:${asset.id}`);
    }
    if (asset.provenance.reuse_status !== 'PERMITTED') blockers.push(`ASSET_RIGHTS_NOT_CLEARED:${asset.id}`);
    records.push({
      asset_key: asset.id,
      file: asset.path.split(path.sep).join('/'),
      sha256: asset.sha256,
      order_index: row.orderIndex,
      caption: null,
      alt_text: asset.alt,
      kind: 'diagram',
      displayed: true,
      sort_order: asset.order,
      expected_title: row.title,
      school_code: 'secondary',
      subject: row.subjectName,
      class_name: row.className,
      term_label: row.termLabel,
    });
  }

  const groups = new Map();
  for (const record of records) {
    const key = JSON.stringify([record.school_code, record.subject, record.class_name, record.term_label]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  const uniqueBlockers = [...new Set(blockers)].sort();
  return { ready: uniqueBlockers.length === 0 && records.length === subjectPackage.assets.length, blockers: uniqueBlockers, records, groups: [...groups.entries()].map(([key, rows]) => ({ identity: JSON.parse(key), rows })) };
}

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const planPath = arg('plan'), packagePath = arg('package'), outDir = arg('out-dir');
  if (!planPath || !packagePath || !outDir) throw new Error('Required: --plan <compiler-plan.json> --package <subject-package.json> --out-dir <directory> [--repo-root <root>]');
  const repoRoot = path.resolve(arg('repo-root') ?? process.cwd());
  const compilerPlan = JSON.parse(readFileSync(path.resolve(planPath), 'utf8'));
  const subjectPackage = JSON.parse(readFileSync(path.resolve(packagePath), 'utf8'));
  const result = buildAssetPlan({ compilerPlan, subjectPackage, repoRoot });
  mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(outDir, `${subjectPackage.subject_slug}-asset-plan.json`);
  writeFileSync(reportPath, JSON.stringify({ subject_slug: subjectPackage.subject_slug, ready: result.ready, blockers: result.blockers, records: result.records }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  if (!result.ready) {
    console.error(`BLOCKED: no attachment manifests emitted; see ${reportPath}`);
    process.exitCode = 2;
    return;
  }
  for (const group of result.groups) {
    const [, subject, className, termLabel] = group.identity;
    const slug = [subject, className, termLabel].join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const headers = ['asset_key','file','sha256','order_index','caption','alt_text','kind','displayed','sort_order','expected_title'];
    const lines = [headers.join(','), ...group.rows.map(row => headers.map(header => csvCell(row[header])).join(','))];
    const manifestPath = path.join(outDir, `${slug}-assets.csv`);
    writeFileSync(manifestPath, lines.join('\n') + '\n', { flag: 'wx', mode: 0o600 });
    console.log(`Wrote ${group.rows.length} approved asset(s): ${manifestPath}`);
  }
  console.log(`Asset plan ready: ${result.records.length} verified assets across ${result.groups.length} topic group(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
}
