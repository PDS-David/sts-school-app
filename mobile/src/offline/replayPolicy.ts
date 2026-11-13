/** Returns whether a failed request may be added to the offline outbox. */
export function shouldEnqueueOfflineWrite(
  request: { _skipOfflineQueue?: boolean } | undefined,
): boolean {
  return request?._skipOfflineQueue !== true;
}
