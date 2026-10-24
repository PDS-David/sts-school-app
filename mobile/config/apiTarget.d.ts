export const STAGING: 'staging';
export function assertStagingApiUrl(url: string | undefined, productionUrl: string | undefined): string;
export function resolveApiBaseUrl(p: { envUrl?: string; configuredUrl?: string; extra?: Record<string, unknown> }): string;
export function isStagingBuild(env: Record<string, string | undefined>): boolean;
export function assertKnownTarget(env: Record<string, string | undefined>): void;
