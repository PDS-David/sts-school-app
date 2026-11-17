#!/usr/bin/env bash
set -euo pipefail

mkdir -p artifacts
adb wait-for-device

# Wait until Android's package manager is responsive before attempting install.
package_manager_ready=0
for attempt in $(seq 1 60); do
  if adb shell cmd package list packages >/dev/null 2>&1; then
    package_manager_ready=1
    break
  fi
  sleep 2
done

if [ "$package_manager_ready" -ne 1 ]; then
  echo "Android package manager did not become ready."
  adb logcat -d -t 5000 > artifacts/android-emulator-logcat.txt || true
  exit 1
fi

installed=0
for attempt in $(seq 1 4); do
  if adb install -r mobile/android/app/build/outputs/apk/debug/app-debug.apk; then
    installed=1
    break
  fi
  adb reconnect offline || true
  adb wait-for-device
  sleep 5
done

if [ "$installed" -ne 1 ]; then
  echo "APK install failed after four attempts."
  adb logcat -d -t 5000 > artifacts/android-emulator-logcat.txt || true
  exit 1
fi

adb shell am force-stop ng.edu.sowtheseed.school
adb shell monkey -p ng.edu.sowtheseed.school 1

for attempt in $(seq 1 30); do
  if adb shell pidof ng.edu.sowtheseed.school >/dev/null 2>&1; then
    adb logcat -d -t 3000 > artifacts/android-emulator-logcat.txt
    exit 0
  fi
  sleep 1
done

echo "Installed app did not remain running after launch."
adb logcat -d -t 5000 > artifacts/android-emulator-logcat.txt || true
exit 1
