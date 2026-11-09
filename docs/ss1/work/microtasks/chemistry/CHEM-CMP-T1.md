# CHEM-CMP-T1 — comparison of the two SS1 Chemistry first-term sources

**Status:** IMPLEMENTED_TESTING_DEFERRED. Both sources remain registered and retained. This is a source comparison, not a decision to discard, merge or prefer either file. No lesson, source rule or content correction is written here.

## Identity, hash and role

| Property | Source A | Source B |
|---|---|---|
| Source ID | `SS1-SRC-58b4a44c3afa` | `SS1-SRC-84df18289b7a` |
| Archive member | `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx` | `SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx` |
| Member size | 2,187,976 bytes | 1,656,948 bytes |
| Member SHA-256 | `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` | `0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a` |
| Extracted text | Mammoth 1.12.2, 55,382 characters / 2,129 lines | Mammoth 1.12.2, 118,241 characters / 3,303 lines |
| Extracted-text SHA-256 | `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` | `05f0cdbe8ac5f71a677ad7adc38851d922b0ef51822b5afde7979508c055c862` |
| Header / role | “FIRST TERM E-LEARNING NOTE”; Chemistry, SS1 | “CHEMISTRY SS1”; scheme title “ALPHA TERM”; Chemistry, SS1 |
| Structure | 13 scheme rows, 10 body week markers, revision/examination scheme-only | 10 scheme rows, 11 body labels including Week 6b; no revision/examination scheme rows |

Both documents are assigned as SS1 Chemistry 1st Term sources. Their member hashes, sizes and extracted-text hashes all differ. They are not byte-identical copies. Their roles overlap (both contain a scheme and teaching notes) but their topic order, section boundaries and content differ materially. Neither is treated as a duplicate or substitute.

## Per-section comparison

The dispositions below compare the verified week inventories, exact titles, scheme rows, line ranges and hashes. “Topic overlap” means that the indexed headings cover a related chemistry concept; it does **not** claim verbatim or complete teaching equivalence. No same-teaching finding is made without a matching content hash or a line-level text comparison.

| Source A section | Source A locator / hash | Closest Source B section | Source B locator / hash | Finding |
|---|---|---|---|---|
| Opening and scheme | lines 1–89; hash `d01fc682173f614403ea120cd39a74318967565bb9f054c12bec8f916f5f0722`; 13 rows incl. Revision and Examination | Opening/scheme lines 1–42; hash `3f04d417eb61e69a8495462a8d480e22fd8e224c65d5f9eadb7dde1f1298ea4d`; 10 rows | Both provide first-term schemes; A uniquely includes Revision and Examination rows. Complementary schemes, not duplicates. |
| A Week 1 — Introduction to Chemistry | lines 90–245; `8b348aa6be31cc15d603c4054646f4a0cdd0874c7c0cd38fd14c12fb3d3519f3` | B Week 1 — Chemistry as a Subject and as a Central Science; lines 43–728; `f5fb2013de4658198475c1106b421e5e28adde12b6892f4b88d6159e4f2083f4` | Same broad introductory role, but titles and section structures differ. Topic overlap; not proven identical teaching. |
| A Week 2 — Laboratory Familiarization | lines 246–415; `3064d93fa4b6050c3522c4be0fa06690cb505b4666a7508d80bcf2cd862e5d05` | B Week 2 — Particulate Nature of Matter; lines 729–1346; `7bf6ab74ead834c12c50830bc00f89df57cfa5e5d1610f1feaac029ac33f3d3c` | Laboratory apparatus/safety is unique to A's indexed week title; B's Week 2 is a different topic. |
| A Week 3 — Nature of Matter | lines 416–607; `7dac5adad12109abcc1f79c7f76006f9f6195bcc548ce4bf4c72e4ea1e57ebc2` | B Week 2 — Particulate Nature of Matter; lines 729–1346; hash above | Related matter concepts, but the source headings and sequence differ. Complementary topic overlap, not same teaching. |
| A Week 4 — Elements & Symbols, Valency | lines 608–867; `4aea3a2b6e25c43d020c89763df5216007c01031981f9040d4373a57b580dd9c` | B Week 3 — Elements; lines 1347–1454; `3e805204787d90c9f63f5343c184769145fcc1722b64b86e7594bf0bdcfd1997` | Elements overlap; A's title explicitly includes symbols and valency. Complementary, not identical. |
| A Week 5 — Compounds and Mixtures | lines 868–1115; `0928fd18ab69956502440832da5e87685c9c54ffc584ef53a8763eb6dccfb31d` | B Week 7 — Compound; lines 1959–2712; `168837ded68a245e5e1a6ed422a7632164a4b72d2587de7e3d66d7977ff7d42b`; and B Week 9 — Mixtures and Separation Techniques; lines 2761–3298; `dd3252366c47dc5d10726d1e07defa2f466937aa2046f42e98a4aeb08690cb89` | B distributes A's combined topic across separate weeks. Complementary/split coverage; not same section. |
| A Week 6 — Standard Separation Techniques for Mixtures | lines 1116–1335; `e5e147ad7fb2954b63f69d8c7c37c4e3d507cbdef6108d0c82ffec3c87bab478` | B Week 9 — Mixtures and Separation Techniques; lines 2761–3298; hash above | Broad separation-technique overlap; A gives a standalone methods week while B places it within mixtures. Complementary, not proven identical. |
| A Week 7 — Particulate Nature of Matter | lines 1336–1489; `8afae8fe7429d6acf133b984dc4a283f6eb0c848477350e2c19cff942ebfb66d` | B Week 2 — Particulate Nature of Matter; lines 729–1346; and B Week 5 — Particulate Nature of Matter (atomic structure); lines 1537–1886; `ed4b66a2a51738ea52c58342a257d4724e7adbdc8e9dd214898de93901d4bc69` | Shared heading/topic family, but B splits matter and atomic-structure content over separate bodies. Topic overlap; exact duplicate content not established. |
| A Week 8 — IUPAC Nomenclature of Chemical Compounds | lines 1490–1667; `94be1f5931d2fc33a57fba5f16e7ee4eefd989cce64622163e00e82283c45038` | B scheme row 8 promises IUPAC Nomenclature, but B Week 8 body is Oxidation Numbers; lines 2713–2760; `a0523847b11597ae30b15f9c760b0224a63b6440ed3a87ca914f13f6a72ffcc5` | A contains the indexed IUPAC body; B's scheme/body mismatch leaves IUPAC teaching unlocated in B's Week 8 inventory. Unique body section in A; B has a scheme-only promise. |
| A Week 9 — Atomic Number, Mass Number, Isotopes and Calculations | lines 1668–1895; `8623a58d206c485f4a6c2727ddd96e045a3742cf5efa0fdcfbcea2cf74375d90` | B Week 6 — Relative Atomic Masses; lines 1887–1894; `5f68297d81a518c9f102c8d8c3c962bcd41865ffc6539b8b85086ecbcb6dffe5`; B Week 6b — Atomic Weights and Isotopic Abundance; lines 1895–1958; `198588d902014ae9544f78e500e0268fb387d425de45530fb27fe5bdb0ae2620` | Strong topic overlap, split across two short B sections. A's atomic number, mass number and calculations are not shown as identical in B's inventory. Complementary, not duplicate. |
| A Week 10 — Structure of the Atom: Orbitals and Electronic Structure | lines 1896–2129; `c39b761173ca4cc92564400e195eb53d08be2775fc3b4230d2aff76cc4e33ce0` | B Week 5 — Particulate Nature of Matter (atomic structure); lines 1537–1886; hash above; B Week 10 — Practicals on Separation Techniques, title-only; lines 3299–3303; `0ddbb2aaf8efaa7d760ee99d111e9445b33530253945f8054284fcfdd5170a69` | B Week 5 overlaps atomic structure; B Week 10 is unrelated and title-only. A's orbital/electronic-structure body is not matched by B Week 10. Complementary overlap with B Week 5; A's orbital body is unique in the inventories. |
| — | — | B Week 4 — Molecules and Atomicity; lines 1455–1536; `0d8cda131a403ef1c0ab83348c391736a7ec8fdd960bc974c1d1609ae4616d9b` | Unique B teaching section by indexed title; no corresponding A week title. |
| — | — | B Week 8 — Oxidation Numbers; lines 2713–2760; hash above | Unique B body topic; the B scheme instead promises IUPAC nomenclature. No matching A week title for oxidation numbers. |
| — | — | B Week 10 — Practicals on Separation Techniques; lines 3299–3303; hash above | Title-only marker; no practical body. It is unique as a marker, not a deliverable lesson. |
| A Revision / Examination | Scheme rows 12–13, lines 69–71; no body | B scheme lines 1–42; no Revision or Examination row; B body ends after title-only Week 10 | Revision/examination markers exist only in A's scheme; neither source supplies revision notes, an examination paper or a marking scheme. |

## Content-level and duplicate decision

- The source-member hashes and extracted-text hashes are different; every corresponding week-range hash shown above is also different. No week pair is byte-identical.
- The inventories establish overlapping topic areas, but do not provide evidence that the two files contain the same teaching paragraphs. Therefore **no pair is classified as “same teaching”** and no coverage is linked as an exact duplicate.
- Topic overlap is recorded only where the indexed headings and scheme rows support it. The B file contains several unique or differently arranged sections; A has unique laboratory familiarization, IUPAC body content, atomic-number/isotope calculations and orbital/electronic structure by its indexed headings.
- Both sources remain distinct registered sources. Do not delete, merge, ignore or select one based on filename, size, or topic resemblance.
- If later section-level text comparison is needed for lesson deduplication, compare the exact extracted paragraphs and preserve their original source IDs and line locators. The present record does not claim a full paragraph-by-paragraph duplicate audit.

## Evidence files
- `CHEM-INV-T1A.md`: A's verified member and extracted-text hashes, scheme, ten-week inventory, structures, images and formatting.
- `CHEM-INV-T1B.md`: B's verified member and extracted-text hashes, scheme, eleven labels, structures and media.
- Both source documents remain in the verified archive; no private extracts or original files are committed.

## Disposition
Comparison completed at the level supported by the verified inventories. Both source registrations remain active. No package source, lesson, rule, coverage record, correction, asset, answer or approval is changed by this task. Testing, importer, database and device runs remain deferred by the owner.
