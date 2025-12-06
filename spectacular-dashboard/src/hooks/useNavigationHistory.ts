import { useState, useCallback } from 'react';

interface UseNavigationHistoryReturn {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => string | null;
  goForward: () => string | null;
  pushHistory: (path: string) => void;
  currentPath: string | null;
}

export function useNavigationHistory(): UseNavigationHistoryReturn {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;
  const currentPath = currentIndex >= 0 ? history[currentIndex] : null;

  const pushHistory = useCallback((path: string) => {
    setHistory((prev) => {
      // If we're not at the end, truncate forward history
      const newHistory = prev.slice(0, currentIndex + 1);

      // Don't add duplicate consecutive entries
      if (newHistory[newHistory.length - 1] === path) {
        return newHistory;
      }

      return [...newHistory, path];
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const goBack = useCallback((): string | null => {
    if (!canGoBack) return null;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canGoBack, currentIndex, history]);

  const goForward = useCallback((): string | null => {
    if (!canGoForward) return null;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canGoForward, currentIndex, history]);

  return {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    pushHistory,
    currentPath,
  };
}
