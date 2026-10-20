# P1 — protected baseline comparison (gate still BLOCKED)

**Status: BLOCKED.** The owner's certified export of the 2,179 Primary/JSS1/JSS2 rows
(stable identity + full content) has not been supplied. No rows were compared, nothing is
verified, and no result from this folder may be cited as verification of those rows.
`OPEN_BLOCKERS.csv` OB-06 stays open.

This folder holds only the comparison tool, ready for when the export arrives. It was tested
on synthetic fixtures only. No filename for the export is assumed; identity columns are
passed explicitly.

```
python3 compare_baseline.py --baseline <certified-export.json|csv> \
  --snapshot <release-snapshot.json|csv> --key <identity columns> --output report.json
```

- Exit 0 PASS, 1 FAIL, 2 BLOCKED (missing/unreadable input; never reported as PASS).
- PASS needs exactly 2,179 baseline rows, no missing/unexpected/duplicate identities and no
  content differences (all non-key baseline columns unless `--content` narrows them).
- The report names identities and differing field names only, never field values.
- Run tests: `python3 -m unittest test_compare_baseline.py`
- Open item: which columns are the stable identity and which snapshot file is the release
  snapshot must be confirmed by the owner with the real export.

## Integration hardening — 20 October 2026
The tool now preserves multiline CSV field contents and distinguishes null, empty string, missing fields, numeric values and text values. Empty/duplicate key or comparison-column lists, missing columns and blank identities are rejected. Default comparison uses all non-key columns across both inputs. No line-ending or data-type normalisation is silently applied; compare equivalent export formats. Both input-file hashes are recorded.

`--content` and non-2179 `--expected-count` are diagnostic modes, explicitly labelled in output. A diagnostic PASS is not the protected-curriculum gate. Even a full comparison PASS proves equality only: the owner must establish that the baseline is the certified full-content export. `certification_claimed` is always false. Tests are synthetic; the actual baseline is still missing.
