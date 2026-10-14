/**
 * JSS3 pending scheme-only entries (Agent 1F-R3).
 *
 * scheme_only_integration_manifest.csv lists eight scheme-only headings whose
 * integration_status is "pending parser and plan integration; do not import".
 * No later approval has been supplied. They stay VISIBLE in the audit report
 * (held section, with source references) but must never reach the row
 * collection that feeds the database-write path.
 *
 * Identity is class + subject + ORIGINAL term + source filename + canonical week
 * + title. Never title alone (e.g. Mathematics has two Week-4 rows, Business
 * Studies "Display" also occurs inside another row's body).
 *
 * Fail-closed: the only status this module accepts is the manifest's pending
 * phrase, with approval "none". Any other / unknown / contradictory status throws;
 * nothing here can release an entry. Releasing one needs a new, explicit,
 * reviewed change to this register, not a runtime value.
 *
 * Pure functions, no I/O. The text-resolution modules still emit these headings
 * as before; the hold is applied after parsing, so Female Genital Mutilation
 * (PHE Week 6) and every other row keep their text and provenance untouched.
 */
import { createHash } from 'node:crypto';
import { canonicalJss3Week } from './jss3CurriculumResolutions.js';

/** Verbatim integration_status from the supplied manifest. */
export const JSS3_PENDING_STATUS = 'pending parser and plan integration; do not import';

export const JSS3_PENDING_REASON =
  'Manifest integration_status is "pending parser and plan integration; do not import"; no later approval supplied (1E-2R disposition: permission UNRESOLVED).';

export interface Jss3PendingEntry {
  className: 'JSS 3';
  subject: string;
  /** Term the source file belongs to (and the manifest's original_term). */
  originalTerm: '1st Term' | '2nd Term';
  basename: string;
  /** Week as printed in the manifest ("scheme" for rows without a week). */
  manifestWeek: string;
  /** Canonical week of the parsed row the importer produces for it. */
  parsedWeek: string;
  title: string;
  destinationTerm: '1st Term' | '2nd Term';
  /** Copied from the manifest; must equal JSS3_PENDING_STATUS. */
  integrationStatus: string;
  /** No approval has been supplied; the only accepted value is 'none'. */
  approval: 'none';
}

const BUSINESS = 'business_studies JSS3.docx';
const MATHS = 'BASIC 9 MATHEMATICS E-NOTE.docx';
const entry = (
  subject: string, originalTerm: '1st Term' | '2nd Term', basename: string, manifestWeek: string, parsedWeek: string, title: string,
): Jss3PendingEntry => ({
  className: 'JSS 3', subject, originalTerm, basename, manifestWeek, parsedWeek, title,
  destinationTerm: originalTerm, integrationStatus: JSS3_PENDING_STATUS, approval: 'none',
});

/** The eight manifest rows, in manifest order. */
export const JSS3_PENDING_ENTRIES: readonly Jss3PendingEntry[] = [
  entry('Business Studies', '2nd Term', BUSINESS, 'WEEK 4', '4', 'Book – keeping ethnics'),
  entry('Business Studies', '2nd Term', BUSINESS, 'WEEK 8', '8', 'Display'),
  entry('Business Studies', '2nd Term', BUSINESS, 'WEEK 9', '9', 'Types of Display'),
  entry('Business Studies', '2nd Term', BUSINESS, 'WEEK 10', '10', 'Printers correction signs / speed development'),
  entry('Basic Technology', '1st Term', 'BASIC TECH.docx', 'scheme', '11', 'scale drawing'),
  entry('Basic Technology', '1st Term', 'BASIC TECH.docx', 'scheme', '12', 'simple blue print reading'),
  entry('Mathematics', '2nd Term', MATHS, 'scheme', '4', 'Statistics II'),
  entry('Physical & Health Education', '1st Term', 'PHE JS 3.docx', 'WEEK 5', '5', 'Practical demonstration of basic skills of hockey'),
];

const normTitle = (s: string) => s.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const normBody = (s: string) => s.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

export const pendingEntryKey = (e: Jss3PendingEntry): string =>
  JSON.stringify([e.className, e.subject, e.originalTerm, e.basename, e.parsedWeek, normTitle(e.title)]);

/**
 * Throws unless every entry is exactly a pending, unapproved manifest row.
 * Unknown, empty, differently-worded or "approved" states are rejected, never
 * treated as eligible.
 */
export function assertJss3PendingRegisterValid(register: readonly Jss3PendingEntry[] = JSS3_PENDING_ENTRIES): void {
  if (register.length !== 8) throw new Error(`JSS3 pending register must hold exactly 8 entries (found ${register.length})`);
  const seen = new Set<string>();
  for (const e of register) {
    const label = `${e.subject} / ${e.originalTerm} / ${e.basename} / ${e.manifestWeek} / ${e.title}`;
    if (e.integrationStatus !== JSS3_PENDING_STATUS) {
      throw new Error(`JSS3 pending entry has unknown or contradictory integration status "${String(e.integrationStatus)}" (not eligible, not released): ${label}`);
    }
    if ((e.approval as string) !== 'none') {
      throw new Error(`JSS3 pending entry carries approval "${String(e.approval)}" but no approval has been supplied; entry stays held: ${label}`);
    }
    if (e.className !== 'JSS 3' || e.destinationTerm !== e.originalTerm) {
      throw new Error(`JSS3 pending entry has an unexpected class/destination: ${label}`);
    }
    const key = pendingEntryKey(e);
    if (seen.has(key)) throw new Error(`JSS3 pending register has a duplicate identity: ${label}`);
    seen.add(key);
  }
}

export interface PendingTopicShape { weekLabel: string; title: string; body: string }

export interface Jss3HeldRecord {
  entry: Jss3PendingEntry;
  /** Source reference as the importer saw it (week label as printed, body size/hash). */
  weekLabel: string;
  bodyChars: number;
  bodySha256: string;
  reason: string;
}

/** The pending entry a parsed topic is, or null. Identity match only. */
export function matchJss3PendingEntry(
  className: string, originalTerm: string, basename: string, subject: string, topic: { weekLabel: string; title: string },
  register: readonly Jss3PendingEntry[] = JSS3_PENDING_ENTRIES,
): Jss3PendingEntry | null {
  if (className !== 'JSS 3') return null;
  const week = canonicalJss3Week(topic.weekLabel);
  const title = normTitle(topic.title);
  return register.find(e =>
    e.originalTerm === originalTerm && e.basename === basename && e.subject === subject
    && e.parsedWeek === week && normTitle(e.title) === title) ?? null;
}

/**
 * Split one file-section's parsed topics into rows eligible for the import plan
 * and held pending entries. Relative order of `kept` is unchanged. Validates the
 * register first, so an invalid status blocks instead of releasing.
 */
export function partitionJss3PendingEntries<T extends PendingTopicShape>(
  className: string, originalTerm: string, basename: string, subject: string, topics: readonly T[],
  register: readonly Jss3PendingEntry[] = JSS3_PENDING_ENTRIES,
): { kept: T[]; held: Array<Jss3HeldRecord & { topic: T }> } {
  assertJss3PendingRegisterValid(register);
  const kept: T[] = [];
  const held: Array<Jss3HeldRecord & { topic: T }> = [];
  for (const t of topics) {
    const e = matchJss3PendingEntry(className, originalTerm, basename, subject, t, register);
    if (!e) { kept.push(t); continue; }
    held.push({
      entry: e, topic: t, weekLabel: t.weekLabel, bodyChars: t.body.length,
      bodySha256: createHash('sha256').update(normBody(t.body)).digest('hex'), reason: JSS3_PENDING_REASON,
    });
  }
  return { kept, held };
}

/**
 * Importer-level guard over the final row collection: returns a description of
 * every row that is a pending entry. The importer treats any result as a blocker
 * and refuses to build the database plan.
 */
export function findJss3PendingLeaks(
  rows: ReadonlyArray<{ className: string; termLabel: string; basename: string; subjectName: string; weekLabel: string; title: string }>,
  register: readonly Jss3PendingEntry[] = JSS3_PENDING_ENTRIES,
): string[] {
  const out: string[] = [];
  for (const r of rows) {
    const e = matchJss3PendingEntry(r.className, r.termLabel, r.basename, r.subjectName, r, register);
    if (e) out.push(`Pending entry reached the import row set: ${r.className} / ${r.subjectName} / ${r.termLabel} / ${r.basename} / ${r.weekLabel} / ${r.title}`);
  }
  return out;
}

/** Throwing form for the write path. */
export function assertNoJss3PendingLeak(
  rows: Parameters<typeof findJss3PendingLeaks>[0], register: readonly Jss3PendingEntry[] = JSS3_PENDING_ENTRIES,
): void {
  assertJss3PendingRegisterValid(register);
  const leaks = findJss3PendingLeaks(rows, register);
  if (leaks.length) throw new Error(`${leaks.length} JSS3 pending entr${leaks.length === 1 ? 'y' : 'ies'} in the import plan: ${leaks.join(' | ')}`);
}

/**
 * Every register entry whose source file was processed in this run must have
 * been located and held; otherwise the hold could not be confirmed (e.g. the
 * source heading changed), which is a blocker rather than a silent pass.
 */
export function unconfirmedJss3PendingEntries(
  filesSeen: ReadonlySet<string>, heldKeys: ReadonlySet<string>, register: readonly Jss3PendingEntry[] = JSS3_PENDING_ENTRIES,
): string[] {
  return register
    .filter(e => filesSeen.has(`${e.originalTerm}/${e.basename}`) && !heldKeys.has(pendingEntryKey(e)))
    .map(e => `JSS3 pending entry not located in its source, hold unconfirmed: ${e.subject} / ${e.originalTerm} / ${e.basename} / ${e.manifestWeek} / ${e.title}`);
}
