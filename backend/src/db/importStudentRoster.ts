// Task A of HANDOFF.md's roster-self-claim work: bulk-seed `students` rows
// from Da's past report-card exports, so students can self-claim their own
// account later (Task B — not built yet, this script only does the import).
//
// Source format (confirmed by actually inspecting the uploaded files, not
// guessed): one HTML file per student, "Report Card - <Name>.html", saved
// from a prior Flask-based report tool (sts-pry-report.onrender.com /
// sts-*-report equivalents — a different, older system than this app, not
// anything currently live). Each file has a fixed
// `<div class="student-info">` block with Student Name / Admission No /
// Class / Term as `<strong>label:</strong><span>value</span>` pairs — that
// block is the only thing this script reads; everything else in the file
// (scores, styling, the whole rest of the report) is ignored.
//
// Admission numbers ARE present in every file checked — e.g. "STS 002"
// (primary) and "14" (secondary), different numbering per school but both
// real, non-empty values. This matters beyond just import dedup: per
// HANDOFF.md Task B, an admission number is the strong verification field
// self-claim needs, so preserving it exactly as printed here (not
// reformatting) is required for that later route to be able to match on it.
//
// Old class-naming convention in the source files (Grade 1-6, JSS1/SS1 with
// no space) — same MAPPING as renameClassNaming.ts, reused verbatim rather
// than re-derived, so this import lands directly in the current convention
// instead of creating a fresh batch of stale rows for a future cleanup pass
// to find.
//
// Usage:
//   cd backend
//   npx tsx src/db/importStudentRoster.ts --primary-dir "<path>" --secondary-dir "<path>"
//   npx tsx src/db/importStudentRoster.ts --primary-dir "<path>" --secondary-dir "<path>" --yes
//
// Either --primary-dir or --secondary-dir can be omitted if you only have
// one school's files to import right now.

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './pool.js';

const MAPPING: Record<string, string> = {
  JSS1: 'JSS 1', JSS2: 'JSS 2', JSS3: 'JSS 3',
  SS1: 'SS 1', SS2: 'SS 2', SS3: 'SS 3',
  'Grade 1': 'PRY 1', 'Grade 2': 'PRY 2', 'Grade 3': 'PRY 3',
  'Grade 4': 'PRY 4', 'Grade 5': 'PRY 5', 'Grade 6': 'PRY 6',
};

function normalizeClass(raw: string): string {
  const trimmed = raw.trim();
  return MAPPING[trimmed] ?? trimmed; // already-current names (e.g. 'KG 1') pass through unchanged
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

interface RosterRow {
  full_name: string;
  admission_number: string;
  class_name: string;
  school_code: 'primary' | 'secondary';
  source_file: string;
}

function extractField(html: string, label: string): string | null {
  const re = new RegExp(`<strong>${label}:</strong>\\s*<span>([^<]*)</span>`, 'i');
  const m = html.match(re);
  // Source files have inconsistent internal spacing (e.g. "Abeeblahi   Abibat
  // Adesewa" from stray whitespace in the original HTML) -- collapsed here
  // since this becomes the actual displayed name throughout the app, not
  // just an import-time detail.
  return m ? m[1].trim().replace(/\s+/g, ' ') : null;
}

function parseDir(dir: string, schoolCode: 'primary' | 'secondary'): { rows: RosterRow[]; skipped: string[] } {
  const rows: RosterRow[] = [];
  const skipped: string[] = [];
  const files = readdirSync(dir).filter(f => /^Report Card - .*\.html$/i.test(f));
  for (const f of files) {
    const html = readFileSync(join(dir, f), 'utf-8');
    const full_name = extractField(html, 'Student Name');
    const admission_number = extractField(html, 'Admission No');
    const class_name_raw = extractField(html, 'Class');
    if (!full_name || !admission_number || !class_name_raw) {
      skipped.push(`${f} — missing ${!full_name ? 'name' : !admission_number ? 'admission no' : 'class'}`);
      continue;
    }
    rows.push({
      full_name,
      admission_number,
      class_name: normalizeClass(class_name_raw),
      school_code: schoolCode,
      source_file: f,
    });
  }
  return { rows, skipped };
}

async function main() {
  const yes = process.argv.includes('--yes');
  const primaryDir = arg('primary-dir');
  const secondaryDir = arg('secondary-dir');

  if (!primaryDir && !secondaryDir) {
    console.error('Pass at least one of --primary-dir or --secondary-dir.');
    process.exit(1);
  }

  let rows: RosterRow[] = [];
  const allSkipped: string[] = [];

  if (primaryDir) {
    const { rows: r, skipped } = parseDir(primaryDir, 'primary');
    rows = rows.concat(r);
    allSkipped.push(...skipped.map(s => `[primary] ${s}`));
  }
  if (secondaryDir) {
    const { rows: r, skipped } = parseDir(secondaryDir, 'secondary');
    rows = rows.concat(r);
    allSkipped.push(...skipped.map(s => `[secondary] ${s}`));
  }

  console.log(`Parsed ${rows.length} student row(s) from the report cards.\n`);

  // Duplicate admission numbers WITHIN the parsed batch itself (before ever
  // touching the DB) — a real problem to flag, not something to silently
  // dedupe by picking one arbitrarily.
  const seenAdm = new Map<string, RosterRow>();
  const dupeWithinBatch: string[] = [];
  for (const r of rows) {
    const key = `${r.school_code}:${r.admission_number}`;
    if (seenAdm.has(key)) {
      dupeWithinBatch.push(`admission_number '${r.admission_number}' (${r.school_code}): '${seenAdm.get(key)!.full_name}' (${seenAdm.get(key)!.source_file}) AND '${r.full_name}' (${r.source_file})`);
    } else {
      seenAdm.set(key, r);
    }
  }

  if (allSkipped.length) {
    console.log(`${allSkipped.length} file(s) skipped (missing a required field) — not imported:`);
    for (const s of allSkipped) console.log(`  ${s}`);
    console.log('');
  }
  if (dupeWithinBatch.length) {
    console.log(`${dupeWithinBatch.length} duplicate admission number(s) WITHIN this import batch — resolve these before running --yes, neither row is imported until they are:`);
    for (const d of dupeWithinBatch) console.log(`  ${d}`);
    console.log('');
  }

  const importable = rows.filter(r => !dupeWithinBatch.some(d => d.includes(`'${r.admission_number}'`)));

  if (!yes) {
    console.log('Dry run — sample of what would be imported (first 15 shown, all get inserted):\n');
    for (const r of importable.slice(0, 15)) {
      console.log(`  [${r.school_code}] ${r.full_name} — ${r.class_name} — Adm# ${r.admission_number}`);
    }
    if (importable.length > 15) console.log(`  ... and ${importable.length - 15} more`);
    console.log('\nEach row is inserted with ON CONFLICT (school_code, admission_number) DO NOTHING —');
    console.log('a student already in the database (matching on school + admission number) is');
    console.log('silently skipped, not duplicated or overwritten. Pass --yes to actually insert.');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  let inserted = 0, alreadyExisted = 0;
  try {
    await client.query('BEGIN');
    for (const r of importable) {
      const { rowCount } = await client.query(
        `INSERT INTO students(school_code, admission_number, full_name, class_name)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (school_code, admission_number) DO NOTHING`,
        [r.school_code, r.admission_number, r.full_name, r.class_name],
      );
      if (rowCount && rowCount > 0) inserted++; else alreadyExisted++;
    }
    await client.query('COMMIT');
    console.log(`\n✓ Inserted ${inserted} new student row(s). ${alreadyExisted} already existed (by admission number) and were left untouched. Committed.`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('\n✗ Rolled back — no changes were kept.');
    throw e;
  } finally {
    client.release();
  }

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
