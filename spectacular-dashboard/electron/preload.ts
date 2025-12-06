import { contextBridge, ipcRenderer } from 'electron';

interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  timestamp: number;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getFileTree: (rootPath: string) => ipcRenderer.invoke('get-file-tree', rootPath),

  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),

  selectDirectory: () => ipcRenderer.invoke('select-directory'),

  getConfig: () => ipcRenderer.invoke('get-config'),

  onFileChange: (callback: (event: FileChangeEvent) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: FileChangeEvent) => {
      callback(data);
    };
    ipcRenderer.on('file-change', handler);
    return () => {
      ipcRenderer.removeListener('file-change', handler);
    };
  },

  startWatching: (rootPath: string) => {
    ipcRenderer.send('start-watching', rootPath);
  },

  stopWatching: () => {
    ipcRenderer.send('stop-watching');
  },

  setWatching: (enabled: boolean) => {
    ipcRenderer.send('set-watching', enabled);
  },

  onNavigateBack: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('navigate-back', handler);
    return () => {
      ipcRenderer.removeListener('navigate-back', handler);
    };
  },

  onNavigateForward: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('navigate-forward', handler);
    return () => {
      ipcRenderer.removeListener('navigate-forward', handler);
    };
  },
});
