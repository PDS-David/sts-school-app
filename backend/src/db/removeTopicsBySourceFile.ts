// Removes mis-filed topic rows: every topic in ONE class that was ingested
// from ONE named source file. Built for the case where the importer filed a
// file under the wrong class (e.g. "2nd term grade 3 dig.docx" is a Primary 4
// document whose filename says "grade 3", so its rows landed in Primary 3).
//
// Dry run by default: prints the rows and everything that would cascade with
// them (topic_completions, topic_assets, topic_sequence_audit all reference
// topics ON DELETE CASCADE) and changes nothing. Always run it once without
// --yes first, same convention as resetAcademicData.ts / renameClassNaming.ts.
//
// With --yes, --expect <N> is REQUIRED and must equal the number of matching
// rows right now. The script then runs BEGIN -> SELECT (re-counts, locks the
// rows) -> DELETE -> SELECT (confirms zero left) and COMMITs only if every
// check agrees. Any mismatch or error ROLLBACKs; nothing is half-deleted.
//
// Usage (from backend/):
//   npx tsx src/db/removeTopicsBySourceFile.ts --class "Primary 3" --source-file "2nd term grade 3 dig.docx" --school-code primary
//   npx tsx src/db/removeTopicsBySourceFile.ts --class "Primary 3" --source-file "2nd term grade 3 dig.docx" --school-code primary --expect 11 --yes

import { pool } from './pool.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const className = arg('class');
  const sourceFile = arg('source-file');
  const schoolCode = arg('school-code');
  const expectRaw = arg('expect');
  const yes = process.argv.includes('--yes');

  if (!className || !sourceFile || !schoolCode) {
    console.error('Usage: npx tsx src/db/removeTopicsBySourceFile.ts --class "Primary 3" --source-file "<file name>" --school-code primary [--expect N --yes]');
    process.exitCode = 1;
    return;
  }
  if (yes && (expectRaw === undefined || !/^[0-9]+$/.test(expectRaw) || Number(expectRaw) < 1)) {
    console.error('--yes requires --expect <N> (a positive integer) equal to the row count shown by the dry run.');
    process.exitCode = 1;
    return;
  }

  const params = [schoolCode, className, sourceFile];
  const where = 't.school_code=$1 AND t.class_name=$2 AND t.source_file=$3';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // FOR UPDATE locks the rows we are about to remove; harmless in a dry run.
    const { rows } = await client.query(
      `SELECT t.id, s.name AS subject_name, t.term_label, t.order_index, t.title
       FROM topics t JOIN subjects s ON s.id=t.subject_id
       WHERE ${where}
       ORDER BY s.name, t.term_label, t.order_index NULLS LAST, t.id
       FOR UPDATE OF t`,
      params,
    );

    console.log(`${rows.length} topic row(s) in ${className} (school_code='${schoolCode}') ingested from "${sourceFile}":\n`);
    for (const r of rows) {
      console.log(`  #${r.id} [${r.subject_name} | ${r.term_label ?? '-'} | order ${r.order_index ?? '-'}] ${r.title}`);
    }

    const ids = rows.map((r: { id: number }) => r.id);
    const count = async (table: string) =>
      Number((await client.query(`SELECT count(*)::int AS n FROM ${table} WHERE topic_id = ANY($1::int[])`, [ids])).rows[0].n);
    const cascade = ids.length
      ? { topic_completions: await count('topic_completions'), topic_assets: await count('topic_assets'), topic_sequence_audit: await count('topic_sequence_audit') }
      : { topic_completions: 0, topic_assets: 0, topic_sequence_audit: 0 };
    console.log('\nRows that would be deleted with them (ON DELETE CASCADE):', JSON.stringify(cascade));

    if (!yes) {
      await client.query('ROLLBACK');
      console.log('\nDRY RUN - nothing changed. To delete, re-run with: --expect ' + rows.length + ' --yes');
      return;
    }

    if (rows.length !== Number(expectRaw)) {
      await client.query('ROLLBACK');
      console.error(`\nABORTED: found ${rows.length} row(s) but --expect was ${expectRaw}. Nothing deleted.`);
      process.exitCode = 1;
      return;
    }

    const del = await client.query('DELETE FROM topics WHERE id = ANY($1::int[])', [ids]);
    const { rows: left } = await client.query(`SELECT count(*)::int AS n FROM topics t WHERE ${where}`, params);
    if (del.rowCount !== rows.length || left[0].n !== 0) {
      await client.query('ROLLBACK');
      console.error(`\nABORTED: deleted ${del.rowCount}, ${left[0].n} still remain. Rolled back; nothing deleted.`);
      process.exitCode = 1;
      return;
    }
    await client.query('COMMIT');
    console.log(`\nCOMMITTED: deleted ${del.rowCount} topic row(s) and their cascaded dependents.`);
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch { /* connection already gone */ }
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
