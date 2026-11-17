# Checkpoint — BSEC-028

- **Task ID:** BSEC-028
- **Title:** Secure material upload, preview and download paths
- **Status:** merged; focused verification passed
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Implementation PR:** #934 (merged)
- **Verification fixture PR:** #939 (merged)
- **CI follow-up:** #940 (merged)
- **Verification:** The dedicated Backend file upload, preview and download security workflow passed on PR #939. Related backend learning-content reference scope, Android mobile readiness, SS1 Agricultural Science, SS1/SS23 package integrity and JSS3 workflows also passed on the follow-up verification sequence (#939/#943).
- **Implementation:** The repository has no public multipart/binary upload endpoint. The material upload UI submits an external URL to POST /learning/materials; lesson image assets are imported through the controlled attachTopicAssets CLI. The implementation hardens these real surfaces rather than inventing a new upload API.
- **Material URL controls:** Only supported material types and HTTPS URLs with public DNS hostnames are accepted; IP literals, local/internal suffixes, DNS-to-IP alias services, userinfo and non-443 ports are rejected. Legacy unsafe URLs are not returned as openable/downloadable links.
- **Mobile download controls:** Downloads are limited to supported PDF/Word extensions, sanitized filenames, a 25 MB size cap, and post-download size/MIME verification before sharing.
- **Ownership and tenant scope:** School-bound administrators are pinned to their school for material creation, listing, deletion and topic-asset preview/download. Teachers can delete only their own material in their assigned school.
- **Topic asset ingestion:** Manifest rows, file paths, symlink resolution, MIME signatures, SVG active content, SHA-256 and file size are validated before writes and again before delivery.
- **Preview/download delivery:** Byte reads repeat school/topic/class visibility predicates; stored bytes are checked against recorded MIME and SHA-256. Protected responses use private no-store caching, nosniff and safe inline/SVG sandbox headers.
- **Production impact:** No production database or files were accessed or changed.
- **Remaining:** No outstanding BSEC-028 implementation or focused verification blockers.
