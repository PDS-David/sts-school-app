# First Term Catering Craft — source registration / foundation change request

## Why this request exists
The current subject package and authoritative `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv` register Catering Craft sources for Second Term (`SS1-SRC-f433169ca25c`) and Third Term (`SS1-SRC-d068ede78d16`) only. No First Term Catering Craft archive member/source ID is registered.

## External scheme located
A public reproduction of the Lagos State Ministry of Education Unified Scheme of Work is available at:

- https://syllabus.ng/ss1-scheme-of-work/catering-and-craft/

It identifies the subject as “Catering and Craft Practice”, SS1, First Term, and provides a 13-week sequence:
1. Introduction to catering craft — origin and careers.
2. Hospitality industry in catering — definition, relationship to catering trade and classification.
3. Components of hospitality industry — importance and characteristics.
4. Catering establishments — classification and types.
5. Catering establishments — functions and hotel rating.
6. Culinary terms — common terms, glossary and French menu.
7. Mid-term test / open day / mid-term holiday.
8. Safety precautions in the kitchen — meaning, accidents, causes, prevention and management.
9. First aid — first aid, first aider, first-aid box, fire control and equipment.
10. Sanitation — meaning, aims and types.
11. Hygiene — meaning, types, food contamination and food poisoning.
12. Revision.
13. Examination.

This gives ten teaching weeks, one mid-term calendar week, one revision week and one examination week. It meets the term-duration requirement without inventing teaching weeks.

## Project-authored content already prepared
The current branch contains 14 independently authored First Term lesson/assessment records:
- ten teaching-week topics aligned to Weeks 1–6 and 8–11;
- a Week 7 mid-term test supplement;
- a Week 10 sanitation practical supplement;
- Week 12 revision;
- Week 13 examination.

The content is original. The public scheme is used for topic alignment only. No third-party lesson text or images are reproduced. The First Term lessons are deliberately not mapped to invented source IDs or inserted into `sources[]`.

## Requested foundation action
The repository owner/foundation maintainer should choose one of these paths:

1. Add an approved First Term source file to the original source archive and add its exact archive member, source ID and SHA-256 to `SOURCE_ASSIGNMENTS.csv`; then map the existing project-authored lessons to its indexed objectives; or
2. Approve a versioned foundation-contract change that explicitly permits the public scheme URL and independently authored First Term supplements to serve as the registered First Term basis, with the required provenance and verification rules.

Do not edit the shared manifest, invent a source ID, or mark First Term source coverage complete until that foundation action is approved.

## Current status
- First Term teaching/assessment content: authored.
- Registered First Term source: missing.
- Source coverage mapping: intentionally unresolved.
- Owner/foundation approval: required.
- Lesson content approval: pending.
- Tests/importer/database/device verification: deferred by owner.


## Resolution — foundation v2 implemented

Owner authorised the First Term foundation change and confirmed both source aliases and all 38 authored records on 2026-11-09. Foundation schema v2 now permits a separate, hash-bound external scheme record for a published scheme that is not an archive member. The First Term Lagos State scheme is registered in the Catering Craft package as `SS1-EXT-CC-T1-LAGOS-UNIFIED-SCHEME-2026`, SHA-256 `57f54695976579ed57624321efb65d156f4fac193141d85875c5e26357e014a0`, URL https://syllabus.ng/ss1-scheme-of-work/catering-and-craft/. All thirteen calendar weeks have authored equivalent coverage entries with exact week locators and objectives drawn from the hash-bound record. The original 61-member archive and `SOURCE_ASSIGNMENTS.csv` remain unchanged; no archive member or source hash was invented.

The owner approved all 38 authored records. Their content approval references are recorded; provenance is marked permitted only for factual/topic reference use where no protected text, table, figure or image is reproduced. Verification remains deferred. The separate Second Term frying correction still needs the exact parser-trimmed original source identity. That narrow importer run is authorised but could not be executed because the binary archive bytes are not available to the current execution environment.

**Status:** First Term source registration/foundation request RESOLVED by v2 external-source support. Original archive source registration remains exactly as in the manifest.
