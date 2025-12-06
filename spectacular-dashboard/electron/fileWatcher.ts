import chokidar, { FSWatcher } from 'chokidar';
import * as path from 'path';

interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  timestamp: number;
}

type FileChangeCallback = (event: FileChangeEvent) => void;

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private rootPath: string;
  private callback: FileChangeCallback;
  private watching: boolean = false;
  private paused: boolean = false;

  constructor(rootPath: string, callback: FileChangeCallback) {
    this.rootPath = rootPath;
    this.callback = callback;
  }

  start(): void {
    if (this.watcher) {
      this.stop();
    }

    this.watcher = chokidar.watch(this.rootPath, {
      persistent: true,
      ignoreInitial: true,
      depth: 99,
      ignored: /(^|[\/\\])\../, // Ignore dotfiles
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    this.watcher
      .on('add', (filePath) => this.handleEvent('add', filePath))
      .on('change', (filePath) => this.handleEvent('change', filePath))
      .on('unlink', (filePath) => this.handleEvent('unlink', filePath))
      .on('addDir', (filePath) => this.handleEvent('addDir', filePath))
      .on('unlinkDir', (filePath) => this.handleEvent('unlinkDir', filePath))
      .on('error', (error) => console.error('Watcher error:', error));

    this.watching = true;
    this.paused = false;
  }

  private handleEvent(type: FileChangeEvent['type'], filePath: string): void {
    if (this.paused) return;

    // Only handle markdown files and directories
    if (type !== 'addDir' && type !== 'unlinkDir' && !filePath.endsWith('.md')) {
      return;
    }

    this.callback({
      type,
      path: filePath,
      timestamp: Date.now(),
    });
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    this.watching = false;
    this.paused = false;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  isWatching(): boolean {
    return this.watching && !this.paused;
  }

  isPaused(): boolean {
    return this.paused;
  }
}
