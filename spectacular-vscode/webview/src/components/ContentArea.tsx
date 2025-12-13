import { useEffect, useRef, useCallback } from 'react';
import { WysiwygEditor } from './editor';
import { Breadcrumb } from './Breadcrumb';

interface ContentAreaProps {
  filePath: string | null;
  rootPath: string;
  content: string;
  isModified: boolean;
  isLoading: boolean;
  error: string | null;
  onNavigate?: (path: string) => void;
  onContentChange?: (content: string, isModified: boolean) => void;
  onSave?: () => void;
  onSaveAll?: () => void;
  hasModifiedFiles?: boolean;
}

export function ContentArea({
  filePath,
  rootPath,
  content,
  isModified,
  isLoading,
  error,
  onNavigate,
  onContentChange,
  onSave,
  onSaveAll,
  hasModifiedFiles,
}: ContentAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [filePath]);

  const handleContentChange = useCallback((newContent: string, modified: boolean) => {
    onContentChange?.(newContent, modified);
  }, [onContentChange]);

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  const handleSaveAll = useCallback(() => {
    onSaveAll?.();
  }, [onSaveAll]);

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
    <div className="h-full flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary overflow-hidden">
      {/* Header with breadcrumb, modified badge, and save buttons */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary">
        <div className="flex items-center gap-3">
          <Breadcrumb filePath={filePath} rootPath={rootPath} />
          {isModified && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-light-accent-orange/20 dark:bg-dark-accent-orange/20 text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-dot"></span>
              Modified
            </span>
          )}
        </div>

        {/* Save buttons */}
        <div className="flex items-center gap-2">
          {isModified && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-light-accent-blue dark:bg-dark-accent-blue text-white hover:opacity-90 transition-opacity"
              title="Save current file (Ctrl+S)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
              Save
            </button>
          )}
          {hasModifiedFiles && (
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-light-border dark:border-dark-border hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary transition-colors"
              title="Save all modified files"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
              Save All
            </button>
          )}
        </div>
      </div>

      {/* Content - WYSIWYG Editor */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-light-text-muted dark:text-dark-text-muted">
              Loading...
            </div>
          </div>
        ) : (
          <WysiwygEditor
            content={content}
            filePath={filePath}
            onContentChange={handleContentChange}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}
