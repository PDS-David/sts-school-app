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
    console.log('\nEvery class has at least one topic.');
  }

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

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
