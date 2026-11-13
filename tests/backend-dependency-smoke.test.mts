import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import test from 'node:test';
import * as XLSX from 'xlsx';
import { z } from 'zod';

test('Multer 2 accepts a bounded multipart upload in memory storage', async () => {
  const app = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024, files: 1 },
  });
  app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
      originalname: req.file?.originalname,
      size: req.file?.size,
      content: req.file?.buffer.toString('utf8'),
    });
  });

  const server: Server = app.listen(0, '127.0.0.1');
  try {
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const form = new FormData();
    form.append('file', new Blob(['upload-check'], { type: 'text/plain' }), 'check.txt');
    const response = await fetch(`http://127.0.0.1:${address.port}/upload`, {
      method: 'POST',
      body: form,
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      originalname: 'check.txt',
      size: 11,
      content: 'upload-check',
    });
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('SheetJS 0.20.3 round-trips a generated workbook', () => {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([['value'], ['round-trip-ok']]);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
  const bytes = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const parsed = XLSX.read(bytes, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(parsed.Sheets.Sheet1, { header: 1 }) as unknown[][];
  assert.equal(rows[1][0], 'round-trip-ok');
});

test('Nodemailer 10 JSON transport can compose and send a message', async () => {
  const transporter = nodemailer.createTransport({ jsonTransport: true });
  const info = await transporter.sendMail({
    from: 'sender@example.test',
    to: 'recipient@example.test',
    subject: 'Dependency smoke test',
    text: 'transport-ok',
  });
  assert.ok(info.message);
  assert.match(String(info.message), /transport-ok/);
});

test('Zod 4 validates the backend schema contract', () => {
  const schema = z.object({ name: z.string().min(1), count: z.number().int().nonnegative() });
  assert.equal(schema.safeParse({ name: 'valid', count: 2 }).success, true);
  assert.equal(schema.safeParse({ name: '', count: -1 }).success, false);
});
