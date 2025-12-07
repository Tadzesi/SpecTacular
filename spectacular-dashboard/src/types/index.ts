export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
  lastModified?: number;
  isModified?: boolean;
}

export interface AppState {
  fileTree: FileNode[];
  selectedFile: string | null;
  fileContent: string;
  modifiedFiles: Set<string>;
  isWatching: boolean;
  lastScanTime: Date | null;
  isLoading: boolean;
  error: string | null;
}

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  timestamp: number;
}

export interface AppConfig {
  rootPath: string;
  watchEnabled: boolean;
}

export interface ElectronAPI {
  getFileTree: (rootPath: string) => Promise<FileNode[]>;
  readFile: (filePath: string) => Promise<string>;
  onFileChange: (callback: (event: FileChangeEvent) => void) => () => void;
  setWatching: (enabled: boolean) => void;
  startWatching: (rootPath: string) => void;
  stopWatching: () => void;
  getConfig: () => Promise<AppConfig>;
  selectDirectory: () => Promise<string | null>;
  onNavigateBack: (callback: () => void) => () => void;
  onNavigateForward: (callback: () => void) => () => void;
  onFolderSelected: (callback: (path: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
