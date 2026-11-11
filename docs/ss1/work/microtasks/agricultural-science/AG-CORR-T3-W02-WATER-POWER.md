# AG-CORR-T3-W02-WATER-POWER — Agricultural Science, Third Term Week Two

Status: **IMPLEMENTED — approval and verification deferred**. The correction is bound to the actual parser/compiler row; it is not yet approved for learner delivery.

## Immutable source identity

- Archive: `SSS 1-20260507T072431Z-3-001.zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Actual parser/compiler row ID: `SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b`
- Body SHA-256: `57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b`

The exact identity was reproduced in CI by reading the hash-pinned archive member, running Mammoth extraction, applying source rules, and calling the actual `parseTopics` and `compilePackages` implementations. The regression test pins all 30 original teaching-row IDs.

## Finding

The source defines hydropower as energy from flowing water driving turbines (block 210) and correctly describes turbines/waterwheels generating electricity (block 216). Blocks 217–220 describe other water-resource uses: waterway transport, washing/processing produce, seed germination/crop growth and photosynthesis. These are important agricultural uses of water, but they are not hydropower.

## Learner-delivery correction

Added `CORR-AG-T3-W02-POWER-WATER-REPLACEMENT` to the subject package:

- Original row: `SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b`
- Replacement lesson: `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W02-HUMAN-ANIMAL-WATER-BIOGAS`
- The replacement explains the moving/falling-water → turbine → generator sequence and separately identifies transport, produce processing, germination and photosynthesis as water-resource uses.
- The companion `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W02-FARM-POWER-OPERATIONS` remains separately delivered and covers mechanical, electrical, wind and solar power. Together, the two lessons cover all eight farm-power sources.
- Original DOCX bytes are unchanged.

## Evidence

- U.S. Energy Information Administration, *Hydropower explained*: hydropower uses moving water to generate electricity through turbines/generators.
- U.S. Department of Energy, *How Hydropower Works*: moving water turns a turbine connected to a generator.
- The source's own blocks 210 and 216 support the same definition; blocks 217–220 are the misclassified water-resource uses.

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. The learner route must withhold the original source row until the replacement has genuine subject-content approval and verification. No production import, authenticated learner-route observation or classroom practical verification is claimed.
