# FRONTEND-A11Y-SCREEN-001 — Label screen-specific actions and data-entry controls

Task ID: FRONTEND-A11Y-SCREEN-001
Status: IMPLEMENTED — awaiting PR CI; no runtime/screen-reader verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-screen-accessibility-20261116`

## Findings

The shared header/sidebar/FAB controls had already received accessible names, but several screen-specific controls still depended on visual context:
- Materials open/delete/add actions and subject/type selectors lacked explicit accessible names.
- Chat conversation back controls were icon-only.
- Parent ward selector chips did not announce which child was selected.
- Attendance day-entry fields exposed only a numeric placeholder, not the student name or field meaning.
- Score-entry fields exposed only a numeric placeholder, not the student and score component.
- Admin user role filters did not announce their selected state; user rows and search needed explicit names.

## Implemented

- Add explicit roles and accessible labels to Materials add/open/delete actions and accessible labels to material selectors.
- Label chat back controls for both nested ChatThread and admin Messages.
- Announce parent ward names/classes and selected state.
- Label attendance inputs as each student's days-present field.
- Label score inputs by student and CA1/CA2/exam component; label score filters and add-subject action.
- Label Admin Users search, role filters and selected state, user action rows, and Add User.

## Changed files

- `mobile/src/screens/MaterialsScreen.tsx`
- `mobile/src/screens/chats/ChatThreadScreen.tsx`
- `mobile/src/screens/MessagesScreen.tsx`
- `mobile/src/screens/parent/ParentHomeScreen.tsx`
- `mobile/src/screens/AttendanceScreen.tsx`
- `mobile/src/screens/ScoreEntryScreen.tsx`
- `mobile/src/screens/AdminUsersScreen.tsx`
- `mobile/src/components/ChatListItem.tsx`

## Verification

- Static review confirms screen-specific icon-only actions now have accessible names and button roles.
- Static review confirms attendance/score entry names identify both the student and the field.
- Existing route targets, data contracts and write permissions are unchanged.
- TypeScript, automated tests, VoiceOver/TalkBack, dynamic type and keyboard-navigation checks are pending PR CI/runtime access; no accessibility certification is claimed.

## Remaining

- Continue screen-level accessibility review for remaining forms, tables, modal controls and icon actions.
- Test VoiceOver/TalkBack focus order and announcements on real iOS/Android devices.
- Test web keyboard navigation, visible focus and dynamic text sizing.
