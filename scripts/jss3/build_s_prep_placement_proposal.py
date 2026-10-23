#!/usr/bin/env python3
"""S-PREP: build PLACEMENT_PROPOSAL.csv from repository files only (no private archive, no DB).

Inputs (all in Git): backend/src/db/data/jss3Supplements.json, docs/jss3/replacements/
TEACHER_SCHEDULE_SUPPLEMENTS.csv, IMPLEMENTED_LESSONS.csv, SEMANTIC_DECISIONS.csv, WIDER_WORKSTREAMS.csv.
Output: one row per supplement id. Proposed anchors are PROPOSALS: owner_approval_* columns stay empty.
Scheme week / list-item numbers are never used as order_index values.
"""
import csv, json, re, sys, collections, hashlib, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
R = ROOT / "docs/jss3/replacements"
OUT = ROOT / "docs/jss3/completion/S_PREP/PLACEMENT_PROPOSAL.csv"
num = lambda c: int(re.search(r"\d+", c).group())
ABBR = {"HE": "Home Economics", "BT": "Basic Technology", "English": "English Language", "Agricultural Science": "Agricultural Science"}

sup_json = json.load(open(ROOT / "backend/src/db/data/jss3Supplements.json"))
sch = list(csv.DictReader(open(R / "TEACHER_SCHEDULE_SUPPLEMENTS.csv")))
imp = {r["id"]: r for r in csv.DictReader(open(R / "IMPLEMENTED_LESSONS.csv"))}
sem = list(csv.DictReader(open(R / "SEMANTIC_DECISIONS.csv")))
wid = list(csv.DictReader(open(R / "WIDER_WORKSTREAMS.csv")))
all_ids = {x["id"] for x in sup_json}
assert all_ids == {r["supplement_id"] for r in sch} == set(imp), "inventories disagree"
assert len(all_ids) == len(sup_json)
info = {r["supplement_id"]: r for r in sch}

# current counts (derived, not historical pins)
orig_count = {}; sup_count = collections.Counter(); bucket_sups = collections.defaultdict(list)
for r in sch:
    b = (r["subject"], r["term"]); n = int(r["appended_after_originals"])
    assert orig_count.setdefault(b, n) == n
    sup_count[b] += 1; bucket_sups[b].append(r)
for b, rows in bucket_sups.items():  # appended order_index must be n+1..n+m, contiguous
    idxs = sorted(int(x["app_order_index_append"]) for x in rows)
    assert idxs == list(range(orig_count[b] + 1, orig_count[b] + 1 + len(rows))), b
    for x in rows: assert int(imp[x["supplement_id"]]["order_index"]) == int(x["app_order_index_append"])

# scheme link ids per supplement
sl = collections.defaultdict(set)
for r in sem:
    if r["row_filter"].startswith("SUP-"): sl[r["row_filter"]].add(num(r["candidate_id"]))
for r in wid:
    for m in re.finditer(r"SL-(\d+)", r["locator"]): sl[r["supplement_id"]].add(int(m.group(1)))
    m = re.match(r"WG-[A-Z0-9]+-SL(\d+)", r["id"])
    if m: sl[r["supplement_id"]].add(int(m.group(1)))
# originals mapped by SEMANTIC_DECISIONS (scheme item -> original row)
orig_map = collections.defaultdict(list); sl_buckets = collections.defaultdict(set)
for r in sem:
    if r["support_kind"] == "original":
        subj, term, idx = r["row_filter"].split("|")
        orig_map[(subj, term)].append((num(r["candidate_id"]), int(idx), r["anchor_regex"]))
        sl_buckets[num(r["candidate_id"])].add((subj, term))
for sid, s in sl.items():
    if sid in info: [sl_buckets[i].add((info[sid]["subject"], info[sid]["term"])) for i in s]
ambiguous_sl = {i for i, v in sl_buckets.items() if len(v) > 1}
monotone = {}
for b, v in orig_map.items():
    v.sort(); idx = [i for _, i, _ in v]; monotone[b] = idx == sorted(idx)
# originals named in WIDER_WORKSTREAMS locators ("original 1st Term HE #9")
named = collections.defaultdict(list)
for r in wid:
    for m in re.finditer(r"original (1st|2nd) Term ([A-Za-z ]+?) #(\d+)", r["locator"]):
        named[r["supplement_id"]].append((m.group(1) + " Term", ABBR.get(m.group(2).strip(), m.group(2).strip()), int(m.group(3)), r["id"]))

for r in wid:  # "original executable Agricultural Science First Term #7"
    for m in re.finditer(r"original executable ([A-Za-z ]+?) (First|Second) Term #(\d+)", r["locator"]):
        named[r["supplement_id"]].append(({"First": "1st", "Second": "2nd"}[m.group(2)] + " Term", m.group(1).strip(), int(m.group(3)), r["id"] + " (executable-row wording)"))
rows = []
for r in sch:
    sid = r["supplement_id"]; b = (r["subject"], r["term"]); n = orig_count[b]
    kind = r["anchor_kind"]; anchor_num = r["scheme_week_anchor"]
    num_gt = "Y" if anchor_num and int(anchor_num) > n else "N"
    ids_ = sorted(i for i in sl.get(sid, set()) if i not in ambiguous_sl)
    lo, hi, proposed, conf, ev, etype, hint = 1, n, "UNRESOLVED", "NONE", "", "NONE", ""
    notes = []
    nm = [x for x in named.get(sid, []) if x[0] == r["term"] and x[1] == r["subject"]]
    ov = [(s, i, t) for s, i, t in orig_map[b] if s in ids_]
    if nm and len({x[2] for x in nm}) == 1:
        proposed = nm[0][2]; lo = hi = proposed; conf = "LOW" if "executable-row" in nm[0][3] else "MEDIUM"; etype = "NAMED_ORIGINAL"
        ev = f"WIDER_WORKSTREAMS {nm[0][3]} names original {r['term']} {r['subject']} #{proposed} as the row this supplement completes"
        notes.append("title not recorded in Git; verify against capture")
    elif ov and len({i for _, i, _ in ov}) == 1:
        proposed = ov[0][1]; lo = hi = proposed; conf = "MEDIUM"; etype = "SHARED_SCHEME_ITEM"
        ev = f"scheme item SL-{ov[0][0]:03d} maps to original #{proposed} in SEMANTIC_DECISIONS and to this supplement"; hint = ov[0][2]
    elif not ids_:
        etype = "NONE"; ev = "no scheme item linked to this supplement in Git; no original named"
    else:
        a = [(s, i, t) for s, i, t in orig_map[b] if s < min(ids_)]; c = [(s, i, t) for s, i, t in orig_map[b] if s > max(ids_)]
        a = a[-1] if a else None; c = c[0] if c else None
        # a bound is only trusted if no scheme item of another subject/term lies between it and the supplement
        foreign = lambda x, y: any(x < k < y and b not in v for k, v in sl_buckets.items())
        if a and foreign(a[0], min(ids_)): notes.append(f"preceding bound SL-{a[0]:03d} rejected: other-bucket scheme items intervene"); a = None
        if c and foreign(max(ids_), c[0]): notes.append(f"following bound SL-{c[0]:03d} rejected: other-bucket scheme items intervene"); c = None
        if not monotone.get(b, True) and (a or c):
            etype = "SCHEME_ORDER_UNRELIABLE"; ev = f"scheme order is not monotone against original order for this bucket; scheme items {ids_}"
            notes.append("bucket scheme order disagrees with original order in SEMANTIC_DECISIONS")
        elif a or c:
            lo = a[1] if a else 1; hi = max(lo, (c[1] - 1) if c else n); hint = a[2] if a else ""
            ev = (f"scheme items {ids_}; preceding mapped original SL-{a[0]:03d}=#{a[1]}" if a else f"scheme items {ids_}; no preceding mapped original") + \
                 (f"; following mapped original SL-{c[0]:03d}=#{c[1]}" if c else "; no following mapped original")
            etype = "SCHEME_ORDER_BRACKET"
            if a and (lo == hi):
                proposed = lo; conf = "MEDIUM"
            elif a and hi - lo <= 2:
                proposed = lo; conf = "LOW"; notes.append(f"repo range #{lo}..#{hi}; lower bound proposed; originals #{lo+1}..#{hi} unverified")
            elif a:
                notes.append(f"repo range #{lo}..#{hi} too wide to propose one anchor; lower bound #{lo} is repository-supported, upper end is not")
            else:
                notes.append("upper bound only; lower end of range unsupported")
        else:
            etype = "NONE"; ev = f"scheme items {ids_} but no original in this bucket is mapped in Git"
    if proposed == "UNRESOLVED": lo_s, hi_s = (lo if etype in ("SCHEME_ORDER_BRACKET",) else ""), (hi if etype in ("SCHEME_ORDER_BRACKET",) else "")
    else: lo_s, hi_s = lo, hi
    if num_gt == "Y": notes.append(f"scheme {kind.replace('_', ' ')} {anchor_num} exceeds the {n} originals: it is NOT an order_index")
    rows.append(dict(
        supplement_id=sid, class_name="JSS 3", subject=r["subject"], term=r["term"], title=imp[sid]["title"],
        current_order_index=int(r["app_order_index_append"]), current_original_count=n, current_supplement_count=sup_count[b], current_bucket_total=n + sup_count[b],
        schedule_anchor_kind=kind or "none", schedule_anchor_number=anchor_num, schedule_number_exceeds_original_count=num_gt,
        scheme_item_ids=" ".join(f"SL-{i:03d}" for i in ids_),
        repo_bound_low=lo_s, repo_bound_high=hi_s,
        proposed_after_original_index=proposed, proposed_anchor_title_hint=hint,
        evidence_type=etype, evidence_detail=ev, confidence=conf,
        proposed_status="PROPOSED" if proposed != "UNRESOLVED" else "UNRESOLVED",
        verified_against_private_archive="NO", notes="; ".join(notes),
        owner_approval_status="NOT_APPROVED", approved_after_original_index="", approved_by="", approved_at=""))
rows.sort(key=lambda x: (x["subject"], x["term"], x["current_order_index"]))
cols = list(rows[0].keys())
OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols, lineterminator="\n"); w.writeheader(); w.writerows(rows)
c = collections.Counter(x["proposed_status"] + "/" + x["confidence"] for x in rows)
print(len(rows), dict(c), "anchor-number>originals:", sum(x["schedule_number_exceeds_original_count"] == "Y" for x in rows))
print("sha256", hashlib.sha256(open(OUT, "rb").read()).hexdigest())
