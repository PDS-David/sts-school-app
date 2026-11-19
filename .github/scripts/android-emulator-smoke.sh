#!/usr/bin/env bash
set -euo pipefail

mkdir -p artifacts

# Always preserve diagnostics, including when a bounded ADB command fails.
capture_emulator_diagnostics() {
  timeout 20s adb devices -l > artifacts/android-emulator-devices.txt 2>&1 || true
  timeout 20s adb logcat -d -t 5000 > artifacts/android-emulator-logcat.txt 2>&1 || true
}
trap capture_emulator_diagnostics EXIT

adb_call() {
  timeout 30s adb "$@"
}

echo "Waiting up to 90 seconds for the Android emulator..."
if ! timeout 90s adb wait-for-device; then
  echo "Android emulator did not become available within 90 seconds."
  exit 1
fi

# Wait up to 120 seconds for Android's package manager to become responsive.
package_manager_ready=0
for attempt in $(seq 1 60); do
  if adb_call shell cmd package list packages >/dev/null 2>&1; then
    package_manager_ready=1
    break
  fi
  sleep 2
done

if [ "$package_manager_ready" -ne 1 ]; then
  echo "Android package manager did not become ready within 120 seconds."
  exit 1
fi

apk_path="mobile/android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -s "$apk_path" ]; then
  echo "Expected debug APK is missing or empty: $apk_path"
  exit 1
fi

installed=0
for attempt in $(seq 1 3); do
  echo "APK installation attempt $attempt of 3..."
  if adb_call install -r "$apk_path"; then
    installed=1
    break
  fi
  adb_call reconnect offline || true
  timeout 45s adb wait-for-device || true
  sleep 5
done

if [ "$installed" -ne 1 ]; then
  echo "APK installation failed after three bounded attempts."
  exit 1
fi

adb_call shell am force-stop ng.edu.sowtheseed.school
adb_call shell monkey -p ng.edu.sowtheseed.school 1

# Verify that the application process starts within 30 seconds.
for attempt in $(seq 1 30); do
  if adb_call shell pidof ng.edu.sowtheseed.school >/dev/null 2>&1; then
    echo "Android emulator smoke test passed."
    exit 0
  fi
  sleep 1
done

echo "Installed app did not remain running after launch."
exit 1
