// Moves mis-subjected topic rows: every topic in ONE class that was ingested
// from ONE named source file, from ONE subject to another. Built for the case
// where a file's heading and its filename disagree about the subject, e.g.
// "BASIC SCIENCE THIRD TERM PRY 4.docx" is headed "BASIC TECHNOLOGY THIRD TERM
// PRIMARY 4", so its rows landed under Basic Science.
//
// Only topics.subject_id changes. Topic ids, titles, bodies, order, term and
// every dependent row (topic_completions, topic_assets, topic_sequence_audit)
// stay exactly as they are.
//
// Dry run by default: prints the rows, whether the target subject exists, and
// any (class, term, order) clash in the target subject, and changes nothing.
// With --yes, --expect <N> is REQUIRED and must equal the number of matching
// rows right now. The script then runs BEGIN -> SELECT (re-counts, locks the
// rows) -> clash check -> UPDATE -> SELECT (confirms zero left in the old
// subject) and COMMITs only if every check agrees. Any mismatch or error
// ROLLBACKs; nothing is half-moved.
//
// The target subject must already exist for the school; this script never
// creates subjects.
//
// Usage (from backend/):
//   npx tsx src/db/reassignTopicsSubject.ts --class "Primary 4" --source-file "BASIC SCIENCE THIRD TERM PRY 4.docx" --from-subject "Basic Science" --to-subject "Basic Technology" --school-code primary
//   npx tsx src/db/reassignTopicsSubject.ts --class "Primary 4" --source-file "BASIC SCIENCE THIRD TERM PRY 4.docx" --from-subject "Basic Science" --to-subject "Basic Technology" --school-code primary --expect 7 --yes

import { pool } from './pool.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const className = arg('class');
  const sourceFile = arg('source-file');
  const fromSubject = arg('from-subject');
  const toSubject = arg('to-subject');
  const schoolCode = arg('school-code');
  const expectRaw = arg('expect');
  const yes = process.argv.includes('--yes');

  if (!className || !sourceFile || !fromSubject || !toSubject || !schoolCode) {
    console.error('Usage: npx tsx src/db/reassignTopicsSubject.ts --class "Primary 4" --source-file "<file name>" --from-subject "<current subject>" --to-subject "<correct subject>" --school-code primary [--expect N --yes]');
    process.exitCode = 1;
    return;
  }
  if (fromSubject === toSubject) {
    console.error('--from-subject and --to-subject are the same; nothing to do.');
    process.exitCode = 1;
    return;
  }
  if (yes && (expectRaw === undefined || !/^[0-9]+$/.test(expectRaw) || Number(expectRaw) < 1)) {
    console.error('--yes requires --expect <N> (a positive integer) equal to the row count shown by the dry run.');
    process.exitCode = 1;
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const subjects = await client.query(
      'SELECT id, name FROM subjects WHERE school_code=$1 AND name = ANY($2::text[])',
      [schoolCode, [fromSubject, toSubject]],
    );
    const fromId = subjects.rows.find((r: { name: string }) => r.name === fromSubject)?.id as number | undefined;
    const toId = subjects.rows.find((r: { name: string }) => r.name === toSubject)?.id as number | undefined;
    if (fromId === undefined || toId === undefined) {
      await client.query('ROLLBACK');
      console.error(`ABORTED: subject not found for school_code='${schoolCode}': ${fromId === undefined ? `"${fromSubject}" ` : ''}${toId === undefined ? `"${toSubject}"` : ''}. This script never creates subjects. Nothing changed.`);
      process.exitCode = 1;
      return;
    }

    // FOR UPDATE locks the rows we are about to move; harmless in a dry run.
    const { rows } = await client.query(
      `SELECT t.id, t.term_label, t.order_index, t.title
       FROM topics t
       WHERE t.school_code=$1 AND t.class_name=$2 AND t.source_file=$3 AND t.subject_id=$4
       ORDER BY t.term_label, t.order_index NULLS LAST, t.id
       FOR UPDATE OF t`,
      [schoolCode, className, sourceFile, fromId],
    );

    console.log(`${rows.length} topic row(s) in ${className} (school_code='${schoolCode}') from "${sourceFile}" currently under "${fromSubject}", to move to "${toSubject}":\n`);
    for (const r of rows) {
      console.log(`  #${r.id} [${r.term_label ?? '-'} | order ${r.order_index ?? '-'}] ${r.title}`);
    }

    const ids = rows.map((r: { id: number }) => r.id);
    const count = async (table: string) =>
      Number((await client.query(`SELECT count(*)::int AS n FROM ${table} WHERE topic_id = ANY($1::int[])`, [ids])).rows[0].n);
    const dependents = ids.length
      ? { topic_completions: await count('topic_completions'), topic_assets: await count('topic_assets'), topic_sequence_audit: await count('topic_sequence_audit') }
      : { topic_completions: 0, topic_assets: 0, topic_sequence_audit: 0 };
    console.log('\nDependent rows (kept as they are; they follow the topic id):', JSON.stringify(dependents));

    // The unique key is (school_code, subject_id, class_name, term_label, order_index):
    // refuse if any target-subject row already occupies one of the slots we need.
    const { rows: clashes } = ids.length
      ? await client.query(
        `SELECT e.id, e.term_label, e.order_index, e.title
         FROM topics e
         JOIN topics m ON m.id = ANY($4::int[])
         WHERE e.school_code=$1 AND e.class_name=$2 AND e.subject_id=$3
           AND e.term_label IS NOT DISTINCT FROM m.term_label
           AND e.order_index IS NOT DISTINCT FROM m.order_index
         ORDER BY e.term_label, e.order_index`,
        [schoolCode, className, toId, ids],
      )
      : { rows: [] as Array<{ id: number; term_label: string | null; order_index: number | null; title: string }> };
    if (clashes.length > 0) {
      await client.query('ROLLBACK');
      console.error(`\nABORTED: ${clashes.length} existing "${toSubject}" row(s) already occupy slots the moved rows need. Nothing changed:`);
      for (const c of clashes) console.error(`  #${c.id} [${c.term_label ?? '-'} | order ${c.order_index ?? '-'}] ${c.title}`);
      process.exitCode = 1;
      return;
    }
    console.log(`No clash: "${toSubject}" has no row in the term/order slots these topics need.`);

    if (!yes) {
      await client.query('ROLLBACK');
      console.log('\nDRY RUN - nothing changed. To move them, re-run with: --expect ' + rows.length + ' --yes');
      return;
    }

    if (rows.length !== Number(expectRaw)) {
      await client.query('ROLLBACK');
      console.error(`\nABORTED: found ${rows.length} row(s) but --expect was ${expectRaw}. Nothing changed.`);
      process.exitCode = 1;
      return;
    }

    const upd = await client.query('UPDATE topics SET subject_id=$1 WHERE id = ANY($2::int[])', [toId, ids]);
    const { rows: left } = await client.query(
      'SELECT count(*)::int AS n FROM topics WHERE school_code=$1 AND class_name=$2 AND source_file=$3 AND subject_id=$4',
      [schoolCode, className, sourceFile, fromId],
    );
    const { rows: moved } = await client.query(
      'SELECT count(*)::int AS n FROM topics WHERE id = ANY($1::int[]) AND subject_id=$2',
      [ids, toId],
    );
    if (upd.rowCount !== rows.length || left[0].n !== 0 || moved[0].n !== rows.length) {
      await client.query('ROLLBACK');
      console.error(`\nABORTED: updated ${upd.rowCount}, ${left[0].n} still under "${fromSubject}", ${moved[0].n} under "${toSubject}". Rolled back; nothing changed.`);
      process.exitCode = 1;
      return;
    }
    await client.query('COMMIT');
    console.log(`\nCOMMITTED: moved ${upd.rowCount} topic row(s) from "${fromSubject}" to "${toSubject}".`);
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch { /* connection already gone */ }
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
