# WhatsApp-Style UI Redesign — Implementation Notes

This implements the redesign described in `1.docx`: student, teacher, and
parent now get a WhatsApp-style bottom-tab experience; **admin is untouched**
and still uses the original tile dashboard.

## What was added

```
mobile/src/
  App.tsx                              ← NEW (see "Missing files" below)
  navigation/
    navigationRef.ts                   ← global nav ref (for the bell icon)
    RootNavigator.tsx                  ← picks role-based navigator after login
    StudentTabs.tsx                    ← Home / Learning / Assessments / Chats / Profile
    TeacherTabs.tsx                    ← Dashboard / Classes / Assessments / Chats / More
    ParentTabs.tsx                     ← Home / Progress / Activities / Chats / Profile
    AdminStack.tsx                     ← original tile dashboard, unchanged behaviour
  components/
    AppHeader.tsx                      ← shared top bar: title + bell (badge) + avatar
    FAB.tsx                            ← contextual floating action button
    ChatListItem.tsx                   ← WhatsApp-style chat row
    NotificationsContext.tsx           ← aggregates real signals for the bell
  screens/
    NotificationsScreen.tsx            ← opened from the bell icon
    chats/ChatsScreen.tsx              ← SAME screen used by all 3 roles (All / Direct Messages / Groups / Archived)
    chats/ChatThreadScreen.tsx         ← conversation view (same logic as MessagesScreen, own route)
    student/StudentHomeScreen.tsx, StudentLearningScreen.tsx, StudentAssessmentsHomeScreen.tsx, StudentProfileScreen.tsx
    teacher/TeacherDashboardHomeScreen.tsx, TeacherClassesScreen.tsx, TeacherAssessmentsHomeScreen.tsx, TeacherMoreScreen.tsx
    parent/ParentHomeScreen.tsx, ParentProgressScreen.tsx, ParentActivitiesScreen.tsx, ParentProfileScreen.tsx
  screens/MaterialsScreen.tsx           ← MODIFIED: now accepts optional route.params.typeFilter (used by the Learning tab's Videos/Downloads shortcuts); unchanged when called without it (admin/teacher flows still work as before)
```

All existing screens (`MyResultsScreen`, `AssessmentsScreen`, `ScoreEntryScreen`,
`AttendanceScreen`, `StudentsScreen`, `FinanceScreen`, `WeeklyEffortsScreen`,
`AdminUsersScreen`, `ExportExcelScreen`, `CreateAssessmentScreen`, etc.) are
**reused as-is** — the new tab navigators just push them from the new landing
screens. `MessagesScreen.tsx` is also untouched and is still what admin uses.

## Design decisions that follow the docx directly

- **Chats is identical across roles** (`chats/ChatsScreen.tsx` takes no
  role-specific props at all) — the docx calls this out explicitly under
  "Keep Chats Consistent", so it takes priority over the earlier per-role
  contact-category lists (Teachers/Class groups/etc.). Tapping a contact opens
  the same `ChatThreadScreen` for everyone.
- **Notifications are not a tab** — a bell + badge in `AppHeader`, opening
  `NotificationsScreen`, per the spec.
- **FABs match the doc's action lists exactly**: Student (Ask AI / Start
  discussion / New message), Teacher (Add resource / Create assessment /
  Take attendance / New announcement), Parent (Message teacher / Report
  absence / View report).
- Tab bar hides when you push into a chat thread, the way WhatsApp's does.

## Known backend/data gaps (UI shows honest placeholders, not fake data)

- **Announcements** (Student Home, Parent Home) — there's no
  announcements/school-notice endpoint in the routes I could see
  (`academic.ts`, `learning.ts`, etc.), so these sections show a plain
  "no announcements yet" card instead of invented content.
- **Attendance for students** — `attendance.ts`'s `/class-records/:student_id/:term_id`
  route has no scoping check tying `student_id` to the requesting user, and
  the RBAC table only grants `classRecord.read` to teacher/admin. Rather than
  flip that permission blind (which would let any student read another
  student's remarks by changing the URL param), I left the student Profile
  → Attendance row as an honest "not available yet" message. If you want this
  live, it needs both an RBAC change **and** a scoping fix in the route — I'd
  rather do that with the real `middleware/auth.ts` in front of me (see below).
- **Teacher "pending marking"** — there's no graded/ungraded flag on
  submissions, so the Dashboard stat shows a real "Open Assessments" count
  instead of a guessed marking-backlog number.
- **Analytics / Calendar (teacher More tab)**, **Badges (student Profile)**,
  **Upcoming Tests / Calendar / School Events (parent Activities)** — all
  labelled "Coming soon"; there's no backing data source for any of these yet.

## Files that were missing from the uploaded archive

Only `mobile/src`, `backend/schema.sql`, and `backend/src` were included —
several files referenced by the existing code weren't present:

- `mobile/src/App.tsx`, `mobile/package.json`, `mobile/app.json` — **App.tsx
  had to be reconstructed from scratch** (see the note at the top of that
  file). It wires `AuthProvider` → `WardProvider` → `NotificationsProvider` →
  `NavigationContainer` based on how those providers are used elsewhere in
  the codebase, but I have no way to confirm this matches your real one.
  **Please diff it against your actual `App.tsx` before committing** — if the
  real file has extra providers (offline-sync banner, error boundary,
  deep-linking config, etc.), carry those over.
- `mobile/src/offline/index.ts` — `api/client.ts` and `MessagesScreen.tsx`
  both import `cacheGet`/`cacheSet`/`enqueueRequest`/etc. from `../offline`,
  but only `offline/network.ts` and `offline/storage.ts` were in the archive,
  no re-exporting `index.ts`. Not touched — out of scope for a UI redesign
  and I'd rather not guess at its shape.
- `backend/src/middleware/auth.ts`, `backend/src/routes/messages.ts`,
  `backend/src/types/` — referenced throughout but not included. No backend
  changes were made in this pass for that reason (see Attendance note above).

## Integration steps

1. Copy `mobile/src/` from this archive over your real `mobile/src/`,
   **except** `App.tsx` — diff that one first (see above) before replacing.
2. `MaterialsScreen.tsx` has one small, backward-compatible change (optional
   `typeFilter` param) — safe to drop in directly.
3. Everything else is additive (new files only), so there's nothing else to
   reconcile.
4. Confirm `@react-navigation/bottom-tabs` and `@react-navigation/native-stack`
   are in `mobile/package.json` (they're already in `node_modules` in your
   project, so this is likely already the case).
