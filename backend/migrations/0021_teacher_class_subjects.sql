-- Explicit per-class subject grants for subject-specialist teachers.
-- Preserve every existing effective subject/class combination during rollout.
CREATE TABLE IF NOT EXISTS teacher_class_subjects (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, class_id, subject_id)
);

CREATE INDEX IF NOT EXISTS teacher_class_subjects_class_subject_idx
  ON teacher_class_subjects (class_id, subject_id);

INSERT INTO teacher_class_subjects (user_id, class_id, subject_id)
SELECT u.id, c.id, ts.subject_id
FROM users u
JOIN teacher_subjects ts ON ts.user_id=u.id
CROSS JOIN LATERAL unnest(COALESCE(u.assigned_class_names, ARRAY[]::text[])) AS assigned(class_name)
JOIN classes c ON c.school_code=u.school_code AND c.name=assigned.class_name
WHERE u.role='teacher' AND u.assigned_class IS NULL
ON CONFLICT DO NOTHING;
