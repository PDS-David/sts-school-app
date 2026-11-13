import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import { activateAccount, resetPasswordWithSecurityAnswer } from '../backend/src/utils/credentialAttempts.ts';
import authRouter from '../backend/src/routes/auth.js';

const suffix = () => randomInt(100_000_000, 999_999_999).toString();
const username = (label: string) => `bsec10-${label}-${suffix()}`;

after(async () => {
  await pool.end();
});

async function createActivationUser(uname: string): Promise<string> {
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,activation_code,
                        activation_fail_count,activation_locked_until)
     VALUES($1,NULL,'teacher','BSEC10 Activation','primary','correct-code',0,NULL)
     RETURNING id`,
    [uname],
  );
  return String(rows[0].id);
}

async function createRecoveryUser(uname: string): Promise<string> {
  const answerHash = await bcrypt.hash('blue', 4);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,security_question,
                        security_answer_hash,must_set_security_question,
                        security_answer_fail_count,security_answer_locked_until)
     VALUES($1,'existing-password-hash','student','BSEC10 Recovery','primary','Favourite colour?',
            $2,FALSE,0,NULL)
     RETURNING id`,
    [uname, answerHash],
  );
  return String(rows[0].id);
}

async function cleanUser(uname: string, id: string): Promise<void> {
  await query(
    `DELETE FROM audit_log WHERE entity='user' AND entity_id=$1
       AND action IN ('activation_failed','activation_success','forgot_password_failed','forgot_password_reset','login')`,
    [id],
  );
  await query('DELETE FROM users WHERE username=$1', [uname]);
}

async function createLoginUser(uname: string): Promise<string> {
  const passwordHash = await bcrypt.hash('CorrectPassword123', 4);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,$2,'student','BSEC10 Login','primary',TRUE,FALSE) RETURNING id`,
    [uname, passwordHash],
  );
  return String(rows[0].id);
}

async function startAuthServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/auth` };
}

async function closeAuthServer(server: Server): Promise<void> {
  server.closeAllConnections();
  await new Promise<void>(resolve => server.close(() => resolve()));
}

test('failed login attempts are capped per normalized username without sharing another account quota', async () => {
  const userA = username('login-a');
  const userB = username('login-b');
  let idA: string | undefined;
  let idB: string | undefined;
  let server: Server | undefined;

  try {
    idA = await createLoginUser(userA);
    idB = await createLoginUser(userB);
    const started = await startAuthServer();
    server = started.server;

    const attempt = (uname: string, password: string) => fetch(`${started.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: uname, password }),
    });

    for (let i = 0; i < 10; i++) {
      const response = await attempt(userA.toUpperCase(), 'WrongPassword123');
      assert.equal(response.status, 401, `failed attempt ${i + 1} should reach credential verification`);
    }
    const blocked = await attempt(userA, 'WrongPassword123');
    assert.equal(blocked.status, 429);

    const otherAccount = await attempt(userB, 'WrongPassword123');
    assert.equal(otherAccount.status, 401, 'another account must have an independent login quota');
  } finally {
    if (server) await closeAuthServer(server);
    if (idA) await cleanUser(userA, idA);
    if (idB) await cleanUser(userB, idB);
  }
});

test('successful login does not consume the failed-attempt quota', async () => {
  const uname = username('login-success');
  let userId: string | undefined;
  let server: Server | undefined;

  try {
    userId = await createLoginUser(uname);
    const started = await startAuthServer();
    server = started.server;

    const attempt = (password: string) => fetch(`${started.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: uname, password }),
    });

    for (let i = 0; i < 9; i++) {
      assert.equal((await attempt('WrongPassword123')).status, 401);
    }
    assert.equal((await attempt('CorrectPassword123')).status, 200);
    assert.equal((await attempt('WrongPassword123')).status, 401, 'the tenth failed attempt should still be allowed');
    assert.equal((await attempt('WrongPassword123')).status, 429, 'the eleventh failed attempt should be blocked');
  } finally {
    if (server) await closeAuthServer(server);
    if (userId) await cleanUser(uname, userId);
  }
});

test('concurrent wrong activation codes cannot lose failed-attempt increments', async () => {
  const uname = username('activation-lockout');
  let userId: string | undefined;

  try {
    userId = await createActivationUser(uname);
    const results = await Promise.all(Array.from({ length: 6 }, () =>
      activateAccount(uname, 'wrong-code', 'NewPassword123'),
    ));

    assert.equal(results.filter(result => result.kind === 'invalid').length, 5);
    assert.equal(results.filter(result => result.kind === 'locked').length, 1);

    const { rows } = await query(
      'SELECT activation_fail_count, activation_locked_until FROM users WHERE id=$1',
      [userId],
    );
    assert.equal(rows[0].activation_fail_count, 0);
    assert.ok(new Date(rows[0].activation_locked_until).getTime() > Date.now());
  } finally {
    if (userId) await cleanUser(uname, userId);
  }
});

test('a one-time activation code can be consumed by only one concurrent request', async () => {
  const uname = username('activation-consume');
  let userId: string | undefined;

  try {
    userId = await createActivationUser(uname);
    const results = await Promise.all([
      activateAccount(uname, 'correct-code', 'FirstPassword123'),
      activateAccount(uname, 'correct-code', 'SecondPassword123'),
    ]);

    assert.equal(results.filter(result => result.kind === 'activated').length, 1);
    assert.equal(results.filter(result => result.kind === 'invalid').length, 1);

    const { rows } = await query(
      'SELECT password_hash, activation_code, activation_fail_count FROM users WHERE id=$1',
      [userId],
    );
    assert.ok(rows[0].password_hash);
    assert.equal(rows[0].activation_code, null);
    assert.equal(rows[0].activation_fail_count, 0);
  } finally {
    if (userId) await cleanUser(uname, userId);
  }
});

test('concurrent wrong recovery answers cannot bypass the per-account lockout', async () => {
  const uname = username('recovery-lockout');
  let userId: string | undefined;

  try {
    userId = await createRecoveryUser(uname);
    const results = await Promise.all(Array.from({ length: 6 }, () =>
      resetPasswordWithSecurityAnswer(uname, 'incorrect', 'NewPassword123'),
    ));

    assert.equal(results.filter(result => result.kind === 'invalid').length, 5);
    assert.equal(results.filter(result => result.kind === 'locked').length, 1);

    const { rows } = await query(
      'SELECT security_answer_fail_count, security_answer_locked_until FROM users WHERE id=$1',
      [userId],
    );
    assert.equal(rows[0].security_answer_fail_count, 0);
    assert.ok(new Date(rows[0].security_answer_locked_until).getTime() > Date.now());
  } finally {
    if (userId) await cleanUser(uname, userId);
  }
});

test('a correct recovery answer resets the password and clears the lockout state atomically', async () => {
  const uname = username('recovery-success');
  let userId: string | undefined;

  try {
    userId = await createRecoveryUser(uname);
    await query(
      `UPDATE users SET security_answer_fail_count=4,
         security_answer_locked_until=NULL WHERE id=$1`,
      [userId],
    );

    const result = await resetPasswordWithSecurityAnswer(uname, 'BLUE', 'RecoveredPassword123');
    assert.deepEqual(result, { kind: 'reset' });

    const { rows } = await query(
      `SELECT password_hash,must_change_pw,security_answer_fail_count,security_answer_locked_until
       FROM users WHERE id=$1`,
      [userId],
    );
    assert.notEqual(rows[0].password_hash, 'existing-password-hash');
    assert.equal(rows[0].must_change_pw, false);
    assert.equal(rows[0].security_answer_fail_count, 0);
    assert.equal(rows[0].security_answer_locked_until, null);
  } finally {
    if (userId) await cleanUser(uname, userId);
  }
});
