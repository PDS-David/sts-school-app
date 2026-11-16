# FRONTEND-NOTIFICATIONS-ACTIONS-001 — Make actionable alerts navigable

Task ID: FRONTEND-NOTIFICATIONS-ACTIONS-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-notification-actions-20261116`

## Finding

The Notifications screen displayed unread message and assessment alerts as static cards. Tapping an alert did nothing, even though the app already had working push-notification navigation helpers and role-specific message destinations.

## Implemented

- Attach a typed destination to student assessment alerts.
- Attach the authorized contact record and role-specific screen name to unread-message alerts.
- Make destination-bearing notification cards accessible buttons.
- Mark a tapped actionable alert as read before navigating.
- Route message alerts to the existing ChatThread screen for parent/student/teacher and Messages screen for admin/finance_admin.
- Route assessment alerts through the existing assessment deep-link helper.
- Keep announcements and other alerts without a supported destination as non-interactive cards.

## Changed files

- `mobile/src/components/NotificationsContext.tsx`
- `mobile/src/screens/NotificationsScreen.tsx`

## Verification

- Static review confirms message destinations use the existing server-authorized contacts response and preserve the role-specific route names.
- Static review confirms assessment alerts use the existing TakeAssessment navigation helper.
- Read-state persistence remains account/role/school/class scoped.
- No backend endpoint or message authorization changed.
- TypeScript, automated, browser and device checks are pending PR CI/runtime access; no pass is claimed.

## Remaining

- Verify message-alert navigation for all four role families and assessment navigation for students on web and native.
- Verify tapping marks only the selected alert read and that state persists after app restart.
