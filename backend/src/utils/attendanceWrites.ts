import { withTransaction } from '../db/pool.js';

export interface AttendanceWrite {
  student_id: string;
  days_present: number;
}

/**
 * Persist a validated attendance batch atomically. Validation and permission
 * checks stay in the route; this boundary guarantees that a database failure
 * on any row rolls back every earlier upsert in the same request.
 */
export async function saveAttendanceBulk(
  entries: AttendanceWrite[],
  termId: number,
): Promise<void> {
  await withTransaction(async (client) => {
    for (const entry of entries) {
      await client.query(
        `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
         ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3`,
        [entry.student_id, termId, entry.days_present],
      );
    }
  });
}
