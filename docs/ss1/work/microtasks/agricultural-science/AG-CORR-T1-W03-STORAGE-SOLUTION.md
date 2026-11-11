# AG-CORR-T1-W03-STORAGE-SOLUTION — Agricultural Science, First Term Week Three

Status: **IMPLEMENTED — exact source-row binding and replacement lesson authored; approval and verification deferred.**

## Immutable source identity

- Source ID: `SS1-SRC-7aa642b0085b`
- Archive member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`
- Actual parser/compiler row: `SS1-SRC-7aa642b0085b:BODY:de6febf42e9195e6171f87f05840f7ac0d5a7337820ec98392670ebc3b1485aa`
- Direct-body block 235 SHA-256: `ee1402a5ed7bfb9f2941dcfdcf12c2c57e6c4babcf4fa0e6ca1121ba6734bfbd`

The exact source row identity is now reproduced in CI using the hash-pinned archive, Mammoth extraction, actual `parseTopics` and `compilePackages`. The regression test pins all 30 original teaching-row IDs.

## Recovered source correction

The original block 235 reads: “(b) Government should such as millers and threshers should be made available to farmers at subsidized rate.”

Two parallel SS1 First Term Agricultural Science lesson notes agree on the intended proposition:
- Lessonnotes.com, “Problems of Agricultural Development and Possible Solutions”: government should make processing facilities such as millers and threshers available at a subsidised rate. https://lessonnotes.com/v2/senior-secondary-school-1/lesson-notes-for-senior-secondary-1-1st-term-week-2-agricultural-science-topic-is-roblems-of-agricultural-development-and-possible-.html
- Lessonnotes.ng, “Problems of Agricultural Development and Possible Solutions – SS1 Agric Science”: processing machines such as millers and threshers should be supplied at a subsidised rate. https://lessonnotes.ng/ss1/agricultural-science/problems-of-agricultural-development-and-possible-solutions/

Internal corroboration in the original DOCX: block 432 mentions processing facilities such as millers and shellers; block 500 mentions grinders and millers as processing facilities.

**Corrected learner-facing proposition:** “Government should make processing machines such as millers and threshers available to farmers at a subsidised rate.”

This repairs the sentence without changing its substantive meaning. It does not claim the original DOCX contained the corrected wording; archived source text remains unchanged.

## Learner-delivery correction

Added `CORR-AG-T1-W03-STORAGE-REPLACEMENT`:

- Original row: `SS1-SRC-7aa642b0085b:BODY:de6febf42e9195e6171f87f05840f7ac0d5a7337820ec98392670ebc3b1485aa`
- Replacement lesson: `SUP-SS1-AGRICULTURAL-SCIENCE-T1-W03-AGRICULTURAL-DEVELOPMENT`
- The replacement covers the source's major agricultural-development problems and solutions and uses the corrected processing-machinery sentence.
- It also corrects the separate overstatement that no storage facilities exist: storage facilities and methods exist, but capacity, condition, affordability, geographic access and cold-chain services remain inadequate or uneven for many farmers, especially for perishable produce.
- No source bytes were edited.

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. The learner route withholds the original source row until package and replacement approval/verification gates pass. The separate agricultural-credit options item remains under review; no loan rates or unsupported credit options are introduced. No production import, authenticated learner-route observation or field-practical verification is claimed.
