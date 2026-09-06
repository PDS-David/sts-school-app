// Read-only check: does a topic already exist for a given class/subject/
// term? No --yes flag needed anywhere in this script — it never writes
// anything, purely a SELECT, safe to run against production at any time.
//
// Written to answer one specific question: did 'JSS 2 MATHEMATICS.docx'
// (the good file sitting alongside the corrupted '2 MATHEMATICS.doc' in
// the same folder) already get ingested as part of the JSS 1-3 --yes run?
//
// Usage:
//   npx tsx src/db/checkTopicCount.ts --class "JSS 2" --subject Mathematics --term "1st Term" --school-code secondary

import { pool, query } from './pool.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const className = arg('class');
  const subjectName = arg('subject');
  const termLabel = arg('term');
  const schoolCode = arg('school-code') ?? 'secondary';

  if (!className || !subjectName) {
    console.error('Usage: npx tsx src/db/checkTopicCount.ts --class "JSS 2" --subject Mathematics [--term "1st Term"] [--school-code secondary]');
    process.exit(1);
  }

  const params: unknown[] = [schoolCode, className, subjectName];
  let sql = `SELECT t.title, t.term_label, t.order_index, LENGTH(t.source_reference) AS source_len
             FROM topics t JOIN subjects s ON s.id = t.subject_id
             WHERE t.school_code=$1 AND t.class_name=$2 AND s.name=$3`;
  if (termLabel) { params.push(termLabel); sql += ` AND t.term_label=$${params.length}`; }
  sql += ' ORDER BY t.order_index NULLS LAST';

  const { rows } = await query(sql, params);
  console.log(`Found ${rows.length} topic(s) for ${className} / ${subjectName}${termLabel ? ' / ' + termLabel : ''} (school_code='${schoolCode}'):\n`);
  for (const r of rows) {
    console.log(`  [order ${r.order_index ?? '—'}] ${r.title} (${r.term_label}, ${r.source_len ?? 0} chars of source text)`);
  }
  if (rows.length === 0) console.log('  (none found)');

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
