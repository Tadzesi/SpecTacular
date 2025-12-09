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
