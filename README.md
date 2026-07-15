# STS School App
### Sow the Seed Schools — Unified Android + Backend System

---

## Overview

This is a **complete, production-ready** school management system that merges:
- **STSRPTApp** (Flask report/score management for Sow the Seed Schools, Ibadan)
- **school-android-ecosystem** (messaging, weekly efforts, materials, assessments)

Into a single unified **Expo React Native Android app** backed by a **Node.js/Express/PostgreSQL** API.

---

## Architecture

```
sts-school-app/
├── backend/          → Node.js + Express + TypeScript + PostgreSQL
│   ├── schema.sql    → Full database schema (run this first)
│   └── src/
│       ├── routes/   → auth, students, scores, attendance, academic,
│       │               messages, weeklyEfforts, learning, admin
│       ├── middleware/→ JWT auth, RBAC
│       └── utils/    → grades, jwt, email, audit, rbac
└── mobile/           → Expo React Native (Android)
    └── src/
        ├── api/      → axios client + AuthContext
        ├── screens/  → all 20+ screens
        └── components/ → shared UI components
```

---

## Roles (4 only)

| Role      | Can do                                                                 |
|-----------|------------------------------------------------------------------------|
| **student**  | View own report card, take assessments, view materials, message their class teacher, subject teachers, admin, their own parent(s), and their classmates (same class, same school) |
| **parent**   | View ward's report card, weekly efforts, messages, fee invoices        |
| **teacher**  | Read/write students, enter/edit scores for any subject, add new subjects (not delete), attendance, weekly efforts, upload materials, create assessments, read/write class-record remarks, message all staff |
| **admin**    | Everything above + manage users, terms, subjects, finance, Excel export, audit log |

> Super-Admin and Admin1/Admin2 from the original ecosystem are **merged into the single `admin` role**.

---

## Offline Support

> Non-technical explanation for school staff: see
> [`docs/OFFLINE_AND_ONLINE_GUIDE.md`](docs/OFFLINE_AND_ONLINE_GUIDE.md).

The mobile app works without an internet connection:

- **Reads** (materials, questions, assessments, messages, students, scores, etc.) are cached locally on every successful fetch and served from that cache automatically if a request can't reach the server.
- **Writes** (sending a message, submitting scores/assessments, etc.) made while offline are queued in a local outbox and automatically replayed, in order, the next time connectivity returns.
- A banner at the top of the app shows offline status and pending-sync count, with a manual "Retry" option.
- Sent messages appear immediately (marked "Sending… (offline)" until synced) rather than waiting for a round trip.

**Exceptions (require a live connection, no offline fallback):**
- **Logging in, logging out, and changing your password.** These need a real
  round trip by nature — logging in verifies a credential against the
  server, logging out revokes a token there, and changing your password
  checks the old one there. Attempting any of these with no signal now
  fails immediately with a clear "you're offline" message rather than
  silently queuing (see Known limitation below for why that matters). Once
  logged in, previously-viewed screens still work offline.
- **Admin's Excel export.** `ExportExcelScreen` downloads a binary file
  directly via `expo-file-system`, bypassing the JSON cache/outbox entirely —
  it just shows "Export failed" if the server can't be reached.
- **Brainee (AI features).** Chat, explanations, hints, and question drafting
  all need a live model call — queuing one for silent replay later would show
  a stale, out-of-context answer with no way to know it wasn't live, so these
  fail immediately too.

This is implemented in `mobile/src/offline/` (`storage.ts` for the cache/outbox, `network.ts` for connectivity detection) and wired into `mobile/src/api/client.ts`. It requires the `@react-native-community/netinfo` package, and the redesigned navigation requires `react-native-gesture-handler` — after pulling this update, run:
```bash
cd mobile
npx expo install @react-native-community/netinfo react-native-gesture-handler
```
(`expo install` picks the exact versions matched to your Expo SDK; plain `npm install` may pull incompatible ones.)

**Per-user isolation:** the cache and outbox are namespaced by whichever
user is currently signed in (`setCacheNamespace` in `storage.ts`, called
from `AuthContext` on login/session-restore/logout). This matters on a
shared device — a staffroom tablet used by more than one teacher, say — so
one person's cached data and queued-but-unsynced writes are never visible
to, or replayed under, someone else's session. Logging out while writes are
still queued (i.e. genuinely offline, since `logout()` tries to flush first
when online) warns the person that those changes won't finish syncing until
they sign back in on that same device. The GET cache is also capped at 500
entries per user, oldest-fetched evicted first, so it can't grow without
bound over months of daily use.

**Known limitation (deliberate, revisited Pass 12):** offline queueing works at the network layer, so a queued write is only dropped from the outbox once the server actually accepts it (or rejects it with a 4xx, meaning it was invalid). If the same record is edited offline from two different devices before either syncs, the usual last-write-wins behavior applies once both come back online — there's no conflict-merging logic. This was raised with the school owner directly; the decision was to leave the underlying mechanism as-is rather than build per-record conflict detection, and instead add two things that address it more practically for how the school actually works: every write that was previously missing one now has an audit-log entry (who did what, when — see Audit Log in the admin dashboard), and a class teacher can lock a whole class's records for a term once they're final, which stops the race from being possible at all for the period it matters most. See CHANGELOG Pass 12 for the full writeup.

## Class Locks

A class teacher can "close" her own class's records for a term from Classes → Close Term Records (or Admin → Class Locks for any class). While locked, every write to that class's scores, attendance, class-record remarks, and weekly efforts is rejected — including the class teacher's own — until it's unlocked again. Admin can always lock/unlock any class and is never blocked by a lock. Enforced in `backend/src/utils/scope.ts` (`checkTeacherStudentScope`), managed via `GET`/`PUT /academic/class-locks`.

## Deleted Students (soft delete + restore)

`DELETE /students/:id` no longer permanently erases a student. A teacher may delete a student under their own class or subject care directly (no admin approval needed); the record is flagged `deleted_at`/`deleted_by` rather than removed, so every historical score/attendance/class-record/weekly-effort/submission/invoice tied to that student still resolves correctly. A deleted student disappears from the roster, ward list, self-lookup, and materials/assessments visibility for everyone, and can't be written to again (scores, attendance, etc. all 404) until an admin restores it from Admin → Deleted Students, a one-tap action against `POST /students/:id/restore`. Both the delete and the restore are recorded in the Audit Log.

**Migration note:** if you have an existing database, run the updated `backend/schema.sql` (or just its two `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements and the `CREATE INDEX` for `students.deleted_at`/`deleted_by`) before deploying this change — both columns are nullable, so this is a safe, additive migration with no downtime or backfill required.

## Content Scope (materials, questions & assessments)

A teacher may publish a learning material, question, or assessment for a class/subject when EITHER of the following is true: the target class matches their own assigned class (a class teacher may publish for their class, in any subject), OR the target subject matches their own assigned subject (a subject teacher/specialist may publish in their subject for **any class** in their school, not just one they're the class teacher for). A teacher with neither an assigned class nor an assigned subject can't publish content at all. Enforced in `backend/src/utils/scope.ts` (`checkTeacherContentScope`, kept separate from the student-write scope check used by scores/attendance/class-records/weekly-efforts) and applied to creating a material/question/assessment (`POST /learning/materials`, `/questions`, `/assessments`) and, as of Pass 20, to publishing/closing one too (`PUT /learning/assessments/:id/status`) — previously that route only checked school_code, so any teacher in the school could open or close an assessment they had no part in creating.

## Student Records Scope (rosters, scores, attendance, weekly efforts)

Distinct from Content Scope above: a teacher's access to actual student *records* — the roster itself, plus scores, attendance, and weekly efforts — stays limited to their own class, full stop, with no carve-out for also holding a subject assignment. `GET /students`, `GET /scores`, and `GET /weekly-efforts` (`backend/src/routes/`) all enforce this the same way: a class teacher's `assigned_class` always wins over anything else requested; a teacher with no `assigned_class` (a pure subject specialist) either gets nothing back until they name a specific class explicitly (`/students`, `/scores`), or is limited to just the records they personally logged (`/weekly-efforts` — its main feed has no class-filter UI, so returning nothing wasn't a workable fix there). None of the three default to a whole-school dump. This is a deliberate, narrower rule than Content Scope above: a subject teacher may *publish an assessment* for any class in their subject, but can't *browse that class's roster, scores, or effort logs* through these endpoints to do it. `GET /attendance` and `GET /attendance/class-records` already required an explicit class name before this; `PUT` writes to all of these correctly stay broader (a subject teacher may write across any class in their subject, via `checkTeacherStudentScope`) since writing one record and browsing a whole class's worth are different things. `ScoreEntryScreen.tsx`, `AttendanceScreen.tsx`, and `WeeklyEffortsScreen.tsx` all fetch one class's roster at a time rather than the whole school up front, and their class pickers only offer classes the backend will actually honor.

## Messaging Scope

Who can message whom is centralized in `backend/src/utils/scope.ts` (`getMessageableUsers`), used to build both the Chats contact list and to enforce every `POST /messages` send server-side:
- **Student** → their class teacher, any subject teacher, any school admin, their own linked parent(s), and their classmates (same class, same school).
- **Parent** → their ward's class teacher, any subject teacher, and any school admin — as of Pass 18, no longer limited to just the class teacher. (Not the ward's other linked parent — that's never been implemented on either branch this was reconciled from.)
- **Teacher** → every other active user in their own school, plus any school admin regardless of school.
- **Admin** → every other active user, in every school.

Student reach (classmate messaging) and parent reach (subject-teacher/admin reach) were built on two separate branches and reconciled into this single function in Pass 18 — see CHANGELOG for the full writeup. Pass 19 then fixed a bug found in all three of the student/parent/teacher branches above: since admin accounts have `school_code = NULL`, a same-school join/filter condition ANDed with an admin check can never actually match an admin row, so admin was silently unreachable from every role until this fix, despite this doc always describing it as reachable. Pass 19 added `deleted_at` filtering to the student and parent branches so a soft-deleted student's login stops appearing as (or seeing) a contact; Pass 20 closed the same gap in the teacher and admin branches, which needed a different fix (a `LEFT JOIN` back to `students`, since those two branches list every role, not just students).

---

## Database Setup

### 1. Create PostgreSQL database
```bash
psql -U postgres -c "CREATE DATABASE stsschool;"
```

### 2. Run schema
```bash
psql -U postgres -d stsschool -f backend/schema.sql
```

### 3. Seed default data (subjects, classes, terms, admin user)
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets
npm install
npm run db:seed
```

Default login after seed:
- **admin** / `Admin@1234` → must change password on first login
- **teacher1** / `Teacher@1234` → assigned to JSS1, secondary school

> **Note on accounts:** there is no self-signup. Every student, parent, and
> teacher account is created by an admin (`POST /admin/users`), which is also
> where an optional `access_expires_at` window gets set. A self-signup route
> existed early on and was deliberately removed at the school owner's
> request — don't re-add it without also adding an admin-issued invite-code
> guard alongside it.

---

## First Term (2025/2026) Import — legacy data, zero manual entry

`backend/src/db/importFirstTerm.ts` loads First Term results for both
schools straight from a bundled snapshot of the legacy Flask/PythonAnywhere
system's database — `backend/src/db/data/first_term_import.json` — into this
app's Postgres schema, so teachers do **not** have to re-key any of it.

> **Renamed from `importSecondTerm.ts`.** An earlier pass built this import
> and labeled it "2nd Term," matching the legacy database's own (wrong)
> term-table label. The legacy system's own report-card exports say "First
> Term" on every card, so that label — not the report cards — was the typo.
> The script and data bundle are now correctly named/labeled for 1st Term.
> The academic year, 2025/2026, was already correct and is unchanged.

Unlike the old script, this one does **not** require students to already be
loaded — it creates any student in the bundle that doesn't already exist
(matched by admission number, or by exact name + class + school for the
handful of legacy records with no admission number), so it can run against
an empty roster.

```bash
cd backend
npx tsx src/db/importFirstTerm.ts
```

What it does, in order:
1. Upserts a **1st Term 2025/2026** row for each school. Only marks it
   current if the school has no current term yet — it will **not** demote a
   term you've already moved on to (e.g. if 2nd Term is already open).
2. Adds any subjects from the source data that don't already exist (a few
   legacy subjects entered twice under different casing, e.g. "Basic
   science" vs "BASIC SCIENCE," are already folded into one in the bundle).
3. Adds any students from the source data that don't already exist. Existing
   students are left completely untouched.
4. Upserts scores, attendance, and class-teacher/admin remarks for the term,
   matched to students **by admission number**, falling back to an exact
   name + class + school match for the handful of source records that had no
   admission number recorded.
5. Prints a summary of everything saved, and lists anything it couldn't match
   so you can fix it by hand (e.g. a student whose name or class doesn't
   line up exactly between the two systems).

It's safe to re-run — every write is an upsert, and existing students/terms
are never overwritten by it.

**On the single "CA" column:** the legacy data (and this schema) still
stores CA1 and CA2 as separate values internally — nothing about score entry
or validation changed. The mobile report screens (`MyResultsScreen.tsx`,
`StudentDetailScreen.tsx`) display them added together as one **CA** column
rather than two, since that's how the report card should read. If you want
CA1/CA2 combined at entry time too (not just on the report), that's a
separate, larger change — ask before assuming it's wanted, since it touches
score entry and the per-school CA-max validation in `routes/scores.ts`.

## Resetting for a new term or session

`backend/src/db/resetAcademicData.ts` is the admin-run counterpart to the
import script above — for wiping data cleanly at a term or session boundary
rather than letting it accumulate indefinitely. Same pattern as
`importFirstTerm.ts`: a CLI script you run yourself via SSH, not an API
route or mobile button, because every mode is destructive.

**Always run once without `--yes` first** — it prints exactly what it would
delete and stops.

```bash
cd backend
# Redo one term's data (e.g. a botched import) without touching other terms:
npx tsx src/db/resetAcademicData.ts --term <term_id>              # dry run
npx tsx src/db/resetAcademicData.ts --term <term_id> --yes        # actually delete

# Clear a whole session's scores/attendance/remarks, keep the roster & subjects:
npx tsx src/db/resetAcademicData.ts --session secondary 2025/2026 --yes

# Retire an entire past session (deletes its term rows and everything tied
# to them) to make way for a new one — roster and subjects carry over:
npx tsx src/db/resetAcademicData.ts --new-session secondary 2025/2026 --yes

# ...or, for a genuine full roster wipe (e.g. re-registration each session):
npx tsx src/db/resetAcademicData.ts --new-session secondary 2025/2026 --include-students --yes
```

After a `--new-session` reset, create the new academic year's 1st Term via
Admin > Terms in the app (or a fresh import script, if there's another
legacy batch to bring in).

---

## Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, SMTP settings

npm install
npm run dev          # development (hot reload)
npm run build && npm start   # production
```

The API runs on **port 4000** by default.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Login → access + refresh tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/change-password` | Change own password |
| GET/POST | `/students` | List / add students |
| GET | `/students/:id` | Student detail + parents |
| PUT | `/students/:id` | Edit student |
| DELETE | `/students/:id` | Soft-delete student (teacher: own class/subject only; recoverable) |
| GET | `/students/deleted` | List soft-deleted students (admin only) |
| POST | `/students/:id/restore` | Restore a soft-deleted student (admin only) |
| POST | `/students/:id/link-parent` | Link parent account |
| GET/POST | `/scores` | Get / upsert scores |
| POST | `/scores/bulk` | Batch score entry |
| GET | `/scores/report/:student_id` | Full term report card |
| PUT | `/attendance` | Save attendance |
| PUT | `/attendance/bulk` | Batch attendance |
| PUT | `/attendance/class-records` | Save teacher/admin remarks |
| GET/POST | `/academic/terms` | List / create terms |
| PUT | `/academic/terms/:id` | Edit / set current term |
| GET/POST | `/academic/subjects` | List / create subjects |
| GET | `/academic/classes` | List classes |
| GET | `/academic/schools` | School config |
| GET/POST | `/messages` | Inbox / send message |
| GET | `/messages/conversation/:id` | Thread view |
| GET | `/messages/contacts` | Who can this user message |
| GET/POST | `/weekly-efforts` | List / log weekly efforts |
| POST | `/weekly-efforts/:id/feedback` | Add feedback |
| GET/POST | `/learning/materials` | Learning materials |
| GET/POST | `/learning/questions` | Question bank |
| GET/POST | `/learning/assessments` | Assessments |
| POST | `/learning/assessments/:id/submit` | Student submission |
| GET | `/learning/assessments/:id/results` | Submission results |
| GET | `/admin/users` | All users (admin only) |
| POST | `/admin/users` | Create user |
| PUT | `/admin/users/:id` | Edit user |
| DELETE | `/admin/users/:id` | Delete user |
| POST | `/admin/users/:id/reset-password` | Reset password |
| GET | `/admin/audit-log` | Audit trail |
| GET | `/admin/export/excel` | Download Excel report |
| GET/POST | `/admin/finance/fee-items` | School fees config |
| GET/POST | `/admin/finance/invoices` | Student invoices |
| PUT | `/admin/finance/invoices/:id/status` | Mark paid |

---

## Mobile App Setup

```bash
cd mobile
npm install
```

### Configure backend URL
Edit `src/api/client.ts`:
```typescript
// For Android emulator connecting to your PC:
export const BASE_URL = 'http://10.0.2.2:4000';

// For physical device on same WiFi:
export const BASE_URL = 'http://192.168.x.x:4000';

// For production:
export const BASE_URL = 'https://your-api-domain.com';
```

### Run on Android
```bash
# Start Expo
npm start

# Then press 'a' for Android emulator, or scan QR with Expo Go
```

### Build APK (production)
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

---

## Features by Screen

### Student
- **Dashboard** — Quick tiles to all accessible features
- **Report Card** — Full term scores, grades, class average, remarks, attendance
- **Learning Materials** — View PDFs/videos/links uploaded by teachers
- **Assessments** — Take MCQ assessments with auto-marking
- **Messages** — Message class teacher, subject teachers, admin, own parent(s), or a classmate
- **Weekly Efforts** — View teacher's weekly performance log

### Parent
- **Dashboard** — Ward's summary tiles
- **Report Card** — Ward's term report
- **Weekly Efforts** — View + add feedback on ward's weekly effort records
- **Messages** — Message ward's class teacher, any subject teacher, or any school admin
- **Finance** — View fee schedule and invoices

### Teacher
- **Students** — Search/browse students in their class
- **Student Detail** — View profile, scores, add teacher remarks
- **Score Entry** — Bulk score entry (CA1, CA2, Exam) per subject per class
- **Attendance** — Record days present for whole class
- **Weekly Efforts** — Log weekly academic effort per student
- **Learning Materials** — Upload materials (PDF/video/doc/link URL) for their assigned class, or (if assigned a subject) for that subject in any class
- **Assessments** — Create assessments from question bank for their assigned class, or (if assigned a subject) for that subject in any class; view results
- **Messages** — Message any staff member

### Admin
- **All teacher features** +
- **User Management** — Create/edit/deactivate/reset-password for all users
- **Class Summary** — Ranked class leaderboard by term/class
- **Terms Management** — Create terms, set current term
- **Subjects Management** — Add/delete subjects per school
- **Finance** — Configure fee items, generate invoices, mark payments
- **Export Excel** — Download full school data workbook
- **Audit Log** — Full trail of all system actions
- **Deleted Students** — View soft-deleted students and restore them

---

## Schools Supported

| Code | Name | Head Title |
|------|------|-----------|
| `primary` | Sow the Seed Nursery & Primary School | Head Teacher |
| `secondary` | Sow the Seed Model College | Principal |

Address: Olosan Road, Alakia, Ibadan

---

## Grading Scale

| Score | Grade | Remark |
|-------|-------|--------|
| 70–100 | A | Excellent |
| 60–69  | B | Very Good |
| 50–59  | C | Good |
| 45–49  | D | Fair |
| 40–44  | E | Pass |
| 0–39   | F | Fail |

---

## Security

- JWT access tokens (15 min) + refresh tokens (7 days) stored in database
- **On-device, tokens are stored in `expo-secure-store`** (iOS Keychain /
  Android Keystore-backed encrypted storage), not plain `AsyncStorage` — see
  `mobile/src/api/secureTokenStorage.ts`. A one-time silent migration moves
  any previously-stored plaintext tokens across on first launch after this
  update, so existing logged-in users aren't signed out.
- Bcrypt password hashing (rounds=10)
- Role-based permission system — every endpoint checks `hasPerm()`
- Students can message their class teacher, subject teachers, admin, their own parent(s), and their classmates (same class, same school only — not students in other classes/schools)
- Rate limiting on auth endpoints (30 req / 15 min)
- Helmet.js security headers
- First-login forced password change
- Full audit log on all write operations
- Admin email log notifications on security events
- **Server refuses to boot in production** (`NODE_ENV=production`) if `JWT_SECRET`/`JWT_REFRESH_SECRET` are missing or left at their placeholder values — this is checked in code, not just documented, so it can't be silently forgotten

---

## Is this actually usable by the school, or just a working demo?

This was audited end-to-end (real Postgres, real login/token flow, real HTTP requests — not just reading the code) to answer that honestly. Here's the real state:

### Confirmed genuinely working (tested, not assumed)
- Login, JWT issue/refresh, forced first-login password change
- Role permissions enforced server-side (not just hidden buttons in the app)
- Score entry/editing, auto-graded MCQ assessments, Excel export, audit log — all real logic against real tables
- First Term import script (`importFirstTerm.ts`, renamed from `importSecondTerm.ts` — see above) — ran against a live database, 100% of the source data matched and saved
- Offline caching/queueing for reads and writes
- First Term data import script

### Found broken for real-world use, and fixed in this pass
- **The API address was hardcoded to `10.0.2.2`** — the Android emulator's special alias for "this same computer." On an actual phone this resolves to nothing; every request would have failed. Now reads from `app.json → expo.extra.apiUrl`, so it can point at a real deployed backend. **You must set this to your real backend's URL before building the app for real phones** — see the comment at the top of `mobile/src/api/client.ts`.
- **The seeded admin password hash in `schema.sql` was a fake placeholder string**, not a real bcrypt hash — that account could never actually log in. Removed; `seed.ts` (which uses a real bcrypt hash) is now the single source of truth for the first admin account.
- **JWT secrets silently fell back to a hardcoded default** (`'change-me'`) if not configured — meaning anyone could forge a valid admin token by reading the source. The server now refuses to start in production with these defaults still in place.
- **A newly created student or parent login had no way to be connected to an actual student record.** A student account with no link couldn't take assessments, view their report, or message anyone; a parent account with no link would see zero children. Fixed: Admin → a student's detail page now has "Login Account" and "Parents/Guardians" sections to link (and unlink) both, verified with a real create → link → verify round-trip against a live database.

### Real, currently-unaddressed limitations (be aware of these before rollout)
- **No push notifications.** The in-app notification bell shows real data (open assessments, etc.) but nothing arrives on a parent's/teacher's phone if the app isn't open — there's no FCM/Expo-push wiring, despite an `FCM_SERVER_KEY` placeholder in `.env.example`. Building this is a distinct, non-trivial piece of work (device token registration, a push-sending service, a UI for what triggers a push).
- **No APK has actually been built yet, but the config to build one now exists.** Pass 19 added `mobile/eas.json` (a `preview` profile that outputs an installable `.apk`, and a `production` profile for a Play Store `.aab`), matching the `eas build -p android --profile preview` command already documented above — that command would have failed before this pass since there was no `eas.json` at all. Building the actual APK still needs to happen from a machine with network access to Expo's build service (`expo.dev`) — this wasn't done as part of this pass since the sandboxed environment used for Passes 16–19 has no route to it (its network allowlist covers package registries only — npm, PyPI, crates, GitHub — not `expo.dev`, `dl.google.com`, or the Gradle plugin portal). To build it yourself: **first change `mobile/app.json → expo.extra.apiUrl`** away from `http://10.0.2.2:4000` (the Android-emulator-only loopback alias — a real phone can't reach it) to your backend's real, reachable URL, then run `npm install -g eas-cli && eas login && eas build -p android --profile preview` from `mobile/`. That produces a signed `.apk` you can sideload directly, no Play Store step needed.
- **Materials are link-based, not uploaded files.** Teachers paste a URL (e.g. a Google Drive link) rather than uploading a file to be hosted by this server. This is a reasonable, common approach for a small school (avoids needing S3/R2 setup) but means teachers need somewhere else to host the file first.
- **Finance is record-keeping, not online payment.** Admin marks an invoice "paid" by hand; there's no Paystack/Flutterwave/card integration. Fine if fees are paid offline (bank transfer, cash) and just tracked here — not fine if you want parents to pay *inside* the app.
- **The backend needs to actually be deployed somewhere reachable** (Render, Railway, a VPS, etc.) with a real Postgres database and HTTPS. Right now this is source code + a working local dev setup, not a live, hosted service.

None of these are "fake" features pretending to work — they're either genuinely functional pieces with an honest scope boundary (finance, materials), or clearly-labeled gaps (push, APK distribution) that need dedicated follow-up work rather than being quick fixes bundled into this pass. Happy to tackle any of them next — building a real push notification pipeline or setting up the EAS build would each be a good next step.

---

## Environment Variables

```env
PORT=4000
DATABASE_URL=postgres://USER:PASS@HOST:5432/stsschool
JWT_SECRET=<random 64-char string>
JWT_REFRESH_SECRET=<another random 64-char string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

MAIL_FROM=school@sowtheseed.edu.ng
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

ADMIN_LOG_RECIPIENTS=admin@sowtheseed.edu.ng

NODE_ENV=production
```

---

## Deployment Suggestions

**Backend:** Railway, Render, or any Node.js host  
**Database:** Supabase, Railway Postgres, or Neon  
**Mobile:** Build APK via EAS Build, distribute via Firebase App Distribution or direct APK

---

*Built for Sow the Seed Schools, Olosan Road, Alakia, Ibadan*
