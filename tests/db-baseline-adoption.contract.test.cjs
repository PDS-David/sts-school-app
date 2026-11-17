const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const contract = JSON.parse(readFileSync(path.join(root, 'backend/migrations/baseline/0001_contract.json'), 'utf8'));
const baselinePath = path.join(root, 'backend/migrations/0001_baseline.sql');

test('production baseline contract is pinned to the immutable 0001 migration', () => {
  const actual = createHash('sha256').update(readFileSync(baselinePath)).digest('hex');
  assert.equal(actual, contract.baseline_migration.sha256);
  assert.equal(contract.baseline_migration.version, '0001');
  assert.equal(contract.baseline_migration.name, '0001_baseline.sql');
});

test('baseline contract contains the complete verified original table and column inventory', () => {
  const tables = Object.keys(contract.tables);
  const columns = Object.values(contract.tables).reduce((sum, table) => sum + Object.keys(table).length, 0);
  assert.equal(tables.length, contract.expected.baseline_table_count);
  assert.equal(columns, contract.expected.baseline_column_count);
  assert.equal(tables.length, 38);
  assert.equal(columns, 312);
  assert.deepEqual([...contract.expected.operational_tables].sort(), ['app_bootstrap', 'backup_log']);
  assert.equal(contract.expected.public_table_count, 40);
});

test('baseline contract pins the verified bootstrap marker and constraint/index inventory', () => {
  assert.equal(contract.original_schema.commit, '68753fb30524894e5098553ba18c1271cea9b954');
  assert.equal(contract.original_schema.bootstrap_checksum, 'e910acd83dc81786f370311f97e0d1e7aae6a3e6bc8a430188e49dc57cc1d7f6');
  assert.equal(contract.expected.explicit_indexes.length, 10);
  assert.deepEqual(contract.expected.constraint_counts, { c: 4, f: 76, n: 103, p: 38, u: 21 });
});

test('baseline contract identifies the precise pending migration objects', () => {
  assert.deepEqual(contract.expected.pending_tables, ['schema_migrations', 'school_events', 'rate_limit_counters']);
  assert.deepEqual(contract.expected.pending_audit_log_columns, ['actor_role', 'actor_school_code', 'actor_ip', 'request_id', 'user_agent', 'metadata', 'outcome', 'previous_hash', 'event_hash']);
  assert.equal(contract.expected.pending_audit_log_fk_to_drop, 'audit_log_actor_id_fkey');
  assert.equal(contract.expected.pending_indexes.length, 7);
  assert.deepEqual(contract.expected.pending_functions, ['audit_log_reject_mutation']);
  assert.equal(contract.expected.pending_triggers.length, 2);
  assert.deepEqual(contract.expected.pending_constraints, ['audit_log_outcome_check']);
});

test('every baseline column has a complete PostgreSQL catalog signature', () => {
  for (const [table, columns] of Object.entries(contract.tables)) {
    for (const [column, metadata] of Object.entries(columns)) {
      assert.ok(metadata.data_type, `${table}.${column} data_type`);
      assert.ok(metadata.udt_name, `${table}.${column} udt_name`);
      assert.ok(['YES', 'NO'].includes(metadata.is_nullable), `${table}.${column} nullability`);
      assert.equal(typeof metadata.has_default, 'boolean', `${table}.${column} default presence`);
    }
  }
});
