const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

// Issue #955 Stage 1: the production database URL must only be readable from two
// dedicated GitHub environments. These checks read the workflow files as text and
// never touch the secret value or any database.
const workflowsDir = join(__dirname, '../.github/workflows');
const BACKUP_FILE = 'render-postgres-backup.yml';
const MIGRATION_FILE = 'production-db-migrations.yml';
const SECRET_NAME = 'RENDER_POSTGRES_EXTERNAL_URL';

const read = (file) => readFileSync(join(workflowsDir, file), 'utf8');

// Returns the text of one top-level job (2-space-indented key under `jobs:`).
function jobBlock(workflow, jobName) {
  const lines = workflow.split('\n');
  const start = lines.findIndex((line) => line === `  ${jobName}:`);
  assert.ok(start >= 0, `job "${jobName}" not found`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^ {2}[A-Za-z0-9_-]+:\s*$/.test(lines[i]) || /^\S/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

// Returns the event names listed under the top-level `on:` key.
function triggerEvents(workflow) {
  const lines = workflow.split('\n');
  const start = lines.findIndex((line) => /^on:\s*$/.test(line));
  assert.ok(start >= 0, 'top-level "on:" block not found');
  const events = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^\S/.test(lines[i])) break;
    const match = /^ {2}([A-Za-z_]+):/.exec(lines[i]);
    if (match) events.push(match[1]);
  }
  return events;
}

test('backup workflow reads the database URL from the database-backup environment', () => {
  const job = jobBlock(read(BACKUP_FILE), 'backup');
  assert.match(job, /^ {4}environment: database-backup\s*$/m);
});

test('migration workflow reads the database URL from the production environment', () => {
  const job = jobBlock(read(MIGRATION_FILE), 'production-migration');
  assert.match(job, /^ {4}environment: production\s*$/m);
});

test('backup workflow keeps its daily schedule, manual trigger and master push trigger', () => {
  const workflow = read(BACKUP_FILE);
  assert.match(workflow, /^ {2}schedule:\s*\n {4}- cron: "20 2 \* \* \*"\s*$/m);
  assert.ok(triggerEvents(workflow).includes('workflow_dispatch'));
  assert.match(workflow, /^ {2}push:\s*\n {4}branches: \[master\]/m);
});

test('migration workflow stays manual-only', () => {
  assert.deepEqual(triggerEvents(read(MIGRATION_FILE)), ['workflow_dispatch']);
});

test('only the backup and migration workflows reference the production database URL secret', () => {
  const referencing = readdirSync(workflowsDir)
    .filter((file) => /\.ya?ml$/.test(file))
    .filter((file) => read(file).includes(SECRET_NAME))
    .sort();
  assert.deepEqual(referencing, [MIGRATION_FILE, BACKUP_FILE].sort());
});
