// Pure helpers for lesson pictures, kept free of React Native imports so they can be
// unit-tested without a device (tests/lesson-image.test.mts).

export interface LessonAssetLike {
  caption?: string | null;
  alt_text?: string | null;
}

// Screen readers get the full description (alt_text) when the lesson supplies one,
// otherwise the visible caption, otherwise a generic label. The caption stays on screen.
export function lessonImageLabel(asset: LessonAssetLike): string {
  const alt = (asset.alt_text ?? '').trim();
  if (alt) return alt;
  const cap = (asset.caption ?? '').trim();
  return cap || 'Lesson illustration';
}
