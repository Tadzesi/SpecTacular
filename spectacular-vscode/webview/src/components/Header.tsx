import { ThemeToggle } from './ThemeToggle';

interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string;
}

interface HeaderProps {
  isWatching: boolean;
  modifiedCount: number;
  onToggleWatch: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  currentPath: string;
  onSelectFolder: () => void;
  versionInfo?: VersionInfo;
  onOpenExternal?: (url: string) => void;
}

export function Header({
  isWatching,
  modifiedCount,
  onToggleWatch,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  currentPath,
  onSelectFolder,
  versionInfo,
  onOpenExternal,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
      {/* Left: Logo, Title, and Navigation */}
      <div className="flex items-center gap-3">
        <svg
          className="w-7 h-7 text-light-accent-purple dark:text-dark-accent-purple"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        <h1 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
          SpecTacular
        </h1>

        {/* Version Badge */}
        {versionInfo && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-light-text-muted dark:text-dark-text-muted">
              v{versionInfo.currentVersion}
            </span>
            {versionInfo.updateAvailable && versionInfo.latestVersion && (
              <button
                onClick={() => onOpenExternal?.(versionInfo.releaseUrl)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-light-accent-blue/20 dark:bg-dark-accent-blue/20 text-light-accent-blue dark:text-dark-accent-blue hover:bg-light-accent-blue/30 dark:hover:bg-dark-accent-blue/30 transition-colors"
                title={`Update to v${versionInfo.latestVersion}`}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                </svg>
                v{versionInfo.latestVersion}
              </button>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`
              p-1.5 rounded-md transition-colors
              ${canGoBack
                ? 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary'
                : 'text-light-text-muted/40 dark:text-dark-text-muted/40 cursor-not-allowed'
              }
            `}
            title="Go back"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`
              p-1.5 rounded-md transition-colors
              ${canGoForward
                ? 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary'
                : 'text-light-text-muted/40 dark:text-dark-text-muted/40 cursor-not-allowed'
              }
            `}
            title="Go forward"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>

        {/* Folder Select Button */}
        <button
          onClick={onSelectFolder}
          className="ml-2 p-1.5 rounded-md hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary transition-colors"
          title="Select folder"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
        </button>

        {/* Current Path Display */}
        <div className="ml-2 px-3 py-1 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md max-w-md truncate">
          <span className="text-xs text-light-text-muted dark:text-dark-text-muted" title={currentPath}>
            {currentPath || 'No folder selected'}
          </span>
        </div>
      </div>

      {/* Right: Status and Controls */}
      <div className="flex items-center gap-4">
        {/* Watch Status */}
        <div className="flex items-center gap-2">
          <span
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
              ${isWatching
                ? 'bg-light-accent-green/20 dark:bg-dark-accent-green/20 text-light-accent-green dark:text-dark-accent-green'
                : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-muted dark:text-dark-text-muted'
              }
            `}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isWatching
                  ? 'bg-light-accent-green dark:bg-dark-accent-green pulse-status'
                  : 'bg-light-text-muted dark:bg-dark-text-muted'
              }`}
            />
            {isWatching ? 'Watching' : 'Paused'}
          </span>
        </div>

        {/* Modified Count */}
        {modifiedCount > 0 && (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-light-accent-blue/20 dark:bg-dark-accent-blue/20 text-light-accent-blue dark:text-dark-accent-blue">
            <span>{modifiedCount}</span>
            <span>modified</span>
          </span>
        )}

        {/* Watch Toggle */}
        <button
          onClick={onToggleWatch}
          className={`
            p-2 rounded-md transition-colors
            ${isWatching
              ? 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary'
              : 'hover:bg-light-accent-green/20 dark:hover:bg-dark-accent-green/20 text-light-accent-green dark:text-dark-accent-green'
            }
          `}
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

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
