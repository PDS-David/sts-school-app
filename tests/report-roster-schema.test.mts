import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const migration = readFileSync(join(root, 'backend/migrations/0005_report_roster_memberships.sql'), 'utf8');
const schema = readFileSync(join(root, 'backend/schema.sql'), 'utf8');

test('numbered migration creates separate current report-roster membership and immutable history', () => {
  for (const table of ['report_roster_memberships', 'report_roster_membership_events']) {
    assert.ok(migration.includes(`CREATE TABLE IF NOT EXISTS public.${table}`));
    assert.ok(schema.includes(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
  for (const field of ['student_id', 'class_name', 'source_class_name', 'status', 'joined_at', 'removed_at', 'changed_by', 'updated_at']) {
    assert.ok(migration.includes(field));
  }
  assert.ok(migration.includes("status IN ('active', 'removed')"));
  assert.ok(migration.includes('ON DELETE RESTRICT'));
  assert.ok(migration.includes('BEFORE UPDATE OR DELETE ON public.report_roster_membership_events'));
  assert.ok(migration.includes('BEFORE TRUNCATE ON public.report_roster_membership_events'));
});

test('migration backfills membership without rewriting online identity or academic history', () => {
  assert.ok(migration.includes('INSERT INTO public.report_roster_memberships'));
  assert.ok(migration.includes('FROM public.students s'));
  assert.ok(migration.includes('ON CONFLICT (student_id) DO NOTHING'));
  assert.ok(migration.includes("CASE WHEN s.deleted_at IS NULL THEN 'active' ELSE 'removed' END"));
  for (const forbidden of [
    'UPDATE public.students',
    'DELETE FROM public.students',
    'UPDATE public.scores',
    'UPDATE public.attendance',
    'UPDATE public.parent_wards',
  ]) assert.ok(!migration.includes(forbidden), `migration must not run: ${forbidden}`);
  assert.ok(schema.includes('INSERT INTO report_roster_memberships'));
  assert.ok(schema.includes('FROM students'));
});

test('schema.sql and numbered migration both preserve the append-only event trail', () => {
  assert.ok(migration.includes('report_roster_events_reject_mutation'));
  assert.ok(schema.includes('report_roster_events_reject_mutation'));
  assert.ok(migration.includes('REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.report_roster_membership_events FROM PUBLIC'));
  assert.ok(schema.includes('REVOKE UPDATE, DELETE, TRUNCATE ON TABLE report_roster_membership_events FROM PUBLIC'));
});
