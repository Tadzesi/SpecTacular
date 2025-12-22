import * as vscode from 'vscode';
import * as path from 'path';
import { buildFileTree, readFileContent, FileNode } from './fileOperations';
import { revealFileInTree } from './extension';
import { VersionCheckService, VersionInfo } from './VersionCheckService';

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private static readonly viewType = 'spectacularDashboard';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _rootPath: string | undefined;
  private _fileWatcher: vscode.FileSystemWatcher | undefined;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    rootPath?: string,
    column: vscode.ViewColumn = vscode.ViewColumn.One
  ) {
    // If we already have a panel, show it
    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(column);
      if (rootPath) {
        DashboardPanel.currentPanel.setRootPath(rootPath);
      }
      return;
    }

    // Create a new panel
    const panel = vscode.window.createWebviewPanel(
      DashboardPanel.viewType,
      'SpecTacular Dashboard',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'webview', 'dist'),
          ...(vscode.workspace.workspaceFolders?.map(f => f.uri) || [])
        ]
      }
    );

    DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri, rootPath);
  }

  public static dispose() {
    DashboardPanel.currentPanel?.dispose();
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    rootPath?: string
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._rootPath = rootPath;

    // Set initial HTML content
    this._panel.webview.html = this._getHtmlForWebview();

    // Handle panel disposal
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle view state changes
    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible) {
          this._sendConfig();
        }
        // When dashboard tab is clicked/becomes active, show SpecTacular sidebar
        if (this._panel.active) {
          vscode.commands.executeCommand('spectacular.specsTree.focus');
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => this._handleMessage(message),
      null,
      this._disposables
    );

    // Listen for theme changes
    vscode.window.onDidChangeActiveColorTheme(
      theme => {
        this._postMessage({
          type: 'themeChange',
          data: this._getThemeKind(theme)
        });
      },
      null,
      this._disposables
    );

    // Listen for workspace folder changes
    vscode.workspace.onDidChangeWorkspaceFolders(
      () => this._sendConfig(),
      null,
      this._disposables
    );

    // Send initial config after a short delay (wait for webview to initialize)
    setTimeout(() => this._sendConfig(), 100);
  }

  public setRootPath(rootPath: string) {
    this._rootPath = rootPath;
    this._sendConfig();
    this._startWatching(rootPath);
  }

  public showFile(filePath: string) {
    this._handleReadFile(filePath);
    this._postMessage({
      type: 'selectFile',
      data: filePath
    });
    // Also reveal in tree view
    revealFileInTree(filePath);
  }

  public reveal(preserveFocus: boolean = false) {
    this._panel.reveal(undefined, preserveFocus);
  }

  public notifyFileChange(filePath: string) {
    // Notify webview of external file change so it can refresh content
    this._postMessage({
      type: 'fileChange',
      data: {
        type: 'change',
        path: filePath,
        timestamp: Date.now()
      }
    });
  }

  private async _handleMessage(message: { command: string; [key: string]: unknown }) {
    switch (message.command) {
      case 'ready':
        this._sendConfig();
        break;

      case 'getFileTree':
        await this._handleGetFileTree(message.rootPath as string);
        break;

      case 'readFile':
        await this._handleReadFile(message.path as string);
        break;

      case 'startWatching':
        this._startWatching(message.rootPath as string);
        break;

      case 'stopWatching':
        this._stopWatching();
        break;

      case 'setWatching':
        if (message.enabled) {
          if (this._rootPath) {
            this._startWatching(this._rootPath);
          }
        } else {
          this._stopWatching();
        }
        break;

      case 'selectDirectory':
        await this._handleSelectDirectory();
        break;

      case 'openExternal':
        if (typeof message.url === 'string') {
          vscode.env.openExternal(vscode.Uri.parse(message.url));
        }
        break;

      case 'copyToClipboard':
        if (typeof message.text === 'string') {
          vscode.env.clipboard.writeText(message.text);
        }
        break;

      case 'revealInTree':
        if (typeof message.path === 'string') {
          revealFileInTree(message.path);
        }
        break;

      case 'saveFile':
        await this._handleSaveFile(message.path as string, message.content as string);
        break;

      case 'saveAllFiles':
        await this._handleSaveAllFiles(message.files as Array<{ path: string; content: string }>);
        break;
    }
  }

  private async _handleGetFileTree(rootPath: string) {
    try {
      const tree = await buildFileTree(rootPath);
      this._postMessage({ type: 'fileTree', data: tree });
    } catch (error) {
      this._postMessage({
        type: 'error',
        data: { message: `Failed to load file tree: ${error}` }
      });
    }
  }

  private async _handleReadFile(filePath: string) {
    try {
      const content = await readFileContent(filePath);
      this._postMessage({
        type: 'fileContent',
        data: { path: filePath, content }
      });
    } catch (error) {
      this._postMessage({
        type: 'error',
        data: { message: `Failed to read file: ${error}` }
      });
    }
  }

  private async _handleSaveFile(filePath: string, content: string) {
    try {
      const uri = vscode.Uri.file(filePath);
      const encoder = new TextEncoder();
      await vscode.workspace.fs.writeFile(uri, encoder.encode(content));
      this._postMessage({
        type: 'fileSaved',
        data: { path: filePath, success: true }
      });
      // Show a brief notification
      vscode.window.setStatusBarMessage(`Saved: ${path.basename(filePath)}`, 2000);
    } catch (error) {
      this._postMessage({
        type: 'fileSaveError',
        data: { path: filePath, message: `Failed to save file: ${error}` }
      });
      vscode.window.showErrorMessage(`Failed to save ${path.basename(filePath)}: ${error}`);
    }
  }

  private async _handleSaveAllFiles(files: Array<{ path: string; content: string }>) {
    const results: Array<{ path: string; success: boolean; error?: string }> = [];
    const encoder = new TextEncoder();

    for (const file of files) {
      try {
        const uri = vscode.Uri.file(file.path);
        await vscode.workspace.fs.writeFile(uri, encoder.encode(file.content));
        results.push({ path: file.path, success: true });
      } catch (error) {
        results.push({ path: file.path, success: false, error: String(error) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    this._postMessage({
      type: 'allFilesSaved',
      data: { results }
    });

    if (failCount === 0) {
      vscode.window.setStatusBarMessage(`Saved ${successCount} file${successCount !== 1 ? 's' : ''}`, 2000);
    } else {
      vscode.window.showWarningMessage(
        `Saved ${successCount} file${successCount !== 1 ? 's' : ''}, ${failCount} failed`
      );
    }
  }

  private async _handleSelectDirectory() {
    const result = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      title: 'Select Folder for Dashboard'
    });

    if (result && result[0]) {
      const selectedPath = result[0].fsPath;
      this._rootPath = selectedPath;
      this._postMessage({
        type: 'folderSelected',
        data: selectedPath
      });
      this._startWatching(selectedPath);
    }
  }

  private _startWatching(rootPath: string) {
    this._stopWatching();
    this._rootPath = rootPath;

    const config = vscode.workspace.getConfiguration('spectacular');
    const debounceMs = config.get<number>('watchDebounceMs') ?? 300;

    // Create file system watcher for markdown files
    const pattern = new vscode.RelativePattern(rootPath, '**/*.md');
    this._fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);

    let debounceTimer: NodeJS.Timeout | undefined;

    const notifyChange = (type: string, uri: vscode.Uri) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        this._postMessage({
          type: 'fileChange',
          data: {
            type,
            path: uri.fsPath,
            timestamp: Date.now()
          }
        });
      }, debounceMs);
    };

    this._fileWatcher.onDidChange(uri => notifyChange('change', uri));
    this._fileWatcher.onDidCreate(uri => notifyChange('add', uri));
    this._fileWatcher.onDidDelete(uri => notifyChange('unlink', uri));

    this._postMessage({ type: 'watchingStarted', data: rootPath });
  }

  private _stopWatching() {
    if (this._fileWatcher) {
      this._fileWatcher.dispose();
      this._fileWatcher = undefined;
      this._postMessage({ type: 'watchingStopped' });
    }
  }

  private async _sendConfig() {
    const versionService = VersionCheckService.getInstance();
    const versionInfo = versionService.getVersionInfo() || {
      currentVersion: versionService.getCurrentVersion(),
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: 'https://github.com/Tadzesi/SpecTacular/releases'
    };

    this._postMessage({
      type: 'config',
      data: {
        rootPath: this._rootPath,
        isWatching: !!this._fileWatcher,
        theme: this._getThemeKind(vscode.window.activeColorTheme),
        workspaceFolders: vscode.workspace.workspaceFolders?.map(f => ({
          name: f.name,
          path: f.uri.fsPath
        })) || [],
        versionInfo
      }
    });
  }

  private _getThemeKind(theme: vscode.ColorTheme): 'dark' | 'light' {
    return theme.kind === vscode.ColorThemeKind.Dark ||
           theme.kind === vscode.ColorThemeKind.HighContrast
      ? 'dark'
      : 'light';
  }

  private _postMessage(message: { type: string; data?: unknown }) {
    this._panel.webview.postMessage(message);
  }

  private _getHtmlForWebview(): string {
    const webview = this._panel.webview;

    // Get paths to webview resources
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'dist', 'assets', 'index.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'dist', 'assets', 'style.css')
    );

    const nonce = getNonce();
    const cspSource = webview.cspSource;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'none';
      style-src ${cspSource} 'unsafe-inline';
      script-src 'nonce-${nonce}';
      font-src ${cspSource};
      img-src ${cspSource} data: https:;
    ">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>SpecTacular Dashboard</title>
    <style>
      :root {
        --vscode-font-family: var(--vscode-editor-font-family, 'Segoe UI', sans-serif);
        --vscode-font-size: var(--vscode-editor-font-size, 14px);
      }
      body {
        margin: 0;
        padding: 0;
        background: var(--vscode-editor-background);
        color: var(--vscode-editor-foreground);
        font-family: var(--vscode-font-family);
        font-size: var(--vscode-font-size);
      }
    </style>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  public dispose() {
    DashboardPanel.currentPanel = undefined;

    this._stopWatching();
    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
