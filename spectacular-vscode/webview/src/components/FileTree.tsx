import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { FileNode } from '../types';
import { FileTreeItem } from './FileTreeItem';

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
}

// Build a flat list of visible nodes for keyboard navigation
function getVisibleNodes(nodes: FileNode[]): FileNode[] {
  const result: FileNode[] = [];

  function traverse(nodeList: FileNode[]) {
    for (const node of nodeList) {
      result.push(node);
      if (node.type === 'folder' && node.expanded && node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return result;
}

export function FileTree({ nodes, selectedPath, onSelect, onToggle }: FileTreeProps) {
  const [focusedPath, setFocusedPath] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get flat list of visible nodes
  const visibleNodes = useMemo(() => getVisibleNodes(nodes), [nodes]);

  // Sync focused path with selected path when it changes externally
  useEffect(() => {
    if (selectedPath && !focusedPath) {
      setFocusedPath(selectedPath);
    }
  }, [selectedPath, focusedPath]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (visibleNodes.length === 0) return;

    const currentIndex = focusedPath
      ? visibleNodes.findIndex(n => n.path === focusedPath)
      : -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = currentIndex < visibleNodes.length - 1 ? currentIndex + 1 : 0;
        setFocusedPath(visibleNodes[nextIndex].path);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleNodes.length - 1;
        setFocusedPath(visibleNodes[prevIndex].path);
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (focusedPath) {
          const node = visibleNodes.find(n => n.path === focusedPath);
          if (node) {
            if (node.type === 'folder') {
              onToggle(node.path);
            } else {
              onSelect(node.path);
            }
          }
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (focusedPath) {
          const node = visibleNodes.find(n => n.path === focusedPath);
          if (node && node.type === 'folder' && !node.expanded) {
            onToggle(node.path);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (focusedPath) {
          const node = visibleNodes.find(n => n.path === focusedPath);
          if (node && node.type === 'folder' && node.expanded) {
            onToggle(node.path);
          }
        }
        break;
      }
    }
  }, [focusedPath, visibleNodes, onSelect, onToggle]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedPath && containerRef.current) {
      const focusedElement = containerRef.current.querySelector(`[data-path="${CSS.escape(focusedPath)}"]`);
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedPath]);

  if (nodes.length === 0) {
    return (
      <div className="p-4 text-center text-light-text-muted dark:text-dark-text-muted text-sm">
        No markdown files found
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="py-2 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {nodes.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          focusedPath={focusedPath}
          onSelect={onSelect}
          onToggle={onToggle}
          onFocus={setFocusedPath}
        />
      ))}
    </div>
  );
}
