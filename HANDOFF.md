# HANDOFF — diagnose stale-Students-screen, then resume Task B live test (2026-09)

Read AGENT_CONTINUATION.md first. git fetch && git log --oneline -5
origin/master before starting — confirm you're at or past c94be91.

Da is non-technical on infra, communicates via pasted terminal output and
screenshots — give ONE exact step at a time, wait for output, confirm
before advancing. PowerShell — join multi-step commands with `;` not
`&&`. Verify state before acting rather than assuming.

Da's setup: C:\dev\sts-school-app-live (the only real git clone).
Backend .env DATABASE_URL is confirmed LOCAL right now:
postgres://postgres:NewPass123@localhost:5432/stsschool — Task A
(importStudentRoster.ts) has only been run against this local DB so far,
NOT production. Don't assume otherwise.

═══════════════════════════════════════════════════════════════
IMMEDIATE NEXT STEP — run in progress, not finished
═══════════════════════════════════════════════════════════════
Sequence so far:
1. Da ran importStudentRoster.ts --yes locally. Output: "Inserted 0 new
   student row(s). 108 already existed... Committed." — meaning this had
   already been run successfully once before (by an earlier session,
   per commit history), not that anything failed.
2. Da then opened the Students screen (admin, localhost:8081) and it
   showed only ONE student ("Test Student One" — a manually-created test
   record, unrelated to the import), not the 108 imported ones.
3. Checked backend/src/routes/students.ts's GET / query — no bug found
   there (no user_id filter, straightforward school_code/class_name
   scoping). Leading theory, NOT YET CONFIRMED: the mobile app's own
   offline GET-cache (localStorage-backed on web) is serving a stale
   cached response from before the import ran — a browser hard-refresh
   (Ctrl+Shift+R) clears the JS bundle but not that cached data.
4. Da doesn't have psql installed, so a new read-only diagnostic
   (backend/src/db/checkStudentCount.ts, commit c94be91) was written and
   pushed instead — bypasses the mobile app and its cache entirely,
   queries the DB directly via the same pool.ts every other script here
   uses. NOT YET RUN by Da — this is the actual next step.

Give Da this now:
  cd C:\dev\sts-school-app-live\backend
  npx tsx src/db/checkStudentCount.ts

Then branch on what it shows:
- If it reports 108 total students (or close to it) with a real claimable
  count and sample rows: the offline-cache theory is confirmed. Next
  step is telling Da how to clear it — the simplest reliable fix is
  opening the browser's DevTools > Application > Local Storage for
  localhost:8081 and clearing it, then hard-refreshing again (a plain
  hard-refresh alone does NOT clear localStorage). If that's inconvenient
  to walk him through, an incognito/private window also works
  immediately, no cache-clearing needed, and is probably the faster path
  to give him.
- If it reports far fewer than 108 (e.g. close to 0-1): the import
  script's "108 already existed" was misleading or wrong somehow — this
  would be a real bug needing investigation (check whether
  importStudentRoster.ts might have connected to a DIFFERENT database
  than what backend/.env currently points to when Da ran it — e.g. a
  stale process, a different .env Da wasn't aware of, or something
  changed between when "108 already existed" was first achieved by an
  earlier session and now). Don't guess further than this without more
  data — ask Da directly what the diagnostic actually printed and work
  from there.

═══════════════════════════════════════════════════════════════
THEN — resume the Task B live-test sequence (was in progress before this
detour, still fully valid, not superseded by anything above)
═══════════════════════════════════════════════════════════════
Once the Students-screen discrepancy above is actually resolved (Da can
see real imported students in the app), resume exactly where testing
paused: generating a class code as admin (More menu, mirrors the
existing Term PINs screen — check the actual current menu item name/
route, don't assume it's still called exactly "Class Codes") for a class
with at least one claimable student (use checkStudentCount.ts's sample
output to pick one), then walk Da through the self-claim flow from the
Login screen's "New here?" link:

1. NEGATIVE TEST — correct class code, WRONG admission number (made up).
   Confirm the generic "not found, or already has an account" message —
   must NOT reveal that only the admission number was wrong.
2. NEGATIVE TEST — correct admission number, WRONG class code. Confirm
   the existing, different "incorrect class code" message — unchanged,
   not the focus of this fix, just confirm it still works.
3. POSITIVE TEST — correct code AND correct admission number for the
   student picked. Confirm account created, a generated username shown,
   and the person can actually log in with it.
4. REPEAT TEST — attempt to claim the SAME student again. Confirm the
   same generic 404 as test 1, not a different "already claimed" message
   — this indistinguishability is the actual security property.
5. IMPERSONATION TEST (the core regression test for the fix this whole
   pass exists to verify) — pick a DIFFERENT unclaimed student's name
   from the same class's roster, valid class code in hand, but you do
   NOT know that other student's real admission number. Confirm you
   cannot claim them without it. If this succeeds without the real
   admission number, the fix failed and needs immediate attention before
   anything else.

Log each result into TEST_PLAN_WEB_MOBILE.md's own progress-log section
as you go, per its documented convention.

═══════════════════════════════════════════════════════════════
SEPARATE, NOT YET ANSWERED — Da asked these two questions a few turns
before the detour above; don't lose them once the live test is done
═══════════════════════════════════════════════════════════════
1. "Check that the other tasks have not yet been completed before
   running" — partially answered live (Task A run locally, confirmed;
   Task B built and hardened by two prior sessions, commits 705c39c and
   9aad4a0) but Da was never given a clean, direct answer to this as its
   own question. Worth a short, explicit summary once the live test
   above concludes: what's done, what's still open, referencing
   TODO.md's own top entries (which are somewhat stale — written before
   Task A/B landed, worth a fresh pass updating them once this test
   sequence confirms everything works).
2. "Tell me the missing operational gaps in this app" — NOT answered at
   all yet. Once the live test above is done, compile this properly
   rather than rushing it — pull together: TODO.md's own "known gaps, do
   not build without asking" list (announcements, teacher pending-
   marking count, several "coming soon" screens), the Render migration
   decision (planned, not started), Task C (teacher self-claim,
   explicitly not scoped/confirmed with Da), and anything TEST_PLAN_WEB_
   MOBILE.md's own progress log shows as still unverified (Sections
   C/D/E/F/G/H/I/J/K/M per that file's own lettered breakdown — this
   session's live testing has been almost entirely Admin/Finance Admin
   territory, Student/Teacher/Parent role testing has barely started).
