"""Generic SS1 subject-package builder. Verifies header/anchor uniqueness against the real extracted text."""
import json, os
from lib import *
REG = json.load(open('/home/claude/work/reg.json'))
OUT = '/home/claude/sts-school-app/backend/src/db/ss1/subjects'
def once(text, s, what):
    n = text.count(s); assert n == 1, f'{what}: anchor occurs {n}x: {s[:70]!r}'
def src_entry(sid, canonical, header_text, locator, explanation):
    r = REG[sid]; once(TEXT(sid), header_text, sid + ' header')
    return {"source_id": sid, "sha256": r['sha256'], "archive_member": r['archive_member'], "class_name": "SS 1", "term": r['term_from_folder'],
            "canonical_subject": canonical, "header_text": header_text, "header_evidence": {"locator": locator, "explanation": explanation}}
def alias_rule(sid, rid, canonical, header_text, approval_ref, locator, explanation):
    return {"id": rid, "op": "source_alias", "source_id": sid, "source_sha256": REG[sid]['sha256'], "anchor": header_text,
            "observed_subject": header_text, "canonical_subject": canonical, "approval_reference": approval_ref,
            "evidence": {"locator": locator, "explanation": explanation}}
def marker_rule(sid, rid, kind, anchor, locator, explanation):
    t = TEXT(sid); once(t, anchor, rid)
    if kind != 'SCHEME_ONLY':
        holders = [r for r in ROWS[sid] if True]
    return {"id": rid, "op": "classify_marker", "source_id": sid, "source_sha256": REG[sid]['sha256'], "anchor": anchor, "kind": kind,
            "evidence": {"locator": locator, "explanation": explanation}}
def split_rule(sid, rid, week, anchor, locator, explanation):
    once(TEXT(sid), anchor, rid)
    return {"id": rid, "op": "split_before", "source_id": sid, "source_sha256": REG[sid]['sha256'], "anchor": anchor, "week_label": week,
            "evidence": {"locator": locator, "explanation": explanation}}
def cov(cid, sid, objective, loc, status, lesson_ids, evidence):
    return {"id": cid, "source_id": sid, "objective": objective, "objective_locator": loc, "status": status, "lesson_ids": lesson_ids,
            "evidence": [{"locator": a, "explanation": b} for a, b in evidence]}
def open_item(iid, kind, detail, action, affected, blocks=True):
    return {"id": iid, "kind": kind, "detail": detail, "required_action": action, "affected_ids": affected, "blocks_delivery": blocks}
def write(slug, canonical, sources, rules, lessons, corrections, assets, coverage, items):
    pkg = {"schema_version": "ss1-subject-v1", "subject_slug": slug, "canonical_subject": canonical, "package_status": "PENDING",
           "sources": sources, "source_rules": rules, "lessons": lessons, "delivery_corrections": corrections, "assets": assets,
           "coverage": coverage, "open_items": items}
    # authoring self-checks (not the repo's zod/compiler; those are deferred)
    ids = [l['id'] for l in lessons]; assert len(ids) == len(set(ids))
    for l in lessons: assert l['body_sha256'] == SHA(l['body'])
    assert len({r['id'] for r in rules}) == len(rules) and len({c['id'] for c in coverage}) == len(coverage)
    for c in coverage:
        if c['status'] in ('SUPPORTED', 'IMPLEMENTED_EQUIVALENT', 'MARKER'): assert c['lesson_ids'] and c['evidence'], c['id']
    for s in sources: assert any(c['source_id'] == s['source_id'] for c in coverage), s['source_id']
    p = f'{OUT}/{slug}.json'; os.makedirs(OUT, exist_ok=True)
    open(p, 'w', encoding='utf8').write(json.dumps(pkg, ensure_ascii=False, indent=2) + '\n'); return p
