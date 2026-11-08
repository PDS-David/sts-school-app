# BIO-WK-T1-W09 — Biology, 1st Term, Week 9 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and locator

- Source: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`; SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`; 957,703 bytes. The archive and assigned member hashes were verified in this session.
- Locator rule from `BIO-INV-T1`: direct child of `w:body` in `word/document.xml`, zero-based; block text is concatenated `w:t` runs (UTF-8, no normalisation; text-box text belongs to its containing block); range hash is SHA-256 of block texts joined with newline, including empty blocks.
- Week label block 951, exact text `WEEK NINE`, hash `e38b03944a5cbe25a9e8b633065edd7490e9360c352bcb33ba8e6926594b756f`. Week 9 range blocks 951-984, hash `e0fd7a606c08dec6adab6b72e24bb790bf4e05a77905ea2ec9230f504917f7dd`, matching the queue.
- Scheme entry is block 10: `Week 9 - Basic ecological concept`; hash `d1280651e04f2949bdf20742f3d11e06ded8d319bde136b880fa79bbe9c33e72`.

## Scheme objective and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Week 9 — Basic ecological concept | Scheme block 10; label block 951; teaching blocks 953-974 | PARTIAL | The source defines ecology and related ecological concepts, and describes ecosystem components. The package has no lessons, so source-only teaching is not yet deliverable. |

| Source content | Exact blocks | Evidence |
|---|---|---|
| Ecology and branches | 953-955 (range `4e2248cd299fef9581d1d7534529697b33c89699a9643c2a6367e3e67d8c74fd`) | Defines ecology and its branches, autecology and synecology, with examples. |
| Ecological concepts | 956-967 | Defines habitat, environment, ecosystem, community, biome, biosphere/ecosphere, lithosphere, hydrosphere, atmosphere, ecological niche and population. |
| Ecosystem components | 968-974 (range `fd44a59ad93caf6690d7a057312bcffd9f521faf24feca364b4b174f00ff9f1a`) | First distinguishes biotic and abiotic components; then lists producers, consumers and decomposers as groups within the biotic component and gives examples of abiotic factors. |

## Assignment review

The source labels block 975 `ASSIGNMENT` and block 976 `WEEK NINE`. Questions are in blocks 977-983 (range `22f97f48eafe27762037363be892498203d3137f15dbe3d81193ec59afea52f7`).

| Question | Source check | Disposition |
|---|---|---|
| 1a. Define ecosystem, niche, biosphere, population and habitat | Definitions appear at blocks 957-962 and 966-967. | Supported by the source text. |
| 1b. List the three components of ecosystem | Block 969 says an ecosystem comprises biotic and abiotic components; blocks 970-973 then identify producers, consumers and decomposers within the biotic component. | UNRESOLVED: the question's phrase “three components” is ambiguous against the source's two-part biotic/abiotic structure and its three biotic groups. |

No answer key or marking guide accompanies the assignment. `BIOLOGY-T1-W09-ASSIGNMENT` records the teacher decision required; no answer is invented.

## Material census

- Blocks 951-984 contain no drawing, VML fallback, Word table, embedded object or text box; two tab elements occur in the range.
- No experiment or practical section appears in the Week 9 body.
- No new visual-disposition task or asset was needed.

## Package and queue changes

- `biology.json`: added `COV-BIO-T1-W09-SCHEME-9` (PARTIAL) and `COV-BIO-T1-W09-ASSIGNMENT` (UNRESOLVED), plus blocking open items for missing lessons and the ambiguous assignment prompt. Existing sources, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T1-W09` IMPLEMENTED_TESTING_DEFERRED; appended `BIO-LES-T1-W09-ECOLOGY`; recomputed counts and `next_runnable`. Totals are 19 IMPLEMENTED_TESTING_DEFERRED, 69 PENDING and 5 BLOCKED.
- No lesson, answer key, correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; Week 9 label, scheme and range hashes; hashes for the ecological-concept, ecosystem-component and assignment ranges; comparison of assignment prompts with source teaching; structural drawing/table/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
