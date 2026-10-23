export const STAGING: 'staging';
export function assertStagingApiUrl(url: string | undefined, productionUrl: string | undefined): string;
export function isStagingBuild(env: Record<string, string | undefined>): boolean;
export function assertKnownTarget(env: Record<string, string | undefined>): void;
