# Mobile App — Expo SDK 51 → 56 Upgrade (2026-06-30)

## Root cause of original bug
`TypeError: _ExpoFontLoader.default.getLoadedFonts is not a function`

Project was pinned to Expo SDK 51 (~mid-2024). Expo Go from the Play Store
only supports the current SDK (56 as of this date) and does not support
arbitrary old SDKs. Running an SDK-51 JS bundle inside a current Expo Go
client produced a native/JS module mismatch on `expo-font`, surfacing as
this cryptic error instead of a clean "incompatible SDK" message.

## Fix applied
Upgraded `mobile/package.json` to Expo SDK 56 and re-aligned every
Expo-managed dependency to the versions bundled with that SDK (sourced from
`expo/bundledNativeModules.json` directly, since `npx expo install --fix`
could not reach Expo's API from this sandboxed environment — domain not
allow-listed). After the fix, `npm ls expo-font` showed a single deduped
`expo-font@56.0.7` across the whole tree (previously the project had no
explicit pin at all, leaving it to npm's resolution at install time).

### Version changes
| Package | Before | After |
|---|---|---|
| expo | ~51.0.0 | ~56.0.0 |
| expo-status-bar | ~1.12.1 | ~56.0.4 |
| expo-secure-store | ~13.0.2 | ~56.0.4 |
| expo-document-picker | ~12.0.2 | ~56.0.4 |
| react | 18.2.0 | 19.2.3 |
| react-native | 0.74.5 | 0.85.3 |
| react-native-screens | ~3.31.1 | 4.25.2 |
| react-native-safe-area-context | 4.10.5 | ~5.7.0 |
| @expo/vector-icons | ^14.0.2 | ^15.0.2 |
| @react-native-async-storage/async-storage | 1.23.1 | 2.2.0 |
| @react-navigation/native | ^6.1.17 | ^7.3.4 |
| @react-navigation/native-stack | ^6.9.26 | ^7.17.6 |
| @react-navigation/bottom-tabs | ^6.5.20 | ^7.18.3 |

react-navigation was bumped from v6 (officially unsupported, per npm
deprecation warnings) to v7 for React 19 compatibility.

## Other bugs found and fixed during static verification
These were pre-existing and unrelated to the SDK upgrade, but were caught
during `tsc --noEmit` and `expo export` verification before this commit:

1. **Missing dependency**: `@react-native-picker/picker` was imported in 7
   screens (`AdminUsersScreen`, `AttendanceScreen`, `CreateAssessmentScreen`,
   `ExportExcelScreen`, `MaterialsScreen`, `ScoreEntryScreen`,
   `WeeklyEffortsScreen`, `AdminExtraScreens`) but was never declared in
   `package.json`. Added `@react-native-picker/picker@2.11.4`.
2. **Type bug**: `CreateAssessmentScreen.tsx` filtered questions by
   `q.subject_id`, but the local `Question` interface didn't declare that
   field. Added `subject_id?: number | string` to the interface.
3. **react-navigation v7 breaking change**: `Stack.Navigator` now requires
   an `id` prop. Added `id={undefined}` in `src/App.tsx` (single-navigator
   apps can pass `undefined` safely).
4. Added `tsconfig.json` (extends `expo/tsconfig.base`) and `typescript` /
   `@types/react` devDependencies — the project used `.tsx` everywhere but
   had no TypeScript tooling declared at all.

## Verification performed
- `npx tsc --noEmit` → 0 errors
- `npx expo export --platform android` → bundled cleanly, 921 modules, no
  runtime/import errors, all `@expo/vector-icons` font assets resolved
- `npm ls expo-font` → confirmed single deduped version across the tree

## Next steps for you
1. Unzip, `cd mobile && npm install --legacy-peer-deps`
2. `adb reverse tcp:8081 tcp:8081` (as before, for the emulator)
3. `npx expo start -c`
4. Open in the **current** Expo Go app — should no longer throw the font
   error.
5. Smoke-test screens that use `Picker` (Admin/Attendance/Assessment/Score
   screens) since that dependency was silently missing before.
6. The `--legacy-peer-deps` flag was needed because some peer ranges in the
   tree haven't caught up to React 19 yet; worth revisiting as packages
   update.
