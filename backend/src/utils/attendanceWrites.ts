import type { PoolClient } from 'pg';
import { withTransaction } from '../db/pool.js';

export interface AttendanceWrite {
  student_id: string;
  days_present: number;
}

/** Thrown when a batch no longer fits the term's days_opened at write time. */
export class AttendanceTermLimitError extends Error {
  readonly statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AttendanceTermLimitError';
    this.statusCode = statusCode;
  }
}

/**
 * Share-lock the term row and re-check every value against its CURRENT
 * days_opened. PUT /academic/terms/:id takes FOR UPDATE on the same row before
 * it measures the highest recorded days_present, so a concurrent attendance
 * save and a days_opened reduction serialize: either the save commits first
 * (and the reduction sees it and is refused) or the reduction commits first
 * (and the save is refused here). Without this, the route-level validation
 * could pass against a days_opened that changes before the INSERT lands.
 */
async function assertWithinCurrentDaysOpened(
  client: PoolClient,
  entries: AttendanceWrite[],
  termId: number,
): Promise<void> {
  const { rows } = await client.query('SELECT days_opened FROM terms WHERE id=$1 FOR SHARE', [termId]);
  if (!rows[0]) throw new AttendanceTermLimitError('Term not found', 404);
  const daysOpened = rows[0].days_opened as number | null;
  if (daysOpened === null) return;
  for (const entry of entries) {
    if (entry.days_present > daysOpened) {
      throw new AttendanceTermLimitError(
        `days_present (${entry.days_present}) cannot exceed the term's days_opened (${daysOpened}) (student ${entry.student_id})`,
      );
    }
  }
}

/**
 * Persist a validated attendance batch atomically. Validation and permission
 * checks stay in the route; this boundary guarantees that a database failure
 * on any row rolls back every earlier upsert in the same request, and that the
 * batch is re-validated against days_opened under the term row lock.
 */
export async function saveAttendanceBulk(
  entries: AttendanceWrite[],
  termId: number,
): Promise<void> {
  await withTransaction(async (client) => {
    await assertWithinCurrentDaysOpened(client, entries, termId);
    for (const entry of entries) {
      await client.query(
        `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
         ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3`,
        [entry.student_id, termId, entry.days_present],
      );
    }
  });
}

/** Single-student upsert with the same term-row lock and re-validation. */
export async function saveAttendanceOne(
  entry: AttendanceWrite,
  termId: number,
): Promise<Record<string, unknown>> {
  return withTransaction(async (client) => {
    await assertWithinCurrentDaysOpened(client, [entry], termId);
    const { rows } = await client.query(
      `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
       ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3 RETURNING *`,
      [entry.student_id, termId, entry.days_present],
    );
    return rows[0];
  });
}
