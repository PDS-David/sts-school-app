// Read-only report — no --yes flag anywhere in this file, safe to run
// against production at any time. Written for two purposes at once, since
// a single agent session can't get live DB access and needs one round trip
// to answer both:
//
//   1. COVERAGE: which classes have had zero topics ingested at all yet
//      (cross-referenced against the real `classes` table, not just "what's
//      in `topics`" — a class with 0 rows in `topics` never shows up if you
//      only look at `topics`).
//   2. LIKELY DUPLICATE CLUSTERS: per (class/subject/term) bucket, flag
//      cases where some topics have very short source_reference (<100
//      chars — almost certainly a scheme-of-work TABLE row) sitting
//      alongside much longer ones (>=100 chars — the real lesson content)
//      in the same bucket. This is the exact, documented, on-purpose
//      limitation from ingestTopics.ts's own header comment: a source
//      file's summary table and its real per-topic content both use the
//      same "WEEK N" marker, so the parser can't tell them apart and
//      ingests both. This script does NOT decide which rows to remove —
//      that needs a human/agent to actually read the flagged bucket's
//      titles and confirm which are the thin table-row duplicates before
//      deleting anything. Confirmed real via a live checkTopicCount.ts run
//      against JSS 2 / Mathematics / 1st Term, which showed exactly this
//      pattern (e.g. "FRACTIONS" at 16 chars alongside "FRACTIONS (TYPES OF
//      FRACTIONS), RATIO AND PERCENTAGES" at 1997 chars).
//
// Usage:
//   npx tsx src/db/topicsCoverageReport.ts [--school-code primary|secondary]
//   (omit --school-code to report on both schools)

import { pool, query } from './pool.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const THIN_THRESHOLD = 100; // chars — matches the <60/reported-separately
                             // threshold ingestTopics.ts's own dry-run uses
                             // as "likely scheme-of-work table entry",
                             // widened slightly here since a cluster with a
                             // 90-char row next to a 2000-char row is just
                             // as worth a human's eyes as a <60-char one.

async function main() {
  const schoolCode = arg('school-code');
  if (process.argv.includes('--school-code') && !['primary', 'secondary'].includes(schoolCode ?? '')) {
    throw new Error('--school-code must be primary or secondary');
  }

  // ── 1. Coverage: classes with zero topics at all ──────────────────────────
  const { rows: classesWithCounts } = await query(
    `SELECT c.school_code, c.name AS class_name,
            COUNT(t.id) AS topic_count
     FROM classes c
     LEFT JOIN topics t ON t.school_code = c.school_code AND t.class_name = c.name
     WHERE ($1::text IS NULL OR c.school_code = $1)
     GROUP BY c.school_code, c.name
     ORDER BY c.school_code, c.name`,
    [schoolCode ?? null],
  );

  console.log('═'.repeat(78));
  console.log('COVERAGE — topic count per class (0 means nothing ingested yet)');
  console.log('═'.repeat(78));
  const emptyClasses: string[] = [];
  for (const r of classesWithCounts) {
    if (/^sss?\s*3$/i.test(r.class_name)) {
      console.log(`  [${r.school_code}] ${r.class_name}: ${r.topic_count} topic(s) — EXAM PREPARATION ONLY; expected 0 normal topics`);
      continue;
    }
    const marker = Number(r.topic_count) === 0 ? '  ← NOTHING INGESTED' : '';
    console.log(`  [${r.school_code}] ${r.class_name}: ${r.topic_count} topic(s)${marker}`);
    if (Number(r.topic_count) === 0) emptyClasses.push(`${r.school_code}/${r.class_name}`);
  }
  if (emptyClasses.length) {
    console.log(`\n${emptyClasses.length} class(es) have NO topics ingested yet: ${emptyClasses.join(', ')}`);
    console.log('(This only means the topics table has nothing for them — check separately whether');
    console.log(' source curriculum files for these classes exist and simply haven\'t been run yet,');
    console.log(' versus genuinely not having source material available.)');
  } else {
    console.log('\nNo empty normal-curriculum classes found in the selected class records.');
  }

  // Presence only: an entirely absent subject cannot appear in this matrix.
  // term_id-backed legacy/manual topics are counted by their linked term name.
  const { rows: termCoverage } = await query(
    `SELECT t.school_code, t.class_name, t.subject_id,
            COALESCE(s.name, '(unassigned subject)') AS subject_name,
            COUNT(*) FILTER (WHERE COALESCE(NULLIF(t.term_label, ''), tr.name) = '1st Term') AS first_term,
            COUNT(*) FILTER (WHERE COALESCE(NULLIF(t.term_label, ''), tr.name) = '2nd Term') AS second_term,
            COUNT(*) FILTER (WHERE COALESCE(NULLIF(t.term_label, ''), tr.name) = '3rd Term') AS third_term,
            COUNT(*) FILTER (WHERE COALESCE(NULLIF(t.term_label, ''), tr.name, '')
              NOT IN ('1st Term', '2nd Term', '3rd Term')) AS unknown_term
     FROM topics t
     LEFT JOIN subjects s ON s.id = t.subject_id
     LEFT JOIN terms tr ON tr.id = t.term_id
     WHERE ($1::text IS NULL OR t.school_code = $1)
       AND COALESCE(t.class_name, '') !~* '^SSS?\\s*3$'
     GROUP BY t.school_code, t.class_name, t.subject_id, s.name
     ORDER BY t.school_code, t.class_name, s.name, t.subject_id`,
    [schoolCode ?? null],
  );
  console.log('\nTERM COVERAGE — observed normal-curriculum subjects (topic counts)');
  console.log('  School | Class | Subject | 1st Term | 2nd Term | 3rd Term | Missing terms');
  for (const r of termCoverage) {
    const counts = [r.first_term, r.second_term, r.third_term].map(Number);
    const missing = ['1st Term', '2nd Term', '3rd Term'].filter((_, i) => counts[i] === 0);
    console.log(`  ${r.school_code} | ${r.class_name} | ${r.subject_name} | ${counts.join(' | ')} | ${missing.join(', ') || 'none (presence only)'}`);
    if (Number(r.unknown_term)) console.log(`    WARNING: ${r.unknown_term} topic(s) have no recognized term.`);
  }
  if (!termCoverage.length) console.log('  No normal-curriculum subjects observed.');
  console.log('LIMITATION: this matrix cannot detect subjects entirely absent from the corpus/database.');
  console.log('Term presence does not prove complete weeks, lessons or syllabus coverage.');

  // Independent of subjects/classes joins, so orphaned/mislabelled SS3 rows
  // cannot disappear from this safety check. Never delete or modify them here.
  const { rows: ss3 } = await query(
    `SELECT school_code, class_name, COUNT(*) AS topic_count FROM topics
     WHERE ($1::text IS NULL OR school_code=$1) AND class_name ~* '^SSS?\\s*3$'
     GROUP BY school_code, class_name ORDER BY school_code, class_name`,
    [schoolCode ?? null],
  );
  const ss3Count = ss3.reduce((total, r) => total + Number(r.topic_count), 0);
  console.log(`\nSS 3 normal-curriculum topic rows = ${ss3Count}; expected 0${ss3Count ? ' — REVIEW REQUIRED' : ''}`);
  for (const r of ss3) console.log(`  [${r.school_code}] ${r.class_name}: ${r.topic_count}`);

  // ── 2. Per-bucket breakdown + likely-duplicate-cluster flag ──────────────
  const { rows: buckets } = await query(
    `SELECT t.school_code, t.class_name, s.name AS subject_name, t.term_label,
            COUNT(*) AS topic_count,
            COUNT(*) FILTER (WHERE LENGTH(t.source_reference) < $2) AS thin_count,
            MIN(LENGTH(t.source_reference)) AS min_len,
            MAX(LENGTH(t.source_reference)) AS max_len
     FROM topics t JOIN subjects s ON s.id = t.subject_id
     WHERE ($1::text IS NULL OR t.school_code = $1)
     GROUP BY t.school_code, t.class_name, s.name, t.term_label
     ORDER BY t.school_code, t.class_name, s.name, t.term_label`,
    [schoolCode ?? null, THIN_THRESHOLD],
  );

  console.log('\n' + '═'.repeat(78));
  console.log('PER-BUCKET BREAKDOWN (class / subject / term) — flagged buckets need review');
  console.log('═'.repeat(78));
  const flagged: typeof buckets = [];
  for (const b of buckets) {
    const isMixed = Number(b.thin_count) > 0 && Number(b.thin_count) < Number(b.topic_count);
    if (isMixed) flagged.push(b);
    const flag = isMixed ? '  ⚠ LIKELY DUPLICATE CLUSTER' : '';
    console.log(
      `  [${b.school_code}] ${b.class_name} / ${b.subject_name} / ${b.term_label}: ` +
      `${b.topic_count} topic(s), source length ${b.min_len}-${b.max_len} chars${flag}`,
    );
  }

  if (flagged.length) {
    console.log(`\n${flagged.length} bucket(s) flagged as likely duplicate clusters. To inspect one in`);
    console.log('full (titles + exact lengths), run:');
    console.log('  npx tsx src/db/checkTopicCount.ts --class "<class>" --subject <subject> --term "<term>" --school-code <code>');
    console.log('\nDo not delete anything based on this report alone — it flags candidates, it');
    console.log('does not identify which specific rows are the thin duplicates. Read the full');
    console.log('title list per flagged bucket first.');
  } else {
    console.log('\nNo buckets flagged as likely duplicate clusters.');
  }

}

main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => pool.end());
