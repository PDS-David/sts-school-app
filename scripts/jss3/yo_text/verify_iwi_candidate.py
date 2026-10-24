"""Verify a downloaded Frontiers article page against the committed iwì candidate (R1).
Usage: python verify_iwi_candidate.py SAVED_FULL_PAGE.html
No network access, no database. Prints the SHA-256 of the file's bytes and whether the three selected Yoruba
lines, their printed English, the poem-composer statement and the CC BY statement are present in the text
(Unicode-normalised, whitespace-collapsed). The SHA-256 is of the file you supply; it is not recomputed from a
URL. Exit 0 only if every check passes."""
import hashlib, json, re, sys, unicodedata
from pathlib import Path
from lxml import html

root = Path(__file__).resolve().parents[3]
ev = json.loads((root / 'docs/jss3/completion/R1_YORUBA_TEXTS/IWI_CANDIDATE.json').read_text(encoding='utf8'))
norm = lambda s: re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).replace('’', "'").replace('“', '"').replace('”', '"').strip()

def check(path: Path) -> dict:
    raw = path.read_bytes()
    try:
        doc = html.fromstring(raw.decode('utf-8'))  # decode explicitly: bytes without a charset would be read as Latin-1
    except (UnicodeDecodeError, ValueError):
        doc = html.fromstring(raw)
    text = norm(doc.text_content())
    lines = ev['selected_lines']
    res = {
        'source_sha256': hashlib.sha256(raw).hexdigest(),
        'yoruba_lines_match': all(norm(l['yoruba']) in text for l in lines),
        'printed_english_matches': all(norm(l['printed_english']) in text for l in lines),
        'composer_statement_present': 'composed by the third author' in text,
        'cc_by_statement_present': 'Creative Commons Attribution License (CC BY)' in text,
        'esa_features_present': all(k in text for k in ['Ìwí Egúngún', 'triply long vowel', 'vowel insertion and lengthening']),
    }
    res['all_checks_pass'] = all(v for k, v in res.items() if k != 'source_sha256')
    return res

if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    r = check(Path(sys.argv[1]))
    print(json.dumps(r, indent=2, ensure_ascii=False))
    sys.exit(0 if r['all_checks_pass'] else 1)
