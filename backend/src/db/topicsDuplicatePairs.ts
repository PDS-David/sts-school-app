// Extends topicsCoverageReport.ts's per-bucket "LIKELY DUPLICATE CLUSTER"
// flag (144 buckets found live) from "here's a bucket with a mix of thin
// and thick source_reference lengths, go read every title yourself" down
// to "here are the specific pairs that are probably the same topic said
// twice" — the documented ingestTopics.ts limitation (a source file's
// summary table and its real per-topic content both use the same
// "WEEK N" marker, so the parser ingests both as separate topic rows).
//
// Pair heuristic: within one (school/class/subject/term_label) bucket, a
// thin row (source_reference < 100 chars) and a thick row
// (source_reference >= 500 chars) are flagged as a likely pair when the
// thick row's normalized title STARTS WITH the thin row's normalized
// title — normalization strips punctuation/parens, lowercases, and
// collapses whitespace. This matches the real example that motivated this
// script: "FRACTIONS" (16 chars) vs "FRACTIONS (TYPES OF FRACTIONS),
// RATIO AND PERCENTAGES" (1997 chars) — normalized short form "fractions"
// is an exact prefix of the normalized long form. A short title that
// ISN'T a prefix of anything longer in its bucket is never flagged — this
// is deliberately conservative to avoid exactly the false-positive case
// named in the brief: "MID TERM EXAMINATION" (27 chars) is short, but it's
// not a prefix of some unrelated longer title, so it's correctly left
// alone.
//
// This still only SURFACES candidates (2a) — it does not decide anything
// on its own. Read the printed pairs (and spot-check against the actual
// source documents if there's any doubt) before ever passing --yes.
//
// Deletion (2b, gated behind --yes): for each confirmed pair, delete the
// thin (shorter) row, keep the thick one. Two safety checks run on every
// thin row before it's deleted, even under --yes — if either is true, that
// row is SKIPPED (not deleted) and printed as needing manual review
// instead:
//   - it already has a real topic_completions row (a student has actually
//     interacted with it) — auto-deleting real student history is not
//     something a heuristic script should ever do unattended.
//   - it already has generated_assessment_id set (Brainee already built a
//     real assessment for it) — deleting the topic would orphan that
//     assessment rather than cleanly removing an unused duplicate.
//
// Usage:
//   npx tsx src/db/topicsDuplicatePairs.ts [--school-code primary|secondary]           # dry run — lists pairs only
//   npx tsx src/db/topicsDuplicatePairs.ts [--school-code ...] --yes                    # deletes confirmed-safe thin duplicates

import { pool, query } from './pool.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const THIN_MAX = 100;   // chars — matches topicsCoverageReport.ts's THIN_THRESHOLD
const THICK_MIN = 500;  // chars — the brief's own suggested gap, wide enough that a
                         // merely-medium-length real topic never gets caught in between

function normalize(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // strip punctuation/parens/commas
    .replace(/\s+/g, ' ')
    .trim();
}

interface TopicRow {
  id: number;
  title: string;
  source_len: number;
}

async function main() {
  const schoolCode = arg('school-code');
  const yes = process.argv.includes('--yes');

  const { rows: buckets } = await query(
    `SELECT t.school_code, t.class_name, s.name AS subject_name, t.term_label
     FROM topics t JOIN subjects s ON s.id = t.subject_id
     WHERE ($1::text IS NULL OR t.school_code = $1)
     GROUP BY t.school_code, t.class_name, s.name, t.term_label
     HAVING COUNT(*) FILTER (WHERE LENGTH(t.source_reference) < $2) > 0
        AND COUNT(*) FILTER (WHERE LENGTH(t.source_reference) < $2) < COUNT(*)
     ORDER BY t.school_code, t.class_name, s.name, t.term_label`,
    [schoolCode ?? null, THIN_MAX],
  );

  console.log(`Scanning ${buckets.length} flagged bucket(s) for likely-duplicate pairs...\n`);

  const pairs: Array<{ bucket: string; thin: TopicRow; thick: TopicRow }> = [];

  for (const b of buckets) {
    const { rows: topics } = await query(
      `SELECT t.id, t.title, LENGTH(t.source_reference) AS source_len
       FROM topics t JOIN subjects s ON s.id = t.subject_id
       WHERE t.school_code=$1 AND t.class_name=$2 AND s.name=$3 AND t.term_label=$4`,
      [b.school_code, b.class_name, b.subject_name, b.term_label],
    ) as { rows: TopicRow[] };

    const thin = topics.filter(t => t.source_len < THIN_MAX);
    const thick = topics.filter(t => t.source_len >= THICK_MIN);
    const bucketLabel = `[${b.school_code}] ${b.class_name} / ${b.subject_name} / ${b.term_label}`;

    for (const t of thin) {
      const normThin = normalize(t.title);
      if (!normThin) continue;
      for (const k of thick) {
        if (normalize(k.title).startsWith(normThin)) {
          pairs.push({ bucket: bucketLabel, thin: t, thick: k });
        }
      }
    }
  }

  if (pairs.length === 0) {
    console.log('No likely-duplicate pairs found with the current heuristic.');
    await pool.end();
    return;
  }

  console.log(`Found ${pairs.length} likely-duplicate pair(s):\n`);
  for (const p of pairs) {
    console.log(`  ${p.bucket}`);
    console.log(`    thin  (id=${p.thin.id}, ${p.thin.source_len} chars): "${p.thin.title}"`);
    console.log(`    thick (id=${p.thick.id}, ${p.thick.source_len} chars): "${p.thick.title}"`);
    console.log('');
  }

  if (!yes) {
    console.log('Dry run only — read the pairs above (spot-check against the actual source');
    console.log('documents if there\'s any doubt) before passing --yes. Pass --yes to delete');
    console.log('the thin row from each pair, keeping the thick one — rows with real student');
    console.log('completions or an already-generated assessment are skipped even under --yes,');
    console.log('and printed separately below for manual review instead.');
    await pool.end();
    return;
  }

  // De-duplicate: the same thin id could theoretically match more than one
  // thick row in the same bucket — only ever delete it once.
  const thinIds = [...new Set(pairs.map(p => p.thin.id))];
  const skipped: Array<{ id: number; title: string; reason: string }> = [];
  const toDelete: number[] = [];

  for (const id of thinIds) {
    const p = pairs.find(x => x.thin.id === id)!;
    const { rows: compRows } = await query('SELECT COUNT(*)::int AS c FROM topic_completions WHERE topic_id=$1', [id]);
    if (compRows[0].c > 0) {
      skipped.push({ id, title: p.thin.title, reason: `has ${compRows[0].c} real topic_completions row(s) — a student has actually interacted with this` });
      continue;
    }
    const { rows: topicRows } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [id]);
    if (topicRows[0]?.generated_assessment_id) {
      skipped.push({ id, title: p.thin.title, reason: 'already has generated_assessment_id set — Brainee already built a real assessment for it' });
      continue;
    }
    toDelete.push(id);
  }

  if (skipped.length) {
    console.log(`\n${skipped.length} row(s) SKIPPED (not deleted) — needs manual review:`);
    for (const s of skipped) console.log(`  id=${s.id} "${s.title}" — ${s.reason}`);
  }

  if (toDelete.length === 0) {
    console.log('\nNothing safe to delete — exiting without changes.');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM topics WHERE id = ANY($1)', [toDelete]);
    await client.query('COMMIT');
    console.log(`\n✓ Deleted ${toDelete.length} thin duplicate topic row(s). Committed.`);
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
