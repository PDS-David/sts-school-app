#!/usr/bin/env bash
# Tester merge-gate for an agent branch. Read-only for master and the branch (uses a throwaway worktree).
#   docs/ss1/work/tester/branch-check.sh <branch> [--skip-tsc]
# <branch> is an origin branch (for example agent/chemistry); a local branch is used if no origin branch exists.
# Reports: ahead/behind master, whether a merge would conflict (and in which files), files changed outside the
# branch's subject, and which test/schema violations are NEW on the branch compared with master.
# Exit: 0 no new violations and no conflicts; 1 new violations or conflicts; 2 usage/environment error.
set -uo pipefail
b="${1:-}"; [ -n "$b" ] || { sed -n 2,9p "$0"; exit 2; }; skip_tsc=0; [ "${2:-}" = "--skip-tsc" ] && skip_tsc=1
cd "$(git rev-parse --show-toplevel)" || exit 2; ROOT=$(pwd)
git fetch -q origin 2>/dev/null
if git rev-parse -q --verify "refs/remotes/origin/$b" >/dev/null; then ref="origin/$b"; elif git rev-parse -q --verify "refs/heads/$b" >/dev/null; then ref="$b"; else echo "no such branch: $b"; exit 2; fi
[ -d "$ROOT/node_modules" ] || { echo "run 'npm ci --ignore-scripts' first"; exit 2; }
slug="${b#agent/}"; slug="${slug%%/*}"
tmp=$(mktemp -d /tmp/ss1-bc.XXXXXX); trap 'git worktree remove --force "$tmp/br" >/dev/null 2>&1; git worktree remove --force "$tmp/ma" >/dev/null 2>&1; rm -rf "$tmp"' EXIT
git worktree add -q --detach "$tmp/br" "$ref" && git worktree add -q --detach "$tmp/ma" origin/master || exit 2
for w in br ma; do ln -s "$ROOT/node_modules" "$tmp/$w/node_modules"; [ -d "$ROOT/backend/node_modules" ] && ln -s "$ROOT/backend/node_modules" "$tmp/$w/backend/node_modules"; done
rc=0
echo "## Branch check: $b @ $(git rev-parse --short "$ref") vs origin/master @ $(git rev-parse --short origin/master)"
read -r behind ahead < <(git rev-list --left-right --count origin/master..."$ref")
echo "- ahead of master by $ahead commit(s), behind by $behind"
[ "$behind" -gt 0 ] && echo "- NOTE: branch is behind master; rebase on origin/master before merging (the checks below are on the branch as it stands)"
echo "- merge simulation:"
if out=$(git merge-tree --write-tree --name-only origin/master "$ref" 2>&1); then echo "  clean merge"; else
  echo "  CONFLICTS:"; echo "$out" | sed -n '2,40p' | sed 's/^/    /'; rc=1
fi
echo "- files changed on the branch (since merge-base), outside its subject '${slug}':"
base=$(git merge-base origin/master "$ref")
out=$(git diff --name-only "$base" "$ref" | grep -v -E "^(backend/src/db/ss1/subjects/${slug}\.json|docs/ss1/work/microtasks/${slug}/)" || true)
[ -n "$out" ] && { echo "$out" | sed 's/^/    /'; echo "  (review: items normally write only the subject package, its queue and its item notes)"; } || echo "    none"
run_inv() { (cd "$1" && timeout 200 node --import tsx --test tests/ss1/_invariants.test.mts 2>&1 | grep -E '^\s+[a-z0-9-]+: ' | sed 's/^ *//' | grep -v -E '^(location|actual|expected|code|stack|name|operator|generatedMessage|failureType|duration_ms|type|error|exitCode|signal): |violation\(s\)' | sort -u); }
run_schema() { (cd "$1" && timeout 120 node --import tsx "$ROOT/docs/ss1/work/tester/schema-check.mts" "$1" 2>&1 | grep -E '^\s+[a-z_.0-9]+ \[id=' | sed 's/^ *//' | sort -u); }
run_inv "$tmp/ma" > "$tmp/inv.ma"; run_inv "$tmp/br" > "$tmp/inv.br"
new=$(comm -13 "$tmp/inv.ma" "$tmp/inv.br"); fixed=$(comm -23 "$tmp/inv.ma" "$tmp/inv.br")
echo "- invariant violations: master $(wc -l < "$tmp/inv.ma"), branch $(wc -l < "$tmp/inv.br")"
if [ -n "$new" ]; then echo "  NEW on the branch:"; echo "$new" | head -40 | sed 's/^/    /'; rc=1; else echo "  none new"; fi
[ -n "$fixed" ] && echo "  fixed by the branch: $(echo "$fixed" | wc -l)"
if [ $skip_tsc -eq 0 ]; then
  if (cd "$tmp/br/backend" && timeout 250 npx tsc --noEmit >"$tmp/tsc.log" 2>&1); then echo "- backend typecheck: pass"; else echo "- backend typecheck: FAIL"; head -5 "$tmp/tsc.log" | sed 's/^/    /'; rc=1; fi
fi
echo "- verdict: $([ $rc -eq 0 ] && echo 'NO NEW DEFECTS (advisory: safe to merge from the tester side)' || echo 'DEFECTS OR CONFLICTS FOUND (see above)')"
exit $rc
