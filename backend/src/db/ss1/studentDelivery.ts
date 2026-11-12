import { loadPackages } from './loader.js';
import type { SubjectPackage } from './subjectPackageSchema.js';

export type StudentSs1Lesson = SubjectPackage['lessons'][number] & {
  subject_slug: string;
  canonical_subject: string;
};

const packages = loadPackages();
const normalize = (value: unknown) => String(value ?? '').replace(/\\s+/g, ' ').trim().toLocaleLowerCase('en');

function isStudentDeliverable(lesson: SubjectPackage['lessons'][number]): boolean {
  return lesson.state.content_approval === 'APPROVED' &&
    Boolean(lesson.state.approval_reference?.trim()) &&
    lesson.state.implementation === 'IMPLEMENTED' &&
    lesson.state.verification === 'VERIFIED' &&
    Boolean(lesson.state.verification_reference?.trim()) &&
    lesson.provenance.length > 0 &&
    lesson.provenance.every(source => source.reuse_status === 'PERMITTED');
}

/** Expose only individually approved, implemented, verified and rights-cleared lessons. */
export function listStudentSs1Lessons(subjectName?: string): StudentSs1Lesson[] {
  const expectedSubject = subjectName ? normalize(subjectName) : null;
  return packages.flatMap(subjectPackage => {
    if (expectedSubject && normalize(subjectPackage.canonical_subject) !== expectedSubject) return [];
    return subjectPackage.lessons.filter(isStudentDeliverable).map(lesson => ({
      ...lesson,
      subject_slug: subjectPackage.subject_slug,
      canonical_subject: subjectPackage.canonical_subject,
    }));
  });
}

export function getStudentSs1Lesson(lessonId: string): StudentSs1Lesson | null {
  return listStudentSs1Lessons().find(lesson => lesson.id === lessonId) ?? null;
}

export function isStudentDeliverableSs1Lesson(lesson: SubjectPackage['lessons'][number]): boolean {
  return isStudentDeliverable(lesson);
}
