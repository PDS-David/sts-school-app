export type ReadinessRequest = (url: string, timeoutMs: number) => Promise<unknown>;

export const BACKEND_READINESS_FRESHNESS_MS = 10 * 60 * 1000;
export const BACKEND_COLD_START_TIMEOUT_MS = 90 * 1000;

/**
 * Avoid sending a user operation to a sleeping Render Free API.
 *
 * The first request after the freshness window waits for the public readiness
 * endpoint (which also verifies PostgreSQL) before the real API request is
 * dispatched. Concurrent callers share one probe. A failed probe is never
 * cached, and network/availability failures can invalidate a previous result.
 *
 * This improves cold-start recovery UX; it does not keep a Free instance awake
 * when no clients are making requests.
 */
export function createBackendReadinessGate(
  request: ReadinessRequest,
  now: () => number = Date.now,
  freshnessMs = BACKEND_READINESS_FRESHNESS_MS,
  timeoutMs = BACKEND_COLD_START_TIMEOUT_MS,
) {
  let lastReadyAt: number | null = null;
  let inFlight: Promise<void> | null = null;

  function ensureReady(baseUrl: string): Promise<void> {
    if (lastReadyAt !== null && now() - lastReadyAt < freshnessMs) {
      return Promise.resolve();
    }
    if (inFlight) return inFlight;

    const url = baseUrl.replace(/\/+$/, '') + '/health/ready';
    const pending = request(url, timeoutMs).then(() => {
      lastReadyAt = now();
    });
    inFlight = pending;

    // Attach both outcomes to clear the shared promise without creating an
    // unhandled rejected promise or self-referencing its initializer.
    void pending.then(
      () => { if (inFlight === pending) inFlight = null; },
      () => { if (inFlight === pending) inFlight = null; },
    );

    return pending;
  }

  function invalidate(): void {
    lastReadyAt = null;
  }

  return { ensureReady, invalidate };
}
