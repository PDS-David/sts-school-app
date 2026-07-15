# Regression Report — sts-school-app

Since **no application code changed** (Version A was kept as-is — see
`MERGE_REPORT.md`), there is no regression risk from this merge pass itself.
What follows is what was actually checked, and what was intentionally *not*
re-verified because nothing touched it.

## Checked in this pass

| Check | Method | Result |
|---|---|---|
| Backend compiles | `npm install && npx tsc --noEmit` in `backend/` | ✅ 0 errors |
| Mobile imports resolve | Static resolution of every relative `import ... from './...'` across all 56 `.ts`/`.tsx` files under `mobile/src/` | ✅ 0 unresolved imports |
| No file lost from A | Diffed full file list of A against the merged output | ✅ identical, nothing dropped |
| No stale/regressed logic pulled in from B | Reviewed all 7 files that differ between A and B line-by-line | ✅ A's version kept in all 7; confirmed each is a superset of B, not a divergent alternative |

## Not independently re-verified (out of scope — no code changed)

The following were working in Version A before this pass and were not touched,
so they were not re-tested end-to-end. Recommend the normal QA pass before
shipping if it's been a while since these were last exercised live against a
running backend + database:

- Login / registration / password reset
- Role-based routing (admin / teacher / student / parent)
- Admin, Teacher, Student, Parent dashboards
- Messaging / Chats (list + thread view)
- Uploads / downloads (resources)
- Assessments (create, take, score, results)
- Attendance
- Results / report cards
- Notifications
- Offline queue sync
- Mobile tab navigation (WhatsApp-style)
- Settings / profile editing
- Search / filtering / pagination
- Logout

None of these were modified, so the expectation is they behave exactly as
they did in `sts-school-app-fixed-v5` prior to this pass — because that is
exactly what's being shipped.
