import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { ResizeHandle } from './components/ResizeHandle';
import { useFileTree } from './hooks/useFileTree';
import { useFileWatcher } from './hooks/useFileWatcher';
import { useNavigationHistory } from './hooks/useNavigationHistory';
import { getFileName } from './utils/pathUtils';

const DEFAULT_ROOT_PATH = process.env.NODE_ENV === 'development'
  ? 'C:/Projects/SpecTacular/specs'
  : './specs';

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;

function App() {
  const [rootPath, setRootPath] = useState<string>(DEFAULT_ROOT_PATH);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isNavigatingRef = useRef(false);

  const {
    fileTree,
    selectedFile,
    fileContent,
    modifiedFiles,
    isLoading,
    error,
    lastScanTime,
    selectFile,
    toggleFolder,
    handleFileChange,
  } = useFileTree({ rootPath });

  const {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    pushHistory,
  } = useNavigationHistory();

  const { isWatching, toggleWatching } = useFileWatcher({
    rootPath,
    onFileChange: handleFileChange,
    enabled: true,
  });

  const projectName = getFileName(rootPath) || 'Specs';
  const isFileModified = selectedFile ? modifiedFiles.has(selectedFile) : false;

  useEffect(() => {
    window.electronAPI.getConfig().then((config) => {
      if (config.rootPath) {
        setRootPath(config.rootPath);
      }
    }).catch(console.error);
  }, []);

  // Handle file selection with history
  const handleSelectFile = useCallback(async (path: string) => {
    if (!isNavigatingRef.current) {
      pushHistory(path);
    }
    isNavigatingRef.current = false;
    await selectFile(path);
  }, [selectFile, pushHistory]);

  // Handle back navigation
  const handleGoBack = useCallback(() => {
    const path = goBack();
    if (path) {
      isNavigatingRef.current = true;
      selectFile(path);
    }
  }, [goBack, selectFile]);

  // Handle forward navigation
  const handleGoForward = useCallback(() => {
    const path = goForward();
    if (path) {
      isNavigatingRef.current = true;
      selectFile(path);
    }
  }, [goForward, selectFile]);

  const handleSidebarResize = useCallback((width: number) => {
    setSidebarWidth(width);
  }, []);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Left for back, Alt+Right for forward (like browsers)
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

  // Mouse back/forward button navigation (Mouse4 = button 3, Mouse5 = button 4)
  useEffect(() => {
    const handleMouseButton = (e: MouseEvent) => {
      // Mouse button 3 = back (Mouse4), button 4 = forward (Mouse5)
      if (e.button === 3) {
        e.preventDefault();
        if (canGoBack) {
          handleGoBack();
        }
      } else if (e.button === 4) {
        e.preventDefault();
        if (canGoForward) {
          handleGoForward();
        }
      }
    };

    // auxclick fires for non-primary mouse buttons
    window.addEventListener('mouseup', handleMouseButton);
    return () => window.removeEventListener('mouseup', handleMouseButton);
  }, [canGoBack, canGoForward, handleGoBack, handleGoForward]);

  return (
    <div className="flex flex-col h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <Header
        isWatching={isWatching}
        modifiedCount={modifiedFiles.size}
        onToggleWatch={toggleWatching}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex-shrink-0 h-full"
          style={{ width: sidebarWidth }}
        >
          <Sidebar
            fileTree={fileTree}
            selectedPath={selectedFile}
            onSelect={handleSelectFile}
            onToggle={toggleFolder}
            projectName={projectName}
            lastScanTime={lastScanTime}
            isLoading={isLoading && fileTree.length === 0}
          />
        </div>

        <ResizeHandle
          onResize={handleSidebarResize}
          minWidth={MIN_SIDEBAR_WIDTH}
          maxWidth={MAX_SIDEBAR_WIDTH}
        />

        <ContentArea
          filePath={selectedFile}
          rootPath={rootPath}
          content={fileContent}
          isModified={isFileModified}
          isLoading={isLoading && selectedFile !== null}
          error={error}
          onNavigate={handleSelectFile}
        />
      </div>
    </div>
  );
}

export default App;
