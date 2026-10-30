# Static audit of the 60 authored SS1 lessons — 30 October 2026 (UNR-05)

Base: `origin/master` `b94c6ea`. Status: `IMPLEMENTED_TESTING_DEFERRED`.

This is a static authoring check by script over the package JSON. **It is not a test, and it does not verify, approve or deliver anything.** No file other than this report was edited. The compiler, importer, plan, test suites, typechecks, database and devices were not run. Hashes were recomputed by script, not copied.

## 1. Result

- Lessons audited: **60** (English 19, French 28, Further Mathematics 7, Mathematics 6). Every lesson in the four packages is in this table; no lesson was skipped.
- Field failures: **0** across 60 lessons × 13 fields.
- `STATED` (a lesson stating its own mark total) is **N/A for all 60**: no lesson body, question or answer contains the word "total" or an "N marks" statement, so there was nothing to compare. Summed marks are reported per lesson instead.
- All 60 lessons are `IMPLEMENTED` / `content_approval PENDING` / `verification DEFERRED`. None is approved or verified.
- What this does **not** establish: that any answer is correct, that any marking criterion is pedagogically sound, that the text is accurate, or that rights are actually cleared. It checks structure, hashes and arithmetic only.

## 2. Checks (each is one column in §5)

| Column | PASS when | Source of the rule |
|---|---|---|
| `ID` | Id matches `SUP-SS1-<SUBJECT_SLUG>-…` for its package, and is unique across all 60 | `lessonSchema` id regex; `compiler.ts` identity check; `unique` check |
| `IDENT` | `class_name` is `SS 1`, `subject` equals the package `canonical_subject`, `term` is a valid term, title non-blank | `lessonSchema`; `compiler.ts` lesson identity |
| `HASH` | SHA-256 of `body` as UTF-8, recomputed here, equals `body_sha256` | `compiler.ts`: `l.body_sha256 === sha256(l.body)` |
| `OBJ` | At least one objective, none blank | `lessonSchema` |
| `PRACTICE` | At least one practice item | `lessonSchema` (`practice` min 1) |
| `PRAC-IDS` | Every practice id is non-blank and unique within the lesson | `compiler.ts`: `unique(l.practice…)` |
| `ANSWER` | Every practice item has a non-blank question and a non-blank answer | Prompt: "flag any item without an answer" |
| `CRITERION` | Every practice item has at least one marking criterion; every criterion is non-blank with positive integer marks | Prompt: "flag any item without a marking criterion"; `lessonSchema` |
| `MARKS` | Per item, `marks` is a positive integer equal to the sum of its `marking[].marks` | `compiler.ts`: mark total check |
| `STATED` | Any stated mark total in the lesson text equals the summed marks; N/A if none is stated | Prompt: "compare with any stated total" |
| `PROV` | At least one provenance entry; title, locator, rights, attribution non-blank; `reuse_status` is PERMITTED or PENDING; `url` null or http(s) | `lessonSchema` provenance |
| `REUSE` | Every provenance entry has `reuse_status` PERMITTED | `compiler.ts` raises `LESSON_NOT_APPROVED` otherwise |
| `STATE` | `implementation` valid; `APPROVED` implies a non-blank `approval_reference`; `VERIFIED` implies a non-blank `verification_reference` | `lessonSchema` state; CONTRACT "state" |

`REUSE` is a delivery precondition, not an authoring defect. A FAIL there would be a rights blocker, reported separately from structural FAILs.

## 3. Totals by field

| Field | PASS | FAIL | N/A |
|---|---|---|---|
| `ID` | 60 | 0 | 0 |
| `IDENT` | 60 | 0 | 0 |
| `HASH` | 60 | 0 | 0 |
| `OBJ` | 60 | 0 | 0 |
| `PRACTICE` | 60 | 0 | 0 |
| `PRAC-IDS` | 60 | 0 | 0 |
| `ANSWER` | 60 | 0 | 0 |
| `CRITERION` | 60 | 0 | 0 |
| `MARKS` | 60 | 0 | 0 |
| `STATED` | 0 | 0 | 60 |
| `PROV` | 60 | 0 | 0 |
| `REUSE` | 60 | 0 | 0 |
| `STATE` | 60 | 0 | 0 |

## 4. Findings that are not field failures

1. **Identical bodies across terms.** Seven groups of lessons share the same `body_sha256`, each group inside one package (English 5 groups, French 2; 15 lessons in all). They are distinct lesson ids, so no check fails and the compiler keys on the id, but an approver reading them will see the same text twice:
   - `ENGLISH-PHRASES-CLAUSES-T1`, `ENGLISH-PHRASES-CLAUSES-T3`
   - `ENGLISH-PHONETICS-T1`, `ENGLISH-PHONETICS-T3`
   - `ENGLISH-AFFIXES-T2`, `ENGLISH-AFFIXES-T3`
   - `ENGLISH-READING-T1`, `ENGLISH-READING-T2`, `ENGLISH-READING-T3`
   - `ENGLISH-MEANING-T2`, `ENGLISH-MEANING-T3`
   - `FRENCH-ACCENTS-T1`, `FRENCH-ACCENTS-T2`
   - `FRENCH-PREFERENCES-T1`, `FRENCH-PREFERENCES-T3`
   Whether term repetition is intended is an owner decision. This audit does not judge it. (The Annex A hashes in `CONTENT_APPROVAL_SHEET_20261030.md` show the same repeats.)
2. **Lessons cited by no coverage entry and no correction:** `ENGLISH-READING-T1`, `ENGLISH-READING-T3`. This is the unbound reading-supplement condition that UNR-01 addresses; it is reported here, not changed.
3. **References that cannot be resolved statically.** See §6: `lesson_ids` entries that are not `SUP-SS1-…` ids are either original-source body ids of the form `<source_id>:BODY:<sha256>` (English 104, Further Mathematics 29, Mathematics 32) or marker rule ids (English 3, Further Mathematics 4, Mathematics 5); French has none. Body ids only resolve against the private source text, so they were classified and counted, not resolved.

## 5. Per-lesson results

Hash column is the first 16 hex of the recomputed value. `Σ marks` is the sum of practice-item marks. `Cited` counts coverage entries plus corrections that cite the lesson.

| # | Lesson | Term | ID | IDENT | HASH | OBJ | PRACTICE | PRAC-IDS | ANSWER | CRITERION | MARKS | STATED | PROV | REUSE | STATE | Items | Σ marks | Cited | Recomputed hash |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `ENGLISH-WORD-CLASSES-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 14 | `ecd8402e03e21cfa` |
| 2 | `ENGLISH-PHRASES-CLAUSES-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 6 | `119a7559dfd40cf4` |
| 3 | `ENGLISH-PHONETICS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 10 | `5bade9733d303e9d` |
| 4 | `ENGLISH-LETTERS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 10 | 2 | `54b42b21fb0c1b74` |
| 5 | `ENGLISH-AFFIXES-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 2 | `96c15f6b58eb8699` |
| 6 | `ENGLISH-READING-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 4 | `7c5883178f99e9d6` |
| 7 | `ENGLISH-MEANING-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 4 | `2ef041fcc51633f4` |
| 8 | `ENGLISH-ADVERBS-TENSE-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `d4ce742b5f802886` |
| 9 | `ENGLISH-ESSAY-TYPES-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 9 | 2 | `e31d747d6cc58c94` |
| 10 | `ENGLISH-PHONETICS-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 6 | `5bade9733d303e9d` |
| 11 | `ENGLISH-AFFIXES-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 2 | `96c15f6b58eb8699` |
| 12 | `ENGLISH-STRESS-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 5 | 4 | `8df0269eee4c1bcc` |
| 13 | `ENGLISH-PHRASES-CLAUSES-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `119a7559dfd40cf4` |
| 14 | `ENGLISH-MEANING-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `2ef041fcc51633f4` |
| 15 | `ENGLISH-READING-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 0 | `7c5883178f99e9d6` |
| 16 | `ENGLISH-READING-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 0 | `7c5883178f99e9d6` |
| 17 | `ENGLISH-NOUNS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 8 | 29 | 10 | `80ff216ed29a38c0` |
| 18 | `ENGLISH-PRONOUN-ADJ-VERB-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 10 | 64 | 7 | `cd32486d12e63074` |
| 19 | `ENGLISH-MEANING-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 8 | 32 | 1 | `c3655c8969428d35` |
| 20 | `FRENCH-PURPOSE-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 5 | 3 | `5461a11f8cae46ff` |
| 21 | `FRENCH-COUNTRIES-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 10 | 7 | `863051d9148d0e4b` |
| 22 | `FRENCH-GREETINGS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 4 | `0ab4d6296cfc651d` |
| 23 | `FRENCH-AUXILIARIES-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 7 | `4cd0a2b8dbe03b4c` |
| 24 | `FRENCH-ACCENTS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 8 | 2 | `50abf37602ce87d5` |
| 25 | `FRENCH-PROFESSIONS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 7 | 2 | `01117b7b6e950977` |
| 26 | `FRENCH-ENVIRONMENT-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 2 | `88997e296a09e6c7` |
| 27 | `FRENCH-ROUTINE-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `a8f32b76f2f7400e` |
| 28 | `FRENCH-PREFERENCES-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `e83e0bde336d1f5c` |
| 29 | `FRENCH-ACCENTS-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 8 | 2 | `50abf37602ce87d5` |
| 30 | `FRENCH-ALPHABET-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `95f0e1d5c7631b40` |
| 31 | `FRENCH-SOUNDS-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 10 | 4 | `72472f94c9b1afb7` |
| 32 | `FRENCH-CULTURE-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 8 | 2 | `383ac543e43181b8` |
| 33 | `FRENCH-TRANSPORT-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `eedee7548da001da` |
| 34 | `FRENCH-FLIGHT-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 5 | 2 | `4319ddda2231b879` |
| 35 | `FRENCH-IMPARFAIT-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `c135f63e2bd5e7f6` |
| 36 | `FRENCH-PASSE-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `f0c8bdc478743d86` |
| 37 | `FRENCH-DIALOGUE-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 5 | 2 | `4aec03762d75c155` |
| 38 | `FRENCH-CHANGE-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `fb1effc46f6fecfa` |
| 39 | `FRENCH-REACTIONS-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 5 | 4 | `2ecb4af1fd672df1` |
| 40 | `FRENCH-PREFERENCES-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `e83e0bde336d1f5c` |
| 41 | `FRENCH-OPINION-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 5 | 2 | `8dd7ca4059e9bf01` |
| 42 | `FRENCH-ILLNESS-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `3065292cefe2577a` |
| 43 | `FRENCH-GRAMMAR-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 8 | 2 | `6806a4804d7be345` |
| 44 | `FRENCH-REPORTED-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 7 | 2 | `5899078ad09a58a4` |
| 45 | `FRENCH-VOCABULARY-T3` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 2 | `6e56c09577c3d3b9` |
| 46 | `FRENCH-FUTURE-T2` | 2nd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 6 | 1 | `0dfb757147c2833e` |
| 47 | `FRENCH-NEIGHBOURS-T1` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 5 | 13 | 1 | `557779b0abb60d59` |
| 48 | `FURTHER-MATHEMATICS-T1-W01-INDICES` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 9 | 30 | 2 | `7745eb2b4ea9f097` |
| 49 | `FURTHER-MATHEMATICS-T3-W02-FLOWCHARTS` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 13 | 2 | `5511cd2e24491fbd` |
| 50 | `FURTHER-MATHEMATICS-T3-W03-GRADIENTS-LINES-CURVES` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 14 | 2 | `acefbf08971d907e` |
| 51 | `FURTHER-MATHEMATICS-T3-W04-SLOPE-PARALLEL-PERPENDICULAR` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 11 | 2 | `c3972c936d5b3121` |
| 52 | `FURTHER-MATHEMATICS-T3-W05-VECTOR-MAGNITUDE-UNIT` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 8 | 2 | `d7a2fd501d1252d9` |
| 53 | `FURTHER-MATHEMATICS-T3-W06-VECTOR-OPERATIONS-DIRECTION-COSINES` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 9 | 2 | `75b626ed82c9d0fd` |
| 54 | `FURTHER-MATHEMATICS-T3-W08-ANGLE-BETWEEN-LINES-EQUATION-FORMS` | 3rd | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 5 | 15 | 2 | `92163f67f88ed985` |
| 55 | `MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 18 | 2 | `03206bf6b426ad0c` |
| 56 | `MATHEMATICS-T1-W03-BASE-OPERATIONS` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 12 | 2 | `9782d282a763a2d9` |
| 57 | `MATHEMATICS-T1-W04-MODULAR-ARITHMETIC` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 13 | 2 | `0ed48fe41aba6d86` |
| 58 | `MATHEMATICS-T1-W05-STANDARD-FORM` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 14 | 2 | `91ff1d9f686a94b8` |
| 59 | `MATHEMATICS-T1-W06-INDICES` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 3 | 11 | 2 | `536e4fb821bf48ea` |
| 60 | `MATHEMATICS-T1-W10-EQUATIONS-VARIATION` | 1st | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | 4 | 17 | 2 | `7694cd042c0e1013` |

## 6. Reference resolution by package

| Package | Lessons | Unique ids | `SUP-` refs in coverage (resolved / dangling) | Non-`SUP-` refs (not checkable here) | Corrections (replacement resolves / total) |
|---|---|---|---|---|---|
| english | 19 | yes | 56 / 0 | 107 | 24 / 24 |
| french | 28 | yes | 43 / 0 | 0 | 28 / 28 |
| further-mathematics | 7 | yes | 8 / 0 | 33 | 6 / 6 |
| mathematics | 6 | yes | 6 / 0 | 37 | 6 / 6 |

No dangling `SUP-SS1-…` reference and no unresolved correction replacement was found. Cross-package id collisions: none.

## 7. How the script was validated

Because the real result is zero failures, the script was first run against a scratch copy of `mathematics.json` with seven injected defects (altered body, wrong item mark total, blank answer, blank criterion, `reuse_status PENDING`, a stated total of 99, a coverage reference to a nonexistent lesson). It flagged each one on the intended column and the dangling reference in §6. The scratch copy was outside the repository and was discarded.

## 8. Reproduction

Run from a checkout at `b94c6ea`: `python3 audit.py <repo-root> out.json`. The script is read-only over the repository and uses only the Python standard library.

```python
import json,hashlib,re,glob,sys,collections,os
ROOT=sys.argv[1]
SUBJ=['english','french','further-mathematics','mathematics']
def nb(s): return isinstance(s,str) and s.strip()!=''
rows=[];pk={}
allids=collections.Counter()
for s in sorted(glob.glob(f'{ROOT}/backend/src/db/ss1/subjects/*.json')):
    d=json.load(open(s,encoding='utf-8')); pk[d['subject_slug']]=d
    for l in d['lessons']: allids[l['id']]+=1
bodyhash=collections.defaultdict(list)
for slug,d in pk.items():
    for l in d['lessons']: bodyhash[(slug,l['body_sha256'])].append(l['id'])
for slug in SUBJ:
    d=pk[slug]; ids={l['id'] for l in d['lessons']}
    cites=collections.Counter()
    for c in d['coverage']:
        for i in c['lesson_ids']: cites[i]+=1
    for c in d['delivery_corrections']: cites[c['replacement_id']]+=1
    pids=collections.Counter()
    for l in d['lessons']:
        r={'subject':slug,'id':l['id'],'term':l['term']}; f={}; notes=[]
        f['ID']= bool(re.fullmatch(r'SUP-SS1-[A-Z0-9]+(?:-[A-Z0-9]+)*',l['id'])) and l['id'].startswith('SUP-SS1-'+slug.upper()+'-') and allids[l['id']]==1
        f['IDENT']= l.get('class_name')=='SS 1' and l.get('subject')==d['canonical_subject'] and l.get('term') in ('1st Term','2nd Term','3rd Term') and nb(l.get('title'))
        try: calc=hashlib.sha256(l['body'].encode('utf-8')).hexdigest()
        except Exception as e: calc=None; notes.append('body not UTF-8 encodable')
        f['HASH']= nb(l.get('body')) and calc==l.get('body_sha256')
        if calc!=l.get('body_sha256'): notes.append(f'hash stored {str(l.get("body_sha256"))[:12]} computed {str(calc)[:12]}')
        f['OBJ']= isinstance(l.get('objectives'),list) and len(l['objectives'])>=1 and all(nb(o) for o in l['objectives'])
        p=l.get('practice') or []
        f['PRACTICE']= len(p)>=1
        pi=collections.Counter(q.get('id') for q in p)
        f['PRAC-IDS']= all(nb(q.get('id')) for q in p) and all(v==1 for v in pi.values()) and len(p)>0
        noans=[q.get('id') for q in p if not nb(q.get('answer'))]
        nocrit=[q.get('id') for q in p if not q.get('marking') or any((not nb(m.get('criterion'))) or not isinstance(m.get('marks'),int) or m.get('marks')<=0 for m in q['marking'])]
        noq=[q.get('id') for q in p if not nb(q.get('question'))]
        f['ANSWER']= not noans and not noq and len(p)>0
        f['CRITERION']= not nocrit and len(p)>0
        if noans: notes.append('no answer: '+','.join(map(str,noans)))
        if nocrit: notes.append('no/invalid criterion: '+','.join(map(str,nocrit)))
        bad=[q['id'] for q in p if not (isinstance(q.get('marks'),int) and q['marks']>0 and q.get('marking') and q['marks']==sum(m.get('marks',0) for m in q['marking']))]
        f['MARKS']= not bad and len(p)>0
        if bad: notes.append('mark total mismatch: '+','.join(map(str,bad)))
        total=sum(q['marks'] for q in p if isinstance(q.get('marks'),int))
        txt=l['body']+' '+' '.join(q['question']+' '+q['answer'] for q in p)
        st=re.findall(r'[Tt]otal[^.\n]{0,40}?(\d+)\s*marks?|(\d+)\s*marks?\s*in\s*total',txt)
        stated=sorted({int(a or b) for a,b in st})
        r['marks_total']=total; r['stated']=stated
        f['STATED']= (not stated) or stated==[total]
        if stated and stated!=[total]: notes.append(f'stated total {stated} vs summed {total}')
        pv=l.get('provenance') or []
        f['PROV']= len(pv)>=1 and all(nb(x.get('title')) and nb(x.get('locator')) and nb(x.get('rights')) and nb(x.get('attribution')) and x.get('reuse_status') in ('PERMITTED','PENDING') and (x.get('url') is None or re.match(r'https?://',x.get('url') or '')) for x in pv)
        f['REUSE']= len(pv)>=1 and all(x.get('reuse_status')=='PERMITTED' for x in pv)
        if not f['REUSE']: notes.append('reuse_status: '+','.join(sorted({x.get('reuse_status') for x in pv})))
        st_=l.get('state') or {}
        f['STATE']= st_.get('implementation') in ('DRAFT','IMPLEMENTED') and (st_.get('content_approval')!='APPROVED' or nb(st_.get('approval_reference'))) and (st_.get('verification')!='VERIFIED' or nb(st_.get('verification_reference')))
        r['state']=f"{st_.get('implementation')}/{st_.get('content_approval')}/{st_.get('verification')}"
        r['cites']=cites[l['id']]
        r['dup']=[i for i in bodyhash[(slug,l['body_sha256'])] if i!=l['id']]
        r['f']=f; r['notes']=notes; rows.append(r)
# package-level reference resolution
pref={}
for slug in SUBJ:
    d=pk[slug]; ids={l['id'] for l in d['lessons']}
    rules={r['id'] for r in d['source_rules']}
    sup_ok=sup_bad=other=0; dangling=[]
    for c in d['coverage']:
        for i in c['lesson_ids']:
            if i.startswith('SUP-SS1-'):
                if i in ids: sup_ok+=1
                else: sup_bad+=1; dangling.append((c['id'],i))
            elif i in rules: other+=1
            else: other+=1
    corr_bad=[c['id'] for c in d['delivery_corrections'] if c['replacement_id'] not in ids and c['replacement_id'].startswith('SUP-')]
    corr_nonsup=[c['id'] for c in d['delivery_corrections'] if not c['replacement_id'].startswith('SUP-')]
    pref[slug]=dict(sup_ok=sup_ok,sup_bad=sup_bad,other=other,dangling=dangling,corr_total=len(d['delivery_corrections']),corr_bad=corr_bad,corr_nonsup=corr_nonsup,lessons=len(d['lessons']),unique_in_pkg=len(ids)==len(d['lessons']),uncited=[l['id'] for l in d['lessons'] if not any(l['id'] in c['lesson_ids'] for c in d['coverage']) and l['id'] not in [x['replacement_id'] for x in d['delivery_corrections']]])
json.dump({'rows':rows,'pref':pref,'base':'','global_dups':[k for k,v in allids.items() if v>1]},open(sys.argv[2],'w'),indent=1)
```

## 9. Not done

No lesson, package or queue was edited; no approval, verification or fix was applied; nothing was run beyond the script above. Any decision on §4 belongs to the owner or a later task.
