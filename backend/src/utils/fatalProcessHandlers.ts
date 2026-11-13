import type { Server } from 'node:http';

/**
 * Node cannot safely continue after an uncaught exception, and unhandled
 * rejections should not be silently converted into log-only events. Stop
 * accepting traffic, drain the server and dependencies, then let the process
 * exit non-zero so the process manager can restart a clean instance.
 */
export function installFatalProcessHandlers(
  server: Server,
  shutdownDependencies: () => Promise<void>,
): void {
  let shuttingDown = false;

  const terminate = (event: string, reason: unknown): void => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.error(`[fatal] ${event}; shutting down the API process:`, reason);

    const hardStop = setTimeout(() => {
      console.error('[fatal] graceful shutdown exceeded 10 seconds; closing remaining HTTP connections.');
      server.closeAllConnections();
      process.exit(1);
    }, 10_000);
    hardStop.unref();

    server.close((closeError) => {
      if (closeError && (closeError as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING') {
        console.error('[fatal] HTTP server close failed:', closeError);
      }

      void Promise.resolve()
        .then(shutdownDependencies)
        .catch((shutdownError) => {
          console.error('[fatal] dependency shutdown failed:', shutdownError);
        })
        .finally(() => {
          clearTimeout(hardStop);
          process.exitCode = 1;
        });
    });
  };

  process.on('unhandledRejection', (reason) => terminate('unhandledRejection', reason));
  process.on('uncaughtException', (error) => terminate('uncaughtException', error));
}
