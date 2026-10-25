/**
 * Shared lesson-sequence and unlock resolver (Task 05, owner-recorded policy D1–D5).
 * Used by BOTH `GET /learning/topics` (display + `locked`) and `POST /learning/topics/:id/complete`
 * (direct-access enforcement) so the two can never disagree.
 *
 * Policy (docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md §2):
 *  D1 non-gating: a placed supplement (sequence_rank NOT NULL) is displayed between its anchor and the next
 *     original but later originals do NOT wait for it. Originals (and unplaced supplements) form the
 *     "chain": the first chain topic needs the term PIN (when enforced); each later chain topic opens when
 *     the previous CHAIN topic is passed. A placed supplement opens when its anchor original is passed.
 *  D2 legacy floor: a topic is also open if today's pure order_index rule would open it, so a passed topic
 *     or an already-open unpassed frontier is never re-locked, whatever the student's state.
 *  D3 the first topic by order_index stays first (position 1, PIN anchor): placement requires anchor >= 1.
 *  D4 unplaced topics keep rank NULL and stay in the legacy tail chain.
 * With no ranks stored the result is identical to the pre-Task-05 behaviour.
 */
export interface SeqTopic {
  id: number;
  order_index: number | null;
  sequence_rank?: string | number | null;
}
export interface SeqResult { locked: boolean; sequence_position: number | null; is_sequence_first: boolean }

const rankOf = (t: SeqTopic): number | null => (t.sequence_rank == null ? null : Number(t.sequence_rank));
export const effectiveSequence = (t: SeqTopic): number | null => rankOf(t) ?? t.order_index;

/** Display order for one (subject, class, term) group: effective sequence, ties by order_index then id. */
export function orderSequenceGroup<T extends SeqTopic>(group: readonly T[]): T[] {
  return [...group].sort((a, b) =>
    (effectiveSequence(a)! - effectiveSequence(b)!) || ((a.order_index ?? 0) - (b.order_index ?? 0)) || (a.id - b.id));
}

/**
 * `group` = every topic of ONE (subject_id, class_name, term_label) with order_index NOT NULL.
 * `passed` = ids the student has passed. `pinOk` = true when the term PIN is redeemed OR enforcement is off.
 */
export function resolveSequenceGroup(group: readonly SeqTopic[], passed: ReadonlySet<number>, pinOk: boolean): Map<number, SeqResult> {
  const out = new Map<number, SeqResult>();
  const legacy = [...group].sort((a, b) => a.order_index! - b.order_index!);
  const legacyOpen = new Set<number>();
  legacy.forEach((t, i) => { if (i === 0 ? pinOk : passed.has(legacy[i - 1].id)) legacyOpen.add(t.id); });

  const chain = legacy.filter(t => rankOf(t) == null);
  const chainOpen = new Set<number>();
  chain.forEach((t, i) => { if (i === 0 ? pinOk : passed.has(chain[i - 1].id)) chainOpen.add(t.id); });
  const chainByIndex = new Map(chain.map(t => [t.order_index!, t]));

  const display = orderSequenceGroup(group);
  display.forEach((t, i) => {
    const rank = rankOf(t);
    let open = legacyOpen.has(t.id);                    // D2 legacy floor
    if (rank == null) open ||= chainOpen.has(t.id);    // original / unplaced supplement
    else {
      const anchor = chainByIndex.get(Math.floor(rank)); // placed: opens when its anchor original is passed
      if (anchor && passed.has(anchor.id)) open = true;
    }
    out.set(t.id, { locked: !open, sequence_position: i + 1, is_sequence_first: i === 0 });
  });
  return out;
}

export const groupKey = (t: { subject_id: unknown; class_name: unknown; term_label: unknown }) =>
  `${t.subject_id}|${t.class_name}|${t.term_label}`;
