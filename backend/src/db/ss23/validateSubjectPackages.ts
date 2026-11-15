/**
 * SS2 / SS3 package validator.
 *
 *   node --import tsx backend/src/db/ss23/validateSubjectPackages.ts [ss2|ss3] [subject-slug] [--require-ready]
 *
 * Exit 1 on any validation error. Readiness gaps (missing sources / packages) are REPORTED, never
 * treated as completed content; they fail the run only with --require-ready.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ss23PackageSchema, registrySchema, type RegistryRow, type Ss23Package } from './registrySchema.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '../../../..');
export const subjectsDir = path.join(here, 'subjects');
export const sha256 = (v: string | Uint8Array) => createHash('sha256').update(v).digest('hex');
export const loadRegistry = (file = path.join(here, 'sourceRegistry.json')): RegistryRow[] =>
  registrySchema.parse(JSON.parse(readFileSync(file, 'utf8')));

const TERMS = ['1st Term', '2nd Term', '3rd Term'] as const;
const CLASSES = ['SS 2', 'SS 3'] as const;
const dirFor = (c: string) => c.replace(' ', '').toLowerCase();

/** Lesson ids bind to the package subject by full slug or by initials (catering-craft -> CC). */
export function isSubjectLessonId(id: string, slug: string, cls: string): boolean {
  const parts = slug.toUpperCase().split('-');
  const tag = `SUP-SS${cls.slice(-1)}-`;
  return [parts.join('-'), parts.map(p => p[0]).join('')].some(p => id.startsWith(`${tag}${p}-`));
}

/** Returns every problem found in one package; empty array = valid. */
export function checkPackage(file: string, raw: unknown, registry: RegistryRow[], expectedClass?: string, root = repoRoot): string[] {
  const errs: string[] = [];
  const parsed = ss23PackageSchema.safeParse(raw);
  if (!parsed.success) return parsed.error.issues.map(i => `${file}: SCHEMA ${i.path.join('.')}: ${i.message}`);
  const p: Ss23Package = parsed.data;
  const e = (m: string) => errs.push(`${file}: ${m}`);
  if (expectedClass && p.class_name !== expectedClass) e(`CLASS_MISMATCH package says ${p.class_name}, directory says ${expectedClass}`);
  if (path.basename(file) !== `${p.subject_slug}.json`) e(`FILENAME_SLUG_MISMATCH ${path.basename(file)} vs ${p.subject_slug}`);
  if (!registry.some(r => r.class_name === p.class_name && r.assigned_subject_slug === p.subject_slug)) e(`UNREGISTERED_SUBJECT ${p.class_name}/${p.subject_slug} has no source in the registry`);

  const dup = (ids: string[], label: string) => { if (new Set(ids).size !== ids.length) e(`DUPLICATE ${label}`); };
  dup(p.lessons.map(l => l.id), 'lesson ids'); dup(p.source_rules.map(r => r.id), 'source-rule ids'); dup(p.assets.map(a => a.id), 'asset ids');
  dup(p.coverage.map(c => c.id), 'coverage ids'); dup(p.sources.map(s => s.source_id), 'source ids');

  // Broken source references / invalid source hashes: every source must match the registry exactly.
  const reg = new Map(registry.map(r => [r.source_id, r]));
  const sourceSha = new Map<string, string>();
  for (const s of p.sources) {
    sourceSha.set(s.source_id, s.sha256);
    const r = reg.get(s.source_id);
    if (!r) { e(`BROKEN_SOURCE_REFERENCE ${s.source_id} is not in the registry`); continue; }
    if (r.sha256 !== s.sha256) e(`SOURCE_HASH_MISMATCH ${s.source_id}`);
    if (r.archive_member !== s.archive_member) e(`SOURCE_MEMBER_MISMATCH ${s.source_id}`);
    if (r.class_name !== s.class_name || r.class_name !== p.class_name) e(`SOURCE_CLASS_MISMATCH ${s.source_id}`);
    if (r.term !== s.term) e(`SOURCE_TERM_MISMATCH ${s.source_id}`);
    if (r.assigned_subject_slug !== p.subject_slug) e(`SOURCE_SUBJECT_MISMATCH ${s.source_id} is registered to ${r.assigned_subject_slug}`);
  }
  for (const s of p.external_sources) sourceSha.set(s.source_id, s.sha256);
  for (const r of p.source_rules) {
    if (!sourceSha.has(r.source_id)) e(`BROKEN_SOURCE_REFERENCE rule ${r.id} -> ${r.source_id}`);
    else if (sourceSha.get(r.source_id) !== r.source_sha256) e(`RULE_SOURCE_HASH_MISMATCH ${r.id}`);
  }
  for (const c of p.delivery_corrections) if (sourceSha.get(c.source_id) !== c.source_sha256) e(`CORRECTION_SOURCE_REFERENCE ${c.id}`);

  const lessonIds = new Set(p.lessons.map(l => l.id));
  for (const l of p.lessons) {
    if (l.class_name !== p.class_name) e(`LESSON_CLASS_MISMATCH ${l.id}`);
    if (!isSubjectLessonId(l.id, p.subject_slug, p.class_name)) e(`LESSON_ID_NOT_BOUND_TO_CLASS_SUBJECT ${l.id}`);
    if (l.body_sha256 !== sha256(l.body)) e(`BODY_HASH_MISMATCH ${l.id}`);
    if (new Set(l.practice.map(q => q.id)).size !== l.practice.length) e(`DUPLICATE practice ids in ${l.id}`);
    for (const q of l.practice) {
      const total = q.marking.reduce((t, m) => t + m.marks, 0);
      if (q.marks !== total) e(`MARKING_TOTAL_MISMATCH ${l.id}/${q.id} marks=${q.marks} criteria=${total}`);
      if (q.options && !q.options.includes(q.answer) && !/^[A-E]$/.test(q.answer.trim())) e(`ANSWER_NOT_AN_OPTION ${l.id}/${q.id}`);
    }
  }
  for (const a of p.assets) {
    if (!lessonIds.has(a.lesson_id)) { e(`ASSET_LESSON_MISSING ${a.id} -> ${a.lesson_id}`); continue; }
    const f = path.resolve(root, a.path);
    if (!f.startsWith(root + path.sep)) { e(`ASSET_PATH_ESCAPES_REPO ${a.id}`); continue; }
    if (!existsSync(f)) { e(`ASSET_FILE_MISSING ${a.id} ${a.path}`); continue; }
    const bytes = readFileSync(f);
    if (bytes.byteLength !== a.bytes) e(`ASSET_BYTES_MISMATCH ${a.id}`);
    if (sha256(bytes) !== a.sha256) e(`ASSET_HASH_MISMATCH ${a.id}`);
  }
  const ruleIds = new Set(p.source_rules.map(r => r.id));
  const corrIds = new Set(p.delivery_corrections.map(c => c.id));
  for (const c of p.coverage) {
    if (!sourceSha.has(c.source_id)) e(`BROKEN_SOURCE_REFERENCE coverage ${c.id} -> ${c.source_id}`);
    for (const id of c.lesson_ids) {
      const original = [...sourceSha.keys()].some(s => id.startsWith(`${s}:BODY:`));
      if (!(lessonIds.has(id) || (c.status === 'MARKER' && ruleIds.has(id)) || original || corrIds.has(id))) e(`UNRESOLVED_COVERAGE_TARGET ${c.id} -> ${id}`);
    }
    // An original-source body alone is SUPPORTED; an "equivalent" claim needs an authored supplement.
    if (c.status === 'IMPLEMENTED_EQUIVALENT' && !c.lesson_ids.some(id => lessonIds.has(id))) e(`EQUIVALENT_WITHOUT_SUPPLEMENT ${c.id}`);
  }
  if (p.package_status === 'IMPLEMENTED') {
    const open = p.coverage.filter(c => c.status === 'UNRESOLVED' || c.status === 'PARTIAL').length;
    const blocking = p.open_items.filter(i => i.blocks_delivery).length;
    if (open) e(`IMPLEMENTED_WITH_${open}_UNRESOLVED_OR_PARTIAL_COVERAGE`);
    if (blocking) e(`IMPLEMENTED_WITH_${blocking}_BLOCKING_OPEN_ITEMS`);
  }
  return errs;
}

export interface TermStatus { class_name: string; subject: string; term: string; sources: number; package: boolean; lessons: number; unresolved_coverage: number; blocking_open_items: number; state: string }

/** Readiness matrix: every subject registered anywhere x every class x term. Absence is SOURCE_MISSING, not complete. */
export function readiness(registry: RegistryRow[], packages: Ss23Package[]): TermStatus[] {
  const subjects = [...new Set(registry.map(r => r.assigned_subject_slug))].sort();
  const out: TermStatus[] = [];
  for (const cls of CLASSES) for (const subject of subjects) for (const term of TERMS) {
    const srcs = registry.filter(r => r.class_name === cls && r.assigned_subject_slug === subject && r.term === term);
    const pkg = packages.find(x => x.class_name === cls && x.subject_slug === subject);
    const lessons = pkg ? pkg.lessons.filter(l => l.term === term).length : 0;
    const termSrc = new Set(srcs.map(s => s.source_id));
    const unresolved = pkg ? pkg.coverage.filter(c => termSrc.has(c.source_id) && (c.status === 'UNRESOLVED' || c.status === 'PARTIAL')).length : 0;
    const blocking = pkg ? pkg.open_items.filter(i => i.blocks_delivery).length : 0;
    let state = 'READY_FOR_REVIEW';
    if (!srcs.length) state = 'SOURCE_MISSING';
    else if (!pkg) state = 'MISSING_PACKAGE';
    else if (pkg.package_status !== 'IMPLEMENTED' || unresolved || blocking) state = 'IN_PROGRESS';
    out.push({ class_name: cls, subject, term, sources: srcs.length, package: !!pkg, lessons, unresolved_coverage: unresolved, blocking_open_items: blocking, state });
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const requireReady = args.includes('--require-ready');
  const pos = args.filter(a => !a.startsWith('--'));
  const only = pos.find(a => /^ss[23]$/.test(a));
  const slug = pos.find(a => a !== only);
  const registry = loadRegistry();
  const errors: string[] = []; const packages: Ss23Package[] = [];
  for (const d of ['ss2', 'ss3']) {
    if (only && only !== d) continue;
    const dir = path.join(subjectsDir, d);
    const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];
    for (const f of files) {
      if (slug && f !== `${slug}.json`) continue;
      const raw = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
      const cls = `SS ${d.slice(-1)}`;
      errors.push(...checkPackage(`${d}/${f}`, raw, registry, cls));
      const ok = ss23PackageSchema.safeParse(raw); if (ok.success) packages.push(ok.data);
    }
  }
  const matrix = readiness(registry, packages).filter(r => (!only || r.class_name === `SS ${only.slice(-1)}`) && (!slug || r.subject === slug));
  const summary = matrix.reduce<Record<string, number>>((a, r) => ({ ...a, [r.state]: (a[r.state] ?? 0) + 1 }), {});
  process.stdout.write(`${JSON.stringify({ valid: errors.length === 0, errors, packages: packages.length, readiness_summary: summary, readiness: matrix }, null, 1)}\n`);
  if (errors.length) { process.stderr.write(`SS23 package validation failed (${errors.length} error(s))\n`); process.exitCode = 1; }
  else if (requireReady && matrix.some(r => r.state !== 'READY_FOR_REVIEW')) { process.stderr.write('SS23 readiness not met (--require-ready)\n'); process.exitCode = 2; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
