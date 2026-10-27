from common import *
COV=cov
import fm_t3, hashlib
SLUG='further-mathematics'; CAN='Further Mathematics'
F1,F2,F3='SS1-SRC-e9efc9a976ed','SS1-SRC-43c5ab51b87f','SS1-SRC-c7a7523bdb0d'
sups=fm_t3.out; sup_by={i:l for l,i in sups}
H1,H2=hdr(F1),hdr(F2); H3='New Further Mathematics project 1, by Adigun et al. Page 178'
sources=[src_entry(F1,CAN,H1,'line 2 "SUBJECT: ... CLASS: SS1"','Subject line reads FURTHER MATHEMATICS, class SS1; scheme lists indices, logarithms, sets, binary operations, surds, statistics.'),
 src_entry(F2,CAN,H2,'line 2 "SUBJECT: FURTHER MATHEMATICS"','Subject line reads FURTHER MATHEMATICS, class SS1, second term; scheme lists AP/GP, inequalities, functions, trigonometry, logic.'),
 src_entry(F3,CAN,H3,'first reference-material line (the document has no title or subject line)','No heading names subject, class or term. The only in-document subject evidence is the cited textbook title "New Further Mathematics project 1"; the filename and folder give subject and term.')]
rules=[alias_rule(F1,'RULE-FM-T1-ALIAS',CAN,H1,APPROVAL_PENDING,'SUBJECT line','Heading is a full SUBJECT/CLASS line.'),
 alias_rule(F2,'RULE-FM-T2-ALIAS',CAN,H2,APPROVAL_PENDING,'SUBJECT line','Heading is a SUBJECT line with trailing tabs.'),
 alias_rule(F3,'RULE-FM-T3-ALIAS',CAN,H3,'PENDING-OWNER: no subject heading exists; subject inferred from cited textbook title, filename and content (flowcharts, gradients, vectors); owner confirmation not recorded','first reference line','Source has no subject heading; this textbook title is the only in-document evidence.'),
 marker_rule(F1,'RULE-FM-T1-W06-REVISION','REVISION','First Half  Term Revision Questions','row 6 (WEEK SIX)','First-half-term revision questions; body retained.'),
 marker_rule(F2,'RULE-FM-T2-W06-REVISION','REVISION','Revision of half term work','row 5 (WEEK  SIX)','Half-term revision row; body retained.'),
 marker_rule(F1,'RULE-FM-T1-SCHEME-EXAM','SCHEME_ONLY','11\tRevision\n\t\n12\tExamination\t','scheme lines 11-12','Revision and examination weeks listed in the scheme only.'),
 marker_rule(F2,'RULE-FM-T2-SCHEME-EXAM','SCHEME_ONLY','Revision of Second Term’s lesson\n\n12\n\nExamination','scheme lines 11-12','Revision and examination weeks listed in the scheme only.')]
why={0:'Source gives no flowchart (only a prompt and a list of advantages) and no solution.',1:'Delivered text omits equation content (299/167 characters) and gradient examples use ambiguous notation; lesson rewritten with equations intact.',
 2:'Source heads its perpendicularity example with the word "parallel" and loses equation content in delivery.',3:'Source writes |-2i-5j| as √(-2²-5²) and loses equation content in delivery.',
 4:'Source computes 3p as 9i-9j (should be 6i-9j) so 3p-2q = 3i-19j is wrong (correct -19j); the row also repeats Week 5.',5:'Source gives no solution for the vertical-line case and writes tan α with ambiguous brackets.'}
corrections=corr_for(F3,sups,why,'Further Mathematics 3rd term')
lessons=[l for l,_ in sups]
# asset
svg='/home/claude/sts-school-app/backend/src/db/ss1/assets/further-mathematics/fm3-w2-flowchart-perimeter.svg'
b=open(svg,'rb').read()
assets=[{"id":"ASSET-SS1-FM-T3-W02-FLOWCHART-PERIMETER","lesson_id":lessons[0]['id'],"path":"backend/src/db/ss1/assets/further-mathematics/fm3-w2-flowchart-perimeter.svg","sha256":SHA(b),"bytes":len(b),"media_type":"image/svg+xml",
 "alt":"Flowchart for the perimeter of a rectangle: START, input l and b, process P equals 2 times l plus b, output P, STOP, joined by downward arrows.","order":0,
 "source_locator":"Week 2 worked example 'perimeter of a rectangle = 2(l+b)'; the source contains the prompt but no drawn figure",
 "provenance":{"title":"Flowchart for P = 2(l+b)","locator":"Week 2 example in SS1-SRC-c7a7523bdb0d","url":None,"rights":"Deterministic SVG authored for Sow the Seed Schools from the formula stated in the source; contains no third-party artwork. Labelled derivative, not a source image.","reuse_status":"PERMITTED","attribution":"Authored for Sow the Seed Schools; owner approval pending."},
 "state":dict(STATE)}]
rows1,rows2,rows3=ROWS[F1],ROWS[F2],ROWS[F3]
covs=[]
f1=['Indices: laws and application','Indicial and exponential equations','Logarithms: laws and application','General review of set theory','Sets (continued)','Operations on sets and Venn diagrams','First-half revision questions','Binary operations: definition, closure, commutative, associative, distributive laws','Binary operations: identity and inverse elements; tables','Surds: definition, manipulation, rationalisation','Measures of central tendency: mean, median, mode; mode from histogram']
nl='Row exists, but its full text has not been reviewed for factual accuracy and alignment with the scheme objective, and the delivered legacy-.doc text may lose superscripts, subscripts and MathType objects; no replacement lesson authored.'
for i,o in enumerate(f1):
    if i==6: covs.append(COV(f'COV-FM-T1-R{i:02d}',F1,o,f'parsed row {i}','MARKER',[rows1[i]['id']],[('parsed row 6','Revision questions classified by RULE-FM-T1-W06-REVISION; body retained.')]))
    else: covs.append(COV(f'COV-FM-T1-R{i:02d}',F1,o,f'scheme weeks 1-10; parsed row {i} ({rows1[i]["title"][:40]})','PARTIAL',[rows1[i]['id']],[(f'parsed row {i}',nl)]))
covs.append(COV('COV-FM-T1-EXAM',F1,'Revision and examination weeks; reference list','scheme lines 11-12','MARKER',['RULE-FM-T1-SCHEME-EXAM'],[('scheme','Scheme-only lines.')]))
f2=['Arithmetic progression','Geometric progression','Linear inequalities in one variable','Inequalities in two variables (graphs)','Concept of functions','Review of half-term work','Functions: one-to-one, onto, composite, inverse','Trigonometric ratios; graphs; special angles; applications','Logical reasoning: statements, negation, converse, contrapositive','Compound statements, connectives, conditionals']
n2='Row exists, but its full text has not been reviewed for factual accuracy and alignment with the scheme objective, and delivered text loses superscripts/subscripts (401 superscript and 214 subscript runs in the source; OMML characters lost in this row: {x}); no replacement lesson authored.'
for i,o in enumerate(f2):
    if i==5: covs.append(COV('COV-FM-T2-R05',F2,o,'parsed row 5','MARKER',[rows2[i]['id']],[('parsed row 5','Half-term revision classified by RULE-FM-T2-W06-REVISION; body retained.')]))
    else: covs.append(COV(f'COV-FM-T2-R{i:02d}',F2,o,f'scheme topic {i+1}; parsed row {i} ({rows2[i]["title"][:40]})','PARTIAL',[rows2[i]['id']],[(f'parsed row {i}',n2.format(x=rows2[i]['eqExtra']))]))
covs.append(COV('COV-FM-T2-EXAM',F2,'Revision and examination weeks; reference list','scheme lines 11-12','MARKER',['RULE-FM-T2-SCHEME-EXAM'],[('scheme','Scheme-only lines.')]))
f3=[(0,'Flowcharts'),(1,'Gradients of straight lines and curves; equation of a line'),(2,'Angle of slope; parallel and perpendicular lines'),(3,'Vectors: modulus and unit vectors'),(4,'Vector operations and direction cosines (row repeats much of Week 5)'),(5,'Angle between lines; forms of the equation of a line')]
for i,o in f3:
    covs.append(COV(f'COV-FM-T3-R{i:02d}',F3,o,f'objective taken from the row\'s own Topic/Content line; parsed row {i} ({rows3[i]["week"]})','IMPLEMENTED_EQUIVALENT',[sup_by[i]['id'],rows3[i]['id']],[(f'supplement {sup_by[i]["id"]}','Authored lesson: explanation, recomputed worked examples, practice with full answers and marking. It replaces the original row for delivery.')]))
covs.append(COV('COV-FM-T3-SCHEME',F3,'Third-term scheme of work and the weeks not present in the source (1, 7 and 9-12)','whole document','UNRESOLVED',[],[]))
unrep=lambda sid,done:[ROWS[sid][i]['id'] for i in range(len(ROWS[sid])) if i not in done]
items=[
 open_item('OI-FM-001','OWNER_ACTION','The importer reads legacy .doc (1st term, word-extractor) and .docx (2nd/3rd term, mammoth) as plain text. Word equations (3rd term: 129; 2nd term: 51), superscripts (2nd term 401, 3rd term 2) and subscripts (2nd term 214, 3rd term 26) are lost or flattened, and MathType/OLE objects are not read.','SS1-01/SS1-08 owner: decide on an SS1 equation-aware extractor (needs reviewed ID migration) or replacement lessons for every affected row.',unrep(F1,set())+unrep(F2,{5})),
 open_item('OI-FM-002','CONTENT','1st-term (11 rows) and 2nd-term (10 rows) bodies have not been reviewed in full in this stage; no replacement lessons exist.','Review each row against its scheme objective, recompute worked examples, and author replacements where defects or lost notation exist.',unrep(F1,{6})+unrep(F2,{5})),
 open_item('OI-FM-003','CONTENT','The 3rd-term source contains no scheme of work and only parsed weeks 2, 3, 4, 5, 6 and 8 (Week 6 repeats Week 5). Weeks 1, 7 and 9-12 are not in the supplied archive. Week 3 refers to figures (graphs of y = 5, y = -3, x = 2, x = -4, and the curve with tangents) that are not drawn in the source; the replacement lesson describes them in text only.','Owner to supply the missing 3rd-term material, or confirm the term scheme; teacher to supply graph figures if wanted. Do not infer a scheme from filenames.',[rows3[i]['id'] for i in range(len(rows3))]+['COV-FM-T3-SCHEME']),
 open_item('OI-FM-004','PERMISSION','The 2nd- and 3rd-term sources embed the advertising letterhead and cover page of a commercial tutor ("MR OSHO TUTORS", personal phone number and e-mail, offering e-notes for sale). The notes appear to be that vendor\'s product. Reuse rights are unconfirmed. These images were not bound as lesson assets and must not be delivered to students.','Owner to confirm the licence under which the school may deliver the vendor notes, and approve removal of branding and contact details from any delivered asset.',[F2,F3]),
 open_item('OI-FM-005','OWNER_ACTION','The six authored supplements, the flowchart SVG asset and three heading aliases await content approval; no approval reference exists.','Owner/teacher review, then record approval_reference values.',[l['id'] for l in lessons]+[assets[0]['id']]),
 open_item('OI-FM-006','VERIFICATION','Nothing in this package has been executed (schema parse, compiler plan, row-ID alignment, asset hash, tests/ss1/further-mathematics.test.mts).','Run DEFERRED_COMMANDS.md in SS1-09.',[l['id'] for l in lessons],False)]
print(write(SLUG,CAN,sources,rules,lessons,corrections,assets,covs,items),len(covs))
