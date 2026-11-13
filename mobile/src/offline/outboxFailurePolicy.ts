/**
 * Only discard client errors that are definitively invalid requests.
 * Keep auth, permission and conflict failures queued for re-authentication
 * or explicit resolution; dropping those silently loses the user's work.
 */
export function shouldDiscardOutboxFailure(status: number | undefined): boolean {
  return status !== undefined
    && status >= 400
    && status < 500
    && status !== 401
    && status !== 403
    && status !== 409;
}
