"""SS1-03 authoring helpers. Pure Python; no network. Hashes bodies, checks mark sums, binds IDs."""
import hashlib, json, re
from fractions import Fraction
SHA = lambda s: hashlib.sha256(s.encode('utf-8') if isinstance(s, str) else s).hexdigest()
ROWS = json.load(open('/home/claude/work/rows.json'))   # private: parsed row IDs from the importer's own parser
TEXT = lambda sid: open(f'/home/claude/work/text/{sid}.txt', encoding='utf8').read()
STATE = {"content_approval": "PENDING", "approval_reference": None, "implementation": "IMPLEMENTED",
         "verification": "DEFERRED", "verification_reference": None}
def row(sid, week_index):
    r = ROWS[sid][week_index]; return r['id'], r['body_sha256'], r
def prov(source_id, member, locator, extra=''):
    return {"title": f"School source note {source_id} ({member})", "locator": locator, "url": None,
            "rights": "Supplement text is newly authored for Sow the Seed Schools; no third-party passage is reproduced. "
                      "The teaching sequence follows the school's own scheme in the cited source. " + extra,
            "reuse_status": "PERMITTED", "attribution": "Authored for Sow the Seed Schools (SS1 delivery correction); owner content approval pending."}
def lesson(slug, subject, term, suffix, title, objectives, body, practice, provs):
    for q in practice:
        assert q['marks'] == sum(m['marks'] for m in q['marking']), (suffix, q['id'])
        assert q['answer'].strip()
    return {"id": f"SUP-SS1-{slug.upper()}-{suffix}", "class_name": "SS 1", "term": term, "subject": subject, "title": title,
            "objectives": objectives, "body": body, "body_sha256": SHA(body), "practice": practice, "provenance": provs, "state": dict(STATE)}
def Q(id, question, answer, marking):
    return {"id": id, "question": question, "answer": answer, "marks": sum(m for _, m in marking),
            "marking": [{"criterion": c, "marks": m} for c, m in marking]}
def correction(cid, source_id, sha, src_row_id, src_body_sha, repl_id, reason, locator, why):
    return {"id": cid, "source_id": source_id, "source_sha256": sha, "source_lesson_id": src_row_id, "body_sha256": src_body_sha,
            "replacement_id": repl_id, "reason": reason, "evidence": {"locator": locator, "explanation": why}}
def fr(x):
    x = Fraction(x); return str(x.numerator) if x.denominator == 1 else f"{x.numerator}/{x.denominator}"
def to_base(n, b):
    d = '0123456789ABCDEF'; s = ''
    while n: s = d[n % b] + s; n //= b
    return s or '0'
