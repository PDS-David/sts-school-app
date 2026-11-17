import type { Server } from 'node:http';

/**
 * Stop accepting new requests and drain active work before closing shared
 * dependencies. Fatal JavaScript errors exit non-zero so Render can replace
 * the process; platform termination signals exit cleanly after shutdown.
 */
export function installFatalProcessHandlers(
  server: Server,
  shutdownDependencies: () => Promise<void>,
): void {
  let shuttingDown = false;

  const terminate = (event: string, reason: unknown, exitCode: 0 | 1): void => {
    if (shuttingDown) return;
    shuttingDown = true;

    const prefix = exitCode === 0 ? '[shutdown]' : '[fatal]';
    console.error(`${prefix} ${event}; draining the API process:`, reason);

    const hardStop = setTimeout(() => {
      console.error(`${prefix} graceful shutdown exceeded 10 seconds; closing remaining HTTP connections.`);
      server.closeAllConnections();
      process.exit(exitCode);
    }, 10_000);
    hardStop.unref();

    server.close((closeError) => {
      if (closeError && (closeError as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING') {
        console.error(`${prefix} HTTP server close failed:`, closeError);
      }

      void Promise.resolve()
        .then(shutdownDependencies)
        .catch((shutdownError) => {
          console.error(`${prefix} dependency shutdown failed:`, shutdownError);
        })
        .finally(() => {
          clearTimeout(hardStop);
          process.exitCode = exitCode;
        });
    });

    // Explicitly release idle keep-alive sockets while active requests drain.
    server.closeIdleConnections();
  };

  process.on('unhandledRejection', (reason) => terminate('unhandledRejection', reason, 1));
  process.on('uncaughtException', (error) => terminate('uncaughtException', error, 1));
  process.on('SIGTERM', () => terminate('SIGTERM', 'Render is stopping this instance', 0));
  process.on('SIGINT', () => terminate('SIGINT', 'Process interrupted', 0));
}
