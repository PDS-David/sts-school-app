/** Build an offline-cache key that isolates responses by query and tenant. */
export function buildOfflineCacheUrl(
  url: string,
  params: Record<string, unknown> | undefined,
  schoolCode: string | null | undefined,
): string {
  const values = params && typeof params === 'object' ? params : {};
  const paramsPart = Object.keys(values).sort().map((key) =>
    `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(values[key]) ?? '')}`,
  ).join('&');
  const scopePart = `__school_scope=${encodeURIComponent(schoolCode || 'none')}`;
  const suffix = [paramsPart, scopePart].filter(Boolean).join('&');
  return `${url}${url.includes('?') ? '&' : '?'}${suffix}`;
}
