import { useState, useCallback, useEffect } from 'react';
import { vscodeApi } from '../vscodeApi';

interface UseFileWatcherReturn {
  isWatching: boolean;
  startWatching: (rootPath: string) => void;
  stopWatching: () => void;
  toggleWatching: () => void;
}

export function useFileWatcher(_rootPath: string | null): UseFileWatcherReturn {
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    const unsubStarted = vscodeApi.on('watchingStarted', () => {
      setIsWatching(true);
    });

    const unsubStopped = vscodeApi.on('watchingStopped', () => {
      setIsWatching(false);
    });

    const unsubConfig = vscodeApi.on('config', (config: { isWatching?: boolean }) => {
      if (typeof config.isWatching === 'boolean') {
        setIsWatching(config.isWatching);
      }
    });

    return () => {
      unsubStarted();
      unsubStopped();
      unsubConfig();
    };
  }, []);

  const startWatching = useCallback((path: string) => {
    vscodeApi.startWatching(path);
  }, []);

  const stopWatching = useCallback(() => {
    vscodeApi.stopWatching();
  }, []);

  const toggleWatching = useCallback(() => {
    vscodeApi.setWatching(!isWatching);
  }, [isWatching]);

  return {
    isWatching,
    startWatching,
    stopWatching,
    toggleWatching,
  };
}
