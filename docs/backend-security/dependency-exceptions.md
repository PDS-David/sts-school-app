# Dependency security exceptions

## BSEC-007 — backend production dependencies

**Review date:** 2026-11-13  
**Scope:** backend production dependency tree  
**Decision:** no unresolved moderate-or-higher advisories remain in the backend production dependency tree after the BSEC-007 upgrades. The CI gate runs `npm audit --workspace=backend --omit=dev --audit-level=moderate` and fails on any such finding.

### Remediated backend packages

- Multer upgraded from 1.x to 2.5.0.
- Nodemailer upgraded to 10.5.0, using the package's maintained TypeScript declarations.
- SheetJS upgraded from the vulnerable npm-registry 0.18.5 release to the official SheetJS CDN 0.20.3 tarball.
- Backend Zod upgraded to 4.6.7.
- The existing backend source compiles with the upgraded dependencies.
- Safe lockfile updates also patched the critical `proxy-addr` and `shell-quote` advisories.

### Time-limited mobile toolchain exception

The full monorepo audit still reports four high-severity findings in the Expo SDK 56 dependency tree. The high findings include the image-size JXL/HEIF and ICNS parser denial-of-service advisories (GHSA-5p2g-fcmc-qvqq and GHSA-w3rx-r6r6-pgpr) and the Zod oversized-collection memory-exhaustion advisory (GHSA-mrhx-c7xc-m3w5). The remaining Expo CLI/SDK high findings are in the same SDK 56 dependency chain. The affected locked packages are version-pinned in CI:

| Package | Locked version | Context |
|---|---:|---|
| `expo` | 56.0.24 | Mobile Expo SDK |
| `@expo/cli` | 56.1.27 | Expo build/development CLI |
| `image-size` | 1.2.1 | Expo asset/toolchain dependency |
| `zod` | 3.25.76 | Expo toolchain dependency; backend uses its own 4.6.7 installation |

The audit indicates the Expo-related fixes require moving to Expo 58.0.25. This is a coordinated mobile SDK/native-module migration and must not be forced as part of a backend-only dependency update. The exception is deliberately narrow: CI permits only these exact package versions, fails on any critical finding, fails on any additional high finding, and independently requires the backend production audit to be clean.

**Removal condition:** remove this exception after a separate Expo SDK 58 migration has updated the compatible React Native/Expo modules and passed native build and device smoke tests. Do not widen the version allowlist to accommodate new advisories.

### Remaining moderate/low Expo SDK 56 findings

The full audit also reports these moderate findings in the same Expo 56 toolchain: `@expo/config` 56.0.15, `@expo/config-plugins` 56.0.17, `@expo/fingerprint` 0.19.10, `@expo/inline-modules` 0.0.16, `@expo/metro-config` 56.0.20, `@expo/prebuild-config` 56.0.24, `expo-sharing` 56.0.27, `expo-splash-screen` 56.0.16, `glob` 13.0.7 and `minimatch` 10.2.6. Two low findings remain in `@expo/local-build-cache-provider` 56.0.12 and `deepmerge` 4.3.1. These are tracked with the same Expo SDK migration; they are not in the backend production workspace.

## Current audit status

- Critical findings: 0 after non-forced lockfile remediation.
- Backend production moderate/high/critical findings: 0.
- Remaining full-tree findings: 4 high, 10 moderate and 2 low, all in the reviewed Expo SDK 56 toolchain dependency chain above.
