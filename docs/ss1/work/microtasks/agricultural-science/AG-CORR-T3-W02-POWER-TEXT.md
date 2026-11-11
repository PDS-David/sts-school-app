# AG-CORR-T3-W02-POWER-TEXT — Agricultural Science, Third Term Week Two

Status: **IMPLEMENTED — approval and verification deferred**. The correction is bound to the actual parser/compiler row; it is not yet approved for learner delivery.

## Immutable source identity

- Archive: `SSS 1-20260507T072431Z-3-001.zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Actual parser/compiler row ID: `SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b`
- Body SHA-256: `57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b`

The exact identity was reproduced in CI by the hash-pinned archive, Mammoth extraction, actual `parseTopics` and `compilePackages` implementations. The source identity map was corrected where the actual parser differed from the earlier authoring-stage reproduction.

## Findings and intended wording

- Block 107: “Pair of working bullyolked together” is corrupted. The parallel lesson wording and animal-traction context support **“Pair of working bullocks yoked together.”**
- Block 138: “accusation of machineries” is a transcription error. The intended phrase is **“acquisition of machinery.”**
- The companion farm-power operations lesson now explicitly explains the high initial capital cost of acquiring machinery, alongside fuel/energy, spare parts, maintenance and trained operators.
- The replacement lesson uses the corrected animal-traction wording “working bullocks yoked together.”

## Learner-delivery correction

Added `CORR-AG-T3-W02-POWER-WATER-REPLACEMENT`:

- Source row: `SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b`
- Replacement: `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W02-HUMAN-ANIMAL-WATER-BIOGAS`
- The replacement is delivered instead of the corrupted original Week Two row only after approval/verification.
- The companion `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W02-FARM-POWER-OPERATIONS` remains separately delivered and now includes the machinery-acquisition cost explanation and revised solar-drying practice question.
- Archived source bytes remain unchanged.

## Evidence

- Exact source block hashes are recorded in queue task `AG-CORR-T3-W02-POWER-TEXT`.
- The parallel lesson-note copy uses “Pair of working bullocks yoked together” and “High capital investment is involved in the acquisition of machinery.” Other copies repeating the corrupted forms were not used as correction evidence.
- The correction is supported by the actual source context and the companion authored lessons.

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. Do not expose the original row or claim corrected learner delivery until the subject content is approved, the replacement is verified, and the Agricultural Science runtime adapter passes its later acceptance checks. No production import or classroom practical verification is claimed.
