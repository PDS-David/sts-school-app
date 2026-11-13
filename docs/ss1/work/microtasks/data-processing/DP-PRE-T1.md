# DP-PRE-T1 — Data Processing First Term preamble, scheme and references

Status: IMPLEMENTED_TESTING_DEFERRED. Source approval remains pending; verification remains deferred.

## Source evidence

- Source ID: SS1-SRC-a92792eaa7ef
- Canonical subject: Data Processing, SS 1, 1st Term. The source heading explicitly says Data Processing; it is not mapped to Computer Studies or ICT.
- Archive member: SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx
- Member SHA-256: a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b
- Composite archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; both values were checked and recorded by DP-INV-T1.md.
- Opening block: lines 1–81, SHA-256 07f34cdccb656a70155d2a989ffc5a737c39292a710d37021c16e7e6307c1d54.
- Subject/class heading: line 39, exact extracted heading recorded in the package source registration.
- The opening block includes publisher material, blank space, term note, subject/class identity, scheme, and three references. It is not a teaching week.

## Scheme-to-body map

| Row | Scheme label | Scheme line | Corresponding body | Evidence and difference |
|---|---|---:|---|---|
| 1 | Introduction to Data Processing | 49 | Week One, 87–281 | 836f73d0570e28df4dca685d5e34818d0de10e41ee72d8226e422ace997b6567 |
| 2 | History of Computing | 51 | Week Two, 287–429 | c5d048b437c13cff6b205906da399d2bed18f01bc0cadc0503d8fc346ac5366b; body adds NUMBER SYSTEM (REVISION), 379–392 |
| 3 | History of Computer I. | 53 | Week Three, 435–581 | 23f33f0dfe418f06a5570aa13bc045679fcc1dab8de099cd55d87f70dd832c65; actual body topic is GENERATIONS OF COMPUTERS, absent from scheme |
| 4 | History of Computer II. | 55 | Week Four, 585–725 | 210e0a92f9873777c7b9ffe98c3ca60de11c8e6b05a89344fd7c1b4fa35440cd; body topic is HISTORY OF COMPUTERS and includes the generations table |
| 5 | Classification of Computer by Types | 57 | Week Five, 729–827 | 83265555dcb256a4cd41958b45dd22a1618be77da7fc2b6384229abf0ead1a54 |
| 6 | Classification of Computers by Size | 59 | Week Six, 833–955 | f5baab600d56c2f882b56fe1ba4cc979b80be57cf0379e0080e371b1c27dc020 |
| 7 | Digitalization of Data I. | 61 | Week Seven, 961–1193 | 217a893e0cb0aa5333726149e6d6a1d02bf70bff44646d49aa5b0813cda519fc; body adds early counting devices and the information-age table |
| 8 | Digitalization of Data II. | 63 | Week Eight, 1197–1455 | ee64f1ac95194f79236dd14b516909f92668b6b3987ddf26bf7f246b31912685; body covers components, hardware, software and peopleware |
| 9 | ICT Application in Everyday Life | 65 | Week Nine, 1459–1607 | 7c54fd0952ff030b07ba5ee999adb19c57fc586ff569525d6fb5579b893fe89b |
| 10 | Data and Information | 67 | Week Ten, 1613–1771 | e581a7b51abd74f527a8f2b59a11cf64fc385346bf20a586dddf01cf946b3901 |
| 11 | Revision | 69 | No body | Reserved for DP-MARK-T1-REVEXAM |
| 12 | Examination | 71 | No body | Reserved for DP-MARK-T1-REVEXAM |

Rows 3 and 4 both say History of Computer although the bodies differ. The scheme omits the actual Week Three topic, Generations of Computers. This drift is recorded, not silently corrected. Existing coverage entries for rows 1 and 2 are retained. No new coverage or lesson is created from a scheme heading; the week-specific indexing tasks remain responsible for assessing actual instruction.

## References recorded in the source

The three entries are at lines 77–81 of the same opening block:

1. Line 77: Data Processing forSenior Secondary Education by Hiit Plc.
2. Line 79: A Handbook on Computer Studies by NiyiAdekolegan.
3. Line 81: On-line Materials.

The first two entries contain spacing irregularities as printed. No edition, publication year, page range or URL is supplied. The books and online materials were not provided or consulted. No content, external provenance, rights or reuse permission is inferred. A nonblocking PERMISSION open item records the verification required before any lesson relies on or reproduces these materials.

## Implementation and validation

- Confirmed the existing package already contains the source registration and source-alias rule for Data Processing.
- Confirmed existing scheme coverage entries for rows 1 and 2; preserved them unchanged.
- Added a non-coverage verification open item recording rows 1–10, their exact scheme line locators, corresponding week ranges and hashes, and the known scheme/body drift.
- Added a nonblocking permission follow-up for the three bibliography entries.
- Kept rows 11–12 with the existing marker task. No marker rule is needed for the scheme rows; no revision/examination body exists.
- Parsed the pre-change package and queue as JSON; checked open-item IDs for uniqueness; recomputed status counts for the single task transition and removed only DP-PRE-T1 from next_runnable.
- No tests, TypeScript checks, importer/compiler, database or device checks were run; the owner protocol defers these gates.

## Checkpoint

- Task: DP-PRE-T1
- Status: IMPLEMENTED_TESTING_DEFERRED
- Changed files: backend/src/db/ss1/subjects/data-processing.json, docs/ss1/work/microtasks/data-processing/QUEUE.json, this evidence note.
- Next eligible item: DP-WK-T1-W03, subject to current-master refresh and branch-ownership check.