import { query } from '../db/pool.js';
import type { AuthUser } from '../types/index.js';

/**
 * Every teacher-write endpoint (scores, attendance, class-records,
 * weekly-efforts) trusted `requirePerm('X.write')` alone to gate access —
 * but that permission is the same for *every* teacher in *every* school.
 * Nothing checked that the student_id being written actually belongs to the
 * calling teacher's own school (or class, when the teacher is assigned to
 * one). In practice that meant any teacher could silently overwrite any
 * other school's students' scores/attendance/remarks just by knowing (or
 * guessing/enumerating) a student_id — found live in QA Pass 4 by using a
 * primary-school teacher's login to write a bogus score onto a secondary-
 * school student.
 *
 * `termId` is optional and, when given, also enforces class locks (see the
 * `class_locks` table / academic.ts's `/class-locks` routes): a class
 * teacher (or admin) can "close" a class's records for a term, and while
 * that lock is in place every write to that class — including by the class
 * teacher herself — is rejected until it's unlocked again. Added at the
 * school owner's request as a simpler, deliberate alternative to per-record
 * conflict detection: instead of resolving collisions after the fact, staff
 * get a way to stop new writes altogether once a class's records are final
 * for the term. Every one of this function's four call sites already has a
 * term_id in hand, so this is the one place to enforce it rather than
 * duplicating the check in each route.
 *
 * Admins are unrestricted (matches every other route in the app, and means
 * an admin can always write past a lock — e.g. to make a correction the
 * class teacher isn't available to unlock for) — with one exception: a
 * soft-deleted student (see `students.deleted_at` / `deleted_by`, added
 * alongside the DELETE /students/:id soft-delete + admin-restore change) is
 * treated as not-found for every write path, including for admin. This
 * isn't a scoping gap — admin has its own dedicated restore route
 * (`POST /students/:id/restore`) precisely so a deleted record is never
 * silently written to again by accident; it must be explicitly brought back
 * first. Returns null when the write is allowed, or a {status, error} pair
 * to send back as-is when it isn't.
 */
export async function checkTeacherStudentScope(
  user: AuthUser,
  studentId: string,
  termId?: number,
): Promise<{ status: number; error: string } | null> {
  const { rows } = await query(
    'SELECT school_code, class_name, deleted_at FROM students WHERE id=$1', [studentId],
  );
  const student = rows[0];
  if (!student) return { status: 404, error: 'Student not found' };
  if (student.deleted_at) return { status: 404, error: 'Student not found' };

  if (user.role === 'admin') return null;
  if (user.role !== 'teacher') {
    // Shouldn't happen — the routes calling this are already gated by
    // requirePerm to teacher/admin only — but fail closed just in case.
    return { status: 403, error: 'Not authorized to write records for this student' };
  }

  if (student.school_code !== user.school_code) {
    return { status: 403, error: "You can't write records for a student outside your school" };
  }
  if (user.assigned_class && student.class_name !== user.assigned_class) {
    return { status: 403, error: "You can't write records for a student outside your assigned class" };
  }

  if (termId) {
    const { rows: lockRows } = await query(
      `SELECT cl.locked_at, u.full_name AS locked_by_name
       FROM class_locks cl LEFT JOIN users u ON u.id = cl.locked_by
       WHERE cl.school_code=$1 AND cl.class_name=$2 AND cl.term_id=$3`,
      [student.school_code, student.class_name, termId],
    );
    const lock = lockRows[0];
    if (lock) {
      const who = lock.locked_by_name ?? 'a class teacher';
      const when = new Date(lock.locked_at).toLocaleDateString();
      return {
        status: 403,
        error: `${student.class_name}'s records for this term were locked by ${who} on ${when}. Ask them or an admin to unlock before making changes.`,
      };
    }
  }
  return null;
}

/**
 * Added alongside the DELETE /students/:id scope fix: a teacher may delete a
 * student's record on their own (no admin approval step required) exactly
 * when they'd already be allowed to write scores/attendance for that student
 * — i.e. the student is under their class or subject care. This deliberately
 * reuses checkTeacherStudentScope() rather than duplicating the rule, so the
 * two can never drift apart. `termId` is simply left unused for this call
 * site (a delete isn't scoped to a term), so the class_locks check inside
 * checkTeacherStudentScope() is skipped for it, same as every other call
 * site that doesn't have a term_id in hand.
 */
export const checkTeacherDeleteScope = checkTeacherStudentScope;

/**
 * Gates POST /students — creating a brand-new roster entry. Distinct from
 * checkTeacherStudentScope() above because that function looks up an
 * *existing* student row to check the requester against; a create has no
 * row to look up yet, only the target school_code/class_name the request is
 * asking to create the student in.
 *
 * Found by live-testing this route directly (not caught by any unit test or
 * type-check): POST /students had no scope check at all — gated only on
 * the generic grades.write permission every teacher has — so a teacher
 * assigned to one class could create a student in a completely different
 * class, or even in the OTHER SCHOOL entirely. Confirmed via a real request:
 * a primary-school, Grade-1-only teacher successfully created student
 * records in Grade 2 and in the secondary school, both of which returned
 * 201 before this fix. That's a direct violation of the school-isolation
 * rule this app is supposed to enforce everywhere (see scope.ts's other
 * checks, all of which already refuse cross-school access one way or
 * another) — this was simply a gap none of them covered, since none of them
 * happen to run on a create with no existing row.
 *
 * Mirrors checkTeacherStudentScope()'s existing class-check shape (a
 * subject-only teacher, with no assigned_class, is not restricted by class
 * here either, consistent with how that function already treats subject
 * teachers for writes) rather than inventing a stricter rule from scratch.
 */
export function checkTeacherRosterScope(
  user: AuthUser,
  target: { school_code: string; class_name: string },
): { status: number; error: string } | null {
  if (user.role === 'admin') return null;
  if (user.role !== 'teacher') {
    return { status: 403, error: 'Not authorized to create student records' };
  }
  if (target.school_code !== user.school_code) {
    return { status: 403, error: "You can't create a student outside your own school" };
  }
  if (user.assigned_class && target.class_name !== user.assigned_class) {
    return { status: 403, error: "You can't create a student outside your assigned class" };
  }
  return null;
}

/**
 * Gates POST /learning/materials, /learning/questions, and
 * /learning/assessments. Previously these only checked `materials.write` /
 * `questions.write` / `assessments.create` — permissions every teacher has
 * regardless of which class or subject they're actually assigned to — so any
 * teacher in a school could publish a material or schedule an assessment for
 * any class, in any subject, whether or not they teach it.
 *
 * A teacher may write content when EITHER is true:
 *   - the target class_name matches their own assigned_class (a class
 *     teacher may publish for their class, in any subject — matches how
 *     class teachers already operate everywhere else in the app), OR
 *   - the target subject_id matches their own assigned_subject_id
 *     (a subject specialist may publish in their subject for ANY class in
 *     their school, "irrespective of class" — this is the case a pure
 *     class-name check would otherwise block).
 * class_name may legitimately be null (a school-wide resource, e.g. a
 * general notice) — that's fine as long as the subject matches.
 * A teacher with neither an assigned_class nor an assigned_subject_id has no
 * content scope at all and is refused outright (fail closed).
 *
 * Deliberately kept separate from checkTeacherStudentScope() (and its
 * checkTeacherDeleteScope alias above) rather than merged into it: that
 * function gates writes against a specific *student* (class-only match,
 * plus the Pass 16 soft-delete check and the Pass 12 class-lock check) —
 * a fundamentally different relationship than "may this teacher publish
 * content for this class/subject", which has no student, no soft-delete
 * concept, and no class-lock concept at all. Keeping them apart avoids
 * either function accidentally picking up checks that don't apply to it.
 */
export async function checkTeacherContentScope(
  user: AuthUser,
  target: { class_name?: string | null; subject_id?: number | string | null },
): Promise<{ status: number; error: string } | null> {
  if (user.role === 'admin') return null;
  if (user.role !== 'teacher') {
    return { status: 403, error: 'Not authorized to create content for this class or subject' };
  }
  if (!user.assigned_class && user.assigned_subject_id == null) {
    return { status: 403, error: 'Your account has no assigned class or subject to create content for' };
  }

  const classMatches   = !!target.class_name && !!user.assigned_class && target.class_name === user.assigned_class;
  const subjectMatches = target.subject_id != null && user.assigned_subject_id != null
    && String(target.subject_id) === String(user.assigned_subject_id);

  if (classMatches || subjectMatches) return null;

  return {
    status: 403,
    error: "You can only create content for your assigned class or your assigned subject",
  };
}

/**
 * Found live in QA Pass 6: GET /learning/materials and GET /learning/assessments
 * scoped results to the caller's school_code only — class_name was an *optional*
 * query filter, never enforced. A student or parent could simply omit it (which
 * every screen that calls these routes does) and see every class's materials
 * and assessments for the whole school, including other classes' exam titles
 * while still in 'draft' status. Live-verified: a JSS1 student's account saw a
 * material explicitly uploaded for SS3 only, and the title of an unpublished
 * SS3-only assessment.
 *
 * This resolves which class_name(s) a student or parent is allowed to see.
 * Returns:
 *   - null      → caller is unrestricted (admin, teacher — matches the
 *                 existing read-side behaviour for those roles; only the
 *                 write-side scope above was previously tightened)
 *   - string[]  → caller may only see rows whose class_name is one of these,
 *                 OR whose class_name is NULL (a NULL class_name is treated
 *                 as a school-wide resource meant for every class, e.g. a
 *                 general school-notice PDF)
 * A parent with multiple wards in different classes gets every ward's class
 * in the list — matches how WardContext lets them switch between children
 * without re-querying.
 */
export async function resolveViewerClassNames(user: AuthUser): Promise<string[] | null> {
  if (user.role === 'admin' || user.role === 'teacher') return null;

  if (user.role === 'student') {
    const { rows } = await query(
      'SELECT class_name FROM students WHERE user_id=$1 AND deleted_at IS NULL', [user.id],
    );
    return rows.map(r => r.class_name).filter(Boolean);
  }

  if (user.role === 'parent') {
    const { rows } = await query(
      `SELECT DISTINCT s.class_name FROM students s
       JOIN parent_wards pw ON pw.student_id = s.id
       WHERE pw.parent_id = $1 AND s.deleted_at IS NULL`,
      [user.id],
    );
    return rows.map(r => r.class_name).filter(Boolean);
  }

  return [];
}

export interface MessageableUser {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

/**
 * Found live in QA Pass 7: `GET /messages/contacts` (what the Chats/Messages
 * UI actually shows and lets the user tap) was properly scoped per role, but
 * `POST /messages` never checked `recipient_id` against that same scope for
 * anyone except `student` — `parent`, `teacher`, and `admin` sends only
 * checked `messages.write`, a permission every account of that role has
 * regardless of school. Live-verified: a `secondary`-school parent
 * (`secparent1`, whose own contacts list correctly showed only their ward's
 * class teacher) successfully sent a message directly to a `primary`-school
 * student they have no relationship to whatsoever, just by knowing/guessing
 * a user id — the exact "student/parent messaging someone they shouldn't"
 * case this pass's plan called out. A `secondary` teacher could do the same
 * to a `primary` parent. This helper is now the single source of truth for
 * "who may X message", used to build the contacts list *and* to enforce
 * `POST /messages` — closing the gap without duplicating the scoping logic
 * (mirrors `resolveViewerClassNames` above).
 *
 * Per-role scope (unchanged from the pre-existing GET /contacts behaviour —
 * this fix enforces it, it doesn't expand or narrow it, except for `admin`;
 * see below):
 *   - student → their class teacher, any subject teacher, any school admin,
 *     their own linked parent(s), AND their classmates (other students with
 *     a login, in the same class, same school). Added per product request —
 *     deliberately scoped to same-class-same-school rather than "any student
 *     anywhere": this is a minors-only app, so classmate messaging mirrors
 *     who a student already sits next to at school, not an open student
 *     directory. Cross-class or cross-school student messaging is out of
 *     scope unless explicitly asked for later.
 *   - parent  → their ward(s)' class teacher(s), any subject teacher, and
 *     any school admin — NOT the ward's other linked parent (that was never
 *     actually implemented on either branch this was reconciled from;
 *     corrected here after a Pass 19 audit — an earlier changelog entry for
 *     this file incorrectly claimed it was "already true"). Reconciled from
 *     a separate branch that widened parent reach independently of the
 *     classmate-messaging branch above. This was previously narrower (class
 *     teacher only, flagged in CHANGELOG as an open product question) but
 *     was widened per an explicit product decision to let parents reach
 *     subject teachers and admin directly instead of only relaying through
 *     the class teacher — see CHANGELOG Pass 18 for how these two
 *     independently-developed branches (student classmate messaging +
 *     parent subject-teacher/admin reach) were reconciled into a single
 *     build.
 *   - teacher → every other active user in their own school, PLUS every
 *     admin regardless of school (matches the pre-existing GET /contacts
 *     query, which was never actually staff-only despite its old comment —
 *     students and parents in-school were already includable; the
 *     cross-school admin gap was new to this file until the Pass 19 audit
 *     below, though the `RECIPIENT_ERROR.teacher` copy already implied it).
 *   - admin   → every other active user, in every school. This is a genuine
 *     behaviour change: admin's `school_code` is `NULL`, so the old
 *     `WHERE school_code=$1` contacts query matched nothing and
 *     `GET /messages/contacts` silently returned an empty list for every
 *     admin account, ever — the Admin "Messages" screen has been unusable
 *     since it was built. Global reach for admin matches `permissions.admin
 *     = ['*']` used everywhere else in the app.
 *
 * Pass 19 audit fixes (student, parent, AND teacher branches below):
 *   - All three had some form of the same NULL-comparison bug: admin rows
 *     have `school_code = NULL`, so any condition of the shape
 *     `u.school_code = <something> AND (... OR u.role = 'admin')` (or, in
 *     the teacher branch, a plain `WHERE school_code = $1`) can never
 *     actually match an admin row — `NULL = anything` is never true in
 *     SQL. In practice this meant no student, parent, or teacher could
 *     ever see an admin in their contacts, despite this doc, the
 *     `RECIPIENT_ERROR` copy in messages.ts, and the screens all promising
 *     it. Fixed in each branch by checking `role = 'admin'` as an
 *     alternative to the school_code match rather than ANDed inside it.
 *   - Neither branch filtered on `students.deleted_at` (see Pass 16's
 *     soft-delete change), so a soft-deleted student's own login could
 *     still see, and still appear as, a contact. Added `st.deleted_at IS
 *     NULL` (and `st2.deleted_at IS NULL` on the classmate subquery in the
 *     student branch) to both. Flagged as a follow-up in Pass 16 and Pass
 *     18's changelog entries; fixed here.
 *
 * Pass 20 audit fix (teacher and admin branches below):
 *   - Pass 19 only added `deleted_at` filtering to the student and parent
 *     branches above (the two that already joined `students` directly) —
 *     the teacher and admin branches select straight from `users` with no
 *     join back to `students` at all, so a soft-deleted student's login
 *     still showed up as a contact to every teacher and admin even after
 *     Pass 19. Added a `LEFT JOIN students s ON s.user_id = u.id` and an
 *     `(u.role <> 'student' OR s.deleted_at IS NULL)` condition to both —
 *     the LEFT JOIN (not a plain JOIN) matters here since these two
 *     branches list every role, not just students, and a plain JOIN would
 *     have dropped every non-student row (they have no matching `students`
 *     record to join to at all). Also added `DISTINCT` to both — `students
 *     .user_id` has no unique constraint in the schema, so if a single user
 *     were ever linked to more than one (e.g. non-deleted) students row,
 *     this LEFT JOIN would fan out and list that contact twice; the
 *     student/parent branches above already had `DISTINCT` for the same
 *     reason, these two just hadn't needed a join back to `students` before
 *     now.
 */
export async function getMessageableUsers(user: AuthUser): Promise<MessageableUser[]> {
  if (user.role === 'student') {
    const { rows } = await query(
      `SELECT DISTINCT u.id, u.username, u.full_name, u.role
       FROM students st
       JOIN users u ON u.is_active = TRUE
         AND (
           -- Admin is always reachable, in any school — checked first and
           -- OUTSIDE the school_code match below on purpose. Found while
           -- auditing this function (Pass 19): admin accounts have
           -- school_code = NULL (see the admin-branch note further down),
           -- so a join condition of the form 'u.school_code = st.school_code
           -- AND (... OR u.role = admin)' never actually matches an admin
           -- row — NULL = anything is never true in SQL. That meant no
           -- student (or, before Pass 18, any parent either) could ever
           -- actually see an admin in their contacts, despite the docs
           -- above and the UI both promising "any school admin" reach.
           u.role = 'admin'
           OR (
             u.school_code = st.school_code
             AND (
               (u.role = 'teacher' AND (u.assigned_class = st.class_name OR u.assigned_subject_id IS NOT NULL))
               OR (u.role = 'parent' AND u.id IN (
                     SELECT pw.parent_id FROM parent_wards pw WHERE pw.student_id = st.id
                   ))
               OR (
                 -- classmates: other students (with a login) in the same
                 -- class, same school. u.id <> st.user_id excludes the
                 -- caller themself. st2.deleted_at IS NULL added alongside
                 -- the admin fix above so a soft-deleted classmate's login
                 -- (not itself deactivated by a student soft-delete) stops
                 -- showing up as a contact.
                 u.role = 'student' AND u.id <> st.user_id
                 AND EXISTS (
                   SELECT 1 FROM students st2
                   WHERE st2.user_id = u.id AND st2.class_name = st.class_name AND st2.deleted_at IS NULL
                 )
               )
             )
           )
         )
       WHERE st.user_id = $1 AND st.deleted_at IS NULL
       ORDER BY u.full_name`,
      [user.id],
    );
    return rows;
  }

  if (user.role === 'parent') {
    // Widened to match the student branch above: a parent may now message
    // their ward's class teacher, any subject teacher, and any school admin
    // — not just the class teacher. See the doc comment above for why.
    const { rows } = await query(
      `SELECT DISTINCT u.id, u.username, u.full_name, u.role
       FROM students st
       JOIN parent_wards pw ON pw.student_id = st.id AND pw.parent_id = $1
       JOIN users u ON u.is_active = TRUE
         AND (
           -- Same NULL-school_code fix as the student branch above — admin
           -- must be checked outside the school_code match or it can never
           -- match (admin.school_code is NULL).
           u.role = 'admin'
           OR (
             u.school_code = st.school_code
             AND u.role = 'teacher' AND (u.assigned_class = st.class_name OR u.assigned_subject_id IS NOT NULL)
           )
         )
       WHERE st.deleted_at IS NULL
       ORDER BY u.full_name`,
      [user.id],
    );
    return rows;
  }

  if (user.role === 'teacher') {
    // Same NULL-school_code bug found and fixed in the student/parent
    // branches above (Pass 19 audit) applies here too: `RECIPIENT_ERROR
    // .teacher` ("other staff and students/parents in your own school")
    // implies admin counts as reachable "staff", but the old plain
    // `WHERE school_code = $1` matched nothing for admin rows
    // (school_code = NULL), so a teacher's contacts list never actually
    // included any admin. `role = 'admin'` is now checked as an
    // alternative to the school_code match rather than ANDed with it.
    // The LEFT JOIN + deleted_at check (added in the Pass 20 comparison
    // audit) stops a soft-deleted student's login from still showing up as
    // a contact here — it only affects rows where role = 'student'; every
    // other role's `s.deleted_at` is simply NULL (no matching students row)
    // and passes through unaffected.
    const { rows } = await query(
      `SELECT DISTINCT u.id, u.username, u.full_name, u.role
       FROM users u
       LEFT JOIN students s ON s.user_id = u.id
       WHERE u.is_active = TRUE AND u.id <> $1 AND (u.role = 'admin' OR u.school_code = $2)
         AND (u.role <> 'student' OR s.deleted_at IS NULL)
       ORDER BY u.full_name`,
      [user.id, user.school_code],
    );
    return rows;
  }

  // admin — same deleted_at fix as the teacher branch above.
  const { rows } = await query(
    `SELECT DISTINCT u.id, u.username, u.full_name, u.role
     FROM users u
     LEFT JOIN students s ON s.user_id = u.id
     WHERE u.is_active = TRUE AND u.id <> $1
       AND (u.role <> 'student' OR s.deleted_at IS NULL)
     ORDER BY u.full_name`,
    [user.id],
  );
  return rows;
}
