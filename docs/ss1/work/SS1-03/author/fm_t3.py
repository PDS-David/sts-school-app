from lib import *
import math
SID='SS1-SRC-c7a7523bdb0d'; MEM='SSS 1/3rd Term SS1_/3RD TERM S1 FURTHER MATHEMATICS.docx'; SUB='Further Mathematics'; T='3rd Term'; SL='FURTHER-MATHEMATICS'
P=lambda loc:[prov(SID,MEM,loc)]
out=[]
deg=lambda x:round(math.degrees(x),2)

# ---- row 0 (WEEK 2): flowcharts ----
b0="""FLOWCHARTS

What you will learn: what a flowchart is, the standard symbols, how to draw a flowchart for a calculation or a decision, and how to check it with a trace table.

1. Meaning
A flowchart is a diagram that shows, step by step, how a problem is solved. Each step is placed in a shape and arrows show the order. Flowcharts help us plan an algorithm (a finite list of clear steps) before writing a computer program, make a solution easy to read, and make mistakes easier to find.

2. Standard symbols
- Oval (terminator): START or STOP. Every flowchart has one START and at least one STOP.
- Parallelogram: INPUT or OUTPUT (for example, "Input l, b" or "Output P").
- Rectangle: a PROCESS, such as a calculation "P = 2(l + b)".
- Diamond: a DECISION with a yes/no question; one arrow leaves for "Yes" and one for "No".
- Arrows: show the direction of flow, normally top to bottom.

3. Worked example 1 (the perimeter of a rectangle)
The perimeter of a rectangle of length l and breadth b is P = 2(l + b). The flowchart (see the figure) is:
START -> Input l, b -> P = 2(l + b) -> Output P -> STOP.
Trace with l = 8 and b = 3: P = 2(8 + 3) = 22.

4. Worked example 2 (a decision)
Decide whether a whole number n is even. START -> Input n -> Diamond "Is the remainder of n / 2 equal to 0?" -> Yes: Output "even" -> STOP; No: Output "odd" -> STOP.
Trace with n = 7: the remainder is 1, not 0, so the answer is "odd".

5. Worked example 3 (a loop and a trace table)
Algorithm: set N = 1 and S = 0. Repeat: S = S + N, then N = N + 1, until N is greater than 4. Output S.
Trace table:
N before | S after adding | N after
1 | 1 | 2
2 | 3 | 3
3 | 6 | 4
4 | 10 | 5
Now N = 5 > 4, so stop and output S = 10 (which is 1 + 2 + 3 + 4).

Good practice: label every decision arrow Yes/No, give every symbol one clear instruction, and test the chart with sample numbers.
"""
Q1=Q('FM3W2-Q1','Draw a flowchart that finds the area A of a triangle from its base b and height h, and trace it for b = 10 and h = 6.','START -> Input b, h -> A = (1/2) x b x h -> Output A -> STOP. Trace: A = 0.5 x 10 x 6 = 30.',[('Oval START and STOP used',1),('Parallelogram for input and for output',1),('Rectangle with the formula A = ½bh',1),('Arrows in correct order',1),('Trace gives 30',1)])
Q2=Q('FM3W2-Q2','Draw a flowchart to input a mark m and output "PASS" if m is 50 or more and "FAIL" otherwise.','START -> Input m -> Diamond "Is m >= 50?" -> Yes: Output PASS -> STOP; No: Output FAIL -> STOP.',[('Input m shown in a parallelogram',1),('Decision diamond with the condition m >= 50',2),('Yes and No branches labelled',1),('Both outputs reach STOP',1)])
Q3=Q('FM3W2-Q3','Trace the algorithm: set N = 1, S = 0; repeat S = S + N, N = N + 1 until N > 5; output S. Give the final output.','S = 1 + 2 + 3 + 4 + 5 = 15.',[('Trace table with N and S columns',1),('Stops when N = 6',1),('Output 15',1)])
assert sum(range(1,6))==15
l0=lesson(SL,SUB,T,'T3-W02-FLOWCHARTS','Flowcharts: symbols, algorithms and trace tables',['Name and use the standard flowchart symbols','Draw a flowchart for a calculation and for a decision','Trace a flowchart with sample values'],b0,[Q1,Q2,Q3],P('Week 2; row 0 (the source gives the example but no flowchart figure and no solution)'))
out.append((l0,0))

# ---- row 1 (WEEK 3): gradients of lines and curves ----
b1="""GRADIENTS OF STRAIGHT LINES AND CURVES

What you will learn: how to find the gradient of a line from two points or from its equation, sketch a line from its intercepts, handle lines parallel to the axes, find the equation of a line, and estimate the gradient of a curve from a tangent.

1. Gradient of a straight line
The gradient m measures how much y changes for each unit increase in x. For points (x1, y1) and (x2, y2):
m = (y2 - y1) / (x2 - x1).
Example 1. P(7, -2) and Q(-1, 2): m = (2 - (-2)) / (-1 - 7) = 4 / (-8) = -1/2.

2. Gradient and intercept from an equation
Write the equation as y = mx + c; then m is the gradient and c is the y-intercept.
Example 2. 7x + 4y - 8 = 0: 4y = -7x + 8, so y = -(7/4)x + 2. Gradient -7/4, y-intercept 2.
Example 3. y = 3x - 2: gradient 3, intercept -2. 2x + 3y = 6: y = -(2/3)x + 2, gradient -2/3, intercept 2.

3. Sketching with intercepts
Example 4. Sketch 4x - 3y = 12. Put x = 0: -3y = 12, y = -4, so (0, -4). Put y = 0: 4x = 12, x = 3, so (3, 0). Join the points. Gradient = (0 - (-4)) / (3 - 0) = 4/3.

4. Lines parallel to the axes
A horizontal line has gradient 0 and equation y = c (for example y = 5 or y = -3); the x-axis is y = 0. A vertical line has an undefined gradient and equation x = a (for example x = 2 or x = -4); the y-axis is x = 0.

5. Equation of a line
Gradient and one point: y - y1 = m(x - x1).
Example 5. Gradient -1/3 through (-3, 2): y - 2 = -(1/3)(x + 3); 3y - 6 = -x - 3; x + 3y = 3.
Two points: (y - y1)/(y2 - y1) = (x - x1)/(x2 - x1).
Example 6. Through (1, 4) and (-2, 6): (y - 4)/(6 - 4) = (x - 1)/(-2 - 1); -3(y - 4) = 2(x - 1); -3y + 12 = 2x - 2; 2x + 3y = 14. Check (1, 4): 2 + 12 = 14.

6. Gradient of a curve
The gradient of a curve at a point is the gradient of the tangent (the straight line that just touches the curve there). Draw the curve accurately, draw the tangent with a ruler, then read the rise and run.
Example 7. y = x²/4 for x = -2 to 3. Table: x = -2, -1, 0, 1, 2, 3 gives y = 1, 1/4, 0, 1/4, 1, 9/4.
At x = 3 the tangent rises 2.25 over a run of 1.5: gradient 2.25 / 1.5 = 1.5.
At x = -2 the tangent falls 1 over a run of 1: gradient -1.
(Check: for y = x²/4 the gradient at x is x/2, giving 1.5 and -1.)
"""
g=lambda a,b,c,d:(d-b)/(c-a)
Q1=Q('FM3W3-Q1','Find the gradient of the line through (2, 5) and (-4, -7). Then find its equation.',f'm = (-7 - 5)/(-4 - 2) = -12/-6 = 2. y - 5 = 2(x - 2), so y = 2x + 1.',[('Gradient formula with correct substitution',1),('m = 2',1),('Equation y = 2x + 1',2)])
assert g(2,5,-4,-7)==2 and 2*2+1==5 and 2*-4+1==-7
Q2=Q('FM3W3-Q2','Find the gradient and y-intercept of 3x - 5y = 20, and the points where it meets the axes.','5y = 3x - 20, y = (3/5)x - 4: gradient 3/5, y-intercept -4. x-axis: y = 0 gives x = 20/3.',[('Rearranges to y = mx + c',1),('Gradient 3/5',1),('Intercept -4',1),('x-intercept 20/3',1)])
Q3=Q('FM3W3-Q3','Find the equation of the line through (4, 1) and (-2, 7).',f'm = (7 - 1)/(-2 - 4) = -1; y - 1 = -(x - 4); y = -x + 5, i.e. x + y = 5.',[('Gradient -1',1),('Correct substitution in a line formula',1),('x + y = 5',1)])
assert g(4,1,-2,7)==-1
Q4=Q('FM3W3-Q4','For y = x²/4 complete the table for x = -4, -2, 0, 2, 4 and state the gradient of the curve at x = 2 using the rule gradient = x/2.','y = 4, 1, 0, 1, 4. Gradient at x = 2 is 1.',[('Correct table values',2),('Gradient 1 at x = 2',1)])
l1=lesson(SL,SUB,T,'T3-W03-GRADIENTS-LINES-CURVES','Gradients of straight lines and curves; equation of a line',['Calculate the gradient of a line from two points or its equation','Sketch a line from its intercepts and recognise lines parallel to the axes','Write the equation of a line given a point and gradient or two points','Estimate the gradient of a curve using a tangent'],b1,[Q1,Q2,Q3,Q4],P('Week 3; row 1; delivered text omits equation content'))
out.append((l1,1))

# ---- row 2 (WEEK 4): angle of slope, parallel, perpendicular ----
tan_th=math.atan(2)
b2=f"""ANGLE OF SLOPE, PARALLEL AND PERPENDICULAR LINES

What you will learn: the angle a line makes with the x-axis, the tests for parallel and perpendicular lines, and the equation of a line through a point with a given gradient.

1. Angle of slope
If a line makes angle θ with the positive x-axis, its gradient is m = tan θ.
Example 1. Find the gradient of the line joining (3, 2) and (7, 10) and its angle of slope. m = (10 - 2)/(7 - 3) = 8/4 = 2. tan θ = 2, so θ = {deg(tan_th)}°.

2. Parallel lines
Parallel lines have equal gradients (m1 = m2).
Example 2. A(3, 1), B(4, 3), P(4, 6), Q(5, 8): m(AB) = (3 - 1)/(4 - 3) = 2 and m(PQ) = (8 - 6)/(5 - 4) = 2. Equal, so AB is parallel to PQ.
Example 3. A(-1, -2), B(2, -3), P(5, 4), Q(6, 7): m(AB) = (-3 + 2)/(2 + 1) = -1/3 and m(PQ) = (7 - 4)/(6 - 5) = 3. Not equal, so AB is not parallel to PQ.

3. Perpendicular lines
Two lines (neither vertical nor horizontal) are perpendicular when m1 x m2 = -1, that is m2 = -1/m1.
Example 4. Are AB and PQ perpendicular for A(5, -1), B(3, 2), P(2, 4), Q(5, 6)? m(AB) = (2 + 1)/(3 - 5) = -3/2. m(PQ) = (6 - 4)/(5 - 2) = 2/3. Product = (-3/2)(2/3) = -1, so the lines are perpendicular.
Example 5. The lines in Example 3 have gradients -1/3 and 3. Product = -1, so AB is perpendicular to PQ (not parallel).

4. Gradient and one point
Example 6. A line of gradient 2 passes through (3, -2). y - (-2) = 2(x - 3), so y + 2 = 2x - 6 and y = 2x - 8.

Common mistakes: using a perpendicular test when asked about parallel lines (and the reverse); dividing in the wrong order in the gradient formula; writing y - (-2) as y - 2.
"""
chk=[g(3,1,4,3)==g(4,6,5,8)==2, abs(g(-1,-2,2,-3)-(-1/3))<1e-12, g(5,-1,3,2)*g(2,4,5,6)==-1]; assert all(chk)
Q1=Q('FM3W4-Q1','Find the gradient and angle of slope of the line through (1, 3) and (5, 11).',f'm = 8/4 = 2; θ = {deg(math.atan(2))}° (to 2 d.p.)',[('Gradient formula',1),('m = 2',1),('θ = arctan 2 = 63.43°',1)])
Q2=Q('FM3W4-Q2','Show that the line through A(0, 1) and B(4, 9) is parallel to the line through P(1, 0) and Q(3, 4).','m(AB) = 8/4 = 2; m(PQ) = 4/2 = 2; equal gradients, so parallel.',[('m(AB) = 2',1),('m(PQ) = 2',1),('Conclusion from equal gradients',1)])
Q3=Q('FM3W4-Q3','Show that the line through (2, 3) and (6, 1) is perpendicular to the line through (0, 0) and (1, 2).','m1 = (1 - 3)/(6 - 2) = -1/2; m2 = 2; m1 x m2 = -1, so perpendicular.',[('m1 = -1/2',1),('m2 = 2',1),('Product -1 and conclusion',1)])
Q4=Q('FM3W4-Q4','Find the equation of the line of gradient -3 through (2, 5).','y - 5 = -3(x - 2); y = -3x + 11.',[('Correct formula and substitution',1),('y = -3x + 11',1)])
assert 5==-3*2+11
l2=lesson(SL,SUB,T,'T3-W04-SLOPE-PARALLEL-PERPENDICULAR','Angle of slope; parallel and perpendicular lines',['Find the angle of slope of a line from its gradient','Test whether two lines are parallel or perpendicular using gradients','Write the equation of a line from a gradient and a point'],b2,[Q1,Q2,Q3,Q4],P('Week 4; row 2; the source heads its perpendicular example with the word "parallel"'))
out.append((l2,2))

# ---- row 3 (WEEK 5): magnitude and unit vectors ----
b3="""VECTORS: MAGNITUDE, UNIT VECTORS AND SPECIAL VECTORS

What you will learn: the magnitude (modulus) of a vector, zero, negative and equal vectors, and unit vectors.

1. Notation
A vector in two dimensions is written ai + bj, where i and j are unit vectors along the x and y axes. In three dimensions ai + bj + ck is used.

2. Magnitude (modulus)
The magnitude of r = ai + bj is |r| = √(a² + b²). In three dimensions |r| = √(a² + b² + c²). Square each component first, including the sign, then add.
Example 1. |3i + 4j| = √(3² + 4²) = √25 = 5.
Example 2. |-2i - 5j| = √((-2)² + (-5)²) = √(4 + 25) = √29. (Writing -2² would mean -4 and is wrong; brackets are needed.)
Example 3. |i sin θ - j cos θ| = √(sin²θ + cos²θ) = √1 = 1.

3. Special vectors
- Zero vector: magnitude 0.
- Negative vector: -a has the same magnitude as a and opposite direction.
- Equal vectors: same magnitude and same direction (same components).

4. Unit vectors
A unit vector has magnitude 1. The unit vector in the direction of r is r̂ = r / |r|, so r = |r| r̂.
Example 4. r = 2i + 3j: |r| = √13, r̂ = (2i + 3j)/√13.
Example 5. q = 4i - 5j: |q| = √41, q̂ = (4i - 5j)/√41.
Example 6. p = 7i + 2j - 3k: |p| = √(49 + 4 + 9) = √62, p̂ = (7i + 2j - 3k)/√62.
Example 7. t = 3i - 5j - 3k: |t| = √(9 + 25 + 9) = √43, t̂ = (3i - 5j - 3k)/√43.
"""
Q1=Q('FM3W5-Q1','Find the magnitude of (a) 5i - 12j (b) -6i - 8j (c) 2i - 3j + 6k.','(a) √(25 + 144) = 13 (b) √(36 + 64) = 10 (c) √(4 + 9 + 36) = 7',[('(a) 13',1),('(b) 10 with squares of negative components positive',1),('(c) 7',1)])
Q2=Q('FM3W5-Q2','Find the unit vector in the direction of 6i + 8j and verify that it has magnitude 1.','|6i + 8j| = 10, unit vector 0.6i + 0.8j; magnitude √(0.36 + 0.64) = 1.',[('Magnitude 10',1),('Unit vector 0.6i + 0.8j',1),('Verification',1)])
Q3=Q('FM3W5-Q3','Explain why |-2i - 5j| is not √(-2² - 5²).','Because (-2)² = +4 and (-5)² = +25, so |-2i - 5j| = √(4 + 25) = √29. Writing -2² means -(2²) = -4, which gives a negative number under the root.',[('States each component is squared with its sign inside brackets',1),('Gives √29',1)])
assert math.sqrt(25+144)==13 and math.sqrt(36+64)==10 and math.sqrt(4+9+36)==7
l3=lesson(SL,SUB,T,'T3-W05-VECTOR-MAGNITUDE-UNIT','Vectors: magnitude, special vectors and unit vectors',['Calculate the magnitude of a vector in two or three dimensions','Distinguish zero, negative and equal vectors','Find the unit vector in the direction of a given vector'],b3,[Q1,Q2,Q3],P('Week 5; row 3; source writes |-2i-5j| as √(-2²-5²)'))
out.append((l3,3))

# ---- row 4 (WEEK 6): direction cosines and operations ----
p=(2,-3);q=(3,5);r=(1,1)
v=lambda a,s:(a[0]*s,a[1]*s)
add=lambda *vs:(sum(x[0] for x in vs),sum(x[1] for x in vs))
e1=add(v(p,2),q,v(r,3)); e2=add(v(p,3),v(q,-2)); assert e1==(10,2) and e2==(0,-19)
b4="""VECTORS: DIRECTION COSINES AND OPERATIONS

What you will learn: how to add, subtract and multiply vectors by numbers, and how to find a magnitude and direction cosines.

1. Operations on components
Add or subtract matching components; multiplying by a number multiplies every component.
Example 1. p = 2i - 3j, q = 3i + 5j, r = i + j.
(a) 2p + q + 3r = (4i - 6j) + (3i + 5j) + (3i + 3j) = 10i + 2j.
(b) 3p - 2q: 3p = 6i - 9j and 2q = 6i + 10j, so 3p - 2q = (6i - 9j) - (6i + 10j) = 0i - 19j = -19j.
(The multiplier applies to p = 2i - 3j, so 3p = 6i - 9j, not 9i - 9j.)

2. Vector between two points
If OC = a - b and OD = 2a + 3b, then CD = OD - OC = (2a + 3b) - (a - b) = a + 4b.
Example 2. With a = 2i + 3j and b = 3i - 2j: CD = (2i + 3j) + 4(3i - 2j) = 14i - 5j.

3. Direction cosines
If r = ai + bj has magnitude |r|, its direction cosines are cos α = a/|r| and cos β = b/|r|, where α and β are the angles r makes with the x- and y-axes. They satisfy cos²α + cos²β = 1.
Example 3. r1 = 7i + 3j and r2 = 2i - 5j.
r1 + r2 = 9i - 2j. |r1 + r2| = √(81 + 4) = √85. Direction cosines 9/√85 and -2/√85.
r2 - r1 = -5i - 8j. |r2 - r1| = √(25 + 64) = √89. Direction cosines -5/√89 and -8/√89.
"""
Q1=Q('FM3W6-Q1','Given p = 2i - 3j and q = 3i + 5j, find 4p - q and |4p - q|.','4p = 8i - 12j; 4p - q = 5i - 17j; |4p - q| = √(25 + 289) = √314 ≈ 17.72.',[('4p correct',1),('4p - q = 5i - 17j',1),('Magnitude √314',1)])
assert (8-3,-12-5)==(5,-17) and 25+289==314
Q2=Q('FM3W6-Q2','If OC = a - b and OD = 2a + 3b with a = i + 2j and b = 2i - j, find CD.','CD = a + 4b = (i + 2j) + 4(2i - j) = 9i - 2j.',[('CD = OD - OC',1),('CD = a + 4b',1),('9i - 2j',1)])
Q3=Q('FM3W6-Q3','Find the magnitude and direction cosines of 3i - 4j, and check that the squares of the direction cosines add to 1.','|r| = 5; cos α = 3/5, cos β = -4/5; 9/25 + 16/25 = 1.',[('Magnitude 5',1),('Both direction cosines',1),('Check sum 1',1)])
l4=lesson(SL,SUB,T,'T3-W06-VECTOR-OPERATIONS-DIRECTION-COSINES','Vector operations and direction cosines',['Add, subtract and scale vectors given in component form','Find the vector between two points in terms of given vectors','Calculate direction cosines and verify them'],b4,[Q1,Q2,Q3],P('Week 6; row 4; the source repeats Week 5 and computes 3p as 9i - 9j, giving a wrong 3p - 2q'))
out.append((l4,4))

# ---- row 5 (WEEK 8): angle between lines, forms of equation ----
t1=abs((2-(-0.25))/(1+(-0.25*2))); a1=deg(math.atan(t1)); assert abs(t1-4.5)<1e-9 and abs(a1-77.47)<0.01
t2=abs((0.2-1.5)/(1+0.3)); a2=deg(math.atan(t2)); assert abs(t2-1)<1e-9
t3=abs((3+2.5)/(1-7.5)); a3=deg(math.atan(t3))
b5=f"""ANGLE BETWEEN TWO LINES AND FORMS OF THE EQUATION OF A LINE

What you will learn: the acute angle between two lines, the gradient-intercept, gradient-point and two-point forms, and what happens with a vertical line.

1. Acute angle between two lines
For lines with gradients m1 and m2 the acute angle α satisfies tan α = |(m2 - m1)/(1 + m1m2)|, provided 1 + m1m2 is not 0 (if it is 0 the lines are perpendicular).
Example 1. Find the acute angle between x + 4y = 12 and y - 2x + 6 = 0. The gradients are -1/4 and 2. tan α = |(2 - (-1/4))/(1 + (-1/4)(2))| = |2.25/0.5| = 4.5, so α = {a1}°.

2. Gradient-intercept form
y = mx + c. Example 2. Gradient -2 and y-intercept 3 give y = -2x + 3.

3. Gradient-point form
y - y1 = m(x - x1). Example 3. Gradient -3/2 through (1, 4): y - 4 = -(3/2)(x - 1), so 2y - 8 = -3x + 3 and 3x + 2y = 11, that is y = -(3/2)x + 11/2. The y-intercept is 5½.

4. Two-point form
(y - y1)/(y2 - y1) = (x - x1)/(x2 - x1), valid when x1 is not equal to x2.
Example 4. Through (1, -1) and (-2, -13): (y + 1)/(-13 + 1) = (x - 1)/(-2 - 1), so (y + 1)/(-12) = (x - 1)/(-3), y + 1 = 4(x - 1), y = 4x - 5.
Vertical line: if x1 = x2 the denominator x2 - x1 is zero, so the formula cannot be used. The line is x = x1. Example 5. Through (-2, -3) and (-2, -13): x = -2 (gradient undefined).
"""
Q1=Q('FM3W8-Q1','Find the acute angle between the lines 2y = 3x - 8 and 5y = x + 7.',f'Gradients 3/2 and 1/5. tan α = |(1/5 - 3/2)/(1 + 3/10)| = |(-13/10)/(13/10)| = 1, so α = 45°.',[('Both gradients',1),('Correct substitution in tan α formula',1),('tan α = 1',1),('α = 45°',1)])
Q2=Q('FM3W8-Q2','Find the acute angle between the lines 2y = -5x + 8 and y = 3x - 7.',f'Gradients -5/2 and 3. tan α = |(3 + 5/2)/(1 - 15/2)| = |5.5/(-6.5)| = 11/13, so α = {a3}° (2 d.p.).',[('Both gradients',1),('tan α = 11/13',2),(f'α = {a3}°',1)])
Q3=Q('FM3W8-Q3','Find the equation of the line through (-1, 2) and (3, 0).','m = (0 - 2)/(3 + 1) = -1/2; y - 2 = -(1/2)(x + 1); y = -x/2 + 3/2, i.e. x + 2y = 3.',[('Gradient -1/2',1),('Correct substitution',1),('x + 2y = 3',1)])
Q4=Q('FM3W8-Q4','Find the equation of the line through (4, 7) and (4, -1), and explain why the two-point formula fails.','The x-coordinates are equal, so x2 - x1 = 0 and the formula divides by zero. The line is vertical: x = 4.',[('Notes x1 = x2',1),('States division by zero / undefined gradient',1),('x = 4',1)])
Q5=Q('FM3W8-Q5','Write the equation of the line with gradient 13/4 and y-intercept -6.','y = (13/4)x - 6.',[('y = mx + c form with correct m and c',1)])
l5=lesson(SL,SUB,T,'T3-W08-ANGLE-BETWEEN-LINES-EQUATION-FORMS','Angle between two lines and forms of the equation of a line',['Calculate the acute angle between two lines from their gradients','Write the equation of a line in gradient-intercept, gradient-point and two-point form','Recognise when the two-point form cannot be used (vertical line)'],b5,[Q1,Q2,Q3,Q4,Q5],P('Week 8; row 5'))
out.append((l5,5))
