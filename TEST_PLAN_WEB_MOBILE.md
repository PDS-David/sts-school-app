# TEST_PLAN_WEB_MOBILE.md

Live end-to-end test pass for everything built/changed in this session:
Finance/Operations Admin split, widened parent messaging, offline
cache-invalidation, Add-Student + parent auto-provisioning UI, Expo web
support, and admin/parent Print+Export PDF on report screens.

**Order: web first, all the way through every role, then Android.** Don't
start Android until every web checkbox below is either checked or logged as
a defect — web is faster to iterate on and most of what we're testing
(permissions, data, new screens) is platform-agnostic; Android adds the
native-module layer (print dialog, share sheet, offline/airplane-mode,
push, secure storage) on top of a foundation web will have already proven.

**This file is the source of truth for where testing stands.** Whoever
(human or agent) is running a session: before continuing, read the
"Progress log" at the bottom first — don't assume anything above it is
untested just because it's unchecked; check the log. When you finish a
step, check its box AND append a line to the progress log with the result
(pass/fail + detail), then commit this file by itself (`git add
TEST_PLAN_WEB_MOBILE.md && git commit`) so the next session sees it. Pull
before resuming, same as any other work on this repo.

**No live DB/device access exists in an agent sandbox** (see
`AGENT_CONTINUATION.md` §5). Every step below is written to be *run by the
project owner* on their own machine — an agent's role in this pass is to
hand over the next step, read back what the owner reports, decide
pass/fail, adjust/fix code if something's broken, and re-verify via
`tsc --noEmit` before asking the owner to re-test. Don't claim something
"works" from code-reading alone once we're in this phase — that was the
pre-testing verification method; this phase is about what actually happens
when a real browser/phone hits the real backend.

---

## Phase 0 — Setup (once, before any role testing)

1. Pull latest:
   ```
   git fetch origin && git log --oneline -1 origin/master
   git pull origin master
   ```
2. Backend: install, migrate, seed, run.
   ```
   cd backend
   npm install
   npm run db:migrate      # picks up the users.role TEXT+CHECK migration (finance_admin)
   npm run db:seed         # only creates admin/teacher1 if they don't already exist — safe to re-run
   npm run dev              # tsx watch src/index.ts, http://localhost:4000
   ```
   Confirm `.env` has at minimum `DATABASE_URL`, `JWT_SECRET`,
   `JWT_REFRESH_SECRET` set (`.env.example` has the full list — mail/FCM/AI
   keys aren't required just to test the items in this plan, only
   `DATABASE_URL`+JWT secrets are load-bearing for login itself).
3. Mobile web: install, run.
   ```
   cd mobile
   npm install
   npm run web              # expo start --web
   ```
   **Critical gotcha, check this before anything else:**
   `mobile/app.json`'s `expo.extra.apiUrl` is hardcoded to the **production**
   Render backend (`https://sts-school-backend.onrender.com`), not
   localhost — `client.ts` reads this value directly. If you don't change
   it, every "local" test in this plan silently hits production instead of
   the code you just pulled, and you'll either see none of this session's
   changes or (worse) write real test data into production. Temporarily
   change it for this test pass:
   ```json
   "extra": { "apiUrl": "http://localhost:4000", ... }
   ```
   Use `http://localhost:4000` for web specifically — the `10.0.2.2:4000`
   fallback baked into `client.ts` is an Android-emulator-only alias for
   the host machine and will not resolve in a browser. **Revert this back
   to the production URL before committing anything else** — don't let a
   local-testing change to `app.json` accidentally ship. For Android
   testing in Phase 2, see the note under 2.0 — the correct value differs
   again there (emulator vs. physical device).
4. Confirm the backend is actually reachable from the browser before
   logging in: open `http://localhost:4000/auth/login` directly (or any
   route) — a JSON error response (even a 404/405) means the server's up;
   a connection-refused error means step 2's `npm run dev` isn't actually
   running or is on a different port than `app.json` now points to.
5. Seeded accounts after step 2: `admin` / `Admin@1234` and `teacher1` /
   `Teacher@1234`, both `must_change_pw=true` (first login forces a
   password change — expected, not a bug).
6. **No parent, student, or finance_admin accounts exist yet** — creating
   them is itself part of Phase 1 below (tests the new Add-Student +
   auto-provisioning flow, and the new role in AdminUsersScreen), not a
   setup step to skip past.

---

## Phase 1 — Web, role by role

### 1.1 Admin (Operations)
- [ ] Log in as `admin` / `Admin@1234`. Forced password-change screen
      appears — set a new password, confirm it logs you into the Dashboard
      after.
- [ ] Dashboard tiles show: Students, Users, Class Summary, Export Excel,
      Enter Scores, Terms, Subjects, Messages, Audit Log, Class Locks,
      Deleted Students. **Confirm no Finance tile anywhere.**
- [ ] AdminUsers screen → Add User → Role picker includes `finance_admin`
      as an option (alongside teacher/parent/student/admin). Create one
      (e.g. username `finance1`), note the generated temp password.
- [ ] Students screen → FAB ("Enroll Student") → AddStudentScreen. Fill in
      a student with class + parent name/phone (any 11-digit Nigerian-style
      number, e.g. `08012345678`), leave email blank, submit.
  - [ ] Expect: success alert showing a **newly created** parent account
        with a username + temporary password (since no existing parent has
        that phone yet). Note both.
- [ ] Enroll a **second** student, same parent phone number as above,
      different name/class.
  - [ ] Expect: success alert says the student was **linked to the
        existing parent account** (sibling dedup) — no new temp password
        shown this time.
- [ ] Open the first student's detail → View Results (MyResultsScreen).
  - [ ] **Print** and **Export PDF** buttons are visible (admin role).
  - [ ] Click Print → new browser tab opens with the report, browser's
        print dialog appears automatically (or within ~1s via the fallback
        timer).
  - [ ] Click Export PDF → same tab/print-dialog behavior expected on web
        (Export routes to Print on web — see `reportPdf.ts` comments).
  - [ ] View Session Report → repeat both buttons there too.
- [ ] ExportExcelScreen → pick a school → Export.
  - [ ] Expect: a real `.xlsx` file downloads via the browser (not a
        "share sheet" — that's native-only). Open it, confirm it's a valid,
        non-empty spreadsheet.
- [ ] Messages → confirm admin can open a chat with any teacher/parent/
      student without restriction (unchanged behavior, just confirming
      nothing regressed).

### 1.2 Finance Admin
- [ ] Log out, log in as `finance1` with the temp password from 1.1.
      Forced password-change screen appears (temp-password accounts always
      force this) — set a new password.
- [ ] Nav shows **only**: Dashboard, Finance, Messages, Change Password.
      No Users/Terms/Subjects/Students/Audit/Export-Excel anywhere.
- [ ] School switcher bar appears (finance_admin has no fixed school).
      Switch between the two schools and confirm the Finance screen's fee
      items/invoices list actually changes (not just the switcher UI).
- [ ] Finance screen → Add Fee Item (name + amount, optionally a class) →
      confirm it appears in the Fee Schedule list.
- [ ] Finance screen → New Invoice → pick the student created in 1.1, the
      seeded term, and one or more fee items → confirm the running total
      updates live as you check items → Create Invoice.
  - [ ] Expect: invoice appears in the Invoices list with the correct
        total and `unpaid` status.
- [ ] Mark that invoice **Paid** → confirm status badge updates and the
      "Mark as Paid" button disappears once paid.
- [ ] **Wall-off check (needs a terminal, not just the browser):** with
      `admin`'s access/refresh token (grab it from the browser's
      Application → Local Storage / cookies after logging in as admin, or
      just log in as admin via curl), confirm Operations Admin is genuinely
      blocked from finance, not just hidden in the UI:
      ```
      curl -H "Authorization: Bearer <admin's token>" http://localhost:4000/finance/invoices
      ```
      Expect: HTTP 403, `{"error":"Finance is managed separately by
      Finance Admin, not Operations Admin."}` — if this returns invoice
      data instead, the wall-off has a real bug, not just a UI omission.

### 1.3 Teacher
- [ ] Log in as `teacher1` / `Teacher@1234` (or its post-change password if
      already changed in a prior session). Force-password-change if still
      pending.
- [ ] Confirm **no Assessments tab exists anywhere** in teacher nav.
- [ ] Classes → open a student in `JSS 1` (teacher1's assigned class) →
      enter/edit CA1/CA2/Exam scores for a subject → save → confirm it
      persists (reload the screen).
- [ ] Open that same student's Results screen as teacher.
  - [ ] **Confirm Print and Export PDF buttons do NOT appear** — this is
        the specific restriction requested; if a teacher sees these
        buttons, that's a bug to fix before moving on.
- [ ] Subjects screen → Add a subject → confirm it saves. Confirm there is
      **no delete option** next to any subject (admin-only).
- [ ] Messages → confirm teacher can message students/parents/admin in
      scope (any prior regression would show up as an empty/broken contact
      list here).
- [ ] Attempt to view/access anything finance-related — there should be no
      entry point in the UI at all for teacher (skip the curl check here;
      already covered structurally by finance_admin-only route gating).

### 1.4 Parent
- [ ] Log in as the parent account created in 1.1 (its final password,
      after the forced first-login change).
- [ ] Progress tab → shows the first-enrolled ward's report card.
      **Print and Export PDF buttons ARE visible** (parent role) — test
      both, same as 1.1.
- [ ] If a child-switcher exists (siblings), switch to the second enrolled
      student and confirm the report updates to that child specifically —
      never a blend of both.
- [ ] Finance tab → shows the invoice created in 1.2 for this ward, correct
      total/status, **no** "New Invoice" or "Mark as Paid" controls
      anywhere (view-only for parent).
- [ ] Messages → start a chat with a teacher who does **NOT** teach this
      parent's ward's class/subject (e.g. a teacher assigned to a
      different class entirely, if one exists — create one via admin if
      not). **This is the key regression test for the messaging widening**
      — before this session's fix, this specific case was blocked; it
      should now succeed.
- [ ] Confirm parent has **no Assessments tab** (parent was never meant to
      take assessments).

### 1.5 Student
- [ ] Log in as the student's own account, if one exists/was created for
      this student (students may not always have logins — if none exists
      for the test student, either create one via AdminUsers or skip this
      section and note it as skipped in the progress log, not failed).
- [ ] Open own Results screen. **Confirm Print/Export buttons do NOT
      appear** (student excluded, same restriction as teacher).
- [ ] Confirm Topics/Materials/Assessments screens still work as before —
      this session didn't touch student-facing academic flows, this is
      just a smoke test that nothing broke as a side effect.

### 1.6 Cross-cutting web checks
- [ ] Open browser dev tools console during login on any account — confirm
      no thrown error from push-notification registration (`pushRegistration.ts`
      should silently no-op on web, not throw).
- [ ] Reload the app (F5) while logged in on any role — confirm the
      session persists (token storage works on web) rather than bouncing
      back to the login screen.
- [ ] Go offline (dev tools → Network → Offline) on a screen you've already
      loaded once (e.g. Materials) → reload the screen → confirm cached
      data still renders (AsyncStorage's web shim backing the offline
      cache). Go back online, make an edit somewhere (e.g. a score entry as
      teacher), then revisit a related cached screen (e.g. that student's
      report) → confirm it shows the new data immediately rather than a
      stale cached copy — this is the cache-invalidation fix from this
      session, and web is actually a valid place to test it since the
      underlying storage layer is shared.

---

## Phase 2 — Android (only after Phase 1 is fully checked or logged)

### 2.0 Setup
```
cd mobile
npx expo start
```
**`apiUrl` again, differently this time:** revert `app.json`'s
`expo.extra.apiUrl` from whatever you set it to for Phase 1 back to
something your Android device can actually reach — `10.0.2.2:4000` if
you're on an Android *emulator* (this is the special alias built into
`client.ts`'s own fallback, so it also works if you simply remove the
`apiUrl` override entirely and let it fall back), or your machine's real
LAN IP (e.g. `http://192.168.1.23:4000`) if you're on a **physical**
device — `localhost`/`10.0.2.2` won't resolve from a real phone on the
same Wi-Fi. `localhost` (the value used for web in Phase 0) will not work
for either Android case.
Press `a` for a connected/emulated Android device, or scan the QR code
with Expo Go. **Note:** `expo-notifications` remote push token
registration may require a development build rather than Expo Go,
depending on the installed Expo SDK/Go version — if push registration
silently fails or errors only in Expo Go, rebuild as a dev client
(`npx expo run:android`) before concluding push is actually broken.

### 2.1–2.5 — repeat every checkbox in Phase 1 (sections 1.1–1.5) on Android
Same accounts, same steps, same expected results — this is intentionally
the identical checklist. Log each as pass/fail against the Android column
in the progress log below rather than duplicating the whole list a second
time in this file.

### 2.6 Android/native-specific checks (no web equivalent)
- [ ] Print (admin or parent, any report): confirm it opens the actual
      Android system print dialog (not a browser tab) — pick "Save as PDF"
      or a real/virtual printer and confirm a real PDF is produced/printed.
- [ ] Export PDF: confirm the Android share sheet opens with a real PDF
      attached — send it to Drive or another app and confirm the file is
      valid.
- [ ] Excel export (admin): confirm this uses the native
      download-then-share flow (not a browser download) and produces a
      valid `.xlsx`.
- [ ] Offline mode: enable Airplane Mode mid-session.
  - [ ] Open a screen already cached (e.g. Materials) → confirm cached
        data still shows with an offline indicator/banner.
  - [ ] Make a write while offline (e.g. teacher logs a weekly-effort note)
        → confirm it queues (no crash, some "pending"/offline indicator).
  - [ ] Disable Airplane Mode → confirm the queued write flushes
        automatically and a related screen reflects the change without a
        manual pull-to-refresh (cache-invalidation fix, same as the web
        check in 1.6 but on the real native outbox/flush path this time).
- [ ] Log out → confirm the app warns if there are still pending queued
      writes and lets you cancel, per `AuthContext.tsx`'s logout flow.
- [ ] Force-quit and reopen the app → confirm the session persists
      (`expo-secure-store`-backed token survives app restart, not just a
      page reload like the web check).
- [ ] Push notifications: confirm registration succeeds (or fails cleanly
      with a clear reason) — see the Expo Go/dev-client note under 2.0.

---

## Progress log

*(Append one line per completed step, in the format below. Don't remove
earlier entries — this is the resumption record for the next
session/agent.)*

```
YYYY-MM-DD  <who/which agent>  <step id, e.g. 1.1/AdminUsers-role-picker>  PASS|FAIL|SKIP  <one-line detail>
```

*(nothing logged yet — this pass hasn't started)*
