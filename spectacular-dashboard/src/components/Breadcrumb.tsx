import React, { useState, useCallback } from 'react';
import { getPathSegments } from '../utils/pathUtils';

interface BreadcrumbProps {
  filePath: string;
  rootPath: string;
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Breadcrumb({ filePath, rootPath }: BreadcrumbProps) {
  const [copied, setCopied] = useState(false);
  const segments = getPathSegments(filePath, rootPath);

  // Build the relative path from segments
  const relativePath = segments.join('/');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(relativePath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [relativePath]);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm font-mono group">
      <div className="flex items-center gap-1">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <React.Fragment key={index}>
              <span
                className={`
                  ${isLast
                    ? 'text-light-text-primary dark:text-dark-text-primary font-medium'
                    : 'text-light-text-muted dark:text-dark-text-muted'
                  }
                `}
              >
                {segment}
              </span>
              {!isLast && (
                <span className="text-light-text-muted dark:text-dark-text-muted">
                  /
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <button
        onClick={handleCopy}
        className={`
          inline-flex items-center justify-center p-1 rounded
          transition-all duration-200
          ${copied
            ? 'text-light-accent-green dark:text-dark-accent-green'
            : 'text-light-text-muted dark:text-dark-text-muted opacity-0 group-hover:opacity-100 hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
          }
        `}
        title={copied ? 'Copied!' : `Copy path: ${relativePath}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </nav>
  );
}
