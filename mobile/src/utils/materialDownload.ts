export interface MaterialDownloadTarget {
  url: string;
  fileName: string;
  mimeType: string;
}

/** Build a safe local filename and accept only HTTPS download links. */
export function getMaterialDownloadTarget(
  url: unknown,
  title: unknown,
  type: unknown,
): MaterialDownloadTarget | null {
  if (typeof url !== 'string' || !/^https:\/\/[^\s]+$/i.test(url)) return null;
  const safeTitle = (typeof title === 'string' ? title : 'learning-material')
    .normalize('NFKD')
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64) || 'learning-material';
  const path = url.split(/[?#]/, 1)[0];
  const match = path.match(/\.([a-z0-9]{2,5})$/i);
  const knownExtensions = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'mp4', 'mp3']);
  const extension = match && knownExtensions.has(match[1].toLowerCase())
    ? match[1].toLowerCase()
    : type === 'pdf' ? 'pdf' : 'doc';
  const mimeType = extension === 'pdf' ? 'application/pdf'
    : extension === 'doc' ? 'application/msword'
    : extension === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : extension === 'ppt' ? 'application/vnd.ms-powerpoint'
    : extension === 'pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    : extension === 'xls' ? 'application/vnd.ms-excel'
    : extension === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : extension === 'mp4' ? 'video/mp4'
    : extension === 'mp3' ? 'audio/mpeg'
    : 'text/plain';
  return { url, fileName: `${safeTitle}.${extension}`, mimeType };
}
