from common import *
import math_t1
SLUG='mathematics'; CAN='Mathematics'
S1,S2,S3='SS1-SRC-0c9004137f95','SS1-SRC-b802686e83d2','SS1-SRC-ca00ca94afb9'
sups=math_t1.out
sup_by_idx={i:l for l,i in sups}
H={s:hdr(s,'SUBJECT') if s!=S1 else 'SS1 GENERAL MATHEMATICS SCHEME OF WORK FOR FIRST TERM' for s in (S1,S2,S3)}
sources=[]
for s,loc,expl in [(S1,'document title line (first line of extracted text)','Title names "GENERAL MATHEMATICS" for SS1 first term; scheme lists mathematics topics (number bases, logarithms, variation). No separate SUBJECT line exists.'),
                   (S2,'line 2 "SUBJECT: ... CLASS: SS 1"','Subject line reads MATHEMATICS, class SS 1, second term; scheme lists quadratics, sets, trigonometry, circles, logic.'),
                   (S3,'line 2 "SUBJECT: ... CLASS: SSS 1"','Subject line reads MATHEMATICS, class SSS 1, third term; scheme lists mensuration, constructions, statistics.')]:
    sources.append(src_entry(s,CAN,H[s],loc,expl))
rules=[alias_rule(S1,'RULE-MATH-T1-ALIAS',CAN,H[S1],APPROVAL_PENDING,'title line','Heading says GENERAL MATHEMATICS; canonical subject is Mathematics (distinct from Further Mathematics).'),
       alias_rule(S2,'RULE-MATH-T2-ALIAS',CAN,H[S2],APPROVAL_PENDING,'SUBJECT line','Heading is a full SUBJECT/CLASS line, not the bare subject name.'),
       alias_rule(S3,'RULE-MATH-T3-ALIAS',CAN,H[S3],APPROVAL_PENDING,'SUBJECT line','Heading is a full SUBJECT/CLASS line, not the bare subject name.'),
       marker_rule(S1,'RULE-MATH-T1-W07-REVISION','REVISION','Review of first half  and periodic test','row 6 (WEEK 7)','Revision/periodic-test marker row; body retained.'),
       marker_rule(S1,'RULE-MATH-T1-W11-REVISION','REVISION','Week 11 Revision','row 10 (Week 11)','Revision marker row; body retained.'),
       marker_rule(S1,'RULE-MATH-T1-SCHEME-EXAM','SCHEME_ONLY','Revision.\n\nExamination.\n\nExamination\n\nREFERENCE  BOOKS','scheme preamble, final scheme lines and reference-book heading','Scheme-only lines for revision/examination weeks and the heading of the reference-book list; not teaching bodies.'),
       marker_rule(S2,'RULE-MATH-T2-W06-REVISION','REVISION','Review of the first half term’s work and periodic test','row 5 (WEEK SIX)','Half-term review row; body retained.'),
       marker_rule(S3,'RULE-MATH-T3-W07-REVISION','REVISION','WEEK 7\n\nREVISION','row 6 (WEEK 7)','Revision row; body retained.')]
why={0:'Delivered text keeps source arithmetic slip 4312+504+614+24=5430 (correct 5454) and says there is no divisibility test for 7.',
     2:'Source solves 104 in base x = 68 as x = ±8 (a base cannot be negative) and gives 2311₄−213₄ as 2033₄ (correct 2032₄).',
     3:'Source states the modulus must exceed the number reduced (false), gives 16×7=117 (correct 112) and lists only x=2 for 2x+3≡1 (mod 6) (x=2 and x=5).',
     4:'Source defines the leading factor as between 1 and 9 (must be 1 ≤ a < 10), contains an inconsistent subtraction result (0.00004803 then 4.807×10⁻⁵) and its exercises lose all exponents in delivered text.',
     5:'Delivered text contains no laws of indices at all (every equation is dropped by the plain extractor); the row cannot teach its objective.',
     9:'Source gives g = 2lπ/T (correct g = 4π²l/T²), solves joint variation 30 = 6k as k = 6 (correct k = 5) and writes 2k = 1 for a subtraction that gives 2a = 1.'}
corrections=corr_for(S1,sups,why,'Mathematics 1st term')
lessons=[l for l,_ in sups]
rows1=ROWS[S1]
def C(i): return f"COV-MATH-T1-R{i:02d}"
cov1=[]
sch1=['Revision of JSS3 work and basic operations of integers','Number bases: conversion to base ten, decimal fractions (bicimals), conversion between bases','Operations in number bases; application to computer programming','Modular arithmetic','Standard form and approximation','Indices: laws, negative, zero and fractional','Review of first half term and periodic test','Logarithms of whole numbers (use of tables)','Logarithms continued: powers, roots; relation between indices and logarithms','Simple equations and variation; change of subject','Revision']
for i,o in enumerate(sch1):
    loc=f'1st-term scheme line {i+1}; parsed row {i}'
    if i in sup_by_idx:
        cov1.append(cov(C(i),S1,o,loc,'IMPLEMENTED_EQUIVALENT',[sup_by_idx[i]['id'],rows1[i]['id']],[(f"supplement {sup_by_idx[i]['id']}",'Authored lesson with explanation, worked examples recomputed from first principles, practice with full answers and marking; replaces the original row for delivery.')]))
    elif i in (6,10):
        rule='RULE-MATH-T1-W07-REVISION' if i==6 else 'RULE-MATH-T1-W11-REVISION'
        cov1.append(cov(C(i),S1,o,loc,'MARKER',[rows1[i]['id']],[(loc,f'Revision marker classified by {rule} (exact anchor); body retained.')]))
    else:
        gap={1:'Original arithmetic checked and correct (1007→1757₈, 1111101111₂; 761→535₁₂, 2F9₁₆; 313₆→165₈; 1011.01₂=11¾), but 291 characters of equation content are absent from the delivered text; replacement not yet authored.',
             7:'Body teaches table-based logarithms but the 4-figure tables are not supplied; 331 characters of equation content absent from delivered text; no replacement authored.',
             8:'Body teaches table-based powers/roots but the tables are not supplied; 364 characters of equation content absent; no replacement authored.'}[i]
        cov1.append(cov(C(i),S1,o,loc,'PARTIAL',[rows1[i]['id']],[(loc,gap)]))
cov1.append(cov('COV-MATH-T1-EXAM',S1,'Examination weeks and reference-book list','scheme final lines','MARKER',['RULE-MATH-T1-SCHEME-EXAM'],[('scheme preamble','Scheme-only items; no teaching content to cover.')]))
def partial_cov(prefix,sid,items,note):
    out=[]; rows=ROWS[sid]
    for i,(o,loc_extra) in enumerate(items):
        out.append(cov(f'{prefix}-R{i:02d}',sid,o,f'scheme topic {i+1}; parsed row {i} ({rows[i]["title"][:50]})','PARTIAL',[rows[i]['id']],[(f'parsed row {i}',note.format(extra=rows[i]['eqExtra'] if rows[i]['eqExtra'] is not None else 'n/a'))]))
    return out
note2='Original body exists in this row but its full text has not yet been reviewed for correctness against the scheme objective, and the delivered text loses superscripts/subscripts and Word equations (OMML characters lost in this row: {extra}); no replacement lesson authored yet.'
m2=[('Quadratic equations by factorization and completing the square',''),('General form and formula method (ax²+bx+c=0)',''),('Graphical solution; roots, minimum/maximum, line of symmetry',''),('Idea of sets: universal, finite/infinite, empty set, subset',''),('Union, intersection, complements, disjoint sets; Venn diagrams (two and three sets)',''),('Review of first half term and periodic test',''),('Trigonometric ratios: sine, cosine, tangent; tables; chord length; graphs',''),('Applications: right-angled triangles, elevation/depression, bearings',''),('Circle and its properties; arc length, sector, segment, triangle area',''),('Logic: statements, negation, contrapositive, implication','')]
cov2=partial_cov('COV-MATH-T2',S2,m2,note2)
cov2[5]=cov('COV-MATH-T2-R05',S2,m2[5][0],'scheme topic 6; parsed row 5','MARKER',[ROWS[S2][5]['id']],[('parsed row 5','Half-term review marker classified by RULE-MATH-T2-W06-REVISION; body retained.')])
m3=[('Mensuration of solids: surface areas and volumes',''),('Frustums and pyramids; angle sum of a triangle and exterior angle proofs',''),('Revision of triangle constructions',''),('Constructions: angle bisection and special angles, parallelogram, equilateral triangle, loci',''),('Deductive proof: angle sums, triangles on a line, parallel lines, congruence, parallelogram, intercept theorem',''),('Statistics: collection, tabulation, presentation; range, median, mode of ungrouped data',''),('Revision',''),('Grouped data: collection, tabulation, presentation',''),('Range, median and mode of grouped data',''),('Statistical graphs: bar chart, pie chart, histogram, cumulative frequency',''),('Mean deviation, variance and standard deviation of grouped data','')]
cov3=partial_cov('COV-MATH-T3',S3,m3,note2)
cov3[6]=cov('COV-MATH-T3-R06',S3,m3[6][0],'scheme topic 7; parsed row 6','MARKER',[ROWS[S3][6]['id']],[('parsed row 6','Revision marker classified by RULE-MATH-T3-W07-REVISION; body retained.')])
cov3.append(cov('COV-MATH-T3-EXAM',S3,'Revision/Examination week and reference-book list','scheme final lines','UNRESOLVED',[],[]))
coverage=cov1+cov2+cov3
unrep=lambda sid,done:[ROWS[sid][i]['id'] for i in range(len(ROWS[sid])) if i not in done]
items=[
 open_item('OI-MATH-001','OWNER_ACTION','The importer reads .docx with plain mammoth text extraction. Word equations (OMML) and superscript/subscript runs are dropped. Counts in these sources: 1st term 333 equations; 2nd term 62 equations, 510 superscript runs; 3rd term 53 equations, 504 superscript runs and 13 embedded WMF equation objects. Delivered original rows therefore show e.g. "ax2" for ax² and empty formulae.','SS1-01/SS1-08 owner: decide between (a) an SS1 equation-aware extractor (OMML→text plus superscript/subscript mapping, as already done for JSS3 in jss3EquationRecovery.ts; this changes the content-bound row IDs and needs a reviewed migration) or (b) replacement lessons for every affected row. Until then every unreplaced Mathematics row listed in affected_ids is delivered with lost notation.',unrep(S1,set(sup_by_idx))+unrep(S2,set())+unrep(S3,set())),
 open_item('OI-MATH-002','CONTENT','2nd-term (10 rows) and 3rd-term (11 rows) bodies and 1st-term weeks 2, 8, 9 have not been reviewed in full for factual accuracy, worked-example arithmetic, or alignment with the scheme objective in this stage; no replacement lessons exist for them.','Review each row against its scheme objective, recompute worked examples, and author replacement lessons (explanation, worked steps, practice with answers and marks) where defects or lost notation are found.',unrep(S1,set(sup_by_idx)|{6,10})+unrep(S2,{5})+unrep(S3,{6})),
 open_item('OI-MATH-003','FACT','1st-term Weeks 8 and 9 teach logarithms by 4-figure tables, but the tables themselves are not in the supplied archive and the school has not stated whether table or calculator methods are to be taught.','Owner to supply the mathematical-table edition used (and reuse permission) or confirm a calculator-based method so equivalent lessons can be authored.',[rows1[7]['id'],rows1[8]['id']]),
 open_item('OI-MATH-004','CONTENT','3rd-term source embeds 13 OLE/WMF equation objects (word/embeddings/oleObject1-13.bin with image1-10.wmf) that neither the plain extractor nor OMML recovery reads. Their formulae are not yet transcribed. Embedded controls were not executed.','Render the WMF files (not executed as macros) and transcribe each formula into the matching replacement lesson.',[ROWS[S3][i]['id'] for i in range(len(ROWS[S3]))]),
 open_item('OI-MATH-005','OWNER_ACTION','All six authored supplements and three heading aliases await content approval; no approval reference exists.','Owner/teacher to review, then record approval_reference per lesson; alias approval_reference to be replaced with the owner confirmation.',[l['id'] for l in lessons]),
 open_item('OI-MATH-006','CONTENT','3rd-term scheme item "Revision/Examination" and its reference-book lines are not bound to a classification rule (anchor ambiguity); examination content is not source teaching.','Add a SCHEME_ONLY rule with a unique anchor in a reviewed revision, or confirm no mapping is needed.',['COV-MATH-T3-EXAM']),
 open_item('OI-MATH-007','VERIFICATION','Nothing in this package has been executed: schema parse, compiler plan, row-ID alignment with the live parser, asset hashes, and all tests/ss1/mathematics.package.test.mts are deferred by owner instruction.','Run docs/ss1/work/SS1-03/DEFERRED_COMMANDS.md in SS1-09.',[l['id'] for l in lessons],False)]
p=write(SLUG,CAN,sources,rules,lessons,corrections,[],coverage,items); print(p, len(lessons),len(corrections),len(coverage))
