/**
 * SS1-only hooks for backend/src/db/ingestTopics.ts.
 *
 * `Ss1ImportSession` is created lazily by the importer ONLY when an SS 1 document is encountered, so every other
 * class's code path is byte-for-byte unchanged. The session never touches the DB and never changes row identity:
 * original rows keep the generic parser's positional identity (school, class, subject, term, order_index); package
 * lessons are APPENDED after the originals of their bucket, so no stored identity is reordered or overwritten.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { SS1_AUTHORITATIVE_ARCHIVE, SS1_CLASS_NAME, SS1_CONTRACT_VERSION, ss1SubjectBySlug } from './constants.js';
import {
  buildIdentityPlan, compareToSnapshot, compileSs1,
  type AliasUse, type CompileOutput, type CurriculumRow, type Ss1Disposition, type Ss1OriginalRecord, type SnapshotRow,
} from './compiler.js';
import { loadSs1Registry, manifestBySha, type LoadOptions, type Ss1ManifestSource, type Ss1Registry } from './loader.js';
import { normalizedBodyHash, rawBodyHash, sha256Hex } from './identity.js';
import { applyTopicRules, type ExcludedDuplicate, type Ss1Topic, type TopicLike } from './sourceRules.js';

export const isSs1Class = (classNames: readonly string[]): boolean => classNames.includes(SS1_CLASS_NAME);

export interface Ss1SourceBinding {
  sourceId: string; sourceSha256: string; slug: string; expectedSubject: string;
  termLabel: string; sourceIdentity: string; basename: string;
}
export interface Ss1SessionOptions extends LoadOptions {
  root: string;
  allowPartialSources?: boolean;
  requireAllPackages?: boolean;
  /** Write the private, deterministic identity/asset/correction plan (no source bodies) to this path. */
  planOut?: string;
  /** JSON array of SnapshotRow from a designated database snapshot (fail-closed compatibility check). */
  snapshot?: readonly SnapshotRow[];
}

export class Ss1ImportSession {
  readonly registry: Ss1Registry;
  private readonly bySha: Map<string, Ss1ManifestSource>;
  private readonly gateSet = new Set<string>();
  private readonly originals: Ss1OriginalRecord[] = [];
  private readonly excluded: ExcludedDuplicate[] = [];
  private readonly ruleMatches = new Map<string, number>();
  private readonly aliasUses: AliasUse[] = [];
  private readonly sourcesSeen = new Set<string>();
  private compiled: CompileOutput | undefined;

  constructor(private readonly opts: Ss1SessionOptions) {
    this.registry = loadSs1Registry(opts);
    this.bySha = manifestBySha(this.registry.manifest);
    for (const e of this.registry.errors) this.gateSet.add(e);
  }

  /** Bind a file to its manifest entry by exact content hash. Unknown hash => gate (never guessed from the filename). */
  bindSource(a: { sourceIdentity: string; basename: string; termLabel: string; sourceHash: string }): Ss1SourceBinding | null {
    const m = this.bySha.get(a.sourceHash);
    if (!m) {
      this.gateSet.add(`SS1 source is not in the authoritative manifest (sha256 ${a.sourceHash}): ${a.sourceIdentity}. Provide the exact archive ${SS1_AUTHORITATIVE_ARCHIVE.name} (sha256 ${SS1_AUTHORITATIVE_ARCHIVE.sha256}); a same-named file with different bytes is not accepted.`);
      return null;
    }
    if (this.sourcesSeen.has(m.source_id)) return null; // exact byte copy: the importer's duplicate handling reports it
    if (m.term_label !== a.termLabel) {
      this.gateSet.add(`SS1 source ${m.source_id} term mismatch: manifest folder term ${m.term_label}, importer term ${a.termLabel} (${a.sourceIdentity})`);
    }
    this.sourcesSeen.add(m.source_id);
    const reg = ss1SubjectBySlug(m.assigned_subject_slug);
    if (!reg) { this.gateSet.add(`SS1 source ${m.source_id}: unregistered slug ${m.assigned_subject_slug}`); return null; }
    return {
      sourceId: m.source_id, sourceSha256: m.sha256, slug: reg.slug, expectedSubject: reg.canonicalSubject,
      termLabel: a.termLabel, sourceIdentity: a.sourceIdentity, basename: a.basename,
    };
  }

  private rulesFor(sourceId: string) {
    return this.registry.packages.flatMap(p => p.source_rules).filter(r => r.source_id === sourceId);
  }

  /**
   * Reconcile the generic importer's inferred section subject with the manifest assignment.
   * Equal => accepted. A different name is accepted only through a package `explicit_source_alias` rule or an
   * explicit CROSS_SUBJECT_HANDOFF declaration; the registry's known generic-inference names (e.g. "Computer Studies"
   * for Data Processing) are shown under the canonical name but BLOCK until a package approves the alias.
   */
  resolveSubject(b: Ss1SourceBinding, inferred: { name: string; fallback: boolean }): { name: string; fallback: boolean } {
    if (inferred.name === b.expectedSubject && !inferred.fallback) return inferred;
    const alias = this.rulesFor(b.sourceId).find(r => r.op === 'explicit_source_alias' && r.inferred_subject === inferred.name && r.canonical_subject === b.expectedSubject);
    if (alias) {
      this.ruleMatches.set(alias.rule_id, (this.ruleMatches.get(alias.rule_id) ?? 0) + 1);
      this.aliasUses.push({ sourceId: b.sourceId, inferredSubject: inferred.name, canonicalSubject: b.expectedSubject, ruleId: alias.rule_id });
      return { name: b.expectedSubject, fallback: false };
    }
    const reg = ss1SubjectBySlug(b.slug)!;
    if (reg.genericInferredNames.includes(inferred.name)) {
      this.aliasUses.push({ sourceId: b.sourceId, inferredSubject: inferred.name, canonicalSubject: b.expectedSubject, ruleId: null });
      return { name: b.expectedSubject, fallback: false };
    }
    const handoff = this.registry.packages.some(p => p.sources.some(s =>
      s.source_id === b.sourceId && s.role === 'CROSS_SUBJECT_HANDOFF'
      && ss1SubjectBySlug(s.handoff_to_slug ?? '')?.canonicalSubject === inferred.name));
    if (!handoff) {
      this.gateSet.add(`SS1 subject mismatch: manifest assigns ${b.sourceId} (${b.basename}) to "${b.expectedSubject}" but the document/filename inferred "${inferred.name}". Record an explicit_source_alias or CROSS_SUBJECT_HANDOFF in a package; nothing is renamed or deleted silently.`);
    }
    return inferred;
  }

  /** Apply hash-scoped package rules to one section's parsed topics. */
  applyTopicRules<T extends TopicLike>(b: Ss1SourceBinding, subjectName: string, topics: T[]): Ss1Topic<T>[] {
    const rules = this.rulesFor(b.sourceId);
    if (rules.length === 0) return topics.map(t => ({ ...t }) as Ss1Topic<T>);
    const out = applyTopicRules(rules, topics, { sourceId: b.sourceId, sourceSha256: b.sourceSha256, subjectName });
    for (const id of out.matched) this.ruleMatches.set(id, (this.ruleMatches.get(id) ?? 0) + 1);
    this.excluded.push(...out.excluded);
    for (const e of out.errors) this.gateSet.add(e);
    return out.topics;
  }

  /** Record one produced ORIGINAL row (provenance used for delivery-correction/coverage/asset binding). */
  attachRow(b: Ss1SourceBinding, subjectName: string, topic: Ss1Topic<TopicLike>, row: { orderIndex: number }, termLabel: string): void {
    const meta = topic.ss1;
    const disposition: Ss1Disposition = meta?.marker ? 'MARKER' : meta?.splitPart ? 'SPLIT_PART' : meta?.merged ? 'MERGED_STRANDED_LABEL' : 'ORIGINAL';
    this.originals.push({
      sourceId: b.sourceId, sourceSha256: b.sourceSha256, sourceIdentity: b.sourceIdentity, sourceBasename: b.basename,
      termLabel, subjectName, weekLabel: topic.weekLabel, title: topic.title,
      rawBodySha256: rawBodyHash(topic.body), normalizedBodySha256: normalizedBodyHash(topic.body), bodyChars: topic.body.length,
      disposition, ruleIds: [...(meta?.ruleIds ?? [])], marker: meta?.marker, splitPart: meta?.splitPart, body: topic.body, row,
    });
  }

  /** Compile package lessons into extra rows. Call after the whole file loop and BEFORE order numbering. */
  compile(): CurriculumRow[] {
    this.compiled = compileSs1({
      registry: this.registry, originals: this.originals, excluded: this.excluded, ruleMatches: this.ruleMatches,
      aliasUses: this.aliasUses, sourcesSeen: this.sourcesSeen, root: this.opts.root,
      options: { allowPartialSources: !!this.opts.allowPartialSources, requireAllPackages: !!this.opts.requireAllPackages },
    });
    for (const e of this.compiled.errors) this.gateSet.add(e);
    return this.compiled.supplementRows;
  }

  /** After the importer numbered `normalRows`: identity plan, snapshot compatibility, optional private plan file. */
  finalize(normalRows: readonly CurriculumRow[]): void {
    if (!this.compiled) throw new Error('Ss1ImportSession.finalize called before compile()');
    const plan = buildIdentityPlan(this.originals, this.compiled.supplementMeta, normalRows, sha256Hex);
    for (const e of plan.errors) this.gateSet.add(e);
    if (this.opts.snapshot) for (const e of compareToSnapshot(plan.rows, this.opts.snapshot)) this.gateSet.add(`existing-row compatibility: ${e}`);
    if (this.opts.planOut) {
      const c = this.compiled;
      const orderByOriginal = new Map(plan.rows.filter(r => r.kind === 'ORIGINAL').map(r => [`${r.sourceId}|${r.weekLabel}|${r.rawBodySha256}`, r.orderIndex]));
      const orderBySupplement = new Map(plan.rows.filter(r => r.kind === 'SUPPLEMENT').map(r => [r.lessonId as string, r.orderIndex]));
      const doc = {
        contract_version: SS1_CONTRACT_VERSION,
        authoritative_archive: SS1_AUTHORITATIVE_ARCHIVE,
        sources_seen: [...this.sourcesSeen].sort(),
        partial_run: this.sourcesSeen.size !== this.registry.manifest.sources.length,
        subjects: c.subjects, packages: this.registry.statuses.map(s => ({ slug: s.slug, state: s.state, content_approval: s.contentApproval, verification: s.verification })),
        rows: plan.rows,
        assets: c.assets.map(a => ({
          ...a,
          order_index: a.target.kind === 'SUPPLEMENT'
            ? (orderBySupplement.get(a.target.lesson_id) ?? null)
            : (orderByOriginal.get(`${a.target.source_id}|${a.target.week_label}|${a.target.source_body_sha256}`) ?? null),
        })),
        delivery_corrections: c.corrections,
        scheme_only_rows: c.schemeOnlyRows,
        excluded_duplicates: this.excluded,
        notes: c.notes,
        gates: [...this.gateSet].sort(),
      };
      writeFileSync(path.resolve(this.opts.planOut), JSON.stringify(doc, null, 2) + '\n', 'utf8');
    }
  }

  get gates(): string[] { return [...this.gateSet].sort(); }
  get active(): boolean { return this.sourcesSeen.size > 0 || this.gateSet.size > 0; }

  /** Deterministic human-readable report (printed by the importer). */
  reportLines(): string[] {
    const lines: string[] = [];
    lines.push('', `SS1 FOUNDATION (${SS1_CONTRACT_VERSION}) — class ${SS1_CLASS_NAME}; instructional terms: 1st, 2nd, 3rd`);
    lines.push(`  authoritative archive: ${SS1_AUTHORITATIVE_ARCHIVE.name} sha256 ${SS1_AUTHORITATIVE_ARCHIVE.sha256}`);
    lines.push(`  manifest sources read this run: ${this.sourcesSeen.size}/${this.registry.manifest.sources.length}`);
    lines.push('  subject packages (state | originals | markers | splits | supplements | claim):');
    const byslug = new Map((this.compiled?.subjects ?? []).map(s => [s.slug, s]));
    for (const s of this.registry.statuses) {
      const d = byslug.get(s.slug);
      lines.push(`    ${s.slug.padEnd(22)} worker ${s.worker} | ${s.state} | ${d ? `${d.originalRows} | ${d.markerRows} | ${d.splitRows} | ${d.supplementRows} | ${d.claim}` : 'n/a'}`);
    }
    for (const n of this.compiled?.notes ?? []) lines.push(`  note: ${n}`);
    if (this.compiled && this.compiled.schemeOnlyRows.length) {
      lines.push(`  scheme-only / marker rows accounted separately: ${this.compiled.schemeOnlyRows.length}`);
      for (const r of this.compiled.schemeOnlyRows) lines.push(`    ${r.subject} / ${r.term} / ${r.weekLabel} / ${r.classification} / ${r.title}`);
    }
    if (this.excluded.length) {
      lines.push(`  proven duplicates excluded: ${this.excluded.length}`);
      for (const x of this.excluded) lines.push(`    ${x.ruleId}: ${x.sourceId} / ${x.weekLabel} == ${x.duplicateOf.sourceId} / ${x.duplicateOf.weekLabel}`);
    }
    if (this.compiled) lines.push(`  planned supplement rows: ${this.compiled.supplementRows.length}; assets: ${this.compiled.assets.length}; delivery corrections: ${this.compiled.corrections.length}`);
    lines.push(`  status: IMPLEMENTED — TESTING DEFERRED BY OWNER (no PASS is claimed for any SS1 check; 61-source teaching completeness is not established)`);
    if (this.gates.length) {
      lines.push(`SS1 gate FAILED: ${this.gates.length}`);
      for (const g of this.gates) lines.push(`  ${g}`);
    }
    return lines;
  }
}
