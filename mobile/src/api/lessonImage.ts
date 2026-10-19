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

// Width, in layout points, at which the enlarged view draws a picture. The enlarged view
// scrolls both ways, so the picture can be wider than the screen. It is never drawn
// narrower than the inline picture, and never more than `maxMagnify` times the inline
// width, so a very wide score is not stretched past the point of usefulness.
export function enlargedWidth(nativeWidthPx: number, inlineWidth: number, maxMagnify = 3): number {
  if (!(inlineWidth > 0)) return 0;
  if (!(nativeWidthPx > 0)) return inlineWidth * 2;
  return Math.max(inlineWidth, Math.min(nativeWidthPx, inlineWidth * maxMagnify));
}
