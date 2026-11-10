# BIO-VIS-T2-W09-FOODWEB-REDRAW — project-authored forest food web

Status: **IMPLEMENTED_TESTING_DEFERRED**. The asset and package metadata are authored; approval and runtime verification are not claimed.

## Source evidence

- Source: `SS1-SRC-eb6e9665f42c`, 2nd Term Biology, Week 9, block 818.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Exact source member: `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`, SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`.
- Original embedded image: `media/image5.jpeg`, 444 × 318, SHA-256 `50311108eb6f166b8be28eb7b6a4bbeac8bbf1c0c76acaafe2884e81988ee563`.
- The original image is unchanged and is not included in the repository.

## Created asset

- File: `backend/src/db/ss1/assets/biology/forest-food-web.svg`
- Asset ID: `BIO-ASSET-T2-W09-FOODWEB`
- Lesson ID: `SUP-SS1-BIOLOGY-T2-W09-FOODWEB-DIAGRAM`
- Media type: `image/svg+xml`
- Bytes: **3597**
- SHA-256 (computed from final SVG bytes): `4b17ba6e25544d48a9dc0995606c67f33493c34f8fb764a27db5974f871ea57c`
- Alt text is registered in `biology.json`; provenance records independent project authorship and no reuse of source pixels.

A concise Week 9 visual lesson is registered as the asset's actual lesson target. It teaches the arrow direction, identifies Green Plant as the producer, includes keyed practice and explicitly records the source spelling correction. It remains content-approval pending and verification deferred. This visual lesson does **not** complete the separate `BIO-LES-T2-W09-FUNCTIONING-ECOSYSTEM` task, which remains pending for the broader functioning-ecosystem lesson.

## Arrow connections retained

The redraw keeps only the links whose start and arrowhead can be followed in the source image:

1. Green Plant → Rabbit
2. Green Plant → Goat
3. Mouse → Rabbit
4. Rabbit → Owl
5. Rabbit → Wild Cat
6. Rabbit → Jackal
7. Goat → Jackal
8. Goat → Lion
9. Jackal → Lion
10. Wild Cat → Lion
11. Mouse → Owl
12. Mouse → Snake
13. Snake → Kite

## Ambiguous links deliberately omitted

- **Green Plant → Mouse:** a faint line is visible near the plant/mouse baseline, but its arrowhead is not sufficiently distinct.
- **Mouse → Wild Cat:** the lower crossing paths near Rabbit and Wild Cat do not establish an unambiguous start point.
- **Mouse → Jackal:** a long diagonal overlaps other links; its source endpoint cannot be separated confidently from the Rabbit/Goat paths.
- Any other crossing line without a confidently traceable source and arrowhead is omitted.

These omissions are intentional. No ecological relationship is added merely because it would be biologically plausible.

## Spelling correction

The source image prints **“Poducer”**. The new student-facing diagram uses **“Producer”**. The source image is not altered; the correction is disclosed in this report and in the visual lesson.

## Validation record

The final SVG byte count and SHA-256 were computed locally from the completed file. Package metadata records those exact values. The report and package were authored against the current master base commit `30bfbc8e568480c46681de11deab9622fe7ac339`.

Required gates:
- `cd backend && tsc --noEmit` — **NOT RUN** (repository checkout/dependencies are not available in this execution environment).
- `node --import tsx --test tests/ss1/biology.package.test.mts tests/ss1/compiler.anchor.test.mts` — **NOT RUN**.
- `node --import tsx backend/src/db/ss1/validateSubjectPackages.ts biology` — **NOT RUN**.
- SS1 importer/compiler execution and app/device display verification — **NOT RUN**.

The asset's implementation is recorded as IMPLEMENTED, content approval as PENDING, and verification as DEFERRED. It is not certified as student-delivery ready until the deferred gates and approval are completed.
