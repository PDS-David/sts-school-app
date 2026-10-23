#!/usr/bin/env python3
"""S-PREP reference model of JSS3 supplement sequencing policies.

Pure Python model for review and for deriving later implementation tests. It
does NOT read or change any database, schema, route or student data. It
encodes, for one (school, class, term, subject) bucket:

  legacy  - today's rule: order_index chain; supplements appended after originals
  S1      - S1_SEQUENCE_DESIGN.md rule: placed supplements gate; only "self passed" exception
  N       - RECOMMENDED: placed supplements are optional (non-gating), plus a legacy floor
  G       - ALTERNATIVE: placed supplements gate, plus a persisted frontier snapshot

Run: python3 scripts/jss3/s_prep_sequence_policy_model.py   (exit 0 = all assertions hold)
"""
import itertools, random, sys

class Bucket:
    """originals O1..On (order_index 1..n); supplements: list of (name, anchor|None) in append order."""
    def __init__(self, n, sups):
        self.n = n
        self.sups = sups
        self.topics = [f"O{i}" for i in range(1, n + 1)] + [s for s, _ in sups]
        self.legacy = list(self.topics)            # order_index order
        self.anchor = dict(sups)
        # new display/sequence order: COALESCE(sequence_rank, order_index)
        rank, seen = {}, {}
        for i in range(1, n + 1): rank[f"O{i}"] = float(i)
        for idx, (s, k) in enumerate(sups):
            if k is None: rank[s] = float(n + 1 + idx)
            else:
                seen[k] = seen.get(k, 0) + 1
                rank[s] = k + seen[k] / 1000
        self.rank = rank
        self.seq = sorted(self.topics, key=lambda t: rank[t])
    def is_placed(self, t): return t.startswith("S") and self.anchor.get(t) is not None
    def core(self):  # originals + unplaced supplements, in order_index order
        return [t for t in self.legacy if not self.is_placed(t)]

def legacy_open(b, t, passed, pin):
    i = b.legacy.index(t)
    return pin if i == 0 else b.legacy[i - 1] in passed

def S1_open(b, t, passed, pin):
    i = b.seq.index(t)
    if i == 0: return pin
    return b.seq[i - 1] in passed or t in passed

def N_open(b, t, passed, pin):
    if legacy_open(b, t, passed, pin): return True          # legacy floor
    if b.is_placed(t): return f"O{b.anchor[t]}" in passed   # opens when its anchor original is passed
    c = b.core(); i = c.index(t)                              # originals + unplaced: chain without placed supplements
    return pin if i == 0 else c[i - 1] in passed

def snapshot(b, passed, pin):
    """Frontier snapshot taken at activation: every legacy-open, unpassed topic."""
    return {t for t in b.topics if t not in passed and legacy_open(b, t, passed, pin)}

def G_open(b, t, passed, pin, snap):
    return S1_open(b, t, passed, pin) or t in snap

def reachable_states(b):
    """Pass-sets reachable under legacy progression: a prefix of the legacy order."""
    return [set(b.legacy[:k]) for k in range(len(b.legacy) + 1)]

def show(b, passed, pin=True, snap=None):
    rows = []
    for t in b.seq:
        rows.append((t, "P" if t in passed else "-",
                     "open" if legacy_open(b, t, passed, pin) else "lock",
                     "open" if S1_open(b, t, passed, pin) else "lock",
                     "open" if N_open(b, t, passed, pin) else "lock",
                     "open" if G_open(b, t, passed, pin, snap if snap is not None else snapshot(b, passed, pin)) else "lock"))
    return rows

def main():
    b = Bucket(4, [("S1", 2), ("S2", 2), ("S3", None)])
    assert b.seq == ["O1", "O2", "S1", "S2", "O3", "O4", "S3"], b.seq
    out = []
    def case(name, passed, pin=True):
        out.append(f"\n{name}  passed={sorted(passed)} pin={pin}\n  topic pass legacy S1 N G")
        for r in show(b, set(passed), pin): out.append("  " + " ".join(f"{x:<5}" for x in r))
    # W1 fresh student
    case("W1 fresh, PIN redeemed", set())
    case("W1b fresh, no PIN", set(), pin=False)
    # W2 mid-term original frontier (the S1 omission)
    case("W2 returning: passed O1,O2; frontier O3", {"O1", "O2"})
    # W3 returning, passed through O3, frontier O4
    case("W3 returning: passed O1-O3; frontier O4", {"O1", "O2", "O3"})
    # W4 returning, all originals + S1 passed, frontier S2 (legacy tail)
    case("W4 returning: all originals and S1 passed", {"O1", "O2", "O3", "O4", "S1"})

    # --- assertions ---
    p = {"O1", "O2"}
    assert legacy_open(b, "O3", p, True)
    assert not S1_open(b, "O3", p, True), "S1 design re-locks the frontier (O3 behind unpassed S2)"
    assert N_open(b, "O3", p, True)
    assert G_open(b, "O3", p, True, snapshot(b, p, True))
    assert not G_open(b, "O3", p, True, set()), "G without snapshot loses the frontier"
    # fresh student under G: only S1 after O2; O3 stays locked behind S1,S2 for NEW progress
    fresh_after = {"O1", "O2"}
    assert not G_open(b, "O3", fresh_after, True, set()) and G_open(b, "S1", fresh_after, True, set())
    # first-topic identity and PIN
    assert b.seq[0] == "O1" and not N_open(b, "O1", set(), False) and N_open(b, "O1", set(), True)
    # N: placed supplement closed until anchor passed
    assert not N_open(b, "S1", {"O1"}, True) and N_open(b, "S1", {"O1", "O2"}, True)
    # failed predecessor (not passed) keeps next locked in every policy
    assert not N_open(b, "O3", {"O1"}, True) and not N_open(b, "O2", set(), True)

    # --- properties over every bucket shape (n<=5, up to 4 supps, any placement) ---
    checked = 0
    for n in range(1, 6):
        for m in range(0, 5):
            for anchors in itertools.product([None] + list(range(1, n + 1)), repeat=m):
                bb = Bucket(n, [(f"S{i+1}", a) for i, a in enumerate(anchors)])
                assert bb.seq[0] == "O1"
                # originals keep relative order
                ors = [t for t in bb.seq if t.startswith("O")]
                assert ors == [f"O{i}" for i in range(1, n + 1)]
                # placed supplement sits immediately after its anchor original or earlier same-anchor sibling
                for t in bb.topics:
                    if bb.is_placed(t):
                        assert bb.seq.index(t) > bb.seq.index(f"O{bb.anchor[t]}")
                        if bb.anchor[t] < n: assert bb.seq.index(t) < bb.seq.index(f"O{bb.anchor[t]+1}")
                for passed in reachable_states(bb):
                    snap = snapshot(bb, passed, True)
                    for t in bb.topics:
                        lo = legacy_open(bb, t, passed, True)
                        if lo or t in passed:
                            assert N_open(bb, t, passed, True), (n, anchors, sorted(passed), t)
                            assert G_open(bb, t, passed, True, snap), (n, anchors, sorted(passed), t)
                    checked += 1
    # S1 counterexample exists
    cx = None
    for n in range(1, 6):
        for anchors in itertools.product(range(1, n + 1), repeat=1):
            bb = Bucket(n, [("S1", anchors[0])])
            for passed in reachable_states(bb):
                for t in bb.topics:
                    if legacy_open(bb, t, passed, True) and t not in passed and not S1_open(bb, t, passed, True):
                        cx = cx or (n, anchors, sorted(passed), t)
    assert cx, "expected an S1 frontier regression"
    out.append(f"\nProperty check: {checked} (bucket-shape, reachable-state) pairs; N and G never re-lock a legacy-open or passed topic.")
    out.append(f"S1-design counterexample (n, anchors, passed, re-locked topic): {cx}")
    print("\n".join(out)); print("\nALL MODEL ASSERTIONS PASSED")

if __name__ == "__main__":
    sys.exit(main())
