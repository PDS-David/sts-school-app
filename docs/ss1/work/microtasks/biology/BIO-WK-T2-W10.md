# BIO-WK-T2-W10 — Biology, 2nd Term, Week 10 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and assessment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and locator

- Source ID: `SS1-SRC-eb6e9665f42c`; archive member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`. Both match the archive and assignment manifest.
- The legacy `.doc` was converted to a private `.docx` copy using LibreOffice 25.2.3.2. The inventory records LibreOffice 24.2.7.2; Week 10 label and range hashes reproduce the inventory/queue values exactly.
- The converted `word/document.xml` has 963 direct `w:body` children (blocks 0-961 plus `w:sectPr` at 962). Block = direct child of `w:body`, zero-based; block text = concatenated `w:t` runs (UTF-8, no normalisation); range hash = SHA-256 of block texts first..last inclusive joined with newline.
- Week 10 label block 887, exact text `WEEK TEN                                                                                               DATE: …………………`, hash `54eb325da2fb924623f047ae561f601ba62fc1061c2e2857d586cc8a4f9f2949`. Blocks 887-961 have the queue's exact range hash `ecd6d1b683de45e47f55530180e8605b5f8057ccff672cc87ce7ac74fd5fb830`.
- Scheme row block 16 is `Ecological Management `; Week 10 topic line block 888 is `TOPIC: ECOLOGICAL MANAGEMENT`.

## Scheme/body scope finding

<badge label="Scope mismatch" color="warning" />

The scheme row and week topic name **Ecological Management**, but the body at blocks 890-938 teaches **types of biological association**. No ecological-management lesson (for example, a defined conservation, pollution or resource-management objective) appears in the Week 10 body. I have not invented the missing syllabus. A teacher/owner scope decision is recorded in `BIOLOGY-T2-W10-MANAGEMENT-SCOPE` and `BIO-SCOPE-T2-W10-MANAGEMENT`.

The association teaching is separately indexed below.

## Source teaching evidence

| Association | Exact blocks and range hash | Source coverage |
|---|---|---|
| Symbiosis/mutualism | 892-902 (`294eb1ac777c52202be30362686b981ab3e1ed3d64881d1e1ce774ffd8e2b8e6`) | Defines a mutually beneficial, dependent association and gives lichen (alga/fungus), protozoa/termite, Rhizobium/legume root nodules, rumen microorganisms/ruminants and flower/insect examples. |
| Protocooperation | 904-909 (`c11c6e1ef7f146929662721808e64f63b0da665d63455f1502b94d3b41b1d1b9`) | Defines mutual benefit without obligatory dependence; gives sea anemone/hermit crab, plover/crocodile and cattle/egret examples. |
| Commensalism | 910-915 (`a1f910b3bbc1e2703d2709fdc71d8ec489445a03880aa9c71654507c0a7c0349`) | Defines one-sided benefit with no effect on the other organism; gives remora/shark, oyster/crab and intestinal bacteria/human examples. |
| Amensalism/antibiosis | 921-925 (`30b0c6d93a4c477264ddbc23bae61fb29605d11ed61100d53a9f76fc11917d53`) | Defines inhibition of one species without effect on the other and gives Penicillium notatum/bacteria and Streptomyces griseus/bacteria examples. |
| Parasitism | 927-932 (`421056c21c03609581a49a2188159790acba46368ceb29d61c6e393e4f685664`) | Defines parasite/host relationship and gives man/tapeworm and mistletoe/flowering-plant examples. |
| Predation | 934-938 (`78f92f3f062fd0444b968510eea6019b8de4df48579f8e5a01cb69c538d92b5d`) | Defines predator/prey relationship and gives hawk/chick and lion/goat examples. The source says the prey is “completely eliminated”; this wording is retained and flagged for review. |

No Biology lesson is registered in `biology.json` for this content. The association lesson task `BIO-LES-T2-W10-ASSOCIATIONS` was appended and is dependent on approved factual review.

## Evaluation, revision and assignment review

No answer key or marking guide accompanies the Week 10 evaluation, revisional questions, weekend assignment or theory.

| Section | Exact locator | Source support and gaps |
|---|---|---|
| Evaluation | Heading 917; questions 918-919 (range `16f96f7ca575a15dd2ef5a4f77c2f2f3e06a129983b2e2e12bcfe7f9a827cddc`) | Symbiosis/mutualism and commensalism definitions/examples are taught at 893-915. |
| Revisional questions | Heading 940; questions 941-946 (range `f4a687285dd71deb84344c603c723cf92da822004558d83265e8dc78a729a2e1`) | Parasitism/predation definitions/examples and differences between parasitism and amensalism are taught at 921-938. Questions 944-946 ask about growth hormones and mitotic cell division, which are not taught in Week 10; these topics occur in the 1st Term Week 10 source and may be cumulative revision. Their placement is recorded for teacher confirmation, not duplicated. |
| Reading assignment | Heading 948; block 949 (range `940d605db780c6a253502c94caa04f93803caf9dc4ffcbb204158b12ee1a9cd9`) | College Biology by Idodo Umeh, chapter 23, page 556. The cited book is not in the source archive and was not opened. |
| Weekend assignment | Heading 951; questions 952-957 (range `8c4bea12dd06a638ee3e24a3d25f6ddc5428895dfcc4dd799d39f070a7452176`) | Q952 asks for an association where one member benefits, but the source's matching type is commensalism and that option is absent. Q953 asks what ticks feed on; ticks are not taught in the body. Q954 asks the meaning of “commensal” beyond the source's definition. Q955's allochemics term is defined at 922. Q957 lichen as algae/fungi is described at 898. No answer key is supplied. |
| Theory | Heading 959; questions 960-961 (range `f886a180a0456e1765147de70247ffbbeb20243e53bf88e76b03833154e24563`) | Definitions of symbiosis, commensalism and predation and examples appear in the teaching body. No marking guide is supplied. |

## Factual and owner review

- The biological examples/claims in blocks 894, 900, 922 and 935-938 require approved-reference review before being used as corrected teaching. The source is preserved as-is.
- Weekend Q952's options do not include the association defined by the source for “one member benefits, the other neither benefits nor is harmed”. The intended option/wording needs teacher confirmation.
- Weekend Q953 asks about ticks, which are not described in the Week 10 body.
- Revisional questions 944-946 concern first-term growth hormones and mitosis. A separate scope-decomposition task checks whether these are deliberate cumulative revision.
- The scheme/body mismatch is unresolved; no ecological-management content has been invented.

## Structural census

Blocks 887-961 contain no Word tables, embedded images, shape drawings, equations or OLE objects; there are three tab elements. No practical or experiment instructions appear in this range.

## Package and queue changes

- `biology.json`: added `COV-BIO-T2-W10-ASSOCIATIONS` (PARTIAL), `COV-BIO-T2-W10-ECOLOGICAL-MANAGEMENT` (UNRESOLVED) and `COV-BIO-T2-W10-ASSESSMENT` (UNRESOLVED). Added open items for missing lessons, scheme/body scope, factual review, cross-term revision and teacher-approved marking.
- `QUEUE.json`: marked `BIO-WK-T2-W10` IMPLEMENTED_TESTING_DEFERRED; appended `BIO-FACT-T2-W10-ASSOCIATIONS`, `BIO-SCOPE-T2-W10-MANAGEMENT` and `BIO-LES-T2-W10-ASSOCIATIONS`; recomputed status counts and `next_runnable`.
- No lesson, answer key, correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: archive/member SHA-256; converted DOC body-child count; Week 10 label, scheme row and range hashes; section/range hashes for each association and assessment group; review of every evaluation, revisional, weekend and theory prompt; structural table/image/drawing/equation/tab census; package JSON references; queue IDs, dependencies and status counts.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
