// Read-only: where did a class's topic rows come from?
//
// Prints, for one class (optionally narrowed to a subject and/or term), every
// topic's source file, source-text length and a short fingerprint of its
// source text, then a summary grouped by source file. Written to confirm
// whether rows filed under one class were actually ingested from another
// class's source file (e.g. Primary 3 rows that came from a Primary 4 file).
//
// It never writes: the whole run is one READ ONLY transaction, and there is
// no --yes flag. Safe to run against production at any time.
//
// Usage (from backend/):
//   npx tsx src/db/inspectTopicProvenance.ts --class "Primary 3" --school-code primary
//   npx tsx src/db/inspectTopicProvenance.ts --class "Primary 4" --subject "Computer Studies" --term "1st Term" --school-code primary

import { createHash } from 'node:crypto';
import { pool } from './pool.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const className = arg('class');
  const subjectName = arg('subject');
  const termLabel = arg('term');
  const schoolCode = arg('school-code') ?? 'primary';

  if (!className) {
    console.error('Usage: npx tsx src/db/inspectTopicProvenance.ts --class "Primary 3" [--subject "Computer Studies"] [--term "1st Term"] [--school-code primary]');
    process.exitCode = 1;
    return;
  }

  const params: unknown[] = [schoolCode, className];
  let sql = `SELECT t.id, s.name AS subject_name, t.term_label, t.order_index, t.title,
                    t.source_file, t.source_reference, t.created_at
             FROM topics t JOIN subjects s ON s.id = t.subject_id
             WHERE t.school_code=$1 AND t.class_name=$2`;
  if (subjectName) { params.push(subjectName); sql += ` AND s.name=$${params.length}`; }
  if (termLabel) { params.push(termLabel); sql += ` AND t.term_label=$${params.length}`; }
  sql += ' ORDER BY s.name, t.term_label, t.order_index NULLS LAST, t.id';

  const client = await pool.connect();
  try {
    await client.query('BEGIN READ ONLY');
    const { rows } = await client.query(sql, params);
    await client.query('ROLLBACK');

    const scope = [className, subjectName, termLabel].filter(Boolean).join(' / ');
    console.log(`${rows.length} topic row(s) for ${scope} (school_code='${schoolCode}')\n`);

    const fingerprint = (text: string | null) =>
      text ? createHash('sha256').update(text).digest('hex').slice(0, 10) : '-';

    for (const r of rows) {
      const len = r.source_reference ? String(r.source_reference).length : 0;
      console.log(
        `  #${r.id} [${r.subject_name} | ${r.term_label ?? '-'} | order ${r.order_index ?? '-'}] ${r.title}` +
        ` | file: ${r.source_file ?? '(none)'} | ${len} chars | sha ${fingerprint(r.source_reference)}` +
        ` | created ${new Date(r.created_at).toISOString().slice(0, 19)}Z`,
      );
    }

    const bySource = new Map<string, { count: number; terms: Set<string>; subjects: Set<string> }>();
    for (const r of rows) {
      const key = r.source_file ?? '(none)';
      const entry = bySource.get(key) ?? { count: 0, terms: new Set<string>(), subjects: new Set<string>() };
      entry.count++;
      entry.terms.add(r.term_label ?? '-');
      entry.subjects.add(r.subject_name);
      bySource.set(key, entry);
    }
    console.log('\nSUMMARY BY SOURCE FILE (a class whose files name a different class is suspect):');
    for (const [file, e] of [...bySource.entries()].sort()) {
      console.log(`  ${e.count} row(s)  ${file}  [${[...e.subjects].join(', ')} | ${[...e.terms].join(', ')}]`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
