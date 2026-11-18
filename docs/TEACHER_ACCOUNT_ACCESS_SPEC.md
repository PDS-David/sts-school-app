# Teacher Account and Access-Control Specification

Status: implementation specification; not a production change.
Scope: teacher identity, assignment, authentication, and authorization requirements.
Coordination: the reporting-system implementation is being handled separately. This document does not change reporting routes, reporting tables, report UI, or reporting workflows.

## 1. Teacher account types

Teacher accounts must use distinct authorization roles. A username must never determine or grant permissions by itself.

| Account type | Username convention | Assignment model |
|---|---|---|
| Class teacher | Class name, e.g. `Pry1`, `JSS1`, `SS1` | One explicitly assigned class in one school |
| Subject teacher | Subject name, e.g. `Mathematics`, `English` | Explicit subject assignment(s) across one or more classes in one school |

The role is stored on the account and checked by the backend. Do not infer a role from the username.

## 2. School isolation and username uniqueness

- A teacher belongs to exactly one school.
- A teacher cannot switch to, query, or access another school.
- Class and subject names can repeat between Primary and Secondary. Therefore, a username alone is not a safe global account key.
- Teacher login must include school context (for example, a school selector on the login screen) or an equivalent unambiguous school-qualified identifier.
- Enforce uniqueness on the normalized pair `(school_code, username)`, not on username alone, if the existing identity model supports this safely.
- Normalize usernames consistently (trim whitespace and use case-insensitive comparison).
- Never use a supplied school header or request parameter to override the teacher's school assignment.

## 3. Class-teacher permissions

A class teacher may access class-level functions only for the single class explicitly assigned to that account, within the teacher's school.

A class teacher must not gain subject-teacher permissions merely because they can see a class. Subject-specific mark entry must still be governed by the appropriate subject assignment policy.

## 4. Subject-teacher permissions

A subject teacher may be assigned to multiple classes, but only within the teacher's own school.

Authorization must use explicit assignment records that identify at least:
- teacher account ID;
- school code;
- subject ID;
- class ID;
- active/inactive status.

For every read or write request, the backend must verify that the authenticated account has an active assignment for the requested school, class, and subject. Do not trust class IDs, subject IDs, school headers, or role values supplied by the client.

The subject teacher may:
- list only classes assigned to them for their subject;
- view only the student roster needed for those assignments;
- view and enter marks only for the assigned subject and assigned classes;
- see only the minimum student details required for marking: student name, admission number, and class.

The subject teacher must not:
- access full student profiles, parent/guardian details, contact details, health data, or unrelated student records;
- view or enter marks for any unassigned subject or class;
- access class-wide records or class-teacher-only functions;
- enumerate students or records in another school;
- widen access by changing URL parameters, request bodies, query parameters, or headers.

## 5. Student roster response

Subject-teacher roster endpoints must return a deliberately limited projection containing only:
- student ID (internal identifier needed for mark submission);
- student name;
- admission number;
- class name or class identifier.

Do not serialize the full Student model and attempt to hide fields in the frontend. The backend response itself must omit unrelated profile fields.

## 6. Authentication and four-digit numeric passwords

The requested initial credential format is a four-digit numeric password. This is a low-entropy credential and must be treated as a PIN, not as strong password security.

Required safeguards:
- store only a modern password hash (Argon2id or bcrypt with an appropriate cost); never store or log plaintext PINs;
- rate-limit failed attempts by both account identity and source IP;
- apply progressive delays and temporary lockouts;
- use generic login errors that do not reveal whether a username exists;
- provide an administrator-controlled reset process and audit credential resets;
- require HTTPS and secure session/token handling;
- never put passwords in import spreadsheets, source control, logs, or chat messages.

A stronger credential or mandatory PIN change at first sign-in is preferable. If the four-digit format remains mandatory, the rate limits and lockout controls are not optional.

## 7. Backend authorization requirements

- Enforce authorization on every API route, not only in navigation or UI visibility.
- Fetch current role, school, and active assignments from trusted server-side data.
- Deny by default when assignments are missing, inactive, ambiguous, or inconsistent.
- Validate both read and write operations independently.
- Prevent object-level IDOR by checking assignment ownership for every requested student, class, subject, score, and report object.
- Ensure export, search, overview, dashboard, and aggregate endpoints apply the same scope restrictions.
- Do not grant subject teachers class-teacher capabilities through a shared broad teacher role.

## 8. Required automated security tests

At minimum, test:
1. Subject teacher assigned to several classes can access each assigned class.
2. The same teacher is denied an unassigned class in the same school.
3. The teacher is denied every class and record in the other school.
4. The teacher sees only name, admission number, and class in roster responses.
5. The teacher can read/write marks for the assigned subject only.
6. The teacher is denied another subject even when it belongs to an assigned class.
7. A class teacher is limited to the one assigned class and does not inherit subject-teacher or global privileges.
8. Inactive or deleted assignments immediately stop granting access.
9. Changing IDs, query parameters, request bodies, or school headers cannot expand access.
10. Search, overview, export, aggregate, and report-related endpoints cannot leak out-of-scope data.
11. Repeated incorrect PIN attempts trigger throttling and temporary lockout.
12. Duplicate usernames across schools resolve only with the correct school context.

## 9. Integration boundary with the reporting work

The other agent's reporting implementation must remain undisturbed while in progress. Before integrating these rules:
- identify the reporting agent's final route and data contracts;
- map teacher assignments to those contracts;
- add authorization checks at the backend boundary without replacing or duplicating reporting logic;
- run the security tests above against every relevant endpoint;
- perform a production read-only audit before any production data change.

No production teacher accounts or assignment records should be created until the schema, login identity strategy, and account-provisioning process are agreed and tested.

## 10. Open identity detail to confirm before login implementation

Because `Pry1` or `Mathematics` may exist in both schools, teacher login needs a school context. Recommended approach: teacher selects Primary or Secondary at sign-in; the backend then resolves the username only within that school. The selected school is not trusted as authorization—the authenticated account's stored school remains authoritative.
