import * as vscode from 'vscode';
import * as path from 'path';
import { DashboardPanel } from './DashboardPanel';
import { SpecsTreeProvider, TreeItem } from './SpecsTreeProvider';
import { SpecsFileDecorationProvider } from './FileDecorationProvider';
import { TaskStatusService } from './TaskStatusService';
import { VersionCheckService } from './VersionCheckService';

let specsTreeProvider: SpecsTreeProvider;
let fileDecorationProvider: SpecsFileDecorationProvider;
let specsTreeView: vscode.TreeView<TreeItem>;
let taskStatusService: TaskStatusService;
let versionCheckService: VersionCheckService;

export function activate(context: vscode.ExtensionContext) {
  console.log('SpecTacular Dashboard extension is now active');

  // Initialize providers
  specsTreeProvider = new SpecsTreeProvider();
  fileDecorationProvider = new SpecsFileDecorationProvider();
  taskStatusService = TaskStatusService.getInstance();
  versionCheckService = VersionCheckService.getInstance();

  // Check for updates asynchronously (don't block activation)
  versionCheckService.checkForUpdates().then(() => {
    // Show notification if update is available (one-time per session)
    versionCheckService.showUpdateNotificationIfNeeded();
  });

  // Register the tree view for specs files
  specsTreeView = vscode.window.createTreeView('spectacular.specsTree', {
    treeDataProvider: specsTreeProvider,
    showCollapseAll: true
  });
  context.subscriptions.push(specsTreeView);

  // Register file decoration provider
  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(fileDecorationProvider)
  );

  // Register command to open dashboard in editor panel
  const openDashboard = vscode.commands.registerCommand(
    'spectacular.openDashboard',
    async (uri?: vscode.Uri) => {
      const rootPath = uri?.fsPath ?? await getWorkspaceRoot();
      DashboardPanel.createOrShow(context.extensionUri, rootPath);
    }
  );

  // Register command to open dashboard to side
  const openDashboardToSide = vscode.commands.registerCommand(
    'spectacular.openDashboardToSide',
    async () => {
      const rootPath = await getWorkspaceRoot();
      DashboardPanel.createOrShow(context.extensionUri, rootPath, vscode.ViewColumn.Beside);
    }
  );

  // Register command to open a spec file (from tree view)
  const openSpecFile = vscode.commands.registerCommand(
    'spectacular.openSpecFile',
    async (uri: vscode.Uri) => {
      // Open the file in VS Code editor
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document, { preview: false, preserveFocus: false });

      // Ensure dashboard panel is open and show the file
      const rootPath = await getWorkspaceRoot();
      DashboardPanel.createOrShow(context.extensionUri, rootPath);
      DashboardPanel.currentPanel?.showFile(uri.fsPath);
    }
  );

  // Register command to refresh the tree
  const refreshTree = vscode.commands.registerCommand(
    'spectacular.refreshTree',
    () => {
      specsTreeProvider.refresh();
    }
  );

  // Register command to reveal specs in explorer
  const revealSpecs = vscode.commands.registerCommand(
    'spectacular.revealSpecs',
    async () => {
      const specsRoot = specsTreeProvider.getSpecsRoot();
      if (specsRoot) {
        await vscode.commands.executeCommand('revealInExplorer', specsRoot);
      }
    }
  );

  // Register command to reveal a file in the specs tree (called from webview)
  const revealInTree = vscode.commands.registerCommand(
    'spectacular.revealInTree',
    async (filePath: string) => {
      await revealFileInTree(filePath);
    }
  );

  // Register command to copy text to clipboard (used by tree welcome items)
  const copyToClipboard = vscode.commands.registerCommand(
    'spectacular.copyToClipboard',
    async (text: string) => {
      await vscode.env.clipboard.writeText(text);
      vscode.window.showInformationMessage(`Copied to clipboard: ${text}`);
    }
  );

  context.subscriptions.push(
    openDashboard,
    openDashboardToSide,
    openSpecFile,
    refreshTree,
    revealSpecs,
    revealInTree,
    copyToClipboard
  );

  // Listen for active editor changes to auto-preview markdown files in specs folders
  const editorChangeDisposable = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    if (!editor) return;

    const document = editor.document;
    const filePath = document.uri.fsPath;

    // Check if it's a markdown file
    if (!isMarkdownFile(filePath)) return;

    // Check if it's in specs or .spectacular folder
    if (!isInSpecsFolder(filePath)) return;

    // If dashboard panel exists and visible, update it with the new file
    // Do NOT call reveal() - this would steal focus from the editor tab
    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel.showFile(filePath);
    }
  });
  context.subscriptions.push(editorChangeDisposable);

  // Listen for file changes to update decorations and refresh tree
  const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.md');

  // Debounce tree refresh to avoid excessive updates
  let refreshTimeout: NodeJS.Timeout | undefined;
  const debouncedRefresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(() => {
      specsTreeProvider.refresh();
    }, 300);
  };

  fileWatcher.onDidChange(async (uri) => {
    if (isInSpecsFolder(uri.fsPath)) {
      fileDecorationProvider.markModified(uri);
      // Also notify dashboard panel of file change
      DashboardPanel.currentPanel?.notifyFileChange(uri.fsPath);

      // Process task file status changes
      if (taskStatusService.isTaskFile(uri.fsPath)) {
        await taskStatusService.processTaskFileChange(uri.fsPath);
      }
    }
  });

  fileWatcher.onDidCreate((uri) => {
    if (isInSpecsFolder(uri.fsPath)) {
      debouncedRefresh();
    }
  });

  fileWatcher.onDidDelete((uri) => {
    if (isInSpecsFolder(uri.fsPath)) {
      debouncedRefresh();
      fileDecorationProvider.clearModified(uri);
    }
  });

  context.subscriptions.push(fileWatcher);

  // Also watch for folder changes (for when folders are added/removed)
  const folderWatcher = vscode.workspace.createFileSystemWatcher('**/specs/**');
  folderWatcher.onDidCreate(() => debouncedRefresh());
  folderWatcher.onDidDelete(() => debouncedRefresh());
  context.subscriptions.push(folderWatcher);

  const spectacularFolderWatcher = vscode.workspace.createFileSystemWatcher('**/.spectacular/**');
  spectacularFolderWatcher.onDidCreate(() => debouncedRefresh());
  spectacularFolderWatcher.onDidDelete(() => debouncedRefresh());
  context.subscriptions.push(spectacularFolderWatcher);

  // Listen for document saves to clear modified decoration and process task status
  vscode.workspace.onDidSaveTextDocument(async (document) => {
    fileDecorationProvider.clearModified(document.uri);

    // Process task file status changes on save
    if (isInSpecsFolder(document.uri.fsPath) &&
        taskStatusService.isTaskFile(document.uri.fsPath)) {
      await taskStatusService.processTaskFileChange(document.uri.fsPath);
    }
  });

  // Auto-reveal specs folder on startup
  autoRevealSpecsFolder();

  // Auto-open if configured
  const config = vscode.workspace.getConfiguration('spectacular');
  if (config.get<boolean>('autoOpenOnStartup')) {
    checkAndAutoOpen(context);
  }
}

export function deactivate() {
  DashboardPanel.dispose();
  taskStatusService?.dispose();
}

function isMarkdownFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.md' || ext === '.markdown';
}

function isInSpecsFolder(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
  return normalizedPath.includes('/specs/') || normalizedPath.includes('/.spectacular/');
}

async function autoRevealSpecsFolder(): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  for (const folder of workspaceFolders) {
    // Try specs folder first
    const specsUri = vscode.Uri.joinPath(folder.uri, 'specs');
    try {
      await vscode.workspace.fs.stat(specsUri);
      // Small delay to let VS Code fully initialize
      setTimeout(() => {
        vscode.commands.executeCommand('revealInExplorer', specsUri);
      }, 500);
      return;
    } catch {
      // Try .spectacular
    }

    const spectacularUri = vscode.Uri.joinPath(folder.uri, '.spectacular');
    try {
      await vscode.workspace.fs.stat(spectacularUri);
      setTimeout(() => {
        vscode.commands.executeCommand('revealInExplorer', spectacularUri);
      }, 500);
      return;
    } catch {
      // Folder doesn't exist
    }
  }
}

async function getWorkspaceRoot(): Promise<string | undefined> {
  const config = vscode.workspace.getConfiguration('spectacular');
  const defaultFolder = config.get<string>('defaultRootFolder');

  // If user specified a default folder, use it
  if (defaultFolder && vscode.workspace.workspaceFolders?.[0]) {
    return vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, defaultFolder).fsPath;
  }

  if (vscode.workspace.workspaceFolders?.[0]) {
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri;

    // Try specs folder first
    const specsFolder = vscode.Uri.joinPath(workspaceRoot, 'specs');
    try {
      await vscode.workspace.fs.stat(specsFolder);
      return specsFolder.fsPath;
    } catch {
      // specs folder doesn't exist, try .spectacular
    }

    // Try .spectacular folder
    const spectacularFolder = vscode.Uri.joinPath(workspaceRoot, '.spectacular');
    try {
      await vscode.workspace.fs.stat(spectacularFolder);
      return spectacularFolder.fsPath;
    } catch {
      // .spectacular folder doesn't exist either, return workspace root
    }

    return workspaceRoot.fsPath;
  }

  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

async function checkAndAutoOpen(context: vscode.ExtensionContext): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  for (const folder of workspaceFolders) {
    const spectacularUri = vscode.Uri.joinPath(folder.uri, '.spectacular');
    try {
      await vscode.workspace.fs.stat(spectacularUri);
      // .spectacular folder exists, open dashboard
      DashboardPanel.createOrShow(context.extensionUri, folder.uri.fsPath);
      return;
    } catch {
      // Folder doesn't exist, continue checking
    }

    const specsUri = vscode.Uri.joinPath(folder.uri, 'specs');
    try {
      await vscode.workspace.fs.stat(specsUri);
      // specs folder exists, open dashboard
      DashboardPanel.createOrShow(context.extensionUri, folder.uri.fsPath);
      return;
    } catch {
      // Folder doesn't exist
    }
  }
}

// Reveal a file in the specs tree view
async function revealFileInTree(filePath: string): Promise<void> {
  if (!specsTreeView || !specsTreeProvider) return;

  try {
    const treeItem = await specsTreeProvider.findTreeItem(filePath);
    if (treeItem) {
      await specsTreeView.reveal(treeItem, { select: true, focus: false, expand: true });
    }
  } catch (error) {
    console.error('Failed to reveal file in tree:', error);
  }
}

// Export for use by DashboardPanel
export { revealFileInTree };
