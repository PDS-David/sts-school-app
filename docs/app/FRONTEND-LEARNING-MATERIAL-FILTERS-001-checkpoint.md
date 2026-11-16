# FRONTEND-LEARNING-MATERIAL-FILTERS-001 — Complete Downloads shortcut and protect subject filters

Task ID: FRONTEND-LEARNING-MATERIAL-FILTERS-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-learning-material-filters-20261116`

## Findings

- The student Learning tab's Downloads shortcut filtered for `doc` only, excluding PDFs even though MaterialsScreen supports downloads for both PDF and document materials.
- MaterialsScreen issued a new request whenever the subject filter changed, but older requests could resolve afterward and overwrite the current subject's results or loading/error state.

## Implemented

- Add a dedicated `download` filter that includes both `pdf` and `doc` material types.
- Point the student Downloads shortcut at the combined download filter.
- Add request generations to MaterialsScreen fetches so stale subject/filter responses cannot replace newer results.
- Invalidate in-flight material requests on filter-effect cleanup and screen unmount.
- Keep existing retry, upload and delete refresh behavior using the same guarded fetch function.

## Changed files

- `mobile/src/screens/student/StudentLearningScreen.tsx`
- `mobile/src/screens/MaterialsScreen.tsx`

## Verification

- Static review confirms PDF and DOC remain the only downloadable material types, matching the existing download button behavior.
- Static review confirms subject ID query encoding and existing API endpoints are unchanged.
- No material access permissions or backend logic changed.
- TypeScript, automated, browser and device checks are pending PR CI/runtime access; no pass is claimed.

## Remaining

- Verify the Downloads shortcut lists both PDF and DOC materials while excluding videos and links.
- Rapidly switch subject filters and confirm only the latest response is displayed.
- Verify retry/upload/delete refresh behavior after the new request guard.
