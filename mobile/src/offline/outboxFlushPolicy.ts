/** Stop replay after an expired session so remaining writes stay queued without repeated 401s. */
export function shouldStopOutboxFlush(status: number | undefined): boolean {
  return status === 401;
}
