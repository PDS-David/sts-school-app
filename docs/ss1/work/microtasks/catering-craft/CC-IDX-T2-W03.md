# CC-IDX-T2-W03 — Catering Craft, 2nd Term Week Three source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no lesson authored, no answer key created, no factual correction made, no content approval or verification claimed. Tests, importer, database and device runs remain deferred by owner.

## Verified input and locator

- Composite archive: `docs/ss1/sources/SSS1-original.zip`
- Archive SHA-256 expected and observed: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Exact member: `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`
- Member SHA-256 expected and observed: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`
- Extractor: `word-extractor` 1.0.4, `extract(path).getBody()`, the same legacy .doc extraction call used by the importer.
- Full getBody() SHA-256: `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` (67,884 characters; 1,406 lines).
- WEEK THREE label: line 384. Week range: lines 384–613 inclusive; 230 lines, 12,928 characters; SHA-256 `e3fc8b5b4a674e546281d2dacf8f8f5f340d273675e09eb2588a31507bfd5330`.
- Scheme row: line 10, exact text `3.\tFood Commodities- Milk, Vegetables and Fruits`; SHA-256 `db22520e7f7ae49ba79ba4539d49e5450cef438ebfb1dd504c0faaf4b8adacd8`.
- The scheme row and the week CONTENT list (lines 386–387) agree; positional mapping is unambiguous.
- The archive and both assigned source-member hashes were checked before extraction. The private extracted text and render were not committed.

## Section index

Line numbers are 1-based over `getBody()` split on `\\n`. Each section hash is SHA-256 over the exact UTF-8 lines in the listed inclusive range joined with `\\n`. Blank separators are excluded from individual section hashes but retained in the complete week hash above.

| Source section | Lines | SHA-256 | Indexed content |
|---|---:|---|---|
| WEEK THREE label | 384 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | Week marker |
| TOPIC: FOOD COMMODITIES | 385 | `b1bdbf04bafb58735b2c4c4e5ee0838caacc0eed217faa00314eba3a3f1aab55` | Topic heading |
| CONTENT | 386–387 | `51a1e1efd9f3b819d84a1424c87beb09d4292ecf1eb66c7afa5d267661af4f37` | Milk, Vegetables and Fruits |
| MILK | 389–390 | `4e709938b0b859a54bd49903996b5a4b97370278e3c6a04a8f03abe2c0dcc81c` | Definition and general use |
| FOOD VALUE OF MILK | 392–398 | `9dc0908022eb9a70b08189d99f044712c5f51afed43f751f5a75c3272bc6aec0` | Protein, carbohydrate, fat, minerals, vitamins and water |
| TYPES OF MILK | 400–409 | `273bd7002f7ccb4f1d13aa33fcdb939f09757d6538d79a33e67ebbc70aa35069` | Nine listed types |
| EVALUATION 1 | 411–413 | `5467fe165350e70befda8b032a6ebd075b8edc1475ef03369c64545552bbbc70` | Two questions on milk food value and types |
| DIGESTIBILITY OF MILK | 415–418 | `ed436cc8f0ff6b04e0e7bdbdf62bd657d52eea585ac9e14c9e76dee6f8d2b9a8` | Clot formation and factors affecting digestibility |
| Ways of making milk more digestible | 420–424 | `7d7244fc5df3d3457e9b7e20e308eb97e202a8434c70a97ea314bd2d53d47930` | Four methods listed by source |
| STORAGE OF MILK | 426–427 | `965db229d4172f7da645f38832af6034803b5d0aa91b0751e48f8351584c6a76` | Perishability and stated refrigerated duration |
| Storage points | 429–435 | `21cee941a7a3f22c34a890f03da19b4e3cb8bae6d6413423afee181c4d43ea82` | Six storage points |
| PRESERVATION OF MILK/HEAT TREATMENT | 437–444 | `37706573d602888df0fa26085e670f34db44146c74b0c7d2d7276338d8aeba4b` | Evaporation, dehydration, pasteurization, sterilization, UHT and homogenization |
| EVALUATION 2 | 446–448 | `655b48242beb85a674e5ce353d3eb39acf6ccc0803c4cd8f84ecff6622517085` | Two questions on preservation and digestibility |
| USES OF MILK | 450–455 | `1b0ee577df607ea208df2d034d9d2b35dbb9d17d6bb05c401a32c09aa1b316c5` | Four use categories |
| MILK/DIARY PRODUCTS — Cheese | 457–459 | `e6f59ddf49bd5d8e928a94154a13b37c8c5b463f77aa5d615e5366e72a830c76` | Cheese production and rennet |
| Types of cheese | 461–466 | `a2fd820424642c83d4889b59f710031ed559c04093392cf94d33f5217645048c` | Five types listed |
| Uses of cheese | 468–473 | `47c5b0333dda5d13f215a040078cdfde08adc61ef4618182de2d0334f40af8f6` | Five use statements |
| YOGHURT | 475 | `45c8863ba0a69f832e4f17c92a3420de813f1c1bcf4426b81bf75905fdbb6580` | Fermentation and yoghurt culture |
| Uses of yoghurt | 477–481 | `9981b5826545e558708be784249395550435f343254aa6990c2dbe5d9e2f2088` | Four uses |
| EVALUATION 3 | 483–485 | `32177ca3336813b411724684a0a8e8f5b1297155aabb08f07068957233c8e016` | Cheese types and yoghurt uses |
| VEGETABLES | 487–488 | `274857812112629a92ff2c7aad5f0cac0f511f9d6164e21a8e27b0fb016bd803` | Definition |
| CLASSIFICATION OF VEGETABLES | 490–499 | `77edeeb41cbd41ca7dc812b47ed4abb9f93dea5eb22e9a0ce755bea2cbdef400` | Nine classes and examples |
| FOOD VALUES OF VEGETABLES | 501–506 | `aa89342fcdca6c6108b6edf403f4a539f60488364f3b2731d6bbcf3b8ae09b74` | Protein, carbohydrate, minerals, vitamins and water |
| EVALUATION 4 | 508–510 | `e8b4f95fa1c97d530150d6a4f80b7865f006ea07008c51c0afa16465542803e6` | Nutrients and vegetable classes |
| QUALITY AND PURCHASING POINTS — Root Vegetables | 512–515 | `04f9ea0d9b9e123082798e1ec76577b094f9dd3ac6eb80160130235a5073ed56` | Root-vegetable selection |
| Green Vegetables | 517–522 | `06975232f399fb5e74f10c461f969a724312a8f1fdc97229bbb855658c208f84` | Green-vegetable selection |
| STORAGE OF VEGETABLES | 524–529 | `f5ca1231d06fafabd56821bda6db1417cc0fcbdbabb47498736ac65a275a76aa` | Five storage points |
| PRESERVATION OF VEGETABLES | 531–536 | `56ec725174a93bb347ecd545cf60ebad13aeeb76af6120489bec6499cc458e64` | Canning, drying, pickling, salting and freezing |
| EVALUATION 5 | 538–540 | `560c9d9c37f77edaf30531a8a7332a28c03c4ed8bea763fd11ca919509fa41f6` | Vegetable storage and preservation |
| FRUITS | 542–544 | `6ee4659c2a492b1849c2ac2fd84dedf821f98fc19167885820f30262fc5fd22e` | Definition |
| FRESH FRUITS | 546–551 | `2d294177df01aef4251b3e5ac8e9b937d662a4bd242f41e79abc70679064bec8` | Five groups and examples |
| DRIED FRUITS | 553 | `f91eb7890e1e871c7866bfbfa1a5e2eac725b385489c142d93c0bce0ff06d96a` | Examples |
| NUTRITIVE VALUE OF FRUITS | 555–558 | `3b62d3e03334629390d47af3c1cac730afab93c5c0b4134e23ef8efafad09d45` | Vitamins, carbohydrates and minerals/organic acids |
| EVALUATION 6 | 560–562 | `d8c08d8396c92395992bebc98de3726577db8f0eb409317c7278f3cf34afada9` | Fruit classification and nutrients |
| WAYS OF SERVING FRUITS | 564–569 | `11ce3ab5700b8749c2b5562632c0791d063daa99d05b1b4a42c92895e39abc94` | Five ways |
| POINTS TO CONSIDER WHEN PUCHASING FRUITS | 571–576 | `06a6ec4d12df676f560cbf1cbed3666a0ca58c4c52402dc4c1b32e538e4d5cf4` | Five purchasing points |
| Methods of Preservation of fruits | 578–584 | `eb008416b3dcbf30231d01375ac1018b72459a040750192df405b550fd21f068` | Drying, canning, bottling, freezing, cold storage and gas storage |
| EVALUATION 7 | 586–588 | `33d9e5ea9ea8394570e7dc35e12c23442996db5c0337e37938f49af5b7b20b9a` | Fruit serving and preservation |
| GENERAL EVALUATION | 589–594 | `57faac2403b36554ecc89fb3f66d9f4848a08170550acaaf5c39962d40b7a5a1` | Five questions spanning milk, vegetables, fruits, eggs and catering safety |
| READING ASSIGNMENT | 596–599 | `796862c48f9298b995322c9e7bac06a988aeb2d460b4f3dffc6c4cff26b88ec5` | Two textbook references |
| WEEKEND ASSIGNMENT | 601–609 | `e3c502a1e817231dd5596bbe4a135910df0ffc26e0e243360d3bf92e4799e667` | Five multiple-choice questions |
| THEORY | 611–613 | `32d935d5fd66e300e6aa1099e3e39ebe2812d13849971c21fbceeecb3ae8bc8a` | Two written-response prompts |

## Objective candidates (indexed, not yet converted into lessons)

1. Define milk and describe its stated food value.
2. Identify and describe the milk types listed in the source.
3. Explain the source's account of milk digestibility, the factors it names and its listed methods.
4. Describe the source's milk storage and preservation/heat-treatment methods.
5. State the listed uses of milk.
6. Describe cheese production, classify the listed cheese types and state uses of cheese.
7. Explain yoghurt production and state the listed uses of yoghurt.
8. Define vegetables and classify them using the source's nine groups and examples.
9. Describe the listed food values of vegetables.
10. Identify the source's purchasing/quality points for root and green vegetables.
11. State the listed storage and preservation methods for vegetables.
12. Define fruits and classify the listed fresh and dried fruits.
13. Describe the stated nutritive value of fruits.
14. State ways of serving and purchasing fruits.
15. Identify and describe the listed fruit-preservation methods.

These are source-derived objective candidates only. They are not approved curriculum objectives and do not establish lesson completion.

## Assessment and supporting blocks

- EVALUATION 1: 411–413 (2 questions).
- EVALUATION 2: 446–448 (2 questions).
- EVALUATION 3: 483–485 (2 questions).
- EVALUATION 4: 508–510 (2 questions).
- EVALUATION 5: 538–540 (2 questions).
- EVALUATION 6: 560–562 (2 questions).
- EVALUATION 7: 586–588 (2 questions).
- GENERAL EVALUATION: 589–594 (5 questions; includes eggs and catering-establishment safety beyond the week’s core milk/vegetable/fruit topic).
- READING ASSIGNMENT: 596–599 (two cited textbooks).
- WEEKEND ASSIGNMENT: 601–609 (5 MCQs).
- THEORY: 611–613 (2 prompts).

No answers, marking scheme, marks or practical-assessment rubric appear in these blocks. The source's assessment content is indexed, not answered or silently dropped.

## Source-quality and factual-dependency observations

- The heading at line 457 is spelled `MILK/DIARY PRODUCTS`; the original spelling is retained.
- The source also contains apparent spelling/wording defects such as `breet roots` (491), `sapphire` in the stems/shoots examples (498), `vary quantities` (505), `loose value` (529), `pineaaple` (607), and a repeated `c)` in the fresh-fruit list (549–550). These are recorded, not silently corrected.
- Milk composition statements are at 393–398. Milk digestibility and storage statements are at 415–435. Heat-treatment figures are at 441–443. Fruit freezing/cold-storage figures are at 582–583. The relevant heat/storage/digestibility and preservation claims are already routed to `CC-FACT-T2-MILK-HEAT-STORAGE`; no factual conclusion is made in this indexing task.
- The source-wide inventory found six tables and no embedded pictures/drawings; none of the six tables is in Week Three. The student assessment and teaching text remain intact in the source archive.
- The scheme and body both identify milk, vegetables and fruits. No source_alias, split rule or marker rule is added for this week.

## Package outcome

- Added `COV-CC-T2-W03-SCHEME-3` to `backend/src/db/ss1/subjects/catering-craft.json`.
- Coverage status is **PARTIAL**, with an empty `lesson_ids` array: the source is indexed and teaches the topic, but no deliverable lesson exists and factual/assessment gaps remain.
- Package status remains **PENDING**. No lesson, correction, asset, source rule, answer, approval or verification was added.
- Importer/parser behaviour was not executed; no parsed lesson identity is asserted.
