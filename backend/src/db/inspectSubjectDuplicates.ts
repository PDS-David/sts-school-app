// One-off, READ-ONLY inspection script — reports how many rows in every
// table that references subjects.id actually use each of the known
// duplicate/misspelled subject rows found in the secondary school's
// subjects list (Christian Religious Studies x4, Cultural/Creative Arts
// x4, English x2, Literature x2, Physical/Health Education x3, ICT x2,
// PSV/PVS x2, Physics x2 — see chat history for how these were found).
// Nothing here writes or deletes anything. Run with:
//   npx tsx src/db/inspectSubjectDuplicates.ts
// (same temporary DATABASE_URL / NODE_ENV=production env var pattern as
// every other one-off script in this project.)
import { query, pool } from './pool.js';

const DUPLICATE_IDS = [70, 54, 45, 23, 47, 77, 69, 79, 75, 12, 52, 21, 68, 57, 27, 50, 78, 51, 44, 76, 14];

async function main() {
  console.log('Checking usage of each candidate-duplicate subject_id across every referencing table...\n');
  for (const id of DUPLICATE_IDS) {
    const { rows: nameRows } = await query('SELECT name FROM subjects WHERE id=$1', [id]);
    const name = nameRows[0]?.name ?? '(not found)';

    const tables = ['scores', 'materials', 'questions', 'assessments', 'weekly_efforts', 'teacher_subjects'];
    const counts: string[] = [];
    for (const t of tables) {
      const { rows } = await query(`SELECT COUNT(*) FROM ${t} WHERE subject_id=$1`, [id]);
      const c = Number(rows[0].count);
      if (c > 0) counts.push(`${t}=${c}`);
    }
    console.log(`id=${id.toString().padEnd(4)} "${name}"  ->  ${counts.length ? counts.join(', ') : 'UNUSED (safe to delete directly)'}`);
  }
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
