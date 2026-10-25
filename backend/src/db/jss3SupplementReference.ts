/** One canonical representation for imported and revised supplement teaching. */
export interface SupplementReferenceLesson {
  title: string; origin: string; gapIds: string[]; body: string;
  sources: { title: string; url: string }[];
}
export function supplementReference(lesson: SupplementReferenceLesson): string {
  return `${lesson.title}\n\n${lesson.origin}\nCoverage: ${lesson.gapIds.join(', ')}\n\n${lesson.body}\n\nReference resources (not the original school textbook):\n${lesson.sources.map(s => `${s.title}: ${s.url}`).join('\n')}`;
}
