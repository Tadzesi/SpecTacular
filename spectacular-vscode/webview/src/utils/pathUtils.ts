export function getFileName(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || '';
}

export function getDirectory(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const lastSlash = normalizedPath.lastIndexOf('/');
  return lastSlash >= 0 ? normalizedPath.substring(0, lastSlash) : '';
}

export function getExtension(filePath: string): string {
  const fileName = getFileName(filePath);
  const lastDot = fileName.lastIndexOf('.');
  return lastDot >= 0 ? fileName.substring(lastDot) : '';
}

export function getPathSegments(filePath: string, rootPath: string): string[] {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedRoot = rootPath.replace(/\\/g, '/');

  const relativePath = normalizedPath.startsWith(normalizedRoot)
    ? normalizedPath.substring(normalizedRoot.length)
    : normalizedPath;

  return relativePath.split('/').filter(Boolean);
}

export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((p) => p.replace(/\\/g, '/'))
    .join('/')
    .replace(/\/+/g, '/');
}

export function isMarkdownFile(filePath: string): boolean {
  return filePath.toLowerCase().endsWith('.md');
}

export function isSpecFile(filePath: string): boolean {
  const fileName = getFileName(filePath).toLowerCase();
  return fileName.endsWith('.spec.md');
}

export function isReadmeFile(filePath: string): boolean {
  const fileName = getFileName(filePath).toLowerCase();
  return fileName === 'readme.md';
}

export function isChangelogFile(filePath: string): boolean {
  const fileName = getFileName(filePath).toLowerCase();
  return fileName === 'changelog.md';
}

export function getRelativePath(filePath: string, rootPath: string): string {
  const normalizedPath = normalizePath(filePath);
  const normalizedRoot = normalizePath(rootPath);

  if (normalizedPath.startsWith(normalizedRoot)) {
    const relative = normalizedPath.substring(normalizedRoot.length);
    return relative.startsWith('/') ? relative.substring(1) : relative;
  }

  return normalizedPath;
}
