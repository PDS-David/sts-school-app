# A2 — phone visual acceptance: STATUS = NOT PERFORMED (blocked, not passed)

Base master `02e596e8e53e1beea7a4b4b0aa52ba9308638a4d`, 20 October 2026.

No authorised staging app/session or physical phone was available to the worker, so **no device observation was made, no screenshots exist, and A2 must not be marked passed.** No app code was changed. No production change.

## What was done (static review only)

`mobile/src/screens/TopicDetailScreen.tsx` `LessonImage`: images load with a Bearer header, `resizeMode="contain"` (no crop), height from the picture's own ratio, `accessibilityLabel` from `alt_text` (else caption), caption shown, `onError` shows "could not be loaded" + "Retry pictures", asset-list failure shows a separate retry message. Pictures >= `WIDE_PICTURE_PX` (1500 px) scroll sideways at 0.45 scale; **no pinch-zoom or tap-to-expand exists.** GIFs are passed through unchanged.

Source pixel widths of the A2 targets (all < 1500, so none uses the sideways scroll; all are shrunk to phone width):

| Target | Asset key / file | Size | Lesson identity |
|---|---|---|---|
| Business account table | `V1-DE-02-example1-capital-cash` (png) | 1080x855 | Business Studies, 1st Term, order 5, DOUBLE ENTRY BOOK KEEPING |
| Math figure | `V2-MATH-M1-F03` `v2-m1-binary-arithmetic-layouts.png` | 1142x673 | Mathematics, 1st Term, BINARY NUMBERS, order 2 |
| Science eye | `BS-EYE` `bs-eye.jpeg` (also `BS-EYE-SUP`) | 334x250 | Basic Science 2nd Term, LIGHT ENERGY order 5 (and SUP-BS-LIGHT-V3, order 16) |
| Corrected prism | `BS-PRISM-CORRECTED` (also `-SUP`) | 900x550 | same two lessons; `BS-PRISM-SOURCE` must NOT appear (displayed=false) |
| BT electron image | `BT-02` `image1.png` | 1280x921 | Basic Technology, order 12, basic Electronics |
| BT GIFs | `BT-10` image6.gif (58 frames), `BT-12` image8.gif (89), `BT-16` image12.gif (66) | 578x484, 742x582, 594x748 | Basic Technology, order 15, machine motion |

Hypotheses to test on the device (NOT confirmed defects): small text in the Business table and BT-02 once scaled to phone width with no zoom; the 334 px eye image upscaled and soft; GIF animation on both Android and iOS with an Authorization header.

## Concrete setup checklist (needed before A2 can run)

1. Staging backend + staging PostgreSQL (never production) loaded with the integrated JSS3 capture from a recorded commit (record the SHA; expected 313 originals + 170 supplements = 483).
2. Apply the V1/V2/V3 asset manifests to staging and confirm `topic_assets.alt_text` and `assessments.content_fingerprint` exist there.
3. A staging build of the app (Expo build or dev client) pointing `BASE_URL` at staging; record build SHA.
4. A student account in the correct class/term with access to Business, Mathematics, Basic Science and Basic Technology JSS3 lessons; a second account in another class to confirm cross-class rejection.
5. A physical phone (record model, OS, viewport/pixel ratio), plus screen reader (TalkBack/VoiceOver) enabled for the label check.
6. For each target above record: lesson/asset IDs, screenshots, no-crop yes/no, readable yes/no, caption, spoken description, and for GIFs whether animation plays. Also test retry: disable network or break the asset URL, confirm the error text and that "Retry pictures" recovers.
7. If text is unreadable or an image cannot be inspected, fix the app (e.g. tap-to-expand/pinch-zoom), add a test beside `tests/lesson-image.test.mts`, and re-observe.

Result table (to be filled in by the observer): all rows currently **NOT OBSERVED**.
