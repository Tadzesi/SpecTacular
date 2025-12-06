import type { FileNode } from '../types';
import { useTheme } from '../hooks/useTheme';
import { getFileIconType, getFileIconColor, FolderIcon, FileIcon, ChevronIcon } from '../utils/fileIcons';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  focusedPath: string | null;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
  onFocus: (path: string) => void;
}

export function FileTreeItem({
  node,
  depth,
  selectedPath,
  focusedPath,
  onSelect,
  onToggle,
  onFocus,
}: FileTreeItemProps) {
  const { isDark } = useTheme();
  const isFolder = node.type === 'folder';
  const isSelected = selectedPath === node.path;
  const isFocused = focusedPath === node.path;
  const isExpanded = node.expanded ?? false;

  const iconType = getFileIconType(node.path, isFolder, isExpanded);
  const iconColor = getFileIconColor(iconType, isDark);

  const handleClick = () => {
    onFocus(node.path);
    if (isFolder) {
      onToggle(node.path);
    } else {
      onSelect(node.path);
    }
  };

  const paddingLeft = depth * 16 + 8;

  return (
    <div>
      <div
        data-path={node.path}
        className={`
          flex items-center gap-1 px-2 py-1 cursor-pointer
          hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
          ${isSelected ? 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary' : ''}
          ${isFocused ? 'ring-1 ring-inset ring-light-accent-blue dark:ring-dark-accent-blue' : ''}
          transition-colors duration-150
        `}
        style={{ paddingLeft }}
        onClick={handleClick}
        title={node.path}
      >
        {isFolder && (
          <ChevronIcon
            isExpanded={isExpanded}
            className="text-light-text-muted dark:text-dark-text-muted flex-shrink-0"
          />
        )}
        {!isFolder && <span className="w-4" />}

        <span style={{ color: iconColor }} className="flex-shrink-0">
          {isFolder ? (
            <FolderIcon isOpen={isExpanded} />
          ) : (
            <FileIcon type={iconType} />
          )}
        </span>

        <span
          className={`
            truncate font-mono text-sm
            ${isSelected ? 'text-light-text-primary dark:text-dark-text-primary font-medium' : 'text-light-text-secondary dark:text-dark-text-secondary'}
          `}
        >
          {node.name}
        </span>

        {node.isModified && (
          <span
            className="w-2 h-2 rounded-full bg-light-accent-green dark:bg-dark-accent-green pulse-dot flex-shrink-0 ml-auto"
            title="Modified"
          />
        )}
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              focusedPath={focusedPath}
              onSelect={onSelect}
              onToggle={onToggle}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
