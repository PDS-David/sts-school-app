#!/usr/bin/env bash
# SS1 agent coordination helper. See docs/ss1/work/AGENT_PROTOCOL.md.
#   claim.sh next                                  list unlocked subjects with a not-yet-executed, runnable item
#   claim.sh acquire <slug> <item-id> <agent-id>   take the subject lock for ONE item (exit 0 = yours)
#   claim.sh heartbeat <slug> <agent-id>           refresh claimed_at for a long item
#   claim.sh release <slug> <agent-id>             free the subject after your item is pushed
#   claim.sh status                                show all current claims (with age; static assignments marked)
#   claim.sh assign <slug> <agent-id> [note]       give a subject to ONE agent permanently (static claim, never stale)
#   claim.sh unassign <slug> <agent-id>            end a static assignment (name the assignee)
# A static claim lets an agent without this script work on its subject with no per-item claiming.
# Exit codes: 0 ok, 3 busy/lost race, 4 item not runnable on master, 5 local tree not clean, 6 stale (use --takeover)
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
DIR=docs/ss1/work/claims
Q=docs/ss1/work/microtasks
STALE_MIN="${STALE_MIN:-120}"
BR="${SS1_BRANCH:-master}"
now() { date -u +%Y-%m-%dT%H:%M:%SZ; }
age_min() { python3 -c "import sys,datetime as d;t=d.datetime.strptime(sys.argv[1],'%Y-%m-%dT%H:%M:%SZ');print(int((d.datetime.now(d.timezone.utc).replace(tzinfo=None)-t).total_seconds()//60))" "$1"; }
remote_file() { git show "origin/$BR:$1" 2>/dev/null; }
claim_field() { python3 -c "import sys,json;print(json.load(sys.stdin).get(sys.argv[1],''))" "$1"; }
is_static() { [ "$(claim_field static < "$1")" = "True" ]; }
clean_tree() {
  git diff --quiet && git diff --cached --quiet && [ -z "$(git rev-list "origin/$BR"..HEAD 2>/dev/null)" ]
}
sync() { git fetch -q origin && git pull -q --rebase origin "$BR"; }
push_retry() {  # commit already made locally
  for i in 1 2 3 4 5 6; do
    git push -q origin "HEAD:$BR" 2>/dev/null && return 0
    git fetch -q origin; git pull -q --rebase origin "$BR" 2>/dev/null || { git rebase --abort 2>/dev/null; return 1; }
  done; return 1
}
cmd="${1:-}"; shift || true
case "$cmd" in
status)
  git fetch -q origin
  for f in $(git ls-tree --name-only "origin/$BR" "$DIR/" 2>/dev/null | grep '\.json$'); do
    j=$(remote_file "$f"); a=$(echo "$j" | claim_field claimed_at)
    stat=""; [ "$(echo "$j" | claim_field static)" = "True" ] && stat=" STATIC-ASSIGNMENT"
    echo "$(basename "$f" .json): item=$(echo "$j" | claim_field item) agent=$(echo "$j" | claim_field agent) age=$(age_min "$a")min$stat"
  done ;;
next)
  git fetch -q origin
  locked=$(git ls-tree --name-only "origin/$BR" "$DIR/" 2>/dev/null | xargs -n1 basename 2>/dev/null | sed 's/\.json$//' | tr '\n' ' ')
  for qf in $(git ls-tree -r --name-only "origin/$BR" "$Q/" | grep '/QUEUE.json$'); do
    slug=$(basename "$(dirname "$qf")")
    remote_file "$qf" | LOCKED="$locked" SLUG="$slug" python3 -c '
import sys,json,os
q=json.load(sys.stdin); by={t["id"]:t for t in q["items"]}; slug=os.environ["SLUG"]
done="IMPLEMENTED_TESTING_DEFERRED"
pri=["SOURCE_WEEK_INVENTORY","SOURCE_PREAMBLE_INDEXING","SOURCE_WEEK_INDEXING","SOURCE_SECTION_INDEXING","SOURCE_MARKER_DISPOSITION","SOURCE_PRESERVATION","VISUAL_DISPOSITION","FACTUAL_DEPENDENCY","SCOPE_DECOMPOSITION","CORRECTION_BINDING","LESSON","TEST"]
el=[t for t in q["items"] if t["status"]=="PENDING" and all(by[d]["status"]==done for d in t["depends_on"] if d in by)]
el.sort(key=lambda t:(pri.index(t["kind"]) if t["kind"] in pri else 99))
lock="locked" if slug in os.environ["LOCKED"].split() else "free"
if el:
    i=el[0]; print("%4d runnable | %-6s | %s | first: %s (%s)" % (len(el),lock,slug,i["id"],i["kind"]))
' 
  done | sort -t'|' -k2,2 -k1,1nr ;;
acquire)
  slug="${1:?slug}"; item="${2:?item}"; agent="${3:?agent}"; takeover=0; [ "${4:-}" = "--takeover" ] && takeover=1
  git fetch -q origin
  clean_tree || { echo "NOT CLEAN: commit or discard local changes and push or drop local commits first"; exit 5; }
  git pull -q --rebase origin "$BR"
  f="$DIR/$slug.json"
  static_own=0
  if [ -f "$f" ] && is_static "$f"; then
    if [ "$(claim_field agent < "$f")" = "$agent" ]; then static_own=1
    else echo "ASSIGNED: $slug is permanently assigned to $(claim_field agent < "$f"); pick another subject"; exit 3; fi
  elif [ -f "$f" ]; then
    a=$(claim_field claimed_at < "$f"); m=$(age_min "$a")
    if [ "$m" -lt "$STALE_MIN" ] || [ $takeover -eq 0 ]; then
      [ "$m" -ge "$STALE_MIN" ] && { echo "STALE ($m min) claim by $(claim_field agent < "$f") on $(claim_field item < "$f"). Check git log for recent work on $slug; re-run with --takeover only if there is none."; exit 6; }
      echo "BUSY: $slug held by $(claim_field agent < "$f") for $(claim_field item < "$f") ($m min)"; exit 3
    fi
  fi
  qf="$Q/$slug/QUEUE.json"
  if [ -f "$qf" ]; then
    python3 - "$qf" "$item" <<'P' || { echo "NOT RUNNABLE: $item is not PENDING with all dependencies done on current $BR"; exit 4; }
import sys,json
q=json.load(open(sys.argv[1])); by={t["id"]:t for t in q["items"]}; t=by.get(sys.argv[2])
sys.exit(0 if t and t["status"]=="PENDING" and all(by[d]["status"]=="IMPLEMENTED_TESTING_DEFERRED" for d in t["depends_on"] if d in by) else 1)
P
  fi
  if [ "$static_own" = 1 ]; then echo "ASSIGNED to you: $slug / $item is runnable (static assignment, nothing to commit)"; exit 0; fi
  mkdir -p "$DIR"
  printf '{\n  "subject": "%s",\n  "item": "%s",\n  "agent": "%s",\n  "claimed_at": "%s",\n  "base_sha": "%s"\n}\n' "$slug" "$item" "$agent" "$(now)" "$(git rev-parse --short HEAD)" > "$f"
  git add "$f"; git commit -q -m "claim($slug): $item by $agent"
  if push_retry; then echo "CLAIMED $slug / $item"; exit 0; fi
  git fetch -q origin
  if remote_file "$f" >/dev/null && [ "$(remote_file "$f" | claim_field agent)" != "$agent" ]; then
    git rebase --abort 2>/dev/null; git reset -q --hard "origin/$BR"; echo "LOST RACE: $slug claimed by $(remote_file "$f" | claim_field agent)"; exit 3
  fi
  echo "PUSH FAILED (not a lost race); fetch and retry"; exit 1 ;;
heartbeat)
  slug="${1:?}"; agent="${2:?}"; f="$DIR/$slug.json"
  git fetch -q origin; clean_tree || exit 5; git pull -q --rebase origin "$BR"
  [ -f "$f" ] && [ "$(claim_field agent < "$f")" = "$agent" ] || { echo "not your claim"; exit 3; }
  if is_static "$f"; then echo "static assignment: no heartbeat needed"; exit 0; fi
  python3 - "$f" "$(now)" <<'P'
import sys,json;j=json.load(open(sys.argv[1]));j["claimed_at"]=sys.argv[2];open(sys.argv[1],"w").write(json.dumps(j,indent=2)+"\n")
P
  git add "$f"; git commit -q -m "claim($slug): heartbeat by $agent"; push_retry && echo "HEARTBEAT ok" ;;
release)
  slug="${1:?}"; agent="${2:?}"; f="$DIR/$slug.json"
  git fetch -q origin; clean_tree || exit 5; git pull -q --rebase origin "$BR"
  [ -f "$f" ] || { echo "no claim on $slug"; exit 0; }
  [ "$(claim_field agent < "$f")" = "$agent" ] || { echo "not your claim"; exit 3; }
  if is_static "$f"; then echo "KEPT: $slug is a static assignment; it is ended with 'unassign', not 'release'"; exit 0; fi
  git rm -q "$f"; git commit -q -m "release($slug) by $agent"; push_retry && echo "RELEASED $slug" ;;
assign)
  slug="${1:?slug}"; agent="${2:?agent}"; note="${3:-}"; f="$DIR/$slug.json"
  git fetch -q origin; clean_tree || { echo "NOT CLEAN"; exit 5; }; git pull -q --rebase origin "$BR"
  if [ -f "$f" ]; then echo "EXISTS: $slug already claimed by $(claim_field agent < "$f")"; exit 3; fi
  mkdir -p "$DIR"
  python3 - "$f" "$slug" "$agent" "$(now)" "$(git rev-parse --short HEAD)" "$note" <<'PYEOF'
import sys, json
f, slug, agent, t, sha, note = sys.argv[1:7]
j = {"subject": slug, "item": "*", "agent": agent, "claimed_at": t, "base_sha": sha, "static": True}
if note: j["note"] = note
open(f, "w").write(json.dumps(j, indent=2) + "\n")
PYEOF
  git add "$f"; git commit -q -m "assign($slug): $agent (static)"
  if push_retry; then echo "ASSIGNED $slug to $agent (static)"; exit 0; fi
  git rebase --abort 2>/dev/null; git fetch -q origin; git reset -q --hard "origin/$BR"; echo "FAILED or LOST RACE assigning $slug"; exit 3 ;;
unassign)
  slug="${1:?slug}"; agent="${2:?agent}"; f="$DIR/$slug.json"
  git fetch -q origin; clean_tree || exit 5; git pull -q --rebase origin "$BR"
  [ -f "$f" ] || { echo "no claim on $slug"; exit 0; }
  is_static "$f" || { echo "not a static assignment; use release"; exit 3; }
  [ "$(claim_field agent < "$f")" = "$agent" ] || { echo "assigned to $(claim_field agent < "$f"), not $agent (name the assignee to end it)"; exit 3; }
  git rm -q "$f"; git commit -q -m "unassign($slug): $agent"; push_retry && echo "UNASSIGNED $slug" ;;
*) sed -n 2,14p "$0"; exit 2 ;;
esac
