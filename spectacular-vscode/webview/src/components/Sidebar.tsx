import type { FileNode } from '../types';
import { FileTree } from './FileTree';

interface SidebarProps {
  fileTree: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
  projectName: string;
  lastScanTime: Date | null;
  isLoading: boolean;
}

export function Sidebar({
  fileTree,
  selectedPath,
  onSelect,
  onToggle,
  projectName,
  lastScanTime,
  isLoading,
}: SidebarProps) {
  const formatTime = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-light-bg-secondary dark:bg-dark-bg-secondary border-r border-light-border dark:border-dark-border">
      {/* Sidebar Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-light-border dark:border-dark-border">
        <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary truncate">
          {projectName}
        </h2>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-light-text-muted dark:text-dark-text-muted text-sm">
              Loading...
            </div>
          </div>
        ) : (
          <FileTree
            nodes={fileTree}
            selectedPath={selectedPath}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-light-border dark:border-dark-border">
        <div className="text-xs text-light-text-muted dark:text-dark-text-muted">
          Last scan: {formatTime(lastScanTime)}
        </div>
      </div>
    </div>
  );
}
