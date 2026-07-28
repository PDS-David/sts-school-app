// One-off, READ-ONLY dry run. Before merging duplicate subject rows into
// their canonical keeper (see inspectSubjectDuplicates.ts for how these
// groups were found), this checks whether any single student already has
// a scores row under BOTH a duplicate AND the keeper for the same term —
// scores has UNIQUE(student_id, subject_id, term_id), so blindly
// reassigning subject_id would either violate that constraint outright, or
// (if done row-by-row with upserts) silently overwrite one real score with
// another without anyone deciding which one was correct. This reports any
// such collisions so a human can decide, rather than the merge script
// guessing. Writes nothing. Run with:
//   npx tsx src/db/checkSubjectMergeConflicts.ts
import { query, pool } from './pool.js';

// [keeperId, ...duplicateIds]
const GROUPS: number[][] = [
  [54, 70, 45, 23],   // Christian Religious Studies
  [47, 77, 69, 79],   // Cultural and Creative Arts
  [12, 75],           // English Language
  [52, 21],           // Literature in English
  [57, 68, 27],       // Physical Health Education
  [50, 78],           // Information Communication Technology
  [14, 76],           // Physics
];

async function main() {
  let anyConflicts = false;
  for (const [keeper, ...dups] of GROUPS) {
    const allIds = [keeper, ...dups];
    const { rows } = await query(
      `SELECT s.student_id, st.full_name, s.term_id, t.name AS term_name,
              array_agg(s.subject_id) AS subject_ids, array_agg(s.total) AS totals
       FROM scores s
       JOIN students st ON st.id = s.student_id
       JOIN terms t ON t.id = s.term_id
       WHERE s.subject_id = ANY($1)
       GROUP BY s.student_id, st.full_name, s.term_id, t.name
       HAVING COUNT(*) > 1`,
      [allIds],
    );
    if (rows.length) {
      anyConflicts = true;
      console.log(`\nCONFLICTS for group [${allIds.join(', ')}]:`);
      for (const r of rows) {
        console.log(`  ${r.full_name} — ${r.term_name}: subject_ids=${r.subject_ids} totals=${r.totals}`);
      }
    }

    const { rows: weRows } = await query(
      `SELECT student_id, term_id, week, array_agg(subject_id) AS subject_ids
       FROM weekly_efforts WHERE subject_id = ANY($1)
       GROUP BY student_id, term_id, week HAVING COUNT(*) > 1`,
      [allIds],
    );
    if (weRows.length) {
      anyConflicts = true;
      console.log(`\nweekly_efforts CONFLICTS for group [${allIds.join(', ')}]:`, weRows);
    }
  }
  console.log(anyConflicts ? '\n⚠ Conflicts found — see above. Do not run the merge until these are resolved.' : '\n✅ No conflicts found. Safe to proceed with the merge.');
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
