import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const registry = JSON.parse(readFileSync(path.join(root, 'backend/src/db/ss23/sourceRegistry.json'), 'utf8')) as Array<Record<string, unknown>>;
const biology = registry.filter(row => row.class_name === 'SS 2' && row.assigned_subject_slug === 'biology');

test('SS2 Biology source registry binds exactly one verified source to each term', () => {
  assert.deepEqual(
    biology.map(row => ({
      term: row.term,
      source_id: row.source_id,
      sha256: row.sha256,
      bytes: row.bytes,
      header_status: row.header_status,
    })),
    [
      {
        term: '1st Term',
        source_id: 'SS23-SRC-99d05427b30d',
        sha256: '99d05427b30d89b0c81a13ffe01bab6d3a99912383aabd7a64430278c4899145',
        bytes: 468480,
        header_status: 'HEADER_VERIFIED',
      },
      {
        term: '2nd Term',
        source_id: 'SS23-SRC-9e65e0d4e3ff',
        sha256: '9e65e0d4e3ff0e30caf805f7124a4d420ca1a952b05472e61f0c8a7a67876659',
        bytes: 1621928,
        header_status: 'HEADER_VERIFIED',
      },
      {
        term: '3rd Term',
        source_id: 'SS23-SRC-4589be4d53c8',
        sha256: '4589be4d53c8e0f756297b9c2d9579f0afc39a79b4facb57d8b2b040fef25605',
        bytes: 557018,
        header_status: 'HEADER_VERIFIED',
      },
    ],
  );
});

test('SS2 Biology source coverage audit preserves all combined-week structures', () => {
  const audit = readFileSync(path.join(root, 'docs/ss23/subjects/biology/ORIGINAL_SOURCE_COVERAGE_AUDIT_20261116.md'), 'utf8');
  for (const required of [
    'WEEK NINE & TEN begins at line 1,778',
    'Combined WEEK ONE & TWO begins at line 29',
    'Combined WEEK FOUR AND FIVE begins at line 462',
    'Combined WEEK THREE AND FOUR begins at line 192',
    'Combined WEEK NINE & TEN begins at line 792',
    '139',
  ]) assert.ok(audit.includes(required), `Missing source-audit evidence: ${required}`);
});
