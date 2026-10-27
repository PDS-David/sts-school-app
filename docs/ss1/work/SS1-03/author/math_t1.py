from lib import *
import math
SID='SS1-SRC-0c9004137f95'; MEM='SSS 1/1st Term SS1_/MATHss1.docx'; SUB='Mathematics'; T='1st Term'
def P(loc): return [prov(SID,MEM,loc)]
out=[]  # (lesson, source_row_index)

# ---------- Week 1 : divisibility tests and integer operations ----------
def divs(n): return [d for d in (2,3,4,5,6,8,9,10,11) if n%d==0]
def alt11(n):
    s=str(n)[::-1]; return sum(int(c) for c in s[0::2])-sum(int(c) for c in s[1::2])
nums=[3591,2408,7700,18054,2032,1827,23624,468]
ans1='\n'.join(f"{n}: divisible by {', '.join(map(str,divs(n))) or 'none of these'}" for n in nums)
assert 7168%7==0 and 4312+504+614+24==5454 and 5412*99==535788
b1=f"""REVISION AND BASIC OPERATIONS ON INTEGERS

What you will learn: how to test quickly whether one whole number divides another, and how to add, subtract, multiply and divide positive and negative integers correctly.

1. Integers
Integers are the whole numbers and their negatives: ... -3, -2, -1, 0, 1, 2, 3 ... Fractions and decimals such as 1.5 or 3/5 are not integers.

2. Divisibility tests
A number is divisible by:
- 2 if its last digit is 0, 2, 4, 6 or 8.
- 3 if the sum of its digits is divisible by 3.
- 4 if the number made by its last two digits is divisible by 4.
- 5 if its last digit is 0 or 5.
- 6 if it is divisible by both 2 and 3.
- 8 if the number made by its last three digits is divisible by 8.
- 9 if the sum of its digits is divisible by 9.
- 10 if its last digit is 0.
- 11 if (sum of digits in odd places) - (sum of digits in even places) is 0 or a multiple of 11.
- 7: there is a test. Remove the last digit, double it, and subtract it from the rest of the number. If the result is divisible by 7 (or is 0), so is the original. Repeat if the result is still large.

Worked example 1. Test 7168.
Last digit 8 is even, so it is divisible by 2. Last two digits 68 = 4 x 17, so by 4. Last three digits 168 = 8 x 21, so by 8. Digit sum 7+1+6+8 = 22, not divisible by 3 or 9, so not by 3, 6 or 9. It does not end in 0 or 5, so not by 5 or 10. For 11: 8 - 6 + 1 - 7 = -4, not a multiple of 11. For 7: 716 - 2 x 8 = 700, which is divisible by 7, so 7168 is divisible by 7. Answer: 2, 4, 7 and 8.

Worked example 2. Which of 2, 3, 4, 5, 6, 8, 9, 10, 11 divide 35120?
Ends in 0: divisible by 2, 5 and 10. Last two digits 20 = 4 x 5: divisible by 4. Last three digits 120 = 8 x 15: divisible by 8. Digit sum 3+5+1+2+0 = 11: not divisible by 3, 6 or 9. For 11: 0 - 2 + 1 - 5 + 3 = -3: not divisible. Answer: 2, 4, 5, 8 and 10.

Worked example 3. Is 24739 divisible by 11?
Digits from the right: 9, 3, 7, 4, 2. Odd places: 9+7+2 = 18. Even places: 3+4 = 7. Difference 18 - 7 = 11, a multiple of 11. So yes: 24739 = 11 x 2249.

3. Operations on integers
Addition and subtraction of larger numbers: write the numbers in columns with units under units, tens under tens, and carry or borrow carefully.
- 961 + 86 + 422 = 1469.
- 4312 + 504 + 614 + 24 = 5454 (units 2+4+4+4 = 14, write 4 carry 1; tens 1+0+1+2+1 = 5; hundreds 3+5+6 = 14, write 4 carry 1; thousands 4+1 = 5).
- 306 - 287 = 19.
- 452 x 219 = 452 x 200 + 452 x 19 = 90400 + 8588 = 98988.

Signs: subtracting a negative number adds its positive. Two numbers with the same sign multiplied or divided give a positive result; different signs give a negative result.
- 8 - (+7) = 8 - 7 = 1.
- -5 - (-9) = -5 + 9 = 4.
- ((-8) x (-12)) / (-10) = 96 / (-10) = -9.6.

Common mistakes: forgetting that 9 needs the digit sum divisible by 9 (divisible by 3 alone is not enough); dropping a carried digit in column addition; losing a minus sign when two negatives meet.
"""
Q1=Q('M1W1-Q1','For each of these numbers state which of 2, 3, 4, 5, 6, 8, 9, 10, 11 divide it exactly: 3591, 2408, 7700, 18054, 2032, 1827, 23624, 468.',ans1+'\n(Shown using the tests above; each can be confirmed by direct division.)',[(f'Correct list for {n}',1) for n in nums])
Q2=Q('M1W1-Q2','Evaluate: (a) 8 - (+7)  (b) -5 - (-9)  (c) ((-18) x (-5) x 3) / (9 x (-2))  (d) (12 x (-15) x (-9)) / ((5 - 2) x (-3) x (-4)).',
 f'(a) 1  (b) 4  (c) 270 / (-18) = -15  (d) 1620 / 36 = 45',[('(a) correct',1),('(b) correct',1),('(c) numerator 270 and correct sign',1),('(c) final -15',1),('(d) numerator 1620 and denominator 36',1),('(d) final 45',1)])
Q3=Q('M1W1-Q3','Find (a) 4312 + 504 + 614 + 24  (b) 5412 x 99 (hint: 5412 x 100 - 5412)  (c) 867 / 17.','(a) 5454  (b) 541200 - 5412 = 535788  (c) 51',[('(a) 5454',1),('(b) method',1),('(b) 535788',1),('(c) 51',1)])
assert 867/17==51
out.append((lesson('MATHEMATICS',SUB,T,'T1-W01-DIVISIBILITY-INTEGERS','Revision and basic operations on integers (divisibility tests)',
 ['Apply the divisibility tests for 2, 3, 4, 5, 6, 7, 8, 9, 10 and 11 to a whole number','Add, subtract, multiply and divide integers, including negative integers, with correct signs'],b1,[Q1,Q2,Q3],P('Week 1 of the 1st-term scheme; row 0')),0))

# ---------- Week 3 : arithmetic in other bases ----------
def d10(s,b): return int(s,b)
assert d10('174',8)+d10('233',8)==d10('427',8)
a=d10('2311',4)-d10('213',4); assert to_base(a,4)=='2032'
p=d10('214',5)*d10('23',5); assert to_base(p,5)=='11032'
X=to_base(d10('4103',6)-d10('2112',6),6)
b3=f"""OPERATIONS ON NUMBERS IN OTHER BASES

What you will learn: rules for working in a base, how to add, subtract and multiply numbers in the same base, how to find an unknown base, and how binary is used to encode letters.

1. Rules
- In base b the only digits allowed are 0, 1, ..., b-1. In base 5 the digit 5 never appears; in base 2 only 0 and 1 appear.
- Numbers in the same base can be added, subtracted and multiplied directly. Numbers in different bases are first converted to base ten (or to one common base).
- When you add and a column reaches b or more, write the remainder after dividing by b and carry the quotient. When you subtract and must borrow, the borrowed 1 is worth b (not 10) in the column you borrow into.

2. Worked examples
Example 1. Add 174 and 233 in base eight.
Units: 4 + 3 = 7 (less than 8, write 7). Eights: 7 + 3 = 10 = 1 x 8 + 2, write 2 carry 1. Sixty-fours: 1 + 2 + 1 = 4. Answer: 427 (base 8). Check in base ten: 124 + 155 = 279 and 4 x 64 + 2 x 8 + 7 = 279.

Example 2. Simplify 2311 - 213 in base four.
Convert: 2311 (base 4) = 2 x 64 + 3 x 16 + 1 x 4 + 1 = 181. 213 (base 4) = 2 x 16 + 1 x 4 + 3 = 39. 181 - 39 = 142. Convert back: 142 = 2 x 64 + 0 x 16 + 3 x 4 + 2, so the answer is 2032 (base 4).

Example 3. Multiply 214 by 23 in base five.
214 (base 5) = 59 and 23 (base 5) = 13. 59 x 13 = 767. Convert: 767 = 1 x 625 + 1 x 125 + 0 x 25 + 3 x 5 + 2, so 11032 (base 5).

Example 4. If 104 in base x equals 68 in base ten, find x.
x² + 0 + 4 = 68, so x² = 64 and x = 8. A base is a positive whole number greater than 1 and larger than every digit used (here 4), so only x = 8 is allowed; the value -8 is rejected.

3. Binary codes for letters
Computers store letters as numbers, written in binary. If A = 1, B = 2, C = 3, ... Z = 26, each letter can be written with five binary digits: A = 00001, B = 00010, C = 00011, P = 10000, Z = 11010. In a yes/no code, Yes = 1 and No = 0.

Example 5. Write "HI" in this five-digit code. H is the 8th letter: 8 = 1000 in binary, so 01000. I is the 9th letter: 9 = 1001, so 01001. "HI" = 01000 01001.
"""
Q1=Q('M1W3-Q1','(a) Add 3452 and 2631 in base seven. (b) Subtract 506 from 614 in base eight. (c) Find the base y if 123 in base y equals 83 in base ten.',
 f"(a) {to_base(d10('3452',7)+d10('2631',7),7)} (base 7)  (b) {to_base(d10('614',8)-d10('506',8),8)} (base 8)  (c) y² + 2y + 3 = 83, y² + 2y - 80 = 0, (y - 8)(y + 10) = 0, so y = 8 (reject -10)",
 [('(a) correct method with carrying',1),('(a) correct answer',1),('(b) correct method with borrowing',1),('(b) correct answer',1),('(c) forms y² + 2y + 3 = 83',1),('(c) y = 8 with -10 rejected',1)])
Q2=Q('M1W3-Q2','Find x if 4103 (base six) = 2112 (base six) + x (base six).',f"x = {X} (base 6): x = 4103 - 2112 with borrowing in base six; check 4103 (base 6) = {d10('4103',6)} and 2112 (base 6) = {d10('2112',6)}, difference {d10('4103',6)-d10('2112',6)} = {X} (base 6).",[('Writes x = 4103 - 2112 in base six',1),('Correct borrowing in base six',1),('Correct answer in base six',1)])
assert X=='1551'

def code(w): return ' '.join(format(ord(c)-64,'05b') for c in w if c.isalpha())
Q3=Q('M1W3-Q3','Using A = 1, B = 2, ... Z = 26 with five binary digits per letter, write "I LOVE MATHEMATICS" in code.',code('ILOVEMATHEMATICS')+'  (five digits per letter; spaces between words are not coded)',[('Correct letter values',1),('Correct binary conversion for at least 10 letters',1),('All 16 letters correct',1)])
out.append((lesson('MATHEMATICS',SUB,T,'T1-W03-BASE-OPERATIONS','Operations on numbers in other bases and binary codes',
 ['Add, subtract and multiply numbers expressed in the same base','Find an unknown base from an equation, rejecting impossible values','Represent letters using binary codes'],b3,[Q1,Q2,Q3],P('Week 3 of the 1st-term scheme; row 2')),2))

# ---------- Week 4 : modular arithmetic ----------
assert (15%4,102%4,(42+28)%8,(54+25)%5,(-5)%6,(-17)%10,(-75)%7,(16*7)%5,(21*65)%4)==(3,2,6,4,1,3,2,2,1)
sol=[x for x in range(6) if (2*x+3)%6==1]; assert sol==[2,5]
assert [x for x in range(7) if (3*x)%7==5]==[4]
b4=f"""MODULAR ARITHMETIC

What you will learn: how to reduce a number to its remainder in a given modulus, add, subtract and multiply in a modulus, and solve simple modular equations.

1. Meaning
Modular arithmetic describes repeating (cyclic) situations such as hours on a clock, days of the week or months of the year. Working modulo n means we only care about the remainder after dividing by n. We write a = r (mod n) when a and r leave the same remainder on division by n, so a - r is a multiple of n. The possible results are 0, 1, ..., n-1. Any integer, positive or negative, can be reduced; the number being reduced does not have to be smaller than the modulus.

2. Reducing
- 15 (mod 4): 15 = 3 x 4 + 3, so 3.
- 102 (mod 4): 102 = 25 x 4 + 2, so 2.
- Clock: the short hand points to 5. After 30 hours it points to (5 + 30) mod 12 = 35 mod 12 = 11.
Negative numbers: add multiples of n until the result is between 0 and n-1.
- -5 (mod 6) = -5 + 6 = 1.   - -17 (mod 10) = -17 + 20 = 3.   - -75 (mod 7) = -75 + 77 = 2.

3. Addition, subtraction, multiplication
Add, subtract or multiply as usual, then reduce.
- (42 + 28) mod 8 = 70 mod 8 = 6.   - (54 + 25) mod 5 = 79 mod 5 = 4.
- (16 x 7) mod 5 = 112 mod 5 = 2.   - (21 x 65) mod 4 = 1365 mod 4 = 1.
Note: 16 x 7 = 112 (not 117); the answer 2 only happens to be correct because 117 mod 5 is also 2. Always check the product.

4. Equations
Example 1. Solve 3x = 5 (mod 7). Test x = 0 to 6, or add 7 to the right side until it divides by 3: 5, 12. 3x = 12 gives x = 4. Check: 3 x 4 = 12 = 5 (mod 7).
Example 2. Solve 2x + 3 = 1 (mod 6). Subtract 3: 2x = -2 = 4 (mod 6). Test x = 0..5: x = 2 gives 4, x = 5 gives 10 = 4 (mod 6). Both work, so x = 2 or x = 5 (mod 6). Check: 2 x 5 + 3 = 13 = 1 (mod 6). When the coefficient of x and the modulus share a factor (here 2 and 6), there can be more than one solution.
"""
Q1=Q('M1W4-Q1','Simplify in modulo 4: (a) 62 (b) 102 (c) -56 (d) -78 (e) -202.',f"(a) {62%4} (b) {102%4} (c) {(-56)%4} (d) {(-78)%4} (e) {(-202)%4}",[(f'{x} correct',1) for x in 'abcde'])
assert [62%4,102%4,(-56)%4,(-78)%4,(-202)%4]==[2,2,0,2,2]
Q2=Q('M1W4-Q2','A toy car starts at 0 and runs around a circular track of circumference 2 m. How far along the track from the start is it after 6 m, 15 m, 21 m and 87 m?','Work modulo 2: 6 mod 2 = 0 m; 15 mod 2 = 1 m; 21 mod 2 = 1 m; 87 mod 2 = 1 m.',[('Identifies modulus 2',1),('6 m gives 0',1),('15 m, 21 m and 87 m each give 1',2)])
Q3=Q('M1W4-Q3','Solve in each modulus: (a) 3x + 4 = 7 (mod 8) (b) 4x - 3 = 6 (mod 7).',
 f"(a) {[x for x in range(8) if (3*x+4)%8==7]} (b) {[x for x in range(7) if (4*x-3)%7==6]}",[('(a) method',1),('(a) x = 1 (mod 8)',1),('(b) method',1),('(b) x = 4 (mod 7)',1)])
assert [x for x in range(8) if (3*x+4)%8==7]==[1] and [x for x in range(7) if (4*x-3)%7==6]==[4]
out.append((lesson('MATHEMATICS',SUB,T,'T1-W04-MODULAR-ARITHMETIC','Modular arithmetic: reducing, operations and equations',
 ['Reduce positive and negative integers modulo n','Add, subtract and multiply in a modulus','Solve linear equations in a modulus and recognise when there is more than one solution'],b4,[Q1,Q2,Q3],P('Week 4 of the 1st-term scheme; row 3')),3))

# ---------- Week 5 : standard form and approximation ----------
b5="""STANDARD FORM AND APPROXIMATION

What you will learn: how to write numbers in standard form, calculate with them, and round to a given place value, decimal places or significant figures.

1. Standard form
A number is in standard form when written as a x 10ⁿ, where 1 <= a < 10 and n is an integer (positive, zero or negative). n tells how many places the decimal point moves.
- 9 = 9 x 10⁰   - 54.6 = 5.46 x 10¹   - 570200 = 5.702 x 10⁵
- 0.02 = 2 x 10⁻²   - 0.000175 = 1.75 x 10⁻⁴

2. Adding and subtracting
Write each number in ordinary form (or give both the same power of ten), calculate, then convert back.
- 5.14 x 10⁷ + 2.842 x 10⁵ = 51 400 000 + 284 200 = 51 684 200 = 5.16842 x 10⁷.
- 5.24 x 10⁻⁵ - 4.33 x 10⁻⁶ = 0.0000524 - 0.00000433 = 0.00004807 = 4.807 x 10⁻⁵.

3. Multiplying and dividing
Multiply or divide the numbers in front, and add or subtract the powers of ten.
- (8.222 x 10⁻⁴) x (6.32 x 10⁴) = 51.96304 x 10⁰ = 5.196304 x 10¹.
- (2.8 x 10⁸) / (1.5 x 10⁴) = 1.8667 x 10⁴ (to 5 s.f.).

4. Approximation
Rounding to a place value: look at the digit to the right. If it is 5 or more, round up; otherwise keep the digit.
- 7562: nearest ten 7560; nearest hundred 7600; nearest thousand 8000.
- 907235: nearest ten 907240; nearest hundred 907200; nearest thousand 907000.
- 8991: nearest ten 8990; nearest hundred 9000; nearest thousand 9000.
Decimal places count digits after the decimal point; significant figures count from the first non-zero digit.
- 799.8094 to 1 s.f. = 800; to 3 s.f. = 800 (the digits 8, 0, 0 are the three significant figures); to 2 d.p. = 799.81.
- 0.0014698 to 3 d.p. = 0.001; to 2 s.f. = 0.0015.
"""
chk=lambda x:float(x)
assert abs(5.14e7+2.842e5-5.16842e7)<1e-3 and abs((5.24e-5-4.33e-6)-4.807e-5)<1e-12 and abs(8.222e-4*6.32e4-51.96304)<1e-9 and round(2.8e8/1.5e4,0)==18667
Q1=Q('M1W5-Q1','Write in standard form: (a) 7560 (b) 7560000000 (c) 0.00756 (d) 0.000000756.','(a) 7.56 x 10³ (b) 7.56 x 10⁹ (c) 7.56 x 10⁻³ (d) 7.56 x 10⁻⁷',[(f'({c}) correct',1) for c in 'abcd'])
Q2=Q('M1W5-Q2','Calculate, leaving the answer in standard form: (a) (4 x 10⁵) x (2.6 x 10⁻²) (b) (6.4 x 10⁷) / (8 x 10³) (c) (9.05 x 10⁴) + (6.5 x 10³).',
 '(a) 10.4 x 10³ = 1.04 x 10⁴ (b) 0.8 x 10⁴ = 8 x 10³ (c) 90500 + 6500 = 97000 = 9.7 x 10⁴',[('(a) product 10.4 and powers added',1),('(a) converted to 1.04 x 10⁴',1),('(b) quotient 0.8 and powers subtracted',1),('(b) 8 x 10³',1),('(c) 97000',1),('(c) 9.7 x 10⁴',1)])
assert 4e5*2.6e-2==10400 and 6.4e7/8e3==8000 and 9.05e4+6.5e3==97000
Q3=Q('M1W5-Q3','Express each number to (i) 1 s.f. (ii) 3 s.f. (iii) 2 d.p.: (a) 799.8094 (b) 6.3006 (c) 0.0014698.','(a) 800; 800; 799.81 (b) 6; 6.30; 6.30 (c) 0.001; 0.00147; 0.00',[('(a) three correct',1),('(a) 3 s.f. shown as 800 with trailing zeros as needed',1),('(b) three correct',1),('(c) three correct',1)])
out.append((lesson('MATHEMATICS',SUB,T,'T1-W05-STANDARD-FORM','Standard form and approximation',
 ['Write numbers in standard form a x 10ⁿ with 1 <= a < 10','Add, subtract, multiply and divide numbers in standard form','Round numbers to a place value, decimal places and significant figures'],b5,[Q1,Q2,Q3],P('Week 5 of the 1st-term scheme; row 4')),4))

# ---------- Week 6 : indices ----------
assert Fraction(8,27)**1==Fraction(8,27)
b6="""INDICES (POWERS)

What you will learn: the laws of indices and how to use them with positive, zero, negative and fractional indices.

1. Meaning
aⁿ means a multiplied by itself n times. a is the base and n is the index (power).

2. Laws of indices (a, b not zero where division occurs)
1. aᵐ x aⁿ = aᵐ⁺ⁿ
2. aᵐ / aⁿ = aᵐ⁻ⁿ
3. (aᵐ)ⁿ = aᵐⁿ
4. a⁰ = 1
5. a⁻ⁿ = 1 / aⁿ
6. a^(1/n) = the n-th root of a, and a^(m/n) = (the n-th root of a)ᵐ
7. (ab)ⁿ = aⁿbⁿ and (a/b)ⁿ = aⁿ / bⁿ

3. Worked examples
Example 1. 7⁶ x 7² = 7⁶⁺² = 7⁸.
Example 2. 5x² x 4x⁰ x 2x⁻⁶ = (5 x 4 x 2) x^(2 + 0 - 6) = 40x⁻⁴ = 40 / x⁴.
Example 3. 16r¹¹ / 4r⁷ = 4r⁴.
Example 4. (2³)⁵ = 2¹⁵.
Example 5. (8/27)^(-2/3): a negative index turns the fraction over, so = (27/8)^(2/3) = ((cube root of 27/8))² = (3/2)² = 9/4 = 2.25.
Example 6. Simplify √(25x⁴/16) x (x/2)⁻³. √(25x⁴/16) = 5x²/4. (x/2)⁻³ = (2/x)³ = 8/x³. Product = (5x²/4) x (8/x³) = 10/x.
Example 7. Simplify 3x^(1/3) y^(1/2) / (6x^(1/6) y^(3/4)). Divide numbers: 3/6 = 1/2. Subtract indices: x^(1/3 - 1/6) = x^(1/6); y^(1/2 - 3/4) = y^(-1/4). Result: x^(1/6) / (2y^(1/4)).

Common mistakes: adding indices when bases are multiplied inside brackets (use law 3 for a power of a power); writing 40x⁻⁴ as -40x⁴ (a negative index does not make the number negative).
"""
assert Fraction(27,8)**1 and (3/2)**2==2.25
Q1=Q('M1W6-Q1','Evaluate without a calculator: (a) 27^(-2/3) (b) 125^(2/3) x 25⁰ (c) 4^(3/2).','(a) 1/9 (b) 25 x 1 = 25 (c) 8',[('(a) uses reciprocal and cube root giving 1/9',2),('(b) 25',1),('(c) 8',1)])
assert round(27**(-2/3),6)==round(1/9,6) and round(125**(2/3))==25 and 4**1.5==8
Q2=Q('M1W6-Q2','Simplify: (a) -10a²b³ / (-5a^(3/2) b^(-1/2)) (b) 27^(m+2) x 4^m / 6^(2m).','(a) 2a^(1/2) b^(7/2) (b) 27^(m+2) x 4^m / 36^m = 3^(3m+6) x 2^(2m) / (2^(2m) x 3^(2m)) = 3^(m+6)',[('(a) coefficient 2',1),('(a) a^(1/2)b^(7/2)',1),('(b) expresses in prime bases 3 and 2',1),('(b) 3^(m+6)',1)])
Q3=Q('M1W6-Q3','Find the value of x: (a) 2^x = 32 (b) 9^x = 1/27.','(a) x = 5 (b) 3^(2x) = 3^(-3), so x = -3/2',[('(a) x = 5',1),('(b) same base 3',1),('(b) x = -3/2',1)])
out.append((lesson('MATHEMATICS',SUB,T,'T1-W06-INDICES','Indices: laws and positive, zero, negative and fractional powers',
 ['State and apply the laws of indices','Evaluate expressions with zero, negative and fractional indices','Solve simple equations in which the unknown is an index'],b6,[Q1,Q2,Q3],P('Week 6 of the 1st-term scheme; row 5; the delivered text of this row omits all index laws')),5))

# ---------- Week 10 : equations, change of subject, variation ----------
import sympy as sp
x,g,l,T_=sp.symbols('x g l T',positive=True)
assert sp.simplify(sp.solve(sp.Eq(T_,2*sp.pi*sp.sqrt(l/g)),g)[0]-4*sp.pi**2*l/T_**2)==0
s_k=40; s_a=sp.Rational(30-40,8); assert s_k+s_a*10==sp.Rational(55,2) and (24-s_k)/s_a==sp.Rational(64,5)
b10="""SIMPLE EQUATIONS, CHANGE OF SUBJECT AND VARIATION

What you will learn: solve simple equations, rearrange formulae, and solve problems on direct, inverse, joint and partial variation.

1. Simple equations
Do the same operation to both sides.
- p - 7 = 24: add 7, p = 31.
- 5(c + 2) - 3(3c - 5) = 1: 5c + 10 - 9c + 15 = 1; -4c + 25 = 1; -4c = -24; c = 6.

2. Change of subject
Isolate the required letter using inverse operations.
- A = ax + b, make x the subject: A - b = ax, so x = (A - b)/a.
- T = a + (n - 1)d, make a the subject: a = T - (n - 1)d.
- T = 2π√(l/g), make g the subject. Divide by 2π: T/(2π) = √(l/g). Square both sides: T²/(4π²) = l/g. Cross-multiply: gT² = 4π²l. So g = 4π²l / T². (A frequent mistake is to forget that squaring also squares T and 2π.)

3. Variation
Direct: y varies as x, y = kx. Inverse: y varies as 1/x, y = k/x. Joint: y varies as x and z, y = kxz. Partial: part constant and part varying, for example x = k + ay. To solve: write the equation with k, substitute the given values to find k, then use the equation.

Example 1 (direct). Cost is proportional to the number of bottles; 10 bottles cost ₦400. N = kC with 10 = 400k so k = 1/40. For 18 bottles: C = 40N = ₦720. ₦200 buys N = 200/40 = 5 bottles.
Example 2 (inverse). y is inversely proportional to x and y = 9 when x = 4. 9 = k/4, k = 36, y = 36/x.
Example 3 (joint). y varies jointly as x and z, and y = 30 when x = 2, z = 3. y = kxz so 30 = k x 2 x 3 = 6k, k = 5, and y = 5xz. (Check: 5 x 2 x 3 = 30.)
Example 4 (partial). x is partly constant and partly varies as y. When y = 5, x = 7 and when y = 7, x = 8. x = k + ay gives 7 = k + 5a and 8 = k + 7a. Subtract: 1 = 2a, so a = 1/2. Then k = 7 - 5/2 = 9/2. Law: x = 9/2 + y/2, or 2x = 9 + y. When y = 11: 2x = 20, x = 10.
"""
Q1=Q('M1W10-Q1','Solve: (a) 8y - 19 = 5 + 3y (b) 2x/3 + x/4 = 6.','(a) 5y = 24, y = 24/5 = 4.8 (b) multiply by 12: 8x + 3x = 72, 11x = 72, x = 72/11',[('(a) collects terms 5y = 24',1),('(a) y = 4.8',1),('(b) multiplies by 12',1),('(b) x = 72/11',1)])
assert sp.solve(sp.Eq(8*sp.Symbol('y')-19,5+3*sp.Symbol('y')))==[sp.Rational(24,5)] and sp.solve(sp.Eq(2*x/3+x/4,6))==[sp.Rational(72,11)]
Q2=Q('M1W10-Q2','Make g the subject of T = 2π√(l/g), then find g (to 2 d.p.) when T = 2 s and l = 1 m (use π = 3.142).',f'g = 4π²l/T². With π = 3.142: g = 4 x 9.872 x 1 / 4 = 9.87 m/s² (to 2 d.p.)',[('Squares both sides correctly',1),('g = 4π²l/T²',2),('Substitutes correctly',1),('9.87 with unit',1)])
assert abs(4*3.142**2*1/4-9.872)<0.01
Q3=Q('M1W10-Q3','The speed s km/h of a car is partly constant and partly varies as the time t for which the brake is applied. When t = 0, s = 40 and when t = 8, s = 30. Find s when t = 10 and t when s = 24.','s = k + at; k = 40; 30 = 40 + 8a so a = -5/4; s = 40 - 5t/4. When t = 10: s = 27.5 km/h. When s = 24: 5t/4 = 16, t = 12.8.',[('Sets s = k + at',1),('k = 40',1),('a = -5/4',1),('s = 27.5',1),('t = 12.8',1)])
Q4=Q('M1W10-Q4','The price of a material varies inversely as the number of people demanding it. With 80 people the price is ₦3.50. Find the price when there are 56 people.','P = k/n; k = 3.5 x 80 = 280; P = 280/56 = ₦5.00',[('Inverse relation P = k/n',1),('k = 280',1),('Price ₦5.00',1)])
assert 3.5*80/56==5.0
out.append((lesson('MATHEMATICS',SUB,T,'T1-W10-EQUATIONS-VARIATION','Simple equations, change of subject and variation',
 ['Solve linear equations including fractions','Make a letter the subject of a formula, including formulae with roots','Set up and solve direct, inverse, joint and partial variation problems'],b10,[Q1,Q2,Q3,Q4],P('Week 10 of the 1st-term scheme; row 9')),9))
