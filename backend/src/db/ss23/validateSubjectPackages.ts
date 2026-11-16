/**
 * SS2 / SS3 package validator.
 *
 * Supports both the original registry-only lesson audit format (subjects/ss2 and subjects/ss3)
 * and the current SS2 instructional / SS3 exam-preparation unit contract (subjects/*.json).
 * New packages are validated against subjectPackageSchema; source inventory rows are validated
 * separately against registrySchema. Neither format can silently hide the other.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  ss23PackageSchema as legacyPackageSchema,
  registrySchema,
  type RegistryRow,
  type Ss23Package as LegacyPackage,
} from './registrySchema.js';
import { packageSchema as unitPackageSchema, type Ss23Package as UnitPackage } from './subjectPackageSchema.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '../../../..');
export const subjectsDir = path.join(here, 'subjects');
export const sha256 = (v: string | Uint8Array) => createHash('sha256').update(v).digest('hex');
export const loadRegistry = (file = path.join(here, 'sourceRegistry.json')): RegistryRow[] =>
  registrySchema.parse(JSON.parse(readFileSync(file, 'utf8')));

const TERMS = ['1st Term', '2nd Term', '3rd Term'] as const;
const CLASSES = ['SS 2', 'SS 3'] as const;

/** Lesson ids bind to the package subject by full slug or by initials (catering-craft -> CC). */
export function isSubjectLessonId(id: string, slug: string, cls: string): boolean {
  const parts = slug.toUpperCase().split('-');
  const tag = 'SUP-SS' + cls.slice(-1) + '-';
  return [parts.join('-'), parts.map(p => p[0]).join('')].some(p => id.startsWith(tag + p + '-'));
}

/** Validate the legacy registry audit package shape. Retained for compatibility with existing audit fixtures. */
export function checkPackage(file: string, raw: unknown, registry: RegistryRow[], expectedClass?: string, root = repoRoot): string[] {
  const errs: string[] = [];
  const parsed = legacyPackageSchema.safeParse(raw);
  if (!parsed.success) return parsed.error.issues.map(i => file + ': SCHEMA ' + i.path.join('.') + ': ' + i.message);
  const p: LegacyPackage = parsed.data;
  const e = (m: string) => errs.push(file + ': ' + m);
  if (expectedClass && p.class_name !== expectedClass) e('CLASS_MISMATCH package says ' + p.class_name + ', directory says ' + expectedClass);
  if (path.basename(file) !== p.subject_slug + '.json') e('FILENAME_SLUG_MISMATCH ' + path.basename(file) + ' vs ' + p.subject_slug);
  if (!registry.some(r => r.class_name === p.class_name && r.assigned_subject_slug === p.subject_slug)) e('UNREGISTERED_SUBJECT ' + p.class_name + '/' + p.subject_slug + ' has no source in the registry');

  const dup = (ids: string[], label: string) => { if (new Set(ids).size !== ids.length) e('DUPLICATE ' + label); };
  dup(p.lessons.map(l => l.id), 'lesson ids'); dup(p.source_rules.map(r => r.id), 'source-rule ids'); dup(p.assets.map(a => a.id), 'asset ids');
  dup(p.coverage.map(c => c.id), 'coverage ids'); dup(p.sources.map(s => s.source_id), 'source ids');

  const reg = new Map(registry.map(r => [r.source_id, r]));
  const sourceSha = new Map<string, string>();
  for (const s of p.sources) {
    sourceSha.set(s.source_id, s.sha256);
    const r = reg.get(s.source_id);
    if (!r) { e('BROKEN_SOURCE_REFERENCE ' + s.source_id + ' is not in the registry'); continue; }
    if (r.sha256 !== s.sha256) e('SOURCE_HASH_MISMATCH ' + s.source_id);
    if (r.archive_member !== s.archive_member) e('SOURCE_MEMBER_MISMATCH ' + s.source_id);
    if (r.class_name !== s.class_name || r.class_name !== p.class_name) e('SOURCE_CLASS_MISMATCH ' + s.source_id);
    if (r.term !== s.term) e('SOURCE_TERM_MISMATCH ' + s.source_id);
    if (r.assigned_subject_slug !== p.subject_slug) e('SOURCE_SUBJECT_MISMATCH ' + s.source_id + ' is registered to ' + r.assigned_subject_slug);
  }
  for (const s of p.external_sources) sourceSha.set(s.source_id, s.sha256);
  for (const r of p.source_rules) {
    if (!sourceSha.has(r.source_id)) e('BROKEN_SOURCE_REFERENCE rule ' + r.id + ' -> ' + r.source_id);
    else if (sourceSha.get(r.source_id) !== r.source_sha256) e('RULE_SOURCE_HASH_MISMATCH ' + r.id);
  }
  for (const c of p.delivery_corrections) if (sourceSha.get(c.source_id) !== c.source_sha256) e('CORRECTION_SOURCE_REFERENCE ' + c.id);

  const lessonIds = new Set(p.lessons.map(l => l.id));
  for (const l of p.lessons) {
    if (l.class_name !== p.class_name) e('LESSON_CLASS_MISMATCH ' + l.id);
    if (!isSubjectLessonId(l.id, p.subject_slug, p.class_name)) e('LESSON_ID_NOT_BOUND_TO_CLASS_SUBJECT ' + l.id);
    if (l.body_sha256 !== sha256(l.body)) e('BODY_HASH_MISMATCH ' + l.id);
    if (new Set(l.practice.map(q => q.id)).size !== l.practice.length) e('DUPLICATE practice ids in ' + l.id);
    for (const q of l.practice) {
      const total = q.marking.reduce((t, m) => t + m.marks, 0);
      if (q.marks !== total) e('MARKING_TOTAL_MISMATCH ' + l.id + '/' + q.id + ' marks=' + q.marks + ' criteria=' + total);
      if (q.options && !q.options.includes(q.answer) && !/^[A-E]$/.test(q.answer.trim())) e('ANSWER_NOT_AN_OPTION ' + l.id + '/' + q.id);
    }
  }
  for (const a of p.assets) {
    if (!lessonIds.has(a.lesson_id)) { e('ASSET_LESSON_MISSING ' + a.id + ' -> ' + a.lesson_id); continue; }
    const f = path.resolve(root, a.path);
    const relative = path.relative(root, f);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) { e('ASSET_PATH_ESCAPES_REPO ' + a.id); continue; }
    if (!existsSync(f)) { e('ASSET_FILE_MISSING ' + a.id + ' ' + a.path); continue; }
    const bytes = readFileSync(f);
    if (bytes.byteLength !== a.bytes) e('ASSET_BYTES_MISMATCH ' + a.id);
    if (sha256(bytes) !== a.sha256) e('ASSET_HASH_MISMATCH ' + a.id);
  }
  const ruleIds = new Set(p.source_rules.map(r => r.id));
  const corrIds = new Set(p.delivery_corrections.map(c => c.id));
  for (const c of p.coverage) {
    if (!sourceSha.has(c.source_id)) e('BROKEN_SOURCE_REFERENCE coverage ' + c.id + ' -> ' + c.source_id);
    for (const id of c.lesson_ids) {
      const original = [...sourceSha.keys()].some(s => id.startsWith(s + ':BODY:'));
      if (!(lessonIds.has(id) || (c.status === 'MARKER' && ruleIds.has(id)) || original || corrIds.has(id))) e('UNRESOLVED_COVERAGE_TARGET ' + c.id + ' -> ' + id);
    }
    if (c.status === 'IMPLEMENTED_EQUIVALENT' && !c.lesson_ids.some(id => lessonIds.has(id))) e('EQUIVALENT_WITHOUT_SUPPLEMENT ' + c.id);
  }
  if (p.package_status === 'IMPLEMENTED') {
    const open = p.coverage.filter(c => c.status === 'UNRESOLVED' || c.status === 'PARTIAL').length;
    const blocking = p.open_items.filter(i => i.blocks_delivery).length;
    if (open) e('IMPLEMENTED_WITH_' + open + '_UNRESOLVED_OR_PARTIAL_COVERAGE');
    if (blocking) e('IMPLEMENTED_WITH_' + blocking + '_BLOCKING_OPEN_ITEMS');
  }
  return errs;
}

/** Validate a current unit-contract package against the authoritative 100-row source registry. */
export function checkUnitPackage(file: string, raw: unknown, registry: RegistryRow[], expectedClass?: string, root = repoRoot): string[] {
  const errs: string[] = [];
  const parsed = unitPackageSchema.safeParse(raw);
  if (!parsed.success) return parsed.error.issues.map(i => file + ': SCHEMA ' + i.path.join('.') + ': ' + i.message);
  const p: UnitPackage = parsed.data;
  const e = (m: string) => errs.push(file + ': ' + m);
  if (expectedClass && p.class_name !== expectedClass) e('CLASS_MISMATCH package says ' + p.class_name + ', expected ' + expectedClass);
  if (path.basename(file) !== p.subject_slug + '.json') e('FILENAME_SLUG_MISMATCH ' + path.basename(file) + ' vs ' + p.subject_slug);
  if (!registry.some(r => r.class_name === p.class_name && r.assigned_subject_slug === p.subject_slug)) e('UNREGISTERED_SUBJECT ' + p.class_name + '/' + p.subject_slug + ' has no source in the registry');

  const reg = new Map(registry.map(r => [r.source_id, r]));
  for (const source of p.sources) {
    const row = reg.get(source.source_id);
    if (!row) { e('BROKEN_SOURCE_REFERENCE ' + source.source_id + ' is not in the registry'); continue; }
    if (row.sha256 !== source.sha256) e('SOURCE_HASH_MISMATCH ' + source.source_id);
    if (row.bytes !== source.bytes) e('SOURCE_BYTES_MISMATCH ' + source.source_id);
    if (row.class_name !== source.class_name || row.class_name !== p.class_name) e('SOURCE_CLASS_MISMATCH ' + source.source_id);
    if (row.term !== source.term) e('SOURCE_TERM_MISMATCH ' + source.source_id);
    if (row.assigned_subject_slug !== p.subject_slug) e('SOURCE_SUBJECT_MISMATCH ' + source.source_id + ' is registered to ' + row.assigned_subject_slug);
    // archive_member is intentionally not compared: the same SHA-256 member can be
    // received in a consolidated archive with a different folder prefix.
  }

  const sourceIds = new Set([...p.sources.map(s => s.source_id), ...p.external_sources.map(s => s.source_id)]);
  for (const unit of p.units) {
    if (unit.body_sha256 !== sha256(unit.body)) e('BODY_HASH_MISMATCH ' + unit.id);
    for (const question of unit.practice) {
      const total = question.marking.reduce((sum, criterion) => sum + criterion.marks, 0);
      if (total !== question.marks) e('MARKING_TOTAL_MISMATCH ' + unit.id + '/' + question.id);
    }
    for (const ref of unit.provenance) if (!sourceIds.has(ref.source_id)) e('BROKEN_UNIT_PROVENANCE ' + unit.id + ' -> ' + ref.source_id);
  }

  for (const asset of p.assets) {
    const filePath = path.resolve(root, asset.path);
    const relative = path.relative(root, filePath);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) { e('ASSET_PATH_ESCAPES_REPO ' + asset.id); continue; }
    if (!existsSync(filePath)) {
      const approved = asset.state.content_approval === 'APPROVED' &&
        asset.state.implementation === 'IMPLEMENTED' &&
        asset.state.verification === 'VERIFIED' &&
        asset.provenance.reuse_status === 'PERMITTED';
      if (approved) e('APPROVED_ASSET_FILE_MISSING ' + asset.id + ' ' + asset.path);
      continue; // Unapproved source-extract references are metadata, not deliverable files.
    }
    const bytes = readFileSync(filePath);
    if (bytes.byteLength !== asset.bytes) e('ASSET_BYTES_MISMATCH ' + asset.id);
    if (sha256(bytes) !== asset.sha256) e('ASSET_HASH_MISMATCH ' + asset.id);
  }

  if (p.package_status === 'IMPLEMENTED') {
    const unresolved = p.coverage.filter(row => row.status === 'UNRESOLVED' || row.status === 'PARTIAL').length;
    const blocking = p.open_items.filter(item => item.blocks_delivery).length;
    if (unresolved) e('IMPLEMENTED_WITH_' + unresolved + '_UNRESOLVED_OR_PARTIAL_COVERAGE');
    if (blocking) e('IMPLEMENTED_WITH_' + blocking + '_BLOCKING_OPEN_ITEMS');
  }
  return errs;
}

export interface TermStatus {
  class_name: string;
  subject: string;
  term: string;
  sources: number;
  package: boolean;
  lessons: number;
  unresolved_coverage: number;
  blocking_open_items: number;
  state: string;
}

/** Readiness for the legacy audit-package shape. */
export function readiness(registry: RegistryRow[], packages: LegacyPackage[]): TermStatus[] {
  const subjects = [...new Set(registry.map(r => r.assigned_subject_slug))].sort();
  const out: TermStatus[] = [];
  for (const cls of CLASSES) for (const subject of subjects) for (const term of TERMS) {
    const srcs = registry.filter(r => r.class_name === cls && r.assigned_subject_slug === subject && r.term === term);
    const pkg = packages.find(x => x.class_name === cls && x.subject_slug === subject);
    const lessons = pkg ? pkg.lessons.filter(l => l.term === term).length : 0;
    const packageHasTermSource = pkg ? pkg.sources.some(source => source.term === term) : false;
    const hasTermContent = packageHasTermSource || lessons > 0;
    const termSrc = new Set(srcs.map(s => s.source_id));
    const unresolved = pkg ? pkg.coverage.filter(c => termSrc.has(c.source_id) && (c.status === 'UNRESOLVED' || c.status === 'PARTIAL')).length : 0;
    const blocking = pkg ? pkg.open_items.filter(i => i.blocks_delivery).length : 0;
    let state = 'READY_FOR_REVIEW';
    if (!srcs.length) state = 'SOURCE_MISSING';
    else if (!pkg) state = 'MISSING_PACKAGE';
    else if (!hasTermContent) state = 'MISSING_TERM_PACKAGE';
    else if (pkg.package_status !== 'IMPLEMENTED' || unresolved || blocking) state = 'IN_PROGRESS';
    out.push({ class_name: cls, subject, term, sources: srcs.length, package: !!pkg, lessons, unresolved_coverage: unresolved, blocking_open_items: blocking, state });
  }
  return out;
}

/** Readiness for the current unit-contract package shape. */
export function readinessForUnitPackages(registry: RegistryRow[], packages: UnitPackage[]): TermStatus[] {
  const subjects = [...new Set(registry.map(r => r.assigned_subject_slug))].sort();
  const out: TermStatus[] = [];
  for (const cls of CLASSES) for (const subject of subjects) for (const term of TERMS) {
    const srcs = registry.filter(r => r.class_name === cls && r.assigned_subject_slug === subject && r.term === term);
    const pkg = packages.find(x => x.class_name === cls && x.subject_slug === subject);
    const lessons = pkg ? pkg.units.filter(unit => unit.term === term).length : 0;
    const packageHasTermSource = pkg ? pkg.sources.some(source => source.term === term) : false;
    const hasTermContent = packageHasTermSource || lessons > 0;
    const termSrc = new Set(srcs.map(s => s.source_id));
    const unresolved = pkg ? pkg.coverage.filter(row => termSrc.has(row.source_id) && (row.status === 'UNRESOLVED' || row.status === 'PARTIAL')).length : 0;
    const blocking = pkg ? pkg.open_items.filter(item => item.blocks_delivery).length : 0;
    let state = 'READY_FOR_REVIEW';
    if (!srcs.length) state = 'SOURCE_MISSING';
    else if (!pkg) state = 'MISSING_PACKAGE';
    else if (!hasTermContent) state = 'MISSING_TERM_PACKAGE';
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
  const errors: string[] = [];
  const legacyPackages: LegacyPackage[] = [];
  const unitPackages: UnitPackage[] = [];
  const packageKeys = new Set<string>();

  // Current unit-contract packages live directly in subjects/*.json (same location as the loader).
  const rootFiles = existsSync(subjectsDir) ? readdirSync(subjectsDir).filter(file => file.endsWith('.json')).sort() : [];
  for (const file of rootFiles) {
    if (slug && file !== slug + '.json') continue;
    const fullPath = path.join(subjectsDir, file);
    const raw = JSON.parse(readFileSync(fullPath, 'utf8')) as unknown;
    const expectedClass = raw && typeof raw === 'object' && 'class_name' in raw ? String((raw as any).class_name) : undefined;
    if (only && expectedClass && expectedClass !== ('SS ' + only.slice(-1))) continue;
    errors.push(...checkUnitPackage(file, raw, registry, expectedClass));
    const parsed = unitPackageSchema.safeParse(raw);
    if (parsed.success) {
      const key = parsed.data.class_name + '/' + parsed.data.subject_slug;
      if (packageKeys.has(key)) errors.push('DUPLICATE_PACKAGE ' + key);
      packageKeys.add(key);
      unitPackages.push(parsed.data);
    }
  }

  // Retain support for registry audit packages in class-specific subdirectories.
  for (const directory of ['ss2', 'ss3']) {
    if (only && only !== directory) continue;
    const dir = path.join(subjectsDir, directory);
    const files = existsSync(dir) ? readdirSync(dir).filter(file => file.endsWith('.json')).sort() : [];
    for (const file of files) {
      if (slug && file !== slug + '.json') continue;
      const raw = JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as unknown;
      const expectedClass = 'SS ' + directory.slice(-1);
      if (directory === 'ss3' && unitPackageSchema.safeParse(raw).success) {
        errors.push(...checkUnitPackage(file, raw, registry, expectedClass));
        const parsedUnit = unitPackageSchema.safeParse(raw);
        if (parsedUnit.success) {
          const key = parsedUnit.data.class_name + '/' + parsedUnit.data.subject_slug;
          if (packageKeys.has(key)) errors.push('DUPLICATE_PACKAGE ' + key);
          packageKeys.add(key);
          unitPackages.push(parsedUnit.data);
        }
        continue;
      }
      errors.push(...checkPackage(file, raw, registry, expectedClass));
      const parsed = legacyPackageSchema.safeParse(raw);
      if (parsed.success) {
        const key = parsed.data.class_name + '/' + parsed.data.subject_slug;
        if (packageKeys.has(key)) errors.push('DUPLICATE_PACKAGE ' + key);
        packageKeys.add(key);
        legacyPackages.push(parsed.data);
      }
    }
  }

  const legacyMatrix = readiness(registry, legacyPackages);
  const unitMatrix = readinessForUnitPackages(registry, unitPackages);
  const matrix = legacyMatrix.map(row => {
    const unit = unitMatrix.find(candidate =>
      candidate.class_name === row.class_name && candidate.subject === row.subject && candidate.term === row.term,
    );
    return unit && unit.package ? unit : row;
  }).filter(row => (!only || row.class_name === 'SS ' + only.slice(-1)) && (!slug || row.subject === slug));

  const summary = matrix.reduce<Record<string, number>>((acc, row) => {
    acc[row.state] = (acc[row.state] ?? 0) + 1;
    return acc;
  }, {});
  process.stdout.write(JSON.stringify({
    valid: errors.length === 0,
    errors,
    packages: legacyPackages.length + unitPackages.length,
    readiness_summary: summary,
    readiness: matrix,
  }, null, 1) + '\n');
  if (errors.length) {
    process.stderr.write('SS23 package validation failed (' + errors.length + ' error(s))\n');
    process.exitCode = 1;
  } else if (requireReady && matrix.some(row => row.state !== 'READY_FOR_REVIEW')) {
    process.stderr.write('SS23 readiness not met (--require-ready)\n');
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
