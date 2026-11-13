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

The full monorepo audit still reports four high-severity findings in the Expo SDK 56 dependency tree. The affected locked packages are version-pinned in CI:

| Package | Locked version | Context |
|---|---:|---|
| `expo` | 56.0.24 | Mobile Expo SDK |
| `@expo/cli` | 56.1.27 | Expo build/development CLI |
| `image-size` | 1.2.1 | Expo asset/toolchain dependency |
| `zod` | 3.25.76 | Expo toolchain dependency; backend uses its own 4.6.7 installation |

The audit indicates the Expo-related fixes require moving to Expo 58.0.25. This is a coordinated mobile SDK/native-module migration and must not be forced as part of a backend-only dependency update. The exception is deliberately narrow: CI permits only these exact package versions, fails on any critical finding, fails on any additional high finding, and independently requires the backend production audit to be clean.

**Removal condition:** remove this exception after a separate Expo SDK 58 migration has updated the compatible React Native/Expo modules and passed native build and device smoke tests. Do not widen the version allowlist to accommodate new advisories.

## Current audit status

- Critical findings: 0 after non-forced lockfile remediation.
- Backend production moderate/high/critical findings: 0.
- Remaining full-tree findings: Expo SDK 56 toolchain exception above, plus moderate/low findings tracked for the coordinated mobile dependency upgrade.
