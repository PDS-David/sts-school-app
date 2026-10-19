#!/usr/bin/env bash
# Deterministically rebuild every Batch 2 integration record from sources.
# Usage: scripts/jss3/rebuild_batch2_records.sh <capture-dir-with-supplemented-rows.json> <JSS3_NEXT_STAGE_INPUTS dir> [base-ref=master]
# Starts each generated file from the base ref so the run is repeatable (never layers on a prior run).
# Deliberately does NOT run reconcile_source_lines.py: on pristine master it already changes the
# 328-candidate universe (committed LATEST_SOURCE_LINE_DISPOSITION.csv predates YORUBA_OBJECTIVE_MAP).
set -euo pipefail
CAP="$1"; INP="$2"; BASE="${3:-master}"
cd "$(git rev-parse --show-toplevel)"
R=docs/jss3/replacements
for f in SEMANTIC_DECISIONS IMPLEMENTED_LESSONS CURRENT_COVERAGE WIDER_WORKSTREAMS; do
  git show "$BASE:$R/$f.csv" > "$R/$f.csv"
done
python3 scripts/jss3/merge_batch2_decisions.py
python3 scripts/jss3/build_implemented_lessons.py backend/src/db/data/jss3Supplements.json "$CAP/supplemented-rows.json" $R/IMPLEMENTED_LESSONS.csv <(git show "$BASE:$R/IMPLEMENTED_LESSONS.csv")
python3 scripts/jss3/build_coverage_records.py
python3 scripts/jss3/build_teacher_schedule.py
python3 scripts/jss3/build_semantic_closure.py "$CAP/original-rows.json" "$INP" docs/jss3/SEMANTIC_CLOSURE.csv "$CAP/supplemented-rows.json"
python3 scripts/jss3/xref_semantic_to_supplements.py
