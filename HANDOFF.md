# HANDOFF — 2026-09 (curriculum cleanup follow-up + broader open items)

Read `AGENT_CONTINUATION.md` first (mandatory house conventions), then
this file. `git fetch && git log --oneline -5 origin/master` before doing
anything — expect `HEAD` at `4564c87` or later; if it's moved, someone
else has pushed since this was written.

## Immediate next step — in progress, not finished

`backend/src/db/fixStaleAssignedClasses.ts` (commit `4564c87`) was just
written and pushed but **not yet run against production**. Context:

1. `cleanupStaleClasses.ts --yes` already ran successfully — deleted 11
   stale pre-rename `classes` rows (`Grade 1`-`6`, `JSS2`, `JSS3`, `SS1`-
   `SS3`). One row (`classes.id=11`, `'JSS1'`) was correctly left alone
   because a real teacher's `users.assigned_class` still equals `'JSS1'`.
2. `topicsDuplicatePairs.ts --yes` already ran successfully — deleted 104
   of 120 flagged thin-duplicate topic rows (16 were presumably skipped
   for having real `topic_completions`/a generated assessment — the exact
   skip list wasn't captured in this session's transcript, worth
   re-running the dry run to see the current skip list if that detail
   matters).
3. `fixStaleAssignedClasses.ts` fixes the one remaining blocker from #1 —
   run its dry run, confirm it only finds the one expected teacher (or
   whatever it actually finds), then `--yes` it.
4. **After #3**, re-run `cleanupStaleClasses.ts` (no `--yes` — just to
   confirm) — `classes.id=11` should now show `[safe to delete]`. Then run
   it with `--yes` one more time to remove that last row and close out
   Finding 1 completely.

All four scripts live in `backend/src/db/`, all follow the same
dry-run-then---yes convention, all connect via `backend/.env`'s
`DATABASE_URL` (confirm it's still pointed at production before running
anything).

## Two side-findings from the topicsDuplicatePairs.ts run — not yet acted on

Found while manually spot-checking the 120-pair dry-run output before
approving `--yes`; neither blocked that run, both still need a look:

1. **`[primary] PRY 4 / Basic Science / 1st Term` has genuine full-content
   duplicates, not just thin fragments** — e.g. `"CHANGES IN PLANT"`
   existed as *two* thick rows (`id=3613` and `id=3674`, both exactly 2163
   chars) before the thin-duplicate cleanup ran, and the same doubled
   pattern repeated for "CHANGES IN ANIMALS," "CHANGES IN NON – LIVING
   THINGS," "OUR WEATHER," and "WEATHER SYMBOL AND RECORD CHART" in that
   same bucket — looks like that whole source file got ingested twice.
   `topicsDuplicatePairs.ts`'s heuristic only ever compares thin-vs-thick
   within a bucket, so it can't and didn't catch thick-vs-thick
   duplicates — this needs a separate detection pass (e.g. flag any two
   topics in the same bucket with near-identical `LENGTH(source_reference)`
   and near-identical normalized titles) before deciding whether/how to
   deduplicate it.
2. **`topics.id=1422`'s `title` field is corrupted** — contains a full
   paragraph of body text (`".        gears ... A gear or cogwheel is a
   rotating machine part having cut teeth, or cogs, whi[...]"`) instead of
   just a title. This is a data-quality bug on one specific row, unrelated
   to duplication — worth a targeted look at `ingestTopics.ts`'s title
   extraction for whatever source file produced this row.

Neither is urgent (the app functions fine either way — these're just
messy data), but both are real and worth fixing when there's a slot for
curriculum-data cleanup work again.

## Broader open items (from the project owner's own priority list, in the
order raised — check with them before assuming this order still holds)

1. ~~Persistent sidebar navigation~~ — **done**, commit `7a32831`. See
   `CHANGELOG.md`'s 2026-09-06 entry for the shape (`Sidebar`/
   `SidebarLayout` in `mobile/src/components/Sidebar.tsx`, wired into all
   five `*Tabs.tsx` files). Not yet visually confirmed in an actual wide
   browser window by the project owner — worth a quick look next time the
   app is open on a desktop screen.
2. **Live production testing** — `TEST_PLAN_WEB_MOBILE.md` (repo root) has
   the full role-by-role checklist; large parts of it have effectively
   already happened ad-hoc this session (login, finance split, Add
   Student, print/export, term-pins) but nothing has been checked off in
   that file's own progress log — worth reconciling what's actually been
   verified against that checklist rather than re-testing from zero.
3. **Announcements / teacher "pending marking" count / several "coming
   soon" screens** — still blocked on a product decision about what they
   should actually look like; not started, don't guess at a design.

## Working conventions reminder (see AGENT_CONTINUATION.md for full detail)

- `git fetch && git log` before starting every session — this repo has
  multiple sessions/agents pushing in parallel.
- Dry-run-then---yes for anything that writes to production data; commit
  each discrete piece separately; `tsc --noEmit` clean (both `backend/`
  and `mobile/`) before every commit, plus a real
  `npx expo export --platform web` for any mobile change.
- No live DB/device access in most agent sandboxes — the project owner
  runs scripts and reports output back, same pattern as this whole
  session.
