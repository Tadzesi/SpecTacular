import * as vscode from 'vscode';
import { buildFileTree, readFileContent, FileNode } from './fileOperations';

export class DashboardViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'spectacular.dashboardView';

  private _view?: vscode.WebviewView;
  private _rootPath: string | undefined;
  private _fileWatcher: vscode.FileSystemWatcher | undefined;

  constructor(private readonly _extensionUri: vscode.Uri) {
    // Set initial root path from workspace
    this._rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'webview', 'dist'),
        ...(vscode.workspace.workspaceFolders?.map(f => f.uri) || [])
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(message => this._handleMessage(message));

    // Listen for theme changes
    vscode.window.onDidChangeActiveColorTheme(theme => {
      this._postMessage({
        type: 'themeChange',
        data: this._getThemeKind(theme)
      });
    });

    // Listen for workspace folder changes
    vscode.workspace.onDidChangeWorkspaceFolders(() => this._sendConfig());

    // Send initial config after webview loads
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this._sendConfig();
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

  private _sendConfig() {
    this._postMessage({
      type: 'config',
      data: {
        rootPath: this._rootPath,
        isWatching: !!this._fileWatcher,
        theme: this._getThemeKind(vscode.window.activeColorTheme),
        workspaceFolders: vscode.workspace.workspaceFolders?.map(f => ({
          name: f.name,
          path: f.uri.fsPath
        })) || []
      }
    });
  }

  private _getThemeKind(theme: vscode.ColorTheme): 'dark' | 'light' {
    return theme.kind === vscode.ColorThemeKind.Dark ||
           theme.kind === vscode.ColorThemeKind.HighContrastDark
      ? 'dark'
      : 'light';
  }

  private _postMessage(message: { type: string; data?: unknown }) {
    this._view?.webview.postMessage(message);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
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
      #root {
        height: 100vh;
        overflow: hidden;
      }
    </style>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
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
