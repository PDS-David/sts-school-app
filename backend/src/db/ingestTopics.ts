// Ingests the school's curriculum source documents (schemes of work + lesson
// notes) into the `topics` table's evergreen curriculum-ingestion columns
// (term_label/source_reference/order_index/source_file) — see schema.sql's
// "Curriculum ingestion for topics" section for the full design rationale.
// source_reference is grounding/fallback material for Brainee, NEVER shown
// to a student directly as the "lesson" — that distinction lives in the
// POST /learning/topics/:id/complete route (backend/src/routes/learning.ts),
// not in this script.
//
// Deliberately pure-JS (mammoth for .docx/.docm, word-extractor for legacy
// .doc) rather than shelling out to LibreOffice — this needs to run on
// whatever machine actually has the source files, which for this school is
// Da's own Windows PC, not a Linux server. No external binary to install.
//
// Known format quirks this handles (documented at length in
// /areas/sts-curriculum-ai.md from the file-by-file review that preceded
// this script — read that file for the full history if something here
// looks arbitrary):
//   - Nested zips already pre-extracted alongside their own sibling folder
//     (JSS/Basic batches) — this script only reads .doc/.docx/.docm files,
//     so a leftover .zip sitting next to them is simply never opened.
//   - Word lock files (~$...) are ignored. Copy-like filenames (_1, etc.)
//     are parsed and audited; a filename alone never proves duplication.
//   - Unsupported documents (including RTF/PowerPoint) block the audit.
//     Convert/review them deliberately before importing; no new parser here.
//   - Wildly inconsistent filenames — subject is inferred from the
//     document's own "SUBJECT:" header line when present (stronger signal),
//     falling back to filename keywords only when that line is absent. Any
//     mapped subject missing from the DB may be created after audit passes;
//     generic fallback names block import pending review (see below).
//   - Folder-name vs classes.name naming mismatches (e.g. "JSS 1" vs
//     "JSS1", "Basic 1"/"PRY 1"/"Grade 1" vs "Primary 1") — normalized
//     against canonical Primary/JSS/SS naming (renameClassNaming.ts).
//
// KNOWN LIMITATION, on purpose rather than by accident: a JSS/SSS-style
// document's own scheme-of-work table (short one-line-per-week summaries)
// uses the same "WEEK N" marker as the real per-topic lesson content later
// in the same file, so this parser cannot perfectly distinguish "this is
// the table" from "this is the real content" — it ingests both as separate
// topic rows rather than guessing which to drop. Dry-run output reports
// each row's source-text length specifically so a human can spot-check and
// decide whether short rows need filtering before this data is used to
// ground student-facing exercises/assessments. This is a review step, not
// something this script resolves on its own.
//
// Pre-Nursery and Reception map to real classes (see CLASS_PATTERNS below,
// updated 2026-09 once the school confirmed they're real, distinct classes).
//
// Usage:
//   cd backend
//   npx tsx src/db/ingestTopics.ts --root <path> --school-code primary   [--yes]
//   npx tsx src/db/ingestTopics.ts --root <path> --school-code secondary [--yes]
//
// Without --yes, prints a full breakdown (files found/skipped, topics
// parsed per class/subject/term, any subject or class it could NOT map)
// and writes nothing. Blockers return non-zero, including with --yes.
// SS 3 is audit-only, never normal curriculum. Always audit first, same
// convention as resetAcademicData.ts and renameClassNaming.ts.

import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import mammoth from 'mammoth';
// @ts-ignore — word-extractor ships no types
import WordExtractor from 'word-extractor';
import { createHash } from 'node:crypto';

// ── Class name normalization ──────────────────────────────────────────────
// Longest/most-specific patterns first so "sss 1" doesn't get eaten by a
// looser "ss" check, etc.
//
// Pre-Nursery/Reception decision (2026-09, confirmed directly with Da
// after several rounds of genuinely contradictory answers — worth being
// aware of if this ever needs revisiting): Pre-Nursery, Reception,
// Nursery 1, Nursery 2, KG 1, and KG 2 are SIX fully separate, independent
// classes. None are merged or duplicated with each other.
const CLASS_PATTERNS: Array<[RegExp, string[] | null]> = [
  [/pre[\s_-]*nursery/i, ['Pre-Nursery']],
  [/reception/i, ['Reception']],
  // "nurser[y]?" tolerates the real typo found in this school's own files
  // ("Nurser_1-1.docx" — missing the final 'y'). [\s_-]* tolerates
  // underscore/hyphen filename separators as well as spaces or nothing
  // ("Nursery_2.docx", "Nursery-2", "Nursery2" all match).
  [/nursery?[\s_-]*1\b/i, ['Nursery 1']],
  [/nursery?[\s_-]*2\b/i, ['Nursery 2']],
  [/\bkg[\s_-]*1\b/i, ['KG 1']],
  [/\bkg[\s_-]*2\b/i, ['KG 2']],
  [/\b(primary|basic|pry|grade)[\s_-]*1\b|basic[\s_-]*one\b/i, ['Primary 1']],
  [/\b(primary|basic|pry|grade)[\s_-]*2\b|basic[\s_-]*two\b/i, ['Primary 2']],
  [/\b(primary|basic|pry|grade)[\s_-]*3\b|basic[\s_-]*three\b/i, ['Primary 3']],
  [/\b(primary|basic|pry|grade)[\s_-]*4\b|basic[\s_-]*four\b/i, ['Primary 4']],
  [/\b(primary|basic|pry|grade)[\s_-]*5\b|basic[\s_-]*five\b/i, ['Primary 5']],
  [/\b(primary|basic|pry|grade)[\s_-]*6\b|basic[\s_-]*six\b/i, ['Primary 6']],
  [/\bjss[\s_-]*1\b/i, ['JSS 1']],
  [/\bjss[\s_-]*2\b/i, ['JSS 2']],
  [/\bjss[\s_-]*3\b/i, ['JSS 3']],
  [/\b(sss?)[\s_-]*1\b/i, ['SS 1']],
  [/\b(sss?)[\s_-]*2\b/i, ['SS 2']],
  [/\b(sss?)[\s_-]*3\b/i, ['SS 3']],
];

// Which classes belong to which school_code — mirrors seed.ts's
// PRIMARY_CLASSES/SECONDARY_CLASSES exactly. Used to CATCH cross-tagging:
// --school-code only controls which subjects table a run writes against,
// it does NOT filter which files get walked, so without this check a
// mixed folder (e.g. JSS files sitting alongside Nursery files) run with
// --school-code primary would silently tag JSS 1-3 topics as primary
// school data. Confirmed as a real risk via an actual dry run during
// testing — this check exists because that happened, not hypothetically.
const PRIMARY_CLASS_NAMES = new Set([
  'Pre-Nursery', 'Reception', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
]);
const SECONDARY_CLASS_NAMES = new Set(['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3']);

function inferClassNames(fullPath: string): string[] | undefined {
  // Check the filename itself before the full path. Root cause of a real
  // bug found live: when Pre-Nursery and Reception files sit as siblings
  // in the same parent folder (e.g. a folder named something like "PRE
  // NURSERY AND RECEPTION"), that folder name alone contains "pre nursery"
  // as a substring — and since CLASS_PATTERNS checks 'pre[\s_-]*nursery'
  // before 'reception', matching against the FULL path meant the shared
  // parent folder name won for BOTH files regardless of which file it
  // actually was, because the Reception file's own filename never got a
  // chance to be checked on its own merits. This is exactly why the bug
  // only showed up with both files together (sharing that folder) and not
  // when either was tested in isolation (in a differently-named folder
  // with nothing to falsely match against).
  //
  // The filename is authoritative when it matches anything at all — it's
  // always more specific than any parent folder name. Only fall back to
  // matching the full path (parent folders included) when the filename
  // alone is too generic to resolve on its own (e.g. a bare "2ND TERM.docx"
  // that only makes sense in the context of a ".../JSS 2/2ND TERM/" path).
  const filename = fullPath.split(/[/\\]/).pop() ?? fullPath;
  for (const [re, names] of CLASS_PATTERNS) {
    if (re.test(filename)) return names ?? undefined;
  }
  for (const [re, names] of CLASS_PATTERNS) {
    if (re.test(fullPath)) return names ?? undefined;
  }
  return undefined; // no pattern matched at all
}

// ── Term normalization ────────────────────────────────────────────────────
function inferTermName(fullPath: string): string | undefined {
  if (/\b(1st|ist|first|alfa|alpha)\b/i.test(fullPath)) return '1st Term';
  if (/\b2nd\b/i.test(fullPath)) return '2nd Term';
  if (/\b3rd\b/i.test(fullPath)) return '3rd Term';
  return undefined;
}

// ── Subject normalization ─────────────────────────────────────────────────
// Known mappings may create subjects during an approved import. Generic
// filename/token cleanup is only an audit suggestion and blocks all writes
// until the source or its mapping is deliberately reviewed and resolved.
const SUBJECT_PATTERNS: Array<[RegExp, string]> = [
  [/further\s*math/i, 'Further Mathematics'],
  [/\bmath/i, 'Mathematics'],
  [/bas(?:ic|is)\s*sci/i, 'Basic Science'],
  [/\bsos\b|social\s*stud/i, 'Social Studies'],
  [/yoruba/i, 'Yoruba'],
  [/news\s+and\s+conversation/i, 'News and Conversation'],
  [/practical\s+life/i, 'Practical Life Activity'],
  [/civic/i, 'Civic Education'],
  [/\bp\.?\s*h\.?\s*e\.?\b|physical/i, 'Physical & Health Education'],
  [/\bcca\b|cultural/i, 'Cultural & Creative Arts'],
  [/\bict\b|computer|data\s*process/i, 'Computer Studies'],
  [/home\s*eco/i, 'Home Economics'],
  [/literature|\blit\.?\s*in\s*eng/i, 'Literature-in-English'],
  [/english|\beng\.?\s*lang\b/i, 'English Language'],
  [/physics/i, 'Physics'],
  [/chemistry/i, 'Chemistry'],
  [/biology/i, 'Biology'],
  [/economics/i, 'Economics'],
  [/commerce/i, 'Commerce'],
  [/govern|govt/i, 'Government'],
  [/agric/i, 'Agricultural Science'],
  [/geography/i, 'Geography'],
  [/technical\s*drawing/i, 'Technical Drawing'],
  [/business\s*stud/i, 'Business Studies'],
  [/c\.?\s*r\.?\s*s\b|i\.?\s*r\.?\s*s\b/i, 'CRS/IRS'],
  [/basic\s*tech|\bbst\b|\bb\.?\s*tech\b|basci\s*tech/i, 'Basic Technology'],
  [/french/i, 'French'],
  [/book\s*keep/i, 'Book Keeping'],
  [/financial\s*account/i, 'Financial Accounting'],
  [/catering/i, 'Catering Craft Practices'],
  [/f\s*_?\s*n\b|food.*nutrition/i, 'Food & Nutrition'],
];

// Best-effort cleanup for a token matching none of the patterns above — so
// an auto-created subject at least gets a readable name instead of a raw
// filename fragment. Still surfaced in the dry-run report for review.
function cleanUnmatchedSubjectToken(raw: string): string {
  return raw
    .replace(/\.(docx?|docm|rtf)$/i, '')
    .replace(/\b(1st|2nd|3rd|ist|iind|iiird|first|second|third)\s*term\b/gi, '')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => (w.length > 3 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase()))
    .join(' ');
}

function inferSubjectName(...candidates: string[]): { name: string; fallback: boolean } {
  for (const candidate of candidates) {
    if (!candidate) continue;
    // Normalize underscore/hyphen separators to spaces before matching —
    // real files use both ("PRY_1_B.tech", "FRENCH-1") and SUBJECT_PATTERNS
    // above is written assuming \s* separators. Fixing it here once is far
    // more maintainable than adding [\s_-]* to every single pattern (which
    // is also easy to forget, as happened with two patterns that looked
    // fixed but weren't — confirmed via direct regex testing against the
    // exact real strings that were still falling through).
    const normalized = candidate.replace(/[_-]+/g, ' ');
    for (const [re, name] of SUBJECT_PATTERNS) {
      if (re.test(normalized)) return { name, fallback: false };
    }
  }
  // None of the candidates matched a known pattern — clean up the LAST
  // candidate (by convention, the filename) as a last resort so the
  // resulting subject name is at least readable, not the raw fragment.
  return { name: cleanUnmatchedSubjectToken(candidates[candidates.length - 1] ?? 'Unknown Subject'), fallback: true };
}

// ── File filtering ─────────────────────────────────────────────────────────
function isIgnorableFile(filename: string): boolean {
  return filename.startsWith('~$'); // Office lock files only, not suspected copies
}

const UNSUPPORTED_DOCUMENT = /\.(rtf|pptx?|pptm|ppsx?|ppsm|potx?|potm|xlsx?|xlsm|xlsb|ods|odt|odp|odg|pdf|txt|csv|pages|key|numbers|dotx?|dotm|ott|otp|epub)$/i;

function walk(dir: string, unsupported: string[], errors: Array<{ file: string; error: string }>, out: string[] = []): string[] {
  // Explicit lexical order avoids filesystem enumeration/locale differences.
  for (const entry of readdirSync(dir).sort()) {
    if (isIgnorableFile(entry)) continue;
    const full = path.join(dir, entry);
    try {
      const st = statSync(full);
      if (st.isDirectory()) walk(full, unsupported, errors, out);
      else if (/\.(docx|docm|doc)$/i.test(entry)) out.push(full);
      else if (UNSUPPORTED_DOCUMENT.test(entry)) unsupported.push(full);
    } catch (e: any) {
      errors.push({ file: full, error: e.message });
    }
  }
  return out;
}

// ── Text extraction ────────────────────────────────────────────────────────
async function extractText(filePath: string): Promise<string> {
  if (/\.(docx|docm)$/i.test(filePath)) {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }
  // legacy .doc
  const extractor = new WordExtractor();
  const doc = await extractor.extract(filePath);
  return doc.getBody();
}

// ── Topic block parsing ────────────────────────────────────────────────────
// Splits on "WEEK N" / "Week N & M" / "WEEK9&10" / "WEEK: One" style markers
// — the one pattern common to all three content shapes found across this
// school's documents (JSS/SSS scheme+prose, Nursery/Reception field-style,
// Basic lesson-plan style). Some Basic-band files spell the week number out
// ("WEEK: One", "WEEK: Two") instead of using a digit — both forms are
// matched. See the file-level comment above for the known scheme-of-work-
// table-vs-real-content limitation this implies.
const WEEK_NUMBER_WORD = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen';
const WEEK_MARKER = new RegExp(
  `week\\s*[:.\\-]*\\s*((?:\\d+(?:\\s*(?:&|and|,|-)\\s*\\d+)?)|(?:${WEEK_NUMBER_WORD}))`,
  'gi',
);

interface ParsedTopic {
  weekLabel: string;
  title: string;
  body: string;
}

// Some files (confirmed real case: this school's Yoruba-language files)
// flatten what was originally a table into plain text where the week
// number appears completely alone on its own line — e.g. "OSE" (Yoruba for
// "WEEK") followed by a blank line, then just "1", then the week's content.
// No "week"/spelled-out-number text appears anywhere, so WEEK_MARKER above
// can't match. This catches that shape specifically: a standalone line
// containing ONLY a number 1-20 (optionally a range like "1&2"), and
// nothing else on that line.
const BARE_NUMBER_LINE = /^[ \t]*(\d{1,2}(?:\s*(?:&|and|,|-)\s*\d{1,2})?)[ \t]*$/gim;

function parseTopics(text: string): ParsedTopic[] {
  const matches = [...text.matchAll(WEEK_MARKER)];
  if (matches.length > 0) {
    const topics: ParsedTopic[] = [];
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index!;
      const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
      const block = text.slice(start, end).trim();
      const weekLabel = matches[i][0].trim();

      // Look for an explicit "Topic:" line first (Nursery/Reception style,
      // and some JSS/Basic files use it too); fall back to the first
      // non-empty line after the week marker itself.
      const topicLineMatch = block.match(/topic\s*[:;]\s*(.+)/i);
      let title: string;
      if (topicLineMatch) {
        title = topicLineMatch[1].trim();
      } else {
        const afterMarker = block.slice(weekLabel.length).trim();
        const firstLine = afterMarker.split('\n').map(l => l.trim()).find(l => l.length > 0);
        title = (firstLine ?? '(untitled)').slice(0, 200);
      }

      topics.push({ weekLabel, title, body: block });
    }
    return topics;
  }

  // Fallback: bare-number-line week markers (see BARE_NUMBER_LINE above).
  // Require at least 2 matches — a single bare number anywhere in a file
  // (e.g. a page number, a stray count) is not enough evidence this file
  // actually uses this structure, and treating it as one would produce a
  // single giant "topic" covering the whole document.
  const bareMatches = [...text.matchAll(BARE_NUMBER_LINE)];
  if (bareMatches.length >= 2) {
    const topics: ParsedTopic[] = [];
    for (let i = 0; i < bareMatches.length; i++) {
      const start = bareMatches[i].index!;
      const end = i + 1 < bareMatches.length ? bareMatches[i + 1].index! : text.length;
      const block = text.slice(start, end).trim();
      const weekLabel = `Week ${bareMatches[i][1].trim()}`;
      const afterMarker = block.slice(bareMatches[i][0].trim().length).trim();
      const firstLine = afterMarker.split('\n').map(l => l.trim()).find(l => l.length > 0);
      topics.push({ weekLabel, title: (firstLine ?? '(untitled)').slice(0, 200), body: block });
    }
    return topics;
  }

  // Neither structure found — deliberately give up rather than guess.
  // An earlier version of this script fell back to "treat every non-empty
  // line as its own topic", which sounded reasonable but produced 500-1300+
  // garbage single-line rows per file once tested against real files (this
  // school's documents wrap far more aggressively than expected). Flooding
  // `topics` with fragments would actively hurt the feature this data feeds
  // (Brainee-grounded lessons/exercises) — reported as a skip instead, for
  // manual review, same as any other unparseable file.
  return [];
}

// ── Main ─────────────────────────────────────────────────────────────────
interface Row {
  filePath: string; className: string; termLabel: string; subjectName: string;
  weekLabel: string; orderIndex: number; title: string; sourceReference: string;
}

function parseArgs(argv: string[]) {
  const yes = argv.includes('--yes');
  const rootIdx = argv.indexOf('--root');
  const scIdx = argv.indexOf('--school-code');
  const termIdx = argv.indexOf('--default-term');
  const root = rootIdx >= 0 ? argv[rootIdx + 1] : undefined;
  const schoolCode = scIdx >= 0 ? argv[scIdx + 1] : undefined;
  const defaultTerm = termIdx >= 0 ? argv[termIdx + 1] : undefined;
  return { root, schoolCode, yes, defaultTerm };
}

async function main() {
  const { root, schoolCode, yes, defaultTerm } = parseArgs(process.argv.slice(2));
  if (!root || !schoolCode || !['primary', 'secondary'].includes(schoolCode)) {
    console.log(`Usage:
  npx tsx src/db/ingestTopics.ts --root <path> --school-code primary|secondary [--default-term "1st Term"] [--yes]

--default-term is used ONLY for files whose path gives no term clue at all
(e.g. a standalone file not organized into a "1st/2nd/3rd Term" folder) —
it never overrides a term the path actually states. Use this when you
independently know what term a batch of files belongs to (e.g. from prior
correspondence/documentation), not as a guess.

Always run once WITHOUT --yes first to see the full breakdown.`);
    process.exitCode = 1;
    return;
  }
  if (process.argv.includes('--default-term') && !['1st Term', '2nd Term', '3rd Term'].includes(defaultTerm ?? '')) {
    console.log(`--default-term must be exactly "1st Term", "2nd Term", or "3rd Term" (got "${defaultTerm}").`);
    process.exitCode = 1;
    return;
  }

  const unsupported: string[] = [];
  const errors: Array<{ file: string; error: string }> = [];
  const allFiles = walk(root, unsupported, errors);
  // Sort the complete relative identities; recursion alone is not sufficient.
  const sourceIdentity = (file: string) => path.relative(root, file).split(path.sep).join('/');
  allFiles.sort((a, b) => sourceIdentity(a) < sourceIdentity(b) ? -1 : sourceIdentity(a) > sourceIdentity(b) ? 1 : 0);
  console.log(`Found ${allFiles.length} candidate file(s) under ${root}.\n`);

  const rows: Row[] = [];
  const unmappedClass: Set<string> = new Set();
  const missingTerm: Set<string> = new Set();
  const fallbackSubjects: Set<string> = new Set();
  const wrongSchoolCode: Set<string> = new Set();
  const subjectConflicts: Set<string> = new Set();
  const suspiciousTopics: Set<string> = new Set();
  const noWeekMarkers: string[] = [];
  const parsedFiles: Set<string> = new Set();

  for (const filePath of allFiles) {
    try {
      const classNames = inferClassNames(filePath);
      const termLabel = inferTermName(filePath) ?? defaultTerm;
      if (classNames === undefined) unmappedClass.add(sourceIdentity(filePath));
      if (!termLabel) missingTerm.add(sourceIdentity(filePath));
      if (classNames === undefined || !termLabel) continue;
      // Guard against a mixed folder (e.g. JSS files sitting alongside
      // Nursery files) silently tagging content under the wrong school —
      // --school-code only controls which subjects table this run writes
      // against, it does not filter which files get walked. See the
      // PRIMARY_CLASS_NAMES/SECONDARY_CLASS_NAMES comment above.
      // classNames is an array for forward compatibility, but every class
      // (including Pre-Nursery/Reception — confirmed as their own fully
      // separate classes, not shared with anything) currently resolves to
      // exactly one entry; only the classes that actually belong to this
      // school-code are kept, and if that empties the list, skip the file.
      const expectedSet = schoolCode === 'primary' ? PRIMARY_CLASS_NAMES : SECONDARY_CLASS_NAMES;
      const validClassNames = classNames.filter(c => expectedSet.has(c));
      if (validClassNames.length === 0) {
        wrongSchoolCode.add(`${classNames.join('+')} — ${path.relative(root, filePath)}`);
        continue;
      }

      const text = await extractText(filePath);

      // Some files (confirmed real case: Nursery/Reception-style documents)
      // merge multiple subjects into ONE file, each restarting its own
      // "SUBJECT:" header and its own week/topic sequence (e.g. Mathematics
      // weeks 1-13, then a fresh "SUBJECT: ENGLISH LANGUAGE" header and
      // ANOTHER weeks 1-13). Splitting at every "SUBJECT:" line and parsing
      // each section independently is required here — treating the whole
      // file as one subject was tested and produced one inflated,
      // multi-subject-merged topic list under a single wrong subject name.
      // Case-SENSITIVE, uppercase-only match — NOT anchored to line start
      // (tried that first; it broke a real header that had no clean blank
      // line before it, due to messy source formatting). The actual
      // reliable signal, confirmed across every real file examined: a
      // genuine document header is always written "SUBJECT:" in caps,
      // while the one false positive found (an English grammar lesson's
      // prose — "...in front of the subject: 'Yes/No' Questions") used
      // natural lowercase "subject" mid-sentence. Matching only the
      // all-caps form catches every real header seen and excludes that
      // false positive without needing line-position heuristics at all.
      const subjectLineRe = /\bSUBJECT\s*[:;]\s*.+/g;
      const subjectLineMatches = [...text.matchAll(subjectLineRe)];
      const headerBlock = text.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 4).join(' ');

      // A filename can carry a strong, known subject signal too. For a
      // genuinely single-subject document, silently preferring a conflicting
      // SUBJECT: header is unsafe: a real Primary Agriculture file was
      // observed being classified as CCA this way. Multi-subject documents
      // are deliberately exempt because their filename cannot describe every
      // section. Unknown/generic filenames remain governed by the existing
      // header-first/fallback rules.
      if (subjectLineMatches.length === 1) {
        const filenameSubject = inferSubjectName(path.basename(filePath));
        const headerSubject = inferSubjectName(subjectLineMatches[0][0].replace(/^subject\s*[:;]\s*/i, ''));
        if (!filenameSubject.fallback && !headerSubject.fallback && filenameSubject.name !== headerSubject.name) {
          subjectConflicts.add(
            `${sourceIdentity(filePath)} / ${validClassNames.join('+')} / ${termLabel}: filename → ${filenameSubject.name}; SUBJECT header → ${headerSubject.name}`,
          );
        }
      }

      type Section = { subjectName: ReturnType<typeof inferSubjectName>; sectionText: string };
      let sections: Section[];
      if (subjectLineMatches.length === 0) {
        // No "SUBJECT:" line at all — infer once from the document's own
        // header block, else the filename, whole file is one section.
        const subjectName = inferSubjectName(headerBlock, path.basename(filePath));
        sections = [{ subjectName, sectionText: text }];
      } else {
        sections = [];
        // Confirmed real case (Reception_class-5.doc): a file can have
        // meaningful content BEFORE its first "SUBJECT:" line at all — an
        // unlabeled leading section (e.g. the header itself states "NEWS
        // AND CONVERSATION" with no "SUBJECT:" prefix), followed later by
        // an explicitly-labeled section ("SUBJECT: PRACTICAL LIFE
        // ACTIVITY"). Only checking "2+ matches" missed this: a single
        // match still needs its LEADING text split out as its own section
        // if that leading text is substantial, rather than being silently
        // absorbed into whatever the first explicit SUBJECT: line says.
        const firstMatchStart = subjectLineMatches[0].index!;
        if (firstMatchStart > 40) {
          const leadingText = text.slice(0, firstMatchStart);
          const leadingHeaderBlock = leadingText.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 4).join(' ');
          sections.push({
            subjectName: inferSubjectName(leadingHeaderBlock, path.basename(filePath)),
            sectionText: leadingText,
          });
        }
        subjectLineMatches.forEach((m, i) => {
          const start = m.index!;
          const end = i + 1 < subjectLineMatches.length ? subjectLineMatches[i + 1].index! : text.length;
          const sectionText = text.slice(start, end);
          const subjectName = inferSubjectName(m[0].replace(/^subject\s*[:;]\s*/i, ''));
          sections.push({ subjectName, sectionText });
        });
      }

      let anyParsed = false;
      for (const className of validClassNames) {
        for (const section of sections) {
          if (section.subjectName.fallback) {
            fallbackSubjects.add(`${sourceIdentity(filePath)} / ${className} / ${termLabel} → ${section.subjectName.name}`);
          }
          const parsed = parseTopics(section.sectionText);
          if (parsed.length === 0 || parsed.some(t => t.title === '(untitled)')) {
            noWeekMarkers.push(`${sourceIdentity(filePath)} / ${section.subjectName.name} (missing week/topic structure or untitled topic)`);
          }
          parsed.forEach((t, i) => {
            anyParsed = true;
            // A one-character/alphanumeric-fragment title is not credible
            // curriculum content. Keep the row visible in the dry-run order,
            // but block import so a human can review the source/parser rather
            // than allowing malformed titles such as the observed "O".
            const titleSignal = t.title.normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '');
            if (titleSignal.length <= 1) {
              suspiciousTopics.add(
                `${sourceIdentity(filePath)} / ${className} / ${section.subjectName.name} / ${termLabel} / ${t.weekLabel} → "${t.title}"`,
              );
            }
            rows.push({
              filePath, className, termLabel, subjectName: section.subjectName.name,
              weekLabel: t.weekLabel, orderIndex: i, title: t.title, sourceReference: t.body,
            });
          });
        }
      }
      if (anyParsed) parsedFiles.add(filePath);
    } catch (e: any) {
      errors.push({ file: path.relative(root, filePath), error: e.message });
    }
  }

  // One sequence per complete bucket, retaining stable file/section/topic order.
  const bucketKey = (r: Row) => JSON.stringify([r.className, r.subjectName, r.termLabel]);
  const normalRows = rows.filter(r => r.className !== 'SS 3');
  const examRows = rows.filter(r => r.className === 'SS 3');
  const nextOrder = new Map<string, number>();
  for (const r of normalRows) {
    const key = bucketKey(r);
    r.orderIndex = (nextOrder.get(key) ?? 0) + 1;
    nextOrder.set(key, r.orderIndex);
  }
  // Compare topic bodies only within the SAME class/subject/term. Reporting
  // partial overlap as well as whole-file copies prevents duplicated lessons.
  const contentFiles = new Map<string, Set<string>>();
  const contentLabels = new Map<string, string>();
  const identities = new Set<string>();
  const identityCollisions: string[] = [];
  for (const r of rows) {
    const normalized = r.sourceReference.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
    const hash = createHash('sha256').update(normalized).digest('hex');
    const key = JSON.stringify([bucketKey(r), hash]);
    const files = contentFiles.get(key) ?? new Set<string>();
    files.add(sourceIdentity(r.filePath));
    contentFiles.set(key, files);
    contentLabels.set(key, `${r.className} / ${r.subjectName} / ${r.termLabel} / ${r.title}`);
    // The DB key uses basename, not relative path. Flag collisions before
    // ON CONFLICT could silently discard distinct source rows.
    const identity = JSON.stringify([bucketKey(r), r.title, path.basename(r.filePath)]);
    if (identities.has(identity)) identityCollisions.push(`${sourceIdentity(r.filePath)} / ${r.className} / ${r.subjectName} / ${r.termLabel} / ${r.title}`);
    identities.add(identity);
  }
  const duplicates = [...contentFiles.entries()].filter(([, files]) => files.size > 1);
  const subjectTokensSeen = new Set(normalRows.map(r => r.subjectName));

  // ── Report ──────────────────────────────────────────────────────────────
  console.log(`Parsed ${rows.length} topic row(s) from ${parsedFiles.size} file(s).\n`);
  console.log(`SS 3 audit-only: ${examRows.length} topic row(s); excluded from normal curriculum and subject creation.`);
  for (const file of new Set(examRows.map(r => sourceIdentity(r.filePath)))) console.log(`  SS 3: ${file}`);

  const byBucket = new Map<string, number>();
  for (const r of rows) {
    const key = `${r.className} / ${r.subjectName} / ${r.termLabel}`;
    byBucket.set(key, (byBucket.get(key) ?? 0) + 1);
  }
  console.log('Breakdown (class / subject / term → topic count):');
  for (const [key, count] of [...byBucket.entries()].sort()) {
    console.log(`  ${key}: ${count}`);
  }

  const shortBodies = rows.filter(r => r.sourceReference.length < 60);
  if (shortBodies.length > 0) {
    console.log(`\n${shortBodies.length} row(s) have very short source text (<60 chars) — likely scheme-of-work`);
    console.log('table entries rather than real lesson content (see file-level comment above).');
    console.log('These are still included below; spot-check before generating exercises from them.');
  }

  console.log(`\nNormal-curriculum subject names (only created after audit passes, if new — school_code='${schoolCode}'):`);
  for (const s of [...subjectTokensSeen].sort()) console.log(`  ${s}`);

  if (unmappedClass.size > 0) {
    console.log(`\n${unmappedClass.size} file(s) BLOCKED — class not recognized:`);
    for (const f of unmappedClass) console.log(`  ${f}`);
  }
  if (wrongSchoolCode.size > 0) {
    const other = schoolCode === 'primary' ? 'secondary' : 'primary';
    console.log(`\n${wrongSchoolCode.size} file(s) skipped — class belongs to '${other}', not '${schoolCode}':`);
    for (const f of wrongSchoolCode) console.log(`  ${f}`);
    console.log(`(Re-run this same --root with --school-code ${other} to pick these up correctly.)`);
  }
  if (noWeekMarkers.length > 0) {
    console.log(`\n${noWeekMarkers.length} section(s) BLOCKED — no parseable week/topic structure:`);
    for (const f of noWeekMarkers) console.log(`  ${f}`);
  }
  if (errors.length > 0) {
    console.log(`\n${errors.length} file(s) failed to read:`);
    for (const e of errors) console.log(`  ${e.file}: ${e.error}`);
  }
  if (subjectConflicts.size > 0) {
    console.log(`\nSubject signal conflict — review source/mapping before import: ${subjectConflicts.size}`);
    for (const item of subjectConflicts) console.log(`  ${item}`);
  }
  if (suspiciousTopics.size > 0) {
    console.log(`\nSuspicious parsed topic title — review source/parser before import: ${suspiciousTopics.size}`);
    for (const item of suspiciousTopics) console.log(`  ${item}`);
  }

  for (const [label, items] of [
    ['Missing term', [...missingTerm]],
    ['Unsupported source format — convert/review before import', unsupported.map(sourceIdentity)],
    ['Fallback subject — review source/mapping before import', [...fallbackSubjects]],
    ['Database source identity collision — review before import', identityCollisions],
  ] as Array<[string, string[]]>) {
    if (items.length) {
      console.log(`\n${label}: ${items.length}`);
      for (const item of items) console.log(`  ${item}`);
    }
  }
  for (const [key, files] of duplicates) {
    console.log(`\nDUPLICATE normalized content: ${contentLabels.get(key)}`);
    for (const file of files) console.log(`  ${file}`);
  }
  console.log('\nNormal curriculum order (1-based, per class/subject/term):');
  for (const r of normalRows) {
    console.log(`  ${r.className} / ${r.subjectName} / ${r.termLabel} #${r.orderIndex}: ${sourceIdentity(r.filePath)} / ${r.weekLabel} / ${r.title}`);
  }
  const blocked = unmappedClass.size + missingTerm.size + noWeekMarkers.length + errors.length
    + unsupported.length + fallbackSubjects.size + duplicates.length + identityCollisions.length
    + subjectConflicts.size + suspiciousTopics.size;
  if (blocked || allFiles.length === 0) {
    console.log(`\nAUDIT BLOCKED — resolve the reported conditions before import. No database changes made.${allFiles.length === 0 ? ' No supported source files found.' : ''}`);
    process.exitCode = 1;
    return;
  }
  console.log('\nFILE AUDIT PASSED — this does not certify curriculum completeness or existing database compatibility.');
  if (!yes) {
    console.log('Dry run only — no database connection or changes. Review the report before using --yes.');
    return;
  }
  if (normalRows.length === 0) {
    console.log('No normal curriculum rows to insert; no database connection or subject creation.');
    return;
  }

  // ── Insert ──────────────────────────────────────────────────────────────
  // The audit has passed. Only now load/connect to the database.
  const { pool } = await import('./pool.js');
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('LOCK TABLE subjects, topics IN SHARE ROW EXCLUSIVE MODE');
      const query = (sql: string, params?: unknown[]) => client.query(sql, params);
      const subjectIdByName = new Map<string, number>();
      for (const name of subjectTokensSeen) {
        const { rows: existing } = await query('SELECT id FROM subjects WHERE school_code=$1 AND name=$2', [schoolCode, name]);
        if (existing[0]) { subjectIdByName.set(name, existing[0].id); continue; }
        const { rows: created } = await query(
          'INSERT INTO subjects(school_code, name) VALUES($1,$2) ON CONFLICT (school_code,name) DO NOTHING RETURNING id',
          [schoolCode, name],
        );
        if (created[0]) {
          subjectIdByName.set(name, created[0].id);
          console.log(`  + created new subject '${name}'`);
        } else {
          // Conflict raced with a concurrent insert — re-select to get its id.
          const { rows: reSelect } = await query('SELECT id FROM subjects WHERE school_code=$1 AND name=$2', [schoolCode, name]);
          subjectIdByName.set(name, reSelect[0].id);
        }
      }

      // A rerun must not mix a newly numbered batch with a previous, different
      // sequence. Existing rows must be an unchanged subset of the audited plan.
      for (const key of nextOrder.keys()) {
        const planned = normalRows.filter(r => bucketKey(r) === key);
        const first = planned[0];
        const { rows: existing } = await query(
          `SELECT title, source_file, source_reference, order_index FROM topics
           WHERE school_code=$1 AND subject_id=$2 AND class_name=$3 AND term_label=$4`,
          [schoolCode, subjectIdByName.get(first.subjectName), first.className, first.termLabel],
        );
        for (const old of existing) {
          if (!planned.some(r => r.title === old.title && path.basename(r.filePath) === old.source_file
            && r.sourceReference === old.source_reference && r.orderIndex === old.order_index)) {
            throw new Error(`Existing curriculum differs from audited sequence: ${first.className} / ${first.subjectName} / ${first.termLabel}. Review separately; nothing will be overwritten.`);
          }
        }
      }
      let inserted = 0;
      for (const r of normalRows) {
        const subjectId = subjectIdByName.get(r.subjectName)!;
        const result = await query(
          `INSERT INTO topics(school_code,subject_id,class_name,term_label,title,source_reference,order_index,source_file,created_by)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,NULL)
           ON CONFLICT ON CONSTRAINT topics_ingestion_dedupe DO NOTHING
           RETURNING id`,
          [schoolCode, subjectId, r.className, r.termLabel, r.title, r.sourceReference, r.orderIndex, path.basename(r.filePath)],
        );
        if (result.rows[0]) inserted++;
      }
      await client.query('COMMIT');
      console.log(`\n✓ Inserted ${inserted} new topic row(s) (${normalRows.length - inserted} already existed from a prior run of this script).`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch(e => { console.error('AUDIT/IMPORT BLOCKED:', e); process.exitCode = 1; });
