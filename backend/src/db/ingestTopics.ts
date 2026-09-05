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
//   - Word lock files (~$...) and byte-identical "_1" suffix duplicates —
//     both filtered out before parsing (see isIgnorableFile()).
//   - .rtf files are NOT handled by this script (rare in the corpus — a
//     small number of Pre-Nursery/Reception files). Convert those to .docx
//     by hand (open in Word, Save As) and re-run; not worth a third parser
//     library for a handful of files.
//   - Wildly inconsistent filenames — subject is inferred from the
//     document's own "SUBJECT:" header line when present (stronger signal),
//     falling back to filename keywords only when that line is absent. Any
//     subject not already known is auto-created (confirmed design), not
//     skipped — see inferSubjectName()/cleanUnmatchedSubjectToken() below.
//   - Folder-name vs classes.name naming mismatches (e.g. "JSS 1" vs
//     "JSS1", "Basic 1"/"PRY 1" vs "Grade 1") — normalized here against the
//     canonical naming fixed in the 2026-09 rename (renameClassNaming.ts).
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
// Pre-Nursery and Reception are still deliberately unmapped (see
// CLASS_PATTERNS below) — that decision is still open per
// /areas/sts-curriculum-ai.md, not something this script should guess.
//
// Usage:
//   cd backend
//   npx tsx src/db/ingestTopics.ts --root <path> --school-code primary   [--yes]
//   npx tsx src/db/ingestTopics.ts --root <path> --school-code secondary [--yes]
//
// Without --yes, prints a full breakdown (files found/skipped, topics
// parsed per class/subject/term, any subject or class it could NOT map)
// and writes nothing — always run once without --yes first, same
// convention as resetAcademicData.ts and renameClassNaming.ts.

import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import mammoth from 'mammoth';
// @ts-ignore — word-extractor ships no types
import WordExtractor from 'word-extractor';
import { pool, query } from './pool.js';

// ── Class name normalization ──────────────────────────────────────────────
// Longest/most-specific patterns first so "sss 1" doesn't get eaten by a
// looser "ss" check, etc. Pre-Nursery and Reception are deliberately left
// unmapped (return null) — that decision is still open (see
// /areas/sts-curriculum-ai.md), not something this script should guess.
const CLASS_PATTERNS: Array<[RegExp, string | null]> = [
  [/pre[\s-]?nursery/i, null],
  [/reception/i, null],
  [/nursery\s*1\b/i, 'Nursery 1'],
  [/nursery\s*2\b/i, 'Nursery 2'],
  [/\bkg\s*1\b/i, 'KG 1'],
  [/\bkg\s*2\b/i, 'KG 2'],
  [/\b(basic|pry|grade)\s*1\b|basic\s*one\b/i, 'PRY 1'],
  [/\b(basic|pry|grade)\s*2\b|basic\s*two\b/i, 'PRY 2'],
  [/\b(basic|pry|grade)\s*3\b|basic\s*three\b/i, 'PRY 3'],
  [/\b(basic|pry|grade)\s*4\b|basic\s*four\b/i, 'PRY 4'],
  [/\b(basic|pry|grade)\s*5\b|basic\s*five\b/i, 'PRY 5'],
  [/\b(basic|pry|grade)\s*6\b|basic\s*six\b/i, 'PRY 6'],
  [/\bjss\s*1\b/i, 'JSS 1'],
  [/\bjss\s*2\b/i, 'JSS 2'],
  [/\bjss\s*3\b/i, 'JSS 3'],
  [/\b(sss?)\s*1\b/i, 'SS 1'],
  [/\b(sss?)\s*2\b/i, 'SS 2'],
  [/\b(sss?)\s*3\b/i, 'SS 3'],
];

function inferClassName(fullPath: string): string | null | undefined {
  for (const [re, name] of CLASS_PATTERNS) {
    if (re.test(fullPath)) return name; // may be null (Pre-Nursery/Reception — deliberately unresolved)
  }
  return undefined; // no pattern matched at all — different from "matched but unresolved"
}

// ── Term normalization ────────────────────────────────────────────────────
function inferTermName(fullPath: string): string | undefined {
  if (/\b(1st|ist|first|alfa|alpha)\b/i.test(fullPath)) return '1st Term';
  if (/\b2nd\b/i.test(fullPath)) return '2nd Term';
  if (/\b3rd\b/i.test(fullPath)) return '3rd Term';
  return undefined;
}

// ── Subject normalization ─────────────────────────────────────────────────
// An unmapped subject is NOT skipped — it's auto-created in `subjects`, per
// the confirmed design: "Importer ... auto-creating any subject that
// doesn't exist yet." SUBJECT_PATTERNS below still normalizes the common
// spelling/abbreviation variants actually seen in this school's files (e.g.
// "SOS" and "Social Studies" both become one canonical "Social Studies"
// subject rather than two near-duplicate rows); anything not covered here
// falls through to a lightly-cleaned version of the raw token itself, so
// nothing is silently lost — the dry-run report flags which ones fell
// through, so they can be reviewed/merged after the fact if needed.
const SUBJECT_PATTERNS: Array<[RegExp, string]> = [
  [/further\s*math/i, 'Further Mathematics'],
  [/\bmath/i, 'Mathematics'],
  [/bas(?:ic|is)\s*sci/i, 'Basic Science'],
  [/\bsos\b|social\s*stud/i, 'Social Studies'],
  [/yoruba/i, 'Yoruba'],
  [/civic/i, 'Civic Education'],
  [/\bp\.?\s*h\.?\s*e\.?\b|physical/i, 'Physical & Health Education'],
  [/\bcca\b|cultural/i, 'Cultural & Creative Arts'],
  [/\bict\b|computer|data\s*process/i, 'Computer Studies'],
  [/home\s*eco/i, 'Home Economics'],
  [/literature|\blit\.?\s*in\s*eng/i, 'Literature-in-English'],
  [/english/i, 'English Language'],
  [/physics/i, 'Physics'],
  [/chemistry/i, 'Chemistry'],
  [/biology/i, 'Biology'],
  [/economics/i, 'Economics'],
  [/commerce/i, 'Commerce'],
  [/govern|govt/i, 'Government'],
  [/agric/i, 'Agricultural Science'],
  [/geography/i, 'Geography'],
  [/technical\s*drawing/i, 'Technical Drawing'],
  [/\bcrs\b|\birs\b/i, 'CRS/IRS'],
  [/basic\s*tech|\bbst\b/i, 'Basic Technology'],
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

function inferSubjectName(...candidates: string[]): string {
  for (const candidate of candidates) {
    if (!candidate) continue;
    for (const [re, name] of SUBJECT_PATTERNS) {
      if (re.test(candidate)) return name;
    }
  }
  // None of the candidates matched a known pattern — clean up the LAST
  // candidate (by convention, the filename) as a last resort so the
  // resulting subject name is at least readable, not the raw fragment.
  return cleanUnmatchedSubjectToken(candidates[candidates.length - 1] ?? 'Unknown Subject');
}

// ── File filtering ─────────────────────────────────────────────────────────
function isIgnorableFile(filename: string): boolean {
  if (filename.startsWith('~$')) return true;             // Word lock file
  if (/_1\.(docx?|docm)$/i.test(filename)) return true;    // known byte-identical duplicate pattern
  return false;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(docx|docm|doc)$/i.test(entry) && !isIgnorableFile(entry)) out.push(full);
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
  const root = rootIdx >= 0 ? argv[rootIdx + 1] : undefined;
  const schoolCode = scIdx >= 0 ? argv[scIdx + 1] : undefined;
  return { root, schoolCode, yes };
}

async function main() {
  const { root, schoolCode, yes } = parseArgs(process.argv.slice(2));
  if (!root || !schoolCode || !['primary', 'secondary'].includes(schoolCode)) {
    console.log(`Usage:
  npx tsx src/db/ingestTopics.ts --root <path> --school-code primary|secondary [--yes]

Always run once WITHOUT --yes first to see the full breakdown.`);
    process.exitCode = 1;
    return;
  }

  const allFiles = walk(root);
  console.log(`Found ${allFiles.length} candidate file(s) under ${root}.\n`);

  const rows: Row[] = [];
  const unmappedClass: Set<string> = new Set();
  const noWeekMarkers: string[] = [];
  const errors: Array<{ file: string; error: string }> = [];
  const subjectTokensSeen: Set<string> = new Set(); // for the dry-run report only

  for (const filePath of allFiles) {
    try {
      const className = inferClassName(filePath);
      const termLabel = inferTermName(filePath);
      if (className === undefined || className === null) {
        unmappedClass.add(path.relative(root, filePath));
        continue;
      }
      if (!termLabel) {
        unmappedClass.add(`(no term found) ${path.relative(root, filePath)}`);
        continue;
      }

      const text = await extractText(filePath);

      // Prefer, in order: an explicit "SUBJECT:" header line; a blob of the
      // document's first few lines (several files put the subject on line
      // 2 or 3 — e.g. line 1 is just "SS1", line 2 is "FINANCIAL
      // ACCOUNTING" — so checking only the very first line misses these);
      // then the filename as a last resort.
      const subjectLineMatch = text.match(/subject\s*[:;]\s*(.+)/i);
      const headerBlock = text.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 4).join(' ');
      const subjectName = inferSubjectName(subjectLineMatch?.[1] ?? '', headerBlock, path.basename(filePath));
      subjectTokensSeen.add(subjectName);

      const parsed = parseTopics(text);
      if (parsed.length === 0) {
        noWeekMarkers.push(path.relative(root, filePath));
        continue;
      }

      parsed.forEach((t, i) => {
        rows.push({
          filePath, className, termLabel, subjectName,
          weekLabel: t.weekLabel, orderIndex: i, title: t.title, sourceReference: t.body,
        });
      });
    } catch (e: any) {
      errors.push({ file: path.relative(root, filePath), error: e.message });
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────
  console.log(`Parsed ${rows.length} topic row(s) from ${allFiles.length - unmappedClass.size - noWeekMarkers.length - errors.length} file(s).\n`);

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

  console.log(`\nSubject names that will be used (auto-created if new — school_code='${schoolCode}'):`);
  for (const s of [...subjectTokensSeen].sort()) console.log(`  ${s}`);

  if (unmappedClass.size > 0) {
    console.log(`\n${unmappedClass.size} file(s) skipped — class or term not recognized:`);
    for (const f of unmappedClass) console.log(`  ${f}`);
  }
  if (noWeekMarkers.length > 0) {
    console.log(`\n${noWeekMarkers.length} file(s) skipped — no "WEEK N" markers found at all:`);
    for (const f of noWeekMarkers) console.log(`  ${f}`);
  }
  if (errors.length > 0) {
    console.log(`\n${errors.length} file(s) failed to read:`);
    for (const e of errors) console.log(`  ${e.file}: ${e.error}`);
  }

  if (!yes) {
    console.log('\nDry run only — pass --yes to actually insert these rows.');
    return;
  }

  // ── Insert ──────────────────────────────────────────────────────────────
  // Auto-create any subject that doesn't exist yet for this school_code,
  // per the confirmed design — never skip a topic just because its subject
  // wasn't already seeded.
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

  let inserted = 0;
  for (const r of rows) {
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
  console.log(`\n✓ Inserted ${inserted} new topic row(s) (${rows.length - inserted} already existed from a prior run of this script).`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
