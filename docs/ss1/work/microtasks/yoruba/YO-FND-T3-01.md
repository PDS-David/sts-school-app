# YO-FND-T3-01 — Yoruba, Third-Term scheme and week-structure audit

Status: **IMPLEMENTED — TESTING DEFERRED** (bounded foundation analysis delivered; no schema, compiler, parser, package or source edit).

## Source and evidence boundary

- Source: `SS1-SRC-4cc6aae9ed7d`
- Manifest member: `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`
- Source-member SHA-256 recorded by the earlier inventory: `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`
- Archive SHA-256 recorded by the earlier inventory: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Primary evidence: `YO-INV-T3.md` and `YO-PRE-T3-1.md`; prior Yoruba foundation comparisons: `YO-FND-T1-01.md` and `YO-FND-T2-01.md`.
- The earlier inventory re-verified the archive/member bytes and recorded the extraction method. This task reused those records and inspected the current contract, schema, compiler and parser source. It did not reopen the archive or run the parser/compiler.

## Source structure

The source inventory records:
- Scheme heading at line 3; line 5 is only `Ose: `.
- Ten positional EDE/ASA/LIT scheme groups at lines 7–79, followed by a revision/test pair at lines 81–83. The scheme has no explicit week numbers or per-group week labels.
- Ten teaching sections in the body, with unique Yoruba ordinal headings:

| Teaching week | Exact heading anchor | Extracted line |
|---:|---|---:|
| 1 | `OSE KINNI` | 121 |
| 2 | `OSE KEJI` | 427 |
| 3 | `OSE KETA` | 679 |
| 4 | `OSE KERIN` | 963 |
| 5 | `OSE KARUN-UN` | 1281 |
| 6 | `\t\t\tOSE KEFA` | 1357 |
| 7 | `OSE KEJE` | 1625 |
| 8 | `OSE KEJO` | 1879 |
| 9 | `OSE KESAN-AN` | 2161 |
| 10 | `OSE KEWAA` | 2313 |

The ten teaching headings are unique. Week 6 has three leading tabs; those tabs are part of the exact anchor and must be retained. The source inventory records that the revision/test pair has no Week 11 teaching body.

## Audit of the alleged foundation limitations

| Alleged limitation | Current evidence | Finding |
|---|---|---|
| The importer parser cannot recognise Yoruba ordinal headings | `ingestTopics.ts` recognises English `WEEK N` markers and bare numeric lines; this source has Yoruba headings instead. Without source rules, the inventory records no parser week markers and no parsed teaching rows. | True for the unmodified source; a rule-based solution already exists. |
| The current schema/compiler cannot split before Yoruba headings | `subjectPackageSchema.ts` supports `split_before`; `compiler.ts` inserts `WEEK <numeric-label>` before a unique line-initial anchor. Its anchor matcher preserves significant leading/trailing whitespace. | False. Ten rules can insert numeric week markers before the ten unique headings. This is the same mechanism established in `YO-FND-T1-01` and `YO-FND-T2-01`. |
| A flat positional scheme cannot be mapped to the ten teaching weeks | The contract's coverage record carries `objective_locator`, `lesson_ids` and evidence. The ten group line ranges and ten body-section line ranges are recorded in `YO-INV-T3.md`. | Not a schema blocker. The worker can map each positional scheme objective to its corresponding parsed body/lesson using exact locators and evidence. The compiler need not infer position from repeated `EDE:`, `ASA:` and `LIT:` text. |
| The revision/test pair has no body and cannot be represented | The pair is in the preamble (lines 81–83). The compiler explicitly allows a `SCHEME_ONLY` marker to match zero parsed teaching rows; the existing `YO-PRE-T3-1` record already adds a `SCHEME_ONLY` rule and MARKER coverage for the scheme preamble. | No new representation is required. Keep the pair as a scheme-only marker; do not invent a Week 11 lesson. |
| Missing/inconsistent EDE/ASA/LITIRESO headings require parser changes | The parser splits week blocks; it does not need to parse the strand labels. The inventory records missing part headings in Weeks 3, 4, 7 and 9, a repeated ASA block in Week 10, and LITIRESO gaps in Weeks 5 and 10. | These are source/content mapping gaps, not parser limitations. Keep them in week-specific coverage and open items; do not change the parser to infer missing content. |

## Bounded implementation route using the current foundation

1. For each teaching section, add one `split_before` rule to the Yoruba source package using the exact heading anchor above and numeric `week_label` 1–10. Each rule must bind the registered source ID/hash and carry a precise evidence locator. The Week 6 anchor must retain all three leading tabs.
2. Map each of the first ten scheme groups to the corresponding week using the group locator (lines 7–79), the exact scheme objective text and the parsed lesson/row identity produced by the rule. Record objective-level evidence; do not use title similarity alone.
3. Retain the existing preamble `SCHEME_ONLY` marker for the revision/test pair (lines 81–83). Represent it as a marker, not a teaching row.
4. Leave missing LITIRESO content, missing strand headings, the Week 10 duplicated ASA block, and any unverified source corrections as precise open items. These need content decisions or correction tasks, not parser changes.
5. Keep content approval PENDING and verification DEFERRED until actual review and later verification evidence exist.

This route changes no source character and preserves content-bound body identities. It is a bounded authoring task for the Yoruba package, not a shared compiler/schema change.

## Optional foundation request — native Yoruba display labels

A small optional enhancement may be considered if the product requirement is to display the source's Yoruba ordinal as the week label rather than display `WEEK 1` while retaining `OSE KINNI` as the row title:

- Add an optional `display_label` field to `split_before`/the parsed-row metadata, while retaining the numeric week number as the stable ordering key.
- Carry the display label separately through compiler output and the student-facing row model; do not overload the numeric marker or rewrite the source body.
- Version the shared contract, add focused fixtures for Yoruba ordinals and whitespace-bearing anchors, and verify backward compatibility for existing numeric-week packages before adoption.

**Decision requested:** treat this as an optional display enhancement, not a prerequisite for SS1 Yoruba parsing, coverage or delivery. If the existing row title is sufficient for the product, decline the enhancement and proceed with the ten current-schema rules. No schema/compiler edit is made by this task.

## Disposition

The broad claim that a foundation change is required to parse or cover the Third-Term Yoruba scheme is not supported by the current contract/compiler. The actual immediate work is ten source-bound split rules plus exact coverage mapping, which belongs to the subject package. The only plausible shared-foundation request is the optional native display-label enhancement above.

No source rule, package content, schema, compiler, importer, route, database, UI or other subject was changed. No tests, typechecks, parser/compiler, importer, database or device checks were run. Testing remains deferred until implementation is complete.
