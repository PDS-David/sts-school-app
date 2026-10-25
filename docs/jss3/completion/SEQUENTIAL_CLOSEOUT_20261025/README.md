# Sequential JSS3 closeout — 25 October 2026
Prepared before implementation, at master 94982cbc5e9e2b2d61aa77ff4d2173135b17cca8 (PR53 merged).
Each task file is self-contained: copy its complete contents into the assigned agent chat. No need to attach old worker patch packages. Read the specific external-input section; source archive is private and cannot be fetched from Git. Each agent works only its assigned task; coordinator executes 02→08 and announces STARTING and result before advancing. Do not conflate BLOCKED with COMPLETE. Later tasks may proceed only on independent portions when a prerequisite remains open.

| Task | Prompt | External input |
|---|---|---|
|02|[Supplement delivery](02_SUPPLEMENT_DELIVERY.md)|None for runtime/DB implementation; corpus ZIP for full-source verification|
|03|[Literature exercise](03_LITERATURE_EXERCISE.md)|Corpus ZIP for regeneration; existing complete story is in repo|
|04|[Ọya text](04_OYA_TEXT.md)|Verified reusable source/permission if web acquisition cannot establish it; corpus ZIP|
|05|[Sequencing](05_SEQUENCE.md)|Actual recorded D1–D8 and placement decisions; corpus ZIP|
|06|[Full acceptance](06_FULL_ACCEPTANCE.md)|Corpus ZIP; disposable PostgreSQL16 or Docker|
|07|[Protected baseline](07_PROTECTED_BASELINE.md)|Historical certified export/backup AND designated release snapshot with provenance|
|08|[Staging and release](08_STAGING_RELEASE.md)|Staging target/access, synthetic accounts, device/tester/EAS; separate concrete production approval|

Corpus: JSS3_NEXT_STAGE_INPUTS_20261016.zip, SHA256 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c; (1)/(2) filenames acceptable. Never attach credentials in plaintext. No prompt can guarantee unavailable evidence or external approvals; the completion gates deliberately distinguish those from code work.
