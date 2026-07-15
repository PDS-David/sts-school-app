# Merge Report — sts-school-app

**Date:** 2026-07-08
**Inputs:** `sts-school-app-fixed-v5` (Version A) vs `sts-school-app-whatsapp-redesign` (Version B)

## Headline finding

**Version A already contains the entire WhatsApp redesign from Version B, fully wired up, plus additional fixes that post-date Version B.** This is not a case of two divergent branches needing feature-by-feature reconciliation — B is an earlier, partial export of the same redesign work that was already completed and improved upon in A. File timestamps preserved in both archives confirm the direction: every file that differs between A and B was last touched in A *after* it was touched in B.

Concretely:

- **97 files in A, 83 in B.**
- **81 files exist in both.** Of those, **74 are byte-identical.**
- **Only 7 files differ**, and in every single one, A is a strict superset of B (same feature, more complete) — never the reverse. No file in B contains logic or UI that is absent from A.
- **16 files exist only in A**: `backend/.env.example`, `backend/package.json`, `backend/tsconfig.json`, `backend/src/index.ts`, `backend/src/middleware/auth.ts`, `backend/src/routes/messages.ts`, `backend/src/types/index.ts`, `backend/src/db/importSecondTerm.ts` (+ its data file), `mobile/app.json`, `mobile/package.json`, `mobile/tsconfig.json`, `mobile/babel.config.js`, `mobile/index.js`, `mobile/assets/icon.png`, `mobile/src/offline/index.ts`. **This is not missing B functionality** — Version B's own `NOTES_WHATSAPP_REDESIGN.md` explicitly states these files "were missing from the uploaded archive" it was given and were out of scope for that pass. They are ordinary, unmodified project files that simply weren't included in the B zip.
- **2 files exist only in B**: `FIXES_LOG.md` and `NOTES_WHATSAPP_REDESIGN.md`. These are the previous engineer/AI's own working notes, not code. Archived for the record under `docs/ARCHIVED_redesign-branch-*.md` in the final project.

## Phase 1 — File inventory

| Category | Count |
|---|---|
| Only in A | 16 |
| Only in B | 2 (docs only) |
| In both, identical | 74 |
| In both, differ | 7 |

## Phase 2 — Feature matrix (condensed)

| Area | Version A | Version B |
|---|---|---|
| Auth (login/refresh/expiry enforcement) | Full — `middleware/auth.ts` present, DB-checked expiry | File not in archive; described in B's own notes as not actually changed there |
| Admin: link/unlink student login, link/unlink parent | Present (`admin.ts`, `students.ts`, `StudentDetailScreen.tsx`) | **Missing** — routes and UI both absent |
| Admin: subject delete restricted to admin role | Enforced (`AcademicMgmtScreens.tsx`) | **Not enforced** — any authenticated user could delete a subject |
| JWT secret safety | Hard-fails startup in production if secrets are left at placeholder values (`utils/jwt.ts`) | No such check — placeholder secrets would silently work in prod |
| `schema.sql` seed admin | Seeds via `db/seed.ts` (real bcrypt hash); comment explains why the raw INSERT was removed | Still contains a raw `INSERT` with a non-functional placeholder bcrypt hash — the exact footgun A's own comment warns about |
| WhatsApp-style navigation (tab bars, chats, FAB, notifications bell) | Present, identical to B where B has it | Present |
| Offline queue re-export (`offline/index.ts`) | Present | **Missing** — would break `api/client.ts` and `MessagesScreen.tsx` imports at build time |
| `OfflineBanner` wired into `App.tsx` | Present | Missing (B's `App.tsx` is a documented best-effort reconstruction, and its own header says to diff it against the real file) |
| Configurable API base URL (`expo.extra.apiUrl`) with dev warning | Present | Hardcoded `10.0.2.2` only |
| Teacher "Enter Scores" / "Subjects" tiles wired into Classes tab | Present | Missing from `TeacherClassesScreen.tsx` and `TeacherTabs.tsx` |
| Inline "add subject" from Score Entry screen | Present | Missing |
| Branding: combined-logo icon/splash/adaptive-icon | Present (`icon.png` also present) | Present for splash/adaptive-icon (byte-identical to A); `icon.png` itself absent from the archive |

Every other feature area in the original request's checklist (messaging, resources, uploads, assessments, attendance, results, notifications, dashboards, theming, etc.) is identical between the two where both contain the file, and unaffected by this merge.

## Phase 3 — Merge plan actually executed

Per-file decision, applied uniformly:

- **7 differing files → Keep Version A.** Reasons, per Rule 3 (more complete / more secure / better engineered): see table above and the inline diffs reviewed during this pass. In no case did B contain something worth pulling forward.
- **74 identical files → no action needed.**
- **16 A-only files → kept as-is** (they were never in dispute; B simply didn't include them).
- **2 B-only files → archived as documentation** under `docs/ARCHIVED_redesign-branch-*.md`, not merged as code (they're prose notes describing work that's already reflected in A).

No code from Version B was pulled into Version A. There was nothing to pull — this merge is a verification-and-package pass, not a feature reconciliation.

## Conflicts resolved

None required resolution in the traditional sense (no file had incompatible logic that needed hand-merging). The "conflicts" were all cases of B lagging A, resolved by keeping A.

## Features preserved

All features in Version A, in full — see feature matrix above.

## Features improved

None beyond what A already had; A was already the more advanced version going into this pass.

## Features discarded

None. Nothing in B was discarded that wasn't already superseded in A.
