import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRouter        from './routes/auth.js';
import studentsRouter    from './routes/students.js';
import scoresRouter      from './routes/scores.js';
import attendanceRouter  from './routes/attendance.js';
import academicRouter    from './routes/academic.js';
import messagesRouter    from './routes/messages.js';
import weeklyRouter      from './routes/weeklyEfforts.js';
import learningRouter    from './routes/learning.js';
import adminRouter       from './routes/admin.js';
import financeRouter     from './routes/finance.js';
import aiRouter          from './routes/ai.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

// Rate limiting on auth routes
app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));

// Routes
app.get('/', (_req, res) => res.json({
  status: 'ok',
  app: 'Sow the Seed School API',
  version: '1.0.0',
}));

app.use('/auth',           authRouter);
app.use('/students',       studentsRouter);
app.use('/scores',         scoresRouter);
app.use('/attendance',     attendanceRouter);
app.use('/academic',       academicRouter);
app.use('/messages',       messagesRouter);
app.use('/weekly-efforts', weeklyRouter);
app.use('/learning',       learningRouter);
app.use('/admin',          adminRouter);
app.use('/finance',        financeRouter);
app.use('/ai',              aiRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // express.json() throws a SyntaxError (with a `status`/`body` marker) when the
  // request body isn't valid JSON. That's a client mistake, not a server fault —
  // report it as 400, and skip the console.error noise for this expected case.
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }

  // Postgres constraint violations (via the `pg` driver, which attaches a
  // `code` field per https://www.postgresql.org/docs/current/errcodes-appendix.html).
  // Found in QA Pass 2: these were falling through to a bare "Internal server
  // error" 500 — e.g. a duplicate admission number, or deleting a teacher who
  // has already entered scores/attendance (blocked by FK RESTRICT so the
  // history stays attributable). Neither is a server bug, both are ordinary
  // things an admin will hit, so they get a real 409 with an actionable
  // message instead of a generic crash-shaped error.
  if (err?.code === '23505') { // unique_violation
    const field = /Key \(([^)]+)\)/.exec(err.detail ?? '')?.[1] ?? 'value';
    return res.status(409).json({ error: `That ${field.replace(/_/g, ' ')} is already in use.` });
  }
  if (err?.code === '23503') { // foreign_key_violation
    // Found in QA Pass 8: this used to assume every FK violation was a blocked
    // DELETE (a row can't be removed because something still points at it),
    // but the same Postgres error code also fires on INSERT/UPDATE when the
    // new row points at a parent that doesn't exist — e.g. POST
    // /admin/finance/invoices with a student_id that isn't real. That case
    // was live-verified returning a nonsensical "This can't be deleted..."
    // message for a create request. Postgres phrases the two cases
    // differently in `detail` ("is not present in table" vs "is still
    // referenced from table"), so branch on that instead of assuming.
    const detail = err.detail ?? '';
    if (detail.includes('is not present in table')) {
      const field = /Key \(([^)]+)\)=\(([^)]*)\)/.exec(detail);
      const refTable = err.table ?? 'the related record';
      return res.status(400).json({
        error: field
          ? `${field[1].replace(/_/g, ' ')} "${field[2]}" doesn't match an existing record.`
          : `That reference doesn't match an existing record (in "${refTable}").`,
      });
    }
    const refTable = err.table ?? 'another record';
    return res.status(409).json({
      error: `This can't be deleted because it still has related records (in "${refTable}"). ` +
             `Deactivate it instead, or remove the related records first.`,
    });
  }
  if (err?.code === '23502') { // not_null_violation
    return res.status(400).json({ error: `Missing required field: ${err.column ?? 'unknown'}.` });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Defense-in-depth: catch anything outside Express's request cycle (e.g. a
// background email send in utils/email.ts) so a single bad promise can't
// take the whole API down for every school. Express route handlers are
// already covered by 'express-async-errors' above — this is a last resort.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection (server staying up):', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception (server staying up):', err);
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`🏫 STS School API running on http://localhost:${port}`);
});
