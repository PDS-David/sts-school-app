# BIO-VIS-T2-W09-FOODWEB-REDRAW — source visual audit

Status: **BLOCKED — source visual audit complete; registered asset not yet safe to commit.**

## Source identity and integrity

- Archive: `SSS 1-20260507T072431Z-3-001 (1).zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — matches the task's required hash.
- Member: `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`
- Member SHA-256: `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44` — matches the task's required hash.
- The archive passed ZIP integrity testing. The legacy DOC was converted for inspection; the extracted figure is `word/media/image5.jpeg`, 444 × 318 pixels, SHA-256 `50311108eb6f166b8be28eb7b6a4bbeac8bbf1c0c76acaafe2884e81988ee563`.
- Source locator: Second Term, Week 9, direct body block 818.

## Visible labels and correction

The figure contains these labels: Green Plant; Poducer; Mouse; Rabbit; Goat; Owl; Wild Cat; Jackal; Snake; Lion; Kite. Its caption is **Food Web in a Forest**.

The project-authored redraw must use **Producer**. Correction note required in delivery: *The original source figure spells “Producer” as “Poducer”; the redraw corrects this spelling.* The original image remains unchanged and is not copied into the app asset.

## Arrow endpoints confidently traced

The following directed feeding links have visible arrowheads and traceable endpoints at the supplied source resolution:

1. Green Plant → Goat
2. Green Plant → Rabbit
3. Goat → Jackal
4. Goat → Lion
5. Rabbit → Jackal
6. Rabbit → Wild Cat
7. Mouse → Rabbit
8. Mouse → Wild Cat
9. Mouse → Owl
10. Mouse → Snake
11. Jackal → Lion
12. Wild Cat → Lion
13. Snake → Kite

These links are transcribed from the visible arrows; arrow direction is from food/prey toward consumer/predator.

## Ambiguity handling

Several paths converge and cross in the lower central area around Rabbit, Mouse, Wild Cat and Owl. The redraw must use the thirteen endpoint pairs above only. No additional link is inferred from line proximity or from ecological plausibility. In particular, no unlisted connection to Owl, Kite or Lion is to be added.

## Registration blocker — do not bypass

The task's completion condition requires the new image asset to be registered in `backend/src/db/ss1/subjects/biology.json` with exact bytes/hash, alt text, source locator and project-created provenance. The package currently has no registered lesson rows (`lessons[]` is empty). The compiler contract requires `assets[].lesson_id` to resolve to an exact parser-generated original lesson ID or a stable authored supplement ID. No such ID is present in the package or confirmed in the repository search.

The queue's existing blocking item `BIOLOGY-ASSET-LESSON-ID-BINDING` explicitly prohibits guessing an ID or committing unregistered orphan assets. The owner has also deferred importer/compiler execution. Therefore this audit does **not** fabricate a lesson ID, register an orphan asset, or claim that the redraw is delivered. The task remains BLOCKED until an exact lesson ID is supplied by an approved parser/importer run or a valid supplement lesson is authored and registered.

## Next action

Once the exact lesson binding exists, create a clean, project-authored vector diagram using the labels and thirteen verified links above; register it with its exact SVG bytes, byte count, SHA-256, meaningful alt text, source locator and project-created provenance; then run the package schema/asset-loader checks when testing is authorized.
