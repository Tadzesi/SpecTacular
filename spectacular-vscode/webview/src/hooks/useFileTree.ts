import { useState, useCallback, useEffect } from 'react';
import { vscodeApi } from '../vscodeApi';
import type { FileNode, FileChangeEvent, FileContentResponse } from '../types';

interface UseFileTreeOptions {
  rootPath: string | null;
}

interface UseFileTreeReturn {
  fileTree: FileNode[];
  selectedFile: string | null;
  fileContent: string;
  modifiedFiles: Set<string>;
  isLoading: boolean;
  error: string | null;
  lastScanTime: Date | null;
  selectFile: (path: string) => void;
  toggleFolder: (path: string) => void;
  expandToFile: (path: string) => void;
  refreshTree: () => void;
  handleFileChange: (event: FileChangeEvent) => void;
  clearModified: (path: string) => void;
}

export function useFileTree({ rootPath }: UseFileTreeOptions): UseFileTreeReturn {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  // Subscribe to VS Code messages
  useEffect(() => {
    const unsubFileTree = vscodeApi.on('fileTree', (data: FileNode[]) => {
      setFileTree((prevTree) => mergeTreeWithExpandedState(data, prevTree));
      setLastScanTime(new Date());
      setIsLoading(false);
    });

    const unsubFileContent = vscodeApi.on('fileContent', (data: FileContentResponse) => {
      // Always set content when received - path comparison can have normalization issues
      setFileContent(data.content);
      setModifiedFiles((prev) => {
        const next = new Set(prev);
        next.delete(data.path);
        return next;
      });
      setError(null);
      setIsLoading(false);
    });

    const unsubFileChange = vscodeApi.on('fileChange', (event: FileChangeEvent) => {
      handleFileChange(event);
    });

    const unsubError = vscodeApi.on('error', (data: { message: string }) => {
      setError(data.message);
      setIsLoading(false);
    });

    return () => {
      unsubFileTree();
      unsubFileContent();
      unsubFileChange();
      unsubError();
    };
  }, [selectedFile]);

  const refreshTree = useCallback(() => {
    if (!rootPath) return;

    setIsLoading(true);
    setError(null);
    vscodeApi.getFileTree(rootPath);
  }, [rootPath]);

  // Expand all parent folders to reveal a file
  const expandToFile = useCallback((filePath: string) => {
    setFileTree((prev) => expandParentFolders(prev, filePath));
  }, []);

  const selectFile = useCallback((path: string) => {
    // Normalize path separators
    const normalizedPath = path.replace(/\//g, '\\');

    setIsLoading(true);
    setError(null);
    setSelectedFile(normalizedPath);

    // Expand parent folders to show the file in tree
    setFileTree((prev) => expandParentFolders(prev, normalizedPath));

    // Request file content from extension
    vscodeApi.readFile(normalizedPath);
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setFileTree((prev) => toggleFolderInTree(prev, path));
  }, []);

  const handleFileChange = useCallback((event: FileChangeEvent) => {
    const { type, path } = event;

    if (type === 'change') {
      setModifiedFiles((prev) => new Set(prev).add(path));

      if (selectedFile === path) {
        vscodeApi.readFile(path);
      }
    } else if (type === 'add' || type === 'unlink' || type === 'addDir' || type === 'unlinkDir') {
      refreshTree();
    }
  }, [selectedFile, refreshTree]);

  const clearModified = useCallback((path: string) => {
    setModifiedFiles((prev) => {
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
  }, []);

  // Initial tree load when rootPath changes
  useEffect(() => {
    if (rootPath) {
      refreshTree();
      vscodeApi.startWatching(rootPath);
    }
  }, [rootPath, refreshTree]);

  const treeWithModifiedFlags = markModifiedInTree(fileTree, modifiedFiles);

  return {
    fileTree: treeWithModifiedFlags,
    selectedFile,
    fileContent,
    modifiedFiles,
    isLoading,
    error,
    lastScanTime,
    selectFile,
    toggleFolder,
    expandToFile,
    refreshTree,
    handleFileChange,
    clearModified,
  };
}

function toggleFolderInTree(nodes: FileNode[], path: string): FileNode[] {
  return nodes.map((node) => {
    if (node.path === path && node.type === 'folder') {
      return { ...node, expanded: !node.expanded };
    }
    if (node.children) {
      return { ...node, children: toggleFolderInTree(node.children, path) };
    }
    return node;
  });
}

// Expand all folders that are parents of the target file
function expandParentFolders(nodes: FileNode[], targetPath: string): FileNode[] {
  const normalizedTarget = targetPath.replace(/\//g, '\\').toLowerCase();

  return nodes.map((node) => {
    const normalizedNodePath = node.path.replace(/\//g, '\\').toLowerCase();

    if (node.type === 'folder' && node.children) {
      // Check if this folder is a parent of the target
      const isParentOfTarget = normalizedTarget.startsWith(normalizedNodePath + '\\');

      // Recursively process children
      const updatedChildren = expandParentFolders(node.children, targetPath);

      if (isParentOfTarget) {
        return { ...node, expanded: true, children: updatedChildren };
      }

      // Check if children changed
      if (updatedChildren !== node.children) {
        return { ...node, children: updatedChildren };
      }
    }

    return node;
  });
}

function markModifiedInTree(nodes: FileNode[], modifiedFiles: Set<string>): FileNode[] {
  return nodes.map((node) => {
    const isModified = modifiedFiles.has(node.path);
    const children = node.children
      ? markModifiedInTree(node.children, modifiedFiles)
      : undefined;

    if (isModified !== node.isModified || children !== node.children) {
      return { ...node, isModified, children };
    }
    return node;
  });
}

// Build a map of path -> expanded state from existing tree
function buildExpandedStateMap(nodes: FileNode[], map: Map<string, boolean> = new Map()): Map<string, boolean> {
  for (const node of nodes) {
    if (node.type === 'folder') {
      map.set(node.path, node.expanded ?? false);
      if (node.children) {
        buildExpandedStateMap(node.children, map);
      }
    }
  }
  return map;
}

// Merge new tree with expanded state from previous tree
function mergeTreeWithExpandedState(newTree: FileNode[], prevTree: FileNode[]): FileNode[] {
  const expandedMap = buildExpandedStateMap(prevTree);

  function applyExpandedState(nodes: FileNode[]): FileNode[] {
    return nodes.map((node) => {
      if (node.type === 'folder') {
        const wasExpanded = expandedMap.get(node.path);
        const children = node.children ? applyExpandedState(node.children) : undefined;
        return {
          ...node,
          expanded: wasExpanded ?? false,
          children,
        };
      }
      return node;
    });
  }

  return applyExpandedState(newTree);
}
