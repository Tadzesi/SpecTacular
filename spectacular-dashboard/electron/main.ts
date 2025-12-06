import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { FileWatcher } from './fileWatcher';

// Fix GPU cache errors on Windows
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

let mainWindow: BrowserWindow | null = null;
let fileWatcher: FileWatcher | null = null;

const DEFAULT_SPECS_PATH = path.join(process.cwd(), '..', '..', 'specs');

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  lastModified?: number;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    fileWatcher?.stop();
  });

  // Handle mouse back/forward buttons
  mainWindow.webContents.on('before-input-event', (_event, input) => {
    // Mouse button 3 = back, mouse button 4 = forward (0-indexed, so 3 and 4)
    if (input.type === 'mouseDown') {
      if (input.button === 'back') {
        mainWindow?.webContents.send('navigate-back');
      } else if (input.button === 'forward') {
        mainWindow?.webContents.send('navigate-forward');
      }
    }
  });
}

function buildFileTree(dirPath: string, rootPath: string): FileNode[] {
  const items: FileNode[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);

      if (entry.isDirectory()) {
        const children = buildFileTree(fullPath, rootPath);
        items.push({
          name: entry.name,
          path: fullPath,
          type: 'folder',
          children,
        });
      } else if (entry.name.endsWith('.md')) {
        const stats = fs.statSync(fullPath);
        items.push({
          name: entry.name,
          path: fullPath,
          type: 'file',
          lastModified: stats.mtimeMs,
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  items.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return items;
}

ipcMain.handle('get-file-tree', async (_event, rootPath: string): Promise<FileNode[]> => {
  const targetPath = rootPath || DEFAULT_SPECS_PATH;

  if (!fs.existsSync(targetPath)) {
    return [];
  }

  return buildFileTree(targetPath, targetPath);
});

ipcMain.handle('read-file', async (_event, filePath: string): Promise<string> => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
});

ipcMain.handle('select-directory', async (): Promise<string | null> => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Specs Directory',
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('get-config', async () => {
  return {
    rootPath: DEFAULT_SPECS_PATH,
    watchEnabled: fileWatcher?.isWatching() ?? false,
  };
});

ipcMain.on('start-watching', (_event, rootPath: string) => {
  if (fileWatcher) {
    fileWatcher.stop();
  }

  fileWatcher = new FileWatcher(rootPath, (event) => {
    mainWindow?.webContents.send('file-change', event);
  });

  fileWatcher.start();
});

ipcMain.on('stop-watching', () => {
  fileWatcher?.stop();
});

ipcMain.on('set-watching', (_event, enabled: boolean) => {
  if (enabled) {
    fileWatcher?.start();
  } else {
    fileWatcher?.pause();
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  fileWatcher?.stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
