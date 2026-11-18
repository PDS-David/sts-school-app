import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const migration = readFileSync(join(root, 'backend/migrations/0005_report_roster_memberships.sql'), 'utf8');
const schema = readFileSync(join(root, 'backend/schema.sql'), 'utf8');

test('numbered migration creates separate current report-roster membership and immutable history', () => {
  for (const table of ['report_roster_memberships', 'report_roster_membership_events']) {
    assert.match(migration, new RegExp('CREATE TABLE IF NOT EXISTS public\\.' + table));
    assert.match(schema, new RegExp('CREATE TABLE IF NOT EXISTS ' + table));
  }
  for (const field of ['student_id', 'class_name', 'source_class_name', 'status', 'joined_at', 'removed_at', 'changed_by', 'updated_at']) {
    assert.match(migration, new RegExp('\\b' + field + '\\b'));
  }
  assert.match(migration, /status IN \\(\'active\', \'removed\'\\)/);
  assert.match(migration, /ON DELETE RESTRICT/);
  assert.match(migration, /BEFORE UPDATE OR DELETE ON public\\.report_roster_membership_events/);
  assert.match(migration, /BEFORE TRUNCATE ON public\\.report_roster_membership_events/);
});

test('migration backfills membership without rewriting online identity or academic history', () => {
  assert.match(migration, /INSERT INTO public\\.report_roster_memberships[\\s\\S]*?FROM public\\.students s[\\s\\S]*?ON CONFLICT \\(student_id\\) DO NOTHING/);
  assert.match(migration, /CASE WHEN s\\.deleted_at IS NULL THEN \'active\' ELSE \'removed\' END/);
  assert.doesNotMatch(migration, /UPDATE public\\.students|DELETE FROM public\\.students|UPDATE public\\.scores|UPDATE public\\.attendance|UPDATE public\\.parent_wards/i);
  assert.match(schema, /INSERT INTO report_roster_memberships[\\s\\S]*?FROM students[\\s\\S]*?ON CONFLICT \\(student_id\\) DO NOTHING/);
});

test('schema.sql and numbered migration both preserve the append-only event trail', () => {
  assert.match(migration, /report_roster_events_reject_mutation/);
  assert.match(schema, /report_roster_events_reject_mutation/);
  assert.match(migration, /REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public\\.report_roster_membership_events FROM PUBLIC/);
  assert.match(schema, /REVOKE UPDATE, DELETE, TRUNCATE ON TABLE report_roster_membership_events FROM PUBLIC/);
});
