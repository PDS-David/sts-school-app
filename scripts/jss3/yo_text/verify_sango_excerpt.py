"""Verify downloaded source and licence HTML against the committed excerpt.
Usage: python verify_sango_excerpt.py SOURCE_HTML LICENCE_HTML
No network access or database operations. HTML outer bytes can change; exact
recorded hash differences are reported separately from transcript verification.
"""
import hashlib,json,sys
from pathlib import Path
from lxml import html
root=Path(__file__).resolve().parents[3]
e=json.loads((root/'docs/jss3/completion/YO_TEXT_IMPLEMENTATION/SANGO_EXCERPT.json').read_text())
a,b=map(Path,sys.argv[1:3]);doc=html.parse(str(a));expected=e['yoruba']+e['printed_translation']
matches=[node for node in doc.xpath('//blockquote') if [p.text_content().strip() for p in node.xpath('./p')]==expected]
assert len(matches)==1, 'Exact six-paragraph excerpt missing or ambiguous'
assert 'https://creativecommons.org/licenses/by-sa/4.0/' in html.parse(str(b)).xpath('//a/@href'), 'Publisher licence link missing'
print(json.dumps({'exact_excerpt_matches':len(matches),'licence_link_verified':True,'source_hash_matches_record':hashlib.sha256(a.read_bytes()).hexdigest()==e['source_sha256'],'licence_page_hash_matches_record':hashlib.sha256(b.read_bytes()).hexdigest()==e['license_page_sha256']},indent=2))
