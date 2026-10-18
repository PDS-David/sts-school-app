"""Original basic-sign drawing from notation rules; not a scan of a textbook page.
CBSE Shorthand English XI Unit 8 pp102–107 supplies the technical reference.
Run from any directory. PNG is served by the existing topic-asset pipeline.
"""
from pathlib import Path
import cairosvg
root=Path(__file__).resolve().parent
items=[('KW','M 100 0 C 65 0 65 38 95 38 L 190 38',3,'large hook + light K; left to right'),('GW','M 100 0 C 65 0 65 38 95 38 L 190 38',7,'large hook + heavy G; left to right'),('MP / MB','M 75 38 C 95 -5 170 -5 190 38',7,'heavy M; left to right'),('LR','M 145 -8 C 90 -8 75 10 75 38',7,'heavy downward L'),('RR','M 75 -8 C 130 -8 145 10 145 38',7,'heavy downward R'),('WH','M 100 0 C 70 0 65 42 95 38 L 155 -10',3,'large hook + rising W')]
a=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1010" viewBox="0 0 1200 1010"><rect width="1200" height="1010" fill="white"/><g font-family="DejaVu Sans, sans-serif" fill="#15364a"><text x="45" y="55" font-size="32">Shorthand: six compound-sign groups</text><text x="45" y="95" font-size="20">Original isolated-sign practice chart. Baselines are grey; strokes are black.</text>']
for i,(label,path,width,desc) in enumerate(items):
 y=160+i*115
 a.append(f'<g transform="translate(45 {y})"><text x="0" y="30" font-size="29">{label}</text><g transform="translate(190 0)"><path d="M 55 40 H 215" stroke="#abb7bd" stroke-width="1"/><path d="{path}" fill="none" stroke="black" stroke-width="{width}" stroke-linecap="round"/></g><text x="470" y="27" font-size="23">{desc.replace("&","&amp;")}</text></g>')
a.append('<text x="45" y="900" font-size="22">These signs are not complete word outlines. Keep vowel and position rules.</text><text x="45" y="942" font-size="19">Technical reference: CBSE Shorthand English XI, Unit 8 (pp. 102–107).</text><text x="45" y="975" font-size="19">New drawing for this lesson; not recovered school-source notation.</text></g></svg>')
svg=''.join(a);(root/'shorthand-compounds.svg').write_text(svg);cairosvg.svg2png(bytestring=svg.encode(),write_to=str(root/'shorthand-compounds.png'))
