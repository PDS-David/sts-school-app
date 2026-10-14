// Dependencies are passed in so token refresh ordering can be tested without a device.
export async function loadLessonAssets(
  topicId: number,
  request: (url: string) => Promise<{ data: any }>,
  readToken: () => Promise<string | null>,
): Promise<{ assets: any[]; token: string | null }> {
  const { data } = await request(`/learning/topics/${topicId}/assets`);
  // The request interceptor may have refreshed authentication. Never read in parallel.
  const token = await readToken();
  if (!Array.isArray(data?.assets)) throw new Error('Invalid asset response');
  if (data.assets.length && !token) throw new Error('No image access token');
  return { assets: data.assets, token };
}
