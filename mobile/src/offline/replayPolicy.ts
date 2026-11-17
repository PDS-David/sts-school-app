/** Returns whether a failed request may be added to the offline outbox. */
export function shouldEnqueueOfflineWrite(
  request: { _skipOfflineQueue?: boolean } | undefined,
): boolean {
  return request?._skipOfflineQueue !== true;
}

/** Axios account-switch cancellations must never be queued as offline writes. */
export function isAccountSwitchCancellation(error: { code?: string } | undefined): boolean {
  return error?.code === 'ERR_CANCELED';
}
