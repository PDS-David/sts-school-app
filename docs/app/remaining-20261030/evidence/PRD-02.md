# PRD-02 — Remove the six "Coming soon" placeholders

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `e271842d170bc74d6912d6040cfda086438be961`. Prompt line numbers were verified at `8ffcd12`; every citation below is at `e271842` and matched the prompt.
Owner decision D9: **not supplied in writing.** Implemented on the owner's instruction to execute PRD-02, using the prompt's recommended default (remove from navigation, build nothing). The owner must confirm D9 before merge. If any item should be built instead, that item needs its own task.
Files changed: `mobile/src/screens/parent/ParentActivitiesScreen.tsx`, `mobile/src/screens/student/StudentProfileScreen.tsx`, `mobile/src/screens/teacher/TeacherMoreScreen.tsx`, `mobile/src/navigation/StudentTabs.tsx`, this note. Deletions only (8 lines).

## Removed entries (old behaviour at base)

| Role | File:line (base) | Entry | Behaviour |
|---|---|---|---|
| Parent | `ParentActivitiesScreen.tsx:11` | Upcoming Tests | `screen: null`, sub-label "Coming soon"; row disabled |
| Parent | `ParentActivitiesScreen.tsx:12` | Calendar | same |
| Parent | `ParentActivitiesScreen.tsx:13` | School Events | same |
| Student | `StudentProfileScreen.tsx:15` | Badges | no `onPress`, "Coming soon" |
| Teacher | `TeacherMoreScreen.tsx:14` | Analytics | no `onPress`, "Coming soon" |
| Teacher | `TeacherMoreScreen.tsx:15` | Calendar | same |

## Dead registration removed

`AssessmentResults` registered in the student stack: import at `StudentTabs.tsx:24`, registration at `StudentTabs.tsx:70`. Evidence it was unreachable for students:

- The only navigation to `AssessmentResults` in `mobile/src` is `AssessmentsScreen.tsx:98`, inside `{isAdmin && (...)}` (`:97-99`; `isAdmin` is defined at `:22`). A repo-wide search for the route name finds no other caller.
- The screen calls an endpoint that needs a permission students lack (recorded in `APP_WIDE_AUDIT.md:298-302`; not re-derived here).

Kept: the admin registration (`AdminTabs.tsx:88`, with its import at `:41`), which is the only live caller path. Both the import and the registration were removed from `StudentTabs.tsx`; nothing else in that file referenced `AssessmentResultsScreen` afterwards (search of the file returns nothing).

## Navigation inventory, before → after

| Role / screen | Before | After |
|---|---|---|
| Parent › Activities | Assignments (→ `MyResults`), Upcoming Tests, Calendar, School Events | Assignments (→ `MyResults`) |
| Student › Profile | Progress, Badges, Attendance, Settings, Security Question, Log Out | Progress, Attendance, Settings, Security Question, Log Out |
| Teacher › More | Analytics, Calendar, Weekly Efforts, Settings, Log Out | Weekly Efforts, Settings, Log Out |
| Student › Assessments stack | AssessmentsHome, Assessments, TakeAssessment, **AssessmentResults**, MyResults, SessionReport | same without AssessmentResults |

Order of every remaining row is unchanged. `ChatThread` and `Messages` (push deep-link targets) were not touched.

## Step-1 rule: empty screens

No screen became empty, so no screen file or navigator registration was deleted. `ParentActivitiesScreen` now has **one** row (Assignments). The Activities tab (`ParentTabs.tsx:52-58`) is therefore a one-item list. Whether that tab should remain is a product decision; I did not remove it because the row is a working navigation and the prompt only removes screens with no remaining rows.

## Not changed

The now-unneeded `screen: string | null` / `disabled={!it.screen}` handling in `ParentActivitiesScreen` and the `onPress?` optionality in the two "More"/"Profile" arrays were left in place to keep the diff to deletions; they are inert, not dead routes. No new screen, endpoint, permission or data model. No route renamed.

## Acceptance (static)

- `Coming soon` no longer appears in `mobile/src` (search returns nothing).
- No navigator entry points at a deleted screen (no screen was deleted).
- Every remaining row in the three files navigates to a screen registered in its role's navigator, as at base (`MyResults` in `ParentTabs.tsx:45`/`:56`; `AssessmentsTab › MyResults` in `StudentTabs.tsx:71`; `ChangePassword`, `SecurityQuestionSetup`, `WeeklyEfforts` unchanged and not re-checked beyond not having been edited).

No tests, typechecks, bundler, device or emulator checks were run. The navigation was not exercised on a device. Testing deferred by owner.
