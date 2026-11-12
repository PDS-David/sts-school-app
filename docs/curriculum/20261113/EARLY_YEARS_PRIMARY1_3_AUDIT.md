# Early Years and Primary 1–3 Curriculum / Delivery Audit

**Audit date:** 2026-11-13  
**Branch:** `curriculum/early-years-primary1-3-completion`  
**Scope:** Pre-Nursery, Reception, Primary 1, Primary 2, Primary 3  
**Status:** BASELINE AUDIT — NOT CURRICULUM-COMPLETE; source and owner gates remain open.

## Executive finding

The repository has class names and a reasonably defensive source-ingestion resolver for Pre-Nursery, Reception and Primary 1–3, but it does **not** contain the source archive, class-by-class curriculum export, or curriculum packages needed to verify and complete these five classes. The only curriculum source archive in the master tree is the SS1 archive. The only committed Primary-class export manifest is for Primary 4. The database itself was not accessible in this audit, so live topic rows, class registrations, learner records, assets and progress data have not been independently counted.

A critical structural mismatch is already visible: the Primary school seed registers 11 subjects globally, while the current NERDC-approved Primary 1–3 offering is 9 compulsory subjects plus optional Arabic (9–10 total). The mobile Learning screen retrieves the whole-school subject list rather than a class-specific curriculum list. Consequently, the current interface can expose subjects that are not part of a learner's class curriculum and cannot show a reliable class-specific missing-subject state.

No lesson content has been invented to fill the source gap. This report records verified structures, current implementation, mismatches, and the evidence required to complete the work safely.

## 1. Repository structures discovered

### Class and subject registration

- `backend/src/db/seed.ts` defines the Primary classes in this order: Pre-Nursery, Reception, Nursery 1, Nursery 2, KG 1, KG 2, Primary 1–6.
- The same file seeds one **school-wide** Primary subject list: English Language, Mathematics, Basic Science, Social Studies, Yoruba, CRS/IRS, Civic Education, Physical & Health Education, Cultural & Creative Arts, Computer Studies, Home Economics. There is no class-to-subject registration table in the inspected schema.
- The seed script defines 1st, 2nd and 3rd Term records for 2026/2027, but no live database was queried; the script is not proof that these rows are currently installed.
- `backend/src/db/addEarlyYearsClasses.ts` inserts Pre-Nursery and Reception into an existing database. It is idempotent, but it does not reposition pre-existing class rows.
- `backend/src/db/ingestTopics.ts` has explicit class-name patterns for Pre-Nursery, Reception, Nursery 1/2, KG 1/2 and Primary 1–6. It checks a filename before parent folders, and separately flags filename/folder disagreements. It also checks cross-class byte-identical source documents.
- `backend/src/db/primaryCurriculumResolutions.ts` contains exact-source exclusions, subject overrides and duplicate decisions for Primary source documents. These rules are preserved; no fuzzy class or subject rule was added.
- `backend/src/db/primary4/sourceManifest.json` is a Primary 4 manifest only. No corresponding Early Years or Primary 1–3 source manifest exists in the master tree.
- No Early Years or Primary 1–3 lesson package, asset manifest, class-specific coverage report or delivery test suite was found in the master tree.

### Class-by-class baseline

| Class | Repository class entry / resolver | Authoritative curriculum baseline | Repository evidence status |
|---|---|---|---|
| Pre-Nursery | Present in seed and explicit filename resolver | The NERDC one-year pre-primary curriculum is for children aged 5 and 5+; it does not establish a separate Pre-Nursery programme for a younger age band. | **UNRESOLVED** — age band, school framework and source documents absent |
| Reception | Present in seed and explicit filename resolver | Provisionally aligns with the NERDC one-year pre-primary curriculum only if Reception is the school's age-5/5+ pre-primary year. Six developmental domains apply. | **PARTIAL** — official baseline found; local Reception source sequence and age confirmation absent |
| Primary 1 | Present in seed and explicit filename resolver | NERDC/FME revised Primary 1–3 subject offering: 9 compulsory subjects plus optional Arabic; three-term school structure. | **PARTIAL** — subject baseline found; school term/topic sequence and source lessons absent |
| Primary 2 | Present in seed and explicit filename resolver | Same Primary 1–3 curriculum band; implementation is phased from the beginning of the three-year cycle at Primary 1. | **PARTIAL** — cohort/version mapping for the 2026/27 session is not recorded; school term/topic sequence absent |
| Primary 3 | Present in seed and explicit filename resolver | Same Primary 1–3 curriculum band, with the same phased-implementation issue. | **PARTIAL** — cohort/version mapping for the 2026/27 session is not recorded; school term/topic sequence absent |

## 2. Authoritative Early Years curriculum baseline

NERDC's **One Year Pre-Primary Education Curriculum and Teachers' Guide**, first published 2016, reprinted 2018 and reviewed 2024, explicitly targets children aged five and five-plus and describes a one-year pre-primary programme. It is play-based and organized around six interrelated developmental domains:

1. Physical development
2. Social and emotional development
3. Cognitive development
4. Language development
5. Creative art
6. National values and consciousness

The curriculum provides developmental indicators, sample activities, sample teaching/learning resources and evaluation guidance. Its suggested approaches include play, rhymes, stories, songs, sensory and movement activities. It provides termly child-development checklists/report cards and says assessment at this level is observational and developmental, not grading or ranking children. The guide also includes observation notes, portfolios, anecdotal records, rating scales, running records/teacher notes and reflective diaries.

**Reception mapping is provisional:** use this curriculum only if Reception is confirmed as the school's one-year pre-primary class for five-year-old/five-plus learners. It must not be copied wholesale into Pre-Nursery. The school has separately registered Pre-Nursery, but no age band or age-appropriate Pre-Nursery curriculum was found in the repository.

Official source: NERDC, *One Year Pre-Primary Education Curriculum and Teachers' Guide* (reviewed 2024), https://ppec.nerdcportals.com.ng/pre_primary/web/ppec_tg.pdf

## 3. Authoritative Primary 1–3 subject baseline

NERDC's special notice on approved subject offerings, dated **8 September 2025**, identifies the following Primary 1–3 offering:

| # | Approved subject | Registration rule |
|---:|---|---|
| 1 | English Studies | Compulsory |
| 2 | Mathematics | Compulsory |
| 3 | Nigerian Languages (Hausa, Igbo or Yoruba) | One language only |
| 4 | Basic Science | Compulsory |
| 5 | Physical & Health Education | Compulsory |
| 6 | CRS or Islamic Studies | CRS for Christian pupils; Islamic Studies for Muslim pupils |
| 7 | Nigerian History | Compulsory |
| 8 | Social and Citizenship Studies | Compulsory |
| 9 | Cultural & Creative Arts (CCA) | Compulsory |
| 10 | Arabic Language | Optional |

The notice specifies a minimum of nine and maximum of ten subjects. The Federal Ministry of Education's 3 September 2025 press release says the revised curriculum takes effect in the 2025/26 academic year and that Nigerian History is compulsory from Primary 1 to JSS 3. NERDC's notice says implementation begins at the start of each three-year education cycle, beginning at Primary 1. The repository does not store a curriculum-version/cohort field for each class; therefore the precise P2/P3 rollout assignment for the 2026/27 school session must be recorded before lessons are mapped to a version.

Official sources:
- NERDC, *Special Notice on the List of Approved Subjects/Offerings for the Newly Revised Basic and Senior Secondary Education Curriculum* (8 September 2025), https://nerdc.org.ng/ecurriculum/Doc/NERDC-approved-subjects-notice.pdf
- Federal Ministry of Education, *Lighter Load, Stronger Minds: FG Overhauls Curriculum for a Smarter Generation* (3 September 2025), https://nerdc.gov.ng/content_manager/pdf_files/Press%20Release%20On%20New%20FG%20Curriculum.pdf
- NERDC, Primary 1–3 curriculum document index, https://www.nerdc.gov.ng/content_manager/pri1-3.html

### Seed-to-approved-subject mismatches

The current `PRIMARY_SUBJECTS` array is not a class-specific registration. Compared with the 2025 approved Primary 1–3 offering:

- `English Language` is named differently from `English Studies`.
- `Social Studies` and `Civic Education` are separate seeded subjects; the new offering is the combined `Social and Citizenship Studies`.
- `Nigerian History` is missing.
- `Arabic Language` is not registered as an optional subject.
- `CRS/IRS` is a combined seeded name, whereas the approved list specifies CRS **or** Islamic Studies for the respective pupils.
- `Computer Studies` and `Home Economics` appear in the seed but are not separate Primary 1–3 offerings in the 2025 notice.
- `Yoruba` is present, but the curriculum permits one of Hausa, Igbo or Yoruba; the school-level language choice should be explicit rather than assuming every learner studies multiple Nigerian languages.

Do not delete or globally rename existing subject rows as a shortcut: Primary 4–6, historic scores, topic references and other agents' work may depend on them. A versioned, class-specific curriculum-to-subject mapping is needed before data migration.

## 4. Known Primary source-resolution decisions

The following exact-name rules already exist and must be preserved:

- `PRY 1 PHE 3RD TERM.doc` is excluded because its content duplicates the correctly named Primary 1 ICT third-term source.
- `PRY 2 PHE 3RD TERM.docx` and `PRY 2 PHE 3RD TERM_1.docx` are excluded as byte-identical misplaced copies of the retained Primary 1 PHE second-term source; the available evidence does not support assigning them to Primary 2 third term.
- `PRY 3 HOME ECONS 2ND TERM.docx` is excluded because it is the Primary 4 Home Economics source, not a Primary 3 source.
- `PRY 3 AGRIC SCIENCE 3RD TERM.docx` and `PRY 4 AGRIC 3RD TERM.docx` are an acknowledged byte-identical cross-class pair retained in both classes by an existing owner decision.
- The Primary 1 PHE second-term source uses Lesson 1–4 headings; an exact-source transformation maps those to four named week entries.
- Exact topic overrides exist for Primary 1 Mathematics third term and Primary 3 Computer Studies third term. They are source-specific, not general parser heuristics.

These are code-level decisions, not a fresh rehash of the original Word files. The source documents and original Primary 1–3 archive were not found in the repository or current Library files, so the source hashes and lesson bodies could not be independently revalidated in this audit.

## 5. Student application delivery and progress

### Verified code path

- `mobile/src/screens/student/StudentLearningScreen.tsx` requests `GET /academic/subjects` and displays every returned school subject as a student tile. It does not send or resolve the learner's class when building this list.
- `backend/src/routes/academic.ts` returns all subjects for the learner's school; there is no class/subject join in the inspected schema.
- `mobile/src/screens/SubjectTopicsScreen.tsx` requests `GET /learning/topics?subject_id=...`. The backend `GET /learning/topics` resolves student/parent class visibility on the server and filters topics to those classes (plus class-neutral rows).
- Ordered topics are grouped by subject, class and term; a term PIN unlocks the first item and each later item depends on passing the preceding item. `POST /learning/topics/:id/complete` rechecks class access and the same sequence lock before completing a topic.
- Topic completion is recorded in `topic_completions`; assessments and submissions use the existing general assessment path.
- The SS1 package delivery system is explicitly class/subject package-gated; it is not a Primary or Early Years delivery mechanism.

### Delivery gaps

1. **Class-specific subject navigation is missing.** The student sees the same school-wide Primary subject list regardless of whether they are in Pre-Nursery, Reception, Primary 1, 2 or 3. A class-specific registration layer is required.
2. **Early Years delivery is not development-domain based.** No Reception/Pre-Nursery checklist, observation, portfolio or termly developmental report-card interface was found. A generic topic completion or numeric assessment is not a substitute for the NERDC pre-primary developmental assessment.
3. **Primary 1–3 topic completeness cannot be counted.** There is no class-specific Primary 1–3 source export/manifest in the repository and no live DB connection was available to count topics by class, subject and term.
4. **Teacher/parent support is not evidenced for Early Years.** Existing parent progress and teacher tools were not verified against a child-development checklist or portfolio workflow.
5. **Assets are unverified.** No Early Years/Primary 1–3 asset manifest or dedicated asset directory was found; image/audio/video availability and appropriateness were not tested.
6. **Actual device delivery is unverified.** Screens were inspected statically; no test account, live API, emulator or physical device was available. Do not claim the lessons were opened successfully by a learner.
7. **Incomplete activity handling is only generic.** Topic completion and assessment submission exist, but there is no Early Years observation state or developmental-domain progress state.

## 6. Class-resolution and promotion-order risk

The source importer has useful safeguards: filename-first resolution avoids a known Pre-Nursery/Reception shared-folder misclassification; folder-vs-filename disagreement is separately blocked; byte-identical cross-class files are detected unless explicitly acknowledged.

A separate application risk needs an owner decision before changing class progression:

- `seed.ts` lists classes in the order Pre-Nursery → Reception → Nursery 1 → Nursery 2 → KG 1 → KG 2 → Primary 1… .
- `addEarlyYearsClasses.ts` appends Pre-Nursery and Reception to an already-seeded database; it does not reorder the `classes.id` values.
- The student promotion/demotion route selects class names with `ORDER BY id ASC` and moves to the adjacent row. Thus fresh and previously seeded databases can have different promotion sequences. An existing database receiving the two new classes late may put them after Primary 6. The intended progression order must be confirmed and then encoded explicitly; relying on insertion IDs is not safe.

**Owner decision required:** confirm the full progression order of Pre-Nursery, Nursery 1, Nursery 2, Reception, KG 1, KG 2 and Primary 1 (or provide the school's actual order). No promotion-order code was changed pending that decision.

## 7. Automated checks added in this batch

A focused regression test file covers:
- class inference for Pre-Nursery, Reception, Nursery 1/2, KG 1/2 and Primary 1–3 filename aliases;
- shared Pre-Nursery/Reception folders;
- class-folder mismatch detection;
- existing Primary source exclusions and the acknowledged Primary 3/4 Agricultural Science duplicate.

**Execution status:** tests have been authored but not run in this environment. No database, API, mobile, emulator or device test was run. CI status has not been checked.

## 8. Evidence still required to complete the assignment

- Original Pre-Nursery, Reception and Primary 1–3 source archive(s), including any schemes of work and teacher notes; verify member hashes and inspect source layouts.
- School-confirmed age bands and learning-area framework for Pre-Nursery; confirmation that Reception maps to the age-five/5+ NERDC one-year pre-primary curriculum.
- School-confirmed curriculum rollout/version for Primary 1, Primary 2 and Primary 3 in the 2026/27 session.
- School's selected Nigerian language and CRS/Islamic Studies rule; confirmation whether Arabic is offered.
- Read-only export of live classes, subjects, topics, materials, assessments, assets, student class mappings and progress rows for the five classes. No live database credentials or export were present in this audit.
- Confirmed early-years progression order.
- Test users/parent/teacher roles and a test environment for student, teacher and parent delivery journeys.

Until these are available, the five classes remain **INCOMPLETE**. This audit deliberately does not equate the existence of class rows or generic subjects with curriculum completion.
