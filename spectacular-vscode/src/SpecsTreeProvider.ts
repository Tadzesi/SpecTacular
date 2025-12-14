import * as vscode from 'vscode';
import * as path from 'path';

export type TreeItem = SpecsTreeItem | WelcomeTreeItem;

export class SpecsTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private workspaceRoot: string | undefined;
  private specsRoot: vscode.Uri | undefined;
  private itemCache: Map<string, SpecsTreeItem> = new Map();

  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    this._findSpecsRoot();
  }

  private async _findSpecsRoot(): Promise<void> {
    if (!this.workspaceRoot) return;

    const workspaceUri = vscode.Uri.file(this.workspaceRoot);

    // Try specs folder first
    const specsFolder = vscode.Uri.joinPath(workspaceUri, 'specs');
    try {
      await vscode.workspace.fs.stat(specsFolder);
      this.specsRoot = specsFolder;
      this._onDidChangeTreeData.fire();
      return;
    } catch {
      // specs folder doesn't exist
    }

    // Try .spectacular folder
    const spectacularFolder = vscode.Uri.joinPath(workspaceUri, '.spectacular');
    try {
      await vscode.workspace.fs.stat(spectacularFolder);
      this.specsRoot = spectacularFolder;
      this._onDidChangeTreeData.fire();
      return;
    } catch {
      // .spectacular folder doesn't exist either
    }

    this.specsRoot = undefined;
  }

  refresh(): void {
    this.itemCache.clear();
    this._findSpecsRoot();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  // Normalize path for comparison: lowercase and forward slashes
  private _normalizePath(p: string): string {
    return p.replace(/\\/g, '/').toLowerCase();
  }

  // Required for reveal() to work with nested items
  getParent(element: TreeItem): TreeItem | undefined {
    // WelcomeTreeItem has no parent
    if (element instanceof WelcomeTreeItem) {
      return undefined;
    }

    const parentPath = path.dirname(element.resourceUri.fsPath);
    const normalizedParentPath = this._normalizePath(parentPath);
    const normalizedSpecsRoot = this.specsRoot ? this._normalizePath(this.specsRoot.fsPath) : '';

    // If parent is specs root, return undefined (top level)
    if (normalizedParentPath === normalizedSpecsRoot) {
      return undefined;
    }

    // Return cached parent item
    return this.itemCache.get(normalizedParentPath);
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    // WelcomeTreeItem has no children
    if (element instanceof WelcomeTreeItem) {
      return [];
    }
    if (!this.specsRoot) {
      return [];
    }

    // If requesting root level children, check if folder is empty
    if (!element) {
      const hasContent = await this._containsMarkdown(this.specsRoot);
      if (!hasContent) {
        // Return welcome placeholder items
        return [
          new WelcomeTreeItem(
            '$(info) No specs found',
            'Run "spectacular init" to scaffold your first spec'
          ),
          new WelcomeTreeItem(
            '$(terminal) spectacular init',
            'Click to copy command to clipboard',
            {
              command: 'spectacular.copyToClipboard',
              title: 'Copy command',
              arguments: ['spectacular init']
            }
          )
        ];
      }
    }

    const targetUri = element ? element.resourceUri : this.specsRoot;
    if (!targetUri) return [];

    try {
      const entries = await vscode.workspace.fs.readDirectory(targetUri);
      const items: SpecsTreeItem[] = [];

      // Sort: folders first, then alphabetically
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
        // Skip hidden files except .spectacular
        if (name.startsWith('.') && name !== '.spectacular') {
          continue;
        }

        // Skip common non-relevant directories
        if (['node_modules', 'dist', 'build', 'out'].includes(name)) {
          continue;
        }

        const entryUri = vscode.Uri.joinPath(targetUri, name);

        if (fileType === vscode.FileType.Directory) {
          // Check if folder contains markdown files
          const hasMarkdown = await this._containsMarkdown(entryUri);
          if (hasMarkdown) {
            const item = new SpecsTreeItem(
              name,
              vscode.TreeItemCollapsibleState.Collapsed,
              entryUri,
              true
            );
            // Cache for getParent lookup
            this.itemCache.set(this._normalizePath(entryUri.fsPath), item);
            items.push(item);
          }
        } else if (fileType === vscode.FileType.File && this._isMarkdownFile(name)) {
          const item = new SpecsTreeItem(
            name,
            vscode.TreeItemCollapsibleState.None,
            entryUri,
            false
          );
          // Cache for getParent lookup
          this.itemCache.set(this._normalizePath(entryUri.fsPath), item);
          items.push(item);
        }
      }

      return items;
    } catch {
      return [];
    }
  }

  private _isMarkdownFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ext === '.md' || ext === '.markdown';
  }

  private async _containsMarkdown(folderUri: vscode.Uri): Promise<boolean> {
    try {
      const entries = await vscode.workspace.fs.readDirectory(folderUri);
      for (const [name, fileType] of entries) {
        if (fileType === vscode.FileType.File && this._isMarkdownFile(name)) {
          return true;
        }
        if (fileType === vscode.FileType.Directory && !name.startsWith('.')) {
          const subUri = vscode.Uri.joinPath(folderUri, name);
          if (await this._containsMarkdown(subUri)) {
            return true;
          }
        }
      }
    } catch {
      // Ignore errors
    }
    return false;
  }

  getSpecsRoot(): vscode.Uri | undefined {
    return this.specsRoot;
  }

  // Find a tree item by file path for revealing in tree
  async findTreeItem(filePath: string): Promise<SpecsTreeItem | undefined> {
    const normalizedPath = this._normalizePath(filePath);
    return this._findItemRecursive(normalizedPath, undefined);
  }

  private async _findItemRecursive(normalizedFilePath: string, parent?: SpecsTreeItem): Promise<SpecsTreeItem | undefined> {
    const children = await this.getChildren(parent);
    for (const child of children) {
      // Skip WelcomeTreeItem - only process SpecsTreeItem
      if (child instanceof WelcomeTreeItem) {
        continue;
      }
      const childPath = this._normalizePath(child.resourceUri.fsPath);
      if (childPath === normalizedFilePath) {
        return child;
      }
      if (child.isFolder) {
        // Only recurse if the target path starts with this folder's path
        if (normalizedFilePath.startsWith(childPath + '/')) {
          const found = await this._findItemRecursive(normalizedFilePath, child);
          if (found) return found;
        }
      }
    }
    return undefined;
  }
}

export class SpecsTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly resourceUri: vscode.Uri,
    public readonly isFolder: boolean
  ) {
    super(label, collapsibleState);

    this.resourceUri = resourceUri;
    this.tooltip = resourceUri.fsPath;

    if (isFolder) {
      this.contextValue = 'folder';
      this.iconPath = vscode.ThemeIcon.Folder;
    } else {
      this.contextValue = 'file';
      this.iconPath = vscode.ThemeIcon.File;
      // When clicked, preview in dashboard only (don't open in editor tab)
      this.command = {
        command: 'spectacular.previewSpecFile',
        title: 'Preview Spec File',
        arguments: [resourceUri]
      };
    }
  }
}

export class WelcomeTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    tooltip: string,
    command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip;
    this.contextValue = 'welcome';
    if (command) {
      this.command = command;
    }
  }
}
