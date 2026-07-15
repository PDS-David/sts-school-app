import { query } from '../db/pool.js';
import type { AuthUser } from '../types/index.js';

export async function audit(
  actor: AuthUser | null,
  action: string,
  entity: string,
  entityId?: string,
  detail?: string,
) {
  try {
    await query(
      `INSERT INTO audit_log(actor_id, actor_name, action, entity, entity_id, school_code, detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        actor?.id ?? null,
        actor?.username ?? 'system',
        action,
        entity,
        entityId ?? null,
        actor?.school_code ?? null,
        detail ?? null,
      ],
    );
  } catch {
    // Audit failures must never break the main flow
  }
}
