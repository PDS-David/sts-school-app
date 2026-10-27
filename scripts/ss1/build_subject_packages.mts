// SS1 package assembler (typed Node). Validates every registered subject package, cross-checks it against the importer's
// identity plan, verifies asset bytes, and emits a PRIVATE row/asset plan + disposition report. No database, no network.
//
//   node --import tsx scripts/ss1/build_subject_packages.mts \
//        --plan <ingestTopics --ss1-plan-out file> --output <NEW_DIR> [--assets-dir <private asset dir>] \
//        [--packages-dir <dir>] [--require-all-packages]
//
// Outputs in NEW_DIR:
//   ROW_PLAN.json                       – deterministic copy of the importer identity plan (originals + supplements)
//   DISPOSITION_REPORT.md               – per-subject state/coverage/claim, scheme-only rows, gates
//   attach_manifest_<slug>_<term>.csv   – input for backend/src/db/attachTopicAssets.ts (one per subject+term)
//   DELIVERY_CORRECTIONS.json           – combined correction plan with final topic identities (for SS1-08)
// Exit codes: 0 = no gates and every package IMPLEMENTED; 3 = INCOMPLETE (pending/missing packages, reported); 1 = gate failed.
// It never claims PASS for tests, device checks or content approval.
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadSs1Registry, SS1_CONTRACT_VERSION } from '../../backend/src/db/ss1/index.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ')}"`;
const sha256 = (b: Uint8Array) => createHash('sha256').update(b).digest('hex');

function main(): number {
  const planPath = arg('--plan'); const output = arg('--output');
  if (!planPath || !output) {
    console.error('usage: build_subject_packages.mts --plan <plan.json> --output <NEW_DIR> [--assets-dir DIR] [--packages-dir DIR] [--require-all-packages]');
    return 1;
  }
  const out = path.resolve(output);
  if (existsSync(out) && readdirSync(out).length > 0) { console.error('REFUSED: --output must be new or empty'); return 1; }
  const gates: string[] = [];
  const registry = loadSs1Registry({ subjectsDir: arg('--packages-dir') });
  gates.push(...registry.errors);

  const plan = JSON.parse(readFileSync(path.resolve(planPath), 'utf8'));
  if (plan.contract_version !== SS1_CONTRACT_VERSION) gates.push(`plan contract ${plan.contract_version} != ${SS1_CONTRACT_VERSION}`);
  gates.push(...(plan.gates ?? []));
  if (plan.partial_run) gates.push('plan was produced from a PARTIAL source set; not releasable');

  // asset bytes: exist, regular files inside the assets dir (no symlink escape), exact size + sha256
  const assetsDir = arg('--assets-dir') ? realpathSync(path.resolve(arg('--assets-dir') as string)) : undefined;
  const assets: any[] = plan.assets ?? [];
  if (assets.length && !assetsDir) gates.push(`${assets.length} planned asset(s) but no --assets-dir supplied`);
  if (assetsDir) {
    for (const a of assets) {
      const full = path.resolve(assetsDir, a.file);
      if (!full.startsWith(assetsDir + path.sep)) { gates.push(`${a.asset_key}: path escapes assets dir`); continue; }
      if (!existsSync(full)) { gates.push(`${a.asset_key}: file missing: ${a.file}`); continue; }
      if (lstatSync(full).isSymbolicLink() || !realpathSync(full).startsWith(assetsDir + path.sep)) { gates.push(`${a.asset_key}: symlink refused`); continue; }
      const bytes = readFileSync(full);
      if (bytes.length !== a.bytes) gates.push(`${a.asset_key}: size ${bytes.length} != ${a.bytes}`);
      if (sha256(bytes) !== a.sha256) gates.push(`${a.asset_key}: sha256 mismatch`);
      if (a.order_index == null) gates.push(`${a.asset_key}: target topic has no final order_index`);
    }
  }

  mkdirSync(out, { recursive: true, mode: 0o700 });
  writeFileSync(path.join(out, 'ROW_PLAN.json'), JSON.stringify(plan.rows, null, 2) + '\n');
  writeFileSync(path.join(out, 'DELIVERY_CORRECTIONS.json'), JSON.stringify(plan.delivery_corrections ?? [], null, 2) + '\n');

  // one asset manifest per (subject, term): attachTopicAssets.ts takes --subject/--term-label per run
  const groups = new Map<string, any[]>();
  for (const a of assets) groups.set(`${a.package_slug}|${a.term_label}`, [...(groups.get(`${a.package_slug}|${a.term_label}`) ?? []), a]);
  for (const [key, list] of [...groups.entries()].sort()) {
    const [slug, term] = key.split('|');
    const header = 'asset_key,file,sha256,topic_order_index,caption,alt_text,kind,displayed,sort_order,expected_title';
    const lines = list.sort((x, y) => (x.order_index - y.order_index) || (x.figure_order - y.figure_order)).map(a =>
      [a.asset_key, a.file, a.sha256, a.order_index, a.caption ?? '', a.alt_text, 'image', a.displayed, a.figure_order * 10, a.expected_title].map(csvCell).join(','));
    writeFileSync(path.join(out, `attach_manifest_${slug}_${term.replace(/\s+/g, '')}.csv`), [header, ...lines].join('\n') + '\n');
  }

  const subjects: any[] = plan.subjects ?? [];
  const pending = subjects.filter(s => s.state !== 'PACKAGE_IMPLEMENTED');
  const md: string[] = [`# SS1 disposition report (${SS1_CONTRACT_VERSION})`, '', 'Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. No test, device check, content approval or release is claimed.', ''];
  md.push('| subject | package | originals | markers | splits | supplements | claim |', '|---|---|---|---|---|---|---|');
  for (const s of subjects) md.push(`| ${s.subject} | ${s.state} | ${s.originalRows} | ${s.markerRows} | ${s.splitRows} | ${s.supplementRows} | ${s.claim} |`);
  md.push('', `Scheme-only / marker rows accounted separately: ${(plan.scheme_only_rows ?? []).length}`);
  for (const r of plan.scheme_only_rows ?? []) md.push(`- ${r.subject} / ${r.term} / ${r.weekLabel} / ${r.classification} / ${r.title}`);
  md.push('', `Gates: ${gates.length}`, ...gates.map(g => `- ${g}`));
  writeFileSync(path.join(out, 'DISPOSITION_REPORT.md'), md.join('\n') + '\n');

  console.log(`ROW_PLAN rows=${plan.rows.length} assets=${assets.length} corrections=${(plan.delivery_corrections ?? []).length} gates=${gates.length} pending_or_missing_packages=${pending.length}`);
  if (gates.length) { for (const g of gates) console.error(`GATE: ${g}`); return 1; }
  if (pending.length || (process.argv.includes('--require-all-packages') && pending.length)) { console.error('INCOMPLETE: not every subject package is IMPLEMENTED'); return 3; }
  return 0;
}
process.exitCode = main();
