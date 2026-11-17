export type ReadinessRequest = (url: string, timeoutMs: number) => Promise<unknown>;
export type ReadinessDelay = (milliseconds: number) => Promise<void>;

export const BACKEND_READINESS_FRESHNESS_MS = 10 * 60 * 1000;
export const BACKEND_COLD_START_TIMEOUT_MS = 90 * 1000;
export const BACKEND_READINESS_RETRY_DELAY_MS = 1_500;

function defaultDelay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function isRetryableReadinessError(error: unknown): boolean {
  const candidate = error as {
    code?: string;
    response?: { status?: number };
  } | null;
  if (candidate?.code === 'ERR_OFFLINE') return false;
  const status = candidate?.response?.status;
  return status === undefined || [502, 503, 504].includes(status);
}

/**
 * Avoid sending a user operation to a sleeping Render Free API.
 *
 * The first request after the freshness window waits for the public readiness
 * endpoint (which also verifies PostgreSQL) before the real API request is
 * dispatched. Concurrent callers share one probe. Transient network/proxy
 * failures are retried once; offline status and permanent HTTP errors are not.
 *
 * This improves cold-start recovery UX; it does not keep a Free instance awake
 * when no clients are making requests.
 */
export function createBackendReadinessGate(
  request: ReadinessRequest,
  now: () => number = Date.now,
  freshnessMs = BACKEND_READINESS_FRESHNESS_MS,
  timeoutMs = BACKEND_COLD_START_TIMEOUT_MS,
  delay: ReadinessDelay = defaultDelay,
  retryDelayMs = BACKEND_READINESS_RETRY_DELAY_MS,
) {
  let lastReadyAt: number | null = null;
  let inFlight: Promise<void> | null = null;

  async function probe(url: string): Promise<void> {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await request(url, timeoutMs);
        return;
      } catch (error) {
        if (attempt === 1 || !isRetryableReadinessError(error)) throw error;
        await delay(retryDelayMs);
      }
    }
  }

  function ensureReady(baseUrl: string): Promise<void> {
    if (lastReadyAt !== null && now() - lastReadyAt < freshnessMs) {
      return Promise.resolve();
    }
    if (inFlight) return inFlight;

    const url = baseUrl.replace(/\/+$/, '') + '/health/ready';
    const pending = probe(url).then(() => {
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
