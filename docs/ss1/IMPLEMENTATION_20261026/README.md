# SS1 implementation prompts —26October2026

## Access these prompts before their PR is merged

These instructions are published on `ss1/implementation-prompts-20261026` (PR65). If `docs/ss1/IMPLEMENTATION_20261026/` is not on master yet, create your isolated task branch from current master, then fetch and copy ONLY this documentation directory:

```bash
git fetch origin refs/heads/ss1/implementation-prompts-20261026:refs/remotes/origin/ss1/implementation-prompts-20261026
git restore --source=origin/ss1/implementation-prompts-20261026 -- docs/ss1/IMPLEMENTATION_20261026
```

This supplies the README, manifest and prompts; it does not supply the later foundation or subject implementation. Read those dependencies at their own published SHAs. If the directory already exists, read its current version instead of overwriting newer prompts. Do not wait for a merge merely to read an available prompt.

**Owner instruction: implement all source code first; testing later.** These are implementation assignments, not repeated audit requests. Each numbered file stands alone and includes input, scope, dependencies, publishing and completion rules. No agents have been started by preparing this pack.

## What is actually available

The Library archive `SSS 1-20260507T072431Z-3-001.zip` was downloaded and opened. SHA256 **024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e**. Its61 DOC/DOCX entries cover three term folders. Exact member names, sizes, hashes and task assignments are in [SOURCE_ASSIGNMENTS.csv](SOURCE_ASSIGNMENTS.csv). This metadata inventory is not a curriculum coverage audit. Assignment subject names come from filenames, to be confirmed by the owning worker from actual headers. It includes two First-Term Chemistry files and does not establish complete three-term coverage for every subject.

No SS1-specific module was found at inspected master198b86e; the generic importer recognises SS1 and the repo contains JSS-specific resolutions. Therefore01 must implement the shared SS1 contract before specialist packages; no worker should independently modify the generic importer. The later runtime integration is mandatory: JSON files or reports alone are not app implementation.

## Correct order and exact assignments

| Order | Prompt | Work | Documents |
|---|---|---|---|
|1|[SS1-01](01_FOUNDATION.md)|Executable ingestion foundation + frozen worker contract|shared61-input manifest|
|2A|[SS1-02](02_WORKER_A_LANGUAGES.md)|English,French,Yoruba,Literature|12|
|2B|[SS1-03](03_WORKER_B_MATHEMATICS_PHYSICS_DRAWING.md)|Mathematics,Further Mathematics,Physics,Technical Drawing|10|
|2C|[SS1-04](04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md)|Chemistry,Biology,Agriculture,Geography|13|
|2D|[SS1-05](05_WORKER_D_BUSINESS.md)|Commerce,Economics,Financial Accounting,Bookkeeping|12|
|2E|[SS1-06](06_WORKER_E_CIVIC_GOVERNMENT_DATA.md)|Civic,Government,Data Processing|9|
|2F|[SS1-07](07_WORKER_F_FOOD_CATERING.md)|Food/Nutrition,Catering|5|
|3|[SS1-08](08_INTEGRATION.md)|All-subject app/runtime/assets integration + executable later verification|all61 dispositions|
|4—later only|[SS1-09](09_LATER_VERIFICATION_RELEASE.md)|Whole-code verification,staging and approved release|final candidate|

Workers02–07 can run concurrently ONLY after01 publishes its schema and foundation SHA. They own disjoint subject packages/assets/tests; they do not edit shared routes/importer/global records.01 and08 are single-owner shared-file stages. All workers can read the same private archive; avoid separate incomplete term bundles. The owner starts each batch explicitly. PRs may be fetched from published branches before merge for assembly; no reliance on private local commits. Final functional integration stays unmerged pending the separate verification/release decision because master may auto-deploy.

## What to attach

For01–08: attach the ONE actual archive above if that agent cannot access Library ID `libfile_c7ec4e1ab0d88191b888fc536b2778f0`. Each prompt includes exact assigned members. Code/contracts/templates are obtained from Git; do not attach old JSS3 audit ZIPs, semantic patches, database dumps or secrets. Later extra source materials are requested by exact objective/file only if the actual source requires them (e.g. missing prescribed text). Optional owner materials must not be silently assumed to exist.

For09: inputs are specified by08's final handoff plus the same SS1 archive; real database/staging/device access is required only at that later stage. School approval, reuse permission, release authorisation and teacher observations cannot be manufactured by a prompt.

## Policy and deferred testing

SS1 uses all three instructional terms. JSS3's Third-Term rule and Computer Studies exclusion do not apply to SS1. Data Processing is included. All senior substantive teaching must finish by endSS2; SS3 remains exam-preparation only, but this task does not redistribute SS3. Other classes and existing progress are preserved. No UI redesign.

During01–08, source reading/extraction, asset conversion, actual code/content generation and diff review are allowed. Write regression tests and deferred commands but do not execute suites/typechecks/importer dryruns/DB/device checks. Automatic existing CI is not disabled. The correct report is **IMPLEMENTED—TESTING DEFERRED BY OWNER**, never certified/deployed. If an agent times out, its published per-subject checkpoint says exactly where to resume, not 'start the audit again'.
