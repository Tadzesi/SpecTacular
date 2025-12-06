import { useEffect, useCallback, useState } from 'react';
import type { FileChangeEvent } from '../types';

interface UseFileWatcherOptions {
  rootPath: string;
  onFileChange: (event: FileChangeEvent) => void;
  enabled?: boolean;
}

interface UseFileWatcherReturn {
  isWatching: boolean;
  startWatching: () => void;
  stopWatching: () => void;
  toggleWatching: () => void;
}

export function useFileWatcher({
  rootPath,
  onFileChange,
  enabled = true,
}: UseFileWatcherOptions): UseFileWatcherReturn {
  const [isWatching, setIsWatching] = useState(false);

  const startWatching = useCallback(() => {
    if (!rootPath) return;
    window.electronAPI.startWatching(rootPath);
    setIsWatching(true);
  }, [rootPath]);

  const stopWatching = useCallback(() => {
    window.electronAPI.stopWatching();
    setIsWatching(false);
  }, []);

  const toggleWatching = useCallback(() => {
    if (isWatching) {
      window.electronAPI.setWatching(false);
      setIsWatching(false);
    } else {
      window.electronAPI.setWatching(true);
      setIsWatching(true);
    }
  }, [isWatching]);

  useEffect(() => {
    if (!enabled || !rootPath) return;

    const unsubscribe = window.electronAPI.onFileChange(onFileChange);
    startWatching();

    return () => {
      unsubscribe();
      stopWatching();
    };
  }, [enabled, rootPath, onFileChange, startWatching, stopWatching]);

  return {
    isWatching,
    startWatching,
    stopWatching,
    toggleWatching,
  };
}
