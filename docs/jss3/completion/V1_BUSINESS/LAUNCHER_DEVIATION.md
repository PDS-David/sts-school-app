Explicit --tsx-no-ipc: npx tsx is launched as node --import tsx because the sandbox denies tsx CLI IPC sockets. No test or application assertion is changed. Other npx calls use the original launcher.
