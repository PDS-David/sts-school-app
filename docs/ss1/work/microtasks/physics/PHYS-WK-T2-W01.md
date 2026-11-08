# PHYS-WK-T2-W01 — Physics, Second Term Week One heat energy index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; verification remains DEFERRED.

## Source identity

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Parsed row: 0, WEEK ONE, “Heat Energy, Concept of Heat and Temperature and Effects of Heat”, 2,685 characters.
- Source body ID: `SS1-SRC-2c924c964660:BODY:d7ca9ce778fcf4db276b9157c50e7f76d9603963d74af1cbc69fde22fa582f3c`
- Source body SHA-256: `d7ca9ce778fcf4db276b9157c50e7f76d9603963d74af1cbc69fde22fa582f3c`
- Existing master lesson was present from PR #71; this task expanded it rather than creating a duplicate.

## Objective-level coverage

1. Define heat as energy transferred due to a temperature difference.
2. Define temperature and relate it to average particle kinetic energy.
3. Differentiate heat transfer from temperature, with correct units.
4. Convert Celsius and Kelvin using the SS1 approximation.
5. Describe effects of heating.
6. Identify practical uses of heat.
7. Distinguish thermionic emission from photoelectric emission.
8. Answer source assessment items and correct the phase-change misconception.

All eight entries are recorded as `IMPLEMENTED_EQUIVALENT`.

## Corrections applied

- Replaced the source's “relative motion of fluid” definition with heat as energy transferred because of a temperature difference.
- Corrected the statement equating heat with total internal energy. Bodies have internal energy; heat is energy in transfer.
- Corrected the claim that temperature occurs because of a “slight change of substance”.
- Added the “uses of heat” objective stated in the scheme title.
- Kept thermionic emission (heating) distinct from photoelectric emission (light).
- Corrected the assignment claim that extracting heat from water changes liquid to gas: heat removal can freeze water; heat addition can cause evaporation/boiling.
- Added deposition for gas-to-solid and identified Fahrenheit as a temperature unit.
- Retained the heat-capacity calculation as an extension, not a claimed source objective.

## Exercise mapping

- Differentiate heat and temperature → Q02.
- State five effects of heat → Q03.
- Temperature conversion → Q01.
- Practical uses of heat → Q06.
- Not a usual direct effect of supplying heat → Q07.
- Temperature unit exception → Q08.
- Correct the erroneous liquid-water phase-change statement → Q09.
- Gas-to-solid process → Q10.
- Fahrenheit unit → Q11.
- Thermionic vs photoelectric emission → Q12.
- Heat gained calculation is an extension → Q04.
- Bucket/cup internal energy explanation → Q05.

## Source ambiguity

The source MCQ's use of “contraction” as a distractor is bounded in the replacement to “usual direct effect of supplying heat”; the generalisation is not absolute for all materials/conditions. This is recorded in `PHYS-T2-W01-SOURCE-MCQ-AMBIGUITY` as a non-blocking open item.

## External references

- Federal Ministry of Education, Nigeria, Inspire, “Heat Energy | SS1 Physics”: https://inspire.education.gov.ng/lessons/9830/preview
- EduPodia, “Second Term E-Learning Note — Physics SS1”, Week One: https://edupodia.com/wp-content/uploads/2020/12/SECOND-TERM-SS1-PHYSIC.pdf
- Ecolebooks Nigeria, “Week 1 – SS1 Second Term Physics Notes”: https://ecolebooks.com/nigeria/posts/week-1-ss1-second-term-physics-notes/

No external wording or exercises are copied.

## Files changed

- `backend/src/db/ss1/subjects/physics.json`
- `docs/ss1/work/microtasks/physics/QUEUE.json`
- `docs/ss1/work/microtasks/physics/PHYS-WK-T2-W01.md`

## Verification boundary

All new calculations and answer keys were checked during authoring. No schema test, compiler/plan, typecheck, importer, database or device test was run. Approval remains PENDING; verification remains DEFERRED.
