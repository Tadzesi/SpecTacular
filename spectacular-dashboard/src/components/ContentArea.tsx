import { useEffect, useRef } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Breadcrumb } from './Breadcrumb';

interface ContentAreaProps {
  filePath: string | null;
  rootPath: string;
  content: string;
  isModified: boolean;
  isLoading: boolean;
  error: string | null;
  onNavigate?: (path: string) => void;
}

export function ContentArea({
  filePath,
  rootPath,
  content,
  isModified,
  isLoading,
  error,
  onNavigate,
}: ContentAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [filePath]);

  if (!filePath) {
    return (
      <div className="flex-1 flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center text-light-text-muted dark:text-dark-text-muted">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
          <p className="text-lg">Select a file to preview</p>
          <p className="text-sm mt-2">Choose a markdown file from the sidebar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center text-red-500 dark:text-red-400">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className="text-lg">Error loading file</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary overflow-hidden">
      {/* Header with breadcrumb and modified badge */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3 border-b border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary">
        <Breadcrumb filePath={filePath} rootPath={rootPath} />
        {isModified && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-light-accent-green/20 dark:bg-dark-accent-green/20 text-light-accent-green dark:text-dark-accent-green">
            Modified
          </span>
        )}
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-light-text-muted dark:text-dark-text-muted">
              Loading...
            </div>
          </div>
        ) : (
          <MarkdownRenderer
            content={content}
            currentFilePath={filePath}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}
