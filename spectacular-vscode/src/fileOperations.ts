import * as vscode from 'vscode';
import * as path from 'path';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
  lastModified?: number;
}

/**
 * Builds a hierarchical file tree from a root directory
 * Filters to only include markdown files and directories
 */
export async function buildFileTree(rootPath: string): Promise<FileNode[]> {
  const rootUri = vscode.Uri.file(rootPath);
  return buildTreeRecursive(rootUri, rootPath);
}

async function buildTreeRecursive(uri: vscode.Uri, rootPath: string): Promise<FileNode[]> {
  const entries = await vscode.workspace.fs.readDirectory(uri);
  const nodes: FileNode[] = [];

  // Sort entries: folders first, then alphabetically
  entries.sort((a, b) => {
    if (a[1] === vscode.FileType.Directory && b[1] !== vscode.FileType.Directory) {
      return -1;
    }
    if (a[1] !== vscode.FileType.Directory && b[1] === vscode.FileType.Directory) {
      return 1;
    }
    return a[0].localeCompare(b[0]);
  });

  for (const [name, fileType] of entries) {
    // Skip node_modules and other common non-relevant directories
    if (name === 'node_modules' || name === 'dist' || name === 'build' || name === 'out') {
      continue;
    }

    // Skip hidden files/directories EXCEPT .claude and .spectacular
    if (name.startsWith('.') && name !== '.claude' && name !== '.spectacular') {
      continue;
    }

    const entryUri = vscode.Uri.joinPath(uri, name);
    const entryPath = entryUri.fsPath;

    if (fileType === vscode.FileType.Directory) {
      // Recursively get children
      const children = await buildTreeRecursive(entryUri, rootPath);

      // Only include directories that contain markdown files (directly or nested)
      if (hasMarkdownFiles(children)) {
        nodes.push({
          name,
          path: entryPath,
          type: 'folder',
          expanded: false,
          children
        });
      }
    } else if (fileType === vscode.FileType.File && isMarkdownFile(name)) {
      // Get file stats for last modified time
      let lastModified: number | undefined;
      try {
        const stat = await vscode.workspace.fs.stat(entryUri);
        lastModified = stat.mtime;
      } catch {
        // Ignore stat errors
      }

      nodes.push({
        name,
        path: entryPath,
        type: 'file',
        lastModified
      });
    }
  }

  return nodes;
}

/**
 * Checks if a file is a markdown file by extension
 */
function isMarkdownFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ext === '.md' || ext === '.markdown';
}

/**
 * Checks if a tree node array contains any markdown files (directly or nested)
 */
function hasMarkdownFiles(nodes: FileNode[]): boolean {
  for (const node of nodes) {
    if (node.type === 'file') {
      return true;
    }
    if (node.type === 'folder' && node.children && hasMarkdownFiles(node.children)) {
      return true;
    }
  }
  return false;
}

/**
 * Reads the content of a file
 */
export async function readFileContent(filePath: string): Promise<string> {
  const uri = vscode.Uri.file(filePath);
  const content = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(content).toString('utf8');
}

/**
 * Gets file stats
 */
export async function getFileStat(filePath: string): Promise<vscode.FileStat> {
  const uri = vscode.Uri.file(filePath);
  return vscode.workspace.fs.stat(uri);
}

/**
 * Normalizes a file path (converts backslashes to forward slashes)
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Gets the relative path from root to a file
 */
export function getRelativePath(filePath: string, rootPath: string): string {
  const normalizedFile = normalizePath(filePath);
  const normalizedRoot = normalizePath(rootPath);

  if (normalizedFile.startsWith(normalizedRoot)) {
    return normalizedFile.slice(normalizedRoot.length).replace(/^\//, '');
  }

  return normalizedFile;
}
