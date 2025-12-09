import { useState, useEffect, useCallback, useRef } from 'react';
import { ContentArea } from './components/ContentArea';
import { useNavigationHistory } from './hooks/useNavigationHistory';
import { vscodeApi } from './vscodeApi';
import type { AppConfig, FileContentResponse, FileChangeEvent } from './types';

// Recent files limit
const MAX_RECENT_FILES = 10;

interface RecentFile {
  path: string;
  name: string;
  timestamp: number;
}

function App() {
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  const isNavigatingRef = useRef(false);

  const {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    pushHistory,
  } = useNavigationHistory();

  // Add file to recent files
  const addToRecentFiles = useCallback((filePath: string) => {
    const fileName = filePath.split(/[/\\]/).pop() || filePath;
    setRecentFiles((prev) => {
      const filtered = prev.filter((f) => f.path !== filePath);
      const newRecent: RecentFile = {
        path: filePath,
        name: fileName,
        timestamp: Date.now(),
      };
      return [newRecent, ...filtered].slice(0, MAX_RECENT_FILES);
    });
  }, []);

  // Listen for messages from VS Code
  useEffect(() => {
    const unsubConfig = vscodeApi.on('config', (config: AppConfig) => {
      if (config.rootPath) {
        setRootPath(config.rootPath);
      }
      setIsWatching(config.isWatching);
      setIsReady(true);
    });

    const unsubFileContent = vscodeApi.on('fileContent', (data: FileContentResponse) => {
      setFileContent(data.content);
      setError(null);
      setIsLoading(false);
    });

    const unsubSelectFile = vscodeApi.on('selectFile', (filePath: string) => {
      // File selected from VS Code (e.g., via editor change)
      if (filePath !== selectedFile) {
        isNavigatingRef.current = true;
        setSelectedFile(filePath);
        addToRecentFiles(filePath);
        if (!isNavigatingRef.current) {
          pushHistory(filePath);
        }
        isNavigatingRef.current = false;
      }
    });

    const unsubFolderSelected = vscodeApi.on('folderSelected', (path: string) => {
      setRootPath(path);
    });

    const unsubFileChange = vscodeApi.on('fileChange', (event: FileChangeEvent) => {
      if (event.type === 'change' && event.path === selectedFile) {
        // Reload current file
        vscodeApi.readFile(event.path);
      }
    });

    const unsubWatchingStarted = vscodeApi.on('watchingStarted', () => {
      setIsWatching(true);
    });

    const unsubWatchingStopped = vscodeApi.on('watchingStopped', () => {
      setIsWatching(false);
    });

    const unsubError = vscodeApi.on('error', (data: { message: string }) => {
      setError(data.message);
      setIsLoading(false);
    });

    // Signal ready
    vscodeApi.ready();

    return () => {
      unsubConfig();
      unsubFileContent();
      unsubSelectFile();
      unsubFolderSelected();
      unsubFileChange();
      unsubWatchingStarted();
      unsubWatchingStopped();
      unsubError();
    };
  }, [selectedFile, addToRecentFiles, pushHistory]);

  // Handle file selection (from internal navigation)
  const handleSelectFile = useCallback((path: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedFile(path);
    addToRecentFiles(path);
    if (!isNavigatingRef.current) {
      pushHistory(path);
    }
    isNavigatingRef.current = false;
    vscodeApi.readFile(path);
    // Reveal in tree view
    vscodeApi.revealInTree(path);
  }, [addToRecentFiles, pushHistory]);

  // Handle back navigation
  const handleGoBack = useCallback(() => {
    const path = goBack();
    if (path) {
      isNavigatingRef.current = true;
      handleSelectFile(path);
    }
  }, [goBack, handleSelectFile]);

  // Handle forward navigation
  const handleGoForward = useCallback(() => {
    const path = goForward();
    if (path) {
      isNavigatingRef.current = true;
      handleSelectFile(path);
    }
  }, [goForward, handleSelectFile]);

  // Handle watching toggle
  const handleToggleWatch = useCallback(() => {
    vscodeApi.setWatching(!isWatching);
  }, [isWatching]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft' && canGoBack) {
        e.preventDefault();
        handleGoBack();
      } else if (e.altKey && e.key === 'ArrowRight' && canGoForward) {
        e.preventDefault();
        handleGoForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, canGoForward, handleGoBack, handleGoForward]);

  // Mouse back/forward buttons
  useEffect(() => {
    const handleMouseButton = (e: MouseEvent) => {
      if (e.button === 3 && canGoBack) {
        e.preventDefault();
        handleGoBack();
      } else if (e.button === 4 && canGoForward) {
        e.preventDefault();
        handleGoForward();
      }
    };

    const preventDefault = (e: MouseEvent) => {
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
      }
    };

    window.addEventListener('mouseup', handleMouseButton);
    window.addEventListener('mousedown', preventDefault);

    return () => {
      window.removeEventListener('mouseup', handleMouseButton);
      window.removeEventListener('mousedown', preventDefault);
    };
  }, [canGoBack, canGoForward, handleGoBack, handleGoForward]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowRecentDropdown(false);
    if (showRecentDropdown) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [showRecentDropdown]);

  // Loading state
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center text-light-text-muted dark:text-dark-text-muted">
          <svg className="w-12 h-12 mx-auto mb-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
        {/* Left: Logo, Title, and Navigation */}
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-light-accent-purple dark:text-dark-accent-purple" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          <h1 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            SpecTacular
          </h1>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={handleGoBack}
              disabled={!canGoBack}
              className={`p-1.5 rounded-md transition-colors ${
                canGoBack
                  ? 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary'
                  : 'text-light-text-muted/40 dark:text-dark-text-muted/40 cursor-not-allowed'
              }`}
              title="Go back (Alt+Left)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <button
              onClick={handleGoForward}
              disabled={!canGoForward}
              className={`p-1.5 rounded-md transition-colors ${
                canGoForward
                  ? 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary'
                  : 'text-light-text-muted/40 dark:text-dark-text-muted/40 cursor-not-allowed'
              }`}
              title="Go forward (Alt+Right)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </button>
          </div>

          {/* Recent Files Dropdown */}
          {recentFiles.length > 0 && (
            <div className="relative ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRecentDropdown(!showRecentDropdown);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary transition-colors"
                title="Recent files"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                </svg>
                <span className="text-xs">Recent</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {showRecentDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-md shadow-lg z-50">
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {recentFiles.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => {
                          handleSelectFile(file.path);
                          setShowRecentDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary ${
                          file.path === selectedFile
                            ? 'bg-light-accent-blue/10 dark:bg-dark-accent-blue/10 text-light-accent-blue dark:text-dark-accent-blue'
                            : 'text-light-text-primary dark:text-dark-text-primary'
                        }`}
                        title={file.path}
                      >
                        <div className="truncate">{file.name}</div>
                        <div className="text-xs text-light-text-muted dark:text-dark-text-muted truncate">
                          {file.path}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current File Path */}
          {selectedFile && (
            <div className="ml-2 px-3 py-1 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md max-w-md truncate">
              <span className="text-xs text-light-text-muted dark:text-dark-text-muted" title={selectedFile}>
                {selectedFile}
              </span>
            </div>
          )}
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-4">
          {/* Watch Status */}
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
              isWatching
                ? 'bg-light-accent-green/20 dark:bg-dark-accent-green/20 text-light-accent-green dark:text-dark-accent-green'
                : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-muted dark:text-dark-text-muted'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isWatching
                  ? 'bg-light-accent-green dark:bg-dark-accent-green pulse-status'
                  : 'bg-light-text-muted dark:bg-dark-text-muted'
              }`} />
              {isWatching ? 'Watching' : 'Paused'}
            </span>
          </div>

          {/* Watch Toggle */}
          <button
            onClick={handleToggleWatch}
            className={`p-2 rounded-md transition-colors ${
              isWatching
                ? 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary'
                : 'hover:bg-light-accent-green/20 dark:hover:bg-dark-accent-green/20 text-light-accent-green dark:text-dark-accent-green'
            }`}
            title={isWatching ? 'Pause watching' : 'Resume watching'}
          >
            {isWatching ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {selectedFile ? (
          <ContentArea
            filePath={selectedFile}
            rootPath={rootPath || ''}
            content={fileContent}
            isModified={false}
            isLoading={isLoading}
            error={error}
            onNavigate={handleSelectFile}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-light-text-muted dark:text-dark-text-muted">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">
                Open a markdown file from the <strong>Spec Files</strong> tree or VS Code explorer
              </p>
              {recentFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Or select a recent file:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {recentFiles.slice(0, 3).map((file) => (
                      <button
                        key={file.path}
                        onClick={() => handleSelectFile(file.path)}
                        className="px-3 py-1 text-sm bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md hover:bg-light-accent-blue/20 dark:hover:bg-dark-accent-blue/20 transition-colors"
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
