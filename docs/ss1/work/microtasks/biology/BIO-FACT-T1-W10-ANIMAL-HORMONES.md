# BIO-FACT-T1-W10-ANIMAL-HORMONES — factual review

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This report checks the seven source rows for factual terminology and anatomy. It does not provide medication guidance. The original school table remains unchanged.

## Source identity and locator

- Source ID: `SS1-SRC-422e0e6ddde9`
- Member: `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`
- Member SHA-256: `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`
- Week 10 table: blocks 1042–1049; table range SHA-256 `65bdc53c31c3e6e7123a436a9521db533b980db705d9cf9ba4d6abbaefe1e080`.
- The source table has three columns (GLANDS, SITE, HORMONE) and seven tab-aligned rows. The rendered source page 43 confirms the row pairings; the plain text extraction alone does not preserve the columns.

## Findings, row by row

| Source row | Finding | Delivery treatment |
|---|---|---|
| Pituitary gland | base of head | “Pituitrin” | **Partly correct location; incorrect modern hormone label.** The pituitary is at the base of the brain. “Pituitrin” is a historical posterior-pituitary extract/preparation, not the name of one current endogenous hormone. The posterior pituitary releases two distinct hormones: antidiuretic hormone (ADH, also called vasopressin) and oxytocin. These are synthesized in the hypothalamus and stored/released by the posterior pituitary. | Replace “Pituitrin” in student teaching with **ADH (vasopressin) and oxytocin**, noting that the source's “Pituitrin” is historical terminology. Do not describe the posterior pituitary as synthesizing these hormones. |
| Thyroid gland | neck | Thyroxine | **Correct but incomplete.** The thyroid lies in the neck, anterior to the trachea and below the larynx. It produces thyroxine (T4) and triiodothyronine (T3); T4 is a valid school-level association. | Retain thyroxine; add T3 as a related thyroid hormone in the explanatory note. |
| Parathyroid | neck | Parathormone | **Correct with a more precise name.** Parathyroid glands are usually four small glands on the posterior surface of the thyroid in the neck. “Parathormone” is also called parathyroid hormone (PTH). | Retain the association; use **parathyroid hormone (PTH; parathormone)** and clarify the usual posterior-thyroid position. |
| Pancreas | “Loop of duodenum” | Insulin | **Hormone correct; site is imprecise/misleading.** The pancreas is an abdominal organ. Its head lies within the C-shaped curve of the duodenum, but the whole pancreas is not located in the duodenal loop. The pancreas also produces glucagon. | Use **upper abdomen, behind the stomach; head lies in the curve of the duodenum**. Retain insulin and mention glucagon as another pancreatic hormone. |
| Adrenal gland | top of each kidney | Adrenaline | **Broadly correct but incomplete.** Adrenal glands sit superior to the kidneys. The adrenal medulla secretes epinephrine (adrenaline) and norepinephrine (noradrenaline); the cortex secretes steroid hormones such as cortisol and aldosterone. | Retain adrenaline as a school example, but specify **adrenal medulla** and note that the gland has distinct cortex and medulla regions. |
| Testes | testes | Testosterone | **Correct.** Testes produce testosterone, which contributes to male reproductive development and function. | Retain; use the plural anatomical name consistently. |
| Ovaries | ovaries | Progesterone | **Correct but incomplete.** Ovaries produce progesterone and oestrogens, among other hormones. | Retain progesterone and add oestrogens as another major ovarian hormone group. |

## Why “Pituitrin” must not be taught as one modern hormone

- OpenStax *Anatomy and Physiology 2e*, §17.3, states that the posterior pituitary does not synthesize hormones; it stores and secretes ADH and oxytocin produced in the hypothalamus.
- The U.S. National Library of Medicine MeSH entry for **Pituitary Hormones, Posterior** records “Pituitrin” as an entry term and defines the current group as posterior-pituitary hormones. The separate MeSH record for **Pituitrin** describes a substance or extract from the posterior pituitary.
- A historical Endocrine Society paper describes Pituitrin as a commercial posterior-pituitary extract (first commercial preparation in 1909). Later biochemical work separated the two active principles, now known as vasopressin and oxytocin.

Therefore, “Pituitrin” should be retained only as a historical source term, not as a current single hormone in the student-facing table.

## Sources

1. OpenStax, *Anatomy and Physiology 2e*, §17.2, “Hormones” — table of endocrine glands and associated hormones, including thyroid, parathyroid, adrenal, pancreas, testes and ovaries: https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones
2. OpenStax, *Anatomy and Physiology 2e*, §17.3, “The Pituitary Gland and Hypothalamus” — anterior/posterior pituitary anatomy and hormone synthesis/release: https://openstax.org/books/anatomy-and-physiology/pages/17-3-the-pituitary-gland-and-hypothalamus
3. OpenStax, *Biology 2e*, §37.5, “Endocrine Glands” — posterior pituitary, thyroid, parathyroid, adrenal, pancreas and gonadal hormones: https://openstax.org/books/biology-2e/pages/37-5-endocrine-glands
4. U.S. National Library of Medicine, Medical Subject Headings, “Pituitary Hormones, Posterior” — historical entry term Pituitrin and current classification: https://www.ncbi.nlm.nih.gov/mesh/68010909
5. Rowe, L. W. (1929), “Studies on Oxytocin and Vasopressin: Pressor Action,” *Endocrinology* 13(2):205–212 — historical commercial Pituitrin extract: https://doi.org/10.1210/endo-13-2-205

OpenStax texts are licensed CC BY 4.0; factual statements are paraphrased. The school source is retained unchanged. No dosage, clinical use or treatment instructions are included.

## Handoff

- This factual review is complete and can be used by the Week 10 lesson author to produce a corrected semantic hormone table.
- The source's seven rows remain preserved as source evidence; corrections are delivery-only.
- The lesson still requires its own source-bound content and marking guide. The Week 10 lesson task remains pending until the hormone-table, mitosis and movement visual dependencies are resolved.
- No app runtime, importer, database, test suite or device verification was performed.
