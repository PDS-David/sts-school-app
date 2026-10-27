/**
 * SS1 hash-scoped source rules — the constrained operation engine.
 *
 * Rules are declarative data from a subject package (see subjectPackageSchema.ts). They operate on the importer's
 * ALREADY-PARSED topic list of one document section; original instructional lines and their order are preserved
 * (nothing is rewritten, summarised or dropped except a topic the rule explicitly proves is a duplicate).
 *
 * Fail-closed matching: a rule locates its target by (canonical week label + exact anchor). The anchor must occur
 * in exactly ONE topic of the section and exactly ONCE inside that topic. Zero or many is an error, never a guess.
 * A rule that finds no candidate topic in a section is "not applicable here"; the session verifies at the end that
 * every rule matched exactly once across all sections of its source.
 */
import { canonicalWeekLabel, normalizedBodyHash } from './identity.js';
import type { Ss1SourceRule } from './subjectPackageSchema.js';

export interface TopicLike { weekLabel: string; title: string; body: string }

export type Ss1MarkerClass = 'SCHEME_ONLY' | 'EVALUATION_ONLY' | 'HEADING_ONLY' | 'EXAM_OR_REVISION_MARKER';
export interface Ss1TopicMeta {
  ruleIds: string[];
  marker?: Ss1MarkerClass;
  splitPart?: 1 | 2;
  /** A stranded label was attached to this topic (attach_stranded_label). */
  merged?: true;
  /** Raw hash of the body before a split/merge touched it (provenance for audit). */
  priorBodyHashInput?: string;
}
export type Ss1Topic<T extends TopicLike = TopicLike> = T & { ss1?: Ss1TopicMeta };

export interface ExcludedDuplicate {
  ruleId: string; sourceId: string; weekLabel: string; title: string;
  normalizedBodySha256: string;
  duplicateOf: { sourceId: string; weekLabel: string; normalizedBodySha256: string };
}

export interface RuleContext { sourceId: string; sourceSha256: string; subjectName: string }
export interface RuleApplication<T extends TopicLike> {
  topics: Ss1Topic<T>[];
  /** rule_ids matched (exactly once) in this section. */
  matched: string[];
  excluded: ExcludedDuplicate[];
  errors: string[];
}

const countOccurrences = (haystack: string, needle: string): number => {
  if (!needle) return 0;
  let n = 0;
  for (let i = haystack.indexOf(needle); i !== -1; i = haystack.indexOf(needle, i + needle.length)) n += 1;
  return n;
};

const credibleTitle = (s: string): string => {
  const line = s.split('\n').map(l => l.trim()).find(l => l.replace(/[^\p{L}\p{N}]+/gu, '').length > 1);
  return (line ?? '(untitled)').slice(0, 200);
};

type Locate = { index: number } | { error: string } | null;
/** Locate by canonical week label + exact anchor (anchor required to occur exactly once in exactly one topic). */
function locate<T extends TopicLike>(topics: readonly Ss1Topic<T>[], week: string, anchor: string, rule: string): Locate {
  const want = canonicalWeekLabel(week);
  const hits: number[] = [];
  topics.forEach((t, i) => {
    if (canonicalWeekLabel(t.weekLabel) === want && t.body.includes(anchor)) hits.push(i);
  });
  if (hits.length === 0) return null;
  if (hits.length > 1) return { error: `${rule}: anchor matches ${hits.length} topics for ${week}; refusing to guess` };
  if (countOccurrences(topics[hits[0]].body, anchor) !== 1) {
    return { error: `${rule}: anchor occurs ${countOccurrences(topics[hits[0]].body, anchor)} times inside ${week}; it must occur exactly once` };
  }
  return { index: hits[0] };
}

/** Apply every non-alias rule that belongs to this source (hash-scoped) to one section's topics, in rule order. */
export function applyTopicRules<T extends TopicLike>(
  rules: readonly Ss1SourceRule[], input: readonly T[], ctx: RuleContext,
): RuleApplication<T> {
  let topics: Ss1Topic<T>[] = input.map(t => ({ ...t }) as Ss1Topic<T>);
  const matched: string[] = [];
  const excluded: ExcludedDuplicate[] = [];
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.op === 'explicit_source_alias') continue; // subject-level; handled by the session
    if (rule.source_id !== ctx.sourceId) continue;
    if (rule.source_sha256 !== ctx.sourceSha256) {
      errors.push(`${rule.rule_id}: rule hash ${rule.source_sha256} does not match source ${ctx.sourceId} (${ctx.sourceSha256}); rules are hash-scoped`);
      continue;
    }

    if (rule.op === 'split_before_anchor') {
      const loc = locate(topics, rule.week_label, rule.anchor, rule.rule_id);
      if (!loc) continue;
      if ('error' in loc) { errors.push(loc.error); continue; }
      const t = topics[loc.index];
      const cut = t.body.indexOf(rule.anchor);
      const before = t.body.slice(0, cut).trimEnd();
      const after = t.body.slice(cut);
      if (!before.trim() || !after.trim()) { errors.push(`${rule.rule_id}: split would create an empty part`); continue; }
      const first: Ss1Topic<T> = { ...t, body: before };
      const second: Ss1Topic<T> = { ...t, body: after, title: rule.new_title ?? credibleTitle(after) };
      first.ss1 = { ruleIds: [...(t.ss1?.ruleIds ?? []), rule.rule_id], splitPart: 1, priorBodyHashInput: t.body };
      second.ss1 = { ruleIds: [...(t.ss1?.ruleIds ?? []), rule.rule_id], splitPart: 2, priorBodyHashInput: t.body };
      topics = [...topics.slice(0, loc.index), first, second, ...topics.slice(loc.index + 1)];
      matched.push(rule.rule_id);
    } else if (rule.op === 'attach_stranded_label') {
      const want = canonicalWeekLabel(rule.week_label);
      const idxs: number[] = [];
      topics.forEach((t, i) => {
        if (canonicalWeekLabel(t.weekLabel) !== want) return;
        const rest = t.body.replace(/^\s*week\s*[:.\-]*\s*[^\n]*/i, '').trim();
        if (rest === rule.label_anchor.trim()) idxs.push(i);
      });
      if (idxs.length === 0) continue;
      if (idxs.length > 1) { errors.push(`${rule.rule_id}: ${idxs.length} stranded-label candidates for ${rule.week_label}; refusing to guess`); continue; }
      const i = idxs[0];
      const j = rule.direction === 'NEXT' ? i + 1 : i - 1;
      if (j < 0 || j >= topics.length) { errors.push(`${rule.rule_id}: no ${rule.direction.toLowerCase()} topic to attach to`); continue; }
      const stranded = topics[i];
      const target = topics[j];
      const merged: Ss1Topic<T> = {
        ...target,
        body: rule.direction === 'NEXT' ? `${stranded.body}\n${target.body}` : `${target.body}\n${stranded.body}`,
        title: rule.use_label_as_title ? rule.label_anchor.trim().slice(0, 200) : target.title,
      };
      merged.ss1 = { ruleIds: [...(target.ss1?.ruleIds ?? []), rule.rule_id], merged: true, priorBodyHashInput: target.body };
      topics = topics.flatMap((t, k) => (k === i ? [] : k === j ? [merged] : [t]));
      matched.push(rule.rule_id);
    } else if (rule.op === 'classify_marker') {
      const loc = locate(topics, rule.week_label, rule.anchor, rule.rule_id);
      if (!loc) continue;
      if ('error' in loc) { errors.push(loc.error); continue; }
      const t = topics[loc.index];
      t.ss1 = { ...(t.ss1 ?? { ruleIds: [] }), ruleIds: [...(t.ss1?.ruleIds ?? []), rule.rule_id], marker: rule.classification };
      matched.push(rule.rule_id);
    } else if (rule.op === 'exclude_proven_duplicate') {
      const loc = locate(topics, rule.week_label, rule.anchor, rule.rule_id);
      if (!loc) continue;
      if ('error' in loc) { errors.push(loc.error); continue; }
      const t = topics[loc.index];
      const actual = normalizedBodyHash(t.body);
      if (actual !== rule.normalized_body_sha256) {
        errors.push(`${rule.rule_id}: topic body hash ${actual} is not the proven-duplicate hash ${rule.normalized_body_sha256}`);
        continue;
      }
      if (rule.duplicate_of.normalized_body_sha256 !== rule.normalized_body_sha256) {
        errors.push(`${rule.rule_id}: duplicate_of hash differs from the excluded topic hash`);
        continue;
      }
      excluded.push({
        ruleId: rule.rule_id, sourceId: ctx.sourceId, weekLabel: t.weekLabel, title: t.title,
        normalizedBodySha256: actual, duplicateOf: { sourceId: rule.duplicate_of.source_id, weekLabel: rule.duplicate_of.week_label, normalizedBodySha256: rule.duplicate_of.normalized_body_sha256 },
      });
      topics = topics.filter((_, k) => k !== loc.index);
      matched.push(rule.rule_id);
    }
  }
  return { topics, matched, excluded, errors };
}
