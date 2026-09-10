# HANDOFF — local backend now correctly targeted, one migration away from resuming Task B test (2026-09)

Read AGENT_CONTINUATION.md first. git fetch && git log --oneline -5
origin/master before starting — confirm you're at or past 7fc6e52.

Da is non-technical on infra, communicates via pasted terminal output and
screenshots — give ONE exact step at a time, wait for output, confirm
before advancing. PowerShell — join multi-step commands with `;` not
`&&`. Verify state before acting rather than assuming.

═══════════════════════════════════════════════════════════════
JUST FIXED AND CONFIRMED WORKING — do not re-investigate this
═══════════════════════════════════════════════════════════════
Da's mobile app had been silently calling PRODUCTION
(sts-school-backend.onrender.com) this entire session, regardless of
backend/.env's local DATABASE_URL or npm run dev running locally —
app.json's expo.extra.apiUrl is the production URL and is a tracked,
shared file, so no local override survived across pulls. Root-caused via
DevTools showing the actual request URLs, not guessed.

Fixed properly, not as a one-off workaround: mobile/src/api/client.ts
now reads EXPO_PUBLIC_API_URL first (from an untracked mobile/.env,
covered by the root .gitignore), before app.json's apiUrl. Da has
already created mobile/.env with EXPO_PUBLIC_API_URL=http://localhost:4000
and CONFIRMED it's taking effect — his terminal log shows "[api/client]
Using EXPO_PUBLIC_API_URL override..." and DevTools shows requests
correctly going to localhost:4000 now. This part is done. Don't ask him
to redo it or re-diagnose the apiUrl issue.

═══════════════════════════════════════════════════════════════
IMMEDIATE NEXT STEP — one command away, not yet run
═══════════════════════════════════════════════════════════════
Now that requests correctly reach his local backend, a real (different,
much simpler) error surfaced: `relation "class_access_codes" does not
exist` — a genuine Postgres error, confirmed for real by grepping
backend/schema.sql (class_access_codes IS defined there, line ~678).
His local database was just never migrated to pick up this table (added
by whichever session built the Class Codes/self-claim feature).

Da was given this exact fix, not yet confirmed run:
  cd C:\dev\sts-school-app-live\backend
  npm run db:migrate
(stop the running backend dev server first, Ctrl+C, or use a separate
terminal — then restart npm run dev afterward)

Give Da this first if the conversation resumes before he's done it. Once
confirmed (migration completes without error, backend restarted), have
him retry Class Codes → PRY 1 → Generate Code and paste the result.

═══════════════════════════════════════════════════════════════
THEN — resume the Task B live-test sequence (was in progress before both
detours above, still fully valid)
═══════════════════════════════════════════════════════════════
Class picked for testing: PRY 1, primary school. Known claimable
students from checkStudentCount.ts's sample (backend/src/db/
checkStudentCount.ts, read-only, safe to re-run anytime for a fresh
sample): AbdulAfeez Mahbub (Adm# STS 001), Abiala Victor (STS 002),
Abidoye Abdulmateen (STS 003), Odanye OgoOluwa (STS 004), Ogunbiyi
Michaella (STS 005) — all PRY 1, primary.

Once a class code generates successfully for PRY 1:
1. Open an Incognito window (Ctrl+Shift+N), localhost:8081 — this
   correctly picks up the same mobile/.env override (it's a dev-server-
   level env var baked into the bundle at build time, not a per-window
   browser setting, so Incognito doesn't need its own setup).
2. From Login screen, find "New here?" self-claim link → school → PRY 1
   → pick AbdulAfeez Mahbub.
3. NEGATIVE TEST — correct class code, WRONG admission number (made up,
   e.g. STS 999). Confirm the generic "not found, or already has an
   account" message — must NOT reveal that only the admission number was
   wrong.
4. NEGATIVE TEST — correct admission number (STS 001), WRONG class code.
   Confirm the existing, different "incorrect class code" message.
5. POSITIVE TEST — correct code AND STS 001. Confirm account created, a
   generated username shown, and login actually works with it.
6. REPEAT TEST — attempt to claim AbdulAfeez Mahbub (STS 001) again.
   Confirm the SAME generic 404 as test 3, not a different "already
   claimed" message.
7. IMPERSONATION TEST (the actual regression test this whole pass
   exists to verify) — pick Abiala Victor (a DIFFERENT, still-unclaimed
   student) from the same PRY 1 roster, valid class code in hand, but
   do NOT enter STS 002 (their real admission number) — try a guess
   instead. Confirm this fails. If it succeeds without STS 002
   specifically, the fix has a real regression and needs immediate
   attention before anything else in this session.

Log each result into TEST_PLAN_WEB_MOBILE.md's own progress-log section
as you go, per its documented convention.

═══════════════════════════════════════════════════════════════
STILL QUEUED, NOT YET ADDRESSED — Da asked these before all of the above
detours started; don't lose them
═══════════════════════════════════════════════════════════════
1. A clean, direct answer to "have the other tasks been completed" —
   Task A: done (108 students imported, confirmed locally). Task B: code
   built and hardened (two security passes — admission-number
   verification, per earlier commits), but the ACTUAL live end-to-end
   test above is what's been blocking a real "yes, confirmed working"
   answer this whole time. Once the test sequence above completes
   successfully, this is answerable cleanly.
2. "Tell me the missing operational gaps in this app" — not answered at
   all yet. Once the live test above is done, compile from: TODO.md's
   own "known gaps, do not build without asking" list (announcements,
   teacher pending-marking count, several "coming soon" screens), the
   Render migration decision (planned, not started), Task C (teacher
   self-claim — explicitly not scoped/confirmed with Da, don't build it
   without asking), and TEST_PLAN_WEB_MOBILE.md's own progress log for
   which sections are still unverified (this whole session has been
   almost entirely Admin/Finance Admin testing — Student/Teacher/Parent
   role testing has barely started).
