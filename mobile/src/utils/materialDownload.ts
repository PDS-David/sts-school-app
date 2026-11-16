export interface MaterialDownloadTarget {
  url: string;
  fileName: string;
  mimeType: string;
  maxBytes: number;
}

const BLOCKED_HOST_SUFFIXES = [
  '.localhost', '.local', '.internal', '.lan', '.home', '.test', '.invalid',
  '.example', '.onion', '.arpa',
];

function parseSafeHttpsUrl(value: unknown): URL | null {
  if (typeof value !== 'string' || value.length === 0 || value.length > 2048 || value !== value.trim()) return null;
  if (/[\u0000-\u0020\u007f\\\\]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    if (url.port && url.port !== '443') return null;
    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
    if (!hostname.includes('.') || hostname.includes(':') || /^\d+(?:\.\d+){3}$/.test(hostname)) return null;
    if (BLOCKED_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix))) return null;
    if (hostname === 'localhost' || hostname === 'local' || hostname === 'internal') return null;
    return url;
  } catch {
    return null;
  }
}

export function isSafeMaterialUrl(value: unknown): value is string {
  return parseSafeHttpsUrl(value) !== null;
}

/** Build a safe local filename and accept only direct HTTPS PDF/Word downloads. */
export function getMaterialDownloadTarget(
  url: unknown,
  title: unknown,
  type: unknown,
): MaterialDownloadTarget | null {
  const parsedUrl = parseSafeHttpsUrl(url);
  if (!parsedUrl) return null;

  const materialType = typeof type === 'string' ? type.toLowerCase() : '';
  if (materialType !== 'pdf' && materialType !== 'doc') return null;

  const path = parsedUrl.pathname;
  const match = path.match(/\.([a-z0-9]{2,5})$/i);
  const extension = match?.[1].toLowerCase();
  const allowedExtensions = materialType === 'pdf' ? ['pdf'] : ['doc', 'docx'];
  if (extension && !allowedExtensions.includes(extension)) return null;
  const finalExtension = extension ?? (materialType === 'pdf' ? 'pdf' : 'doc');

  const safeTitle = (typeof title === 'string' ? title : 'learning-material')
    .normalize('NFKD')
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64) || 'learning-material';
  const mimeType = finalExtension === 'pdf' ? 'application/pdf'
    : finalExtension === 'doc' ? 'application/msword'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  return { url: parsedUrl.toString(), fileName: `${safeTitle}.${finalExtension}`, mimeType, maxBytes: 25 * 1024 * 1024 };
}
