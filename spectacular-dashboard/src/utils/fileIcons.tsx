import { isSpecFile, isReadmeFile, isChangelogFile } from './pathUtils';

export type FileIconType = 'spec' | 'readme' | 'changelog' | 'markdown' | 'folder' | 'folder-open';

export function getFileIconType(filePath: string, isFolder: boolean, isExpanded?: boolean): FileIconType {
  if (isFolder) {
    return isExpanded ? 'folder-open' : 'folder';
  }

  if (isSpecFile(filePath)) return 'spec';
  if (isReadmeFile(filePath)) return 'readme';
  if (isChangelogFile(filePath)) return 'changelog';

  return 'markdown';
}

export function getFileIconColor(iconType: FileIconType, isDark: boolean): string {
  const colors = {
    spec: isDark ? '#c792ea' : '#8250df',
    readme: isDark ? '#7ed6a5' : '#1a7f37',
    changelog: isDark ? '#6c9eff' : '#0969da',
    markdown: isDark ? '#8b949e' : '#57606a',
    folder: isDark ? '#6c9eff' : '#0969da',
    'folder-open': isDark ? '#6c9eff' : '#0969da',
  };

  return colors[iconType];
}

export function FolderIcon({ isOpen, className }: { isOpen?: boolean; className?: string }) {
  if (isOpen) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    </svg>
  );
}

export function FileIcon({ type, className }: { type: FileIconType; className?: string }) {
  const getPath = () => {
    switch (type) {
      case 'spec':
        return (
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        );
      case 'readme':
        return (
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
        );
      case 'changelog':
        return (
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        );
      default:
        return (
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
        );
    }
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      {getPath()}
    </svg>
  );
}

export function ChevronIcon({ isExpanded, className }: { isExpanded?: boolean; className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="16"
      height="16"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  );
}
