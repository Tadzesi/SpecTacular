/**
 * VS Code WebView API Bridge
 * Replaces Electron's IPC communication with VS Code's message passing
 */

interface VsCodeAPI {
  postMessage(message: unknown): void;
  getState<T>(): T | undefined;
  setState<T>(state: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageListener = (data: any) => void;

declare function acquireVsCodeApi(): VsCodeAPI;

class VSCodeBridge {
  private static instance: VSCodeBridge;
  private vscode: VsCodeAPI;
  private listeners: Map<string, Set<MessageListener>> = new Map();
  private pendingCallbacks: Map<string, (data: unknown) => void> = new Map();

  private constructor() {
    // Acquire VS Code API (only available in webview context)
    this.vscode = acquireVsCodeApi();

    // Listen for messages from the extension
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message && typeof message.type === 'string') {
        this.handleMessage(message.type, message.data);
      }
    });
  }

  public static getInstance(): VSCodeBridge {
    if (!VSCodeBridge.instance) {
      VSCodeBridge.instance = new VSCodeBridge();
    }
    return VSCodeBridge.instance;
  }

  private handleMessage(type: string, data: unknown): void {
    // Notify all listeners for this message type
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(data));
    }

    // Handle pending callbacks (for request/response patterns)
    const callback = this.pendingCallbacks.get(type);
    if (callback) {
      callback(data);
      this.pendingCallbacks.delete(type);
    }
  }

  /**
   * Subscribe to messages of a specific type
   * Returns an unsubscribe function
   */
  public on(type: string, callback: MessageListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  /**
   * Send a one-time request and wait for response
   */
  public async request<T>(command: string, data?: Record<string, unknown>): Promise<T> {
    return new Promise((resolve) => {
      const responseType = this.getResponseType(command);
      this.pendingCallbacks.set(responseType, (response) => {
        resolve(response as T);
      });
      this.postMessage({ command, ...data });
    });
  }

  private getResponseType(command: string): string {
    // Map commands to their response types
    const responseMap: Record<string, string> = {
      'getFileTree': 'fileTree',
      'readFile': 'fileContent',
      'selectDirectory': 'folderSelected',
      'getConfig': 'config'
    };
    return responseMap[command] || command;
  }

  /**
   * Post a message to the extension
   */
  public postMessage(message: unknown): void {
    this.vscode.postMessage(message);
  }

  /**
   * Request file tree for a root path
   */
  public getFileTree(rootPath: string): void {
    this.postMessage({ command: 'getFileTree', rootPath });
  }

  /**
   * Request file content
   */
  public readFile(path: string): void {
    this.postMessage({ command: 'readFile', path });
  }

  /**
   * Start watching a directory for changes
   */
  public startWatching(rootPath: string): void {
    this.postMessage({ command: 'startWatching', rootPath });
  }

  /**
   * Stop watching for file changes
   */
  public stopWatching(): void {
    this.postMessage({ command: 'stopWatching' });
  }

  /**
   * Toggle watching state
   */
  public setWatching(enabled: boolean): void {
    this.postMessage({ command: 'setWatching', enabled });
  }

  /**
   * Request directory selection dialog
   */
  public selectDirectory(): void {
    this.postMessage({ command: 'selectDirectory' });
  }

  /**
   * Open URL in external browser
   */
  public openExternal(url: string): void {
    this.postMessage({ command: 'openExternal', url });
  }

  /**
   * Copy text to clipboard
   */
  public copyToClipboard(text: string): void {
    this.postMessage({ command: 'copyToClipboard', text });
  }

  /**
   * Reveal file in specs tree view
   */
  public revealInTree(path: string): void {
    this.postMessage({ command: 'revealInTree', path });
  }

  /**
   * Signal that webview is ready
   */
  public ready(): void {
    this.postMessage({ command: 'ready' });
  }

  /**
   * Get persisted state
   */
  public getState<T>(): T | undefined {
    return this.vscode.getState<T>();
  }

  /**
   * Persist state
   */
  public setState<T>(state: T): void {
    this.vscode.setState(state);
  }
}

// Export singleton instance
export const vscodeApi = VSCodeBridge.getInstance();

// Export types for consumers
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
  lastModified?: number;
  isModified?: boolean;
}

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  timestamp: number;
}

export interface AppConfig {
  rootPath?: string;
  isWatching: boolean;
  theme: 'dark' | 'light';
  workspaceFolders: Array<{ name: string; path: string }>;
}

export interface FileContentResponse {
  path: string;
  content: string;
}
