import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import test from 'node:test';

interface ChildResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
}

function runFatalChild(trigger: 'rejection' | 'exception'): Promise<ChildResult> {
  const triggerCode = trigger === 'rejection'
    ? "Promise.reject(new Error('simulated unhandled rejection'));"
    : "setImmediate(() => { throw new Error('simulated uncaught exception'); });";
  const source = `
    import { createServer } from 'node:http';
    import { installFatalProcessHandlers } from './backend/src/utils/fatalProcessHandlers.ts';

    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      installFatalProcessHandlers(server, async () => {
        process.stdout.write('shutdown-complete');
      });
      ${triggerCode}
    });
  `;

  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', '--input-type=module', '-e', source],
      { cwd: process.cwd(), env: { ...process.env, NODE_ENV: 'test' } },
    );
    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => child.kill('SIGKILL'), 15_000);
    timeout.unref();

    child.stdout.setEncoding('utf8').on('data', (chunk: string) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk: string) => { stderr += chunk; });
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('close', (code, signal) => {
      clearTimeout(timeout);
      resolve({ code, signal, stdout, stderr });
    });
  });
}

test('an unhandled rejection drains the HTTP server and exits with code 1', async () => {
  const result = await runFatalChild('rejection');
  assert.equal(result.signal, null);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /unhandledRejection/);
  assert.match(result.stdout, /shutdown-complete/);
});

test('an uncaught exception drains the HTTP server and exits with code 1', async () => {
  const result = await runFatalChild('exception');
  assert.equal(result.signal, null);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /uncaughtException/);
  assert.match(result.stdout, /shutdown-complete/);
});
