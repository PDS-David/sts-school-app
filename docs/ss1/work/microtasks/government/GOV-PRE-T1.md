# GOV-PRE-T1 — Government, 1st Term preamble and scheme indexing

**Status:** IMPLEMENTED — TESTING DEFERRED. This records the source preamble and scheme mapping only. It does not create a lesson, claim full teaching coverage, approve the package or verify delivery.

## Source identity and hash accounting

- Source ID: SS1-SRC-40ce7dcaf672.
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e — verified in GOV-INV-T1.
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`.
- Member SHA-256: 50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a; 1,163,776 bytes — verified in GOV-INV-T1 and the uploaded archive.
- Locators use `word-extractor` 1.0.4 `getBody()`, 1-based lines, as established in GOV-INV-T1.
- Title/header block, lines 17–20: SHA-256 `f75dff4d596cd843cf2c4edc3e7521087aad9269eedb7972b91f5a4a362d2496`.
- Scheme block, lines 21–42: SHA-256 `7282181eb168ae114a2311b961108afe4a7111d2211eabe8e0139a97d38bb0a8`.
- Cover paragraphs 1–16 are blank; lines 18, 20 and 43–44 are blank. These are accounted for as blank preamble spans. No aggregate 1–44 digest is claimed; the verified component hashes above are retained.
- Subject header line 19 occurs once and exactly matches the registered `header_text`: `SUBJECT:  GOVERNMENT<TAB>…<TAB>       CLASS:  SS1`. It confirms the subject and class; no reassignment or handoff is needed.

## Preamble structure

| Lines | Source content | Disposition |
|---:|---|---|
| 1–16 | Blank cover paragraphs | Accounted for; no curriculum objective |
| 17 | FIRST TERM E-LEARNING NOTE | Title metadata |
| 18 | Blank | Accounted for |
| 19 | SUBJECT: GOVERNMENT … CLASS: SS1 | Unique registered subject header |
| 20 | Blank | Accounted for |
| 21 | SCHEME OF WORK | Scheme heading |
| 23 | WEEK / TOPIC | Scheme header, not a teaching week |
| 24–41 | Scheme rows 1–10 | Mapped below to teaching-week items |
| 42 | 11. Revision/examination | Scheme-only marker; cross-reference GOV-REV-T1 |
| 43–44 | Blank | Accounted for |

The scheme is plain paragraphs, not a Word table. The scheme block hash above covers lines 21–42. Tabs and line-start continuation lines are preserved as recorded in GOV-INV-T1.

## Scheme-to-week mapping and coverage

The source inventory identifies ten teaching weeks. The preamble task does not assert that a scheme heading proves the corresponding objective is taught. Existing Week 1 coverage is retained; objectives in scheme rows 2–10 are UNRESOLVED until their week-indexing item supplies body evidence.

| Scheme row | Scheme lines | Objective-level map | Coverage disposition |
|---:|---:|---|---|
| 1 | 24–27 | Government as an Institution of the State; Government as an Art of Governing; Government as an Academic Field of Study → GOV-WK-T1-W01 | Existing Week 1 entries retained: institution meaning, art of governing and academic field SUPPORTED; institution need, why-study and reading PARTIAL; assessment keys UNRESOLVED. No duplicate coverage added. |
| 2 | 28–31 | Features of Government; Functions of Government; Why we Study Government → GOV-WK-T1-W02 | Features and functions added as UNRESOLVED. Existing COV-GOV-T1-W01-WHY-STUDY remains PARTIAL and is linked to this scheme row and Week 2 follow-up. |
| 3 | 32–34 | Power; Authority → GOV-WK-T1-W03 | Two UNRESOLVED objective-level entries; one week-level open item |
| 4 | 35 | Legitimacy; Sovereignty; Democracy → GOV-WK-T1-W04 | Three UNRESOLVED objective-level entries; one week-level open item |
| 5 | 36 | Communalism; Feudalism → GOV-WK-T1-W05 | Two UNRESOLVED objective-level entries; one week-level open item |
| 6 | 37 | Socialism; Communism; Capitalism → GOV-WK-T1-W06 | Three UNRESOLVED objective-level entries; one week-level open item |
| 7 | 38 | Fascism; Nazism; Totalitarianism → GOV-WK-T1-W07 | Three UNRESOLVED objective-level entries; one week-level open item |
| 8 | 39 | State and Nation; Political Culture → GOV-WK-T1-W08 | Two UNRESOLVED objective-level entries; one week-level open item |
| 9 | 40 | Political Socialization → GOV-WK-T1-W09 | One UNRESOLVED objective-level entry; one week-level open item |
| 10 | 41 | Unitary government; Federal government → GOV-WK-T1-W10 | Two UNRESOLVED objective-level entries; one week-level open item |
| 11 | 42 | Revision/examination | No teaching-week coverage. Cross-reference GOV-REV-T1; do not invent Week Eleven. |

Twenty objective-level coverage entries were added for scheme rows 2–10. Each is UNRESOLVED, has no lesson ID, and cites the exact scheme row, scheme-block hash and corresponding week item. Nine CONTENT open items—one per affected week—reference those entries and require the matching week-indexing item to inspect the full body span and assess each objective independently. The entries are not treated as supported merely because the scheme lists them.

The existing `COV-GOV-T1-W01-WHY-STUDY` remains PARTIAL: it already points to scheme row 2 line 31 and includes the repeated question in Week 2. It was linked to GOV-WK-T1-W02 rather than duplicated.

## Row 11 revision/examination

Scheme line 42 reads `11.<TAB><TAB>Revision/examination`. GOV-INV-T1 records it as the only revision/examination marker in the document; the teaching body ends at Week Ten and has no Week Eleven label or revision/examination paper. This row is assigned to GOV-REV-T1, not to a teaching week. No classify_marker rule is added here; GOV-REV-T1 owns that disposition.

## Checks and limits

- Reused the source archive/member hashes and `getBody()` locators verified in GOV-INV-T1.
- Confirmed the subject header line 19 is unique and matches the registered header text.
- Confirmed scheme rows 1–10 map to the ten existing week-indexing items; row 11 maps to GOV-REV-T1.
- Added 20 schema-shaped UNRESOLVED coverage entries and nine corresponding CONTENT open items; existing coverage and blockers were retained.
- No lesson, new source rule, correction, asset, approval or verification was written.
- No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed. Testing remains deferred by owner.
